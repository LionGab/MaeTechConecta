-- =====================================================
-- CLUB VALENTE - Database Schema Completo
-- Supabase PostgreSQL + pgvector
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- pgvector para RAG

-- =====================================================
-- 1. USER PROFILES
-- =====================================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gestante', 'mae', 'tentante')),
  pregnancy_week INTEGER CHECK (pregnancy_week >= 1 AND pregnancy_week <= 42),
  baby_name TEXT,
  preferences JSONB DEFAULT '[]'::jsonb,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  onboarding_data JSONB DEFAULT '{}'::jsonb,
  behavior_analysis JSONB,
  risk_level INTEGER DEFAULT 0 CHECK (risk_level >= 0 AND risk_level <= 10),
  daily_interactions INTEGER DEFAULT 0,
  last_interaction_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_type ON user_profiles(type);
CREATE INDEX idx_user_profiles_risk_level ON user_profiles(risk_level);

-- =====================================================
-- 2. CONVERSATION HISTORY
-- =====================================================
CREATE TABLE conversation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]'::jsonb, -- Array de mensagens
  summary_daily TEXT,
  summary_weekly TEXT,
  key_memories JSONB DEFAULT '[]'::jsonb, -- Memórias-chave marcadas
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_conversation_history_user_id ON conversation_history(user_id);

-- =====================================================
-- 3. CHAT MESSAGES
-- =====================================================
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  context_data JSONB DEFAULT '{}'::jsonb, -- Metadata adicional
  is_urgent BOOLEAN DEFAULT FALSE,
  risk_flag INTEGER CHECK (risk_flag >= 0 AND risk_flag <= 10),
  moderated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_chat_messages_risk_flag ON chat_messages(risk_flag) WHERE risk_flag IS NOT NULL;
CREATE INDEX idx_chat_messages_is_urgent ON chat_messages(is_urgent) WHERE is_urgent = TRUE;

-- =====================================================
-- 4. HABITS
-- =====================================================
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_is_active ON habits(is_active) WHERE is_active = TRUE;

-- =====================================================
-- 5. HABIT COMPLETIONS
-- =====================================================
CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(habit_id, user_id, date)
);

-- Indexes
CREATE INDEX idx_habit_completions_user_id ON habit_completions(user_id);
CREATE INDEX idx_habit_completions_date ON habit_completions(date DESC);
CREATE INDEX idx_habit_completions_habit_user_date ON habit_completions(habit_id, user_id, date);

-- =====================================================
-- 6. CONTENT ITEMS
-- =====================================================
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('article', 'video', 'audio', 'post')),
  content_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'Natália Valente',
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_content_items_type ON content_items(type);
CREATE INDEX idx_content_items_category ON content_items(category);
CREATE INDEX idx_content_items_is_featured ON content_items(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_content_items_tags ON content_items USING GIN(tags);

-- =====================================================
-- 7. CONTENT FAVORITES
-- =====================================================
CREATE TABLE content_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Indexes
CREATE INDEX idx_content_favorites_user_id ON content_favorites(user_id);
CREATE INDEX idx_content_favorites_content_id ON content_favorites(content_id);

-- =====================================================
-- 8. MODERATION QUEUE
-- =====================================================
CREATE TABLE moderation_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  category TEXT NOT NULL,
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 5),
  action TEXT NOT NULL CHECK (action IN ('allow', 'block', 'flag')),
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by UUID REFERENCES user_profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_moderation_queue_reviewed ON moderation_queue(reviewed) WHERE reviewed = FALSE;
CREATE INDEX idx_moderation_queue_severity ON moderation_queue(severity);
CREATE INDEX idx_moderation_queue_created_at ON moderation_queue(created_at DESC);

-- =====================================================
-- 9. RISK ALERTS
-- =====================================================
CREATE TABLE risk_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  risk_type TEXT NOT NULL CHECK (risk_type IN ('medical', 'psychological')),
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 10),
  message_context TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_risk_alerts_user_id ON risk_alerts(user_id);
CREATE INDEX idx_risk_alerts_resolved ON risk_alerts(resolved) WHERE resolved = FALSE;
CREATE INDEX idx_risk_alerts_severity ON risk_alerts(severity);
CREATE INDEX idx_risk_alerts_created_at ON risk_alerts(created_at DESC);

-- =====================================================
-- 10. VECTOR EMBEDDINGS (RAG)
-- =====================================================
CREATE TABLE vector_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(768) NOT NULL, -- text-embedding-004 usa 768 dimensões
  metadata JSONB DEFAULT '{}'::jsonb, -- {message_id, created_at, type, etc}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes para busca vetorial (cosine distance)
CREATE INDEX idx_vector_embeddings_user_id ON vector_embeddings(user_id);
CREATE INDEX idx_vector_embeddings_embedding ON vector_embeddings
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS em todas tabelas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vector_embeddings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- user_profiles: usuário só vê/edita seu próprio perfil
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- conversation_history: usuário só vê/edita sua própria conversa
CREATE POLICY "Users can view own conversation" ON conversation_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own conversation" ON conversation_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversation" ON conversation_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- chat_messages: usuário só vê suas próprias mensagens
CREATE POLICY "Users can view own messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- habits: usuário só vê/edita seus próprios hábitos
CREATE POLICY "Users can manage own habits" ON habits
  FOR ALL USING (auth.uid() = user_id);

-- habit_completions: usuário só vê/edita suas próprias completions
CREATE POLICY "Users can manage own completions" ON habit_completions
  FOR ALL USING (auth.uid() = user_id);

-- content_items: todos podem ler (público)
CREATE POLICY "Everyone can view content" ON content_items
  FOR SELECT USING (true);

-- content_favorites: usuário só vê seus próprios favoritos
CREATE POLICY "Users can manage own favorites" ON content_favorites
  FOR ALL USING (auth.uid() = user_id);

-- moderation_queue: apenas admins (pode ser ajustado)
CREATE POLICY "Only admins can view moderation queue" ON moderation_queue
  FOR SELECT USING (false); -- Implementar lógica de admin depois

-- risk_alerts: usuário pode ver seus próprios alertas (resolvidos)
CREATE POLICY "Users can view own resolved alerts" ON risk_alerts
  FOR SELECT USING (auth.uid() = user_id AND resolved = true);

-- vector_embeddings: usuário só vê seus próprios embeddings
CREATE POLICY "Users can manage own embeddings" ON vector_embeddings
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_history_updated_at
  BEFORE UPDATE ON conversation_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_items_updated_at
  BEFORE UPDATE ON content_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View: User stats (habits completions hoje)
CREATE VIEW user_stats_today AS
SELECT
  hc.user_id,
  COUNT(DISTINCT hc.habit_id) as habits_completed_today,
  COUNT(DISTINCT cm.id) as messages_sent_today
FROM habit_completions hc
LEFT JOIN chat_messages cm ON cm.user_id = hc.user_id AND DATE(cm.created_at) = CURRENT_DATE
WHERE DATE(hc.date) = CURRENT_DATE
GROUP BY hc.user_id;

-- View: Streak calculation (últimos 7 dias)
CREATE VIEW habit_streaks AS
SELECT
  hc.user_id,
  hc.habit_id,
  COUNT(*) as streak_days
FROM habit_completions hc
WHERE hc.date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY hc.user_id, hc.habit_id
HAVING COUNT(*) >= 3; -- Streak mínimo de 3 dias

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE user_profiles IS 'Perfis das usuárias do Club Valente';
COMMENT ON TABLE conversation_history IS 'Histórico de conversas com NAT-IA';
COMMENT ON TABLE chat_messages IS 'Mensagens individuais do chat';
COMMENT ON TABLE habits IS 'Hábitos das usuárias (pré-definidos e customizados)';
COMMENT ON TABLE habit_completions IS 'Completions diárias de hábitos';
COMMENT ON TABLE content_items IS 'Conteúdos exclusivos da Natália Valente';
COMMENT ON TABLE content_favorites IS 'Favoritos de conteúdo das usuárias';
COMMENT ON TABLE moderation_queue IS 'Fila de moderação de mensagens';
COMMENT ON TABLE risk_alerts IS 'Alertas de risco médico/psicológico';
COMMENT ON TABLE vector_embeddings IS 'Embeddings vetoriais para RAG (memória semântica)';

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================

-- Para aplicar no Supabase:
-- 1. Copie este arquivo
-- 2. Vá em Supabase Dashboard > SQL Editor
-- 3. Cole e execute
-- 4. Verifique se todas as tabelas foram criadas
-- 5. Teste as políticas RLS

