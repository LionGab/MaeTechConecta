-- ==========================================
-- MIGRATION: Base Schema - Nossa Maternidade
-- Data: 2025-01-07
-- Descrição: Schema completo com gamificação, hábitos, posts e curadoria
-- ==========================================

-- ==========================================
-- PROFILES (extende auth.users)
-- ==========================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  stage TEXT CHECK (stage IN ('gestante', 'mae', 'tentante', 'puerperio', 'mae_estabelecida')),
  pregnancy_week INTEGER CHECK (pregnancy_week >= 0 AND pregnancy_week <= 42),
  baby_name TEXT,
  preferences JSONB DEFAULT '[]',
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'premium')) DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_profiles_stage ON profiles(stage);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles(subscription_tier);

-- ==========================================
-- USER CONTEXT (dados personalizados)
-- ==========================================

CREATE TABLE IF NOT EXISTS user_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  pregnancy_week INTEGER,
  baby_name TEXT,
  preferences JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_context_user ON user_context(user_id);

-- ==========================================
-- DAILY TIPS (dicas personalizadas)
-- ==========================================

CREATE TABLE IF NOT EXISTS daily_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  audience JSONB NOT NULL, -- {stage: [], tags: []}
  category TEXT,
  relevance_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_daily_tips_category ON daily_tips(category);
CREATE INDEX IF NOT EXISTS idx_daily_tips_audience ON daily_tips USING GIN(audience);

-- ==========================================
-- HABIT TEMPLATES (templates pré-definidos)
-- ==========================================

CREATE TABLE IF NOT EXISTS habit_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '✅',
  default_points INTEGER DEFAULT 10,
  category TEXT,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_habit_templates_category ON habit_templates(category);

-- ==========================================
-- HABITS (hábitos ativos do usuário)
-- ==========================================

CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES habit_templates(id),
  name TEXT NOT NULL,
  icon TEXT DEFAULT '✅',
  points INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_habits_user ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_active ON habits(user_id, is_active);

-- ==========================================
-- HABIT LOGS (registro de conclusões)
-- ==========================================

CREATE TABLE IF NOT EXISTS habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  done BOOLEAN DEFAULT false,
  skipped BOOLEAN DEFAULT false,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, user_id, DATE(logged_at))
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_date ON habit_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit ON habit_logs(habit_id);

-- ==========================================
-- STREAKS (gamificação)
-- ==========================================

CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges JSONB DEFAULT '[]',
  last_completion_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_streaks_user ON streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_level ON streaks(level DESC);

-- ==========================================
-- POSTS (MundoNath)
-- ==========================================

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT,
  tags JSONB DEFAULT '[]',
  is_premium BOOLEAN DEFAULT false,
  read_time INTEGER DEFAULT 5,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_premium ON posts(is_premium);

-- ==========================================
-- CURATED ARTICLES (MãeValente)
-- ==========================================

CREATE TABLE IF NOT EXISTS curated_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  source_url TEXT NOT NULL,
  source_name TEXT,
  thumbnail TEXT,
  category TEXT,
  tags JSONB DEFAULT '[]',
  relevance_score INTEGER DEFAULT 0,
  curated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_curated_category ON curated_articles(category);
CREATE INDEX IF NOT EXISTS idx_curated_date ON curated_articles(curated_at DESC);

-- ==========================================
-- CHAT MESSAGES (histórico NathIA)
-- ==========================================

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  context_data JSONB,
  meta JSONB, -- {kind: 'tip', tip_id: 'uuid'}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_chat_user_date ON chat_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_meta ON chat_messages USING GIN(meta);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE curated_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies: Leitura pública
CREATE POLICY "daily_tips_read_public" ON daily_tips FOR SELECT USING (true);
CREATE POLICY "habit_templates_read_public" ON habit_templates FOR SELECT USING (true);
CREATE POLICY "posts_read_public" ON posts FOR SELECT USING (true);
CREATE POLICY "curated_articles_read_public" ON curated_articles FOR SELECT USING (true);

-- Policies: Perfil próprio
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "user_context_own" ON user_context FOR ALL USING (auth.uid() = user_id);

-- Policies: Hábitos próprios
CREATE POLICY "habits_own" ON habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "habit_logs_own" ON habit_logs FOR ALL USING (auth.uid() = user_id);

-- Policies: Streak próprio
CREATE POLICY "streaks_own" ON streaks FOR ALL USING (auth.uid() = user_id);

-- Policies: Chat próprio
CREATE POLICY "chat_messages_own" ON chat_messages FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Função: Atualizar streak ao inserir habit_log
CREATE OR REPLACE FUNCTION update_streak_on_habit_log()
RETURNS TRIGGER AS $$
DECLARE
  habit_points INTEGER;
  current_date DATE := CURRENT_DATE;
BEGIN
  IF NEW.done = true THEN
    -- Buscar pontos do hábito
    SELECT points INTO habit_points FROM habits WHERE id = NEW.habit_id;
    
    -- Atualizar ou criar streak
    INSERT INTO streaks (user_id, current_streak, best_streak, total_points, level, last_completion_date)
    VALUES (
      NEW.user_id,
      1,
      1,
      habit_points,
      FLOOR(habit_points / 100) + 1,
      current_date
    )
    ON CONFLICT (user_id) DO UPDATE SET
      current_streak = CASE 
        WHEN streaks.last_completion_date = current_date - INTERVAL '1 day' 
        THEN streaks.current_streak + 1
        WHEN streaks.last_completion_date = current_date
        THEN streaks.current_streak
        ELSE 1
      END,
      best_streak = GREATEST(streaks.best_streak, 
        CASE 
          WHEN streaks.last_completion_date = current_date - INTERVAL '1 day' 
          THEN streaks.current_streak + 1
          ELSE 1
        END
      ),
      total_points = streaks.total_points + habit_points,
      level = FLOOR((streaks.total_points + habit_points) / 100) + 1,
      last_completion_date = current_date,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Atualizar streak
DROP TRIGGER IF EXISTS trigger_update_streak ON habit_logs;
CREATE TRIGGER trigger_update_streak
AFTER INSERT ON habit_logs
FOR EACH ROW EXECUTE FUNCTION update_streak_on_habit_log();

-- Função: Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers: updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_context_updated_at ON user_context;
CREATE TRIGGER update_user_context_updated_at BEFORE UPDATE ON user_context
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- SEED DATA (opcional)
-- ==========================================

-- Inserir templates de hábitos padrão
INSERT INTO habit_templates (name, description, icon, default_points, category, tags) VALUES
  ('Beber água', 'Beber 8 copos de água por dia', '💧', 10, 'saude', '["hidratacao", "saude"]'),
  ('Exercício leve', 'Caminhada ou yoga de 15 minutos', '🧘', 15, 'saude', '["exercicio", "bem-estar"]'),
  ('Meditação', '5 minutos de meditação ou respiração', '🧘‍♀️', 10, 'mental', '["meditacao", "mindfulness"]'),
  ('Alimentação saudável', 'Comer 3 porções de frutas/vegetais', '🥗', 15, 'nutricao', '["alimentacao", "saude"]'),
  ('Descanso adequado', 'Dormir 7-8 horas', '😴', 20, 'saude', '["sono", "descanso"]'),
  ('Diário da gravidez', 'Escrever sobre sentimentos do dia', '📝', 10, 'mental', '["journal", "emocional"]'),
  ('Conversar com bebê', 'Falar ou cantar para o bebê', '🗣️', 10, 'conexao', '["bebe", "vinculo"]'),
  ('Leitura sobre maternidade', 'Ler 10 minutos sobre cuidados', '📚', 10, 'conhecimento', '["leitura", "educacao"]')
ON CONFLICT DO NOTHING;

-- ==========================================
-- FIM DA MIGRATION
-- ==========================================

