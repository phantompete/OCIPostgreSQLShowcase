# OCI PostgreSQL Showcase

A customer-facing OCI Database with PostgreSQL showcase for managed platform decisions and differentiated PostgreSQL workloads. It can run as a static walkthrough or with an optional local API that connects to a real PostgreSQL database for curated, read-only demonstrations.

Open `index.html` in a browser to run the static app. Oracle's [OCI Database with PostgreSQL overview](https://docs.oracle.com/en-us/iaas/Content/postgresql/overview.htm) remains the service reference.

Content reviewed on **17 September 2026**, also shown in the footer on every page. See [the section-by-section OCI review](docs/OCI_REVIEW.md) for findings, source links, OCI Cache relevance, and remaining environment validation. [PROJECT_PLAN.md](PROJECT_PLAN.md) tracks delivery and acceptance criteria. Static numbers, audit trails, schedules, AI patterns, and recovery timings are illustrative; only Live Lab queries a connected database. Lucide icons currently load from a public CDN, so a fully offline icon bundle remains a follow-up.

## Live database mode

The browser never connects directly to PostgreSQL. Live mode uses `server.mjs` as a small local API so credentials stay out of the frontend.

Requirements:

- Node.js 22 or newer; use a supported LTS release (22 or 24 at review time). Node 18 and 20 are end of life; see the [Node.js release schedule](https://nodejs.org/en/about/previous-releases).
- npm 10 or newer
- Private connectivity to the database VCN, such as VPN or an approved Bastion path. OCI endpoints are not public; follow [Oracle's connection guide](https://docs.oracle.com/en-us/iaas/Content/postgresql/connect-to-db.htm).

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` in `.env` and `PGSSLMODE=require`. The Live Lab uses TLS encryption without server certificate verification; no CA file is needed. Use either environment TLS settings or connection-string TLS options, never both. For a local disposable database without TLS, use `PGSSLMODE=disable`.
3. Install the PostgreSQL driver:

   ```bash
   npm install
   ```

4. Enable the needed OCI extensions, then optionally seed a dedicated non-production database using a setup account:

   ```bash
   psql "$DATABASE_URL" -f sql/demo_schema.sql
   ```

   `psql` does not load `.env`; export the connection and TLS variables into its shell first. In PowerShell use `psql $env:DATABASE_URL -f sql/demo_schema.sql`. The seed script drops and recreates its own demo tables; it is a reset operation, not a read-only check. Use a separate least-privilege account for the running API, with access only to the demo schema and approved statistics.

5. Start the showcase:

   ```bash
   npm start
   ```

6. Open `http://127.0.0.1:8787/#live`. The server listens only on loopback and serves an explicit list of frontend assets. If changing the port, open the server URL rather than `index.html` for live mode.

Live mode checks the real extension catalog, reports database connection and health context, and runs curated read-only demo endpoints. It does not expose a general SQL console or replace OCI Monitoring.

### OCI extension prerequisites

Oracle distinguishes service support, configuration enablement, and database installation. Follow [extension enablement](https://docs.oracle.com/en-us/iaas/Content/postgresql/config-list-enable-extension.htm), then verify both `pg_available_extensions` and `pg_extension` in the target database.

| Demo capability | Configuration prerequisite |
| --- | --- |
| Vector search (`CREATE EXTENSION vector`) and PostGIS | Enable pgvector and PostGIS in an OCI custom configuration before database installation; PostGIS remains OC1-only. |
| Workload, bloat, scheduling, audit, federation, replication | Enable the relevant `pg_stat_statements`, `pg_buffercache`, `pgstattuple`, `pg_repack`, `pg_cron`, `pg_partman`, `pgaudit`, `postgres_fdw`, or `pglogical` extension first. |
| Trigram search and crypto | `pg_trgm` and `pgcrypto` are available by default, but still need installation in the database. |

Source: [Oracle supported extensions](https://docs.oracle.com/en-us/iaas/Content/postgresql/extensions.htm). The seed attempts only vector, trigram, crypto, and spatial setup; it does not enable OCI configurations or install every extension in the showcase. Search uses synthetic three-dimensional vectors, not a live embedding model.

Run `npm test` (or `node --test`) for isolated server regression checks, and `node --check app.js` plus `node --check server.mjs` for syntax. Real SQL, extensions, TLS connectivity, and recovery drills need a configured non-production OCI environment.

## Showcase stories

- Availability and scale: multi-node high availability, read replicas, reader endpoints, managed storage, and flexible capacity
- Disaster recovery with backups, cross-region backup copies, warm standby replication, RPO enforcement, and switchover runbooks
- Migration and major-version upgrade readiness with pg_dump/restore, native logical replication, pglogical guidance, and GoldenGate CDC
- Observability: OCI metrics, alarms, Query Insights, PostgreSQL workload evidence, logging, events, configurations, and maintenance-window guidance
- Security and governance: IAM, private VCN access, Vault secrets, customer-managed encryption keys, Kerberos, auditing, protected values, and federation
- `pgvector` and `pg_trgm` for AI matching and fuzzy search
- `pg_stat_statements`, `pg_repack`, `pg_buffercache`, and `pgstattuple` for query, cache, bloat, and maintenance evidence
- `PostGIS` for location intelligence
- `pg_cron` and `pg_partman` for lifecycle automation
- `pgaudit`, `pgcrypto`, `postgres_fdw`, and `pglogical` for governed data products

The Observability story also explains two external Grafana architectures without embedding either one in the showcase: the [OCI data source for Grafana](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/grafana.htm) for OCI Monitoring metrics, and [PostgreSQL Exporter with Prometheus and Grafana](https://docs.oracle.com/en/learn/ocipgsql-promgra/index.html) for deeper database telemetry.
