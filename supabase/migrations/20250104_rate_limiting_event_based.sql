-- =====================================================
-- Migration: Rate Limiting Event-Based
-- Data: 2025-01-04
-- Descrição: Substitui rate limiting por modelo event-based
-- =====================================================

-- Criar tabela para eventos de rate limiting (um registro por request)
CREATE TABLE IF NOT EXISTS rate_limit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice composto para queries rápidas (user_id + endpoint + created_at)
CREATE INDEX IF NOT EXISTS idx_rl_user_ep_time
  ON rate_limit_events (user_id, endpoint, created_at DESC);

-- Índice adicional para limpeza eficiente
CREATE INDEX IF NOT EXISTS idx_rl_created_at
  ON rate_limit_events (created_at);

-- RLS: Usuários só podem ver seus próprios eventos
ALTER TABLE rate_limit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rate limit events"
  ON rate_limit_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- Função para limpeza automática de eventos antigos (> 1 dia)
CREATE OR REPLACE FUNCTION cleanup_rate_limit_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM rate_limit_events 
  WHERE created_at < NOW() - INTERVAL '1 day';
END;
$$;

-- Comentários para documentação
COMMENT ON TABLE rate_limit_events IS 'Eventos de rate limiting - um registro por request';
COMMENT ON COLUMN rate_limit_events.user_id IS 'ID do usuário que fez a request';
COMMENT ON COLUMN rate_limit_events.endpoint IS 'Endpoint da Edge Function (ex: chat, dailyPlan)';
COMMENT ON COLUMN rate_limit_events.created_at IS 'Timestamp da requisição';

-- =====================================================
-- Limpeza: Remover tabela antiga se existir
-- =====================================================

-- Se existir a tabela antiga rate_limit_requests, removê-la
DROP TABLE IF EXISTS rate_limit_requests CASCADE;


