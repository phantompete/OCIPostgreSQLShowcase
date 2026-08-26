import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const port = Number(process.env.PORT || process.env.SHOWCASE_PORT || 8787);
const standoutExtensions = [
  ["pgvector", "vector"],
  ["pg_trgm", "pg_trgm"],
  ["pg_stat_statements", "pg_stat_statements"],
  ["pg_repack", "pg_repack"],
  ["PostGIS", "postgis"],
  ["pg_cron", "pg_cron"],
  ["pg_partman", "pg_partman"],
  ["pgaudit", "pgaudit"],
  ["pgcrypto", "pgcrypto"],
  ["postgres_fdw", "postgres_fdw"],
  ["pglogical", "pglogical"],
  ["pg_buffercache", "pg_buffercache"],
  ["pgstattuple", "pgstattuple"],
];

loadEnv();

let pool;
let pgLoadError;

function loadEnv() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = rest.join("=").replace(/^['"]|['"]$/g, "");
    }
  }
}

async function getPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (pool) {
    return pool;
  }

  try {
    const { Pool } = await import("pg");
    const sslMode = process.env.PGSSLMODE || process.env.PGSSL || "";
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 6,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
      ssl: sslMode.toLowerCase() === "require" ? { rejectUnauthorized: false } : undefined,
    });
    return pool;
  } catch (error) {
    pgLoadError = error;
    return null;
  }
}

async function query(sql, params = []) {
  const db = await getPool();
  if (!db) {
    return {
      ok: false,
      configured: Boolean(process.env.DATABASE_URL),
      error: pgLoadError
        ? "The pg package is not installed. Run npm install before using live database mode."
        : "DATABASE_URL is not configured. Copy .env.example to .env and set your connection string.",
    };
  }

  const client = await db.connect();
  try {
    await client.query(`
      SELECT set_config(
        'search_path',
        current_setting('search_path') || COALESCE(',' || string_agg(DISTINCT quote_ident(n.nspname), ','), ''),
        false
      )
      FROM pg_extension e
      JOIN pg_namespace n ON n.oid = e.extnamespace
      WHERE e.extname = ANY($1::text[])
    `, [["vector", "pg_trgm", "postgis", "pgcrypto", "pg_stat_statements"]]);

    const result = await client.query(sql, params);
    return { ok: true, rows: result.rows };
  } catch (error) {
    return { ok: false, error: safeDbError(error), code: error.code };
  } finally {
    client.release();
  }
}

function quoteIdent(identifier) {
  return `"${String(identifier).replace(/"/g, '""')}"`;
}

async function extensionSchemaMap(names) {
  const result = await query(
    `
      SELECT e.extname, n.nspname
      FROM pg_extension e
      JOIN pg_namespace n ON n.oid = e.extnamespace
      WHERE e.extname = ANY($1::text[])
    `,
    [names],
  );

  if (!result.ok) {
    return { ok: false, error: result.error, schemas: new Map() };
  }

  return {
    ok: true,
    schemas: new Map(result.rows.map((row) => [row.extname, row.nspname])),
  };
}

function safeDbError(error) {
  if (!error) {
    return "Unknown database error.";
  }

  return String(error.message || error)
    .replace(process.env.DATABASE_URL || "", "[DATABASE_URL]")
    .slice(0, 420);
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
  });
  res.end(body);
}

async function handleApi(req, res, url) {
  if (url.pathname === "/api/health") {
    const result = await query(`
      WITH current_database_stats AS (
        SELECT numbackends, blks_hit, blks_read, stats_reset
        FROM pg_stat_database
        WHERE datname = current_database()
      ),
      all_database_connections AS (
        SELECT COALESCE(SUM(numbackends), 0)::int AS active_connections
        FROM pg_stat_database
        WHERE datname IS NOT NULL
      ),
      top_database_connections AS (
        SELECT COALESCE(
          json_agg(json_build_object('name', datname, 'connections', numbackends) ORDER BY numbackends DESC, datname),
          '[]'::json
        ) AS top_databases
        FROM (
          SELECT datname, numbackends
          FROM pg_stat_database
          WHERE datname IS NOT NULL
          ORDER BY numbackends DESC, datname
          LIMIT 3
        ) AS ranked_databases
      )
      SELECT
        current_database() AS database,
        current_user AS user_name,
        current_setting('server_version') AS server_version,
        pg_is_in_recovery() AS is_in_recovery,
        pg_postmaster_start_time() AS started_at,
        EXTRACT(EPOCH FROM clock_timestamp() - pg_postmaster_start_time())::bigint AS uptime_seconds,
        all_database_connections.active_connections,
        current_setting('max_connections')::int AS max_connections,
        ROUND((100.0 * current_database_stats.blks_hit / NULLIF(current_database_stats.blks_hit + current_database_stats.blks_read, 0))::numeric, 1) AS cache_hit_pct,
        current_database_stats.stats_reset AS stats_reset_at,
        CASE WHEN pg_is_in_recovery() THEN pg_last_xact_replay_timestamp() END AS last_replay_at,
        top_database_connections.top_databases,
        now() AS checked_at
      FROM current_database_stats
      CROSS JOIN all_database_connections
      CROSS JOIN top_database_connections
    `);

    if (!result.ok) {
      json(res, 200, { connected: false, ...result });
      return;
    }

    json(res, 200, {
      connected: true,
      configured: true,
      ...result.rows[0],
    });
    return;
  }

  if (url.pathname === "/api/extensions") {
    const names = standoutExtensions.map(([, name]) => name);
    const result = await query(
      `
        SELECT name, default_version, installed_version, comment
        FROM pg_available_extensions
        WHERE name = ANY($1::text[])
        ORDER BY name
      `,
      [names],
    );

    if (!result.ok) {
      json(res, 200, { ok: false, extensions: [], error: result.error });
      return;
    }

    const rowsByName = new Map(result.rows.map((row) => [row.name, row]));
    json(res, 200, {
      ok: true,
      extensions: standoutExtensions.map(([label, name]) => {
        const row = rowsByName.get(name);
        return {
          label,
          name,
          available: Boolean(row),
          installed: Boolean(row?.installed_version),
          defaultVersion: row?.default_version || null,
          installedVersion: row?.installed_version || null,
          comment: row?.comment || null,
        };
      }),
    });
    return;
  }

  if (url.pathname === "/api/demo/search") {
    const scenario = url.searchParams.get("scenario") || "support";
    const phrase = url.searchParams.get("q") || "refund exception policy";
    const schemaResult = await extensionSchemaMap(["vector", "pg_trgm"]);
    const vectorSchema = schemaResult.schemas.get("vector");
    const trgmSchema = schemaResult.schemas.get("pg_trgm");

    if (!schemaResult.ok || !vectorSchema || !trgmSchema) {
      json(res, 200, {
        ok: false,
        rows: [],
        error: schemaResult.error || "The vector and pg_trgm extensions must be created before running this demo.",
      });
      return;
    }

    const vector = quoteIdent(vectorSchema);
    const trgm = quoteIdent(trgmSchema);
    const vectors = {
      support: "[0.12,0.84,0.32]",
      retail: "[0.81,0.22,0.37]",
      risk: "[0.28,0.38,0.88]",
    };

    const result = await query(
      `
        WITH query AS (
          SELECT $1::${vector}.vector AS embedding, $2::text AS phrase, $3::text AS scenario
        )
        SELECT
          c.title,
          c.scenario,
          c.outcome,
          ROUND((1 - (c.embedding OPERATOR(${vector}.<=>) q.embedding))::numeric, 3) AS vector_score,
          ROUND(${trgm}.similarity(c.title, q.phrase)::numeric, 3) AS trigram_score
        FROM oci_pg_showcase.intent_catalog c, query q
        WHERE ${trgm}.similarity(c.title, q.phrase) > 0 OR c.scenario = q.scenario
        ORDER BY c.embedding OPERATOR(${vector}.<=>) q.embedding, ${trgm}.similarity(c.title, q.phrase) DESC
        LIMIT 5
      `,
      [vectors[scenario] || vectors.support, phrase, scenario],
    );

    json(res, 200, {
      ok: result.ok,
      rows: result.rows || [],
      error: result.ok ? null : demoError(result, "Run sql/demo_schema.sql after enabling vector and pg_trgm."),
    });
    return;
  }

  if (url.pathname === "/api/demo/workload") {
    const result = await query(`
      SELECT
        LEFT(regexp_replace(query, '\\s+', ' ', 'g'), 120) AS query,
        calls,
        ROUND(total_exec_time::numeric, 1) AS total_ms,
        ROUND(mean_exec_time::numeric, 2) AS mean_ms,
        rows
      FROM pg_stat_statements
      ORDER BY total_exec_time DESC
      LIMIT 5
    `);

    json(res, 200, {
      ok: result.ok,
      rows: result.rows || [],
      error: result.ok ? null : demoError(result, "Enable pg_stat_statements in the database configuration and create the extension."),
    });
    return;
  }

  if (url.pathname === "/api/demo/maintenance") {
    const result = await query(`
      SELECT
        schemaname,
        relname,
        n_live_tup,
        n_dead_tup,
        ROUND((100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0))::numeric, 2) AS dead_pct
      FROM pg_stat_user_tables
      ORDER BY n_dead_tup DESC
      LIMIT 5
    `);

    json(res, 200, {
      ok: result.ok,
      rows: result.rows || [],
      error: result.ok ? null : result.error,
    });
    return;
  }

  if (url.pathname === "/api/demo/spatial") {
    const schemaResult = await extensionSchemaMap(["postgis"]);
    const postgisSchema = schemaResult.schemas.get("postgis");

    if (!schemaResult.ok || !postgisSchema) {
      json(res, 200, {
        ok: false,
        rows: [],
        error: schemaResult.error || "Create the PostGIS extension and run sql/demo_schema.sql before using this demo.",
      });
      return;
    }

    const postgis = quoteIdent(postgisSchema);
    const result = await query(`
      WITH customer AS (
        SELECT ${postgis}.ST_SetSRID(${postgis}.ST_MakePoint(-122.335167, 47.608013), 4326)::${postgis}.geography AS point
      )
      SELECT
        l.name,
        l.kind,
        ROUND(${postgis}.ST_X(l.geom)::numeric, 6) AS lon,
        ROUND(${postgis}.ST_Y(l.geom)::numeric, 6) AS lat,
        ROUND((${postgis}.ST_Distance(l.geom::${postgis}.geography, customer.point) / 1000)::numeric, 2) AS km
      FROM oci_pg_showcase.service_locations l, customer
      WHERE ${postgis}.ST_DWithin(l.geom::${postgis}.geography, customer.point, 60000)
      ORDER BY ${postgis}.ST_Distance(l.geom::${postgis}.geography, customer.point)
      LIMIT 5
    `);

    json(res, 200, {
      ok: result.ok,
      rows: result.rows || [],
      error: result.ok ? null : demoError(result, "Run sql/demo_schema.sql after enabling PostGIS. PostGIS support is realm-dependent in OCI."),
    });
    return;
  }

  if (url.pathname === "/api/demo/crypto") {
    const value = url.searchParams.get("value") || "customer-4182";
    const schemaResult = await extensionSchemaMap(["pgcrypto"]);
    const cryptoSchema = schemaResult.schemas.get("pgcrypto");

    if (!schemaResult.ok || !cryptoSchema) {
      json(res, 200, {
        ok: false,
        row: null,
        error: schemaResult.error || "Create the pgcrypto extension to run this demo.",
      });
      return;
    }

    const crypto = quoteIdent(cryptoSchema);
    const result = await query(
      `
        SELECT
          encode(${crypto}.digest($1::text, 'sha256'), 'hex') AS sha256,
          ${crypto}.gen_random_uuid() AS token
      `,
      [value],
    );

    json(res, 200, {
      ok: result.ok,
      row: result.rows?.[0] || null,
      error: result.ok ? null : demoError(result, "Create the pgcrypto extension to run this demo."),
    });
    return;
  }

  json(res, 404, { error: "Unknown API route." });
}

function demoError(result, hint) {
  return `${result.error || "Demo query failed."} ${hint}`;
}

async function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") {
    pathname = "/index.html";
  }

  const filePath = normalize(join(root, pathname));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    res.writeHead(200, { "content-type": contentType(filePath) });
    res.end(body);
  } catch {
    const body = await readFile(join(root, "index.html"));
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(body);
  }
}

function contentType(filePath) {
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
  };
  return types[extname(filePath)] || "application/octet-stream";
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "content-type",
    });
    res.end();
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    await handleApi(req, res, url);
    return;
  }

  await serveStatic(req, res, url);
});

server.listen(port, () => {
  console.log(`OCI PostgreSQL showcase running at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  await pool?.end();
  server.close(() => process.exit(0));
});
