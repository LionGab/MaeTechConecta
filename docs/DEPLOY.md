# Guia de Deploy - ClubNath

Este guia fornece instruções para fazer deploy da aplicação ClubNath em produção.

## 🎯 Opções de Deploy

1. Firebase Hosting (Recomendado)
2. Netlify
3. Vercel

## 🔥 Firebase Hosting (Recomendado)

### Pré-requisitos

```bash
npm install -g firebase-tools
```

### Configuração Inicial

1. **Login no Firebase**
```bash
firebase login
```

2. **Inicializar Firebase** (se ainda não foi feito)
```bash
firebase init hosting
```

Selecione:
- Projeto existente: Seu projeto Firebase
- Public directory: `out`
- Single-page app: `Yes`
- Rewrite all urls to /index.html: `Yes`
- GitHub Actions: `No` (por enquanto)

### Build e Deploy

1. **Build de produção**
```bash
npm run build
```

2. **Deploy para Firebase**
```bash
firebase deploy --only hosting
```

### Deploy Automático (GitHub Actions)

Crie `.github/workflows/firebase-hosting.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: seu-project-id
```

### Configurar Secrets no GitHub

1. Vá em: Repositório > Settings > Secrets and variables > Actions
2. Adicione os secrets:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_SERVICE_ACCOUNT`

## 🌐 Netlify

### Via Interface Web (Mais Simples)

1. Acesse [Netlify](https://app.netlify.com)
2. Click em "Add new site" > "Import an existing project"
3. Conecte seu repositório GitHub
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Adicione variáveis de ambiente
6. Click em "Deploy site"

### Via CLI

1. **Instalar Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Build e Deploy**
```bash
npm run build
netlify deploy --prod
```

### Configuração netlify.toml

O arquivo `netlify.toml` já está configurado:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## ▲ Vercel (Next.js Native)

### Via Interface Web

1. Acesse [Vercel](https://vercel.com)
2. Click em "Add New" > "Project"
3. Importe o repositório GitHub
4. Vercel detecta Next.js automaticamente
5. Adicione variáveis de ambiente
6. Click em "Deploy"

### Via CLI

1. **Instalar Vercel CLI**
```bash
npm install -g vercel
```

2. **Login e Deploy**
```bash
vercel login
vercel
```

3. **Deploy para produção**
```bash
vercel --prod
```

## 🔒 Configurações de Segurança

### Variáveis de Ambiente

**NUNCA commite arquivos .env ao repositório!**

Adicione `.env.local` ao `.gitignore`:

```
.env.local
.env.*.local
```

### Variáveis necessárias:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Headers de Segurança

Adicione ao `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ];
},
```

## 🔐 Firestore Security Rules

Certifique-se de ter as regras de segurança configuradas:

```bash
firebase deploy --only firestore:rules
```

## 📊 Monitoramento

### Firebase Analytics

Já está integrado. Acesse:
- Firebase Console > Analytics

### Google Analytics

Se quiser adicionar GA4:

```typescript
// src/app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## ✅ Checklist Pré-Deploy

- [ ] Build local funciona sem erros
- [ ] TypeScript compila sem erros
- [ ] ESLint passa sem erros críticos
- [ ] Testes mobile realizados
- [ ] PWA funciona corretamente
- [ ] Variáveis de ambiente configuradas
- [ ] Firebase Auth providers habilitados
- [ ] Firestore rules configuradas
- [ ] Analytics configurado
- [ ] Domínio customizado configurado (opcional)
- [ ] HTTPS habilitado
- [ ] Service worker funcionando

## 🔄 Processo de Deploy Contínuo

### Workflow Recomendado

1. **Desenvolvimento**
   - Branch: `develop`
   - Deploy automático: Preview URL

2. **Staging**
   - Branch: `staging`
   - Deploy automático: Staging URL
   - Testes finais

3. **Produção**
   - Branch: `main`
   - Deploy manual ou automático após aprovação
   - Produção URL

### Rollback

Se algo der errado:

**Firebase:**
```bash
firebase hosting:rollback
```

**Netlify:**
- Interface web > Deploys > Previous deploy > Publish

**Vercel:**
- Interface web > Deployments > Previous > Promote to Production

## 🌍 Domínio Customizado

### Firebase Hosting

```bash
firebase hosting:channel:deploy production
```

Depois adicione o domínio no console do Firebase.

### Netlify

1. Site settings > Domain management
2. Add custom domain
3. Configure DNS records

### Vercel

1. Project settings > Domains
2. Add domain
3. Configure DNS records

## 📱 PWA em Produção

Certifique-se que:

1. **HTTPS está habilitado** (obrigatório para PWA)
2. **Service worker registrado** (automático com @ducanh2912/next-pwa)
3. **Manifest acessível** em `/manifest.json`
4. **Ícones disponíveis** nos tamanhos corretos

Teste em:
- [PWA Builder](https://www.pwabuilder.com/)
- Chrome DevTools > Lighthouse > PWA

## 🐛 Debugging em Produção

### Logs

**Firebase:**
```bash
firebase functions:log
```

**Netlify:**
- Interface web > Functions > Logs

**Vercel:**
- Interface web > Deployments > [Specific deployment] > Logs

### Error Tracking

Considere adicionar:
- Sentry
- LogRocket
- Firebase Crashlytics

## 📈 Otimizações de Performance

- [ ] Imagens otimizadas (Next.js Image)
- [ ] Lazy loading habilitado
- [ ] Code splitting automático (Next.js)
- [ ] Static generation onde possível
- [ ] CDN configurado
- [ ] Gzip/Brotli compressão
- [ ] Cache headers configurados

---

✅ **Deploy realizado com sucesso!**

Acesse sua aplicação e compartilhe com o mundo! 🚀
