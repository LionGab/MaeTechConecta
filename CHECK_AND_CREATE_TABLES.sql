-- Verificar e criar apenas tabelas que faltam
-- Execute este SQL no Supabase para criar somente o que não existe

-- 1. Habilitar pgvector (se não estiver)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Verificar se tabela conversation_memory existe, se não criar
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'conversation_memory') THEN
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

    CREATE INDEX idx_conversation_memory_user_id ON conversation_memory(user_id);
    CREATE INDEX idx_conversation_memory_embedding ON conversation_memory USING ivfflat (embedding vector_cosine_ops);

    ALTER TABLE conversation_memory ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view own memory" ON conversation_memory
      FOR SELECT USING (auth.uid()::text = user_id::text);

    CREATE POLICY "Users can update own memory" ON conversation_memory
      FOR UPDATE USING (auth.uid()::text = user_id::text);

    CREATE POLICY "Users can insert own memory" ON conversation_memory
      FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

    RAISE NOTICE 'Tabela conversation_memory criada com sucesso!';
  ELSE
    RAISE NOTICE 'Tabela conversation_memory já existe';
  END IF;
END $$;

-- 3. Verificar se tabela moderation_queue existe, se não criar
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'moderation_queue') THEN
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

    CREATE INDEX idx_moderation_queue_reviewed ON moderation_queue(reviewed, created_at DESC);

    ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;

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

    RAISE NOTICE 'Tabela moderation_queue criada com sucesso!';
  ELSE
    RAISE NOTICE 'Tabela moderation_queue já existe';
  END IF;
END $$;

-- 4. Verificar se tabela risk_alerts existe, se não criar
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'risk_alerts') THEN
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

    CREATE INDEX idx_risk_alerts_user_resolved ON risk_alerts(user_id, resolved, created_at DESC);

    ALTER TABLE risk_alerts ENABLE ROW LEVEL SECURITY;

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

    RAISE NOTICE 'Tabela risk_alerts criada com sucesso!';
  ELSE
    RAISE NOTICE 'Tabela risk_alerts já existe';
  END IF;
END $$;

-- 5. Adicionar colunas novas na user_profiles se não existirem
DO $$
BEGIN
  -- Adicionar kiwify_customer_id
  IF NOT EXISTS (SELECT FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'kiwify_customer_id') THEN
    ALTER TABLE user_profiles ADD COLUMN kiwify_customer_id TEXT;
    RAISE NOTICE 'Coluna kiwify_customer_id adicionada';
  END IF;

  -- Adicionar kiwify_transaction_id
  IF NOT EXISTS (SELECT FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'kiwify_transaction_id') THEN
    ALTER TABLE user_profiles ADD COLUMN kiwify_transaction_id TEXT;
    RAISE NOTICE 'Coluna kiwify_transaction_id adicionada';
  END IF;

  -- Adicionar subscription_start
  IF NOT EXISTS (SELECT FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'subscription_start') THEN
    ALTER TABLE user_profiles ADD COLUMN subscription_start TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Coluna subscription_start adicionada';
  END IF;

  -- Adicionar subscription_end
  IF NOT EXISTS (SELECT FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'subscription_end') THEN
    ALTER TABLE user_profiles ADD COLUMN subscription_end TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Coluna subscription_end adicionada';
  END IF;

  -- Adicionar behavior_analysis
  IF NOT EXISTS (SELECT FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'behavior_analysis') THEN
    ALTER TABLE user_profiles ADD COLUMN behavior_analysis JSONB;
    RAISE NOTICE 'Coluna behavior_analysis adicionada';
  END IF;

  -- Adicionar risk_level
  IF NOT EXISTS (SELECT FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'risk_level') THEN
    ALTER TABLE user_profiles ADD COLUMN risk_level INTEGER DEFAULT 0;
    RAISE NOTICE 'Coluna risk_level adicionada';
  END IF;
END $$;

-- Resultado final
SELECT
  'Schema atualizado com sucesso! ✅' as status,
  (SELECT count(*) FROM pg_tables WHERE schemaname = 'public') as total_tabelas;
