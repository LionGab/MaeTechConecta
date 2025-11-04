# Testes E2E

Este diretório contém testes end-to-end para o aplicativo.

## Configuração

### Opção 1: Detox (Recomendado para React Native)

```bash
npm install --save-dev detox
npm install --save-dev jest-circus
```

### Opção 2: Maestro (Alternativa moderna)

```bash
# Instalar Maestro CLI
curl -Ls "https://get.maestro.mobile.dev" | bash
```

## Executar Testes

### Com Detox

```bash
npm run test:e2e:ios
npm run test:e2e:android
```

### Com Maestro

```bash
maestro test e2e/maestro/
```

## Estrutura

```
e2e/
├── detox/
│   ├── config.js
│   └── tests/
├── maestro/
│   └── flows/
└── README.md
```
