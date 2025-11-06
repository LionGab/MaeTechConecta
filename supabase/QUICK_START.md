# 🚀 Quick Start - Supabase Setup

Guia rápido para configurar o Supabase em **5 minutos**.

---

## ⚡ Setup em 3 Passos

### 1️⃣ Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em **New Project**
3. Preencha:
   - **Name**: Nossa Maternidade
   - **Database Password**: (anote essa senha!)
   - **Region**: South America (São Paulo)
4. Clique em **Create new project**
5. **Aguarde 2-3 minutos** enquanto o projeto é provisionado

### 2️⃣ Copiar Credenciais

Após o projeto ser criado:

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://abcdefgh.supabase.co`)
   - **anon/public key** (ex: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3️⃣ Configurar .env

Crie/edite `.env` na raiz do projeto:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 Executar Migration

### Via Dashboard (Recomendado)

1. No Supabase Dashboard, clique em **SQL Editor** (ícone </> no menu lateral)
2. Clique em **+ New query**
3. Abra o arquivo: `supabase/migrations/20250106_000000_consolidated_schema.sql`
4. **Copie TUDO** (Ctrl+A, Ctrl+C)
5. **Cole no SQL Editor** (Ctrl+V)
6. Clique em **Run** (ou `Ctrl+Enter`)
7. Aguarde 10-15 segundos
8. ✅ Deve ver a mensagem: **"✅ Todas as 14 tabelas foram criadas com sucesso!"**

---

## ✅ Validação Rápida

Execute no SQL Editor:

```sql
-- Ver todas as tabelas criadas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Esperado**: 14 tabelas

```
alert_logs
chat_messages
content_favorites
content_items
conversation_history
conversations
daily_plans
habit_completions
habits
moderation_queue
risk_alerts
user_feature_flags
user_profiles
vector_embeddings
```

---

## 🔐 Habilitar Anonymous Auth (Opcional)

Se o app usar auth anônimo:

1. Vá em **Authentication** → **Providers**
2. Encontre **Anonymous Sign-ins**
3. Toggle para **Enabled**
4. Clique em **Save**

---

## 🎉 Pronto!

Agora você pode rodar o app:

```bash
cd apps/mobile
pnpm dev
```

O app vai:

- ✅ Conectar com Supabase
- ✅ Criar usuários
- ✅ Salvar mensagens
- ✅ Usar busca vetorial com Gemini

---

## 🐛 Problemas?

### "Error: Invalid API key"

**Solução**: Verifique se copiou a **anon key** corretamente (não a service_role key)

### "Error: connect ECONNREFUSED"

**Solução**: Verifique se a `EXPO_PUBLIC_SUPABASE_URL` está correta

### "Error: extension vector not found"

**Solução**: Execute no SQL Editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Nada funciona

**Solução**: Rode a migration novamente. Ela é idempotente (pode rodar múltiplas vezes).

---

## 📚 Próximos Passos

- Ver **[README.md](./README.md)** para documentação completa
- Configurar AI providers (Anthropic, OpenAI, Gemini)
- Configurar Sentry para monitoramento de erros
- Habilitar outros auth providers (Google, Apple, etc)

---

**🚀 Happy coding!**
