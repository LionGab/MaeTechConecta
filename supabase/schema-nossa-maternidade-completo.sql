-- =====================================================
-- NOSSA MATERNIDADE - Schema Completo do Database
-- Baseado no PROMPT 2: Setup Supabase Database
-- =====================================================
-- 
-- Este schema cria TODAS as 10 tabelas necessárias
-- com Row Level Security (RLS), políticas, índices
-- e foreign keys conforme especificado.
--
-- Execute este arquivo no Supabase Dashboard > SQL Editor
-- =====================================================

-- =====================================================
-- EXTENSÕES NECESSÁRIAS
-- =====================================================

-- Habilitar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Habilitar extensão para pgvector (busca vetorial)
CREATE EXTENSION IF NOT EXISTS "vector";

-- =====================================================
-- 1. USER_PROFILES
-- =====================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gestante', 'mae', 'tentante')),
  pregnancy_week INTEGER CHECK (pregnancy_week IS NULL OR (pregnancy_week >= 1 AND pregnancy_week <= 42)),
  baby_name TEXT,
  preferences JSONB DEFAULT '[]'::jsonb,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  onboarding_data JSONB DEFAULT '{}'::jsonb,
  behavior_analysis JSONB,
  risk_level INTEGER DEFAULT 0 CHECK (risk_level >= 0 AND risk_level <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_type ON user_profiles(type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_risk_level ON user_profiles(risk_level);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at DESC);

-- =====================================================
-- 2. CONVERSATION_HISTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS conversation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]'::jsonb, -- Array de mensagens
  summary_daily TEXT,
  summary_weekly TEXT,
  key_memories JSONB DEFAULT '[]'::jsonb, -- Memórias-chave
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Índices para conversation_history
CREATE INDEX IF NOT EXISTS idx_conversation_history_user_id ON conversation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_history_created_at ON conversation_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_history_updated_at ON conversation_history(updated_at DESC);

-- =====================================================
-- 3. CHAT_MESSAGES
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  context_data JSONB DEFAULT '{}'::jsonb,
  is_urgent BOOLEAN DEFAULT FALSE,
  risk_flag INTEGER CHECK (risk_flag IS NULL OR (risk_flag >= 0 AND risk_flag <= 10)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para chat_messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(role);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_urgent ON chat_messages(is_urgent) WHERE is_urgent = TRUE;
CREATE INDEX IF NOT EXISTS idx_chat_messages_risk_flag ON chat_messages(risk_flag) WHERE risk_flag IS NOT NULL;

-- =====================================================
-- 4. HABITS
-- =====================================================

CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para habits
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_is_active ON habits(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_habits_category ON habits(category) WHERE category IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_habits_created_at ON habits(created_at DESC);

-- =====================================================
-- 5. HABIT_COMPLETIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Índices para habit_completions
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions(date DESC);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_date ON habit_completions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_habit_completions_created_at ON habit_completions(completed_at DESC);

-- =====================================================
-- 6. CONTENT_ITEMS
-- =====================================================

CREATE TABLE IF NOT EXISTS content_items (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para content_items
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_category ON content_items(category) WHERE category IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_content_items_is_featured ON content_items(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_content_items_created_at ON content_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_items_tags ON content_items USING GIN(tags);

-- =====================================================
-- 7. CONTENT_FAVORITES
-- =====================================================

CREATE TABLE IF NOT EXISTS content_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Índices para content_favorites
CREATE INDEX IF NOT EXISTS idx_content_favorites_user_id ON content_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_content_favorites_content_id ON content_favorites(content_id);
CREATE INDEX IF NOT EXISTS idx_content_favorites_created_at ON content_favorites(created_at DESC);

-- =====================================================
-- 8. MODERATION_QUEUE
-- =====================================================

CREATE TABLE IF NOT EXISTS moderation_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  category TEXT,
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 5),
  action TEXT NOT NULL CHECK (action IN ('allow', 'block', 'flag')),
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by UUID REFERENCES user_profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para moderation_queue
CREATE INDEX IF NOT EXISTS idx_moderation_queue_user_id ON moderation_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_reviewed ON moderation_queue(reviewed) WHERE reviewed = FALSE;
CREATE INDEX IF NOT EXISTS idx_moderation_queue_severity ON moderation_queue(severity);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_created_at ON moderation_queue(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_action ON moderation_queue(action);

-- =====================================================
-- 9. RISK_ALERTS
-- =====================================================

CREATE TABLE IF NOT EXISTS risk_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  risk_type TEXT NOT NULL CHECK (risk_type IN ('medical', 'psychological')),
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 10),
  message_context TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para risk_alerts
CREATE INDEX IF NOT EXISTS idx_risk_alerts_user_id ON risk_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_resolved ON risk_alerts(resolved) WHERE resolved = FALSE;
CREATE INDEX IF NOT EXISTS idx_risk_alerts_severity ON risk_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_risk_type ON risk_alerts(risk_type);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_created_at ON risk_alerts(created_at DESC);

-- =====================================================
-- 10. VECTOR_EMBEDDINGS
-- =====================================================

CREATE TABLE IF NOT EXISTS vector_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(768) NOT NULL, -- pgvector para busca semântica
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para vector_embeddings
CREATE INDEX IF NOT EXISTS idx_vector_embeddings_user_id ON vector_embeddings(user_id);
CREATE INDEX IF NOT EXISTS idx_vector_embeddings_created_at ON vector_embeddings(created_at DESC);

-- Índice para busca vetorial (cosine distance)
-- IMPORTANTE: Este índice é criado com ivfflat para performance
-- O parâmetro 'lists' deve ser ajustado baseado no tamanho dos dados
CREATE INDEX IF NOT EXISTS idx_vector_embeddings_embedding ON vector_embeddings
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
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
-- POLÍTICAS DE SEGURANÇA (RLS POLICIES)
-- =====================================================

-- Remover políticas existentes (se houver) para recriar
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own conversation" ON conversation_history;
DROP POLICY IF EXISTS "Users can update own conversation" ON conversation_history;
DROP POLICY IF EXISTS "Users can insert own conversation" ON conversation_history;
DROP POLICY IF EXISTS "Users can view own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can manage own habits" ON habits;
DROP POLICY IF EXISTS "Users can manage own completions" ON habit_completions;
DROP POLICY IF EXISTS "Everyone can view content" ON content_items;
DROP POLICY IF EXISTS "Users can manage own favorites" ON content_favorites;
DROP POLICY IF EXISTS "Only admins can view moderation queue" ON moderation_queue;
DROP POLICY IF EXISTS "Users can view own risk alerts" ON risk_alerts;
DROP POLICY IF EXISTS "Users can manage own embeddings" ON vector_embeddings;

-- 1. USER_PROFILES - Usuário só vê/edita seu próprio perfil
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- 2. CONVERSATION_HISTORY - Usuário só vê/edita sua própria conversa
CREATE POLICY "Users can view own conversation" ON conversation_history
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own conversation" ON conversation_history
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own conversation" ON conversation_history
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- 3. CHAT_MESSAGES - Usuário só vê suas próprias mensagens
CREATE POLICY "Users can view own messages" ON chat_messages
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- 4. HABITS - Usuário só vê/edita seus próprios hábitos
CREATE POLICY "Users can manage own habits" ON habits
  FOR ALL USING (auth.uid()::text = user_id::text);

-- 5. HABIT_COMPLETIONS - Usuário só vê/edita suas próprias completions
CREATE POLICY "Users can manage own completions" ON habit_completions
  FOR ALL USING (auth.uid()::text = user_id::text);

-- 6. CONTENT_ITEMS - Todos podem ler (conteúdo público)
CREATE POLICY "Everyone can view content" ON content_items
  FOR SELECT USING (true);

-- 7. CONTENT_FAVORITES - Usuário só vê seus próprios favoritos
CREATE POLICY "Users can manage own favorites" ON content_favorites
  FOR ALL USING (auth.uid()::text = user_id::text);

-- 8. MODERATION_QUEUE - Apenas admins podem ver (por enquanto bloqueado)
-- TODO: Implementar lógica de admin baseada em role ou email
CREATE POLICY "Only admins can view moderation queue" ON moderation_queue
  FOR SELECT USING (false); -- Implementar lógica de admin depois

CREATE POLICY "Users can insert own moderation entry" ON moderation_queue
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- 9. RISK_ALERTS - Usuário pode ver seus próprios alertas
CREATE POLICY "Users can view own risk alerts" ON risk_alerts
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- 10. VECTOR_EMBEDDINGS - Usuário só vê seus próprios embeddings
CREATE POLICY "Users can manage own embeddings" ON vector_embeddings
  FOR ALL USING (auth.uid()::text = user_id::text);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at em tabelas que têm esse campo
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_history_updated_at
  BEFORE UPDATE ON conversation_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS (DOCUMENTAÇÃO)
-- =====================================================

COMMENT ON TABLE user_profiles IS 'Perfis das usuárias da Nossa Maternidade - gestantes, mães e tentantes';
COMMENT ON TABLE conversation_history IS 'Histórico completo de conversas com NAT-IA, incluindo resumos diários e semanais';
COMMENT ON TABLE chat_messages IS 'Mensagens individuais do chat com NAT-IA';
COMMENT ON TABLE habits IS 'Hábitos das usuárias (pré-definidos e customizados)';
COMMENT ON TABLE habit_completions IS 'Registro de completions diárias de hábitos';
COMMENT ON TABLE content_items IS 'Conteúdos exclusivos da Natália Valente (artigos, vídeos, áudios, posts)';
COMMENT ON TABLE content_favorites IS 'Conteúdos favoritados pelas usuárias';
COMMENT ON TABLE moderation_queue IS 'Fila de moderação para mensagens que precisam revisão';
COMMENT ON TABLE risk_alerts IS 'Alertas de risco médico ou psicológico detectados nas conversas';
COMMENT ON TABLE vector_embeddings IS 'Embeddings vetoriais para RAG (Retrieval-Augmented Generation) - memória semântica';

COMMENT ON COLUMN user_profiles.type IS 'Tipo de usuária: gestante, mae ou tentante';
COMMENT ON COLUMN user_profiles.preferences IS 'Preferências da usuária em formato JSONB';
COMMENT ON COLUMN user_profiles.onboarding_data IS 'Dados coletados durante o onboarding';
COMMENT ON COLUMN user_profiles.behavior_analysis IS 'Análise comportamental em formato JSONB';
COMMENT ON COLUMN user_profiles.risk_level IS 'Nível de risco de 0 a 10';

COMMENT ON COLUMN conversation_history.messages IS 'Array de mensagens em formato JSONB';
COMMENT ON COLUMN conversation_history.key_memories IS 'Memórias-chave extraídas das conversas';

COMMENT ON COLUMN chat_messages.role IS 'Role da mensagem: user ou assistant';
COMMENT ON COLUMN chat_messages.is_urgent IS 'Flag para mensagens urgentes que precisam atenção imediata';
COMMENT ON COLUMN chat_messages.risk_flag IS 'Flag de risco de 0 a 10';

COMMENT ON COLUMN vector_embeddings.embedding IS 'Vetor de embedding de 768 dimensões para busca semântica';

-- =====================================================
-- VALIDAÇÃO FINAL
-- =====================================================

-- Verificar se todas as tabelas foram criadas
DO $$
DECLARE
  table_count INTEGER;
  expected_tables TEXT[] := ARRAY[
    'user_profiles',
    'conversation_history',
    'chat_messages',
    'habits',
    'habit_completions',
    'content_items',
    'content_favorites',
    'moderation_queue',
    'risk_alerts',
    'vector_embeddings'
  ];
  missing_tables TEXT[] := ARRAY[]::TEXT[];
  tbl TEXT;
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
    RAISE NOTICE '✅ Todas as 10 tabelas foram criadas com sucesso!';
  END IF;
END $$;

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================

-- Status final
SELECT 
  'Schema Nossa Maternidade criado com sucesso!' as status,
  COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'user_profiles',
    'conversation_history',
    'chat_messages',
    'habits',
    'habit_completions',
    'content_items',
    'content_favorites',
    'moderation_queue',
    'risk_alerts',
    'vector_embeddings'
  );


