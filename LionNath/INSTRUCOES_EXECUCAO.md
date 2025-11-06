# 🚀 Instruções de Execução - Gemini 1.5 Pro + Memória Vetorial

## ✅ Passo 1: Executar SQL no Supabase

### Método 1: Via Dashboard (Recomendado)

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Copie todo o conteúdo do arquivo `EXECUTAR_SUPABASE.sql`
6. Cole no editor SQL
7. Clique em **Run** ou pressione `Ctrl+Enter`

### Método 2: Via Supabase CLI (se instalado)

```bash
# Se você tem Supabase CLI instalado:
supabase db push

# Ou execute diretamente:
supabase db execute --file EXECUTAR_SUPABASE.sql
```

### Verificação

Após executar, verifique se tudo foi criado:

```sql
-- Verificar extensão
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Verificar tabela
SELECT table_name FROM information_schema.tables WHERE table_name = 'conversations';

-- Verificar função
SELECT routine_name FROM information_schema.routines WHERE routine_name = 'match_conversations';
```

## ✅ Passo 2: Configurar Secret no Supabase

1. No Supabase Dashboard, vá em **Edge Functions** (menu lateral)
2. Clique em **Secrets** ou **Settings**
3. Adicione novo secret:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Sua chave da API do Gemini
4. Salve

## ✅ Passo 3: Deploy da Edge Function (se necessário)

Se você já tem a Edge Function `nathia-chat`:

1. No Supabase Dashboard, vá em **Edge Functions**
2. Clique em `nathia-chat`
3. Clique em **Deploy** ou **Redeploy**

Ou via CLI:
```bash
supabase functions deploy nathia-chat
```

## ✅ Passo 4: Testar

1. Inicie o app:
```bash
cd apps/mobile
pnpm dev
```

2. Abra o chat e envie uma mensagem
3. Verifique se:
   - A resposta vem do Gemini 1.5 Pro
   - As memórias vetoriais estão sendo usadas
   - Os embeddings estão sendo salvos

## 🐛 Troubleshooting

### "Função match_conversations não encontrada"
- Execute o SQL novamente: `EXECUTAR_SUPABASE.sql`

### "Tabela conversations não encontrada"
- Execute o SQL novamente: `EXECUTAR_SUPABASE.sql`

### "GEMINI_API_KEY not configured"
- Configure no Supabase Dashboard > Edge Functions > Secrets

### Erro ao executar SQL
- Verifique se você tem permissões de administrador no projeto
- Verifique se a extensão `pgvector` está disponível no seu plano do Supabase

