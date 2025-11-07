-- =====================================================
-- FIX: Habilitar Extensões no Supabase
-- =====================================================
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- Ou via: psql -h YOUR_HOST -U postgres -d postgres -f scripts/fix-supabase-extensions.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Verify
SELECT 
  extname as "Extension",
  extversion as "Version"
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'pgcrypto');

-- ✅ Agora você pode executar: supabase db push

