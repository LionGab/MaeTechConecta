-- =====================================================
-- NOSSA MATERNIDADE - Schema Consolidado Completo
-- Data: 2025-01-06
-- Versão: 1.0
-- =====================================================
--
-- Esta migração consolida TODAS as tabelas necessárias:
-- - 10 tabelas do schema Nossa Maternidade original
-- - Tabelas adicionais: daily_plans, user_feature_flags
-- - Conversations com embeddings vetoriais (Gemini)
-- - Alert logs para auditoria
--
-- É IDEMPOTENTE: pode rodar múltiplas vezes sem erro
-- Execute no Supabase Dashboard > SQL Editor
-- =====================================================

-- =====================================================
-- EXTENSÕES NECESSÁRIAS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para busca textual eficiente

-- =====================================================
-- TIPOS CUSTOMIZADOS (ENUMS)
-- =====================================================

-- Tipo de usuária
DO $$ BEGIN
  CREATE TYPE user_type AS ENUM ('gestante', 'mae', 'tentante', 'puerperio', 'mae_estabelecida');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tier de subscription
DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('free', 'premium');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Role de mensagem
DO $$ BEGIN
  CREATE TYPE message_role AS ENUM ('user', 'assistant');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tipo de conteúdo
DO $$ BEGIN
  CREATE TYPE content_type AS ENUM ('article', 'video', 'audio', 'post');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Ação de moderação
DO $$ BEGIN
  CREATE TYPE moderation_action AS ENUM ('allow', 'block', 'flag');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tipo de risco
DO $$ BEGIN
  CREATE TYPE risk_type AS ENUM ('medical', 'psychological');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Grupo de A/B testing
DO $$ BEGIN
  CREATE TYPE ab_test_group AS ENUM ('control', 'grok', 'gemini', 'smart');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 1. USER_PROFILES
-- =====================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  type user_type NOT NULL,
  pregnancy_week INTEGER CHECK (pregnancy_week IS NULL OR (pregnancy_week >= 1 AND pregnancy_week <= 42)),
  baby_name TEXT,
  preferences TEXT[] DEFAULT '{}', -- Mudado de JSONB para TEXT[] para match com interface TS
  subscription_tier subscription_tier DEFAULT 'free',
  onboarding_data JSONB DEFAULT '{}'::jsonb,
  behavior_analysis JSONB,
  risk_level INTEGER DEFAULT 0 CHECK (risk_level >= 0 AND risk_level <= 10),
  daily_interactions INTEGER DEFAULT 0,
  last_interaction_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar colunas faltantes se já existir a tabela
DO $$ BEGIN
  ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS daily_interactions INTEGER DEFAULT 0;
  ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_interaction_date TIMESTAMP WITH TIME ZONE;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- Índices para user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_type ON user_profiles(type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_risk_level ON user_profiles(risk_level);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_interaction ON user_profiles(last_interaction_date DESC) WHERE last_interaction_date IS NOT NULL;

-- =====================================================
-- 2. CONVERSATION_HISTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS conversation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]'::jsonb,
  summary_daily TEXT,
  summary_weekly TEXT,
  key_memories JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_conversation_history_user_id ON conversation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_history_created_at ON conversation_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_history_updated_at ON conversation_history(updated_at DESC);

-- =====================================================
-- 3. CHAT_MESSAGES
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  role message_role NOT NULL DEFAULT 'user',
  context_data JSONB DEFAULT '{}'::jsonb,
  is_urgent BOOLEAN DEFAULT FALSE,
  risk_flag INTEGER CHECK (risk_flag IS NULL OR (risk_flag >= 0 AND risk_flag <= 10)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(role);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_urgent ON chat_messages(is_urgent) WHERE is_urgent = TRUE;
CREATE INDEX IF NOT EXISTS idx_chat_messages_risk_flag ON chat_messages(risk_flag) WHERE risk_flag IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_date ON chat_messages(user_id, created_at DESC);

-- =====================================================
-- 4. CONVERSATIONS (Gemini Vector Memory)
-- =====================================================

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  embedding vector(768), -- Gemini text-embedding-004
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS conversations_embedding_idx
ON conversations
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS conversations_user_id_created_at_idx
ON conversations (user_id, created_at DESC);

-- =====================================================
-- 5. DAILY_PLANS
-- =====================================================

CREATE TABLE IF NOT EXISTS daily_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  priorities TEXT[] DEFAULT '{}',
  tip TEXT,
  tip_video_url TEXT,
  recipe TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_plans_user_id ON daily_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_plans_date ON daily_plans(date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_plans_user_date ON daily_plans(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_plans_created_at ON daily_plans(created_at DESC);

-- =====================================================
-- 6. USER_FEATURE_FLAGS (A/B Testing)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_feature_flags (
  user_id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  flags JSONB DEFAULT '{}'::jsonb,
  ab_test_group ab_test_group DEFAULT 'control',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_feature_flags_ab_test_group ON user_feature_flags(ab_test_group);
CREATE INDEX IF NOT EXISTS idx_user_feature_flags_updated_at ON user_feature_flags(updated_at DESC);

-- =====================================================
-- 7. HABITS
-- =====================================================

CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_is_active ON habits(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_habits_category ON habits(category) WHERE category IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_habits_created_at ON habits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_habits_user_active ON habits(user_id, is_active) WHERE is_active = TRUE;

-- =====================================================
-- 8. HABIT_COMPLETIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions(date DESC);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_date ON habit_completions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_habit_completions_created_at ON habit_completions(completed_at DESC);

-- =====================================================
-- 9. CONTENT_ITEMS
-- =====================================================

CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type content_type NOT NULL,
  content_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'Natália Valente',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_category ON content_items(category) WHERE category IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_content_items_is_featured ON content_items(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_content_items_created_at ON content_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_items_tags ON content_items USING GIN(tags);

-- =====================================================
-- 10. CONTENT_FAVORITES
-- =====================================================

CREATE TABLE IF NOT EXISTS content_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

CREATE INDEX IF NOT EXISTS idx_content_favorites_user_id ON content_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_content_favorites_content_id ON content_favorites(content_id);
CREATE INDEX IF NOT EXISTS idx_content_favorites_created_at ON content_favorites(created_at DESC);

-- =====================================================
-- 11. MODERATION_QUEUE
-- =====================================================

CREATE TABLE IF NOT EXISTS moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  category TEXT,
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 5),
  action moderation_action NOT NULL,
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by UUID REFERENCES user_profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moderation_queue_user_id ON moderation_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_reviewed ON moderation_queue(reviewed) WHERE reviewed = FALSE;
CREATE INDEX IF NOT EXISTS idx_moderation_queue_severity ON moderation_queue(severity);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_created_at ON moderation_queue(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_action ON moderation_queue(action);

-- =====================================================
-- 12. RISK_ALERTS
-- =====================================================

CREATE TABLE IF NOT EXISTS risk_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  risk_type risk_type NOT NULL,
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 10),
  message_context TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_risk_alerts_user_id ON risk_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_resolved ON risk_alerts(resolved) WHERE resolved = FALSE;
CREATE INDEX IF NOT EXISTS idx_risk_alerts_severity ON risk_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_risk_type ON risk_alerts(risk_type);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_created_at ON risk_alerts(created_at DESC);

-- =====================================================
-- 13. ALERT_LOGS (Auditoria de alto risco)
-- =====================================================

CREATE TABLE IF NOT EXISTS alert_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  risk_level INTEGER CHECK (risk_level >= 0 AND risk_level <= 10),
  risk_flags JSONB DEFAULT '[]'::jsonb,
  notified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  handled_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  handled_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alert_logs_user_id ON alert_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_logs_risk_level ON alert_logs(risk_level) WHERE risk_level >= 8;
CREATE INDEX IF NOT EXISTS idx_alert_logs_notified_at ON alert_logs(notified_at);
CREATE INDEX IF NOT EXISTS idx_alert_logs_handled_at ON alert_logs(handled_at) WHERE handled_at IS NULL;

-- =====================================================
-- 14. VECTOR_EMBEDDINGS (RAG)
-- =====================================================

CREATE TABLE IF NOT EXISTS vector_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(768) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vector_embeddings_user_id ON vector_embeddings(user_id);
CREATE INDEX IF NOT EXISTS idx_vector_embeddings_created_at ON vector_embeddings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vector_embeddings_embedding ON vector_embeddings
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função RPC para busca vetorial de conversas relevantes
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
    AND c.created_at > NOW() - INTERVAL '30 days'
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Função para limpar conversas antigas
CREATE OR REPLACE FUNCTION delete_old_conversations()
RETURNS void
LANGUAGE sql
AS $$
  DELETE FROM conversations
  WHERE created_at < NOW() - INTERVAL '30 days';
$$;

-- Função para resetar daily_interactions diariamente
CREATE OR REPLACE FUNCTION reset_daily_interactions()
RETURNS void
LANGUAGE sql
AS $$
  UPDATE user_profiles
  SET daily_interactions = 0
  WHERE last_interaction_date < CURRENT_DATE;
$$;

-- =====================================================
-- TRIGGERS
-- =====================================================

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversation_history_updated_at ON conversation_history;
CREATE TRIGGER update_conversation_history_updated_at
  BEFORE UPDATE ON conversation_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_feature_flags_updated_at ON user_feature_flags;
CREATE TRIGGER update_user_feature_flags_updated_at
  BEFORE UPDATE ON user_feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vector_embeddings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- USER_PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- CONVERSATION_HISTORY
DROP POLICY IF EXISTS "Users can view own conversation" ON conversation_history;
CREATE POLICY "Users can view own conversation" ON conversation_history
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own conversation" ON conversation_history;
CREATE POLICY "Users can update own conversation" ON conversation_history
  FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own conversation" ON conversation_history;
CREATE POLICY "Users can insert own conversation" ON conversation_history
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- CHAT_MESSAGES
DROP POLICY IF EXISTS "Users can view own messages" ON chat_messages;
CREATE POLICY "Users can view own messages" ON chat_messages
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own messages" ON chat_messages;
CREATE POLICY "Users can insert own messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- CONVERSATIONS
DROP POLICY IF EXISTS "Users can insert their own conversations" ON conversations;
CREATE POLICY "Users can insert their own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can read their own conversations" ON conversations;
CREATE POLICY "Users can read their own conversations" ON conversations
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete their own conversations" ON conversations;
CREATE POLICY "Users can delete their own conversations" ON conversations
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- DAILY_PLANS
DROP POLICY IF EXISTS "Users can view own daily plans" ON daily_plans;
CREATE POLICY "Users can view own daily plans" ON daily_plans
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own daily plans" ON daily_plans;
CREATE POLICY "Users can insert own daily plans" ON daily_plans
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own daily plans" ON daily_plans;
CREATE POLICY "Users can update own daily plans" ON daily_plans
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- USER_FEATURE_FLAGS
DROP POLICY IF EXISTS "Users can view own feature flags" ON user_feature_flags;
CREATE POLICY "Users can view own feature flags" ON user_feature_flags
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can upsert own feature flags" ON user_feature_flags;
CREATE POLICY "Users can upsert own feature flags" ON user_feature_flags
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own feature flags" ON user_feature_flags;
CREATE POLICY "Users can update own feature flags" ON user_feature_flags
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- HABITS
DROP POLICY IF EXISTS "Users can manage own habits" ON habits;
CREATE POLICY "Users can manage own habits" ON habits
  FOR ALL USING (auth.uid()::text = user_id::text);

-- HABIT_COMPLETIONS
DROP POLICY IF EXISTS "Users can manage own completions" ON habit_completions;
CREATE POLICY "Users can manage own completions" ON habit_completions
  FOR ALL USING (auth.uid()::text = user_id::text);

-- CONTENT_ITEMS (público)
DROP POLICY IF EXISTS "Everyone can view content" ON content_items;
CREATE POLICY "Everyone can view content" ON content_items
  FOR SELECT USING (true);

-- CONTENT_FAVORITES
DROP POLICY IF EXISTS "Users can manage own favorites" ON content_favorites;
CREATE POLICY "Users can manage own favorites" ON content_favorites
  FOR ALL USING (auth.uid()::text = user_id::text);

-- MODERATION_QUEUE
DROP POLICY IF EXISTS "Users can insert own moderation entry" ON moderation_queue;
CREATE POLICY "Users can insert own moderation entry" ON moderation_queue
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- RISK_ALERTS
DROP POLICY IF EXISTS "Users can view own risk alerts" ON risk_alerts;
CREATE POLICY "Users can view own risk alerts" ON risk_alerts
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- VECTOR_EMBEDDINGS
DROP POLICY IF EXISTS "Users can manage own embeddings" ON vector_embeddings;
CREATE POLICY "Users can manage own embeddings" ON vector_embeddings
  FOR ALL USING (auth.uid()::text = user_id::text);

-- =====================================================
-- COMMENTS (DOCUMENTAÇÃO)
-- =====================================================

COMMENT ON TABLE user_profiles IS 'Perfis das usuárias - gestantes, mães, tentantes, puerpério, mãe estabelecida';
COMMENT ON TABLE conversation_history IS 'Histórico completo de conversas com resumos diários e semanais';
COMMENT ON TABLE chat_messages IS 'Mensagens individuais do chat com NAT-IA';
COMMENT ON TABLE conversations IS 'Conversas com embeddings vetoriais para busca semântica (Gemini)';
COMMENT ON TABLE daily_plans IS 'Planos diários com prioridades, dicas e receitas';
COMMENT ON TABLE user_feature_flags IS 'Feature flags por usuária para A/B testing';
COMMENT ON TABLE habits IS 'Hábitos das usuárias (pré-definidos e customizados)';
COMMENT ON TABLE habit_completions IS 'Registro de completions diárias de hábitos';
COMMENT ON TABLE content_items IS 'Conteúdos exclusivos da Natália Valente';
COMMENT ON TABLE content_favorites IS 'Conteúdos favoritados pelas usuárias';
COMMENT ON TABLE moderation_queue IS 'Fila de moderação para mensagens que precisam revisão';
COMMENT ON TABLE risk_alerts IS 'Alertas de risco médico ou psicológico';
COMMENT ON TABLE alert_logs IS 'Logs de alertas de alto risco para auditoria';
COMMENT ON TABLE vector_embeddings IS 'Embeddings vetoriais para RAG (Retrieval-Augmented Generation)';

-- =====================================================
-- VALIDAÇÃO FINAL
-- =====================================================

DO $$
DECLARE
  expected_tables TEXT[] := ARRAY[
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
  ];
  tbl TEXT;
  table_count INTEGER;
  missing_tables TEXT[] := ARRAY[]::TEXT[];
BEGIN
  FOREACH tbl IN ARRAY expected_tables
  LOOP
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = tbl;

    IF table_count = 0 THEN
      missing_tables := array_append(missing_tables, tbl);
    END IF;
  END LOOP;

  IF array_length(missing_tables, 1) > 0 THEN
    RAISE WARNING 'Tabelas faltando: %', array_to_string(missing_tables, ', ');
  ELSE
    RAISE NOTICE '✅ Todas as 14 tabelas foram criadas com sucesso!';
  END IF;
END $$;

-- Status final
SELECT
  '✅ Schema Nossa Maternidade consolidado com sucesso!' as status,
  COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public';
