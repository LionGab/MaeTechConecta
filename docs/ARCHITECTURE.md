# Arquitetura - Nossa Maternidade (1-página)

## Visão Geral

Sistema mobile-first (React Native/Expo) com backend Supabase, IA completa (NAT-AI) e múltiplas camadas de segurança.

## Stack Tecnológico

- **Frontend**: React Native 0.74.5 + Expo SDK 52 + TypeScript
- **Backend**: Supabase (PostgreSQL + RLS + Edge Functions)
- **IA**: Anthropic Claude (Risk Analysis) + Google Gemini 2.0 Flash (Chat)
- **State**: Zustand
- **Testes**: Vitest (unit) + Maestro/Detox (E2E)
- **CI/CD**: GitHub Actions
- **Deploy**: Expo EAS Build

## Arquitetura

```
┌─────────────────┐
│  Mobile App     │ ← React Native + Expo
│  (src/)         │
└────────┬────────┘
         │
         ├──→ Supabase (Auth + DB + Edge Functions)
         ├──→ Claude API (Risk Analysis)
         └──→ Gemini API (Chat + Moderation)
```

## Componentes Principais

### 1. Mobile App (`src/`)

- **Screens**: Onboarding, Home, Chat, Habits, Content, Profile
- **Navigation**: React Navigation 6.x
- **State**: Zustand
- **Design System**: Bubblegum Theme
- **IA**: `src/lib/nat-ai/` (guardrails, risk-analyzer, context-manager)

### 2. Backend (`supabase/functions/`)

- **Edge Functions**: nathia-chat, moderation-service, risk-classifier, etc.
- **Database**: PostgreSQL com RLS
- **Migrations**: Versionamento de schema

## Fluxo de Dados

1. Usuário envia mensagem → App
2. App chama Edge Function `nathia-chat`
3. Moderation Service verifica conteúdo (3 camadas)
4. Guardrails bloqueia conselhos médicos
5. Risk Analyzer analisa risco emocional
6. Gemini gera resposta empática
7. Resposta salva no Supabase
8. Resposta retornada ao app

## Segurança

- **RLS**: Row Level Security no Supabase
- **Guardrails**: 40+ termos proibidos (conselhos médicos)
- **Risk Detection**: Análise de risco 0-10 com Claude
- **Moderation**: 3 camadas (Safety Settings + Contextual + Flag Queue)
- **Rate Limiting**: 30 req/min por usuário

## CI/CD

- **CI**: Lint, types, tests, coverage (≥70%), npm audit
- **Build**: EAS build Android/iOS
- **Deploy**: Tag v*.*.\* → EAS submit + Edge Functions
- **Observability**: Sentry releases automáticas
