# ClubNath by MaeTech Conecta

Uma plataforma Next.js moderna e PWA para a comunidade ClubNath, desenvolvida com Firebase e abordagem mobile-first.

## 🚀 Características

- **Mobile-First**: Interface otimizada para dispositivos móveis com touch targets de 44px mínimo
- **PWA**: Progressive Web App instalável com service workers
- **Firebase Auth**: Autenticação multi-provider (Google, Apple, Instagram/Facebook, Email)
- **Next.js 15**: App Router com Server Components e Server Actions
- **TypeScript**: Código totalmente tipado com modo strict
- **Tailwind CSS**: Estilização com design system personalizado
- **Radix UI**: Componentes acessíveis e responsivos

## 🛠️ Tecnologias

- Next.js 15.3.3
- React 18.3.1
- TypeScript 5
- Firebase 11.9.1
- Tailwind CSS 3.4
- Radix UI
- Genkit AI

## 📦 Instalação

```bash
npm install
```

## 🔐 Configuração

1. Crie um arquivo `.env.local` na raiz do projeto com suas credenciais do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

2. Configure os métodos de autenticação no Firebase Console

## 🚀 Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:9002`

## 🏗️ Build

```bash
npm run build
npm start
```

## 📱 Testes Mobile

### Teste Local em Dispositivo Móvel

1. Certifique-se de que seu dispositivo móvel está na mesma rede Wi-Fi
2. Inicie o servidor de desenvolvimento: `npm run dev`
3. Encontre o IP local da sua máquina
4. Acesse no dispositivo: `http://<SEU_IP>:9002`

### Testes PWA

1. Build de produção: `npm run build && npm start`
2. Acesse no navegador mobile
3. Teste a instalação do PWA (botão "Adicionar à tela inicial")
4. Verifique o funcionamento offline
5. Teste notificações e service workers

### Checklist de Testes Mobile

- [ ] Touch targets mínimos de 44x44px
- [ ] Navegação bottom nav funcional
- [ ] Scroll suave e responsivo
- [ ] Formulários com teclado virtual
- [ ] Botões de login com feedback visual
- [ ] Cards e imagens responsivas
- [ ] Header fixo sem overlap
- [ ] PWA instalável
- [ ] Service worker funcionando
- [ ] Offline fallback

## 📋 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento (Turbopack)
npm run build        # Build de produção
npm start            # Servidor de produção
npm run lint         # ESLint
npm run typecheck    # Verificação TypeScript
```

## 🔒 Segurança

- Middleware para proteção server-side de rotas
- TypeScript e ESLint habilitados no build
- Firestore Security Rules configuradas
- Validação de inputs com Zod

## 🌐 Deploy

### Firebase Hosting

```bash
firebase deploy --only hosting
```

### Netlify

O projeto já está configurado com `netlify.toml`. Conecte seu repositório ao Netlify para deploy automático.

## 📚 Estrutura do Projeto

```
src/
├── app/              # Next.js App Router
│   ├── dashboard/    # Área autenticada
│   ├── page.tsx      # Página de login/signup
│   └── layout.tsx    # Layout principal
├── components/       # Componentes reutilizáveis
│   └── ui/          # Componentes UI (shadcn)
├── firebase/        # Configuração Firebase
├── hooks/           # React hooks customizados
├── lib/             # Utilitários
└── ai/              # Flows Genkit AI
```

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e de propriedade da MaeTech.

---

Desenvolvido com ❤️ pela equipe MaeTech

