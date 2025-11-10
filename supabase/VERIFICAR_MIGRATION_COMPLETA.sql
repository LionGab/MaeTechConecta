-- =====================================================
-- VERIFICAÇÃO COMPLETA DA MIGRATION 001_gemini_memory.sql
-- Execute este script no Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. Verificar extensão pgvector
SELECT
  '1. EXTENSÃO PGVECTOR' as verificacao,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ EXTENSÃO HABILITADA'
    ELSE '❌ EXTENSÃO NÃO ENCONTRADA'
  END as status,
  extname as extensao,
  extversion as versao
FROM pg_extension
WHERE extname = 'vector';

-- 2. Verificar tabela conversations
SELECT
  '2. TABELA CONVERSATIONS' as verificacao,
  CASE
    WHEN COUNT(*) = 6 THEN '✅ TABELA CRIADA CORRETAMENTE (6 colunas)'
    WHEN COUNT(*) > 0 THEN '⚠️ TABELA CRIADA MAS COM COLUNAS DIFERENTES'
    ELSE '❌ TABELA NÃO ENCONTRADA'
  END as status,
  COUNT(*) as total_colunas,
  string_agg(column_name || ' (' || data_type || ')', ', ' ORDER BY ordinal_position) as colunas
FROM information_schema.columns
WHERE table_name = 'conversations';

-- 3. Verificar função match_conversations
SELECT
  '3. FUNÇÃO MATCH_CONVERSATIONS' as verificacao,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ FUNÇÃO CRIADA'
    ELSE '❌ FUNÇÃO NÃO ENCONTRADA'
  END as status,
  routine_name as funcao,
  routine_type as tipo
FROM information_schema.routines
WHERE routine_name = 'match_conversations';

-- 4. Verificar políticas RLS
SELECT
  '4. POLÍTICAS RLS' as verificacao,
  CASE
    WHEN COUNT(*) = 3 THEN '✅ TODAS AS 3 POLÍTICAS CRIADAS'
    WHEN COUNT(*) > 0 THEN '⚠️ ALGUMAS POLÍTICAS FALTANDO'
    ELSE '❌ NENHUMA POLÍTICA ENCONTRADA'
  END as status,
  COUNT(*) as total_politicas,
  string_agg(policyname || ' (' || cmd || ')', ', ' ORDER BY policyname) as politicas
FROM pg_policies
WHERE tablename = 'conversations';

-- 5. Verificar índices
SELECT
  '5. ÍNDICES' as verificacao,
  CASE
    WHEN COUNT(*) >= 2 THEN '✅ ÍNDICES CRIADOS'
    WHEN COUNT(*) > 0 THEN '⚠️ ALGUNS ÍNDICES FALTANDO'
    ELSE '❌ NENHUM ÍNDICE ENCONTRADO'
  END as status,
  COUNT(*) as total_indices,
  string_agg(indexname, ', ' ORDER BY indexname) as indices
FROM pg_indexes
WHERE tablename = 'conversations';

-- 6. Verificar se RLS está habilitado
SELECT
  '6. RLS HABILITADO' as verificacao,
  CASE
    WHEN relrowsecurity = true THEN '✅ RLS HABILITADO'
    ELSE '❌ RLS NÃO HABILITADO'
  END as status
FROM pg_class
WHERE relname = 'conversations';

-- 7. Resumo final
SELECT
  'RESUMO FINAL' as verificacao,
  CASE
    WHEN
      (SELECT COUNT(*) FROM pg_extension WHERE extname = 'vector') > 0
      AND (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'conversations') = 6
      AND (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name = 'match_conversations') > 0
      AND (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'conversations') = 3
      AND (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'conversations') >= 2
      AND (SELECT relrowsecurity FROM pg_class WHERE relname = 'conversations') = true
    THEN '✅ MIGRATION EXECUTADA COM SUCESSO!'
    ELSE '❌ MIGRATION INCOMPLETA - EXECUTE O ARQUIVO 001_gemini_memory.sql'
  END as status;


