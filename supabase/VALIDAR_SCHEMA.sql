-- =====================================================
-- VALIDAÇÃO COMPLETA DO SCHEMA DO BANCO
-- Execute este script no Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. Verificar extensões habilitadas
SELECT
  'EXTENSÕES' as categoria,
  extname as nome,
  extversion as versao
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'vector')
ORDER BY extname;

-- 2. Verificar todas as tabelas do schema public
SELECT
  'TABELAS' as categoria,
  table_name as nome,
  CASE
    WHEN table_name IN ('user_profiles', 'chat_messages', 'conversations', 'daily_plans', 'habits', 'habit_completions', 'content_items', 'content_favorites')
    THEN '✅ TABELA ESPERADA'
    ELSE '⚠️ TABELA ADICIONAL'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 3. Verificar RLS habilitado em todas as tabelas
SELECT
  'RLS HABILITADO' as categoria,
  relname as tabela,
  CASE
    WHEN relrowsecurity = true THEN '✅ RLS ATIVO'
    ELSE '❌ RLS DESATIVADO'
  END as status
FROM pg_class
WHERE relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND relkind = 'r'
  AND relname IN ('user_profiles', 'chat_messages', 'conversations', 'daily_plans', 'habits', 'habit_completions', 'content_items', 'content_favorites')
ORDER BY relname;

-- 4. Verificar políticas RLS por tabela
SELECT
  'POLÍTICAS RLS' as categoria,
  tablename as tabela,
  COUNT(*) as total_politicas,
  string_agg(policyname || ' (' || cmd || ')', ', ' ORDER BY policyname) as politicas
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'chat_messages', 'conversations', 'daily_plans', 'habits', 'habit_completions', 'content_items', 'content_favorites')
GROUP BY tablename
ORDER BY tablename;

-- 5. Verificar estrutura da tabela user_profiles
SELECT
  'ESTRUTURA user_profiles' as categoria,
  column_name as coluna,
  data_type as tipo,
  is_nullable as nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 6. Verificar estrutura da tabela chat_messages
SELECT
  'ESTRUTURA chat_messages' as categoria,
  column_name as coluna,
  data_type as tipo,
  is_nullable as nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'chat_messages'
ORDER BY ordinal_position;

-- 7. Verificar estrutura da tabela conversations
SELECT
  'ESTRUTURA conversations' as categoria,
  column_name as coluna,
  data_type as tipo,
  is_nullable as nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'conversations'
ORDER BY ordinal_position;

-- 8. Verificar índices importantes
SELECT
  'ÍNDICES' as categoria,
  tablename as tabela,
  indexname as indice,
  indexdef as definicao
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'chat_messages', 'conversations')
ORDER BY tablename, indexname;

-- 9. Verificar funções RPC
SELECT
  'FUNÇÕES RPC' as categoria,
  routine_name as funcao,
  routine_type as tipo,
  data_type as retorno
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('match_conversations', 'delete_old_conversations')
ORDER BY routine_name;

-- 10. RESUMO FINAL
SELECT
  'RESUMO FINAL' as categoria,
  CASE
    WHEN
      (SELECT COUNT(*) FROM pg_extension WHERE extname IN ('uuid-ossp', 'vector')) = 2
      AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('user_profiles', 'chat_messages', 'conversations')) >= 3
      AND (SELECT COUNT(*) FROM pg_class WHERE relname IN ('user_profiles', 'chat_messages', 'conversations') AND relrowsecurity = true) >= 3
      AND (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name = 'match_conversations') > 0
    THEN '✅ SCHEMA VALIDADO COM SUCESSO!'
    ELSE '⚠️ ALGUMAS VALIDAÇÕES FALHARAM - Verifique os resultados acima'
  END as status;

