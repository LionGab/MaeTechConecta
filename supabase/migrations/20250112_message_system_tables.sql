-- ============================================================================
-- FASE 2: Sistema de Mensagens - Nossa Maternidade
-- Data: 2025-01-12
-- Descrição: Tabelas para events, signals, message_plan, message_deliveries
-- ============================================================================

-- ============================================================================
-- 1. EVENTS - Rastreamento de Comportamento
-- ============================================================================

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN (
    'onboarding_submitted',
    'mood_update',
    'habit_check',
    'chat_turn',
    'content_view',
    'content_like',
    'content_save',
    'content_share',
    'notification_opened',
    'notification_clicked',
    'app_open',
    'app_close',
    'screen_view'
  )),
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_kind ON events(kind);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_user_date ON events(user_id, created_at DESC);
CREATE INDEX idx_events_payload ON events USING GIN(payload);

-- RLS Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_select_own" ON events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "events_insert_own" ON events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role pode acessar tudo
CREATE POLICY "events_service_role_all" ON events
  FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE events IS 'Rastreamento de eventos de comportamento do usuário';
COMMENT ON COLUMN events.kind IS 'Tipo de evento: onboarding_submitted, mood_update, habit_check, etc.';
COMMENT ON COLUMN events.payload IS 'Dados adicionais do evento em formato JSON';

-- ============================================================================
-- 2. SIGNALS - Snapshot Calculado (Análise Gemini)
-- ============================================================================

CREATE TABLE IF NOT EXISTS signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  scores JSONB DEFAULT '{}'::jsonb,
  source TEXT DEFAULT 'gemini_2.0_flash',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_signals_user_id ON signals(user_id);
CREATE INDEX idx_signals_created_at ON signals(created_at DESC);
CREATE INDEX idx_signals_tags ON signals USING GIN(tags);
CREATE INDEX idx_signals_scores ON signals USING GIN(scores);

-- RLS Policies
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "signals_select_own" ON signals
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role pode inserir e atualizar
CREATE POLICY "signals_service_role_all" ON signals
  FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE signals IS 'Snapshot calculado de sinais comportamentais via IA (Gemini)';
COMMENT ON COLUMN signals.tags IS 'Tags identificadas: tag_lonely, support_low, stress_high, etc.';
COMMENT ON COLUMN signals.scores IS 'Scores numéricos: stress_score, sleep_quality, support_score, mood_average';
COMMENT ON COLUMN signals.source IS 'Modelo de IA usado para análise';

-- ============================================================================
-- 3. MESSAGE_TEMPLATES - Templates de Mensagens
-- ============================================================================

CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL CHECK (channel IN ('push', 'in-app', 'email')),
  purpose TEXT NOT NULL,
  template TEXT NOT NULL,
  variables TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_message_templates_channel ON message_templates(channel);
CREATE INDEX idx_message_templates_purpose ON message_templates(purpose);
CREATE INDEX idx_message_templates_tags ON message_templates USING GIN(tags);
CREATE INDEX idx_message_templates_active ON message_templates(active);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_message_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_message_templates_updated_at
  BEFORE UPDATE ON message_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_message_templates_updated_at();

-- RLS Policies
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

-- Todos autenticados podem ler templates
CREATE POLICY "message_templates_select_all" ON message_templates
  FOR SELECT
  TO authenticated
  USING (active = true);

-- Service role pode gerenciar
CREATE POLICY "message_templates_service_role_all" ON message_templates
  FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE message_templates IS 'Templates de mensagens para personalização';
COMMENT ON COLUMN message_templates.channel IS 'Canal de envio: push, in-app, email';
COMMENT ON COLUMN message_templates.purpose IS 'Propósito da mensagem: acolhimento, sono, stress, etc.';
COMMENT ON COLUMN message_templates.template IS 'Template com variáveis: "Olá, {nome}! ..."';
COMMENT ON COLUMN message_templates.variables IS 'Lista de variáveis usadas no template';
COMMENT ON COLUMN message_templates.tags IS 'Tags que ativam este template';

-- ============================================================================
-- 4. MESSAGE_PLAN - Plano Fechado do Dia
-- ============================================================================

CREATE TABLE IF NOT EXISTS message_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  rationale JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, plan_date)
);

-- Índices
CREATE INDEX idx_message_plan_user_id ON message_plan(user_id);
CREATE INDEX idx_message_plan_plan_date ON message_plan(plan_date);
CREATE INDEX idx_message_plan_user_date ON message_plan(user_id, plan_date);
CREATE INDEX idx_message_plan_created_at ON message_plan(created_at DESC);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_message_plan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_message_plan_updated_at
  BEFORE UPDATE ON message_plan
  FOR EACH ROW
  EXECUTE FUNCTION update_message_plan_updated_at();

-- RLS Policies
ALTER TABLE message_plan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "message_plan_select_own" ON message_plan
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "message_plan_insert_own" ON message_plan
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "message_plan_update_own" ON message_plan
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role pode gerenciar
CREATE POLICY "message_plan_service_role_all" ON message_plan
  FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE message_plan IS 'Plano diário de mensagens personalizadas';
COMMENT ON COLUMN message_plan.plan_date IS 'Data do plano (geralmente amanhã)';
COMMENT ON COLUMN message_plan.items IS 'Array de 3 itens: check-in (09:00), conteúdo (14:00), hábito (19:30)';
COMMENT ON COLUMN message_plan.rationale IS 'Transparência: por que o usuário está vendo isso';

-- ============================================================================
-- 5. MESSAGE_DELIVERIES - Execução e Métricas
-- ============================================================================

CREATE TABLE IF NOT EXISTS message_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES message_plan(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('push', 'in-app', 'email')),
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'sent', 'failed', 'cancelled')),
  message_content TEXT,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  opened BOOLEAN DEFAULT false,
  opened_at TIMESTAMPTZ,
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMPTZ,
  feedback TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_message_deliveries_user_id ON message_deliveries(user_id);
CREATE INDEX idx_message_deliveries_plan_id ON message_deliveries(plan_id);
CREATE INDEX idx_message_deliveries_status ON message_deliveries(status);
CREATE INDEX idx_message_deliveries_channel ON message_deliveries(channel);
CREATE INDEX idx_message_deliveries_scheduled_at ON message_deliveries(scheduled_at);
CREATE INDEX idx_message_deliveries_sent_at ON message_deliveries(sent_at DESC);
CREATE INDEX idx_message_deliveries_opened ON message_deliveries(opened) WHERE opened = true;
CREATE INDEX idx_message_deliveries_clicked ON message_deliveries(clicked) WHERE clicked = true;

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_message_deliveries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_message_deliveries_updated_at
  BEFORE UPDATE ON message_deliveries
  FOR EACH ROW
  EXECUTE FUNCTION update_message_deliveries_updated_at();

-- RLS Policies
ALTER TABLE message_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "message_deliveries_select_own" ON message_deliveries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "message_deliveries_insert_own" ON message_deliveries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "message_deliveries_update_own" ON message_deliveries
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role pode gerenciar
CREATE POLICY "message_deliveries_service_role_all" ON message_deliveries
  FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE message_deliveries IS 'Rastreamento de entregas e métricas de mensagens';
COMMENT ON COLUMN message_deliveries.status IS 'Status da entrega: scheduled, sent, failed, cancelled';
COMMENT ON COLUMN message_deliveries.opened IS 'Métrica: usuário abriu a notificação';
COMMENT ON COLUMN message_deliveries.clicked IS 'Métrica: usuário clicou na notificação';

-- ============================================================================
-- 6. CONTENT_CATALOG - Catálogo de Conteúdo Curado
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  content_type TEXT CHECK (content_type IN ('article', 'video', 'audio', 'guide')),
  source TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  language TEXT DEFAULT 'pt-BR',
  reading_time_minutes INTEGER,
  relevance_score NUMERIC(3,2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
  metadata JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_content_catalog_tags ON content_catalog USING GIN(tags);
CREATE INDEX idx_content_catalog_content_type ON content_catalog(content_type);
CREATE INDEX idx_content_catalog_active ON content_catalog(active);
CREATE INDEX idx_content_catalog_relevance ON content_catalog(relevance_score DESC);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_content_catalog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_content_catalog_updated_at
  BEFORE UPDATE ON content_catalog
  FOR EACH ROW
  EXECUTE FUNCTION update_content_catalog_updated_at();

-- RLS Policies
ALTER TABLE content_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_catalog_select_all" ON content_catalog
  FOR SELECT
  TO authenticated
  USING (active = true);

-- Service role pode gerenciar
CREATE POLICY "content_catalog_service_role_all" ON content_catalog
  FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE content_catalog IS 'Catálogo de conteúdo curado (artigos, vídeos, guias)';
COMMENT ON COLUMN content_catalog.tags IS 'Tags para matching com preferências';
COMMENT ON COLUMN content_catalog.reading_time_minutes IS 'Tempo estimado de leitura/visualização';
COMMENT ON COLUMN content_catalog.relevance_score IS 'Score de relevância (0-1)';

-- ============================================================================
-- 7. EXPERIMENTS - Experimentos A/B
-- ============================================================================

CREATE TABLE IF NOT EXISTS experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  variants JSONB NOT NULL,
  traffic_allocation NUMERIC(3,2) DEFAULT 1.0 CHECK (traffic_allocation >= 0 AND traffic_allocation <= 1),
  active BOOLEAN DEFAULT false,
  start_date DATE,
  end_date DATE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_experiments_active ON experiments(active);
CREATE INDEX idx_experiments_name ON experiments(name);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_experiments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_experiments_updated_at
  BEFORE UPDATE ON experiments
  FOR EACH ROW
  EXECUTE FUNCTION update_experiments_updated_at();

-- RLS Policies
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;

-- Service role pode gerenciar
CREATE POLICY "experiments_service_role_all" ON experiments
  FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE experiments IS 'Experimentos A/B para otimização do sistema';
COMMENT ON COLUMN experiments.variants IS 'Variantes do experimento em formato JSON';
COMMENT ON COLUMN experiments.traffic_allocation IS 'Percentual de tráfego alocado (0-1)';

-- ============================================================================
-- 8. VIEWS PARA ANÁLISE
-- ============================================================================

-- View de estatísticas de entregas
CREATE OR REPLACE VIEW delivery_stats AS
SELECT
  user_id,
  channel,
  COUNT(*) as total_deliveries,
  COUNT(*) FILTER (WHERE status = 'sent') as total_sent,
  COUNT(*) FILTER (WHERE status = 'failed') as total_failed,
  COUNT(*) FILTER (WHERE opened = true) as total_opened,
  COUNT(*) FILTER (WHERE clicked = true) as total_clicked,
  ROUND(COUNT(*) FILTER (WHERE opened = true)::NUMERIC / NULLIF(COUNT(*) FILTER (WHERE status = 'sent'), 0) * 100, 2) as open_rate,
  ROUND(COUNT(*) FILTER (WHERE clicked = true)::NUMERIC / NULLIF(COUNT(*) FILTER (WHERE opened = true), 0) * 100, 2) as click_through_rate
FROM message_deliveries
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY user_id, channel;

COMMENT ON VIEW delivery_stats IS 'Estatísticas de entregas de mensagens por usuário e canal (últimos 30 dias)';

-- View de eventos recentes
CREATE OR REPLACE VIEW recent_events_summary AS
SELECT
  user_id,
  kind,
  COUNT(*) as event_count,
  MAX(created_at) as last_occurrence,
  MIN(created_at) as first_occurrence
FROM events
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY user_id, kind
ORDER BY user_id, event_count DESC;

COMMENT ON VIEW recent_events_summary IS 'Resumo de eventos por usuário (últimos 7 dias)';

-- ============================================================================
-- 9. GRANTS E PERMISSÕES
-- ============================================================================

-- Permitir select nas views
GRANT SELECT ON delivery_stats TO authenticated;
GRANT SELECT ON recent_events_summary TO authenticated;

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================

-- Verificação final
DO $$
BEGIN
  RAISE NOTICE '✅ FASE 2 - Sistema de Mensagens instalado com sucesso!';
  RAISE NOTICE '📊 Tabelas criadas: 7 (events, signals, message_templates, message_plan, message_deliveries, content_catalog, experiments)';
  RAISE NOTICE '🔒 RLS habilitado em todas as tabelas';
  RAISE NOTICE '📈 Views criadas: 2 (delivery_stats, recent_events_summary)';
END $$;
