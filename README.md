# OCI PostgreSQL Extension Showcase

A customer-facing showcase for standout OCI Database with PostgreSQL extensions. It can run as a static app, or with an optional local API that connects to a real PostgreSQL database for live demos.

Open `index.html` in a browser to run the app. It uses the OCI supported extensions page as the reference list:

https://docs.oracle.com/en-us/iaas/Content/postgresql/extensions.htm

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

Live mode checks the real extension catalog, reports installed versus available extensions, and runs curated read-only demo endpoints. It does not expose a general SQL console.

Included extension stories:

- Disaster recovery with backups, cross-region backup copies, warm standby replication, RPO enforcement, and switchover runbooks
- `pgvector` and `pg_trgm` for AI matching and fuzzy search
- `pg_stat_statements`, `pg_repack`, `pg_buffercache`, and `pgstattuple` for performance operations
- `PostGIS` for location intelligence
- `pg_cron` and `pg_partman` for lifecycle automation
- `pgaudit`, `pgcrypto`, `postgres_fdw`, and `pglogical` for governed data products
