# 📊 Schema do Database - Nossa Maternidade

## 📋 Visão Geral

Este documento descreve o schema completo do database da Nossa Maternidade, criado conforme o **PROMPT 2: Setup Supabase Database**.

## 🗄️ Tabelas Criadas (10 no total)

### 1. `user_profiles`

Perfis das usuárias da Nossa Maternidade.

**Campos principais:**

- `id` (UUID, PK)
- `email` (TEXT, UNIQUE)
- `name` (TEXT)
- `type` ('gestante' | 'mae' | 'tentante')
- `pregnancy_week` (INTEGER, nullable)
- `baby_name` (TEXT, nullable)
- `preferences` (JSONB)
- `subscription_tier` ('free' | 'premium')
- `onboarding_data` (JSONB)
- `behavior_analysis` (JSONB, nullable)
- `risk_level` (INTEGER, default 0)

### 2. `conversation_history`

Histórico completo de conversas com NAT-IA.

**Campos principais:**

- `id` (UUID, PK)
- `user_id` (UUID, FK → user_profiles.id)
- `messages` (JSONB) - Array de mensagens
- `summary_daily` (TEXT, nullable)
- `summary_weekly` (TEXT, nullable)
- `key_memories` (JSONB, nullable)

### 3. `chat_messages`

Mensagens individuais do chat.

**Campos principais:**

- `id` (UUID, PK)
- `user_id` (UUID, FK → user_profiles.id)
- `message` (TEXT)
- `response` (TEXT)
- `role` ('user' | 'assistant')
- `context_data` (JSONB, nullable)
- `is_urgent` (BOOLEAN, default false)
- `risk_flag` (INTEGER, nullable)

### 4. `habits`

Hábitos das usuárias (pré-definidos e customizados).

**Campos principais:**

- `id` (UUID, PK)
- `user_id` (UUID, FK → user_profiles.id)
- `name` (TEXT)
- `description` (TEXT, nullable)
- `category` (TEXT)
- `is_custom` (BOOLEAN, default false)
- `is_active` (BOOLEAN, default true)

### 5. `habit_completions`

Registro de completions diárias de hábitos.

**Campos principais:**

- `id` (UUID, PK)
- `habit_id` (UUID, FK → habits.id)
- `user_id` (UUID, FK → user_profiles.id)
- `completed_at` (TIMESTAMPTZ)
- `date` (DATE)

### 6. `content_items`

Conteúdos exclusivos da Natália Valente.

**Campos principais:**

- `id` (UUID, PK)
- `title` (TEXT)
- `description` (TEXT, nullable)
- `type` ('article' | 'video' | 'audio' | 'post')
- `content_url` (TEXT)
- `thumbnail_url` (TEXT, nullable)
- `category` (TEXT)
- `tags` (TEXT[])
- `author` (TEXT, default 'Natália Valente')
- `is_featured` (BOOLEAN, default false)

### 7. `content_favorites`

Conteúdos favoritados pelas usuárias.

**Campos principais:**

- `id` (UUID, PK)
- `user_id` (UUID, FK → user_profiles.id)
- `content_id` (UUID, FK → content_items.id)

### 8. `moderation_queue`

Fila de moderação para mensagens que precisam revisão.

**Campos principais:**

- `id` (UUID, PK)
- `user_id` (UUID, FK → user_profiles.id)
- `message` (TEXT)
- `category` (TEXT)
- `severity` (INTEGER, 1-5)
- `action` ('allow' | 'block' | 'flag')
- `reviewed` (BOOLEAN, default false)
- `reviewed_by` (UUID, nullable)
- `reviewed_at` (TIMESTAMPTZ, nullable)

### 9. `risk_alerts`

Alertas de risco médico ou psicológico.

**Campos principais:**

- `id` (UUID, PK)
- `user_id` (UUID, FK → user_profiles.id)
- `risk_type` ('medical' | 'psychological')
- `severity` (INTEGER, 1-10)
- `message_context` (TEXT)
- `action_taken` (TEXT)
- `resolved` (BOOLEAN, default false)
- `resolved_at` (TIMESTAMPTZ, nullable)

### 10. `vector_embeddings`

Embeddings vetoriais para RAG (busca semântica).

**Campos principais:**

- `id` (UUID, PK)
- `user_id` (UUID, FK → user_profiles.id)
- `content` (TEXT)
- `embedding` (vector(768)) - pgvector
- `metadata` (JSONB)

## 🔒 Row Level Security (RLS)

**RLS está habilitado em TODAS as 10 tabelas.**

### Políticas de Acesso:

1. **user_profiles**: Usuário só vê/edita seu próprio perfil
2. **conversation_history**: Usuário só vê/edita sua própria conversa
3. **chat_messages**: Usuário só vê suas próprias mensagens
4. **habits**: Usuário só vê/edita seus próprios hábitos
5. **habit_completions**: Usuário só vê/edita suas próprias completions
6. **content_items**: Todos podem ler (conteúdo público)
7. **content_favorites**: Usuário só vê seus próprios favoritos
8. **moderation_queue**: Apenas admins (implementar lógica depois)
9. **risk_alerts**: Usuário pode ver seus próprios alertas
10. **vector_embeddings**: Usuário só vê seus próprios embeddings

## 📈 Índices Otimizados

### Índices por Tabela:

- **user_id**: Em todas as tabelas com FK para user_profiles
- **created_at**: Para ordenação temporal (DESC)
- **embedding**: Índice ivfflat para busca vetorial (cosine distance)

### Índices Específicos:

- `idx_chat_messages_is_urgent`: Para filtrar mensagens urgentes
- `idx_chat_messages_risk_flag`: Para filtrar por nível de risco
- `idx_content_items_tags`: GIN index para busca em arrays
- `idx_moderation_queue_reviewed`: Para fila de moderação pendente
- `idx_risk_alerts_resolved`: Para alertas não resolvidos

## 🔗 Foreign Keys

Todas as foreign keys usam `ON DELETE CASCADE`:

- `conversation_history.user_id` → `user_profiles.id`
- `chat_messages.user_id` → `user_profiles.id`
- `habits.user_id` → `user_profiles.id`
- `habit_completions.habit_id` → `habits.id`
- `habit_completions.user_id` → `user_profiles.id`
- `content_favorites.user_id` → `user_profiles.id`
- `content_favorites.content_id` → `content_items.id`
- `moderation_queue.user_id` → `user_profiles.id`
- `risk_alerts.user_id` → `user_profiles.id`
- `vector_embeddings.user_id` → `user_profiles.id`

## 🔧 Functions & Triggers

### Função: `update_updated_at_column()`

Atualiza automaticamente o campo `updated_at` quando uma linha é modificada.

### Triggers:

- `update_user_profiles_updated_at`
- `update_conversation_history_updated_at`

## 📝 Como Usar

### 1. Execute o Schema no Supabase:

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Copie o conteúdo de `schema-club-valente-completo.sql`
4. Cole e execute
5. Verifique se todas as 10 tabelas foram criadas

### 2. Verificar Schema:

```sql
-- Listar todas as tabelas criadas
SELECT table_name
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
  )
ORDER BY table_name;
```

### 3. Testar RLS:

```sql
-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
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
```

## ✅ Checklist de Validação

- [ ] Todas as 10 tabelas foram criadas
- [ ] RLS está habilitado em todas as tabelas
- [ ] Políticas de segurança foram criadas
- [ ] Índices foram criados corretamente
- [ ] Foreign keys estão configuradas com CASCADE
- [ ] Extensões (uuid-ossp, vector) foram habilitadas
- [ ] Triggers estão funcionando
- [ ] Validação final passou

## 🚀 Próximos Passos

Após criar o schema:

1. Configurar variáveis de ambiente no app
2. Testar conexão com Supabase
3. Criar Edge Functions para NAT-IA
4. Implementar lógica de autenticação
5. Criar queries de exemplo no frontend

---

**Criado em:** 30/10/2025
**Baseado em:** PROMPT 2: Setup Supabase Database
**Status:** ✅ Completo
