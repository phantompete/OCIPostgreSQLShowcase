import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";

// Isolated fixtures never read the developer's .env or connect to a database.
async function startFixture(t, { envFile = "PORT=0", environment = {}, driver = false } = {}) {
  const directory = await mkdtemp(join(tmpdir(), "oci-showcase-test-"));
  let child;
  t.after(async () => {
    if (child && child.exitCode === null) {
      const stopped = once(child, "exit");
      child.kill();
      await stopped;
    }
    assert.equal(dirname(resolve(directory)), resolve(tmpdir()));
    assert.ok(basename(directory).startsWith("oci-showcase-test-"));
    await rm(directory, { recursive: true, force: true });
  });
  await copyFile(new URL("../server.mjs", import.meta.url), join(directory, "server.mjs"));
  await writeFile(join(directory, "index.html"), "<h1>Public showcase</h1>");
  await writeFile(join(directory, "app.js"), "// Public script");
  await writeFile(join(directory, ".env"), `${envFile}\n# PRIVATE_TEST_CANARY`);
  await writeFile(join(directory, "private.json"), "PRIVATE_TEST_CANARY");
  if (driver) {
    const moduleDir = join(directory, "node_modules", "pg");
    await mkdir(moduleDir, { recursive: true });
    await writeFile(join(moduleDir, "package.json"), '{"type":"module","exports":"./index.js"}');
    await writeFile(join(moduleDir, "index.js"), `
      import { writeFileSync } from 'node:fs';
      export class Pool {
        constructor(options) { writeFileSync('driver-options.json', JSON.stringify(options)); }
        async connect() { throw new Error('Controlled connection refusal'); }
        async end() {}
      }
    `);
  }
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) =>
    !/^(PG|DATABASE_URL$|PORT$|SHOWCASE_PORT$|NODE_OPTIONS$)/i.test(key)));
  child = spawn(process.execPath, ["server.mjs"], {
    cwd: directory, env: { ...env, ...environment }, windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const base = await new Promise((resolveReady, reject) => {
    const timer = setTimeout(() => reject(new Error("Server startup timed out")), 8000);
    let output = "";
    child.once("error", reject);
    child.once("exit", () => { clearTimeout(timer); reject(new Error("Server exited before ready")); });
    child.stdout.on("data", (data) => {
      output += data;
      const match = output.match(/http:\/\/127\.0\.0\.1:\d+/);
      if (match) { clearTimeout(timer); resolveReady(match[0]); }
    });
  });
  return { base, directory };
}

test("static server exposes only public assets and loads its port from .env", async (t) => {
  const { base } = await startFixture(t);
  assert.notEqual(new URL(base).port, "8787", "PORT=0 from .env must select an ephemeral port");
  assert.equal(await (await fetch(base)).text(), "<h1>Public showcase</h1>");
  assert.equal((await fetch(`${base}/app.js`)).status, 200);
  for (const path of ["/.env", "/%2eenv", "/private.json", "/server.mjs", "/.git/config", "/assets/../.env", "/assets/%2e%2e%5c.env", "/missing.js"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 404, path);
    assert.doesNotMatch(await response.text(), /PRIVATE_TEST_CANARY/);
  }
  assert.equal((await fetch(`${base}/%ZZ`)).status, 400);
  assert.equal((await fetch(base)).status, 200);
});

test("only GET and OPTIONS are accepted", async (t) => {
  const { base } = await startFixture(t);
  for (const method of ["POST", "PUT", "DELETE"]) {
    assert.equal((await fetch(`${base}/api/health`, { method })).status, 405);
  }
  assert.equal((await fetch(`${base}/api/health`, { method: "OPTIONS" })).status, 204);
});

test("all curated endpoints fail safely without database configuration", async (t) => {
  const { base } = await startFixture(t);
  for (const route of ["health", "extensions", "demo/search", "demo/workload", "demo/maintenance", "demo/spatial", "demo/crypto"]) {
    const response = await fetch(`${base}/api/${route}`);
    assert.equal(response.status, 200, route);
    const body = await response.json();
    assert.equal(body.connected ?? body.ok, false, route);
    assert.match(body.error, /DATABASE_URL/);
  }
});

for (const mode of ["require", "disable"]) {
  test(`${mode} applies the requested demo TLS mode; connection failures do not crash the server`, async (t) => {
    const { base, directory } = await startFixture(t, {
      driver: true,
      environment: { DATABASE_URL: "postgresql://demo:fake@invalid/demo", PGSSLMODE: mode },
    });
    const body = await (await fetch(`${base}/api/health`)).json();
    assert.equal(body.connected, false);
    assert.match(body.error, /Controlled connection refusal/);
    const options = JSON.parse(await readFile(join(directory, "driver-options.json"), "utf8"));
    assert.deepEqual(options.ssl, mode === "require" ? { rejectUnauthorized: false } : false);
    assert.equal((await fetch(base)).status, 200);
  });
}

test("conflicting TLS options fail closed before creating a pool", async (t) => {
  const { base, directory } = await startFixture(t, {
    driver: true,
    environment: { DATABASE_URL: "postgresql://demo:fake@invalid/demo?sslmode=no-verify", PGSSLMODE: "require" },
  });
  const body = await (await fetch(`${base}/api/health`)).json();
  assert.equal(body.connected, false);
  assert.match(body.error, /TLS setup failed/);
  await assert.rejects(readFile(join(directory, "driver-options.json")), { code: "ENOENT" });
});
