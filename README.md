# 🤰 Nossa Maternidade

> Aplicativo mobile para mães, gestantes e tentantes brasileiras da classe C-D

## 📋 Sobre o Projeto

**Nossa Maternidade** é um aplicativo React Native (Expo) desenvolvido para apoiar mães, gestantes e tentantes brasileiras durante toda a jornada da maternidade. O app oferece uma assistente virtual inteligente (NathIA) treinada especificamente para questões de maternidade, com suporte a conversas naturais, planos diários personalizados e conteúdo exclusivo.

### 🎯 Objetivos

- Apoiar mães brasileiras da classe C-D com informações acessíveis e confiáveis
- Oferecer uma assistente virtual empática e bem treinada em questões de maternidade
- Fornecer conteúdo personalizado baseado no perfil da usuária (gestante, mãe ou tentante)
- Garantir segurança e moderação rigorosa em todas as respostas
- Oferecer experiência de usuário acessível e profissional

## 🚀 Tecnologias Utilizadas

- **React Native** com **Expo** (~51.0.0)
- **TypeScript** para type safety
- **Supabase** para backend (banco de dados, autenticação, edge functions)
- **React Navigation** para navegação
- **Claude AI** (Anthropic) para a assistente virtual principal
- **OpenAI GPT-4** para validação e geração de conteúdo adicional
- **Google Gemini** para funções avançadas no Supabase
- **AsyncStorage** para armazenamento local
- **React Native Gifted Chat** para interface de chat
- **Stripe** para pagamentos (assinatura premium)

## 📁 Estrutura do Projeto

```
.
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── chat/           # Componentes específicos de chat
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Logo.tsx
│   ├── config/             # Configurações de API
│   │   └── api.ts
│   ├── hooks/               # Custom hooks
│   │   ├── useChatOptimized.ts
│   │   ├── useDailyInteractions.ts
│   │   └── useUserProfile.ts
│   ├── screens/             # Telas da aplicação
│   │   ├── ChatScreen.tsx
│   │   ├── DailyPlanScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/            # Serviços e integrações
│   │   ├── ai.ts            # Integração com APIs de IA
│   │   ├── auth.ts          # Autenticação Supabase
│   │   ├── contentGenerator.ts
│   │   ├── notifications.ts
│   │   ├── payments.ts
│   │   └── supabase.ts      # Cliente Supabase
│   ├── theme/               # Design System Bubblegum
│   │   ├── colors.ts
│   │   └── index.ts
│   └── utils/               # Utilitários
│       ├── helpers.ts
│       ├── logger.ts
│       ├── offlineStorage.ts
│       └── retry.ts
├── supabase/
│   └── functions/           # Edge Functions do Supabase
│       ├── behavior-analysis/
│       ├── lgpd-requests/
│       ├── moderation-service/
│       ├── nathia-chat/
│       ├── risk-classifier/
│       └── transcribe-audio/
├── App.tsx                  # Entry point da aplicação
├── package.json
├── tsconfig.json
└── app.json                 # Configuração Expo
```

## 🛠️ Configuração e Instalação

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta no Supabase (gratuita)
- Chaves de API:
  - Claude API (Anthropic) - **Obrigatória**
  - Google Gemini API - **Obrigatória** (para funções Supabase)
  - OpenAI API - Opcional (para validação e imagens)

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd Correto
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**

   Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Edite `.env.local` e preencha as variáveis obrigatórias:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
   EXPO_PUBLIC_CLAUDE_API_KEY=sua_chave_claude
   EXPO_PUBLIC_GEMINI_API_KEY=sua_chave_gemini
   ```

4. **Configure o banco de dados Supabase**

   Execute o script SQL no Supabase Dashboard (SQL Editor):
   - `supabase-setup.sql` - Criação das tabelas principais
   - `SCHEMA_COMPLETO_FINAL.sql` - Schema completo do banco

5. **Configure as Edge Functions do Supabase**

   Faça deploy das funções em `supabase/functions/`:
   ```bash
   supabase functions deploy nathia-chat
   supabase functions deploy moderation-service
   supabase functions deploy risk-classifier
   # ... etc
   ```

6. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   # ou
   expo start
   ```

## 🎨 Design System

O projeto utiliza o **Bubblegum Design System**, um sistema de design criado especificamente para este app, com:

- **Cores**: Paleta suave e acolhedora (rosa, azul, tons pastéis)
- **Tipografia**: Fontes acessíveis e legíveis
- **Componentes**: Biblioteca consistente de componentes reutilizáveis
- **Espaçamento**: Sistema de spacing padronizado

Todos os componentes devem usar as variáveis do tema em `src/theme/colors.ts`.

## 🧩 Funcionalidades Principais

### 1. **Onboarding**
- Coleta informações do perfil da usuária
- Tipo: gestante, mãe ou tentante
- Semana de gravidez (se gestante)
- Nome do bebê
- Preferências de conteúdo

### 2. **Chat com Assistente Virtual (NathIA)**
- Conversas naturais em português brasileiro
- Linguagem empática e casual
- Detecção de urgência (alertas para emergências)
- Histórico de conversas persistido
- Moderação rigorosa de conteúdo
- Suporte offline (mensagens salvas localmente)

### 3. **Plano Diário Personalizado**
- Prioridades do dia
- Dica do dia
- Receita saudável
- Conteúdo adaptado ao perfil da usuária

### 4. **Perfil do Usuário**
- Visualização e edição de informações
- Histórico de interações
- Gerenciamento de assinatura (free/premium)

### 5. **Notificações Push**
- Lembretes personalizados
- Dicas diárias
- Avisos importantes

## 🔒 Segurança e Privacidade

- **LGPD Compliance**: Funções para exportação e exclusão de dados
- **Moderação**: Validação rigorosa de todas as respostas da IA
- **Detecção de Risco**: Classificação automática de mensagens urgentes
- **Análise de Comportamento**: Monitoramento para melhorar respostas
- **Autenticação Segura**: Supabase Auth com múltiplos métodos

## 📱 Executando a Aplicação

### Desenvolvimento
```bash
npm start
```

### iOS Simulator
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Web (para testes)
```bash
npm run web
```

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm test
```

## 📦 Build para Produção

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença especificada no arquivo `LICENSE`.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Consulte a documentação em `docs/`

## 🗺️ Roadmap

- [ ] Implementação completa de pagamentos premium
- [ ] Integração com serviços de áudio/vídeo
- [ ] Expansão do conteúdo personalizado
- [ ] Análise avançada de comportamento
- [ ] Suporte multilíngue
- [ ] Modo offline completo

## 🙏 Agradecimentos

Projeto desenvolvido com foco em mães brasileiras, oferecendo suporte acessível e confiável durante toda a jornada da maternidade.

---

**Desenvolvido com 💕 para mães brasileiras**
