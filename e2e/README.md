# 🧪 E2E Testing - Nossa Maternidade

## 📋 Ferramentas

- **Maestro**: E2E testing para mobile (simples e rápido)
- **Detox**: Alternativa (mais complexa, não recomendada)

## 🚀 Quick Start

### Instalar Maestro

```bash
# macOS/Linux
curl -Ls "https://get.maestro.mobile.dev" | bash

# Windows (via WSL ou Chocolatey)
choco install maestro
```

### Executar Testes

```bash
# Smoke test
pnpm e2e

# Ou diretamente
maestro test e2e/maestro/smoke-flow.yaml
```

## 📁 Estrutura

```
e2e/
├── maestro/
│   ├── smoke-flow.yaml      # Smoke test básico
│   └── full-flow.yaml       # Fluxo completo (futuro)
└── artifacts/               # Logs e screenshots (CI)
```

## 🎯 Testes Disponíveis

### Smoke Flow (`smoke-flow.yaml`)

Teste básico de funcionalidade:

1. ✅ App abre
2. ✅ Tela de login visível
3. ✅ Login funcionando
4. ✅ Dashboard visível

### Full Flow (futuro)

Teste completo:

1. Login
2. Dashboard
3. Chat
4. Plano Diário
5. Perfil

## 🔧 CI/CD

Os testes E2E rodam automaticamente em PRs via `.github/workflows/e2e-android.yml`.

### Artefatos

Em caso de falha, logs e screenshots são salvos em `e2e/artifacts/`.

## 📚 Referências

- [Maestro Docs](https://maestro.mobile.dev/)
- [Maestro Examples](https://github.com/mobile-dev-inc/maestro)

