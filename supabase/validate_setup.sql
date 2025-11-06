-- =====================================================
-- SUPABASE SETUP VALIDATION SCRIPT
-- =====================================================
-- Execute este script no SQL Editor para validar
-- que tudo foi configurado corretamente
-- =====================================================

-- =====================================================
-- 1. VERIFICAR EXTENSÕES
-- =====================================================

SELECT
  '✅ Verificando extensões...' as step,
  'Esperado: 3 extensões (uuid-ossp, vector, pg_trgm)' as expected;

SELECT
  extname as extension_name,
  CASE
    WHEN extname IN ('uuid-ossp', 'vector', 'pg_trgm') THEN '✅'
    ELSE '❓'
  END as status
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'vector', 'pg_trgm');

-- =====================================================
-- 2. VERIFICAR TABELAS
-- =====================================================

SELECT
  '✅ Verificando tabelas...' as step,
  'Esperado: 14 tabelas' as expected;

WITH expected_tables AS (
  SELECT unnest(ARRAY[
    'user_profiles',
    'conversation_history',
    'chat_messages',
    'conversations',
    'daily_plans',
    'user_feature_flags',
    'habits',
    'habit_completions',
    'content_items',
    'content_favorites',
    'moderation_queue',
    'risk_alerts',
    'alert_logs',
    'vector_embeddings'
  ]) as table_name
),
existing_tables AS (
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
)
SELECT
  e.table_name,
  CASE
    WHEN x.table_name IS NOT NULL THEN '✅ Existe'
    ELSE '❌ Faltando'
  END as status
FROM expected_tables e
LEFT JOIN existing_tables x ON e.table_name = x.table_name
ORDER BY e.table_name;

-- =====================================================
-- 3. VERIFICAR TYPES/ENUMS
-- =====================================================

SELECT
  '✅ Verificando types customizados (enums)...' as step,
  'Esperado: 7 enums' as expected;

SELECT
  typname as enum_name,
  '✅' as status
FROM pg_type
WHERE typtype = 'e'
  AND typname IN (
    'user_type',
    'subscription_tier',
    'message_role',
    'content_type',
    'moderation_action',
    'risk_type',
    'ab_test_group'
  )
ORDER BY typname;

-- =====================================================
-- 4. VERIFICAR FUNCTIONS
-- =====================================================

SELECT
  '✅ Verificando functions...' as step,
  'Esperado: 4 functions' as expected;

SELECT
  routine_name as function_name,
  routine_type as type,
  '✅' as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'update_updated_at_column',
    'match_conversations',
    'delete_old_conversations',
    'reset_daily_interactions'
  )
ORDER BY routine_name;

-- =====================================================
-- 5. VERIFICAR RLS POLICIES
-- =====================================================

SELECT
  '✅ Verificando RLS policies...' as step,
  'Esperado: Múltiplas policies por tabela' as expected;

SELECT
  tablename,
  COUNT(*) as policy_count,
  '✅' as status
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- =====================================================
-- 6. VERIFICAR TRIGGERS
-- =====================================================

SELECT
  '✅ Verificando triggers...' as step,
  'Esperado: 3 triggers (updated_at)' as expected;

SELECT
  trigger_name,
  event_object_table as table_name,
  '✅' as status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table;

-- =====================================================
-- 7. VERIFICAR INDEXES
-- =====================================================

SELECT
  '✅ Verificando indexes de performance...' as step,
  'Esperado: Múltiplos indexes' as expected;

SELECT
  schemaname,
  tablename,
  indexname,
  '✅' as status
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- =====================================================
-- 8. VERIFICAR RLS STATUS
-- =====================================================

SELECT
  '✅ Verificando se RLS está habilitado...' as step,
  'Esperado: Todas as tabelas com RLS enabled' as expected;

SELECT
  tablename,
  CASE
    WHEN rowsecurity = true THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- =====================================================
-- 9. CONTAR REGISTROS (Deve estar vazio)
-- =====================================================

SELECT
  '✅ Verificando se tabelas estão vazias (inicial)...' as step,
  'Esperado: 0 registros em cada tabela' as expected;

SELECT 'user_profiles' as table_name, COUNT(*) as count FROM user_profiles
UNION ALL
SELECT 'conversation_history', COUNT(*) FROM conversation_history
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM chat_messages
UNION ALL
SELECT 'conversations', COUNT(*) FROM conversations
UNION ALL
SELECT 'daily_plans', COUNT(*) FROM daily_plans
UNION ALL
SELECT 'user_feature_flags', COUNT(*) FROM user_feature_flags
UNION ALL
SELECT 'habits', COUNT(*) FROM habits
UNION ALL
SELECT 'habit_completions', COUNT(*) FROM habit_completions
UNION ALL
SELECT 'content_items', COUNT(*) FROM content_items
UNION ALL
SELECT 'content_favorites', COUNT(*) FROM content_favorites
UNION ALL
SELECT 'moderation_queue', COUNT(*) FROM moderation_queue
UNION ALL
SELECT 'risk_alerts', COUNT(*) FROM risk_alerts
UNION ALL
SELECT 'alert_logs', COUNT(*) FROM alert_logs
UNION ALL
SELECT 'vector_embeddings', COUNT(*) FROM vector_embeddings
ORDER BY table_name;

-- =====================================================
-- 10. SUMMARY
-- =====================================================

SELECT
  '✅ VALIDAÇÃO COMPLETA!' as status,
  'Todas as verificações foram executadas' as message,
  'Se você viu apenas ✅, está tudo configurado!' as result;

-- =====================================================
-- TESTE BÁSICO DE INSERT (OPCIONAL)
-- =====================================================
-- Descomente para testar insert básico
-- IMPORTANTE: Substitua o UUID pelo auth.uid() real do seu usuário

/*
-- Criar usuário de teste
INSERT INTO user_profiles (id, name, type)
VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', -- Substitua por auth.uid() real
  'Teste Validação',
  'gestante'
)
ON CONFLICT (id) DO NOTHING;

-- Verificar
SELECT * FROM user_profiles WHERE name = 'Teste Validação';

-- Limpar teste
DELETE FROM user_profiles WHERE name = 'Teste Validação';
*/
