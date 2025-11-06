# 🎯 LionNath - Sistema de Rastreamento Multi-Projeto

Sistema de rastreamento e análise que identifica o melhor de cada projeto para facilitar migração, reutilização e consolidação de features no contexto de um app React Native 0.74.5 + Expo.

## 🚀 Quick Start

### Instalação

```bash
npm install
```

### Executar Análise

```bash
npm run track
```

## 📊 Projetos Analisados

1. **v0-nossa-maternidade-app** (Next.js 16)
   - Sistema multi-IA, gamificação, scripts de automação

2. **v0-nossa-maternidade-app-drizzle** (Drizzle ORM)
   - Schema type-safe, migrations automatizadas

3. **NathaliaValente** (Vite + PWA)
   - Sistema de grupos/comunidade, chat avançado, design system

## 📁 Estrutura

```
LionNath/
├── tracker/
│   ├── index.ts                    # Sistema principal
│   ├── analyzers/                  # Analisadores
│   │   ├── project-analyzer.ts
│   │   ├── feature-detector.ts
│   │   ├── dependency-tracker.ts
│   │   └── config-comparator.ts
│   ├── reports/                    # Geradores de relatórios
│   │   ├── markdown-generator.ts
│   │   ├── feature-report.ts
│   │   └── dependency-report.ts
│   └── utils/                      # Utilitários
│       ├── file-scanner.ts
│       └── path-resolver.ts
├── data/                           # Dados estruturados (JSON)
│   ├── projects.json
│   ├── features.json
│   └── dependencies.json
└── reports/                        # Relatórios gerados (Markdown)
    ├── analysis-report.md
    ├── features-report.md
    └── recommendations.md
```

## 🎯 Foco: React Native + Expo

O sistema está configurado para identificar features compatíveis com React Native e sugerir adaptações necessárias.

### Features Prioritárias

1. **Sistema de Chat com IA (NathIA/Gemini)**
   - Focar apenas em Gemini (não multi-IA)
   - Usar `@google/generative-ai`
   - Memória vetorial (já documentado)

2. **Sistema de Grupos/Comunidade**
   - Adaptar componentes de grupos
   - Migrar serviços de posts/comentários

3. **Gamificação**
   - Sistema de pontos e badges
   - Conquistas e atividades

4. **Design System**
   - Adaptar tokens de design
   - Converter para NativeWind

## 📝 Relatórios Gerados

Após executar `npm run track`, os seguintes relatórios são gerados:

- `reports/analysis-report.md` - Análise completa
- `reports/features-report.md` - Features identificadas
- `reports/dependencies-report.md` - Dependências rastreadas
- `reports/recommendations.md` - Recomendações para React Native

## 🔧 Scripts

- `npm run track` - Executa análise completa
- `npm run track:dev` - Executa em modo watch
- `npm run build` - Compila TypeScript
- `npm run type-check` - Verifica tipos

## 📦 Dependências

- `chalk` - Cores no terminal
- `ora` - Spinners
- `table` - Tabelas formatadas
- `tsx` - Executor TypeScript

## 🎯 Resultado Esperado

O sistema gera relatórios detalhados identificando:

- Features únicas de cada projeto
- Componentes reutilizáveis
- Serviços e utilities
- Dependências compatíveis com React Native
- Recomendações de migração
- Melhores práticas
