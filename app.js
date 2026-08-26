const supportedSource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/extensions.htm";
const warmStandbySource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/cross-region-replication.htm";
const backupSource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/backups.htm";
const pointInTimeRecoverySource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/point-time-recovery.htm";
const migrationSource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/import-export-migrate.htm";
const nativeLogicalReplicationSource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/storage-best-practices.htm";
const pglogicalSource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/upgrades.htm";
const serviceOverviewSource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/overview.htm";
const availabilitySource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/high-availability.htm";
const createDatabaseSource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/create-db.htm";
const metricsSource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/metrics.htm";
const loggingSource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/logging.htm";
const maintenanceSource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/maintenance.htm";
const queryInsightsSource =
  "https://docs.oracle.com/en-us/iaas/Content/postgresql/query-insights.htm";
const grafanaSource =
  "https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/grafana.htm";
const prometheusGrafanaSource =
  "https://docs.oracle.com/en/learn/ocipgsql-promgra/index.html";
const apiBase = window.location.protocol === "file:" ? "http://localhost:8787" : "";

const pageData = {
  overview: {
    title: "OCI PostgreSQL showcase",
    eyebrow: "Managed platform and workloads",
    nav: "Portfolio",
    icon: "layout-dashboard",
    pill: "Built for customer conversations",
    heroTitle: "Run PostgreSQL workloads with OCI confidence.",
    summary:
      "Connect managed availability, security, operations, recovery, migration, and differentiated PostgreSQL workloads into one practical customer story.",
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
      ["Operational snapshot", "Uptime and connection headroom are current signals. Connection headroom compares all active database backends with the server limit; cache ratio accumulates since statistics reset, and replay activity is not a guaranteed lag target."],
      ["Setup", "Copy .env.example to .env, set DATABASE_URL, run npm install, optionally run sql/demo_schema.sql, then start the server with npm start."],
    ],
    render: renderLive,
  },
  availability: {
    title: "Availability and scale",
    eyebrow: "Multi-node HA, reader endpoints, flexible capacity",
    nav: "Availability",
    icon: "network",
    pill: "Ready for growth",
    heroTitle: "Keep service available as demand changes.",
    summary:
      "In-region resilience, read scale, and flexible capacity help teams protect customer experiences while matching the platform to changing demand.",
    help: [
      ["Single-node recovery", "OCI can recover a single-node database system onto newly provisioned compute while preserving its endpoint. Use this posture for development, test, or noncritical production workloads."],
      ["Multi-node high availability", "A multi-node database system has a primary plus read replicas. OCI can promote a replica after a fault, and regional placement helps tolerate availability-domain disruption."],
      ["Reader endpoints", "A reader endpoint provides a single read-only access point for application read traffic across replica nodes. The primary retains the read/write endpoint."],
      ["Capacity choices", "Database-optimized storage scales as data changes. Compute shapes and storage performance tiers are selected and adjusted to match workload needs."],
      ["HA and DR are different", "In-region high availability addresses node or availability-domain faults. The DR page addresses backup recovery, point-in-time recovery, and cross-region continuity."],
    ],
    references: [
      ["High availability and business continuity", availabilitySource],
      ["OCI PostgreSQL service overview", serviceOverviewSource],
      ["Create a database system", createDatabaseSource],
    ],
    render: renderAvailability,
  },
  dr: {
    title: "Disaster recovery",
    eyebrow: "Backup, point-in-time recovery, warm standby",
    nav: "DR",
    icon: "cloud-cog",
    pill: "Business continuity",
    heroTitle: "Make recovery readiness operational, not theoretical.",
    summary:
      "Recovery choices determine potential data loss, service restoration effort, and how confidently teams respond to outages or operational mistakes.",
    help: [
      ["Backup copies", "OCI Database with PostgreSQL backups can be manual or scheduled, stored remotely, copied to another region, and used to provision a new database system when the primary is unavailable."],
      ["Point-in-time recovery", "Point-in-time recovery retains WAL and periodic backups so OCI can create a new database system at a chosen timestamp within the active recovery window. It is useful for accidental deletion, incorrect deployments, and logical corruption; the original system remains unchanged."],
      ["RPO and RTO", "RPO is the acceptable amount of data loss; RTO is the acceptable time to restore service. Backup RPO depends on the backup schedule, while Warm Standby can bound RPO when enforcement is enabled."],
      ["Planning targets", "The RPO and RTO values shown in this demo are illustrative planning targets, not OCI service guarantees. Validate them against database size, network readiness, application cutover, and a tested runbook."],
      ["Warm standby roles", "Warm Standby maintains a read/write primary and a continuously updated read-only standby. The primary streams write-ahead logs to the standby until an operator promotes, converts, or switches over."],
      ["RPO enforcement", "This Warm Standby protection control can switch the primary to read-only when replication lag exceeds the selected RPO, constraining potential data loss while also constraining writes. OCI supports 5 minutes to 3 hours; the default threshold is 5 minutes."],
      ["Manual failover", "OCI does not provide automatic failover for Warm Standby. An operator must perform the DR promotion, conversion, or switchover workflow and redirect application traffic."],
    ],
    references: [
      ["Warm Standby replication", warmStandbySource],
      ["Database system backups", backupSource],
      ["Point-in-time recovery", pointInTimeRecoverySource],
    ],
    render: renderDR,
  },
  migration: {
    title: "Migration playbook",
    eyebrow: "Dump, logical replication, GoldenGate",
    nav: "Migration",
    icon: "git-branch",
    pill: "Move with confidence",
    heroTitle: "Migrate PostgreSQL workloads to OCI confidently.",
    summary:
      "Choose a migration path that balances downtime, transfer time, and operational risk while protecting production workloads.",
    help: [
      ["pg_dump and pg_restore", "PostgreSQL client utilities that export and recreate database objects and data. They suit controlled migrations where a planned outage is acceptable."],
      ["Native logical replication", "Built-in PostgreSQL publication and subscription replication that keeps DML synchronized before a low-downtime cutover. Schema, DDL, and sequence state must be coordinated separately."],
      ["pglogical", "An OCI-supported extension for advanced replication scopes and topologies. It must be enabled in OCI configuration and still needs active DDL coordination."],
      ["GoldenGate Initial Load + CDC", "Oracle GoldenGate can load an initial data set and continuously capture and apply source changes until the target catches up for cutover."],
      ["Major-version upgrades", "Use the same planning discipline for version changes: assess compatibility, handle roles separately, rehearse the cutover, validate data and application behavior, then refresh statistics."],
      ["Cutover validation", "Before redirecting traffic, compare data, verify roles and application connectivity, confirm replication has caught up, and retain a tested rollback path."],
      ["Source and target readiness", "Check network access, compatible PostgreSQL versions and extensions, role privileges, logical replication settings, WAL capacity, and target sizing before migration."],
    ],
    references: [
      ["OCI PostgreSQL migration guide", migrationSource],
      ["Native logical replication guidance", nativeLogicalReplicationSource],
      ["pglogical migration guidance", pglogicalSource],
      ["Supported OCI PostgreSQL extensions", supportedSource],
    ],
    render: renderMigration,
  },
  ai: {
    title: "AI matching",
    eyebrow: "pgvector + pg_trgm",
    nav: "AI Matching",
    icon: "sparkles",
    pill: "Semantic experiences",
    heroTitle: "Make AI answers relevant and governed.",
    summary:
      "Keeping retrieval beside operational data improves answer relevance, preserves governance, and gives customers more useful next steps.",
    help: [
      ["pgvector", "Adds a vector type and similarity operators, so embeddings can live beside customer, product, and transaction records."],
      ["pg_trgm", "Provides trigram matching and indexes that rescue misspellings, partial names, and imperfect customer-entered text."],
      ["Embeddings", "AI models turn text, images, documents, and events into numeric vectors. pgvector lets PostgreSQL compare those vectors to find items with similar meaning or visual content."],
      ["RAG and agents", "Retrieval-augmented generation and agent workflows need trusted context. PostgreSQL can retrieve governed rows, documents, and customer memory before an answer or action is produced."],
      ["Why this stands out", "The demo keeps AI relevance close to governed data instead of copying every customer signal into a separate search-only platform."],
    ],
    render: renderAi,
  },
  observe: {
    title: "Observability",
    eyebrow: "Metrics, query insights, tuning, operations",
    nav: "Observability",
    icon: "activity",
    pill: "Operational confidence",
    heroTitle: "Detect risk, understand cause, and improve with evidence.",
    summary:
      "OCI telemetry, Query Insights, PostgreSQL workload evidence, and planned operations connect customer impact to a clear next action.",
    help: [
      ["OCI service metrics", "OCI emits PostgreSQL metrics in the oci_postgresql namespace for health, capacity, and performance. Metrics are available without enabling a separate database agent."],
      ["Query Insights", "OCI Query Insights shows average active sessions, wait events, and top queries for tuning, capacity planning, and daily administration. Enabling or disabling it restarts the database system and uses compute resources."],
      ["PostgreSQL workload evidence", "pg_stat_statements identifies costly normalized SQL; pg_buffercache and pgstattuple add cache and bloat context; pg_repack supports lower-disruption maintenance."],
      ["Alarms and notifications", "Use Monitoring thresholds and Notifications to route actionable signals to the teams responsible for service health."],
      ["Logs and events", "PostgreSQL logs, including pgaudit output, can be exported to OCI Logging or Object Storage. OCI events can route resource-state changes to operational workflows."],
      ["Managed configuration", "Use configurations to manage supported PostgreSQL settings consistently across database systems; validate settings and application behavior before rollout."],
      ["Maintenance windows", "OCI management policies let teams choose a maintenance schedule that avoids peak activity. Applications should still use connection retries for planned node work."],
      ["Grafana options", "Grafana can visualize OCI Monitoring metrics through the OCI data source, or visualize PostgreSQL Exporter metrics collected by Prometheus. These are external monitoring architectures, not built-in showcase integrations."],
    ],
    references: [
      ["OCI PostgreSQL metrics", metricsSource],
      ["OCI PostgreSQL Query Insights", queryInsightsSource],
      ["OCI PostgreSQL logging", loggingSource],
      ["OCI PostgreSQL maintenance", maintenanceSource],
      ["OCI data source for Grafana", grafanaSource],
      ["OCI PostgreSQL with Prometheus and Grafana", prometheusGrafanaSource],
    ],
    render: renderObservability,
  },
  location: {
    title: "Location intelligence",
    eyebrow: "PostGIS",
    nav: "Location",
    icon: "map",
    pill: "Spatial products",
    heroTitle: "Add geography to customer, asset, and service workflows.",
    summary:
      "PostGIS keeps proximity, coverage, and eligibility decisions close to operational data, while AI can interpret requests and explain the resulting recommendation.",
    help: [
      ["PostGIS", "Adds geometry and geography types, GiST spatial indexes, and functions for distance, containment, intersection, and coverage decisions."],
      ["Geometry and geography", "Use geography for global latitude/longitude distance in metres. Use geometry with an appropriate projected coordinate system for local, planar analysis and broader spatial operations."],
      ["AI boundary", "AI can interpret a customer request and explain a recommendation. PostGIS and explicit availability, capability, and policy rules determine which candidates are eligible."],
      ["OCI enablement", "PostGIS must be enabled through an OCI custom configuration, and Oracle currently permits PostGIS-related extensions only in the OC1 realm."],
      ["Customer value", "Spatial functions turn everyday records into location-aware products: field-service dispatch, coverage checks, branch planning, delivery inputs, and risk-zone analysis."],
    ],
    render: renderLocation,
  },
  operations: {
    title: "Lifecycle automation",
    eyebrow: "pg_cron + pg_partman",
    nav: "Automation",
    icon: "calendar-clock",
    pill: "Data lifecycle",
    heroTitle: "Keep data healthy without downtime.",
    summary:
      "Automated lifecycle work protects performance and controls data growth without pulling teams away from customer-facing product work.",
    help: [
      ["pg_cron", "Schedules SQL jobs from inside PostgreSQL, including rollups, refreshes, retention policies, and operational checks."],
      ["pg_partman", "Automates time-based and serial-based partition management so high-volume tables stay predictable as they grow."],
      ["pg_repack", "Pairs well with automation when teams want recurring bloat cleanup with minimal application interruption."],
    ],
    render: renderOperations,
  },
  trust: {
    title: "Security and governance",
    eyebrow: "IAM, private networking, data controls",
    nav: "Security",
    icon: "shield-check",
    pill: "Controls by design",
    heroTitle: "Protect data without slowing teams down.",
    summary:
      "OCI platform controls and PostgreSQL data controls work together to keep access private, auditable, and useful for governed products.",
    help: [
      ["OCI IAM and compartments", "IAM policies and compartments control who can manage OCI PostgreSQL resources. PostgreSQL roles separately govern access inside the database."],
      ["Private connectivity", "OCI PostgreSQL database system endpoints use private IP addresses in a VCN. Network security groups and subnet rules control which clients can reach them."],
      ["Vault and encryption", "Administrator credentials can be stored in OCI Vault. OCI PostgreSQL encrypts data in transit and at rest; customers still govern application secrets and database roles."],
      ["pgaudit", "Produces detailed audit logs for database activity, supporting accountability and regulated access reviews."],
      ["pgcrypto", "Adds cryptographic functions for hashing, random values, and encryption workflows handled close to the data."],
      ["postgres_fdw", "Lets PostgreSQL query remote PostgreSQL tables through foreign data wrappers, useful for governed federation and phased consolidation."],
      ["pglogical", "Supports logical replication patterns where organizations need data distribution or migration pathways."],
    ],
    references: [
      ["Create a database system", createDatabaseSource],
      ["OCI PostgreSQL service overview", serviceOverviewSource],
      ["OCI PostgreSQL logging", loggingSource],
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
    ["network", "Availability and scale", "Multi-node availability, reader endpoints, and flexible capacity make the managed service ready for production demand.", "HA", "read scale", "teal"],
    ["cloud-cog", "Disaster recovery", "Backup and restore, cross-region backup copies, warm standby replication, RPO guardrails, and switchover storylines.", "Warm Standby", "Backups", "red"],
    ["git-branch", "Migration", "Choose dump and restore, native logical replication, or GoldenGate CDC for an OCI move with an explicit cutover posture.", "cutover", "validation", "amber"],
    ["activity", "Observability", "Connect OCI metrics, Query Insights, PostgreSQL evidence, and operating actions to protect customer experience.", "Query Insights", "Grafana", "green"],
    ["shield-check", "Security and governance", "Combine IAM, private connectivity, Vault, auditing, encryption, and federated data access.", "IAM", "pgaudit", "violet"],
    ["sparkles", "AI and search", "Recommendations, answer retrieval, support article matching, and next-best action powered by embeddings.", "pgvector", "pg_trgm", "teal"],
    ["gauge", "Workload health", "High-cost SQL, bloat, cache pressure, and measured tuning impact for operational reviews.", "pg_stat_statements", "pg_repack", "amber"],
    ["map", "Spatial products", "Nearest asset, coverage zone, branch planning, service territory, and risk overlay experiences.", "PostGIS", "OC1 note", "red"],
    ["calendar-clock", "Lifecycle automation", "Scheduled retention, partition creation, rollups, and maintenance workflows kept close to the data.", "pg_cron", "pg_partman", "green"],
    ["database", "Live database lab", "Optional backend mode that checks real extension availability and runs curated demo queries.", "DATABASE_URL", "safe API", "green"],
  ];

  return `
    <div class="metric-strip">
      ${metric("3", "managed platform stories")}
      ${metric("6", "differentiated workload stories")}
      ${metric("2", "continuity playbooks")}
      ${metric("1", "optional connected lab")}
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

function availabilityNode(iconName, titleText, copy, tone, badge) {
  return `<article class="availability-node ${tone}"><span class="availability-badge">${badge}</span><i data-lucide="${iconName}" aria-hidden="true"></i><strong>${titleText}</strong><small>${copy}</small></article>`;
}

function renderAvailability() {
  return `
    <section class="scenario-panel availability-architecture">
      <div class="panel-heading"><div><p class="eyebrow">In-region service architecture</p><h3>Serve writes, scale reads, recover from faults</h3></div><span class="tag">Managed database system</span></div>
      <div class="availability-diagram" role="img" aria-label="Applications connect through read write and reader endpoints to an OCI PostgreSQL primary and read replicas using shared database optimized storage">
        <article class="availability-client"><i data-lucide="app-window" aria-hidden="true"></i><strong>Applications</strong><span>Transaction and read traffic</span></article>
        <div class="availability-endpoints"><span><i data-lucide="arrow-right" aria-hidden="true"></i>Read/write endpoint</span><span><i data-lucide="arrow-right" aria-hidden="true"></i>Reader endpoint</span></div>
        ${availabilityNode("database", "Primary node", "Writes and primary reads", "primary", "RW")}
        <div class="availability-replica-group">${availabilityNode("database", "Read replica", "Reader endpoint traffic", "replica", "RO")}${availabilityNode("database", "Read replica", "Eligible for promotion", "replica", "RO")}</div>
        <article class="availability-storage"><i data-lucide="hard-drive" aria-hidden="true"></i><div><strong>OCI database-optimized storage</strong><span>Shared storage that scales independently of compute</span></div><b>Regional durability</b></article>
      </div>
      <aside class="availability-boundary"><i data-lucide="split" aria-hidden="true"></i><div><strong>High availability is not cross-region DR</strong><p>Multi-node placement protects in-region service continuity. Use the DR playbook for recovery from data loss or regional disruption.</p></div><span class="tag">Different decisions</span></aside>
    </section>

    <div class="grid two-col availability-detail-grid">
      <section class="scenario-panel"><div class="panel-heading"><div><p class="eyebrow">Choose the service posture</p><h3>Match resilience to business impact</h3></div></div><div class="mini-stack">${mini("Single node", "Use for development, test, or noncritical workloads where restored service is sufficient and read scale is not required.", "Simple")}${mini("Multi-node HA", "Use a primary plus replicas when customer-facing availability needs automatic in-region promotion after a node fault.", "Resilient")}${mini("Regional placement", "Use nodes across availability domains where the workload must tolerate an availability-domain disruption.", "Stronger continuity")}</div></section>
      <section class="scenario-panel"><div class="panel-heading"><div><p class="eyebrow">Scale deliberately</p><h3>Change the resource that is constrained</h3></div></div><div class="mini-stack">${mini("Read scale", "Add read replicas and use the reader endpoint when read traffic is the limiting workload.", "Replica nodes")}${mini("Compute and temporary capacity", "Select flexible compute shapes and performance tiers to fit CPU, memory, temporary files, and I/O demand.", "Right-size")}${mini("Data and WAL storage", "Database-optimized storage grows with managed database data; monitor WAL and workload behavior as capacity changes.", "Auto-scale storage")}</div></section>
    </div>

    ${tradeoffPanel(
      [["Protect customer-facing service", "Use in-region HA and reader endpoints to keep critical workloads available and responsive."], ["Scale with demand", "Separate read scaling, compute sizing, and managed storage choices so teams can target the real constraint."]],
      [["More nodes need a routing plan", "Applications must direct writes to the primary and suitable reads to the reader endpoint."], ["High availability does not replace recovery planning", "Keep backup, point-in-time recovery, and cross-region decisions explicit for data-loss and regional scenarios."]],
    )}
  `;
}

const drPatternData = {
  backup: {
    label: "Backup & Restore", title: "Recover from a valid backup copy",
    copy: "Keep OCI-managed backups in the primary region, copy them to the recovery region, and provision a replacement database system when recovery is needed.",
    indicators: [["RPO target", "24 hours with daily backups", "amber"], ["RTO target", "4–8 hours", "amber"], ["Recovery action", "Provision replacement database", "red"]],
    runbook: [["01", "Select a valid recovery point", "Choose the backup copy that meets the recovery objective.", "warn"], ["02", "Provision in the recovery region", "Create a replacement database system from the copied backup.", "warn"], ["03", "Redirect application traffic", "Point the application to the recovered database endpoint.", "hot"], ["04", "Validate and re-establish protection", "Confirm service and restore backup protection for the new primary.", "ok"]],
  },
  pitr: {
    label: "Point-in-Time Recovery", title: "Recover to just before an unwanted change",
    copy: "With point-in-time recovery enabled, OCI retains WAL and periodic backups. Choose a timestamp in the active recovery window to create a new database system at that exact point while the original system remains unchanged.",
    indicators: [["RPO target", "15 minutes", "teal"], ["RTO target", "1–3 hours", "amber"], ["Recovery point", "Chosen time in active window", "teal"]],
    runbook: [["01", "Confirm the recovery window", "Verify point-in-time recovery is active and the desired time is within the configured restore days.", "warn"], ["02", "Choose a timestamp", "Select a point just before the accidental deletion, deployment, or corruption.", "warn"], ["03", "Create and validate the new database", "Provision the point-in-time database system and confirm its state.", "hot"], ["04", "Redirect traffic and protect again", "Cut the application over when validated, then confirm the new system's recovery policy.", "ok"]],
  },
  warm: {
    label: "Warm Standby", title: "Keep a read-only database ready for DR action",
    copy: "The primary continuously streams WAL to a read-only standby in another region. OCI requires a manual conversion or promotion and application cutover; it does not provide automatic failover.",
    indicators: [["RPO target", "5 minutes, enforced", "teal"], ["RTO target", "30–60 minutes, manual", "amber"], ["Standby role", "Read-only until promotion", "teal"]],
    runbook: [["01", "Detect the outage", "Confirm the primary region cannot serve application traffic.", "hot"], ["02", "Convert or promote standby", "Manually make the recovery-region database the active system.", "warn"], ["03", "Redirect application traffic", "Move the application to the new primary endpoint and validate service.", "hot"], ["04", "Rebuild protection", "Rebuild the original region as standby; optionally switch back when ready.", "ok"]],
  },
};

function renderDR() {
  return `
    <section class="scenario-panel dr-playbook">
      <div class="panel-heading dr-playbook-heading"><div><p class="eyebrow">DR playbook</p><h3>Choose the recovery approach</h3></div>
        <div class="segmented" role="tablist" aria-label="Disaster recovery approaches"><button class="chip" type="button" role="tab" aria-selected="false" data-dr-pattern="backup">Backup &amp; Restore</button><button class="chip" type="button" role="tab" aria-selected="false" data-dr-pattern="pitr">Point-in-Time Recovery</button><button class="chip active" type="button" role="tab" aria-selected="true" data-dr-pattern="warm">Warm Standby</button></div>
      </div>
    </section>
    <div id="dr-pattern-demo"></div>
    <section class="scenario-panel dr-comparison" aria-labelledby="dr-comparison-title"><div class="panel-heading"><div><p class="eyebrow">At a glance</p><h3 id="dr-comparison-title">Recovery comparison</h3></div></div><p class="dr-pattern-copy">Illustrative planning targets, not OCI guarantees. Validate against database size, network readiness, and a tested application cutover.</p>
      <div class="dr-comparison-scroll"><table><thead><tr><th>Recovery option</th><th>Best fit</th><th>RPO target</th><th>RTO target</th><th>Operator runbook</th></tr></thead><tbody>
        <tr><th>Backup &amp; Restore</th><td>Durable recovery points and regional recovery</td><td>24 hours with daily backups</td><td>4–8 hours</td><td>Restore, cut over traffic, validate, protect again</td></tr>
        <tr><th>Point-in-Time Recovery</th><td>Accidental deletion, bad deployments, or logical corruption</td><td>15 minutes</td><td>1–3 hours</td><td>Select timestamp, create new database, validate, cut over</td></tr>
        <tr><th>Warm Standby</th><td>Regional continuity with a ready standby</td><td>5 minutes, enforced</td><td>30–60 minutes, manual</td><td>Promote or convert, cut over traffic, rebuild standby</td></tr>
      </tbody></table></div>
    </section>
  `;
}

function renderDRPattern(pattern) {
  const data = drPatternData[pattern] || drPatternData.warm;
  const diagram = pattern === "backup"
    ? `<div class="dr-diagram backup-diagram" aria-label="Backup and restore flow from primary database through OCI-managed and cross-region backups to a replacement database">${drDiagramNode("database", "Primary database", "Read/write", "primary")}${drDiagramArrow("Backup")}${drDiagramNode("archive-restore", "OCI-managed backup", "Recovery point", "backup")}${drDiagramArrow("Cross-region copy")}${drDiagramNode("copy", "Recovery-region copy", "Available for restore", "backup")}${drDiagramArrow("Provision")}${drDiagramNode("database-backup", "Replacement database", "Recovery region", "recovery")}</div>`
    : pattern === "pitr"
      ? `<div class="dr-diagram pitr-diagram" aria-label="Point-in-time recovery flow from the source database through retained WAL and backups to a selected timestamp and a new database system">${drDiagramNode("database", "Source database", "Current state remains", "primary")}${drDiagramArrow("Retain WAL")}${drDiagramNode("history", "WAL and backups", "Active recovery window", "backup")}${drDiagramArrow("Select time")}${drDiagramNode("clock-3", "Chosen timestamp", "Just before the change", "recovery")}${drDiagramArrow("Create")}${drDiagramNode("database-backup", "New database", "Validate and cut over", "recovery")}</div>`
      : `<div class="dr-diagram warm-diagram" aria-label="Read write primary streaming WAL to a read only warm standby"><div class="dr-region-card primary"><span class="region-label">Primary region</span><i data-lucide="database" aria-hidden="true"></i><strong>OCI PostgreSQL</strong><small>Read/write primary</small><b>RW</b></div><div class="replication-lane"><span class="wal-line"></span><span class="wal-pulse pulse-one"></span><span class="wal-pulse pulse-two"></span><span class="wal-pulse pulse-three"></span><p>Animated WAL stream</p></div><div class="dr-region-card standby"><span class="region-label">Recovery region</span><i data-lucide="database" aria-hidden="true"></i><strong>OCI PostgreSQL</strong><small>Read-only standby</small><b>RO</b></div></div>`;
  return `
    <section class="scenario-panel dr-pattern-panel"><div class="panel-heading"><div><p class="eyebrow">Recovery pattern</p><h3>${data.title}</h3></div><span class="tag">${data.label}</span></div><p class="dr-pattern-copy">${data.copy}</p>${diagram}
      ${pattern === "warm" ? `<aside class="rpo-control"><i data-lucide="shield-check" aria-hidden="true"></i><div><strong>RPO enforcement is a protection control</strong><p>When enabled, it switches the primary to read-only if lag exceeds the selected RPO, constraining potential data loss and also constraining writes. OCI supports 5 minutes to 3 hours; the default is 5 minutes.</p></div><span class="tag">Enabled · 5 min default</span></aside>` : ""}
      <div class="dr-indicators">${data.indicators.map(([label, value, tone]) => `<article class="dr-indicator ${tone}"><span>${label}</span><strong>${value}</strong></article>`).join("")}</div>
    </section>
    <div class="grid two-col dr-detail-grid"><section class="scenario-panel"><div class="panel-heading"><div><p class="eyebrow">Operator runbook</p><h3>${data.label} recovery steps</h3></div></div><div class="timeline">${data.runbook.map(([step, titleText, copy, tone]) => drEvent(step, titleText, copy, tone)).join("")}</div></section>
      <section class="code-panel dr-guidance"><div class="panel-heading"><div><p class="eyebrow">Recovery indicators</p><h3>Illustrative planning targets</h3></div></div><pre><code>${pattern === "backup" ? "Backup & Restore\n\nRPO target: 24 hours\n            (daily backups)\nRTO target: 4–8 hours\nIncludes restore and cutover" : pattern === "pitr" ? "Point-in-Time Recovery\n\nRPO target: 15 minutes\nRTO target: 1–3 hours\nChoose a time inside the window\nCreate, validate, and cut over" : "Warm Standby\n\nRPO target: 5 minutes enforced\nRTO target: 30–60 minutes\nManual promotion and cutover\nFailover: not automatic"}</code></pre></section></div>`;
}

function drDiagramNode(iconName, titleText, copy, tone) {
  return `<article class="dr-flow-node ${tone}"><i data-lucide="${iconName}" aria-hidden="true"></i><strong>${titleText}</strong><span>${copy}</span></article>`;
}

function drDiagramArrow(label) {
  return `<div class="dr-flow-arrow"><span>${label}</span><i data-lucide="arrow-right" aria-hidden="true"></i></div>`;
}

const migrationPatternData = {
  dump: {
    label: "pg_dump & restore",
    title: "Move with a planned outage",
    copy: "Use PostgreSQL client utilities to export roles, schema, and data, then restore them into OCI Database with PostgreSQL during a controlled migration window.",
    indicators: [["Illustrative size", "Up to 100 GB", "teal"], ["Downtime posture", "Planned outage", "amber"], ["Migration tool", "pg_dump + pg_restore", "teal"]],
    runbook: [["01", "Assess compatibility", "Inventory extensions, roles, tablespaces, and the target network path.", "warn"], ["02", "Export roles, schema, and data", "Create reviewed dumps from the source before the migration window.", "warn"], ["03", "Restore and remediate", "Load objects into OCI, resolve privilege or object differences, then refresh statistics.", "hot"], ["04", "Validate and cut over", "Compare data, test the application, then redirect production traffic.", "ok"]],
    checklist: "pg_dump & restore\n\n[ ] Export global roles separately\n[ ] Review SUPERUSER and tablespace commands\n[ ] Restore schema before data\n[ ] Validate counts and application paths\n[ ] Run VACUUM ANALYZE after load",
  },
  native: {
    label: "Native logical replication",
    title: "Replicate DML before cutover",
    copy: "Use PostgreSQL's built-in publication and subscription replication to keep a prepared OCI target synchronized while the source remains active, then complete a low-downtime cutover after the target catches up.",
    indicators: [["Size guidance", "No fixed size tier", "teal"], ["Downtime posture", "Low cutover downtime", "amber"], ["Migration tool", "PostgreSQL publication + subscription", "teal"]],
    runbook: [["01", "Prepare source and target", "Confirm compatible versions, networking, logical WAL settings, replication privileges, and WAL/slot capacity.", "warn"], ["02", "Move schema and establish replication", "Restore schema and roles separately, then create the publication and subscription for the required tables.", "warn"], ["03", "Monitor catch-up", "Track replication lag, slot retention, DML errors, data checks, and the application change freeze.", "hot"], ["04", "Freeze writes and cut over", "Stop source writes and DDL changes, let the target catch up, validate sequences, then redirect traffic.", "ok"]],
    checklist: "Native logical replication\n\n[ ] Enable logical WAL and confirm replication privileges\n[ ] Restore compatible schema and roles before subscribing\n[ ] Plan DDL and sequence synchronization separately\n[ ] Monitor lag and replication slot retention\n[ ] Freeze writes and validate before cutover",
    pglogicalDecision: true,
  },
  goldengate: {
    label: "GoldenGate Initial Load + CDC",
    title: "Load at scale, then capture change",
    copy: "Use Oracle GoldenGate Initial Load plus change data capture to seed a large or complex target and continuously apply source changes until a near-zero-downtime cutover.",
    indicators: [["Illustrative size", "Over 1 TB or complex", "teal"], ["Downtime posture", "Near-zero cutover downtime", "amber"], ["Migration tool", "GoldenGate Initial Load + CDC", "teal"]],
    runbook: [["01", "Prepare source and target", "Verify networking, source logical replication settings, migration privileges, target schema, and GoldenGate connections.", "warn"], ["02", "Run Initial Load", "Start the initial load extract and Replicat to populate the OCI target.", "warn"], ["03", "Run CDC and reconcile", "Start change capture, monitor lag, and compare target data before the cutover window.", "hot"], ["04", "Freeze writes and cut over", "Allow CDC to catch up, validate the target, then move application traffic to OCI.", "ok"]],
    checklist: "GoldenGate Initial Load + CDC\n\n[ ] Create source and target connections\n[ ] Prepare schema and checkpoint table\n[ ] Start Initial Load before CDC Replicat\n[ ] Reconcile counts and change lag\n[ ] Retain rollback and validation runbooks",
  },
};

function renderMigration() {
  return `
    <section class="scenario-panel migration-playbook">
      <div class="panel-heading migration-playbook-heading">
        <div><p class="eyebrow">Migration playbook</p><h3>Choose the migration approach</h3></div>
        <div class="segmented" role="tablist" aria-label="PostgreSQL migration approaches">
          <button class="chip active" type="button" role="tab" aria-selected="true" data-migration-pattern="dump">pg_dump &amp; restore</button>
          <button class="chip" type="button" role="tab" aria-selected="false" data-migration-pattern="native">Native logical replication</button>
          <button class="chip" type="button" role="tab" aria-selected="false" data-migration-pattern="goldengate">GoldenGate + CDC</button>
        </div>
      </div>
    </section>

    <section class="scenario-panel migration-comparison" aria-labelledby="migration-comparison-title">
      <div class="panel-heading"><div><p class="eyebrow">At a glance</p><h3 id="migration-comparison-title">Migration method comparison</h3></div></div>
      <p class="migration-copy">Illustrative selection guidance, not OCI limits or guarantees. Size informs initial-load planning; choose native replication or pglogical by the required replication scope and topology.</p>
      <div class="migration-comparison-scroll"><table><thead><tr><th>Migration method</th><th>Illustrative size</th><th>Downtime posture</th><th>Best fit</th><th>Operational tradeoff</th></tr></thead><tbody>
        <tr><th>pg_dump &amp; restore</th><td>Up to 100 GB</td><td>Planned outage</td><td>Simple, controlled moves</td><td>Transfer and restore occur inside the cutover window</td></tr>
        <tr><th>Native logical replication</th><td>No fixed size tier</td><td>Low cutover downtime</td><td>Standard one-way PostgreSQL migrations</td><td>Schema, DDL, and sequences are moved and verified separately</td></tr>
        <tr><th>GoldenGate Initial Load + CDC</th><td>Over 1 TB or complex</td><td>Near-zero cutover downtime</td><td>Large or complex migrations with continuous change capture</td><td>Highest operational setup and reconciliation effort</td></tr>
      </tbody></table></div>
    </section>

    <div id="migration-pattern-demo"></div>

    <section class="scenario-panel migration-upgrade-readiness">
      <div class="panel-heading"><div><p class="eyebrow">Major-version upgrade readiness</p><h3>Use the migration playbook for planned upgrades</h3></div><span class="tag">Test before cutover</span></div>
      <div class="grid two-col"><div class="mini-stack">${mini("Planned upgrade", "Use pg_dump and pg_restore when a controlled switchover window is acceptable. Move roles separately and validate applications before redirecting traffic.", "pg_dump + restore")}${mini("Low-downtime upgrade", "Use pglogical only when its tested replication capabilities justify the added extension configuration and operating complexity.", "pglogical")}</div><div class="code-panel migration-upgrade-checklist"><div class="panel-heading"><div><p class="eyebrow">Always validate</p><h3>Upgrade control points</h3></div></div><pre><code>[ ] Confirm target version and extensions&#10;[ ] Export and validate roles separately&#10;[ ] Rehearse application compatibility&#10;[ ] Compare data before cutover&#10;[ ] Refresh statistics after restore</code></pre></div></div>
    </section>

    <section class="scenario-panel migration-watchouts">
      <div class="panel-heading"><div><p class="eyebrow">Migration watch-outs</p><h3>Resolve these before cutover</h3></div></div>
      <div class="grid two-col migration-watchout-grid">
        ${mini("Extensions and versions", "Verify compatible PostgreSQL versions and extensions. Enable pglogical in OCI configuration only when its advanced capabilities are needed.", "Compatibility")}
        ${mini("Roles and tablespaces", "Review role privileges, SUPERUSER commands, password handling, and OCI in-place tablespace constraints.", "Access")}
        ${mini("Replication readiness", "Confirm logical WAL settings, replication privileges, slots, storage capacity, and lag monitoring on the source.", "Continuity")}
        ${mini("Schema and application cutover", "Native replication does not carry schema, DDL, or sequence state; validate those alongside triggers, networking, application paths, and rollback steps.", "Validation")}
      </div>
    </section>
  `;
}

function renderMigrationPattern(pattern) {
  const data = migrationPatternData[pattern] || migrationPatternData.dump;
  const diagram = renderMigrationDiagram(pattern);
  return `
    <section class="scenario-panel migration-pattern-panel">
      <div class="panel-heading"><div><p class="eyebrow">Migration profile</p><h3>${data.title}</h3></div><span class="tag">${data.label}</span></div>
      <p class="migration-copy">${data.copy}</p>${diagram}
      <div class="migration-indicators">${data.indicators.map(([label, value, tone]) => `<article class="migration-indicator ${tone}"><span>${label}</span><strong>${value}</strong></article>`).join("")}</div>
    </section>
    <div class="grid two-col migration-detail-grid">
      <section class="scenario-panel"><div class="panel-heading"><div><p class="eyebrow">Sample runbook</p><h3>${data.label} migration steps</h3></div></div><div class="timeline">${data.runbook.map(([step, titleText, copy, tone]) => drEvent(step, titleText, copy, tone)).join("")}</div></section>
      <section class="code-panel migration-guidance"><div class="panel-heading"><div><p class="eyebrow">Cutover checklist</p><h3>Validate before traffic moves</h3></div></div><pre><code>${data.checklist}</code></pre></section>
    </div>
    ${data.pglogicalDecision ? `<section class="scenario-panel migration-advanced-option"><div class="panel-heading"><div><p class="eyebrow">Advanced alternative</p><h3>When pglogical is worth it</h3></div><span class="tag">Use intentionally</span></div><div class="grid two-col migration-decision-grid">${mini("Choose pglogical for", "Selective table, row, or column replication; advanced multi-provider or bidirectional topologies; conflict-handling needs; or a tested cross-version migration workflow.", "Capability")}${mini("Accept the tradeoff", "Enable and operate the OCI extension, manage added replication complexity, and continue to coordinate and validate DDL changes before cutover.", "Operations")}</div></section>` : ""}
  `;
}

function migrationDiagramNode(iconName, titleText, copy, tone, badge) {
  return `<article class="migration-diagram-node ${tone}"><span class="migration-node-badge">${badge}</span><i data-lucide="${iconName}" aria-hidden="true"></i><strong>${titleText}</strong><span>${copy}</span></article>`;
}

function migrationFlowTokens() {
  return `<span class="migration-flow-token one"></span><span class="migration-flow-token two"></span><span class="migration-flow-token three"></span><i data-lucide="arrow-right" aria-hidden="true"></i>`;
}

function migrationDiagramLink(label) {
  return `<div class="migration-flow-link"><div class="migration-flow-track" aria-hidden="true">${migrationFlowTokens()}</div><small>${label}</small></div>`;
}

function renderMigrationDiagram(pattern) {
  if (pattern === "native") {
    return `<div class="migration-diagram migration-native-diagram" role="img" aria-label="Source PostgreSQL publication streaming DML changes to an OCI PostgreSQL subscription">${migrationDiagramNode("database", "Source PostgreSQL", "Publication · DML changes", "source", "PUB")}<div class="migration-replication-lane"><span class="migration-lane-label">Publication to subscription</span><div class="migration-flow-track" aria-hidden="true">${migrationFlowTokens()}</div><p>Animated DML stream</p></div>${migrationDiagramNode("database", "OCI PostgreSQL", "Subscription · ready to cut over", "target", "SUB")}</div>`;
  }

  if (pattern === "goldengate") {
    return `<div class="migration-diagram migration-goldengate-diagram" role="img" aria-label="Source PostgreSQL loading OCI PostgreSQL through Oracle GoldenGate initial load and continuous change data capture">${migrationDiagramNode("database", "Source PostgreSQL", "Production writes continue", "source", "SRC")}<div class="migration-goldengate-lane"><strong>GoldenGate</strong><div class="migration-goldengate-track initial"><span>Initial Load</span><div class="migration-flow-track" aria-hidden="true">${migrationFlowTokens()}</div></div><div class="migration-goldengate-track cdc"><span>CDC</span><div class="migration-flow-track" aria-hidden="true">${migrationFlowTokens()}</div></div></div>${migrationDiagramNode("database", "OCI PostgreSQL", "Initial load + changes applied", "target", "OCI")}</div>`;
  }

  return `<div class="migration-diagram migration-dump-diagram" role="img" aria-label="Source PostgreSQL exporting a dump archive that is transferred and restored into OCI PostgreSQL">${migrationDiagramNode("database", "Source PostgreSQL", "Roles, schema, and data", "source", "SRC")}${migrationDiagramLink("Export")}${migrationDiagramNode("file-archive", "Dump archive", "Reviewed migration package", "package", "DUMP")}${migrationDiagramLink("Transfer")}${migrationDiagramNode("database-backup", "OCI PostgreSQL", "Restore and validate", "target", "OCI")}</div>`;
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
          ${loadingCard("Write role")}
          ${loadingCard("Server version")}
          ${loadingCard("Connected user")}
        </div>
        <div class="live-health-snapshot">
          <div class="live-health-heading"><p class="eyebrow">Operational snapshot</p><span>Read-only database metrics</span></div>
          <div class="live-health-grid" id="live-health-snapshot">
            ${healthSnapshotLoadingCards()}
          </div>
          <p class="live-connection-distribution" id="live-connection-distribution" hidden></p>
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

    <section class="scenario-panel ai-spatial-bridge">
      <div>
        <p class="eyebrow">Spatial-aware AI</p>
        <h3>Let AI understand the request; let PostGIS prove the recommendation.</h3>
        <p>For dispatch and serviceability journeys, use AI to interpret intent and explain the outcome while PostGIS applies proximity, coverage, and policy-grounded candidate rules.</p>
      </div>
      <a class="chip" href="#location"><i data-lucide="map" aria-hidden="true"></i>Explore Location intelligence</a>
    </section>

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

    ${tradeoffPanel(
      [
        ["Grounded, relevant answers", "Retrieve customer, policy, and product context close to operational data."],
        ["Resilient intent matching", "Combine semantic and fuzzy retrieval for different wording, typos, and partial terms."],
      ],
      [
        ["Retrieval quality needs stewardship", "Embedding choices and source content need review as products and policies change."],
        ["Governance still applies", "Results must respect data access boundaries before reaching users or agents."],
      ],
    )}
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

function tradeoffPanel(benefits, considerations) {
  return `
    <section class="scenario-panel tradeoff-panel">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Decision guide</p>
          <h3>Benefits and considerations</h3>
        </div>
      </div>
      <div class="grid two-col">
        <div>
          <div class="panel-heading"><div><p class="eyebrow">Benefits</p><h3>Why it matters</h3></div></div>
          <div class="mini-stack">${benefits.map(([titleText, copy]) => mini(titleText, copy, "Benefit")).join("")}</div>
        </div>
        <div>
          <div class="panel-heading"><div><p class="eyebrow">Considerations</p><h3>Plan for the tradeoffs</h3></div></div>
          <div class="mini-stack">${considerations.map(([titleText, copy]) => mini(titleText, copy, "Consider")).join("")}</div>
        </div>
      </div>
    </section>
  `;
}

const observabilityPatternData = {
  detect: {
    label: "Detect and alert",
    title: "Turn service signals into owned responses",
    copy: "Use OCI Monitoring metrics and alarms to detect customer-impacting conditions early, then route notifications to the team that owns the next action.",
    signals: [["Blocked queries", "Sessions waiting on other work", "contention"], ["Long-running queries", "Queries exceeding five minutes", "workload"], ["Read latency", "Storage-read responsiveness", "experience"], ["WAL storage", "Durability and replication capacity", "continuity"]],
    runbook: [["01", "Define the customer-impact signal", "Choose a metric and threshold that aligns to a real service risk, not an arbitrary dashboard target.", "warn"], ["02", "Create the alarm and route", "Use OCI Monitoring and Notifications to send a clear alert to the accountable operational owner.", "hot"], ["03", "Diagnose with evidence", "Use Query Insights, PostgreSQL workload signals, logs, and Live Lab context to identify the cause.", "warn"], ["04", "Improve the guardrail", "Update the runbook, capacity plan, or application behavior after the incident is understood.", "ok"]],
    guidance: "Detection boundary\n\nOCI Monitoring: service metrics and alarms\nQuery Insights: active sessions, waits, top queries\nLive Lab: read-only database context\nExternal dashboards: optional Grafana architectures\n\nValidate thresholds against normal traffic patterns.",
  },
  investigate: {
    label: "Investigate and improve",
    title: "Connect metrics, logs, changes, and maintenance",
    copy: "Use OCI logs, events, configurations, and planned maintenance together with PostgreSQL workload evidence to diagnose issues and prevent repeat incidents.",
    signals: [["PostgreSQL and audit logs", "Export to OCI Logging or Object Storage", "evidence"], ["OCI events", "Track resource-state changes", "change"], ["Configurations", "Apply supported settings consistently", "consistency"], ["Maintenance policy", "Choose a service window outside peak demand", "resilience"]],
    runbook: [["01", "Correlate the service change", "Check OCI events, maintenance activity, and application timing before assuming a database query is the cause.", "warn"], ["02", "Inspect logs and workload evidence", "Use exported PostgreSQL and audit logs with query, bloat, and connection evidence to narrow the diagnosis.", "hot"], ["03", "Test the improvement safely", "Validate configuration, capacity, or application changes in a representative non-production environment.", "warn"], ["04", "Standardize the operating model", "Capture the change in a configuration, maintenance policy, runbook, and monitoring rule where applicable.", "ok"]],
    guidance: "Operations boundary\n\nOCI Logging: service and audit evidence\nOCI Events: resource-state changes\nConfigurations: supported PostgreSQL settings\nMaintenance policy: planned service windows\n\nUse retries for planned node maintenance.",
  },
};

function renderObservability() {
  const queries = [
    ["customer_orders_rollup", "42% total time", "pg_stat_statements", "hot"],
    ["inventory_by_region", "18% cache misses", "pg_buffercache", "warn"],
    ["events_2026_q2", "31 GB reclaim", "pg_repack", "ok"],
  ];

  return `
    <section class="scenario-panel">
      <div class="panel-heading"><div><p class="eyebrow">Observability flow</p><h3>Move from signal to a safer next action</h3></div><span class="tag">Customer-impact first</span></div>
      <div class="grid four-col">${mini("Detect", "Use OCI service metrics, alarms, and notifications to identify customer-impacting conditions.", "OCI Monitoring")}${mini("Diagnose", "Use Query Insights and PostgreSQL workload evidence to connect sessions, waits, and SQL to the signal.", "Query context")}${mini("Improve", "Prioritize query, cache, bloat, capacity, or maintenance changes using measured evidence.", "Tuning")}${mini("Operate", "Use logs, events, configurations, and maintenance windows to make the improvement dependable.", "Runbook")}</div>
    </section>

    <div class="grid two-col observability-detail-grid">
      <section class="scenario-panel"><div class="panel-heading"><div><p class="eyebrow">OCI Query Insights</p><h3>See active sessions, waits, and top queries</h3></div><span class="tag">OCI-native</span></div><div class="mini-stack">${mini("Average active sessions", "Review CPU and wait-event activity over time to locate contention and resource pressure.", "Sessions")}${mini("Top queries", "Rank and filter statements by load, query count, mean execution time, database, role, and instance.", "SQL")}${mini("Enable deliberately", "Query Insights uses compute resources; enabling or disabling it restarts the database system.", "Restart")}</div></section>
      <section class="scenario-panel"><div class="panel-heading"><div><p class="eyebrow">Monitoring surfaces</p><h3>Choose the dashboard that fits the estate</h3></div></div><div class="mini-stack">${mini("OCI Monitoring + Query Insights", "Use OCI service metrics, alarms, and managed query analysis for the database system.", "OCI")}${mini("Grafana OCI data source", "Visualize oci_postgresql metrics alongside other cloud and application metrics in Grafana.", "External")}${mini("PostgreSQL Exporter → Prometheus → Grafana", "Collect deeper PostgreSQL metrics for Grafana dashboards, including bloat and query-level views.", "External")}</div></section>
    </div>

    <div class="grid two-col">
      <section class="scenario-panel">
        <div class="panel-heading"><div><p class="eyebrow">PostgreSQL workload evidence</p><h3>Evidence-led tuning queue</h3></div></div>
        <div class="query-table">${queries.map(([name, value, extension, state]) => `<div class="query-row"><div><p>${name}</p><span>${extension}</span></div><strong>${value}</strong><span class="status ${state}">${state}</span></div>`).join("")}</div>
      </section>
      <section class="chart-panel">
        <div class="panel-heading"><div><p class="eyebrow">Before and after</p><h3>Measured maintenance impact</h3></div></div>
        <div class="bar-list">${bar("Query p95 latency", "860 ms", 86, "red")}${bar("After repack and index rebuild", "310 ms", 31, "")}${bar("Table bloat reclaimed", "64%", 64, "amber")}${bar("Shared buffer residency", "77%", 77, "")}</div>
      </section>
    </div>

    <section class="scenario-panel observability-playbook">
      <div class="panel-heading observability-playbook-heading"><div><p class="eyebrow">Operational response</p><h3>Detect, investigate, and improve</h3></div><div class="segmented" role="tablist" aria-label="OCI PostgreSQL operational response approaches"><button class="chip active" type="button" role="tab" aria-selected="true" data-observability-pattern="detect">Detect &amp; alert</button><button class="chip" type="button" role="tab" aria-selected="false" data-observability-pattern="investigate">Investigate &amp; improve</button></div></div>
    </section>
    <div id="observability-pattern-demo"></div>
    ${tradeoffPanel([["Focus tuning where impact is highest", "Prioritize work using measured query cost, cache pressure, and bloat signals."], ["Prove the outcome", "Before-and-after evidence connects maintenance work to customer experience and cost."]], [["Metrics need context", "Baselines, traffic changes, and workload patterns determine whether a signal needs action."], ["External monitoring needs ownership", "Grafana, Prometheus, exporters, access, and alerts require a deliberately operated architecture."]])}
  `;
}

function renderObservabilityPattern(pattern) {
  const data = observabilityPatternData[pattern] || observabilityPatternData.detect;
  return `
    <section class="scenario-panel observability-pattern-panel"><div class="panel-heading"><div><p class="eyebrow">${data.label}</p><h3>${data.title}</h3></div><span class="tag">OCI-native operations</span></div><p class="observability-copy">${data.copy}</p><div class="observability-signal-grid">${data.signals.map(([titleText, copy, value]) => mini(titleText, copy, value)).join("")}</div></section>
    <div class="grid two-col observability-detail-grid"><section class="scenario-panel"><div class="panel-heading"><div><p class="eyebrow">Sample operating runbook</p><h3>Keep response work explicit</h3></div></div><div class="timeline">${data.runbook.map(([step, titleText, copy, tone]) => drEvent(step, titleText, copy, tone)).join("")}</div></section><section class="code-panel observability-guidance"><div class="panel-heading"><div><p class="eyebrow">Scope and handoff</p><h3>Use signals with context</h3></div></div><pre><code>${data.guidance}</code></pre></section></div>
  `;
}

function renderLocation() {
  return `
    <div class="grid two-col">
      <section class="scenario-panel location-dispatch-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Illustrative service moment</p>
            <h3>AI-assisted, spatially grounded dispatch</h3>
          </div>
          <span class="tag">Guided scenario</span>
        </div>
        <div class="dispatch-diagram" role="img" aria-label="A customer reports urgent refrigeration repair. AI interprets the request, then PostGIS uses an index-aware ST_DWithin proximity filter and ST_Intersects territory check. Availability, skills, and policy choose Crew 12 as the recommended dispatch.">
          <article class="dispatch-step customer-signal">
            <span class="dispatch-icon"><i data-lucide="map-pin" aria-hidden="true"></i></span>
            <p>1. Customer signal</p>
            <strong>Urgent refrigeration repair</strong>
            <small>Location and service request</small>
          </article>
          <article class="dispatch-step ai-interpretation">
            <span class="dispatch-icon"><i data-lucide="sparkles" aria-hidden="true"></i></span>
            <p>2. AI interprets</p>
            <strong>Cooling issue · priority repair</strong>
            <small>Explains the grounded recommendation</small>
          </article>
          <article class="dispatch-step spatial-filter">
            <span class="dispatch-icon"><i data-lucide="database" aria-hidden="true"></i></span>
            <p>3. PostGIS proves eligibility</p>
            <strong>Nearby, covered candidates</strong>
            <small>Deterministic spatial predicates</small>
            <div class="spatial-predicate-list">
              <span>ST_DWithin · GiST</span>
              <span>ST_Intersects</span>
            </div>
          </article>
          <article class="dispatch-step dispatch-recommendation">
            <span class="dispatch-icon"><i data-lucide="badge-check" aria-hidden="true"></i></span>
            <p>4. Recommended dispatch</p>
            <strong>Crew 12</strong>
            <small>7.4 km · certified · available</small>
            <div class="candidate-map" aria-hidden="true">
              <span class="candidate-customer">Customer</span>
              <span class="candidate-crew alternate">Crew 8</span>
              <span class="candidate-crew selected">Crew 12</span>
              <span class="candidate-territory"></span>
            </div>
          </article>
        </div>
        <div class="dispatch-legend" aria-label="Dispatch diagram legend">
          <span><i class="dispatch-legend-dot customer"></i>Customer request</span>
          <span><i class="dispatch-legend-dot candidate"></i>Eligible crew</span>
          <span><i class="dispatch-legend-dot selected"></i>Selected crew</span>
          <span><i class="dispatch-legend-area"></i>Service territory</span>
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
          ${mini("Filter nearby candidates", "ST_DWithin can use the GiST index to narrow the dispatch set before exact distance and business ranking.", "7.4 km")}
          ${mini("Confirm coverage", "ST_Intersects verifies that the customer point falls within an eligible service territory.", "Covered")}
          ${mini("Explain, do not override", "AI translates the request and explains why the policy-grounded selection is suitable; it does not replace spatial or service rules.", "Governed")}
        </div>
      </section>
    </div>

    ${tradeoffPanel(
      [
        ["Faster, defensible dispatch", "Bring location, coverage, skills, availability, and policy checks together before selecting a crew."],
        ["Planning based on actual reach", "Model catchments and overlap before committing to new sites or service territories."],
      ],
      [
        ["Spatial data must stay accurate", "Geocoding, boundaries, and source records need stewardship to keep decisions trustworthy."],
        ["Configuration and index fit need validation", "PostGIS must be enabled in an OCI custom configuration, is limited to OC1, and needs appropriate spatial indexes for the workload."],
      ],
    )}
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

    ${tradeoffPanel(
      [
        ["Consistent recurring operations", "Automate retention, rollups, and partition creation so critical upkeep is not missed."],
        ["Predictable growth management", "Keep high-volume data performant as workloads and retention needs expand."],
      ],
      [
        ["Jobs need observability", "Teams need clear status, alerting, and ownership for scheduled database work."],
        ["Bad automation scales quickly", "Validate retention and maintenance logic carefully before applying it across production data."],
      ],
    )}
  `;
}

function renderTrust() {
  return `
    <section class="scenario-panel governance-architecture">
      <div class="panel-heading"><div><p class="eyebrow">Layered control model</p><h3>Protect the platform and the data path</h3></div><span class="tag">Shared responsibility</span></div>
      <div class="governance-layers" role="img" aria-label="OCI IAM, private networking, Vault and encryption, and PostgreSQL data controls layered to protect an OCI PostgreSQL workload">
        <article class="governance-layer iam"><i data-lucide="users-round" aria-hidden="true"></i><div><strong>OCI IAM and compartments</strong><span>Control who can manage database systems, configurations, backups, and service resources.</span></div><b>Control plane</b></article>
        <article class="governance-layer network"><i data-lucide="network" aria-hidden="true"></i><div><strong>Private VCN access and NSGs</strong><span>Keep database endpoints private and allow only approved application and administration paths.</span></div><b>Connectivity</b></article>
        <article class="governance-layer protection"><i data-lucide="key-round" aria-hidden="true"></i><div><strong>Vault, secrets, and encryption</strong><span>Use Vault-backed administrator secrets and protect data in transit and at rest.</span></div><b>Protection</b></article>
        <article class="governance-layer data"><i data-lucide="database" aria-hidden="true"></i><div><strong>PostgreSQL roles and data controls</strong><span>Apply least-privilege roles, auditing, protected values, and governed federation inside the serving path.</span></div><b>Data plane</b></article>
      </div>
    </section>

    <div class="grid two-col">
      <section class="scenario-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Database control evidence</p>
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

    ${tradeoffPanel(
      [
        ["Layered protection", "Private access, OCI resource controls, and database-level controls address different parts of the risk model."],
        ["Governed data reuse", "Audit trails, protected values, and federated reads keep valuable data usable without uncontrolled extract sprawl."],
      ],
      [
        ["Control layers need clear ownership", "IAM policies, network rules, Vault secrets, and PostgreSQL roles must be managed and reviewed together."],
        ["Federation adds dependencies", "Shared services depend on the availability, performance, and contracts of remote data sources."],
      ],
    )}
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

  if (route === "dr") {
    initDrDemo();
    return;
  }

  if (route === "migration") {
    initMigrationDemo();
    return;
  }

  if (route === "observe") {
    initObservabilityDemo();
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

function initDrDemo() {
  const demo = document.querySelector("#dr-pattern-demo");
  const buttons = document.querySelectorAll("[data-dr-pattern]");

  if (!demo || !buttons.length) {
    return;
  }

  function draw(pattern) {
    buttons.forEach((button) => {
      const selected = button.dataset.drPattern === pattern;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    demo.innerHTML = renderDRPattern(pattern);
    refreshIcons();
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => draw(button.dataset.drPattern));
  });

  draw("warm");
}

function initMigrationDemo() {
  const demo = document.querySelector("#migration-pattern-demo");
  const buttons = document.querySelectorAll("[data-migration-pattern]");

  if (!demo || !buttons.length) {
    return;
  }

  function draw(pattern) {
    buttons.forEach((button) => {
      const selected = button.dataset.migrationPattern === pattern;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    demo.innerHTML = renderMigrationPattern(pattern);
    refreshIcons();
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => draw(button.dataset.migrationPattern));
  });

  draw("dump");
}

function initObservabilityDemo() {
  const demo = document.querySelector("#observability-pattern-demo");
  const buttons = document.querySelectorAll("[data-observability-pattern]");

  if (!demo || !buttons.length) {
    return;
  }

  function draw(pattern) {
    buttons.forEach((button) => {
      const selected = button.dataset.observabilityPattern === pattern;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    demo.innerHTML = renderObservabilityPattern(pattern);
    refreshIcons();
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => draw(button.dataset.observabilityPattern));
  });

  draw("detect");
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
  const snapshot = document.querySelector("#live-health-snapshot");
  const connectionDistribution = document.querySelector("#live-connection-distribution");
  if (!target) {
    return;
  }

  target.innerHTML = `
    ${loadingCard("API status")}
    ${loadingCard("Database")}
    ${loadingCard("Write role")}
    ${loadingCard("Server version")}
    ${loadingCard("Connected user")}
  `;
  if (snapshot) {
    snapshot.innerHTML = healthSnapshotLoadingCards();
  }
  renderConnectionDistribution(connectionDistribution, []);

  try {
    const data = await apiGet("/api/health");
    if (!data.connected) {
      target.innerHTML = `
        ${statusCard("API reachable", "Ready", "ok")}
        ${statusCard("Database", "Not connected", "warn")}
        ${statusCard("Write role", "Unavailable", "warn")}
        ${statusCard("Next step", data.error || "Configure DATABASE_URL", "hot")}
      `;
      renderHealthSnapshotUnavailable(snapshot, "Connect a database to read health metrics.");
      return;
    }

    target.innerHTML = `
      ${statusCard("API reachable", "Connected", "ok")}
      ${statusCard("Database", data.database || "PostgreSQL", "ok")}
      ${statusCard("Write role", data.is_in_recovery ? "Read-only replica" : "Writable primary", data.is_in_recovery ? "warn" : "ok")}
      ${statusCard("Server version", data.server_version || "Unknown", "ok")}
      ${statusCard("Connected user", data.user_name || "Unknown", "ok")}
    `;
    renderHealthSnapshot(snapshot, connectionDistribution, data);
  } catch {
    target.innerHTML = `
      ${statusCard("API status", "Offline", "hot")}
      ${statusCard("Start server", "npm start", "warn")}
      ${statusCard("Default URL", "http://localhost:8787", "warn")}
    `;
    renderHealthSnapshotUnavailable(snapshot, "Start the local API to read health metrics.");
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

function healthSnapshotCard(label, value, detail) {
  return `<article class="live-status-card live-health-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(detail)}</small></article>`;
}

function healthSnapshotLoadingCards() {
  return ["Uptime", "Connection headroom", "Cache hit ratio", "Last replay activity"]
    .map((label) => healthSnapshotCard(label, "Checking", "Reading database metrics"))
    .join("");
}

function renderHealthSnapshotUnavailable(snapshot, detail) {
  if (!snapshot) {
    return;
  }
  snapshot.innerHTML = ["Uptime", "Connection headroom", "Cache hit ratio", "Last replay activity"]
    .map((label) => healthSnapshotCard(label, "Unavailable", detail))
    .join("");
}

function renderConnectionDistribution(target, topDatabases) {
  if (!target) {
    return;
  }
  const databases = Array.isArray(topDatabases) ? topDatabases : [];
  if (!databases.length) {
    target.hidden = true;
    target.innerHTML = "";
    return;
  }
  target.hidden = false;
  target.innerHTML = `<strong>Most connections:</strong>${databases.map((database) => `<span>${escapeHtml(database.name)} <b>${escapeHtml(database.connections)}</b></span>`).join('<i aria-hidden="true">·</i>')}`;
}

function renderHealthSnapshot(snapshot, connectionDistribution, data) {
  if (!snapshot) {
    return;
  }

  const cacheValue = data.cache_hit_pct == null ? "No I/O samples" : `${data.cache_hit_pct}%`;
  const cacheDetail = data.cache_hit_pct == null
    ? "No reads recorded since statistics reset"
    : `Since stats reset ${formatHealthTime(data.stats_reset_at)}`;
  const replayValue = !data.is_in_recovery
    ? "Not applicable"
    : data.last_replay_at
      ? `${formatHealthAge(data.last_replay_at, data.checked_at)} ago`
      : "No replay observed";
  const replayDetail = !data.is_in_recovery
    ? "Connected to a primary"
    : data.last_replay_at
      ? "Most recently replayed transaction"
      : "No transaction replay timestamp returned";

  snapshot.innerHTML = [
    healthSnapshotCard("Uptime", formatHealthDuration(data.uptime_seconds), `Started ${formatHealthTime(data.started_at)}`),
    healthSnapshotCard("Connection headroom", `${data.active_connections ?? "?"} / ${data.max_connections ?? "?"}`, "All database backends / configured limit"),
    healthSnapshotCard("Cache hit ratio", cacheValue, cacheDetail),
    healthSnapshotCard("Last replay activity", replayValue, replayDetail),
  ].join("");
  renderConnectionDistribution(connectionDistribution, data.top_databases);
}

function formatHealthDuration(value) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "Unknown";
  }
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days) return `${days}d ${hours}h`;
  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m`;
  return `${Math.floor(seconds)}s`;
}

function formatHealthAge(value, reference) {
  const eventTime = new Date(value).getTime();
  const referenceTime = new Date(reference).getTime();
  if (!Number.isFinite(eventTime) || !Number.isFinite(referenceTime)) {
    return "Unknown";
  }
  return formatHealthDuration(Math.max(0, Math.floor((referenceTime - eventTime) / 1000)));
}

function formatHealthTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "an unknown time";
  }
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
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
  helpEyebrow.textContent = page.references ? "Architecture notes" : "Showcase notes";
  helpTitle.textContent = `${page.title} notes`;
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
            <p>This showcase combines OCI managed-service capabilities with supported PostgreSQL extensions. Validate service, configuration, networking, and extension prerequisites for each customer environment.</p>
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
