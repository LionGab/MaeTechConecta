-- =====================================================
-- Enable Extensions - PRIMEIRA MIGRATION
-- Data: 2025-01-03
-- =====================================================
-- IMPORTANTE: Esta deve ser a PRIMEIRA migration executada

-- Enable UUID extension (para uuid_generate_v4)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto (para gen_random_uuid e outras funções)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Verify extensions
DO $$
BEGIN
  RAISE NOTICE '✅ Extensions enabled successfully';
  RAISE NOTICE '   - uuid-ossp: %', (SELECT installed_version FROM pg_available_extensions WHERE name = 'uuid-ossp');
  RAISE NOTICE '   - pgcrypto: %', (SELECT installed_version FROM pg_available_extensions WHERE name = 'pgcrypto');
END $$;


