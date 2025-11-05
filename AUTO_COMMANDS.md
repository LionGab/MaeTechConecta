# 🚀 Comandos Automáticos - Skip Permissions

Todos os comandos configurados para executar automaticamente **sem pedir permissão ou confirmação**.

## 📋 Comandos Disponíveis

### 🔍 Revisão e Validação

```bash
# Revisão automática de mudanças (sem pedir permissão)
npm run review-changes

# Revisão com staging automático
npm run review-changes:auto

# Validação automática (fix + lint + type-check)
npm run validate:auto

# Correções automáticas (lint + format)
npm run fix:all
```

### 🏗️ Build

```bash
# Build Android (preview, non-interactive)
npm run build:android

# Build iOS (preview, non-interactive)
npm run build:ios

# Build Android + iOS
npm run build:all

# Deploy Edge Functions (todas)
npm run build:functions

# Build completo (mobile + functions)
npm run build:full

# Deploy completo (alias)
npm run deploy:all
```

### 🎯 Execução Completa Automática

```bash
# Executa tudo: review + fix + validate + checklist
npm run auto:all

# Executa tudo + build mobile
npm run auto:build

# Executa tudo + build completo (mobile + functions)
npm run auto:full
```

## 🔧 Como Funciona

### Flags Automáticos Aplicados

Todos os comandos usam:

- `--non-interactive` - Não pede confirmação
- `--no-wait` - Não espera build completar
- `--no-verify-jwt` - Pula verificação JWT (functions)
- `AUTO_APPROVE=true` - Aprova automaticamente
- `SKIP_PERMISSIONS=true` - Pula todas as permissões

### Variáveis de Ambiente

```bash
# Habilitar staging automático
AUTO_STAGE=true npm run review-changes

# Build específico
npm run build:android production  # profile production
npm run build:ios preview         # profile preview
```

## 📝 Detalhes dos Scripts

### `scripts/auto-review-changes.js`

- Revisa mudanças do Git
- Aplica correções automáticas (lint + format)
- Valida código automaticamente
- Opção de staging automático

### `scripts/auto-build.js`

- Build EAS sem interação
- Deploy Edge Functions automático
- Suporta Android, iOS, ou ambos
- Deploy de todas as functions de uma vez

### `scripts/auto-all.js`

- Executa sequência completa:
  1. Review changes
  2. Fix all
  3. Validate auto
  4. Validate checklist
  5. Build (opcional)

## ✅ Auto Aprovação

```bash
# Configurar skip awaiting review (primeira vez)
npm run skip-awaiting-review

# Aprovar todas as aprovações pendentes
npm run auto-approve:all

# Ver status
npm run auto-approve:status
```

Ver `AUTO_APPROVE.md` para detalhes completos.

## 🎯 Exemplos de Uso

### Fluxo Completo de Desenvolvimento

```bash
# 1. Fazer mudanças no código
# ... editar arquivos ...

# 2. Revisar e corrigir automaticamente
npm run review-changes

# 3. Validar tudo
npm run validate:auto

# 4. Build e deploy (se tudo OK)
npm run auto:full
```

### Build Rápido

```bash
# Apenas build mobile
npm run build:all

# Apenas functions
npm run build:functions
```

### CI/CD Local

```bash
# Executar tudo (como no CI)
npm run auto:all
```

## ⚙️ Configuração Git Hooks

O pre-commit hook está configurado para executar automaticamente:

```bash
# .husky/pre-commit
- Lint fix automático
- Format automático
- Validações (não bloqueiam se falharem)
```

## 🚀 CI/CD Automático

### GitHub Actions

- **CI** (`ci.yml`): Validação automática em push/PR
- **Deploy** (`deploy.yml`): Build e deploy automático em tags

### Flags no CI

- `|| true` - Não falha o pipeline se comando falhar
- `--non-interactive` - Sem interação
- `--no-wait` - Não espera builds completarem

## 📊 Resumo

| Comando           | Descrição        | Skip Permissions |
| ----------------- | ---------------- | ---------------- |
| `review-changes`  | Revisa mudanças  | ✅               |
| `fix:all`         | Corrige tudo     | ✅               |
| `validate:auto`   | Valida tudo      | ✅               |
| `build:all`       | Build mobile     | ✅               |
| `build:functions` | Deploy functions | ✅               |
| `build:full`      | Build completo   | ✅               |
| `auto:all`        | Executa tudo     | ✅               |
| `auto:full`       | Tudo + build     | ✅               |

## 📦 Git Keep All Auto

```bash
# Adicionar todas as mudanças (sem confirmação)
npm run git:keep-all

# Com commit automático
AUTO_COMMIT=true npm run git:keep-all "mensagem"

# Com commit + push automático
AUTO_COMMIT=true AUTO_PUSH=true npm run git:keep-all "mensagem"

# Resolver conflitos
npm run git:keep-ours    # Mantém nossas mudanças
npm run git:keep-theirs  # Mantém mudanças deles
```

Ver `GIT_KEEP_ALL_AUTO.md` para detalhes completos.

## 🎉 Pronto!

Agora você pode executar tudo automaticamente sem pedir permissão:

```bash
npm run auto:full
```

---

**Criado em:** 04/11/2025  
**Versão:** 1.0
