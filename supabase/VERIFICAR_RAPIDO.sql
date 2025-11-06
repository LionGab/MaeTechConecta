-- Verificação Rápida - Execute no SQL Editor do Supabase
-- Este script verifica se a migration foi executada

-- 1. Verificar extensão
SELECT 'Extensão pgvector' as item,
  CASE WHEN COUNT(*) > 0 THEN '✅ OK' ELSE '❌ FALTANDO' END as status
FROM pg_extension WHERE extname = 'vector';

-- 2. Verificar tabela
SELECT 'Tabela conversations' as item,
  CASE
    WHEN COUNT(*) = 6 THEN '✅ OK (6 colunas)'
    WHEN COUNT(*) > 0 THEN '⚠️ PARCIAL'
    ELSE '❌ FALTANDO'
  END as status
FROM information_schema.columns WHERE table_name = 'conversations';

-- 3. Verificar função
SELECT 'Função match_conversations' as item,
  CASE WHEN COUNT(*) > 0 THEN '✅ OK' ELSE '❌ FALTANDO' END as status
FROM information_schema.routines WHERE routine_name = 'match_conversations';

-- 4. Verificar RLS
SELECT 'Políticas RLS' as item,
  CASE
    WHEN COUNT(*) = 3 THEN '✅ OK (3 políticas)'
    WHEN COUNT(*) > 0 THEN '⚠️ PARCIAL'
    ELSE '❌ FALTANDO'
  END as status
FROM pg_policies WHERE tablename = 'conversations';

-- 5. Verificar índices
SELECT 'Índices' as item,
  CASE
    WHEN COUNT(*) >= 2 THEN '✅ OK'
    WHEN COUNT(*) > 0 THEN '⚠️ PARCIAL'
    ELSE '❌ FALTANDO'
  END as status
FROM pg_indexes WHERE tablename = 'conversations';

-- RESUMO FINAL
SELECT
  CASE
    WHEN
      (SELECT COUNT(*) FROM pg_extension WHERE extname = 'vector') > 0
      AND (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'conversations') = 6
      AND (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name = 'match_conversations') > 0
      AND (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'conversations') = 3
    THEN '✅ MIGRATION EXECUTADA COM SUCESSO!'
    ELSE '❌ MIGRATION NÃO EXECUTADA - Execute o arquivo EXECUTAR_AGORA.sql'
  END as resultado_final;

