# OCI PostgreSQL Showcase Plan

## Purpose

This project is a customer-facing OCI Database with PostgreSQL showcase. It translates managed-service decisions, operational readiness, recovery and migration, and differentiated PostgreSQL workloads into practical customer stories. The app works as a static walkthrough by default and can optionally connect to a PostgreSQL database through a small local Node API for curated, read-only demonstrations.

## Current Baseline

- Frontend: single-page JavaScript app with hash routes, reusable panels, help modal, Lucide icons, and responsive CSS.
- Live mode: `server.mjs` serves the app and safe `/api/*` endpoints, including connection role and operational snapshot signals. The browser never receives database credentials or a general SQL console.
- Demo data: `sql/demo_schema.sql` creates a separate `oci_pg_showcase` schema and configures the pgvector, pg_trgm, PostGIS, and pgcrypto examples with extension-schema-aware SQL.
- Reference source: Oracle OCI PostgreSQL service, availability, security, observability, recovery, migration, and extension documentation.

## Delivery History

| Status | Delivered capability | Notes |
| --- | --- | --- |
| Complete | Showcase foundation | Portfolio, route navigation, responsive UI, and page-level help modal. |
| Complete | Optional live database lab | Health, extension matrix, vector/trigram search, workload, maintenance, spatial, and crypto endpoints. |
| Complete | Extension compatibility hardening | Node 18+/npm 9+ requirement; extension functions, types, and operators are qualified by installed extension schema. |
| Complete | Brand refresh | Supplied OCI PostgreSQL mark is used in the application. |
| Complete | PostGIS live map | Nearest-location results are rendered as a small map with origin, markers, and connecting lines. |
| Complete | AI Matching expansion | Semantic, RAG, image, and agent patterns; value flow; simulated retrieval demos; existing intent matcher remains intact. |
| Complete | AI-assisted location story | PostGIS-led dispatch diagram, Location-to-AI boundary, and a compact spatial-aware AI cross-link. |
| Complete | DR recovery playbook | Backup & Restore, Point-in-Time Recovery, and Warm Standby tabs with comparisons, native architecture diagrams, illustrative recovery targets, and operator runbooks. |
| Complete | Migration playbook | pg_dump & restore, native logical replication, and GoldenGate Initial Load + CDC tabs with responsive animated diagrams, comparison guidance, runbooks, and pglogical decision guidance. |
| Complete | Live Lab health snapshot | Primary/replica write role plus read-only uptime, cluster-wide connection headroom, top connected databases, cache ratio, and replica replay-activity indicators. |
| Complete | Availability and scale story | In-region HA, reader endpoints, capacity choices, and the boundary between high availability and cross-region DR. |
| Complete | Observability story | OCI metrics, Query Insights, PostgreSQL workload evidence, alarms, external Grafana architecture guidance, logging, events, configurations, and maintenance in one operating story. |
| Complete | Security and governance reframe | OCI IAM, private networking, Vault, and encryption layered with existing PostgreSQL audit, crypto, and federation controls. |

## Section Plans

### Portfolio

- Purpose: establish the OCI PostgreSQL platform narrative and route a customer to a managed-service or workload conversation.
- Current scope: managed platform, continuity, security, operations, workload, and optional Live Lab entry cards.
- Keep healthy: update this page whenever a top-level showcase journey changes; keep extensions positioned as workload differentiators rather than the product definition.
- Next improvement: add a concise "choose your story" filter only if the portfolio grows beyond the current set of journeys.

### Live Database Lab

- Purpose: turn the static story into connected proof without exposing credentials or arbitrary SQL execution.
- Current scope: `/api/health` exposes connection state, primary/replica role, uptime, cluster-wide connection headroom, the top three connected databases, cache ratio, and replica replay activity; the remaining curated endpoints cover extensions, search, workload, maintenance, spatial, and crypto examples.
- Keep healthy: run the schema only in a non-production database; keep health queries read-only; present cache ratio and replay activity as context, not service-level guarantees.
- Next improvement: add threshold-based health guidance only after operational owners agree the thresholds and escalation expectations.

### Availability and Scale

- Purpose: explain the in-region service architecture customers need before discussing cross-region DR or application workload patterns.
- Current scope: single-node recovery, multi-node HA, regional placement, read replicas, reader endpoints, database-optimized storage, and flexible compute/performance capacity.
- Keep healthy: distinguish the primary read/write endpoint from reader endpoints; distinguish in-region HA from cross-region DR; avoid unverified customer-specific capacity or cost promises.
- Next improvement: add a scenario selector only if customers need to compare specific availability postures during a workshop.

### Disaster Recovery

- Purpose: explain OCI PostgreSQL recovery motions without reducing DR to a backup checkbox.
- Current scope: Backup & Restore, Point-in-Time Recovery, and Warm Standby selection; persistent comparison; native architecture diagrams; illustrative RPO/RTO targets; RPO enforcement explanation; and tab-specific operator runbooks.
- Customer message: backup recovery provisions from a valid copy, point-in-time recovery creates a new system at a selected timestamp, and Warm Standby streams WAL to a read-only standby but requires manual promotion/conversion and traffic cutover.
- Keep healthy: preserve the three-option comparison, help modal, responsive diagrams, and the explicit distinction between RPO enforcement and a separate DR architecture.
- Guardrails: do not imply automatic failover or fixed recovery timings; label targets as illustrative and keep Oracle backup, point-in-time recovery, and Warm Standby references current.

### Migration

- Purpose: help customers select a PostgreSQL-to-OCI migration path by downtime posture, operational complexity, and replication requirements.
- Current scope: pg_dump & restore, native logical replication, and GoldenGate Initial Load + CDC tabs; persistent comparison; animated native diagrams; sample runbooks; watch-outs; pglogical decision guidance; and major-version upgrade readiness.
- Customer message: select native logical replication for compatible one-way, low-downtime moves; use pglogical only when its advanced scope or topology capabilities justify its extra configuration; use GoldenGate for very large or complex CDC programs.
- Keep healthy: present database size only as illustrative initial-load guidance, coordinate schema/DDL/sequences separately for native replication, and keep source WAL, slots, privileges, and cutover validation explicit.
- Next improvement: add a presenter-ready compatibility checklist only if it can remain illustrative and does not imply OCI service limits.

### AI Matching

- Purpose: demonstrate why pgvector and pg_trgm make PostgreSQL a governed relevance layer for AI-powered journeys.
- Current scope: semantic search, RAG, image similarity, and agent-memory simulated patterns; a value flow; customer intent matcher for Support, Retail, and Risk.
- Keep healthy: preserve the current matcher and `/api/demo/search` contract when adding storytelling content.
- Next improvement: add live embedding/model integration only as a separate, credentialed capability with clear data-governance and cost controls.

### Observability

- Purpose: connect detection, diagnosis, tuning, and operating practices into timely customer-protecting actions.
- Current scope: OCI metrics, alarms, notifications, Query Insights, pg_stat_statements, pg_repack, pg_buffercache, pgstattuple, logs, events, configurations, maintenance windows, and external Grafana architecture guidance.
- Keep healthy: make static workload values demonstrative unless backed by the connected database; describe Query Insights, OCI metrics, logging, and Grafana architectures accurately; do not imply that Live Lab replaces OCI Monitoring or that the showcase embeds a Grafana, Prometheus, or exporter integration.
- Next improvement: add example alarm ownership or a before/after maintenance snapshot only after the operating model and a safe repeatable demo database are available.

### Location Intelligence

- Purpose: show how PostGIS grounds proximity, coverage, and eligibility decisions for location-aware products, including AI-assisted dispatch explanations.
- Current scope: a labeled four-step dispatch scenario, geometry/geography and AI-boundary guidance, an AI Matching cross-link, plus a live nearest-location query and lightweight map.
- Keep healthy: preserve the custom-configuration and OC1-only PostGIS constraint; make AI illustrative and subordinate to deterministic spatial, availability, capability, and policy rules; test coordinate output and the `ST_DWithin` radius filter in the live API.
- Next improvement: add selectable customer origins or service categories while keeping the map deliberately lightweight.

### Lifecycle Automation

- Purpose: position pg_cron, pg_partman, and pg_repack as a practical data-lifecycle story.
- Current scope: scheduled jobs, partition maintenance, retention, rollups, and online cleanup narrative.
- Keep healthy: distinguish illustrative schedules from actual jobs unless live job inspection is added.
- Next improvement: add a read-only job-history panel when a compatible OCI PostgreSQL demo environment is available.

### Security and Governance

- Purpose: show the OCI platform and PostgreSQL data controls that keep private access, administration, and governed data reuse aligned.
- Current scope: IAM and compartments, private VCN access and NSGs, Vault-backed administrator secrets, encryption, PostgreSQL roles, pgaudit, pgcrypto, postgres_fdw, and pglogical context.
- Keep healthy: distinguish OCI resource authorization from database roles; never present sample identifiers or crypto output as production security controls without the surrounding key-management and audit design.
- Next improvement: add a constrained live audit example only if its log source can be safely demonstrated.

## Prioritized Roadmap

1. **Validate the platform story**: verify Availability, DR, Migration, Observability, and Security pages; confirm help modals, diagrams, tab changes, and desktop/mobile layouts.
2. **Prove live mode end to end**: restart/deploy the matching `server.mjs`, run `sql/demo_schema.sql` against a non-production OCI PostgreSQL system, validate every live endpoint and health snapshot, and document the exact extension/configuration prerequisites used for demos.
3. **Make the demo repeatable**: define a presenter setup checklist, a known-good demo database reset path, and a short scripted customer journey across the managed platform and workload pages.
4. **Add real integrations deliberately**: evaluate live OCI Monitoring only with explicit OCI credentials and least-privilege design; separately evaluate live embeddings, safe job history, and constrained audit signals after security, cost, and ownership are decided.

## Change and Validation Checklist

For any new or revised showcase story:

1. State the customer problem, featured OCI/PostgreSQL capability, and the claim the page may safely make.
2. Keep static storytelling independent from live database availability; show useful empty and offline states for live features.
3. Update the page help modal, Oracle reference links, and this plan whenever behavior or operational constraints change.
4. Keep database access behind `server.mjs`, parameterized, read-only, and scoped to curated endpoints.
5. Run `node --check app.js` and `node --check server.mjs`; validate the affected hash route and help modal on desktop and mobile.
6. When changing demo SQL, test it against extensions installed in non-default schemas as well as the default schema.

## Near-Term Acceptance Criteria

- DR tabs update the architecture, indicators, runbook, and guidance without console errors.
- Migration tabs update the diagram, indicators, runbook, checklist, and pglogical guidance without page-level overflow.
- Availability explains multi-node HA, reader endpoints, scaling choices, and the boundary from DR without conflicting claims.
- Observability combines metrics, Query Insights, workload evidence, Grafana architecture guidance, and operating runbooks without implying a live OCI Monitoring or external-monitoring integration.
- Security and Governance retains the existing database-control story while clearly adding OCI control-plane layers.
- AI pattern tabs and the existing Support/Retail/Risk intent matcher remain functional.
- The live map renders customer origin and returned nearest locations when the API supplies coordinates.
- Live mode fails safely when `DATABASE_URL` is absent or a required extension is unavailable; connected health responses populate role and snapshot fields from the matching server version.
- No page creates horizontal overflow at mobile width.
