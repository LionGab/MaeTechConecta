# Estrutura Consolidada - Nossa Maternidade

## 📁 Árvore de Pastas

```
nossa-maternidade/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint, typecheck, tests, coverage
│       ├── build.yml            # EAS build Android/iOS
│       └── deploy.yml           # Deploy automático
├── src/                         # Código React Native consolidado
│   ├── lib/
│   │   └── nat-ai/             # Engine de IA centralizada
│   │       ├── system-prompt.ts
│   │       ├── guardrails.ts
│   │       ├── risk-analyzer.ts
│   │       ├── context-manager.ts
│   │       └── team-notifier.ts
│   ├── components/              # Componentes reutilizáveis
│   ├── screens/                 # Telas da aplicação
│   ├── services/                 # Serviços (Supabase, AI, etc)
│   ├── hooks/                   # Custom hooks
│   ├── navigation/               # Navegação
│   ├── theme/                   # Design System Bubblegum
│   └── utils/                   # Utilitários
├── supabase/
│   └── functions/                # Edge Functions completas
│       ├── nathia-chat/
│       ├── moderation-service/
│       ├── risk-classifier/
│       ├── behavior-analysis/
│       ├── lgpd-requests/
│       └── transcribe-audio/
├── __tests__/                    # Testes unitários
│   ├── services/
│   ├── lib/
│   │   └── nat-ai/
│   └── components/
├── e2e/                          # Testes E2E
│   ├── maestro/                  # Maestro flows
│   └── detox/                    # Detox specs (opcional)
├── docs/                         # Documentação consolidada
│   ├── DOCUMENTATION.md          # Índice único
│   ├── DEPLOY_PRODUCTION.md      # Deploy e release train
│   ├── ARCHITECTURE.md           # Arquitetura 1-página
│   └── ENVIRONMENTS.md           # Ambientes e segredos
├── scripts/                      # Scripts auxiliares
│   ├── check-coverage.js
│   └── validate-local.js
├── .env.example                  # Variáveis unificadas
├── package.json                  # Dependências e scripts
├── app.json                      # Config Expo
├── tsconfig.json                 # TypeScript config
├── vitest.config.ts              # Vitest config
├── babel.config.js               # Babel config
├── eas.json                      # EAS Build config
└── README.md                      # Doc principal
```
