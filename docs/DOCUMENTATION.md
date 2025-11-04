# Documentação - Nossa Maternidade

## 📚 Índice Único

### 👋 Para Novos Desenvolvedores

- **[ONBOARDING.md](./ONBOARDING.md)** - Guia completo de onboarding (15 minutos)

### 🏗️ Arquitetura

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Visão 1-página da arquitetura
- **[DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md)** - Deploy e release train
- **[ENVIRONMENTS.md](./ENVIRONMENTS.md)** - Ambientes e segredos

### 📦 Releases

- **[RELEASE_NOTES.md](../RELEASE_NOTES.md)** - Release Notes v1.0.0

### 🚀 Quick Start

1. **Instalar**:

   ```bash
   npm install
   ```

2. **Configurar**:

   ```bash
   cp .env.example .env.local
   # Preencher valores
   ```

3. **Desenvolvimento**:

   ```bash
   npm start
   ```

4. **Testes**:
   ```bash
   npm test
   npm run test:coverage
   ```

### 📦 Estrutura

```
nossa-maternidade/
├─ src/                    # Código React Native
├─ supabase/functions/     # Edge Functions
├─ __tests__/              # Testes unitários
├─ e2e/                    # Testes E2E
└─ docs/                    # Documentação
```

### 🔗 Links Úteis

- [Expo Docs](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Vitest Docs](https://vitest.dev/)
- [Maestro Docs](https://maestro.mobile.dev/)

### 📋 Documentação Adicional

- **[EDGE_FUNCTIONS.md](./EDGE_FUNCTIONS.md)** - Documentação das Edge Functions
- **[INTEGRATION_TESTING.md](./INTEGRATION_TESTING.md)** - Guia de testes de integração
- **[VALIDATION_CHECKLIST.md](./VALIDATION_CHECKLIST.md)** - Checklist de validação
- **[CONSOLIDATION_SUMMARY.md](./CONSOLIDATION_SUMMARY.md)** - Resumo da consolidação
