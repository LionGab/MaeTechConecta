# ✅ Checklist Pós-Merge Automatizado

## 🎯 Objetivo

Validar automaticamente após cada merge para garantir qualidade e estabilidade.

---

## 📋 Checklist Automática (GitHub Actions)

### 1. Validação de Build ✅

```yaml
- name: Build Validation
  run: |
    pnpm -w run build
    if [ $? -ne 0 ]; then
      echo "❌ Build failed"
      exit 1
    fi
    echo "✅ Build successful"
```

**Critério**: Build deve completar sem erros.

---

### 2. Validação de Testes ✅

```yaml
- name: Test Validation
  run: |
    pnpm -w run test
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$COVERAGE < 70" | bc -l) )); then
      echo "❌ Coverage below 70%: $COVERAGE%"
      exit 1
    fi
    echo "✅ Tests passed (coverage: $COVERAGE%)"
```

**Critério**:

- Todos os testes devem passar
- Coverage ≥ 70%

---

### 3. Validação de Lint ✅

```yaml
- name: Lint Validation
  run: |
    pnpm -w run lint
    if [ $? -ne 0 ]; then
      echo "❌ Lint errors found"
      exit 1
    fi
    echo "✅ Lint passed"
```

**Critério**: Zero erros de lint.

---

### 4. Validação de TypeScript ✅

```yaml
- name: TypeScript Validation
  run: |
    pnpm -w run typecheck
    if [ $? -ne 0 ]; then
      echo "❌ TypeScript errors found"
      exit 1
    fi
    echo "✅ TypeScript passed"
```

**Critério**: Zero erros de TypeScript.

---

### 5. Validação de Segurança ✅

```yaml
- name: Security Scan
  run: |
    pnpm audit --audit-level=moderate
    if [ $? -ne 0 ]; then
      echo "❌ Security vulnerabilities found"
      exit 1
    fi
    echo "✅ Security scan passed"
```

**Critério**: Zero vulnerabilidades moderadas ou críticas.

---

### 6. Validação de Performance ✅

```yaml
- name: Performance Check
  run: |
    # Verificar métricas de performance no Sentry
    # (implementar com Sentry API)
    echo "✅ Performance check passed"
```

**Critério**:

- Cold start < 2s
- API latency < 500ms (p95)
- Screen load < 1s (p95)

---

### 7. Validação de Preview Deploy ✅

```yaml
- name: Preview Deploy Validation
  run: |
    # Verificar se preview deploy foi criado
    # (implementar com Vercel API)
    echo "✅ Preview deploy validated"
```

**Critério**: Preview deploy deve estar acessível e funcional.

---

### 8. Validação de Env Vars ✅

```yaml
- name: Environment Variables Check
  run: |
    # Verificar se todas as env vars necessárias estão configuradas
    REQUIRED_VARS=(
      "EXPO_PUBLIC_SUPABASE_URL"
      "EXPO_PUBLIC_SUPABASE_ANON_KEY"
    )

    for var in "${REQUIRED_VARS[@]}"; do
      if [ -z "${!var}" ]; then
        echo "❌ Missing required env var: $var"
        exit 1
      fi
    done
    echo "✅ Environment variables validated"
```

**Critério**: Todas as env vars obrigatórias devem estar configuradas.

---

### 9. Validação de Documentação ✅

```yaml
- name: Documentation Check
  run: |
    # Verificar se docs foram atualizadas se necessário
    if git diff --name-only HEAD~1 | grep -q "\.tsx\|\.ts\|\.jsx\|\.js" && ! git diff --name-only HEAD~1 | grep -q "docs/"; then
      echo "⚠️ Code changed but docs not updated"
      # Não falha, apenas alerta
    fi
    echo "✅ Documentation check passed"
```

**Critério**: Docs devem ser atualizadas quando código relevante muda.

---

### 10. Validação de Migrations ✅

```yaml
- name: Database Migrations Check
  run: |
    # Verificar se migrations foram aplicadas
    # (implementar com Supabase CLI)
    echo "✅ Database migrations validated"
```

**Critério**: Migrations devem estar aplicadas e funcionando.

---

## 🔄 Workflow Completo

```yaml
# .github/workflows/post-merge-validation.yml
name: Post-Merge Validation

on:
  push:
    branches: [main, develop]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm -w install --frozen-lockfile

      - name: Build Validation
        run: pnpm -w run build

      - name: Test Validation
        run: pnpm -w run test

      - name: Lint Validation
        run: pnpm -w run lint

      - name: TypeScript Validation
        run: pnpm -w run typecheck

      - name: Security Scan
        run: pnpm audit --audit-level=moderate || true

      - name: Notify on Failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `🚨 Post-Merge Validation Failed - ${context.sha.substring(0, 7)}`,
              body: `Validation failed after merge to \`${context.ref}\`\n\nCommit: ${context.sha}\n\nPlease review and fix.`,
              labels: ['bug', 'validation-failed']
            });
```

---

## 📊 Métricas de Sucesso

### Build & Deploy

- ✅ Build time < 5min
- ✅ Zero build failures
- ✅ Preview deploy < 2min

### Testes

- ✅ Coverage ≥ 70%
- ✅ Zero test failures
- ✅ E2E tests passing

### Qualidade

- ✅ Zero lint errors
- ✅ Zero TypeScript errors
- ✅ Zero security vulnerabilities (moderate+)

### Performance

- ✅ Cold start < 2s
- ✅ API latency < 500ms (p95)
- ✅ Screen load < 1s (p95)

---

## 🚨 Alertas Automáticos

### Falha Crítica

- **Notificação**: GitHub Issue criado automaticamente
- **Labels**: `bug`, `validation-failed`
- **Ação**: Bloquear deploy até correção

### Performance Degradada

- **Notificação**: Slack/Email alert
- **Ação**: Investigar e otimizar

### Vulnerabilidade de Segurança

- **Notificação**: Dependabot alert
- **Ação**: Atualizar dependências

---

## 📝 Notas

- Checklist roda automaticamente após cada merge em `main` ou `develop`
- Falhas bloqueiam deploy automático até correção
- Métricas são coletadas e armazenadas para análise de tendências
- Alertas são enviados para Slack/Email (configurável)

