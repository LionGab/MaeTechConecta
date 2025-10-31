-- EXECUTE TUDO - Schema + Migration
-- Copie e cole este SQL completo no Supabase

-- ==========================================
-- PARTE 1: SCHEMA COMPLETO
-- ==========================================

CREATE EXTENSION IF NOT EXISTS vector;

DO $$

BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind='r' AND n.nspname='public' AND c.relname='user_profiles') THEN
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
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind='r' AND n.nspname='public' AND c.relname='daily_plans') THEN
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
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind='r' AND n.nspname='public' AND c.relname='conversation_memory') THEN
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
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind='r' AND n.nspname='public' AND c.relname='moderation_queue') THEN
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
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind='r' AND n.nspname='public' AND c.relname='risk_alerts') THEN
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
  END IF;
END$$;

-- Índices
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_plans_user_date ON daily_plans(user_id, date);
CREATE INDEX IF NOT EXISTS idx_conversation_memory_user_id ON conversation_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_memory_embedding ON conversation_memory USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_reviewed ON moderation_queue(reviewed, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_user_resolved ON risk_alerts(user_id, resolved, created_at DESC);

-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_alerts ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- PARTE 2: MIGRATION CHAT_MESSAGES
-- ==========================================

-- Adicionar response se não existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'response') THEN
    ALTER TABLE chat_messages ADD COLUMN response TEXT;

    -- Backfill response baseado em is_user
    UPDATE chat_messages SET response = CASE
      WHEN is_user THEN ''
      ELSE message
    END;

    ALTER TABLE chat_messages ALTER COLUMN response SET NOT NULL;
    RAISE NOTICE 'Coluna response adicionada';
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'context_data') THEN
    ALTER TABLE chat_messages ADD COLUMN context_data JSONB;
    RAISE NOTICE 'Coluna context_data adicionada';
  END IF;

  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'is_user') THEN
    ALTER TABLE chat_messages DROP COLUMN is_user;
    RAISE NOTICE 'Coluna is_user removida';
  END IF;
END $$;

-- Migrar FK de profiles para user_profiles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'chat_messages'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND kcu.referenced_table_name = 'profiles'
  ) THEN
    ALTER TABLE chat_messages DROP CONSTRAINT IF EXISTS chat_messages_user_id_fkey;
    ALTER TABLE chat_messages ADD CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
    RAISE NOTICE 'FK migrada para user_profiles';
  END IF;
END $$;

-- ==========================================
-- PARTE 3: POLÍTICAS RLS
-- ==========================================

-- user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- chat_messages
DROP POLICY IF EXISTS "Users can view own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON chat_messages;
CREATE POLICY "Users can view own messages" ON chat_messages FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- daily_plans
DROP POLICY IF EXISTS "Users can view own plans" ON daily_plans;
DROP POLICY IF EXISTS "Users can insert own plans" ON daily_plans;
CREATE POLICY "Users can view own plans" ON daily_plans FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own plans" ON daily_plans FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- conversation_memory
DROP POLICY IF EXISTS "Users can view own memory" ON conversation_memory;
DROP POLICY IF EXISTS "Users can update own memory" ON conversation_memory;
DROP POLICY IF EXISTS "Users can insert own memory" ON conversation_memory;
CREATE POLICY "Users can view own memory" ON conversation_memory FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own memory" ON conversation_memory FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own memory" ON conversation_memory FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- moderation_queue
DROP POLICY IF EXISTS "Users can view own moderation entries" ON moderation_queue;
DROP POLICY IF EXISTS "Admins can manage all moderation" ON moderation_queue;
CREATE POLICY "Users can view own moderation entries" ON moderation_queue FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Admins can manage all moderation" ON moderation_queue FOR ALL USING (EXISTS (SELECT 1 FROM user_profiles WHERE id::text = auth.uid()::text AND email = 'admin@nossamaternidade.com'));

-- risk_alerts
DROP POLICY IF EXISTS "Users can view own risk alerts" ON risk_alerts;
DROP POLICY IF EXISTS "Admins can manage all risk alerts" ON risk_alerts;
CREATE POLICY "Users can view own risk alerts" ON risk_alerts FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Admins can manage all risk alerts" ON risk_alerts FOR ALL USING (EXISTS (SELECT 1 FROM user_profiles WHERE id::text = auth.uid()::text AND email = 'admin@nossamaternidade.com'));

-- ==========================================
-- PARTE 4: FUNÇÃO E TRIGGER
-- ==========================================

CREATE OR REPLACE FUNCTION update_daily_interactions()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE user_profiles
    SET daily_interactions = daily_interactions + 1,
        last_interaction_date = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_update_interactions') THEN
    CREATE TRIGGER trigger_update_interactions
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_interactions();
  END IF;
END$$;

-- ==========================================
-- STATUS FINAL
-- ==========================================

SELECT '✅ Schema completo e migration concluída!' as status;
