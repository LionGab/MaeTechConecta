-- Habilitar pgvector extension para embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Criar tabela de perfis de usuários (expandida)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  type TEXT CHECK (type IN ('gestante', 'mae', 'tentante')) NOT NULL,
  pregnancy_week INTEGER,
  baby_name TEXT,
  preferences TEXT[] DEFAULT ARRAY[]::TEXT[],
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'premium')) DEFAULT 'free',
  kiwify_customer_id TEXT,
  kiwify_transaction_id TEXT,
  subscription_start TIMESTAMP WITH TIME ZONE,
  subscription_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  daily_interactions INTEGER DEFAULT 0,
  last_interaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  behavior_analysis JSONB,
  risk_level INTEGER DEFAULT 0
);

-- Criar tabela de mensagens de chat
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  context_data JSONB
);

-- Criar tabela de planos diários
CREATE TABLE daily_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  priorities TEXT[] DEFAULT ARRAY[]::TEXT[],
  tip TEXT,
  tip_video_url TEXT,
  recipe TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Criar tabela de memória conversacional (Nova)
CREATE TABLE conversation_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  summary TEXT,
  key_points TEXT[],
  topics TEXT[],
  sentiment TEXT,
  last_30_messages JSONB,
  embedding vector(768),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de fila de moderação (Nova)
CREATE TABLE moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  message TEXT NOT NULL,
  category TEXT,
  severity INTEGER,
  reviewed BOOLEAN DEFAULT FALSE,
  action TEXT,
  moderator_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de alertas de risco (Nova)
CREATE TABLE risk_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  risk_type TEXT,
  severity INTEGER,
  message_context TEXT,
  action_taken TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_daily_plans_user_date ON daily_plans(user_id, date);
CREATE INDEX idx_conversation_memory_user_id ON conversation_memory(user_id);
CREATE INDEX idx_conversation_memory_embedding ON conversation_memory USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_moderation_queue_reviewed ON moderation_queue(reviewed, created_at DESC);
CREATE INDEX idx_risk_alerts_user_resolved ON risk_alerts(user_id, resolved, created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_alerts ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (permitir leitura e escrita para usuários autenticados)
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own messages" ON chat_messages
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own plans" ON daily_plans
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own plans" ON daily_plans
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Políticas para conversation_memory
CREATE POLICY "Users can view own memory" ON conversation_memory
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own memory" ON conversation_memory
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own memory" ON conversation_memory
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Políticas para moderation_queue (somente leitura para usuário, admins podem tudo)
CREATE POLICY "Users can view own moderation entries" ON moderation_queue
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all moderation" ON moderation_queue
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id::text = auth.uid()::text
      AND email = 'admin@nossamaternidade.com'
    )
  );

-- Políticas para risk_alerts
CREATE POLICY "Users can view own risk alerts" ON risk_alerts
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all risk alerts" ON risk_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id::text = auth.uid()::text
      AND email = 'admin@nossamaternidade.com'
    )
  );

-- Função para atualizar contador de interações diárias
CREATE OR REPLACE FUNCTION update_daily_interactions()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET daily_interactions = daily_interactions + 1,
      last_interaction_date = NOW()
  WHERE id::text = NEW.user_id::text;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar contador ao inserir mensagem
CREATE TRIGGER trigger_update_interactions
AFTER INSERT ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_daily_interactions();
