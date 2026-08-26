# OCI PostgreSQL Showcase

A customer-facing OCI Database with PostgreSQL showcase for managed platform decisions and differentiated PostgreSQL workloads. It can run as a static walkthrough or with an optional local API that connects to a real PostgreSQL database for curated, read-only demonstrations.

Open `index.html` in a browser to run the static app. Oracle's [OCI Database with PostgreSQL overview](https://docs.oracle.com/en-us/iaas/Content/postgresql/overview.htm) remains the service reference.

## Live database mode

The browser never connects directly to PostgreSQL. Live mode uses `server.mjs` as a small local API so credentials stay out of the frontend.

Requirements:

- Node.js 18 or newer
- npm 9 or newer

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` in `.env`.
3. Install the PostgreSQL driver:

   ```bash
   npm install
   ```

4. Optional: seed demo tables in a non-production database:

   ```bash
   psql "$DATABASE_URL" -f sql/demo_schema.sql
   ```

5. Start the showcase:

   ```bash
   npm start
   ```

6. Open `http://localhost:8787/#live`.

Live mode checks the real extension catalog, reports database connection and health context, and runs curated read-only demo endpoints. It does not expose a general SQL console or replace OCI Monitoring.

## Showcase stories

- Availability and scale: multi-node high availability, read replicas, reader endpoints, managed storage, and flexible capacity
- Disaster recovery with backups, cross-region backup copies, warm standby replication, RPO enforcement, and switchover runbooks
- Migration and major-version upgrade readiness with pg_dump/restore, native logical replication, pglogical guidance, and GoldenGate CDC
- Observability: OCI metrics, alarms, Query Insights, PostgreSQL workload evidence, logging, events, configurations, and maintenance-window guidance
- Security and governance: IAM, private VCN access, Vault, encryption, auditing, protected values, and federation
- `pgvector` and `pg_trgm` for AI matching and fuzzy search
- `pg_stat_statements`, `pg_repack`, `pg_buffercache`, and `pgstattuple` for query, cache, bloat, and maintenance evidence
- `PostGIS` for location intelligence
- `pg_cron` and `pg_partman` for lifecycle automation
- `pgaudit`, `pgcrypto`, `postgres_fdw`, and `pglogical` for governed data products

The Observability story also explains two external Grafana architectures without embedding either one in the showcase: the [OCI data source for Grafana](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/grafana.htm) for OCI Monitoring metrics, and [PostgreSQL Exporter with Prometheus and Grafana](https://docs.oracle.com/en/learn/ocipgsql-promgra/index.html) for deeper database telemetry.
