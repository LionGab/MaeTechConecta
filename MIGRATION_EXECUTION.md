# Execução de Migração - Nossa Maternidade

## 🚀 Passo 1: Criar Estrutura Base

```bash
# Criar pastas
mkdir -p .github/workflows
mkdir -p src/lib/nat-ai
mkdir -p src/components src/screens src/services src/hooks src/navigation src/theme src/utils
mkdir -p supabase/functions
mkdir -p __tests__/services __tests__/lib/nat-ai __tests__/components
mkdir -p e2e/maestro e2e/detox
mkdir -p docs scripts
```

## 📦 Passo 2: Migrar Código React Native

```bash
# Mover código existente para src/
# (assumindo que já está em src/ ou precisa mover de outro local)
# Se já está em src/, manter estrutura
# Se está em outro lugar, mover:
# mv <código-legado> src/
```

## 🔧 Passo 3: Migrar Edge Functions

```bash
# Mover Edge Functions existentes
# Se já estão em supabase/functions/, manter
# Se estão em outro lugar:
# mv <edge-functions-legado> supabase/functions/
```

## ✅ Passo 4: Validar Estrutura

```bash
# Verificar estrutura
tree -L 3 -I 'node_modules'

# Validar TypeScript
pnpm run typecheck

# Validar lint
pnpm run lint
```

## 🧪 Passo 5: Executar Testes

```bash
# Testes unitários
pnpm test

# Coverage
pnpm run test:coverage

# Verificar ≥70%
pnpm run test:coverage:check
```

## 📝 Próximos Passos

1. ✅ Estrutura criada
2. ⏳ Migrar código React Native
3. ⏳ Migrar Edge Functions
4. ⏳ Atualizar imports
5. ⏳ Configurar secrets
6. ⏳ Validar localmente
