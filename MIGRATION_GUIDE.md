# Guia de Migração - Nossa Maternidade

## 📋 Passos para Completar a Migração

### 1. Migrar App React Native

```bash
# Criar estrutura
mkdir -p apps/mobile

# Copiar arquivos
cp -r src apps/mobile/src
cp App.tsx apps/mobile/App.tsx
cp app.json apps/mobile/app.json
cp babel.config.js apps/mobile/babel.config.js
cp -r assets apps/mobile/assets 2>/dev/null || true

# Atualizar imports no App.tsx
# Trocar imports relativos por @nossa/shared
```

### 2. Migrar Supabase

```bash
# Criar estrutura
mkdir -p infra/supabase/functions infra/supabase/migrations infra/supabase/schema

# Copiar Edge Functions
cp -r supabase/functions/* infra/supabase/functions/ 2>/dev/null || true

# Copiar migrations
cp -r supabase/migrations/* infra/supabase/migrations/ 2>/dev/null || true

# Copiar SQLs
cp supabase/*.sql infra/supabase/schema/ 2>/dev/null || true
```

### 3. Atualizar Imports

#### No App e Screens

```typescript
// Antes
import { getRiskLevel } from '../lib/nat-ai/guardrails';
import { colors } from '../theme/colors';

// Depois
import { getRiskLevel } from '@nossa/shared';
import { colors } from '@nossa/shared';
```

#### No Services

```typescript
// Antes
import { analyzeRisk } from '../lib/nat-ai/risk-analyzer';

// Depois
import { analyzeRisk } from '@nossa/shared';
```

### 4. Atualizar tsconfig.json (apps/mobile)

Já configurado com paths:

```json
{
  "paths": {
    "@nossa/shared": ["../../packages/shared/src"],
    "@/*": ["./src/*"]
  }
}
```

### 5. Instalar Dependências

```bash
# Instalar dependências do monorepo
pnpm install

# Verificar se @nossa/shared está disponível
pnpm --filter apps/mobile list @nossa/shared
```

### 6. Validar Localmente

```bash
# Validar tudo
./scripts/validate-local.sh  # Unix
# ou
.\scripts\validate-local.ps1 # Windows
```

### 7. Testar Build

```bash
# Testar build local
pnpm --filter apps/mobile run start

# Testar typecheck
pnpm --filter apps/mobile run typecheck
```

## ✅ Checklist de Migração

- [ ] App React Native migrado para `apps/mobile/`
- [ ] Supabase migrado para `infra/supabase/`
- [ ] Imports atualizados para `@nossa/shared`
- [ ] Dependências instaladas
- [ ] Validação local passando
- [ ] Build local funcionando
- [ ] Testes passando

## 🔧 Troubleshooting

### Erro: Module not found '@nossa/shared'

**Solução**: Verificar se `packages/shared/package.json` existe e tem `"name": "@nossa/shared"`

### Erro: Path alias não funciona

**Solução**: Verificar `tsconfig.json` em `apps/mobile/` tem paths configurados

### Erro: Workspace não encontrado

**Solução**: Executar `pnpm install` na raiz do projeto

## 📝 Notas

- Manter estrutura original até migração completa
- Testar após cada passo
- Fazer commit após cada migração bem-sucedida
