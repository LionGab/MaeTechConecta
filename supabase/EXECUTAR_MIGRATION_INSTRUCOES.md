# Instruções para Executar Migration SQL

## Passo a Passo

### 1. Acessar SQL Editor

- URL: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/sql/new
- Ou: Dashboard > SQL Editor > New Query

### 2. Copiar SQL da Migration

Copie TODO o conteúdo do arquivo: `supabase/migrations/001_gemini_memory.sql`

### 3. Colar no Editor SQL

- Cole o SQL completo no editor
- Verifique se está completo (deve ter ~130 linhas)

### 4. Executar

- Clique em **Run** ou pressione `Ctrl+Enter`
- Aguarde a execução completar

### 5. Verificar Execução

Execute estas queries para verificar:

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

## Resultado Esperado

Após executar, você deve ver:

- ✅ Extensão `vector` habilitada
- ✅ Tabela `conversations` criada com colunas: id, user_id, message, response, embedding, created_at
- ✅ Função `match_conversations` criada
- ✅ 3 políticas RLS criadas (INSERT, SELECT, DELETE)

## Próximos Passos

Após executar a migration:

1. ✅ Verificar se tudo foi criado corretamente
2. ⏳ Testar busca semântica via Edge Function
3. ⏳ Verificar se embeddings estão sendo salvos

