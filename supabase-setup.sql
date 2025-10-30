-- Criar tabela de perfis de usuários
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  type TEXT CHECK (type IN ('gestante', 'mae', 'tentante')) NOT NULL,
  pregnancy_week INTEGER,
  baby_name TEXT,
  preferences TEXT[] DEFAULT ARRAY[]::TEXT[],
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'premium')) DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  daily_interactions INTEGER DEFAULT 0,
  last_interaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Criar índices para performance
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_daily_plans_user_date ON daily_plans(user_id, date);

-- Habilitar Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;

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

