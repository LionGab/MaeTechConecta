-- Script de Verificação da Migration 001_gemini_memory.sql
-- Execute estas queries no Supabase Dashboard > SQL Editor para verificar se a migration foi executada

-- 1. Verificar extensão pgvector
SELECT
  extname as extensao,
  extversion as versao
FROM pg_extension
WHERE extname = 'vector';

-- 2. Verificar tabela conversations
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'conversations'
ORDER BY ordinal_position;

-- 3. Verificar função match_conversations
SELECT
  routine_name as funcao,
  routine_type as tipo,
  data_type as retorno
FROM information_schema.routines
WHERE routine_name = 'match_conversations';

-- 4. Verificar políticas RLS
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as operacao
FROM pg_policies
WHERE tablename = 'conversations'
ORDER BY policyname;

-- 5. Verificar índices
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'conversations';

-- 6. Verificar se há dados na tabela (opcional)
SELECT COUNT(*) as total_conversas
FROM conversations;


