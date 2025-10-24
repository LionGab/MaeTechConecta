# 🚀 Guia de Deploy no Netlify - MãeTech Conecta

Este guia passo a passo te ajudará a fazer o deploy do **MãeTech Conecta** no Netlify de forma correta e funcional.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ Conta no [Netlify](https://netlify.com)
- ✅ Conta no [Firebase](https://console.firebase.google.com)
- ✅ Projeto Firebase configurado
- ✅ Repositório Git (GitHub, GitLab ou Bitbucket)

---

## 🔧 Passo 1: Configurar o Firebase

### 1.1. Ative os Serviços no Firebase Console

Acesse [Firebase Console](https://console.firebase.google.com/) e configure:

#### **Authentication**
1. Vá em **Authentication** → **Sign-in method**
2. Ative os seguintes provedores:
   - ✅ **Email/Password** (ative e salve)
   - ✅ **Google** (configure OAuth e adicione domínio)
   - ✅ **Apple** (configure OAuth)
   - ✅ **Facebook** (para login com Instagram)

#### **Firestore Database**
1. Vá em **Firestore Database**
2. Clique em **Create database**
3. Escolha o modo de teste ou produção
4. Selecione a localização (ex: southamerica-east1)

#### **Storage**
1. Vá em **Storage**
2. Clique em **Get started**
3. Use as regras padrão (pode ajustar depois)

#### **Cloud Messaging** (Opcional)
1. Vá em **Cloud Messaging**
2. Habilite o serviço para push notifications

### 1.2. Configure Domínios Autorizados

1. Vá em **Authentication** → **Settings** → **Authorized domains**
2. Adicione os domínios que você usará:
   ```
   localhost (já está por padrão)
   seu-app.netlify.app
   seu-dominio-customizado.com (se tiver)
   ```

### 1.3. Obtenha as Credenciais do Firebase

1. Vá em **Project Settings** (⚙️ ícone no canto superior esquerdo)
2. Role até a seção **Your apps**
3. Se não tiver um app web, clique em **Add app** → **Web** (ícone `</>`)
4. Dê um nome (ex: "MãeTech Conecta Web")
5. ✅ Marque "Also set up Firebase Hosting" (opcional)
6. Copie as credenciais que aparecem:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

**⚠️ Importante:** Guarde essas credenciais! Vamos usá-las no próximo passo.

---

## 🌐 Passo 2: Deploy no Netlify

### 2.1. Conectar Repositório

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Clique em **Add new site** → **Import an existing project**
3. Escolha seu provedor Git (GitHub, GitLab, Bitbucket)
4. Autorize o Netlify a acessar seus repositórios
5. Selecione o repositório **MaeTechConecta**

### 2.2. Configurar Build Settings

Na tela de configuração do site:

- **Branch to deploy:** `main` (ou sua branch principal)
- **Build command:** `npm run build`
- **Publish directory:** `.next`

### 2.3. Configurar Variáveis de Ambiente

**⚠️ CRÍTICO:** Antes de fazer o deploy, configure as variáveis de ambiente!

1. No painel do Netlify, vá em **Site configuration** → **Environment variables**
2. Clique em **Add a variable** e adicione **TODAS** as seguintes variáveis:

```bash
# Firebase Configuration (OBRIGATÓRIO)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Application Settings
NEXT_PUBLIC_APP_URL=https://seu-app.netlify.app
NODE_ENV=production

# Opcional: Google Genkit AI
GOOGLE_GENAI_API_KEY=sua_chave_ai

# Opcional: Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**📝 Dica:** Use "Add multiple variables" para copiar e colar todas de uma vez.

### 2.4. Deploy!

1. Clique em **Deploy site**
2. Aguarde o build (2-5 minutos)
3. ✅ Seu site estará no ar!

---

## 🔍 Passo 3: Verificar o Deploy

### 3.1. Acessar a Página de Diagnóstico

Depois do deploy bem-sucedido:

1. Acesse: `https://seu-app.netlify.app/diagnostic`
2. Verifique se todos os itens estão ✅ verdes
3. Se houver erros ❌, siga as instruções na própria página

### 3.2. Testar Autenticação

1. Acesse: `https://seu-app.netlify.app`
2. Tente fazer login com:
   - ✅ Email/Password (criar nova conta)
   - ✅ Google (se configurado)
   - ✅ Apple (se configurado)
   - ✅ Instagram/Facebook (se configurado)

---

## 🐛 Solução de Problemas

### ❌ Erro: "Firebase não configurado"

**Solução:**
1. Verifique se TODAS as variáveis `NEXT_PUBLIC_FIREBASE_*` estão configuradas no Netlify
2. Certifique-se de que não há espaços em branco nas variáveis
3. Faça um novo deploy: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

### ❌ Erro: "Domínio não autorizado"

**Solução:**
1. No Firebase Console: **Authentication** → **Settings** → **Authorized domains**
2. Adicione `seu-app.netlify.app`
3. Aguarde alguns minutos e teste novamente

### ❌ Erro: "Operation not allowed"

**Solução:**
1. No Firebase Console: **Authentication** → **Sign-in method**
2. Ative o provedor que você está tentando usar
3. Configure corretamente (OAuth Client ID, etc.)

### ❌ Build failing

**Solução:**
1. Verifique os logs de build no Netlify
2. Certifique-se de que `package.json` tem todas as dependências
3. Execute `npm install` localmente para verificar erros
4. Se necessário, configure `NODE_VERSION=20` nas variáveis de ambiente

### ❌ Página em branco após login

**Solução:**
1. Abra o Console do navegador (F12)
2. Veja os erros no Console
3. Geralmente é problema de domínio não autorizado ou variável faltando
4. Acesse `/diagnostic` para ver o status completo

---

## 🔐 Configuração de Segurança (Firestore Rules)

Depois do deploy, configure as regras de segurança:

1. No Firebase Console: **Firestore Database** → **Rules**
2. Use o arquivo `firestore.rules` do repositório
3. Cole as regras e publique
4. As regras estão em: `/firestore.rules` no repositório

Para fazer deploy das regras via CLI:

```bash
# Instale o Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy das regras
firebase deploy --only firestore:rules
```

---

## 🎉 Deploy Concluído!

Seu app está no ar! 🚀

### Próximos Passos:

1. ✅ **Domínio Customizado:** Configure um domínio personalizado no Netlify
2. ✅ **SSL/HTTPS:** O Netlify já configura SSL automaticamente
3. ✅ **Analytics:** Configure Google Analytics ou Firebase Analytics
4. ✅ **Monitoring:** Ative o Netlify Analytics para métricas
5. ✅ **CDN:** Seu app já está na CDN global do Netlify

### URLs Importantes:

- 🌐 **App:** `https://seu-app.netlify.app`
- 🔍 **Diagnóstico:** `https://seu-app.netlify.app/diagnostic`
- 📊 **Dashboard:** `https://seu-app.netlify.app/dashboard`
- ⚙️ **Netlify Admin:** `https://app.netlify.com/sites/seu-app`
- 🔥 **Firebase Console:** `https://console.firebase.google.com/project/seu-projeto`

---

## 📞 Suporte

Problemas? Verifique:

1. 📖 **Logs do Netlify:** Deploys → Clique no último deploy → Function logs
2. 🔍 **Página de Diagnóstico:** `/diagnostic` no seu app
3. 🐛 **Console do navegador:** F12 para ver erros JavaScript
4. 📚 **Documentação Netlify:** [docs.netlify.com](https://docs.netlify.com)
5. 📚 **Documentação Firebase:** [firebase.google.com/docs](https://firebase.google.com/docs)

---

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] Firebase configurado (Auth, Firestore, Storage)
- [ ] Todos os provedores de autenticação habilitados
- [ ] Domínio autorizado no Firebase
- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] Build bem-sucedido
- [ ] Página de diagnóstico toda verde ✅
- [ ] Login funcionando (testado em todos os provedores)
- [ ] Firestore rules publicadas
- [ ] App acessível publicamente

---

**Desenvolvido com ❤️ pela equipe MãeTech**

Se este guia ajudou, considere dar uma ⭐ no repositório!
