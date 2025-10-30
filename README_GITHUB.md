# 👶 Nossa Maternidade - Assistente Virtual de Maternidade

<div align="center">

![Nossa Maternidade](https://img.shields.io/badge/Nossa%20Maternidade-Assistente%20Virtual-pink?style=for-the-badge)
![React Native](https://img.shields.io/badge/React%20Native-0.74-blue?style=for-the-badge)
![Expo](https://img.shields.io/badge/Expo-51-black?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue?style=for-the-badge)

**Sua assistente virtual personalizada 24/7 para gravidez e maternidade** 💕

[Demo](#-demonstração) • [Instalação](#-instalação-rápida) • [Documentação](#-documentação) • [Contribuir](#-contribuindo)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📱 Sobre o Projeto

O **Nossa Maternidade** é um aplicativo mobile completo desenvolvido para gestantes e mães brasileiras, com foco em classes C-D. Totalmente automatizado por IA, oferece suporte empático e acessível 24 horas por dia, sem necessidade de intervenção humana.

### ✨ Destaques

- 🤖 **IA Empática**: Chat conversacional inspirado em influenciadora brasileira jovem
- 📅 **Plano Diário Personalizado**: Gerado automaticamente com prioridades, dicas e receitas
- 🎨 **Gerador de Conteúdo**: Vídeos com avatar, imagens e listas sob demanda
- 🚨 **Modo Urgência**: Detecta keywords e ativa protocolos de emergência
- 💰 **Freemium**: 10 interações gratuitas/dia, Premium ilimitado por R$14,90/mês
- 🇧🇷 **100% Brasileiro**: Desenvolvido com foco no público brasileiro

---

## 🎯 Funcionalidades Principais

### 💬 Chat Conversacional
- Interface estilo WhatsApp
- Respostas em tempo real com Claude 3.5 Sonnet
- Histórico completo de conversas
- Disclaimer médico em todas as respostas
- Protocolo de emergência para situações críticas

### 📅 Plano Diário
- Geração automática via GPT-4
- Prioridades personalizadas por dia
- Dica do dia empática
- Receita econômica e saudável

### 🎨 Gerador de Conteúdo
- **Vídeos**: Avatar personalizado via HeyGen
- **Imagens**: DALL-E 3 para ilustrações
- **Listas**: Enxoval, exercícios, dicas
- Geração em menos de 30 segundos

### 📊 Automação de Rotina
- Contadores automáticos
- Calendário inteligente
- Alertas proativos
- Integração com apps de saúde

### 🚨 Modo Urgência
- Detecção automática de keywords críticas
- Alertas imediatos
- Instruções para SAMU 192
- Mapa para hospitais próximos

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React Native** 0.74
- **Expo** 51
- **TypeScript** 5.1
- **React Navigation** 6
- **Gifted Chat** 2.4

### Backend & IA
- **Supabase** - Banco de dados e autenticação
- **Claude API** 3.5 Sonnet - Chat conversacional
- **OpenAI** GPT-4 & DALL-E 3 - Conteúdo e imagens
- **ElevenLabs** - Clonagem de voz
- **HeyGen** - Vídeos com avatar

### Integrações
- **Stripe** - Pagamentos
- **OneSignal** - Push notifications
- **Google Maps API** - Localização

---

## 📸 Demonstração

### Tela Inicial
```
┌─────────────────────────────┐
│   👶 Nossa Maternidade      │
│   Olá, Maria! 👋            │
│   Semana 28 de gestação 💕  │
│                             │
│  [💬 Conversar] [📅 Plano]  │
│  [📊 Progresso] [⚙️ Perfil] │
└─────────────────────────────┘
```

### Chat Conversacional
```
┌─────────────────────────────┐
│ 👩‍⚕️ Assistente               │
│ Como posso te ajudar? 💕    │
│                             │
│          Como aliviar enjoo?│
│                    👤 Usuário│
│                             │
│ 👩‍⚕️ Assistente               │
│ Tente comer biscoito água   │
│ e sal e beber chá! 💕       │
└─────────────────────────────┘
```

---

## 🚀 Instalação Rápida

### Pré-requisitos

- Node.js 16+ instalado
- Expo CLI (`npm install -g expo-cli`)
- Conta no [Supabase](https://supabase.com)
- APIs: Claude, OpenAI, ElevenLabs, HeyGen

### Passo 1: Clone o Repositório

```bash
git clone https://github.com/seu-usuario/nossa-maternidade.git
cd nossa-maternidade
```

### Passo 2: Instale as Dependências

```bash
npm install
```

### Passo 3: Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL em `supabase-setup.sql`
3. Configure as chaves em `src/services/supabase.ts`

### Passo 4: Configure as APIs

Edite `src/config/api.ts` com suas chaves:

```typescript
export const API_CONFIG = {
  CLAUDE_API_KEY: 'sua-chave-claude',
  OPENAI_API_KEY: 'sua-chave-openai',
  // ...
};
```

### Passo 5: Inicie o App

```bash
# Desenvolvimento
npx expo start

# iOS
npx expo start --ios

# Android
npx expo start --android
```

---

## 📁 Estrutura do Projeto

```
nossa-maternidade/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Logo.tsx
│   │   └── WelcomeHeader.tsx
│   ├── config/              # Configurações
│   │   └── api.ts
│   ├── hooks/               # Custom hooks
│   │   ├── useUserProfile.ts
│   │   └── useDailyInteractions.ts
│   ├── screens/             # Telas do app
│   │   ├── OnboardingScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── DailyPlanScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/            # Serviços e APIs
│   │   ├── ai.ts
│   │   ├── supabase.ts
│   │   ├── contentGenerator.ts
│   │   └── payments.ts
│   └── utils/               # Funções auxiliares
│       └── helpers.ts
├── assets/                  # Imagens e ícones
├── App.tsx                  # Entry point
├── package.json
└── README.md
```

---

## 🔧 Configuração Detalhada

### Supabase

```sql
-- Tabela de usuários
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('gestante', 'mae', 'tentante')),
  pregnancy_week INTEGER,
  subscription_tier TEXT DEFAULT 'free'
);

-- Tabela de mensagens
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de planos diários
CREATE TABLE daily_plans (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  date DATE NOT NULL,
  priorities TEXT[],
  tip TEXT,
  recipe TEXT
);
```

### Variáveis de Ambiente

Crie um arquivo `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
EXPO_PUBLIC_CLAUDE_API_KEY=sua-chave-claude
EXPO_PUBLIC_OPENAI_API_KEY=sua-chave-openai
```

---

## 🎨 Design & UX

### Paleta de Cores

```css
/* Cores principais */
--rosa-vibrante: #E91E63
--rosa-suave: #FFE5F1
--rosa-medio: #FFB6D4
--azul-suave: #87CEEB

/* Cores neutras */
--branco: #FFFFFF
--cinza: #666666
--vermelho-emergencia: #e74c3c
```

### Principios de Design

- **Empático**: Tons quentes e acolhedores
- **Acessível**: Linguagem simples e direta
- **Inclusivo**: Cores suaves e alto contraste
- **Moderno**: Design limpo e minimalista

---

## 🔒 Segurança & Compliance

### Medidas Implementadas

- ✅ Disclaimer médico em todas as respostas
- ✅ Nenhum diagnóstico - sempre encaminhamento médico
- ✅ Temperatura baixa (0.4) para evitar alucinações
- ✅ Validação dupla de respostas
- ✅ Row Level Security (RLS) no Supabase
- ✅ Logs auditáveis
- ✅ LGPD compliant

### Protocolo de Emergência

Quando detecta keywords críticas (sangramento, dor forte, etc.):

1. Alerta imediato ao usuário
2. Instruções para SAMU 192
3. Mapa para hospital mais próximo
4. Mensagens calmantes

---

## 💰 Modelo de Monetização

### Plano Free 🆓
- 10 interações por dia
- Chat com IA
- Plano diário básico
- Acesso a FAQ

### Plano Premium ⭐
- **R$ 14,90/mês**
- Interações ilimitadas
- Voz e avatar personalizados
- Zero anúncios
- Conteúdo exclusivo
- Prioridade no suporte

### Plano Família 👨‍👩‍👧‍👦
- **R$ 24,90/mês**
- 4 perfis
- Todos os benefícios Premium
- Ideal para toda família

---

## 📊 Métricas & Performance

### Status Atual
- ✅ MVP Funcional
- ✅ 70% do escopo completo
- ⚠️ Beta testing pendente
- 📈 Objetivo: 50k usuários

### Custos Estimados (50k usuários)

| Recurso | Custo Mensal |
|---------|-------------|
| Supabase | R$ 125 |
| Claude API | R$ 7,500 |
| OpenAI | R$ 15,000 |
| ElevenLabs | R$ 2,500 |
| HeyGen | R$ 2,500 |
| Outros | R$ 500 |
| **Total** | **R$ 28,125** |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! 

### Como Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Issues

Encontrou um bug ou tem uma sugestão? 
- 📝 [Abra uma issue](https://github.com/seu-usuario/nossa-maternidade/issues)
- 💡 Sugira melhorias
- 🐛 Reporte bugs

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

Desenvolvido com 💕 para mães e gestantes no Brasil

- **Desenvolvedor Principal**: [Seu Nome](https://github.com/seu-usuario)
- **Design**: Nathália Valenete (inspiração)
- **IA**: Claude, GPT-4, DALL-E 3

---

## 📞 Contato & Suporte

- 📧 Email: contato@nossa-maternidade.com
- 🌐 Website: [nossa-maternidade.com](https://nossa-maternidade.com)
- 📱 App Store: [Em breve]
- 🤖 Play Store: [Em breve]

---

## 🙏 Agradecimentos

- Suporte técnico da comunidade Expo
- APIs de IA da Anthropic e OpenAI
- Banco de dados Supabase
- Inspiração de influenciadoras brasileiras

---

<div align="center">

**Feito com 💕 para mães e gestantes no Brasil**

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!

</div>

