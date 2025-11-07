-- =====================================================
-- NOSSA MATERNIDADE - New Features Schema
-- Data: 2025-01-07
-- =====================================================
--
-- Este schema adiciona as novas tabelas necessárias para:
-- 1. Daily Insights (Dica IA Diária Personalizada)
-- 2. MundoNath (Feed Exclusivo da Nathália Valente)
-- 3. User Gamification (Sistema de Pontos/Níveis/Badges)
-- 4. Curated Content (MãeValente - Curadoria IA Perplexity)
-- =====================================================

-- =====================================================
-- 1. DAILY_INSIGHTS (Dicas Diárias Personalizadas)
-- =====================================================

CREATE TABLE IF NOT EXISTS daily_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Conteúdo da dica
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  actionable TEXT NOT NULL, -- Call-to-action
  relevance_score INTEGER CHECK (relevance_score >= 0 AND relevance_score <= 100),

  -- Contexto usado para gerar a dica
  context_data JSONB DEFAULT '{}'::jsonb, -- { userPhase, weekOrAge, timeOfDay, recentTopics }

  -- Metadata
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL, -- +24h
  viewed BOOLEAN DEFAULT FALSE,
  viewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Um insight por usuário por dia
  UNIQUE(user_id, date)
);

-- Índices para daily_insights
CREATE INDEX IF NOT EXISTS idx_daily_insights_user_id ON daily_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_insights_date ON daily_insights(date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_insights_expires_at ON daily_insights(expires_at);
CREATE INDEX IF NOT EXISTS idx_daily_insights_user_date ON daily_insights(user_id, date);

-- RLS para daily_insights
ALTER TABLE daily_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own insights" ON daily_insights
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own insights" ON daily_insights
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own insights" ON daily_insights
  FOR UPDATE USING (auth.uid()::text = user_id::text);

COMMENT ON TABLE daily_insights IS 'Dicas diárias personalizadas geradas por IA com base no contexto da usuária';

-- =====================================================
-- 2. MUNDO_NATH_POSTS (Feed Exclusivo Nathália Valente)
-- =====================================================

CREATE TABLE IF NOT EXISTS mundo_nath_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Conteúdo
  type TEXT NOT NULL CHECK (type IN ('article', 'story', 'video', 'audio', 'reflection')),
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL, -- HTML ou Markdown
  cover_image TEXT,

  -- Metadata
  author_name TEXT DEFAULT 'Nathália Valente',
  author_avatar TEXT,
  category TEXT NOT NULL CHECK (category IN ('primeira-viagem', 'dia-a-dia', 'pertencimento', 'autocuidado', 'real-talk')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  read_time INTEGER, -- minutos

  -- Premium
  is_premium BOOLEAN DEFAULT FALSE,

  -- Engagement
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,

  -- Publishing
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES user_profiles(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mundo_nath_posts
CREATE INDEX IF NOT EXISTS idx_mundo_nath_posts_type ON mundo_nath_posts(type);
CREATE INDEX IF NOT EXISTS idx_mundo_nath_posts_category ON mundo_nath_posts(category);
CREATE INDEX IF NOT EXISTS idx_mundo_nath_posts_is_premium ON mundo_nath_posts(is_premium);
CREATE INDEX IF NOT EXISTS idx_mundo_nath_posts_published_at ON mundo_nath_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_mundo_nath_posts_tags ON mundo_nath_posts USING GIN(tags);

-- RLS para mundo_nath_posts
ALTER TABLE mundo_nath_posts ENABLE ROW LEVEL SECURITY;

-- Posts públicos visíveis para todos
-- Posts premium apenas para usuárias premium
CREATE POLICY "Everyone can view public posts" ON mundo_nath_posts
  FOR SELECT USING (
    is_premium = false
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.subscription_tier = 'premium'
    )
  );

COMMENT ON TABLE mundo_nath_posts IS 'Feed exclusivo com conteúdo da Nathália Valente sobre maternidade real';

-- =====================================================
-- 3. MUNDO_NATH_SAVES (Posts Salvos)
-- =====================================================

CREATE TABLE IF NOT EXISTS mundo_nath_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES mundo_nath_posts(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, post_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_mundo_nath_saves_user_id ON mundo_nath_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_mundo_nath_saves_post_id ON mundo_nath_saves(post_id);
CREATE INDEX IF NOT EXISTS idx_mundo_nath_saves_saved_at ON mundo_nath_saves(saved_at DESC);

-- RLS
ALTER TABLE mundo_nath_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saves" ON mundo_nath_saves
  FOR ALL USING (auth.uid()::text = user_id::text);

-- =====================================================
-- 4. USER_GAMIFICATION (Sistema de Pontos/Níveis/Badges)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_gamification (
  user_id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,

  -- Pontos e Nível
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1, -- Level = floor(total_points / 100)

  -- Streaks
  current_streak INTEGER DEFAULT 0, -- Dias consecutivos completando hábitos
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,

  -- Badges e Achievements
  badges JSONB DEFAULT '[]'::jsonb, -- Array de badges desbloqueados
  achievements JSONB DEFAULT '[]'::jsonb, -- Array de achievements

  -- Stats
  total_habits_completed INTEGER DEFAULT 0,
  perfect_weeks INTEGER DEFAULT 0, -- Semanas com todos hábitos completados

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_gamification_level ON user_gamification(level DESC);
CREATE INDEX IF NOT EXISTS idx_user_gamification_total_points ON user_gamification(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_user_gamification_current_streak ON user_gamification(current_streak DESC);

-- RLS
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gamification" ON user_gamification
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own gamification" ON user_gamification
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own gamification" ON user_gamification
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

COMMENT ON TABLE user_gamification IS 'Sistema de gamificação com pontos, níveis, streaks e badges';

-- =====================================================
-- 5. CURATED_CONTENT (MãeValente - Curadoria IA)
-- =====================================================

CREATE TABLE IF NOT EXISTS curated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Conteúdo
  title TEXT NOT NULL,
  summary TEXT NOT NULL, -- Gerado por Claude AI
  source_url TEXT NOT NULL,
  source_name TEXT,
  published_date DATE,
  thumbnail TEXT,

  -- Classificação
  category TEXT NOT NULL CHECK (category IN ('maternidade', 'gestacao', 'puerperio', 'forca-feminina')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  relevance_score INTEGER CHECK (relevance_score >= 0 AND relevance_score <= 100),
  read_time INTEGER, -- minutos estimados

  -- Premium
  is_premium BOOLEAN DEFAULT FALSE,
  is_external BOOLEAN DEFAULT TRUE, -- Link externo ou conteúdo interno

  -- Engagement
  views_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,

  -- Curadoria
  curated_at TIMESTAMPTZ DEFAULT NOW(),
  curated_by TEXT DEFAULT 'IA Perplexity + Claude', -- Identificador do curador

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_curated_content_category ON curated_content(category);
CREATE INDEX IF NOT EXISTS idx_curated_content_curated_at ON curated_content(curated_at DESC);
CREATE INDEX IF NOT EXISTS idx_curated_content_relevance_score ON curated_content(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_curated_content_is_premium ON curated_content(is_premium);
CREATE INDEX IF NOT EXISTS idx_curated_content_tags ON curated_content USING GIN(tags);

-- RLS
ALTER TABLE curated_content ENABLE ROW LEVEL SECURITY;

-- Conteúdo público visível para todos
-- Conteúdo premium apenas para usuárias premium
CREATE POLICY "Everyone can view public curated content" ON curated_content
  FOR SELECT USING (
    is_premium = false
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.subscription_tier = 'premium'
    )
  );

COMMENT ON TABLE curated_content IS 'Conteúdo curado por IA (Perplexity + Claude) sobre maternidade';

-- =====================================================
-- 6. USER_SAVED_CONTENT (Conteúdos Salvos MãeValente)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_saved_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES curated_content(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  read_later BOOLEAN DEFAULT FALSE,
  notes TEXT,

  UNIQUE(user_id, content_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_saved_content_user_id ON user_saved_content(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_content_content_id ON user_saved_content(content_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_content_saved_at ON user_saved_content(saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_saved_content_read_later ON user_saved_content(read_later) WHERE read_later = TRUE;

-- RLS
ALTER TABLE user_saved_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved content" ON user_saved_content
  FOR ALL USING (auth.uid()::text = user_id::text);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Trigger para updated_at em mundo_nath_posts
CREATE TRIGGER update_mundo_nath_posts_updated_at
  BEFORE UPDATE ON mundo_nath_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para updated_at em user_gamification
CREATE TRIGGER update_user_gamification_updated_at
  BEFORE UPDATE ON user_gamification
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function para calcular nível baseado em pontos
CREATE OR REPLACE FUNCTION calculate_user_level(points INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN FLOOR(points / 100.0)::INTEGER + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_user_level IS 'Calcula o nível da usuária baseado nos pontos (level = floor(points / 100) + 1)';

-- Function para atualizar contador de saves em mundo_nath_posts
CREATE OR REPLACE FUNCTION update_mundo_nath_saves_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE mundo_nath_posts
    SET saves_count = saves_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE mundo_nath_posts
    SET saves_count = GREATEST(0, saves_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_mundo_nath_saves_count
  AFTER INSERT OR DELETE ON mundo_nath_saves
  FOR EACH ROW
  EXECUTE FUNCTION update_mundo_nath_saves_count();

-- Function para atualizar contador de saves em curated_content
CREATE OR REPLACE FUNCTION update_curated_content_saves_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE curated_content
    SET saves_count = saves_count + 1
    WHERE id = NEW.content_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE curated_content
    SET saves_count = GREATEST(0, saves_count - 1)
    WHERE id = OLD.content_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_curated_content_saves_count
  AFTER INSERT OR DELETE ON user_saved_content
  FOR EACH ROW
  EXECUTE FUNCTION update_curated_content_saves_count();

-- =====================================================
-- SEED DATA (Exemplos)
-- =====================================================

-- Seed: Posts de exemplo para MundoNath
INSERT INTO mundo_nath_posts (title, subtitle, content, category, type, read_time, is_premium, cover_image, tags)
VALUES
(
  'Minha Jornada como Mãe de Primeira Viagem',
  'Os primeiros dias com meu bebê e o que ninguém me contou',
  '# Minha Jornada\n\nQuando segurei meu bebê pela primeira vez...\n\n## O que aprendi\n\n1. Ninguém nasce sabendo ser mãe\n2. Pedir ajuda é sinal de força\n3. Cada bebê é único',
  'primeira-viagem',
  'article',
  5,
  false,
  'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800',
  ARRAY['primeira-viagem', 'maternidade-real', 'aprendizados']
),
(
  'A Importância do Autocuidado Materno',
  'Como encontrar tempo para si mesma na maternidade',
  '# Autocuidado não é egoísmo\n\nVocê não consegue cuidar de ninguém se não cuidar de si mesma primeiro...',
  'autocuidado',
  'reflection',
  3,
  false,
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
  ARRAY['autocuidado', 'saude-mental', 'bem-estar']
),
(
  'Pertencimento: Você Não Está Sozinha',
  'Construindo uma rede de apoio na maternidade',
  '# Pertencimento\n\nA maternidade pode ser solitária, mas não precisa ser...',
  'pertencimento',
  'story',
  4,
  false,
  'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?w=800',
  ARRAY['pertencimento', 'rede-de-apoio', 'comunidade']
);

-- Seed: Conteúdo curado de exemplo para MãeValente
INSERT INTO curated_content (title, summary, source_url, source_name, category, relevance_score, is_premium, tags, published_date)
VALUES
(
  'Desenvolvimento Infantil: Marcos dos Primeiros 12 Meses',
  'Um guia completo sobre os marcos de desenvolvimento do bebê no primeiro ano de vida, incluindo habilidades motoras, cognitivas e sociais esperadas em cada mês. Baseado em estudos recentes da Academia Americana de Pediatria.',
  'https://www.healthychildren.org/English/ages-stages/baby/Pages/Developmental-Milestones-12-Months.aspx',
  'HealthyChildren.org (AAP)',
  'maternidade',
  95,
  false,
  ARRAY['desenvolvimento', 'bebe', 'marcos', 'pediatria'],
  CURRENT_DATE - INTERVAL '2 days'
),
(
  'Amamentação: Novas Descobertas Sobre Benefícios de Longo Prazo',
  'Pesquisa recente publicada na revista The Lancet revela novos benefícios da amamentação prolongada tanto para a mãe quanto para o bebê, incluindo proteção contra doenças crônicas e melhora no desenvolvimento cognitivo.',
  'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(23)00123-4',
  'The Lancet',
  'maternidade',
  92,
  false,
  ARRAY['amamentacao', 'saude', 'pesquisa', 'beneficios'],
  CURRENT_DATE - INTERVAL '5 days'
),
(
  'Saúde Mental Materna: Identificando Sinais de Depressão Pós-Parto',
  'Guia completo sobre depressão pós-parto, incluindo sintomas, fatores de risco, quando procurar ajuda e tratamentos disponíveis. Recursos em português para mães brasileiras.',
  'https://www.who.int/mental_health/maternal-child/maternal_mental_health/en/',
  'Organização Mundial da Saúde',
  'puerperio',
  98,
  false,
  ARRAY['saude-mental', 'depressao-pos-parto', 'puerperio', 'apoio'],
  CURRENT_DATE - INTERVAL '1 day'
);

-- =====================================================
-- VALIDAÇÃO FINAL
-- =====================================================

DO $$
DECLARE
  new_tables TEXT[] := ARRAY[
    'daily_insights',
    'mundo_nath_posts',
    'mundo_nath_saves',
    'user_gamification',
    'curated_content',
    'user_saved_content'
  ];
  table_count INTEGER;
  missing_tables TEXT[] := ARRAY[]::TEXT[];
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY new_tables
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
    RAISE NOTICE '✅ Todas as 6 novas tabelas foram criadas com sucesso!';
  END IF;
END $$;

-- Status final
SELECT
  '✅ Schema de Novas Features criado com sucesso!' as status,
  COUNT(*) as total_new_tables
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'daily_insights',
    'mundo_nath_posts',
    'mundo_nath_saves',
    'user_gamification',
    'curated_content',
    'user_saved_content'
  );
