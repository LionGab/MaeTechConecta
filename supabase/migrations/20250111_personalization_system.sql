-- ============================================================================
-- FASE 1: Sistema de Personalização - Nossa Maternidade
-- Data: 2025-01-11
-- Descrição: Tabelas core para tags, preferências e histórico de interações
-- ============================================================================

-- ============================================================================
-- 1. CONTENT_TAGS - Sistema de Tags para Conteúdo
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('topic', 'trimester', 'concern', 'content_type', 'urgency')),
  description TEXT,
  color TEXT, -- hex color para UI
  icon TEXT, -- nome do ícone para UI
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_content_tags_category ON content_tags(category);
CREATE INDEX idx_content_tags_name ON content_tags(name);
CREATE INDEX idx_content_tags_metadata ON content_tags USING GIN(metadata);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_content_tags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_content_tags_updated_at
  BEFORE UPDATE ON content_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_content_tags_updated_at();

-- RLS Policies
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;

-- Todos podem ler tags
CREATE POLICY "content_tags_select_all" ON content_tags
  FOR SELECT
  USING (true);

-- Apenas admins podem modificar (placeholder - ajustar depois)
CREATE POLICY "content_tags_insert_admin" ON content_tags
  FOR INSERT
  WITH CHECK (false); -- Desabilitado por enquanto

CREATE POLICY "content_tags_update_admin" ON content_tags
  FOR UPDATE
  USING (false); -- Desabilitado por enquanto

COMMENT ON TABLE content_tags IS 'Sistema de tags para categorização e personalização de conteúdo';
COMMENT ON COLUMN content_tags.category IS 'Categoria da tag: topic, trimester, concern, content_type, urgency';
COMMENT ON COLUMN content_tags.metadata IS 'Dados adicionais como peso, prioridade, etc';

-- ============================================================================
-- 2. CONTENT_TAG_RELATIONS - Relação Many-to-Many Conteúdo <-> Tags
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_tag_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id TEXT NOT NULL, -- ID flexível para curated_content, articles, etc
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'audio', 'guide', 'tip')),
  tag_id UUID NOT NULL REFERENCES content_tags(id) ON DELETE CASCADE,
  relevance_score NUMERIC(3,2) DEFAULT 1.0 CHECK (relevance_score >= 0 AND relevance_score <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(content_id, tag_id)
);

-- Índices para queries rápidas
CREATE INDEX idx_content_tag_relations_content ON content_tag_relations(content_id, content_type);
CREATE INDEX idx_content_tag_relations_tag ON content_tag_relations(tag_id);
CREATE INDEX idx_content_tag_relations_relevance ON content_tag_relations(relevance_score DESC);

-- RLS Policies
ALTER TABLE content_tag_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_tag_relations_select_all" ON content_tag_relations
  FOR SELECT
  USING (true);

CREATE POLICY "content_tag_relations_insert_admin" ON content_tag_relations
  FOR INSERT
  WITH CHECK (false); -- Desabilitado por enquanto

COMMENT ON TABLE content_tag_relations IS 'Relação many-to-many entre conteúdo e tags com score de relevância';
COMMENT ON COLUMN content_tag_relations.relevance_score IS 'Score 0-1 indicando relevância da tag para o conteúdo';

-- ============================================================================
-- 3. USER_PREFERENCES - Preferências e Interesses do Usuário
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES content_tags(id) ON DELETE CASCADE,
  preference_type TEXT NOT NULL CHECK (preference_type IN ('interest', 'concern', 'favorite', 'hidden')),
  weight NUMERIC(3,2) DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 1),
  explicit BOOLEAN DEFAULT true, -- true = usuário definiu, false = inferido
  source TEXT DEFAULT 'manual', -- manual, interaction, ai_inferred
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, tag_id, preference_type)
);

-- Índices
CREATE INDEX idx_user_preferences_user ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_tag ON user_preferences(tag_id);
CREATE INDEX idx_user_preferences_type ON user_preferences(preference_type);
CREATE INDEX idx_user_preferences_weight ON user_preferences(weight DESC);
CREATE INDEX idx_user_preferences_explicit ON user_preferences(explicit);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_user_preferences_updated_at();

-- RLS Policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_preferences_select_own" ON user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_preferences_insert_own" ON user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_preferences_update_own" ON user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "user_preferences_delete_own" ON user_preferences
  FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE user_preferences IS 'Preferências e interesses do usuário por tag';
COMMENT ON COLUMN user_preferences.explicit IS 'true = usuário definiu manualmente, false = inferido por IA';
COMMENT ON COLUMN user_preferences.source IS 'Origem da preferência: manual, interaction, ai_inferred';

-- ============================================================================
-- 4. USER_INTERACTION_HISTORY - Histórico de Interações
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_interaction_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'audio', 'guide', 'tip', 'chat')),
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'like', 'save', 'share', 'complete', 'skip', 'feedback')),
  duration_seconds INTEGER, -- tempo de visualização/leitura
  engagement_score NUMERIC(3,2) CHECK (engagement_score >= 0 AND engagement_score <= 1),
  context JSONB DEFAULT '{}'::jsonb, -- dados adicionais como scroll_depth, clicks, etc
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para análise e queries
CREATE INDEX idx_interaction_history_user ON user_interaction_history(user_id);
CREATE INDEX idx_interaction_history_content ON user_interaction_history(content_id, content_type);
CREATE INDEX idx_interaction_history_type ON user_interaction_history(interaction_type);
CREATE INDEX idx_interaction_history_created ON user_interaction_history(created_at DESC);
CREATE INDEX idx_interaction_history_engagement ON user_interaction_history(engagement_score DESC);

-- Índice composto para agregações por usuário e período
CREATE INDEX idx_interaction_history_user_date ON user_interaction_history(user_id, created_at DESC);

-- RLS Policies
ALTER TABLE user_interaction_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interaction_history_select_own" ON user_interaction_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "interaction_history_insert_own" ON user_interaction_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Apenas admin pode modificar histórico
CREATE POLICY "interaction_history_update_admin" ON user_interaction_history
  FOR UPDATE
  USING (false);

CREATE POLICY "interaction_history_delete_admin" ON user_interaction_history
  FOR DELETE
  USING (false);

COMMENT ON TABLE user_interaction_history IS 'Histórico completo de interações do usuário com conteúdo';
COMMENT ON COLUMN user_interaction_history.engagement_score IS 'Score 0-1 calculado baseado em duração, ações e contexto';
COMMENT ON COLUMN user_interaction_history.context IS 'Dados adicionais: scroll_depth, click_count, completion_rate, etc';

-- ============================================================================
-- 5. TAGS INICIAIS - Seeds Básicas
-- ============================================================================

-- Tags de trimestre
INSERT INTO content_tags (name, category, description, color, icon) VALUES
  ('Primeiro Trimestre', 'trimester', 'Semanas 1-13 da gestação', '#FF6B6B', 'calendar-1'),
  ('Segundo Trimestre', 'trimester', 'Semanas 14-27 da gestação', '#4ECDC4', 'calendar-2'),
  ('Terceiro Trimestre', 'trimester', 'Semanas 28-40 da gestação', '#95E1D3', 'calendar-3'),
  ('Pós-Parto', 'trimester', 'Período após o nascimento', '#F38181', 'baby')
ON CONFLICT (name) DO NOTHING;

-- Tags de tópicos principais
INSERT INTO content_tags (name, category, description, color, icon) VALUES
  ('Nutrição', 'topic', 'Alimentação e dieta durante gestação', '#FFA07A', 'restaurant'),
  ('Exercícios', 'topic', 'Atividades físicas seguras', '#98D8C8', 'fitness'),
  ('Saúde Mental', 'topic', 'Bem-estar emocional e psicológico', '#B8A9DB', 'brain'),
  ('Desenvolvimento Fetal', 'topic', 'Crescimento do bebê', '#FFB6C1', 'trending-up'),
  ('Preparação Parto', 'topic', 'Preparação para o momento do parto', '#DDA15E', 'heart'),
  ('Amamentação', 'topic', 'Orientações sobre aleitamento', '#8ECAE6', 'droplet'),
  ('Cuidados Bebê', 'topic', 'Cuidados com recém-nascido', '#FFD670', 'gift')
ON CONFLICT (name) DO NOTHING;

-- Tags de preocupações comuns
INSERT INTO content_tags (name, category, description, color, icon) VALUES
  ('Náuseas', 'concern', 'Enjoos e mal-estar', '#FF6B6B', 'alert-circle'),
  ('Ansiedade', 'concern', 'Preocupações e medos', '#A8DADC', 'shield-alert'),
  ('Dor nas Costas', 'concern', 'Desconforto lombar', '#F4A261', 'activity'),
  ('Insônia', 'concern', 'Dificuldade para dormir', '#457B9D', 'moon'),
  ('Inchaço', 'concern', 'Retenção de líquidos', '#2A9D8F', 'droplet')
ON CONFLICT (name) DO NOTHING;

-- Tags de tipo de conteúdo
INSERT INTO content_tags (name, category, description, color, icon) VALUES
  ('Artigo Científico', 'content_type', 'Conteúdo baseado em pesquisas', '#264653', 'file-text'),
  ('Guia Prático', 'content_type', 'Passo a passo e tutoriais', '#287271', 'list'),
  ('Vídeo Educativo', 'content_type', 'Conteúdo em vídeo', '#E76F51', 'video'),
  ('Dica Rápida', 'content_type', 'Informação breve e direta', '#F4A261', 'zap'),
  ('Experiência Real', 'content_type', 'Relatos de outras mães', '#E9C46A', 'message-circle')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 6. FUNCTIONS AUXILIARES
-- ============================================================================

-- Função para calcular engagement score baseado em interação
CREATE OR REPLACE FUNCTION calculate_engagement_score(
  p_interaction_type TEXT,
  p_duration_seconds INTEGER,
  p_context JSONB
)
RETURNS NUMERIC AS $$
DECLARE
  base_score NUMERIC := 0;
  duration_bonus NUMERIC := 0;
  context_bonus NUMERIC := 0;
BEGIN
  -- Score base por tipo de interação
  base_score := CASE p_interaction_type
    WHEN 'view' THEN 0.1
    WHEN 'like' THEN 0.6
    WHEN 'save' THEN 0.8
    WHEN 'share' THEN 0.9
    WHEN 'complete' THEN 1.0
    WHEN 'skip' THEN -0.2
    WHEN 'feedback' THEN 0.7
    ELSE 0
  END;

  -- Bônus por duração (normalizado)
  IF p_duration_seconds IS NOT NULL AND p_duration_seconds > 0 THEN
    duration_bonus := LEAST(p_duration_seconds::NUMERIC / 300, 0.3); -- máximo 5min = 0.3 bonus
  END IF;

  -- Bônus por contexto (scroll_depth, completion_rate, etc)
  IF p_context IS NOT NULL THEN
    IF (p_context->>'scroll_depth')::NUMERIC > 0.7 THEN
      context_bonus := context_bonus + 0.1;
    END IF;
    IF (p_context->>'completion_rate')::NUMERIC > 0.8 THEN
      context_bonus := context_bonus + 0.2;
    END IF;
  END IF;

  -- Score final normalizado entre 0 e 1
  RETURN GREATEST(0, LEAST(1, base_score + duration_bonus + context_bonus));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_engagement_score IS 'Calcula score de engajamento (0-1) baseado em tipo, duração e contexto da interação';

-- Função para obter tags mais relevantes para um usuário
CREATE OR REPLACE FUNCTION get_user_top_tags(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
  tag_id UUID,
  tag_name TEXT,
  tag_category TEXT,
  combined_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH preference_scores AS (
    SELECT
      up.tag_id,
      SUM(up.weight) as preference_weight
    FROM user_preferences up
    WHERE up.user_id = p_user_id
      AND up.preference_type IN ('interest', 'concern', 'favorite')
    GROUP BY up.tag_id
  ),
  interaction_scores AS (
    SELECT
      ctr.tag_id,
      AVG(uih.engagement_score) * COUNT(*)::NUMERIC / 100 as interaction_weight
    FROM user_interaction_history uih
    JOIN content_tag_relations ctr ON ctr.content_id = uih.content_id
    WHERE uih.user_id = p_user_id
      AND uih.created_at > NOW() - INTERVAL '30 days'
    GROUP BY ctr.tag_id
  )
  SELECT
    ct.id as tag_id,
    ct.name as tag_name,
    ct.category as tag_category,
    COALESCE(ps.preference_weight, 0) + COALESCE(is.interaction_weight, 0) as combined_score
  FROM content_tags ct
  LEFT JOIN preference_scores ps ON ps.tag_id = ct.id
  LEFT JOIN interaction_scores is ON is.tag_id = ct.id
  WHERE COALESCE(ps.preference_weight, 0) + COALESCE(is.interaction_weight, 0) > 0
  ORDER BY combined_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION get_user_top_tags IS 'Retorna top N tags mais relevantes para usuário baseado em preferências e interações';

-- ============================================================================
-- 7. VIEWS PARA ANÁLISE
-- ============================================================================

-- View de estatísticas por usuário
CREATE OR REPLACE VIEW user_engagement_stats AS
SELECT
  user_id,
  COUNT(DISTINCT content_id) as total_content_viewed,
  COUNT(*) FILTER (WHERE interaction_type = 'like') as total_likes,
  COUNT(*) FILTER (WHERE interaction_type = 'save') as total_saves,
  COUNT(*) FILTER (WHERE interaction_type = 'share') as total_shares,
  AVG(engagement_score) as avg_engagement_score,
  SUM(duration_seconds) as total_time_seconds,
  MAX(created_at) as last_interaction_at
FROM user_interaction_history
GROUP BY user_id;

COMMENT ON VIEW user_engagement_stats IS 'Estatísticas agregadas de engajamento por usuário';

-- View de conteúdo popular
CREATE OR REPLACE VIEW popular_content_stats AS
SELECT
  content_id,
  content_type,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_interactions,
  AVG(engagement_score) as avg_engagement,
  COUNT(*) FILTER (WHERE interaction_type = 'like') as total_likes,
  COUNT(*) FILTER (WHERE interaction_type = 'save') as total_saves
FROM user_interaction_history
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY content_id, content_type
ORDER BY avg_engagement DESC, unique_users DESC;

COMMENT ON VIEW popular_content_stats IS 'Estatísticas de conteúdo mais popular (últimos 30 dias)';

-- ============================================================================
-- 8. GRANTS E PERMISSÕES
-- ============================================================================

-- Permitir que authenticated users possam usar as funções
GRANT EXECUTE ON FUNCTION calculate_engagement_score TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_top_tags TO authenticated;

-- Permitir select nas views
GRANT SELECT ON user_engagement_stats TO authenticated;
GRANT SELECT ON popular_content_stats TO authenticated;

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================

-- Verificação final
DO $$
BEGIN
  RAISE NOTICE '✅ FASE 1 - Sistema de Personalização instalado com sucesso!';
  RAISE NOTICE '📊 Tabelas criadas: 4 (content_tags, content_tag_relations, user_preferences, user_interaction_history)';
  RAISE NOTICE '🏷️ Tags iniciais: % tags inseridas', (SELECT COUNT(*) FROM content_tags);
  RAISE NOTICE '🔒 RLS habilitado em todas as tabelas';
  RAISE NOTICE '⚡ Funções auxiliares: 2 (calculate_engagement_score, get_user_top_tags)';
  RAISE NOTICE '📈 Views criadas: 2 (user_engagement_stats, popular_content_stats)';
END $$;
