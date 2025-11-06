# Executar SQL Migration - Gemini Memory

## Status
- ✅ Projeto Supabase linkado: `mnszbkeuerjcevjvdqme`
- ⏳ Migration SQL pendente de execução

## Arquivo de Migration
- **Arquivo:** `supabase/migrations/001_gemini_memory.sql`
- **Objetivo:** Criar tabela `conversations` com suporte a embeddings vetoriais para busca semântica

## Como Executar

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New Query**
4. Abra o arquivo: `supabase/migrations/001_gemini_memory.sql`
5. Copie TODO o conteúdo do arquivo
6. Cole no editor SQL
7. Clique em **Run** ou pressione `Ctrl+Enter`

### Opção 2: Via Supabase CLI (se Docker estiver rodando)

```bash
supabase db push
```

## Verificação

Após executar a migration, execute estas queries no SQL Editor para verificar:

```sql
-- Verificar extensão pgvector
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Verificar tabela conversations
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'conversations';

-- Verificar função match_conversations
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'match_conversations';

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'conversations';
```

## O que a Migration Cria

1. **Extensão pgvector** - Para busca vetorial
2. **Tabela `conversations`** - Armazena conversas com embeddings
3. **Índices** - Para busca eficiente (ivfflat e por usuário/data)
4. **Função `match_conversations`** - Busca semântica de conversas relevantes
5. **Políticas RLS** - Segurança (usuários só veem suas próprias conversas)

## Próximos Passos

Após executar a migration:
1. ✅ Verificar se tabela foi criada
2. ✅ Verificar se função foi criada
3. ✅ Verificar se RLS está ativo
4. ⏳ Testar busca semântica via Edge Function

## Notas

- A migration usa `ivfflat` ao invés de `hnsw` para compatibilidade com planos gratuitos
- Embeddings são de 768 dimensões (Gemini text-embedding-004)
- Conversas antigas (>30 dias) podem ser limpas automaticamente

