# Verificação Local - Nossa Maternidade

## ✅ Comandos de Verificação

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Lint

```bash
pnpm run lint
```

### 3. Type Check

```bash
pnpm run typecheck
```

### 4. Testes Unitários

```bash
pnpm test
```

### 5. Coverage

```bash
pnpm run test:coverage
pnpm run test:coverage:check  # Verificar ≥70%
```

### 6. E2E Smoke (Local)

```bash
# Instalar Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Executar smoke tests
pnpm run e2e:smoke
```

### 7. Build Dry-Run EAS (Local)

```bash
# Android
pnpm --filter apps/mobile run eas:build:android -- --local

# iOS (requer macOS)
pnpm --filter apps/mobile run eas:build:ios -- --local
```

### 8. Validação Completa

```bash
# Script automatizado
pnpm run validate:local

# Ou manual
pnpm run validate
```

## 📊 Output Esperado

### Lint

```
✅ Sem erros de lint
```

### Type Check

```
✅ Sem erros de TypeScript
```

### Tests

```
✅ Todos os testes passando
Coverage: ≥70%
```

### E2E Smoke

```
✅ Smoke tests passando
```

## 🔧 Troubleshooting

### Erro: Module not found

**Solução**: Executar `pnpm install` novamente

### Erro: Coverage < 70%

**Solução**: Adicionar mais testes até atingir 70%

### Erro: Maestro não encontrado

**Solução**: Instalar Maestro CLI: `curl -Ls "https://get.maestro.mobile.dev" | bash`

## ✅ Checklist de Verificação

- [ ] Lint passando
- [ ] Type check passando
- [ ] Testes passando
- [ ] Coverage ≥70%
- [ ] E2E smoke passando (opcional)
- [ ] Build local funcionando (opcional)
