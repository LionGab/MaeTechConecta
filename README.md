# 👶 Nossa Maternidade

> **Assistente virtual personalizada 24/7 para gravidez e maternidade**

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51-black)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

### 🇧🇷 Versão em Português | [🌎 Read in English](README_GITHUB.md)

App mobile completo de assistente virtual de maternidade para iOS e Android, desenvolvido com React Native + Expo.

---

> ⚠️ **Nota**: Este é o README técnico. Para a versão completa com badges e documentação GitHub, veja [README_GITHUB.md](README_GITHUB.md).

## 🎯 Sobre o App

O **Nossa Maternidade** é uma assistente virtual personalizada 24/7 para gestantes e mães no Brasil, com foco em classes C-D. Tudo 100% automatizado por IA, sem necessidade de intervenção humana.

### Funcionalidades Principais

- 🤖 **Chat Conversacional**: IA empática inspirada em influenciadora brasileira, usando Claude 3.5 Sonnet
- 📅 **Plano Diário Personalizado**: Gerado automaticamente por GPT-4 com prioridades, dicas e receitas
- 🎨 **Gerador de Conteúdo**: Vídeos com avatar (HeyGen), imagens (DALL-E 3), voz clonada (ElevenLabs)
- 📊 **Automação de Rotina**: Calendário inteligente, contadores automáticos, alertas proativos
- 🚨 **Modo Urgência**: Detecta keywords e ativa protocolos de emergência
- 💳 **Freemium**: Grátis com 10 interações/dia, Premium ilimitado por R$14,90/mês

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 16+
- Expo CLI
- Conta no Supabase
- APIs: Claude, OpenAI, ElevenLabs, HeyGen

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o app
npx expo start
```

### Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure as tabelas SQL (ver `supabase-setup.sql`)
3. Adicione as chaves no arquivo `src/services/supabase.ts`

## 📁 Estrutura do Projeto

```
nossa-maternidade/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   │   ├── Logo.tsx
│   │   └── WelcomeHeader.tsx
│   ├── screens/        # Telas do app
│   │   ├── OnboardingScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── DailyPlanScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/       # Serviços e APIs
│   │   ├── supabase.ts
│   │   ├── ai.ts
│   │   ├── contentGenerator.ts
│   │   └── payments.ts
│   ├── hooks/          # Custom hooks
│   │   ├── useUserProfile.ts
│   │   └── useDailyInteractions.ts
│   ├── utils/          # Funções auxiliares
│   │   └── helpers.ts
│   └── config/         # Configurações
│       └── api.ts
├── .github/            # GitHub workflows e templates
│   ├── workflows/
│   └── ISSUE_TEMPLATE/
├── App.tsx             # Entrada principal
├── package.json
├── README.md
├── SETUP.md
├── FEATURES.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── CHANGELOG.md
└── SECURITY.md
```

## 🛠️ Stack Técnico

- **Frontend**: React Native + Expo
- **Backend**: Supabase (Auth, Database, Storage)
- **IA**: Claude API, OpenAI GPT-4, DALL-E 3
- **Voz/Vídeo**: ElevenLabs, HeyGen
- **Chat**: react-native-gifted-chat
- **Pagamentos**: Stripe
- **Notificações**: OneSignal

## 🔒 Segurança e Compliance

- Disclaimer médico em todas as respostas
- Nenhum diagnóstico - sempre encaminhamento médico
- Temperatura baixa (0.4) para evitar alucinações
- Validação dupla de respostas
- LGPD compliant
- Logs auditáveis

## 💰 Modelo de Monetização

- **Free**: 10 interações/dia, anúncios leves
- **Premium**: Ilimitado, voz/avatar personalizados, zero ads (R$14,90/mês)
- **Família**: 4 perfis (R$24,90/mês)

## 🤝 Contribuindo

Quer contribuir? Leia o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes do nosso código de conduta e instruções de como enviar pull requests.

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🔒 Segurança

Reporte vulnerabilidades em [SECURITY.md](SECURITY.md).

## 📱 Próximos Passos

- [ ] Adicionar assets visuais (ícones e splash screen) - Ver `ASSETS_INSTRUCTIONS.md`
- [ ] Integração completa com ElevenLabs e HeyGen
- [ ] Adicionar marketplace curativo
- [ ] Implementar relatórios mensais gerados por IA
- [ ] Integração IoT básica
- [ ] Modo offline robusto
- [ ] Beta testing com 50k usuários

## 📄 Licença

MIT

## 👥 Contato

Desenvolvido com 💕 para mães e gestantes no Brasil

