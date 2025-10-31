-- Migration segura para chat_messages e RLS
-- Execute este SQL após o schema completo

-- 1. Migrar chat_messages: adicionar colunas novas, manter dados antigos
DO $$
BEGIN
  -- Adicionar response se não existe
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'response') THEN
    ALTER TABLE chat_messages ADD COLUMN response TEXT;

    -- Backfill response baseado em is_user
    UPDATE chat_messages SET response = CASE
      WHEN is_user THEN ''  -- user message, response vazio
      ELSE message  -- assistant message, copiar para response
    END;

    ALTER TABLE chat_messages ALTER COLUMN response SET NOT NULL;

    RAISE NOTICE 'Coluna response adicionada e backfill concluído';
  END IF;

  -- Adicionar context_data
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'context_data') THEN
    ALTER TABLE chat_messages ADD COLUMN context_data JSONB;
    RAISE NOTICE 'Coluna context_data adicionada';
  END IF;

  -- Se FK ainda é para profiles, migrar para user_profiles
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'chat_messages'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND tc.constraint_schema = 'public'
    AND kcu.referenced_table_name = 'profiles'
  ) THEN
    -- Remover FK antiga
    ALTER TABLE chat_messages DROP CONSTRAINT IF EXISTS chat_messages_user_id_fkey;

    -- Adicionar nova FK para user_profiles
    ALTER TABLE chat_messages
    ADD CONSTRAINT chat_messages_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

    RAISE NOTICE 'Foreign key migrada para user_profiles';
  END IF;

  -- Remover is_user se existe
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'chat_messages' AND column_name = 'is_user') THEN
    ALTER TABLE chat_messages DROP COLUMN is_user;
    RAISE NOTICE 'Coluna is_user removida';
  END IF;
END $$;

-- 2. Atualizar políticas RLS
-- Remover políticas antigas e criar novas

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

-- Status final
SELECT 'Migration concluída com sucesso! ✅' as status;
