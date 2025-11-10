-- =====================================================
-- MIGRAÇÃO GEMINI 1.5 PRO + MEMÓRIA VETORIAL
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. Habilitar extensão pgvector (se não existir)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Criar tabela de conversas com embedding vetorial
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  embedding vector(768), -- Embedding do Gemini text-embedding-004 (768 dimensões)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Foreign key constraint nomeada
  CONSTRAINT conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 3. Criar índice HNSW para busca vetorial eficiente (IVFFlat como fallback)
-- Usar ivfflat para compatibilidade com planos gratuitos do Supabase
CREATE INDEX IF NOT EXISTS conversations_embedding_idx
ON conversations
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Índice para busca por usuário e data
CREATE INDEX IF NOT EXISTS conversations_user_id_created_at_idx
ON conversations (user_id, created_at DESC);

-- 4. Função RPC para busca vetorial de conversas relevantes
CREATE OR REPLACE FUNCTION match_conversations(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  filter_user_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  message text,
  response text,
  similarity float,
  created_at timestamptz
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    c.id,
    c.message,
    c.response,
    1 - (c.embedding <=> query_embedding) AS similarity,
    c.created_at
  FROM conversations c
  WHERE
    (filter_user_id IS NULL OR c.user_id = filter_user_id)
    AND c.embedding IS NOT NULL
    AND 1 - (c.embedding <=> query_embedding) > match_threshold
    AND c.created_at > NOW() - INTERVAL '30 days' -- Apenas últimos 30 dias
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- 5. Função para limpar conversas antigas (mais de 30 dias)
CREATE OR REPLACE FUNCTION delete_old_conversations()
RETURNS void
LANGUAGE sql
AS $$
  DELETE FROM conversations
  WHERE created_at < NOW() - INTERVAL '30 days';
$$;

-- 6. Política RLS (Row Level Security) - Usuários só veem suas próprias conversas
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem inserir suas próprias conversas
DROP POLICY IF EXISTS "Users can insert their own conversations" ON conversations;
CREATE POLICY "Users can insert their own conversations"
ON conversations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem ler suas próprias conversas
DROP POLICY IF EXISTS "Users can read their own conversations" ON conversations;
CREATE POLICY "Users can read their own conversations"
ON conversations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política: Usuários podem deletar suas próprias conversas
DROP POLICY IF EXISTS "Users can delete their own conversations" ON conversations;
CREATE POLICY "Users can delete their own conversations"
ON conversations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 7. Comentários para documentação
COMMENT ON TABLE conversations IS 'Armazena conversas com embeddings vetoriais para busca semântica';
COMMENT ON COLUMN conversations.embedding IS 'Embedding vetorial de 768 dimensões gerado pelo Gemini text-embedding-004';
COMMENT ON FUNCTION match_conversations IS 'Busca conversas relevantes usando similaridade vetorial (cosine similarity)';
COMMENT ON FUNCTION delete_old_conversations IS 'Remove conversas com mais de 30 dias para manter base de dados otimizada';


