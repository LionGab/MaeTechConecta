# MãeTech Conecta (ClubNath)

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-Private-red)

**Plataforma social completa para conectar mães, compartilhar experiências e criar uma comunidade de apoio mútuo.**

[Recursos](#-recursos) • [Tecnologias](#-tecnologias) • [Instalação](#-instalação) • [Configuração](#%EF%B8%8F-configuração) • [Uso](#-uso) • [Deploy](#-deploy)

</div>

---

## 📋 Sobre o Projeto

**MãeTech Conecta** é uma plataforma social moderna e completa desenvolvida especialmente para mães. O aplicativo oferece um ecossistema integrado de recursos que incluem matchmaking social, marketplace local, streaming de conteúdo exclusivo, fórum moderado por IA e muito mais.

### 🎯 Missão

Criar um espaço seguro, acolhedor e tecnologicamente avançado onde mães possam se conectar, compartilhar experiências, encontrar apoio e construir uma rede de suporte significativa.

---

## ✨ Recursos

### 🤝 Social Matching
- **Matchmaking inteligente** baseado em interesses, localização e idade dos bebês
- Limite diário de matches personalizado por tier de assinatura
- Algoritmo de IA para recomendações personalizadas
- Sistema de perfis completo com fotos e informações

### 🛍️ Marketplace Local
- Compra e venda de itens infantis na sua região
- Sistema de categorização avançado
- Filtros por localização, preço e condição
- Acesso hierárquico baseado em assinatura

### 📺 Streaming de Conteúdo
- Lives exclusivas com especialistas e influencers
- Vídeos sob demanda
- Sessões de perguntas e respostas
- Conteúdo premium para membros VIP

### 💬 Fórum Moderado
- Comunidade de apoio entre mães
- Moderação automática por IA para conteúdo inapropriado
- Chatbot inteligente para dúvidas frequentes
- Sistema de tópicos e categorias

### 🔔 Notificações & Alertas
- Push notifications para novos matches
- Alertas de vendas no marketplace
- Lembretes de eventos ao vivo
- Atualizações personalizadas

### 💎 Gestão de Assinaturas
- Integração completa com Stripe
- Múltiplos tiers de assinatura
- Recursos exclusivos por nível
- Gerenciamento automático de renovações

---

## 🚀 Tecnologias

### Core Stack
- **[Next.js 15.3.3](https://nextjs.org/)** - Framework React com SSR e SSG
- **[React 18.3](https://react.dev/)** - Biblioteca para interfaces de usuário
- **[TypeScript 5](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Framework CSS utility-first

### Backend & Autenticação
- **[Firebase 11.9](https://firebase.google.com/)** - BaaS completo
  - Authentication (Google, Apple, Instagram, Email)
  - Firestore Database
  - Cloud Storage
  - Cloud Messaging
  - App Hosting

### Inteligência Artificial
- **[Genkit AI 1.20](https://firebase.google.com/docs/genkit)** - Framework de IA do Google
- **[Google Genai](https://ai.google.dev/)** - Modelos de IA generativa

### UI Components & Design
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis e não estilizados
- **[Lucide React](https://lucide.dev/)** - Ícones modernos
- **[Recharts](https://recharts.org/)** - Gráficos e visualizações
- **[Embla Carousel](https://www.embla-carousel.com/)** - Carrosséis performáticos

### Formulários & Validação
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript

### PWA
- **[Next PWA](https://www.npmjs.com/package/@ducanh2912/next-pwa)** - Suporte a Progressive Web App

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 20.0.0 ([Download](https://nodejs.org/))
- **npm** >= 10.0.0 (incluído com Node.js)
- **Git** ([Download](https://git-scm.com/))
- Conta no **Firebase** ([Criar conta](https://firebase.google.com/))

---

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/LionGab/MaeTechConecta.git
cd MaeTechConecta
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto (use `.env.example` como referência):

```bash
cp .env.example .env.local
```

### 4. Configure o Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative os serviços necessários:
   - **Authentication** (Email/Password, Google, Apple, Instagram)
   - **Firestore Database**
   - **Storage**
   - **Cloud Messaging**
4. Copie as credenciais do projeto
5. Atualize o arquivo `src/firebase/config.ts` com suas credenciais

---

## ⚙️ Configuração

### Firebase Authentication

Ative os seguintes métodos de autenticação no Console do Firebase:

1. **Email/Password**
2. **Google Sign-In**
3. **Apple Sign-In**
4. **Instagram** (OAuth personalizado)

### Firestore Database

As regras de segurança estão definidas em `firestore.rules`. Para aplicá-las:

```bash
firebase deploy --only firestore:rules
```

### Genkit AI

Configure suas chaves de API no arquivo de ambiente:

```env
GOOGLE_GENAI_API_KEY=sua_chave_aqui
```

---

## 🎮 Uso

### Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em: **http://localhost:9002**

### Desenvolvimento com Genkit

Para desenvolver com o Genkit AI:

```bash
npm run genkit:dev
```

Com watch mode (recarrega automaticamente):

```bash
npm run genkit:watch
```

### Build para Produção

Crie um build otimizado:

```bash
npm run build
```

### Iniciar em Produção

Após o build:

```bash
npm start
```

### Verificação de Tipos

Execute a verificação de tipos TypeScript:

```bash
npm run typecheck
```

### Linting

Execute o linter:

```bash
npm run lint
```

---

## 📁 Estrutura do Projeto

```
MaeTechConecta/
├── .git/                      # Controle de versão Git
├── .idx/                      # Configurações IDX
├── docs/                      # Documentação
│   ├── blueprint.md          # Blueprint do projeto
│   └── backend.json          # Configurações backend
├── public/                    # Arquivos estáticos
│   └── manifest.json         # PWA manifest
├── src/                       # Código fonte
│   ├── app/                  # App Router (Next.js 15)
│   │   ├── dashboard/       # Dashboard principal
│   │   │   ├── content/    # Streaming de conteúdo
│   │   │   ├── forum/      # Fórum e chatbot
│   │   │   ├── jornada/    # Jornada do usuário
│   │   │   ├── loja/       # Marketplace
│   │   │   ├── marketplace/ # Marketplace alternativo
│   │   │   ├── matches/    # Sistema de matches
│   │   │   ├── nath-inspira/ # Seção Nath Inspira
│   │   │   └── pricing/    # Planos e preços
│   │   ├── login-email/    # Login com email
│   │   ├── sign-up/        # Cadastro
│   │   ├── sign-up-email/  # Cadastro com email
│   │   ├── layout.tsx      # Layout raiz
│   │   └── page.tsx        # Página inicial
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/            # Componentes UI base
│   │   ├── icons.tsx      # Ícones customizados
│   │   └── FirebaseErrorListener.tsx
│   ├── firebase/            # Configuração Firebase
│   │   ├── firestore/     # Hooks Firestore
│   │   ├── config.ts      # Credenciais
│   │   ├── index.ts       # Exportações
│   │   ├── provider.tsx   # Provider Firebase
│   │   └── ...
│   ├── hooks/               # Custom React Hooks
│   │   └── use-toast.ts
│   └── lib/                 # Utilitários
│       ├── utils.ts
│       └── placeholder-images.ts
├── .gitignore               # Arquivos ignorados pelo Git
├── components.json          # Configuração componentes
├── firestore.rules          # Regras de segurança Firestore
├── next.config.ts           # Configuração Next.js
├── package.json             # Dependências e scripts
├── postcss.config.mjs       # Configuração PostCSS
├── tailwind.config.ts       # Configuração Tailwind
├── tsconfig.json            # Configuração TypeScript
└── README.md                # Este arquivo
```

---

## 🎨 Design System

### Paleta de Cores

- **Primary (Soft Lavender)**: `#E6E6FA` - Aconchegante e gentil
- **Background (Very Light Lavender)**: `#F5F5FF` - Sereno e limpo
- **Accent (Pale Rose)**: `#FFBCCD` - Convidativo e brincalhão

### Tipografia

- **Headlines**: `Playfair` - Serif moderna e elegante
- **Body**: `PT Sans` - Sans-serif humanista e calorosa

### Princípios de Design

- Ícones amigáveis em estilo hand-drawn
- Animações suaves e gentis
- Tema focado em maternidade, bebês e comunidade
- Interface acessível e intuitiva

---

## 🚢 Deploy

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

### Netlify

O projeto já está configurado para deploy no Netlify (`netlify.toml`):

1. Conecte seu repositório no [Netlify](https://netlify.com)
2. O deploy será automático a cada push

### Vercel

```bash
npm run build
vercel --prod
```

---

## 🔐 Segurança

- ✅ Autenticação multi-provider (Google, Apple, Instagram, Email)
- ✅ Regras de segurança Firestore configuradas
- ✅ Variáveis de ambiente para dados sensíveis
- ✅ Validação de formulários com Zod
- ✅ Moderação de conteúdo por IA
- ✅ HTTPS obrigatório em produção

---

## 🧪 Testes

```bash
npm run typecheck
npm run lint
```

---

## 📱 PWA (Progressive Web App)

O aplicativo é uma PWA completa com:

- ✅ Instalável em dispositivos móveis
- ✅ Funciona offline
- ✅ Push notifications
- ✅ Ícones e splash screens otimizados
- ✅ Manifest configurado

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Convenções de Commit

Seguimos as convenções do [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração de código
- `test:` Testes
- `chore:` Tarefas gerais

---

## 📄 Licença

Este projeto é **privado** e proprietário da **MãeTech**.

Todos os direitos reservados © 2025 MãeTech.

---

## 👥 Equipe

Desenvolvido com ❤️ pela equipe **MãeTech**.

---

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.

---

## 🗺️ Roadmap

- [ ] Sistema de pagamentos Stripe completo
- [ ] Notificações push em tempo real
- [ ] Chat em tempo real entre matches
- [ ] Sistema de avaliações e reviews
- [ ] Versão mobile nativa (React Native)
- [ ] Integração com redes sociais
- [ ] Dashboard de analytics
- [ ] Gamificação e conquistas

---

## 📊 Status do Projeto

**Status**: 🟢 Em desenvolvimento ativo

**Versão Atual**: 0.1.0

**Última Atualização**: Outubro 2025

---

<div align="center">

**Feito com** ❤️ **pela** [MãeTech](https://github.com/LionGab/MaeTechConecta)

⭐ **Se este projeto te ajudou, deixe uma estrela!** ⭐

</div>
