-- Optional live-demo seed data for the OCI PostgreSQL Extension Showcase.
-- Run this against a non-production database or a dedicated demo schema.

CREATE SCHEMA IF NOT EXISTS oci_pg_showcase;

DO $$
BEGIN
  BEGIN
    CREATE EXTENSION IF NOT EXISTS vector;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create vector extension: %', SQLERRM;
  END;

  BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create pg_trgm extension: %', SQLERRM;
  END;

  BEGIN
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create pgcrypto extension: %', SQLERRM;
  END;

  BEGIN
    CREATE EXTENSION IF NOT EXISTS postgis;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create PostGIS extension: %', SQLERRM;
  END;
END $$;

DO $$
DECLARE
  vector_schema text;
  trgm_schema text;
BEGIN
  SELECT n.nspname
  INTO vector_schema
  FROM pg_type t
  JOIN pg_namespace n ON n.oid = t.typnamespace
  WHERE t.typname = 'vector'
  LIMIT 1;

  IF vector_schema IS NOT NULL THEN
    EXECUTE 'DROP TABLE IF EXISTS oci_pg_showcase.intent_catalog';
    EXECUTE format('
      CREATE TABLE oci_pg_showcase.intent_catalog (
        id bigserial PRIMARY KEY,
        scenario text NOT NULL,
        title text NOT NULL,
        outcome text NOT NULL,
        embedding %I.vector(3) NOT NULL
      )', vector_schema);

    EXECUTE $seed$
      INSERT INTO oci_pg_showcase.intent_catalog (scenario, title, outcome, embedding) VALUES
        ('support', 'Refund policy exception', 'Deflects ambiguous support intent to the right policy.', '[0.12,0.84,0.32]'),
        ('support', 'Subscription pause workflow', 'Finds retention-safe workflow guidance for agents.', '[0.18,0.79,0.36]'),
        ('support', 'Warranty transfer rules', 'Retrieves a closely related warranty article.', '[0.16,0.72,0.44]'),
        ('retail', 'Accessory bundle', 'Ranks attachable products by shopper intent.', '[0.81,0.22,0.37]'),
        ('retail', 'Store pickup substitute', 'Finds substitute items for pickup inventory gaps.', '[0.76,0.28,0.35]'),
        ('retail', 'Loyalty next action', 'Suggests retention actions from customer context.', '[0.73,0.31,0.41]'),
        ('risk', 'Unusual beneficiary pattern', 'Surfaces related investigations for analyst review.', '[0.28,0.38,0.88]'),
        ('risk', 'Merchant descriptor match', 'Matches noisy transaction descriptions.', '[0.32,0.34,0.82]'),
        ('risk', 'Case narrative retrieval', 'Retrieves similar case summaries.', '[0.24,0.42,0.79]')
    $seed$;

    SELECT n.nspname
    INTO trgm_schema
    FROM pg_opclass c
    JOIN pg_am a ON a.oid = c.opcmethod
    JOIN pg_namespace n ON n.oid = c.opcnamespace
    WHERE c.opcname = 'gin_trgm_ops'
      AND a.amname = 'gin'
    LIMIT 1;

    IF trgm_schema IS NOT NULL THEN
      EXECUTE format(
        'CREATE INDEX IF NOT EXISTS intent_catalog_title_trgm_idx ON oci_pg_showcase.intent_catalog USING gin (title %I.gin_trgm_ops)',
        trgm_schema
      );
    ELSE
      RAISE NOTICE 'Skipping trigram index because gin_trgm_ops is not available for GIN.';
    END IF;
  ELSE
    RAISE NOTICE 'Skipping vector demo table because vector is not installed.';
  END IF;
END $$;

DO $$
DECLARE
  postgis_schema text;
BEGIN
  SELECT n.nspname
  INTO postgis_schema
  FROM pg_extension e
  JOIN pg_namespace n ON n.oid = e.extnamespace
  WHERE e.extname = 'postgis'
  LIMIT 1;

  IF postgis_schema IS NOT NULL THEN
    EXECUTE 'DROP TABLE IF EXISTS oci_pg_showcase.service_locations';
    EXECUTE format('
      CREATE TABLE oci_pg_showcase.service_locations (
        id bigserial PRIMARY KEY,
        name text NOT NULL,
        kind text NOT NULL,
        geom %I.geometry(Point, 4326) NOT NULL
      )', postgis_schema);

    EXECUTE format($seed$
      INSERT INTO oci_pg_showcase.service_locations (name, kind, geom) VALUES
        ('Seattle Field Hub', 'depot', %1$I.ST_SetSRID(%1$I.ST_MakePoint(-122.335167, 47.608013), 4326)),
        ('Bellevue Service Desk', 'branch', %1$I.ST_SetSRID(%1$I.ST_MakePoint(-122.200676, 47.610149), 4326)),
        ('Tacoma Response Unit', 'depot', %1$I.ST_SetSRID(%1$I.ST_MakePoint(-122.444291, 47.252877), 4326)),
        ('Everett Parts Locker', 'parts', %1$I.ST_SetSRID(%1$I.ST_MakePoint(-122.202079, 47.978985), 4326)),
        ('Renton Mobile Crew', 'crew', %1$I.ST_SetSRID(%1$I.ST_MakePoint(-122.217066, 47.482878), 4326))
    $seed$, postgis_schema);

    EXECUTE 'CREATE INDEX IF NOT EXISTS service_locations_geom_idx ON oci_pg_showcase.service_locations USING gist (geom)';
    EXECUTE format('CREATE INDEX IF NOT EXISTS service_locations_geography_idx ON oci_pg_showcase.service_locations USING gist ((geom::%I.geography))', postgis_schema);
  ELSE
    RAISE NOTICE 'Skipping spatial demo table because PostGIS is not installed.';
  END IF;
END $$;
