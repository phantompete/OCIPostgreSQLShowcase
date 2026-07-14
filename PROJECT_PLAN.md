# OCI PostgreSQL Showcase Plan

## Purpose

This project is a customer-facing OCI Database with PostgreSQL showcase. It translates standout PostgreSQL extensions and OCI recovery capabilities into practical customer stories. The app works as a static walkthrough by default and can optionally connect to a PostgreSQL database through a small local Node API for curated, read-only demonstrations.

## Current Baseline

- Frontend: single-page JavaScript app with hash routes, reusable panels, help modal, Lucide icons, and responsive CSS.
- Live mode: `server.mjs` serves the app and safe `/api/*` endpoints. The browser never receives database credentials or a general SQL console.
- Demo data: `sql/demo_schema.sql` creates a separate `oci_pg_showcase` schema and configures the pgvector, pg_trgm, PostGIS, and pgcrypto examples with extension-schema-aware SQL.
- Reference source: Oracle OCI PostgreSQL extension, backup, and Warm Standby documentation.

## Delivery History

| Status | Delivered capability | Notes |
| --- | --- | --- |
| Complete | Extension showcase foundation | Portfolio, route navigation, responsive UI, and page-level help modal. |
| Complete | Optional live database lab | Health, extension matrix, vector/trigram search, workload, maintenance, spatial, and crypto endpoints. |
| Complete | Extension compatibility hardening | Node 18+/npm 9+ requirement; extension functions, types, and operators are qualified by installed extension schema. |
| Complete | Brand refresh | Supplied OCI PostgreSQL mark is used in the application. |
| Complete | PostGIS live map | Nearest-location results are rendered as a small map with origin, markers, and connecting lines. |
| Complete | AI Matching expansion | Semantic, RAG, image, and agent patterns; value flow; simulated retrieval demos; existing intent matcher remains intact. |
| In progress | DR experience expansion | Backup & Restore and Warm Standby tabs, comparison, architecture diagrams, RPO control explanation, and recovery runbooks are implemented in the current frontend changes and require final visual verification. |

## Section Plans

### Portfolio

- Purpose: establish the overall extension narrative and route a customer to the relevant use case.
- Current scope: extension portfolio metrics and entry cards for the six customer journeys.
- Keep healthy: update this page whenever a new showcase journey is added or a featured extension changes.
- Next improvement: add a concise "choose your story" filter only if the portfolio grows beyond the current set of journeys.

### Live Database Lab

- Purpose: turn the static story into connected proof without exposing credentials or arbitrary SQL execution.
- Current scope: `/api/health`, `/api/extensions`, `/api/demo/search`, `/api/demo/workload`, `/api/demo/maintenance`, `/api/demo/spatial`, and `/api/demo/crypto`.
- Keep healthy: run the schema only in a non-production database; validate extension availability and schema-qualified behavior after every PostgreSQL/OCI configuration change.
- Next improvement: add a compact connection readiness checklist and one-click demo reset only if the showcase will be run repeatedly by field teams.

### Disaster Recovery

- Purpose: explain two OCI PostgreSQL recovery motions without reducing DR to a backup checkbox.
- Current scope: Backup & Restore and Warm Standby selection, RPO/RTO/runbook comparison, native architecture diagrams, RPO enforcement callout, and tab-specific operator runbooks.
- Customer message: backup recovery uses a valid recovery point and replacement provisioning; Warm Standby continuously streams WAL to a read-only standby but requires manual promotion/conversion and traffic cutover.
- Immediate next step: verify both tabs, the RPO explanation, help modal, desktop layout, and mobile overflow before presenting this page.
- Guardrails: do not imply automatic failover or fixed recovery timings; keep Oracle backup and Warm Standby references current.

### AI Matching

- Purpose: demonstrate why pgvector and pg_trgm make PostgreSQL a governed relevance layer for AI-powered journeys.
- Current scope: semantic search, RAG, image similarity, and agent-memory simulated patterns; a value flow; customer intent matcher for Support, Retail, and Risk.
- Keep healthy: preserve the current matcher and `/api/demo/search` contract when adding storytelling content.
- Next improvement: add live embedding/model integration only as a separate, credentialed capability with clear data-governance and cost controls.

### Performance Cockpit

- Purpose: make operational database health visible through measurable workload and maintenance signals.
- Current scope: pg_stat_statements, pg_repack, pg_buffercache, and pgstattuple stories; live workload and maintenance endpoints.
- Keep healthy: make metrics and recommendations clearly demonstrative unless backed by the connected database.
- Next improvement: add a before/after maintenance snapshot when a safe, repeatable demo database is available.

### Location Intelligence

- Purpose: show spatial products such as nearest service, coverage, and routing-adjacent analysis using PostGIS.
- Current scope: static location story plus live nearest-location query and map.
- Keep healthy: preserve the OCI realm note for PostGIS and test coordinate output in the live API.
- Next improvement: add selectable customer origins or service categories while keeping the map deliberately lightweight.

### Lifecycle Automation

- Purpose: position pg_cron, pg_partman, and pg_repack as a practical data-lifecycle story.
- Current scope: scheduled jobs, partition maintenance, retention, rollups, and online cleanup narrative.
- Keep healthy: distinguish illustrative schedules from actual jobs unless live job inspection is added.
- Next improvement: add a read-only job-history panel when a compatible OCI PostgreSQL demo environment is available.

### Trust and Data Products

- Purpose: show governed access and sharing through pgaudit, pgcrypto, postgres_fdw, and pglogical.
- Current scope: audit feed, encryption workflow, and federated-data narrative.
- Keep healthy: never present sample identifiers or crypto output as production security controls without the surrounding key-management and audit design.
- Next improvement: add a constrained live audit example only if its log source can be safely demonstrated.

## Prioritized Roadmap

1. **Stabilize the current experience**: complete DR visual and interaction checks; re-run AI pattern, existing intent matcher, and help-modal checks; confirm desktop and mobile layouts have no overflow.
2. **Prove live mode end to end**: run `sql/demo_schema.sql` against a non-production OCI PostgreSQL system, validate every live endpoint, and document the exact extension/configuration prerequisites used for demos.
3. **Make the demo repeatable**: define a presenter setup checklist, a known-good demo database reset path, and a short scripted customer journey for each page.
4. **Add real integrations deliberately**: evaluate live embeddings for AI, safe job history for automation, and constrained audit signals for trust only after security, cost, and credential ownership are decided.

## Change and Validation Checklist

For any new or revised showcase story:

1. State the customer problem, featured OCI/PostgreSQL capability, and the claim the page may safely make.
2. Keep static storytelling independent from live database availability; show useful empty and offline states for live features.
3. Update the page help modal and Oracle reference links whenever behavior or operational constraints change.
4. Keep database access behind `server.mjs`, parameterized, read-only, and scoped to curated endpoints.
5. Run `node --check app.js` and `node --check server.mjs`; validate the affected hash route and help modal on desktop and mobile.
6. When changing demo SQL, test it against extensions installed in non-default schemas as well as the default schema.

## Near-Term Acceptance Criteria

- DR tabs update the architecture, indicators, runbook, and guidance without console errors.
- AI pattern tabs and the existing Support/Retail/Risk intent matcher remain functional.
- The live map renders customer origin and returned nearest locations when the API supplies coordinates.
- Live mode fails safely when `DATABASE_URL` is absent or a required extension is unavailable.
- No page creates horizontal overflow at mobile width.
