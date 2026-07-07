const supportedSource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/extensions.htm";
const warmStandbySource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/cross-region-replication.htm";
const backupSource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/backups.htm";
const apiBase = window.location.protocol === "file:" ? "http://localhost:8787" : "";

const pageData = {
  overview: {
    title: "Extension portfolio",
    eyebrow: "Customer-ready use cases",
    nav: "Portfolio",
    icon: "layout-dashboard",
    pill: "Built for demos",
    heroTitle: "Turn supported PostgreSQL extensions into customer stories.",
    summary:
      "Show how OCI Database with PostgreSQL can power AI search, query performance, automation, governance, location intelligence, and data products from one managed platform.",
    help: [
      ["pgvector", "Stores vector embeddings and supports similarity search inside PostgreSQL, making product recommendations, semantic search, and retrieval-augmented generation patterns feel native to the database."],
      ["pg_stat_statements", "Tracks normalized SQL execution statistics so teams can identify high-cost queries by total time, calls, rows, and latency."],
      ["pg_repack", "Rebuilds bloated tables and indexes with minimal blocking, which is useful for always-on systems that cannot wait for long maintenance windows."],
      ["PostGIS", "Adds spatial data types, indexes, and geospatial functions for proximity search, routing, coverage analysis, and location-aware products."],
      ["pg_cron and pg_partman", "Together they support scheduled database jobs and automated partition management for time-series, event, and lifecycle workloads."],
      ["pgaudit, pgcrypto, postgres_fdw, pg_trgm", "These extensions strengthen audit trails, encryption workflows, federated access, and fuzzy text matching for practical enterprise applications."],
    ],
    render: renderOverview,
  },
  live: {
    title: "Live database lab",
    eyebrow: "Optional DB connection",
    nav: "Live Lab",
    icon: "database",
    pill: "Connected proof",
    heroTitle: "Let the showcase talk to a real OCI PostgreSQL database.",
    summary:
      "Connect a small local API to DATABASE_URL, inspect supported extensions, and run safe curated demos against pgvector, pg_trgm, pg_stat_statements, PostGIS, pgcrypto, and live table statistics.",
    help: [
      ["How live mode works", "The browser calls a local Node API. The API connects to PostgreSQL with DATABASE_URL, runs parameterized read-only showcase queries, and returns sanitized JSON."],
      ["Why not browser-to-database", "Direct database connections from a browser would expose credentials and are not how customer-facing demos should be built."],
      ["Setup", "Copy .env.example to .env, set DATABASE_URL, run npm install, optionally run sql/demo_schema.sql, then start the server with npm start."],
    ],
    render: renderLive,
  },
  dr: {
    title: "Disaster recovery",
    eyebrow: "Backup, restore, warm standby",
    nav: "DR",
    icon: "cloud-cog",
    pill: "Business continuity",
    heroTitle: "Show a practical recovery story, not just a backup checkbox.",
    summary:
      "Position OCI PostgreSQL DR as two complementary patterns: backup and restore for durable recovery points, and warm standby replication for lower recovery time across regions.",
    help: [
      ["Backup and restore", "OCI Database with PostgreSQL backups can be manual or scheduled, stored remotely, copied to another region, and used to provision a new database system when the primary is unavailable."],
      ["Warm standby", "Replication with Warm Standby maintains a continuously updated standby database system. The primary streams write-ahead logs to the standby, which stays read-only until promotion or switchover."],
      ["RPO controls", "RPO enforcement tracks replication lag. When enabled, OCI can temporarily switch the primary to read-only mode if lag exceeds the configured threshold, allowing the standby to catch up."],
      ["Operational nuance", "Automatic failover is not supported for warm standby. Disaster recovery is performed through manual promotion, conversion, or switchover workflows."],
    ],
    references: [
      ["Warm Standby replication", warmStandbySource],
      ["Database system backups", backupSource],
    ],
    render: renderDR,
  },
  ai: {
    title: "AI matching",
    eyebrow: "pgvector + pg_trgm",
    nav: "AI Matching",
    icon: "sparkles",
    pill: "Semantic experiences",
    heroTitle: "Use PostgreSQL as the relevance layer for AI-powered customer journeys.",
    summary:
      "Blend vector similarity with fuzzy matching to retrieve the right product, policy, article, or next-best action from operational data.",
    help: [
      ["pgvector", "Adds a vector type and similarity operators, so embeddings can live beside customer, product, and transaction records."],
      ["pg_trgm", "Provides trigram matching and indexes that rescue misspellings, partial names, and imperfect customer-entered text."],
      ["Embeddings", "AI models turn text, images, documents, and events into numeric vectors. pgvector lets PostgreSQL compare those vectors to find items with similar meaning or visual content."],
      ["RAG and agents", "Retrieval-augmented generation and agent workflows need trusted context. PostgreSQL can retrieve governed rows, documents, and customer memory before an answer or action is produced."],
      ["Why this stands out", "The demo keeps AI relevance close to governed data instead of copying every customer signal into a separate search-only platform."],
    ],
    render: renderAi,
  },
  performance: {
    title: "Performance cockpit",
    eyebrow: "pg_stat_statements + pg_repack",
    nav: "Performance",
    icon: "gauge",
    pill: "Operate with evidence",
    heroTitle: "Move from reactive tuning to measurable workload health.",
    summary:
      "Expose query cost, cache pressure, table bloat, and repack impact in one executive-friendly view for performance reviews.",
    help: [
      ["pg_stat_statements", "Collects query-level performance statistics that reveal where the workload is actually spending time."],
      ["pg_repack", "Compacts tables and rebuilds indexes online, helping reclaim bloat and improve access paths with less disruption."],
      ["pg_buffercache", "Shows what is resident in shared buffers, useful for explaining cache pressure and hot relation behavior."],
      ["pgstattuple", "Estimates tuple-level table and index bloat, giving maintenance recommendations a concrete data source."],
    ],
    render: renderPerformance,
  },
  location: {
    title: "Location intelligence",
    eyebrow: "PostGIS",
    nav: "Location",
    icon: "map",
    pill: "Spatial products",
    heroTitle: "Add geography to customer, asset, and service workflows.",
    summary:
      "Demonstrate catchment analysis, routing, nearest-resource lookup, and service coverage without sending spatial data to a separate engine.",
    help: [
      ["PostGIS", "Adds geometry and geography types, spatial indexes, and functions such as distance, intersection, containment, and routing-adjacent analysis."],
      ["OCI note", "Oracle's supported extension list notes that PostGIS-related extensions are enabled only in the OC1 realm."],
      ["Customer value", "Spatial functions turn everyday records into location-aware products: field service, branch planning, delivery optimization, and risk zones."],
    ],
    render: renderLocation,
  },
  operations: {
    title: "Lifecycle automation",
    eyebrow: "pg_cron + pg_partman",
    nav: "Automation",
    icon: "calendar-clock",
    pill: "Data lifecycle",
    heroTitle: "Keep operational data tidy while the application stays online.",
    summary:
      "Use scheduled jobs and partition automation to handle retention, rollups, vacuum-friendly windows, and recurring maintenance.",
    help: [
      ["pg_cron", "Schedules SQL jobs from inside PostgreSQL, including rollups, refreshes, retention policies, and operational checks."],
      ["pg_partman", "Automates time-based and serial-based partition management so high-volume tables stay predictable as they grow."],
      ["pg_repack", "Pairs well with automation when teams want recurring bloat cleanup with minimal application interruption."],
    ],
    render: renderOperations,
  },
  trust: {
    title: "Trust and data products",
    eyebrow: "pgaudit + pgcrypto + postgres_fdw",
    nav: "Trust",
    icon: "shield-check",
    pill: "Governed sharing",
    heroTitle: "Package governed data access as a product, not a one-off extract.",
    summary:
      "Show audit-ready access, encrypted values, and federated reads that help teams build compliant cross-domain services.",
    help: [
      ["pgaudit", "Produces detailed audit logs for database activity, supporting accountability and regulated access reviews."],
      ["pgcrypto", "Adds cryptographic functions for hashing, random values, and encryption workflows handled close to the data."],
      ["postgres_fdw", "Lets PostgreSQL query remote PostgreSQL tables through foreign data wrappers, useful for governed federation and phased consolidation."],
      ["pglogical", "Supports logical replication patterns where organizations need data distribution or migration pathways."],
    ],
    render: renderTrust,
  },
};

const nav = document.querySelector("#navigation");
const content = document.querySelector("#content");
const title = document.querySelector("#page-title");
const eyebrow = document.querySelector("#page-eyebrow");
const heroPill = document.querySelector("#hero-pill");
const heroTitle = document.querySelector("#hero-title");
const heroSummary = document.querySelector("#hero-summary");
const helpTrigger = document.querySelector("#help-trigger");
const helpOverlay = document.querySelector("#help-overlay");
const helpClose = document.querySelector("#help-close");
const helpBody = document.querySelector("#help-body");
const helpTitle = document.querySelector("#help-title");
const helpEyebrow = document.querySelector("#help-eyebrow");

let currentPage = "overview";

function icon(name, color = "") {
  return `<span class="card-icon ${color}"><i data-lucide="${name}" aria-hidden="true"></i></span>`;
}

function renderNavigation() {
  nav.innerHTML = Object.entries(pageData)
    .map(
      ([key, page]) => `
        <button class="nav-button" type="button" data-route="${key}" aria-label="${page.nav}">
          <i data-lucide="${page.icon}" aria-hidden="true"></i>
          <span>${page.nav}</span>
        </button>
      `,
    )
    .join("");

  nav.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.hash = button.dataset.route;
    });
  });
}

function renderPage(route) {
  const page = pageData[route] || pageData.overview;
  currentPage = pageData[route] ? route : "overview";

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.route === currentPage);
  });

  content.classList.add("transitioning");

  window.setTimeout(() => {
    title.textContent = page.title;
    eyebrow.textContent = page.eyebrow;
    heroPill.textContent = page.pill;
    heroTitle.textContent = page.heroTitle;
    heroSummary.textContent = page.summary;
    content.innerHTML = page.render();
    attachInteractions(currentPage);
    content.classList.remove("transitioning");
    refreshIcons();
  }, 120);
}

function renderOverview() {
  const cards = [
    ["database", "Live database lab", "Optional backend mode that checks real extension availability and runs curated demo queries.", "DATABASE_URL", "safe API", "green"],
    ["cloud-cog", "Disaster recovery", "Backup and restore, cross-region backup copies, warm standby replication, RPO guardrails, and switchover storylines.", "Warm Standby", "Backups", "red"],
    ["sparkles", "AI and search", "Recommendations, answer retrieval, support article matching, and next-best action powered by embeddings.", "pgvector", "pg_trgm", "teal"],
    ["gauge", "Workload health", "High-cost SQL, bloat, cache pressure, and measured tuning impact for operational reviews.", "pg_stat_statements", "pg_repack", "amber"],
    ["map", "Spatial products", "Nearest asset, coverage zone, branch planning, service territory, and risk overlay experiences.", "PostGIS", "OC1 note", "red"],
    ["calendar-clock", "Lifecycle automation", "Scheduled retention, partition creation, rollups, and maintenance workflows kept close to the data.", "pg_cron", "pg_partman", "green"],
    ["shield-check", "Governed sharing", "Auditable access, encryption workflows, and federated reads for compliant data products.", "pgaudit", "postgres_fdw", "violet"],
  ];

  return `
    <div class="metric-strip">
      ${metric("13", "standout extensions curated")}
      ${metric("6", "customer-facing use-case paths")}
      ${metric("1", "optional live database lab")}
      ${metric("OC1", "PostGIS realm note surfaced")}
    </div>
    <div class="grid overview-grid">
      ${cards
        .map(
          ([cardIcon, heading, copy, tagOne, tagTwo, color]) => `
            <article class="card">
              ${icon(cardIcon, color)}
              <h3>${heading}</h3>
              <p>${copy}</p>
              <div class="tag-row">
                <span class="tag">${tagOne}</span>
                <span class="tag">${tagTwo}</span>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderDR() {
  const options = [
    ["Backup copies", "Manual or scheduled backups can be copied to another subscribed region and used to provision a replacement database system.", "Restore point"],
    ["Warm standby", "A standby database in another region continuously receives WAL from the primary and remains read-only until DR action.", "Lower RTO"],
    ["RPO enforcement", "Replication lag can be monitored and bounded. If enforcement is enabled and lag exceeds threshold, the primary can pause writes by switching read-only.", "Data guardrail"],
  ];

  return `
    <div class="grid two-col dr-layout">
      <section class="scenario-panel dr-visual-panel">
        <div class="dr-stage" aria-label="Primary and warm standby database replication">
          <div class="dr-region primary-region">
            <span class="region-label">Primary region</span>
            <div class="dr-database active">
              <span></span>
              <strong>RW</strong>
            </div>
            <small>Read/write endpoint</small>
          </div>
          <div class="replication-lane">
            <span class="wal-line"></span>
            <span class="wal-pulse pulse-one"></span>
            <span class="wal-pulse pulse-two"></span>
            <span class="wal-pulse pulse-three"></span>
            <p>WAL stream</p>
          </div>
          <div class="dr-region standby-region">
            <span class="region-label">Replica region</span>
            <div class="dr-database standby">
              <span></span>
              <strong>RO</strong>
            </div>
            <small>Warm standby</small>
          </div>
          <div class="backup-vault">
            <i data-lucide="archive-restore" aria-hidden="true"></i>
            <span>Backup copy</span>
          </div>
        </div>
      </section>
      <section class="chart-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">DR posture</p>
            <h3>Two recovery motions</h3>
          </div>
        </div>
        <div class="mini-stack">
          ${mini("Backup and restore", "Durable recovery points for data-loss events, regional copy, and new DB system provisioning.", "RPO point")}
          ${mini("Warm standby DR", "Continuously updated replica database system for business continuity and faster regional recovery.", "RTO focus")}
          ${mini("Manual control", "Promotion, conversion, and switchover keep DR execution explicit and auditable.", "Runbook")}
        </div>
      </section>
    </div>

    <div class="grid three-col dr-option-grid">
      ${options
        .map(
          ([heading, copy, badge]) => `
            <article class="card dr-card">
              ${icon(heading === "Backup copies" ? "archive-restore" : heading === "Warm standby" ? "repeat-2" : "activity", heading === "Warm standby" ? "teal" : heading === "RPO enforcement" ? "amber" : "red")}
              <h3>${heading}</h3>
              <p>${copy}</p>
              <div class="tag-row"><span class="tag">${badge}</span></div>
            </article>
          `,
        )
        .join("")}
    </div>

    <div class="grid two-col">
      <section class="scenario-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Failover storyline</p>
            <h3>Warm standby recovery path</h3>
          </div>
        </div>
        <div class="timeline">
          ${drEvent("01", "Detect regional outage", "Primary region cannot serve application traffic.", "hot")}
          ${drEvent("02", "Promote or convert standby", "Replica region continues database activity after DR action.", "warn")}
          ${drEvent("03", "Reverse protection", "When the original region recovers, convert it to warm standby behind the new primary.", "ok")}
          ${drEvent("04", "Switchover home", "Use switchover to return to the original primary region when ready.", "ok")}
        </div>
      </section>
      <section class="code-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Design cue</p>
            <h3>What to explain to customers</h3>
          </div>
        </div>
        <pre><code>DR strategy =
  scheduled backups
  + cross-region backup copies
  + warm standby replication
  + tested promotion / switchover runbook
  + RPO lag monitoring</code></pre>
      </section>
    </div>
  `;
}

function renderLive() {
  return `
    <div class="live-stack">
      <section class="scenario-panel live-status-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Connection</p>
            <h3>Database health</h3>
          </div>
          <button class="chip" type="button" id="live-refresh">Refresh</button>
        </div>
        <div class="live-status-grid" id="live-status">
          ${loadingCard("API status")}
          ${loadingCard("Database")}
          ${loadingCard("Server version")}
        </div>
      </section>

      <div class="grid two-col">
        <section class="scenario-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Installed vs available</p>
              <h3>Extension matrix</h3>
            </div>
          </div>
          <div class="extension-grid" id="extension-matrix">
            ${emptyState("Checking extension catalog...")}
          </div>
        </section>

        <section class="code-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Run locally</p>
              <h3>Live mode setup</h3>
            </div>
          </div>
          <pre><code>copy .env.example .env
npm install
psql "$DATABASE_URL" -f sql/demo_schema.sql
npm start</code></pre>
        </section>
      </div>

      <div class="grid two-col">
        <section class="scenario-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">pgvector + pg_trgm</p>
              <h3>Live intent search</h3>
            </div>
          </div>
          <form class="live-form" id="live-search-form">
            <select class="text-input" id="live-scenario" aria-label="Scenario">
              <option value="support">Support</option>
              <option value="retail">Retail</option>
              <option value="risk">Risk</option>
            </select>
            <input class="text-input" id="live-query" value="refund exception policy" aria-label="Search phrase" />
            <button class="chip active" type="submit">Search</button>
          </form>
          <div class="rank-list" id="live-search-results">
            ${emptyState("Connect a database to run vector and trigram search.")}
          </div>
        </section>

        <section class="scenario-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">pg_stat_statements</p>
              <h3>Top workload signals</h3>
            </div>
          </div>
          <div class="query-table" id="workload-results">
            ${emptyState("Waiting for live workload telemetry...")}
          </div>
        </section>
      </div>

      <div class="grid three-col">
        <section class="scenario-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Maintenance</p>
              <h3>Table churn</h3>
            </div>
          </div>
          <div class="mini-stack" id="maintenance-results">
            ${emptyState("Live pg_stat_user_tables data will appear here.")}
          </div>
        </section>

        <section class="scenario-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">PostGIS</p>
              <h3>Nearest locations</h3>
            </div>
          </div>
          <div class="live-map" id="spatial-map" aria-label="Nearest location map">
            ${emptyState("Run the demo schema with PostGIS to draw the live map.")}
          </div>
          <div class="mini-stack" id="spatial-results">
            ${emptyState("Run the demo schema with PostGIS to populate this panel.")}
          </div>
        </section>

        <section class="scenario-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">pgcrypto</p>
              <h3>Hash and token</h3>
            </div>
          </div>
          <form class="live-form stacked" id="crypto-form">
            <input class="text-input" id="crypto-value" value="customer-4182" aria-label="Value to hash" />
            <button class="chip active" type="submit">Generate</button>
          </form>
          <div class="mini-stack" id="crypto-results">
            ${emptyState("Create pgcrypto to generate live hashes and tokens.")}
          </div>
        </section>
      </div>
    </div>
  `;
}

function renderAi() {
  return `
    <div class="metric-strip ai-value-strip">
      ${metric("62%", "faster answer retrieval")}
      ${metric("31%", "case deflection uplift")}
      ${metric("22%", "product discovery lift")}
      ${metric("1", "governed retrieval layer")}
    </div>

    <section class="scenario-panel ai-canvas">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">AI use-case canvas</p>
          <h3>From database records to grounded AI experiences</h3>
        </div>
        <div class="segmented" data-ai-pattern-tabs>
          <button class="chip active" type="button" data-ai-pattern="semantic">Semantic</button>
          <button class="chip" type="button" data-ai-pattern="rag">RAG</button>
          <button class="chip" type="button" data-ai-pattern="image">Image</button>
          <button class="chip" type="button" data-ai-pattern="agent">Agent</button>
        </div>
      </div>
      <div class="ai-flow" aria-label="AI retrieval value flow">
        ${aiFlowStep("database", "Operational data", "customers, products, cases")}
        ${aiFlowStep("file-text", "Docs and images", "policies, manuals, photos")}
        ${aiFlowStep("binary", "Embeddings", "model-generated vectors")}
        ${aiFlowStep("scan-search", "pgvector search", "nearest meaning or image")}
        ${aiFlowStep("spell-check", "pg_trgm rescue", "typos and partial terms")}
        ${aiFlowStep("message-square-check", "Grounded action", "answer, match, or next step")}
      </div>
      <div class="grid two-col ai-pattern-grid">
        <section class="ai-demo-panel" id="ai-pattern-demo"></section>
        <section class="code-panel ai-pattern-code">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Pattern snippet</p>
              <h3 id="ai-pattern-code-title">Semantic retrieval</h3>
            </div>
          </div>
          <pre><code id="ai-pattern-code">SELECT id, title
FROM knowledge_items
ORDER BY embedding <=> :intent_embedding
LIMIT 5;</code></pre>
        </section>
      </div>
    </section>

    <div class="grid three-col ai-lane-grid">
      ${aiLane("search", "Semantic search", "Match customer intent to articles, products, or actions even when wording differs.", "meaning")}
      ${aiLane("messages-square", "RAG", "Retrieve trusted context from PostgreSQL before a generated response is assembled.", "grounding")}
      ${aiLane("image", "Image search", "Store image embeddings beside product metadata for visual similarity and asset discovery.", "visual")}
      ${aiLane("bot", "Agent memory", "Give agents scoped customer history, open tasks, and eligible actions from operational rows.", "context")}
    </div>

    <div class="grid two-col">
      <section class="scenario-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Live scenario</p>
            <h3>Customer intent matcher</h3>
          </div>
          <div class="segmented" data-scenario-tabs>
            <button class="chip active" type="button" data-scenario="support">Support</button>
            <button class="chip" type="button" data-scenario="retail">Retail</button>
            <button class="chip" type="button" data-scenario="risk">Risk</button>
          </div>
        </div>
        <div class="rank-list" id="ai-results"></div>
      </section>
      <section class="code-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Pattern</p>
            <h3>Vector and trigram retrieval</h3>
          </div>
        </div>
        <pre><code>SELECT article_id, title,
       embedding <=> :customer_intent AS distance,
       similarity(title, :typed_phrase) AS fuzzy_score
FROM support_articles
WHERE title % :typed_phrase
ORDER BY embedding <=> :customer_intent
LIMIT 5;</code></pre>
      </section>
    </div>
  `;
}

function aiFlowStep(iconName, titleText, copy) {
  return `
    <article class="ai-flow-step">
      <span class="ai-flow-icon"><i data-lucide="${iconName}" aria-hidden="true"></i></span>
      <strong>${titleText}</strong>
      <small>${copy}</small>
    </article>
  `;
}

function aiLane(iconName, titleText, copy, tagText) {
  return `
    <article class="card ai-lane-card">
      ${icon(iconName, titleText === "RAG" ? "amber" : titleText === "Image search" ? "red" : titleText === "Agent memory" ? "violet" : "teal")}
      <h3>${titleText}</h3>
      <p>${copy}</p>
      <div class="tag-row"><span class="tag">${tagText}</span></div>
    </article>
  `;
}

function renderPerformance() {
  const queries = [
    ["customer_orders_rollup", "42% total time", "pg_stat_statements", "hot"],
    ["inventory_by_region", "18% cache misses", "pg_buffercache", "warn"],
    ["events_2026_q2", "31 GB reclaim", "pg_repack", "ok"],
  ];

  return `
    <div class="grid two-col">
      <section class="scenario-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Top workload signals</p>
            <h3>Evidence-led tuning queue</h3>
          </div>
        </div>
        <div class="query-table">
          ${queries
            .map(
              ([name, value, extension, state]) => `
                <div class="query-row">
                  <div>
                    <p>${name}</p>
                    <span>${extension}</span>
                  </div>
                  <strong>${value}</strong>
                  <span class="status ${state}">${state}</span>
                </div>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="chart-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Before and after</p>
            <h3>Measured maintenance impact</h3>
          </div>
        </div>
        <div class="bar-list">
          ${bar("Query p95 latency", "860 ms", 86, "red")}
          ${bar("After repack and index rebuild", "310 ms", 31, "")}
          ${bar("Table bloat reclaimed", "64%", 64, "amber")}
          ${bar("Shared buffer residency", "77%", 77, "")}
        </div>
      </section>
    </div>
  `;
}

function renderLocation() {
  return `
    <div class="grid two-col">
      <section class="scenario-panel">
        <div class="map-stage" aria-label="Spatial service coverage visualization">
          <span class="catchment a"></span>
          <span class="catchment b"></span>
          <span class="catchment c"></span>
          <span class="route one"></span>
          <span class="route two"></span>
          <span class="map-node node-a">A</span>
          <span class="map-node node-b">B</span>
          <span class="map-node node-c">C</span>
        </div>
      </section>
      <section class="chart-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Spatial decisions</p>
            <h3>Coverage and proximity</h3>
          </div>
        </div>
        <div class="mini-stack">
          ${mini("Nearest dispatch center", "ST_DWithin narrows candidates before ranking by distance.", "7.4 km")}
          ${mini("Service territory overlap", "ST_Intersects identifies customers covered by multiple depots.", "18%")}
          ${mini("New branch catchment", "Geometry buffers model market reach before site selection.", "42k households")}
        </div>
      </section>
    </div>
  `;
}

function renderOperations() {
  const events = [
    ["00:05", "Create tomorrow's event partitions", "pg_partman", "ok"],
    ["01:00", "Roll up hourly telemetry into daily summaries", "pg_cron", "ok"],
    ["02:30", "Archive records past retention policy", "pg_cron", "warn"],
    ["03:15", "Online cleanup for high-churn tenant tables", "pg_repack", "ok"],
  ];

  return `
    <div class="grid two-col">
      <section class="scenario-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Maintenance calendar</p>
            <h3>Automated data lifecycle</h3>
          </div>
        </div>
        <div class="timeline">
          ${events
            .map(
              ([time, text, extension, status]) => `
                <div class="event">
                  <span class="event-time">${time}</span>
                  <div>
                    <p>${text}</p>
                    <span>${extension}</span>
                  </div>
                  <span class="status ${status}">${status}</span>
                </div>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="code-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Pattern</p>
            <h3>Schedule lifecycle SQL</h3>
          </div>
        </div>
        <pre><code>SELECT cron.schedule(
  'nightly-retention',
  '30 2 * * *',
  $$CALL archive_expired_customer_events();$$
);

SELECT partman.run_maintenance_proc();</code></pre>
      </section>
    </div>
  `;
}

function renderTrust() {
  return `
    <div class="grid two-col">
      <section class="scenario-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Audit feed</p>
            <h3>Governed access trail</h3>
          </div>
        </div>
        <div class="audit-feed">
          ${audit("Policy service", "SELECT on customer_risk_score", "pgaudit", "ok")}
          ${audit("Token vault", "Digest generated for sensitive identifier", "pgcrypto", "ok")}
          ${audit("Finance data product", "Remote read from billing ledger", "postgres_fdw", "warn")}
        </div>
      </section>
      <section class="chart-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Data product posture</p>
            <h3>Controls in the serving path</h3>
          </div>
        </div>
        <div class="bar-list">
          ${bar("Audited privileged statements", "100%", 100, "")}
          ${bar("Hashed identifiers", "94%", 94, "amber")}
          ${bar("Federated datasets onboarded", "12", 72, "")}
          ${bar("Extract files retired", "8", 58, "red")}
        </div>
      </section>
    </div>
  `;
}

function metric(value, label) {
  return `
    <div class="metric">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function bar(label, value, width, color) {
  return `
    <div class="bar-row">
      <div class="bar-label">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
      <div class="bar-track"><span class="bar-fill ${color}" style="width: ${width}%"></span></div>
    </div>
  `;
}

function mini(titleText, copy, value) {
  return `
    <article class="mini-card">
      <p class="mini-title"><span>${titleText}</span><strong>${value}</strong></p>
      <p class="mini-copy">${copy}</p>
    </article>
  `;
}

function audit(actor, action, extension, status) {
  return `
    <div class="event">
      <span class="event-time">${actor.slice(0, 2).toUpperCase()}</span>
      <div>
        <p>${action}</p>
        <span>${actor} - ${extension}</span>
      </div>
      <span class="status ${status}">${status}</span>
    </div>
  `;
}

function drEvent(step, titleText, copy, status) {
  return `
    <div class="event">
      <span class="event-time">${step}</span>
      <div>
        <p>${titleText}</p>
        <span>${copy}</span>
      </div>
      <span class="status ${status}">${status}</span>
    </div>
  `;
}

function loadingCard(label) {
  return `
    <article class="live-status-card">
      <span>${label}</span>
      <strong>Checking</strong>
    </article>
  `;
}

function emptyState(message) {
  return `<div class="empty-state">${message}</div>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function apiGet(path) {
  const response = await fetch(`${apiBase}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }
  return response.json();
}

const aiPatternData = {
  semantic: {
    label: "Semantic retrieval",
    prompt: "Customer typed: 'Can I pause service while traveling?'",
    why: "PostgreSQL keeps customer, subscription, policy, and support data queryable while pgvector finds the closest meaning match.",
    matches: [
      ["0.96", "Subscription pause workflow", "Best policy match despite different wording."],
      ["0.88", "Retention-safe save offers", "Related next action for support agents."],
      ["0.81", "Travel billing exception", "Contextually similar billing guidance."],
    ],
    code: `SELECT article_id, title
FROM support_articles
ORDER BY embedding <=> :intent_embedding
LIMIT 3;`,
  },
  rag: {
    label: "RAG grounding",
    prompt: "User asks: 'What should I tell a premium customer about warranty transfer?'",
    why: "RAG retrieves governed PostgreSQL facts first, then generation can cite the right policy instead of improvising.",
    matches: [
      ["0.93", "Warranty transfer rules", "Authoritative policy context."],
      ["0.87", "Premium support entitlements", "Account-tier specific guidance."],
      ["0.79", "Recent warranty exceptions", "Operational precedent for escalation."],
    ],
    code: `WITH context AS (
  SELECT title, body
  FROM policy_docs
  ORDER BY embedding <=> :question_embedding
  LIMIT 4
)
SELECT json_agg(context) AS grounded_context
FROM context;`,
  },
  image: {
    label: "Image similarity",
    prompt: "Field tech uploads a part photo from a mobile device.",
    why: "Image embeddings can be stored beside SKU, inventory, region, and warranty rows so visual search becomes operational.",
    matches: [
      ["0.94", "Valve actuator A-17", "Closest visual profile and in-stock substitute."],
      ["0.89", "Actuator seal kit", "Frequently co-ordered repair component."],
      ["0.82", "Legacy actuator A-12", "Similar shape, lower confidence."],
    ],
    code: `SELECT sku, name, inventory_region
FROM product_assets
ORDER BY image_embedding <=> :photo_embedding
LIMIT 5;`,
  },
  agent: {
    label: "Agent memory and action",
    prompt: "Agent goal: reduce churn risk before renewal call.",
    why: "The agent retrieves scoped customer memory and eligible actions from PostgreSQL, then proposes a next step with audit-ready context.",
    matches: [
      ["0.91", "Open renewal risk", "Customer has two unresolved support cases."],
      ["0.86", "Eligible loyalty credit", "Offer is available in current region."],
      ["0.78", "Prior escalation notes", "Preferred contact path and tone."],
    ],
    code: `SELECT memory, eligible_action, reason
FROM customer_agent_context
WHERE customer_id = :customer_id
ORDER BY relevance_embedding <=> :goal_embedding
LIMIT 5;`,
  },
};

function attachInteractions(route) {
  if (route === "live") {
    initLiveLab();
    return;
  }

  if (route !== "ai") {
    return;
  }

  initAiPatternDemo();

  const data = {
    support: [
      ["0.94", "Refund policy exception", "Resolves ambiguous customer intent with policy snippets.", "+31% deflection"],
      ["0.89", "Subscription pause workflow", "Combines semantic article match with misspelled product term.", "+18% CSAT"],
      ["0.83", "Warranty transfer rules", "Ranks by embedding distance and title similarity.", "+12% containment"],
    ],
    retail: [
      ["0.96", "Accessory bundle", "Embeddings match the shopper's intended use, not just keywords.", "+22% attach"],
      ["0.91", "Store pickup substitute", "Fuzzy matching catches partial model names.", "+9% conversion"],
      ["0.86", "Loyalty next action", "Customer context stays relational and queryable.", "+14% retention"],
    ],
    risk: [
      ["0.92", "Unusual beneficiary pattern", "Similarity search finds related prior investigations.", "-27% review time"],
      ["0.88", "Merchant descriptor match", "Trigrams improve noisy transaction text.", "+19% precision"],
      ["0.81", "Case narrative retrieval", "Analysts retrieve comparable case summaries quickly.", "+16% throughput"],
    ],
  };

  const resultBox = document.querySelector("#ai-results");
  const buttons = document.querySelectorAll("[data-scenario]");

  function draw(kind) {
    resultBox.innerHTML = data[kind]
      .map(
        ([score, titleText, copy, lift]) => `
          <article class="rank-item">
            <span class="score">${score}</span>
            <div>
              <p><strong>${titleText}</strong></p>
              <span>${copy}</span>
            </div>
            <strong class="lift">${lift}</strong>
          </article>
        `,
      )
      .join("");
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      draw(button.dataset.scenario);
    });
  });

  draw("support");
}

function initAiPatternDemo() {
  const demo = document.querySelector("#ai-pattern-demo");
  const code = document.querySelector("#ai-pattern-code");
  const codeTitle = document.querySelector("#ai-pattern-code-title");
  const buttons = document.querySelectorAll("[data-ai-pattern]");

  if (!demo || !code || !codeTitle) {
    return;
  }

  function draw(pattern) {
    const data = aiPatternData[pattern] || aiPatternData.semantic;
    demo.innerHTML = `
      <div class="ai-demo-heading">
        <p class="eyebrow">Simulated customer moment</p>
        <h3>${data.label}</h3>
        <p>${data.prompt}</p>
      </div>
      <div class="rank-list ai-match-list">
        ${data.matches
          .map(
            ([score, titleText, copy]) => `
              <article class="rank-item">
                <span class="score">${score}</span>
                <div>
                  <p><strong>${titleText}</strong></p>
                  <span>${copy}</span>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
      <article class="ai-why">
        <strong>Why PostgreSQL matters</strong>
        <p>${data.why}</p>
      </article>
    `;
    codeTitle.textContent = data.label;
    code.textContent = data.code;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      draw(button.dataset.aiPattern);
    });
  });

  draw("semantic");
}

function initLiveLab() {
  const refresh = document.querySelector("#live-refresh");
  const searchForm = document.querySelector("#live-search-form");
  const cryptoForm = document.querySelector("#crypto-form");

  refresh?.addEventListener("click", loadLiveLab);
  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    loadLiveSearch();
  });
  cryptoForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    loadCrypto();
  });

  loadLiveLab();
}

async function loadLiveLab() {
  await Promise.allSettled([
    loadHealth(),
    loadExtensions(),
    loadLiveSearch(),
    loadWorkload(),
    loadMaintenance(),
    loadSpatial(),
    loadCrypto(),
  ]);
}

async function loadHealth() {
  const target = document.querySelector("#live-status");
  if (!target) {
    return;
  }

  target.innerHTML = `
    ${loadingCard("API status")}
    ${loadingCard("Database")}
    ${loadingCard("Server version")}
  `;

  try {
    const data = await apiGet("/api/health");
    if (!data.connected) {
      target.innerHTML = `
        ${statusCard("API reachable", "Ready", "ok")}
        ${statusCard("Database", "Not connected", "warn")}
        ${statusCard("Next step", data.error || "Configure DATABASE_URL", "hot")}
      `;
      return;
    }

    target.innerHTML = `
      ${statusCard("API reachable", "Connected", "ok")}
      ${statusCard("Database", data.database || "PostgreSQL", "ok")}
      ${statusCard("Server version", data.server_version || "Unknown", "ok")}
      ${statusCard("Connected user", data.user_name || "Unknown", "ok")}
    `;
  } catch {
    target.innerHTML = `
      ${statusCard("API status", "Offline", "hot")}
      ${statusCard("Start server", "npm start", "warn")}
      ${statusCard("Default URL", "http://localhost:8787", "warn")}
    `;
  }
}

function statusCard(label, value, state) {
  return `
    <article class="live-status-card ${state}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `;
}

async function loadExtensions() {
  const target = document.querySelector("#extension-matrix");
  if (!target) {
    return;
  }

  target.innerHTML = emptyState("Checking extension catalog...");

  try {
    const data = await apiGet("/api/extensions");
    if (!data.ok) {
      target.innerHTML = emptyState(data.error || "Extension check is unavailable.");
      return;
    }

    target.innerHTML = data.extensions
      .map((extension) => {
        const state = extension.installed ? "ok" : extension.available ? "warn" : "hot";
        const label = extension.installed ? "installed" : extension.available ? "available" : "unavailable";
        const version = extension.installedVersion || extension.defaultVersion || "n/a";
        return `
          <article class="extension-pill ${state}">
            <div>
              <strong>${escapeHtml(extension.label)}</strong>
              <span>${escapeHtml(extension.name)} - ${escapeHtml(version)}</span>
            </div>
            <span class="status ${state}">${label}</span>
          </article>
        `;
      })
      .join("");
  } catch {
    target.innerHTML = emptyState("Live API is offline. Start the server with npm start.");
  }
}

async function loadLiveSearch() {
  const target = document.querySelector("#live-search-results");
  const scenario = document.querySelector("#live-scenario")?.value || "support";
  const phrase = document.querySelector("#live-query")?.value || "refund exception policy";
  if (!target) {
    return;
  }

  target.innerHTML = emptyState("Running live vector search...");

  try {
    const data = await apiGet(`/api/demo/search?scenario=${encodeURIComponent(scenario)}&q=${encodeURIComponent(phrase)}`);
    if (!data.ok || !data.rows.length) {
      target.innerHTML = emptyState(data.error || "No live vector results returned.");
      return;
    }

    target.innerHTML = data.rows
      .map(
        (row) => `
          <article class="rank-item">
            <span class="score">${escapeHtml(row.vector_score)}</span>
            <div>
              <p><strong>${escapeHtml(row.title)}</strong></p>
              <span>${escapeHtml(row.outcome)} Trigram: ${escapeHtml(row.trigram_score)}</span>
            </div>
            <strong class="lift">${escapeHtml(row.scenario)}</strong>
          </article>
        `,
      )
      .join("");
  } catch {
    target.innerHTML = emptyState("Live API is offline. Start npm start, then retry.");
  }
}

async function loadWorkload() {
  const target = document.querySelector("#workload-results");
  if (!target) {
    return;
  }

  target.innerHTML = emptyState("Reading pg_stat_statements...");

  try {
    const data = await apiGet("/api/demo/workload");
    if (!data.ok || !data.rows.length) {
      target.innerHTML = emptyState(data.error || "No pg_stat_statements rows yet.");
      return;
    }

    target.innerHTML = data.rows
      .map(
        (row) => `
          <div class="query-row">
            <div>
              <p>${escapeHtml(row.query)}</p>
              <span>${escapeHtml(row.calls)} calls</span>
            </div>
            <strong>${escapeHtml(row.total_ms)} ms</strong>
            <span class="status hot">${escapeHtml(row.mean_ms)} avg</span>
          </div>
        `,
      )
      .join("");
  } catch {
    target.innerHTML = emptyState("Live API is offline. Start npm start, then retry.");
  }
}

async function loadMaintenance() {
  const target = document.querySelector("#maintenance-results");
  if (!target) {
    return;
  }

  target.innerHTML = emptyState("Reading table statistics...");

  try {
    const data = await apiGet("/api/demo/maintenance");
    if (!data.ok || !data.rows.length) {
      target.innerHTML = emptyState(data.error || "No user table statistics are available yet.");
      return;
    }

    target.innerHTML = data.rows
      .map((row) =>
        mini(
          `${escapeHtml(row.schemaname)}.${escapeHtml(row.relname)}`,
          `${escapeHtml(row.n_dead_tup)} dead tuples from live PostgreSQL stats.`,
          `${escapeHtml(row.dead_pct || 0)}%`,
        ),
      )
      .join("");
  } catch {
    target.innerHTML = emptyState("Live API is offline. Start npm start, then retry.");
  }
}

async function loadSpatial() {
  const target = document.querySelector("#spatial-results");
  const mapTarget = document.querySelector("#spatial-map");
  if (!target) {
    return;
  }

  target.innerHTML = emptyState("Running nearest-location query...");
  if (mapTarget) {
    mapTarget.innerHTML = emptyState("Plotting live PostGIS results...");
  }

  try {
    const data = await apiGet("/api/demo/spatial");
    if (!data.ok || !data.rows.length) {
      target.innerHTML = emptyState(data.error || "No spatial rows returned.");
      if (mapTarget) {
        mapTarget.innerHTML = emptyState(data.error || "No spatial rows returned.");
      }
      return;
    }

    if (mapTarget) {
      mapTarget.innerHTML = renderSpatialMap(data.rows);
    }

    target.innerHTML = data.rows
      .map((row) => mini(escapeHtml(row.name), `Kind: ${escapeHtml(row.kind)}`, `${escapeHtml(row.km)} km`))
      .join("");
  } catch {
    target.innerHTML = emptyState("Live API is offline. Start npm start, then retry.");
    if (mapTarget) {
      mapTarget.innerHTML = emptyState("Live API is offline. Start npm start, then retry.");
    }
  }
}

function renderSpatialMap(rows) {
  const customer = { name: "Customer", lon: -122.335167, lat: 47.608013 };
  const points = rows
    .map((row) => ({
      name: row.name,
      kind: row.kind,
      km: row.km,
      lon: Number(row.lon),
      lat: Number(row.lat),
    }))
    .filter((point) => Number.isFinite(point.lon) && Number.isFinite(point.lat));

  if (!points.length) {
    return emptyState("Spatial rows did not include coordinates.");
  }

  const allPoints = [customer, ...points];
  const minLon = Math.min(...allPoints.map((point) => point.lon));
  const maxLon = Math.max(...allPoints.map((point) => point.lon));
  const minLat = Math.min(...allPoints.map((point) => point.lat));
  const maxLat = Math.max(...allPoints.map((point) => point.lat));
  const lonRange = maxLon - minLon || 1;
  const latRange = maxLat - minLat || 1;

  function position(point) {
    return {
      left: 10 + ((point.lon - minLon) / lonRange) * 80,
      top: 90 - ((point.lat - minLat) / latRange) * 80,
    };
  }

  const customerPosition = position(customer);

  return `
    <span class="live-map-grid"></span>
    <span class="live-map-radius" style="left: ${customerPosition.left}%; top: ${customerPosition.top}%"></span>
    <span class="live-map-point customer" style="left: ${customerPosition.left}%; top: ${customerPosition.top}%" title="Customer origin">C</span>
    ${points
      .map((point, index) => {
        const pointPosition = position(point);
        const dx = pointPosition.left - customerPosition.left;
        const dy = pointPosition.top - customerPosition.top;
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return `
          <span class="live-map-line" style="left: ${customerPosition.left}%; top: ${customerPosition.top}%; width: ${length}%; transform: rotate(${angle}deg)"></span>
          <span class="live-map-point location location-${index % 4}" style="left: ${pointPosition.left}%; top: ${pointPosition.top}%" title="${escapeHtml(point.name)} - ${escapeHtml(point.km)} km">${index + 1}</span>
        `;
      })
      .join("")}
    <div class="live-map-legend">
      <span><i class="legend-dot customer-dot"></i>Customer</span>
      <span><i class="legend-dot location-dot"></i>Nearest</span>
    </div>
  `;
}

async function loadCrypto() {
  const target = document.querySelector("#crypto-results");
  const value = document.querySelector("#crypto-value")?.value || "customer-4182";
  if (!target) {
    return;
  }

  target.innerHTML = emptyState("Running pgcrypto digest...");

  try {
    const data = await apiGet(`/api/demo/crypto?value=${encodeURIComponent(value)}`);
    if (!data.ok || !data.row) {
      target.innerHTML = emptyState(data.error || "pgcrypto did not return a result.");
      return;
    }

    target.innerHTML = `
      ${mini("SHA-256 digest", escapeHtml(data.row.sha256), "hash")}
      ${mini("Generated token", escapeHtml(data.row.token), "uuid")}
    `;
  } catch {
    target.innerHTML = emptyState("Live API is offline. Start npm start, then retry.");
  }
}

function openHelp() {
  const page = pageData[currentPage];
  helpEyebrow.textContent = page.references ? "Architecture notes" : "Extension notes";
  helpTitle.textContent = page.references ? `${page.title} notes` : `${page.title} extensions`;
  helpBody.innerHTML = `
    ${page.help
      .map(
        ([name, copy]) => `
          <article class="help-item">
            <h3>${name}</h3>
            <p>${copy}</p>
          </article>
        `,
      )
      .join("")}
    ${
      page.references
        ? `<article class="help-item support-note">
            <h3>Oracle references</h3>
            ${page.references
              .map(([label, href]) => `<p><a href="${href}" target="_blank" rel="noreferrer">${label}</a></p>`)
              .join("")}
          </article>`
        : `<article class="help-item support-note">
            <h3>OCI enablement</h3>
            <p>Oracle lists these as supported OCI Database with PostgreSQL extensions. Several standout extensions must be enabled through a custom configuration before database administrators can create them.</p>
            <p><a href="${supportedSource}" target="_blank" rel="noreferrer">Oracle extension reference</a></p>
          </article>`
    }
  `;
  helpOverlay.hidden = false;
  helpTrigger.setAttribute("aria-expanded", "true");
  helpClose.focus();
}

function closeHelp(restoreFocus = true) {
  helpOverlay.hidden = true;
  helpTrigger.setAttribute("aria-expanded", "false");
  if (restoreFocus) {
    helpTrigger.focus();
  }
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

window.addEventListener("hashchange", () => {
  if (!helpOverlay.hidden) {
    closeHelp(false);
  }
  renderPage(window.location.hash.replace("#", "") || "overview");
});

helpTrigger.addEventListener("click", openHelp);
helpClose.addEventListener("click", closeHelp);
helpOverlay.addEventListener("click", (event) => {
  if (event.target === helpOverlay) {
    closeHelp();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !helpOverlay.hidden) {
    closeHelp();
  }
});

renderNavigation();
renderPage(window.location.hash.replace("#", "") || "overview");
refreshIcons();
