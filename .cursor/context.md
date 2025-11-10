# 📚 Contexto do Projeto - Nossa Maternidade

## 🎯 Visão Geral

App React Native para mães/gestantes brasileiras classe C-D. Foco 100% mobile (iOS/Android).

## ✅ Estado Atual (50% completo)

### Concluído

- ✅ Design System Bubblegum
- ✅ 4 componentes: Button, Card, Input, Badge
- ✅ 5 telas: Onboarding, Home, Chat, DailyPlan, Profile
- ✅ 5 bottom tabs navegação
- ✅ Gemini 1.5 Pro + Memória Vetorial
- ✅ Moderação 3 camadas integrada

### Foco

- ✅ Apenas o básico bem feito
- ✅ Sem complicações desnecessárias

## 🛠️ Stack

- React Native 0.74.5 + Expo 51
- TypeScript strict
- Supabase (backend)
- Gemini 1.5 Pro (1M tokens)
- Memória Vetorial (30 dias)

## 📁 Estrutura

```
src/
├── components/    # Button, Card, Input, Badge
├── screens/       # Onboarding, Home, Chat, DailyPlan, Profile
├── services/      # ai, supabase, auth
├── hooks/         # useChatOptimized, useUserProfile
├── navigation/    # TabNavigator, AppNavigator
└── theme/         # colors.ts (Bubblegum Design System)

supabase/
├── functions/     # nathia-chat, moderation-service
└── migrations/    # 001_gemini_memory.sql
```

## 🎨 Design System

- Cores: `colors.*` (nunca hardcoded)
- Espaçamento: `spacing.*`
- Tipografia: `typography.*`
- Ícones: MaterialCommunityIcons

## 🔧 Configurações

- Supabase: `bbcwitnbnosyfpjtzkr`
- Gemini API: Configurada
- Moderação: 3 camadas ativa

