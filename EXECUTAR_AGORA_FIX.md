# 🔧 FIX RÁPIDO - Erro de Migrations

## ❌ Erro Atual

```
ERROR: function uuid_generate_v4() does not exist (SQLSTATE 42883)
```

## ✅ Solução (Escolha 1 opção)

### OPÇÃO 1: Habilitar Extensões via Dashboard (MAIS RÁPIDO)

1. **Abra o Supabase Dashboard**:

   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID/database/extensions
   ```

2. **Habilite as extensões**:
   - Procure por `uuid-ossp` → Clique em "Enable"
   - Procure por `pgcrypto` → Clique em "Enable"

3. **Execute as migrations**:
   ```powershell
   supabase db push
   ```

---

### OPÇÃO 2: Via SQL Editor

1. **Abra o SQL Editor**:

   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor
   ```

2. **Cole e execute**:

   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   ```

3. **Execute as migrations**:
   ```powershell
   supabase db push
   ```

---

### OPÇÃO 3: Via PowerShell (se tiver psql instalado)

```powershell
# Obter connection string do Supabase Dashboard > Settings > Database
$CONNECTION_STRING = "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

psql $CONNECTION_STRING -f scripts/fix-supabase-extensions.sql
```

Depois:

```powershell
supabase db push
```

---

## 🎯 Verificar se Funcionou

Execute no SQL Editor:

```sql
SELECT extname, extversion
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'pgcrypto');
```

Deve retornar:

```
extname    | extversion
-----------+-----------
uuid-ossp  | 1.1
pgcrypto   | 1.3
```

---

## 📝 Explicação

O erro ocorre porque:

- Supabase não habilita `uuid-ossp` por padrão
- As migrations usam `uuid_generate_v4()` que vem dessa extensão
- Precisamos habilitar manualmente VIA DASHBOARD ou SQL

---

## 🚀 Próximos Passos

Após habilitar as extensões e rodar `supabase db push`:

```powershell
# 1. Verificar se migrations aplicaram
supabase db diff

# 2. Instalar dependências
pnpm install

# 3. Rodar app
pnpm dev

# 4. Android
pnpm android
```

---

## ❓ Ainda com Problemas?

Se o erro persistir:

1. **Verifique se as extensões estão habilitadas**:

   ```sql
   SELECT * FROM pg_available_extensions
   WHERE name IN ('uuid-ossp', 'pgcrypto');
   ```

2. **Limpe migrations aplicadas** (cuidado - apaga dados):

   ```sql
   TRUNCATE supabase_migrations.schema_migrations;
   ```

3. **Reaplique migrations**:
   ```powershell
   supabase db push
   ```

---

## 📞 Suporte

Se nada funcionar:

- Verifique logs: `supabase db push --debug`
- Abra issue no GitHub
- Contato: dev@nossa-maternidade.com.br

