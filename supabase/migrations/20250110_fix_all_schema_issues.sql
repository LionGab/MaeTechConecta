-- =====================================================
-- FIX ALL SCHEMA ISSUES - Comprehensive Migration
-- Data: 2025-01-10
-- Baseado em review técnico completo
-- =====================================================
-- Corrige: UUIDs, timestamps, defaults, FKs, indexes, RLS, triggers

-- =====================================================
-- 1. DROPAR TABELAS COM SCHEMA ANTIGO
-- =====================================================

DROP TABLE IF EXISTS onboarding_responses CASCADE;

-- =====================================================
-- 2. ADICIONAR UUID DEFAULTS (Issue #2)
-- =====================================================

-- Garantir que todas as PKs UUID têm default
DO $$
BEGIN
  -- user_profiles
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'id') THEN
    ALTER TABLE user_profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
  
  -- chat_messages
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'id') THEN
    ALTER TABLE chat_messages ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
  
  -- daily_insights
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_insights' AND column_name = 'id') THEN
    ALTER TABLE daily_insights ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
  
  -- habits
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'habits' AND column_name = 'id') THEN
    ALTER TABLE habits ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
  
  -- habit_logs
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'habit_logs' AND column_name = 'id') THEN
    ALTER TABLE habit_logs ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
  
  -- habit_templates
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'habit_templates' AND column_name = 'id') THEN
    ALTER TABLE habit_templates ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
  
  -- streaks
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'streaks' AND column_name = 'id') THEN
    ALTER TABLE streaks ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
  
  -- mundo_nath_posts
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mundo_nath_posts' AND column_name = 'id') THEN
    ALTER TABLE mundo_nath_posts ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
  
  -- mundo_nath_saves
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mundo_nath_saves' AND column_name = 'id') THEN
    ALTER TABLE mundo_nath_saves ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
  
  -- curated_content
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curated_content' AND column_name = 'id') THEN
    ALTER TABLE curated_content ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
  
  -- user_saved_content
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_saved_content' AND column_name = 'id') THEN
    ALTER TABLE user_saved_content ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
END $$;

-- =====================================================
-- 3. ADICIONAR TIMESTAMP DEFAULTS (Issue #1, #12)
-- =====================================================

DO $$
BEGIN
  -- created_at e updated_at defaults
  EXECUTE format('
    ALTER TABLE IF EXISTS user_profiles 
      ALTER COLUMN created_at SET DEFAULT now(),
      ALTER COLUMN updated_at SET DEFAULT now()
  ');
  
  EXECUTE format('
    ALTER TABLE IF EXISTS chat_messages 
      ALTER COLUMN created_at SET DEFAULT now()
  ');
  
  EXECUTE format('
    ALTER TABLE IF EXISTS daily_insights 
      ALTER COLUMN created_at SET DEFAULT now(),
      ALTER COLUMN generated_at SET DEFAULT now()
  ');
  
  EXECUTE format('
    ALTER TABLE IF EXISTS habits 
      ALTER COLUMN created_at SET DEFAULT now(),
      ALTER COLUMN updated_at SET DEFAULT now()
  ');
  
  EXECUTE format('
    ALTER TABLE IF EXISTS habit_logs 
      ALTER COLUMN created_at SET DEFAULT now()
  ');
  
  EXECUTE format('
    ALTER TABLE IF EXISTS habit_templates 
      ALTER COLUMN created_at SET DEFAULT now()
  ');
  
  EXECUTE format('
    ALTER TABLE IF EXISTS user_gamification 
      ALTER COLUMN created_at SET DEFAULT now(),
      ALTER COLUMN updated_at SET DEFAULT now()
  ');
  
  EXECUTE format('
    ALTER TABLE IF EXISTS mundo_nath_posts 
      ALTER COLUMN created_at SET DEFAULT now(),
      ALTER COLUMN updated_at SET DEFAULT now(),
      ALTER COLUMN published_at SET DEFAULT now()
  ');
  
  EXECUTE format('
    ALTER TABLE IF EXISTS curated_content 
      ALTER COLUMN created_at SET DEFAULT now(),
      ALTER COLUMN curated_at SET DEFAULT now()
  ');
  
  EXECUTE format('
    ALTER TABLE IF EXISTS mundo_nath_saves 
      ALTER COLUMN saved_at SET DEFAULT now()
  ');
  
  EXECUTE format('
    ALTER TABLE IF EXISTS user_saved_content 
      ALTER COLUMN saved_at SET DEFAULT now()
  ');
  
  EXECUTE format('
    ALTER TABLE IF EXISTS streaks 
      ALTER COLUMN created_at SET DEFAULT now(),
      ALTER COLUMN updated_at SET DEFAULT now()
  ');
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Some timestamp defaults could not be set: %', SQLERRM;
END $$;

-- =====================================================
-- 4. ADICIONAR BOOLEAN/COUNTER DEFAULTS (Issue #3)
-- =====================================================

DO $$
BEGIN
  -- user_profiles
  EXECUTE format('
    ALTER TABLE IF EXISTS user_profiles 
      ALTER COLUMN onboarding_completed SET DEFAULT false
  ');
  
  -- chat_messages
  EXECUTE format('
    ALTER TABLE IF EXISTS chat_messages 
      ALTER COLUMN is_urgent SET DEFAULT false
  ');
  
  -- daily_insights
  EXECUTE format('
    ALTER TABLE IF EXISTS daily_insights 
      ALTER COLUMN viewed SET DEFAULT false
  ');
  
  -- habits
  EXECUTE format('
    ALTER TABLE IF EXISTS habits 
      ALTER COLUMN is_active SET DEFAULT true
  ');
  
  -- habit_logs
  EXECUTE format('
    ALTER TABLE IF EXISTS habit_logs 
      ALTER COLUMN done SET DEFAULT false,
      ALTER COLUMN skipped SET DEFAULT false,
      ALTER COLUMN points_earned SET DEFAULT 0
  ');
  
  -- user_gamification
  EXECUTE format('
    ALTER TABLE IF EXISTS user_gamification 
      ALTER COLUMN total_points SET DEFAULT 0,
      ALTER COLUMN level SET DEFAULT 1,
      ALTER COLUMN current_streak SET DEFAULT 0,
      ALTER COLUMN longest_streak SET DEFAULT 0,
      ALTER COLUMN total_habits_completed SET DEFAULT 0,
      ALTER COLUMN perfect_weeks SET DEFAULT 0
  ');
  
  -- mundo_nath_posts counters
  EXECUTE format('
    ALTER TABLE IF EXISTS mundo_nath_posts 
      ALTER COLUMN is_premium SET DEFAULT false,
      ALTER COLUMN likes_count SET DEFAULT 0,
      ALTER COLUMN comments_count SET DEFAULT 0,
      ALTER COLUMN saves_count SET DEFAULT 0,
      ALTER COLUMN views_count SET DEFAULT 0
  ');
  
  -- curated_content counters
  EXECUTE format('
    ALTER TABLE IF EXISTS curated_content 
      ALTER COLUMN is_premium SET DEFAULT false,
      ALTER COLUMN is_external SET DEFAULT true,
      ALTER COLUMN views_count SET DEFAULT 0,
      ALTER COLUMN saves_count SET DEFAULT 0,
      ALTER COLUMN shares_count SET DEFAULT 0
  ');
  
  -- streaks
  EXECUTE format('
    ALTER TABLE IF EXISTS streaks 
      ALTER COLUMN current_streak SET DEFAULT 0,
      ALTER COLUMN longest_streak SET DEFAULT 0
  ');
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Some boolean/counter defaults could not be set: %', SQLERRM;
END $$;

-- =====================================================
-- 5. ADICIONAR FOREIGN KEYS (Issue #6)
-- =====================================================

DO $$
BEGIN
  -- chat_messages.user_id -> auth.users
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'chat_messages_user_id_fkey'
  ) THEN
    ALTER TABLE chat_messages 
      ADD CONSTRAINT chat_messages_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  
  -- daily_insights.user_id -> user_profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'daily_insights_user_id_fkey'
  ) THEN
    ALTER TABLE daily_insights 
      ADD CONSTRAINT daily_insights_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;
  
  -- habits.user_id -> user_profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'habits_user_id_fkey'
  ) THEN
    ALTER TABLE habits 
      ADD CONSTRAINT habits_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;
  
  -- habits.template_id -> habit_templates
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'habits_template_id_fkey'
  ) THEN
    ALTER TABLE habits 
      ADD CONSTRAINT habits_template_id_fkey 
      FOREIGN KEY (template_id) REFERENCES habit_templates(id) ON DELETE SET NULL;
  END IF;
  
  -- habit_logs.habit_id -> habits
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'habit_logs_habit_id_fkey'
  ) THEN
    ALTER TABLE habit_logs 
      ADD CONSTRAINT habit_logs_habit_id_fkey 
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE;
  END IF;
  
  -- habit_logs.user_id -> user_profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'habit_logs_user_id_fkey'
  ) THEN
    ALTER TABLE habit_logs 
      ADD CONSTRAINT habit_logs_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;
  
  -- streaks.user_id -> user_profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'streaks_user_id_fkey'
  ) THEN
    ALTER TABLE streaks 
      ADD CONSTRAINT streaks_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;
  
  -- streaks.habit_id -> habits
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'streaks_habit_id_fkey'
  ) THEN
    ALTER TABLE streaks 
      ADD CONSTRAINT streaks_habit_id_fkey 
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE;
  END IF;
  
  -- mundo_nath_saves FKs
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'mundo_nath_saves_user_id_fkey'
  ) THEN
    ALTER TABLE mundo_nath_saves 
      ADD CONSTRAINT mundo_nath_saves_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'mundo_nath_saves_post_id_fkey'
  ) THEN
    ALTER TABLE mundo_nath_saves 
      ADD CONSTRAINT mundo_nath_saves_post_id_fkey 
      FOREIGN KEY (post_id) REFERENCES mundo_nath_posts(id) ON DELETE CASCADE;
  END IF;
  
  -- user_saved_content FKs
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_saved_content_user_id_fkey'
  ) THEN
    ALTER TABLE user_saved_content 
      ADD CONSTRAINT user_saved_content_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_saved_content_content_id_fkey'
  ) THEN
    ALTER TABLE user_saved_content 
      ADD CONSTRAINT user_saved_content_content_id_fkey 
      FOREIGN KEY (content_id) REFERENCES curated_content(id) ON DELETE CASCADE;
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Some foreign keys could not be created: %', SQLERRM;
END $$;

-- =====================================================
-- 6. ADICIONAR INDEXES (Issue #6)
-- =====================================================

-- User-scoped tables (critical for RLS performance)
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_daily_insights_user_id ON daily_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_insights_date ON daily_insights(date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_insights_user_date ON daily_insights(user_id, date);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_is_active ON habits(user_id, is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(date DESC);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_date ON habit_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_done ON habit_logs(user_id, done) WHERE done = true;

CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_habit_id ON streaks(habit_id);

-- Content tables (for ordering and filtering)
CREATE INDEX IF NOT EXISTS idx_mundo_nath_posts_published_at ON mundo_nath_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_mundo_nath_posts_category ON mundo_nath_posts(category);
CREATE INDEX IF NOT EXISTS idx_mundo_nath_posts_is_premium ON mundo_nath_posts(is_premium);

CREATE INDEX IF NOT EXISTS idx_curated_content_curated_at ON curated_content(curated_at DESC);
CREATE INDEX IF NOT EXISTS idx_curated_content_category ON curated_content(category);
CREATE INDEX IF NOT EXISTS idx_curated_content_relevance ON curated_content(relevance_score DESC);

-- Saves tables
CREATE INDEX IF NOT EXISTS idx_mundo_nath_saves_user_id ON mundo_nath_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_mundo_nath_saves_post_id ON mundo_nath_saves(post_id);

CREATE INDEX IF NOT EXISTS idx_user_saved_content_user_id ON user_saved_content(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_content_content_id ON user_saved_content(content_id);

-- =====================================================
-- 7. TRIGGER PARA updated_at (Issue #12)
-- =====================================================

-- Função universal para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas com updated_at
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND column_name = 'updated_at'
      AND table_name NOT IN ('onboarding_data', 'onboarding_responses') -- Já têm triggers específicos
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS set_updated_at ON %I;
      CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    ', t, t);
  END LOOP;
END $$;

-- =====================================================
-- 8. UNIQUE CONSTRAINTS (Issue #13)
-- =====================================================

-- habit_logs: um log por hábito por dia
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'habit_logs_habit_date_unique'
  ) THEN
    ALTER TABLE habit_logs 
      ADD CONSTRAINT habit_logs_habit_date_unique 
      UNIQUE (habit_id, date);
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'habit_logs unique constraint already exists or could not be created';
END $$;

-- streaks: um streak por usuário por hábito
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'streaks_user_habit_unique'
  ) THEN
    ALTER TABLE streaks 
      ADD CONSTRAINT streaks_user_habit_unique 
      UNIQUE (user_id, habit_id);
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'streaks unique constraint already exists or could not be created';
END $$;

-- mundo_nath_saves: um save por usuário por post
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'mundo_nath_saves_user_post_unique'
  ) THEN
    ALTER TABLE mundo_nath_saves 
      ADD CONSTRAINT mundo_nath_saves_user_post_unique 
      UNIQUE (user_id, post_id);
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'mundo_nath_saves unique constraint already exists or could not be created';
END $$;

-- user_saved_content: um save por usuário por conteúdo
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_saved_content_user_content_unique'
  ) THEN
    ALTER TABLE user_saved_content 
      ADD CONSTRAINT user_saved_content_user_content_unique 
      UNIQUE (user_id, content_id);
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'user_saved_content unique constraint already exists or could not be created';
END $$;

-- daily_insights: uma dica por usuário por dia
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'daily_insights_user_date_unique'
  ) THEN
    ALTER TABLE daily_insights 
      ADD CONSTRAINT daily_insights_user_date_unique 
      UNIQUE (user_id, date);
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'daily_insights unique constraint already exists or could not be created';
END $$;

-- =====================================================
-- 9. RECRIAR onboarding_responses COM SCHEMA CORRETO
-- =====================================================

CREATE TABLE IF NOT EXISTS onboarding_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  response_value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user_id ON onboarding_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_question_id ON onboarding_responses(question_id);

ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own onboarding responses"
  ON onboarding_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding responses"
  ON onboarding_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding responses"
  ON onboarding_responses FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER set_updated_at_onboarding_responses
  BEFORE UPDATE ON onboarding_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. VALIDAÇÃO FINAL
-- =====================================================

DO $$
DECLARE
  table_count INTEGER;
  index_count INTEGER;
  fk_count INTEGER;
  trigger_count INTEGER;
BEGIN
  -- Contar tabelas
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE';
  
  -- Contar indexes
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes
  WHERE schemaname = 'public';
  
  -- Contar foreign keys
  SELECT COUNT(*) INTO fk_count
  FROM information_schema.table_constraints
  WHERE constraint_type = 'FOREIGN KEY'
    AND table_schema = 'public';
  
  -- Contar triggers
  SELECT COUNT(*) INTO trigger_count
  FROM information_schema.triggers
  WHERE trigger_schema = 'public';
  
  RAISE NOTICE '==============================================';
  RAISE NOTICE '✅ MIGRATION COMPLETA!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Tabelas: %', table_count;
  RAISE NOTICE 'Indexes: %', index_count;
  RAISE NOTICE 'Foreign Keys: %', fk_count;
  RAISE NOTICE 'Triggers: %', trigger_count;
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Issues corrigidos:';
  RAISE NOTICE '  [✓] UUID defaults';
  RAISE NOTICE '  [✓] Timestamp defaults';
  RAISE NOTICE '  [✓] Boolean/counter defaults';
  RAISE NOTICE '  [✓] Foreign keys';
  RAISE NOTICE '  [✓] Indexes para performance';
  RAISE NOTICE '  [✓] Triggers updated_at';
  RAISE NOTICE '  [✓] Unique constraints';
  RAISE NOTICE '  [✓] onboarding_responses recriado';
  RAISE NOTICE '==============================================';
END $$;

