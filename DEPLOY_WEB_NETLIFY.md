# 🚀 Deploy Web no Netlify - Nossa Maternidade

Guia rápido para fazer deploy da versão web do app no Netlify para testes.

## 📋 Pré-requisitos

- Conta no Netlify (gratuita)
- Repositório GitHub com o código
- Node.js 20 instalado

## 🎯 Opção 1: Deploy Automático via GitHub (Recomendado)

### Passo 1: Conectar ao Netlify

1. Acesse [https://app.netlify.com](https://app.netlify.com)
2. Faça login com sua conta GitHub
3. Clique em **"Add new site"** > **"Import an existing project"**
4. Escolha **GitHub** como provider
5. Selecione o repositório `NossaMaternidade`

### Passo 2: Configurar Build

O Netlify vai detectar automaticamente o arquivo `netlify.toml` na raiz do projeto.

Confirme as configurações:
- **Base directory**: `.` (raiz do projeto)
- **Build command**: `pnpm install && cd apps/mobile && pnpm run build:web`
- **Publish directory**: `apps/mobile/dist`
- **Node version**: `20`

### Passo 3: Variáveis de Ambiente

Adicione as variáveis de ambiente necessárias:

1. Vá em **Site settings** > **Environment variables**
2. Adicione as seguintes variáveis:

```
EXPO_PUBLIC_SUPABASE_URL=sua-url-do-supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
EXPO_PUBLIC_PROJECT_ID=seu-project-id
```

### Passo 4: Deploy!

1. Clique em **"Deploy site"**
2. Aguarde o build completar (5-10 minutos)
3. Acesse a URL fornecida pelo Netlify (ex: `https://nossa-maternidade-xyz.netlify.app`)

## 🎯 Opção 2: Deploy Manual via CLI

### Passo 1: Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### Passo 2: Login no Netlify

```bash
netlify login
```

### Passo 3: Build Local

```bash
cd apps/mobile
pnpm build:web
```

### Passo 4: Deploy

```bash
# Deploy de teste
netlify deploy

# Quando estiver tudo OK, deploy para produção
netlify deploy --prod
```

## 📱 Testando a Versão Web

### Funcionalidades Testáveis

✅ **Funcionam perfeitamente na web:**
- Navegação entre telas
- Formulários e inputs
- Temas (light/dark mode)
- Layout responsivo
- Botões e interações
- Modal e overlays
- Listagens e cards
- Animações CSS

⚠️ **Funcionalidades limitadas na web:**
- Notificações push (apenas notificações do navegador)
- Gravação de áudio (pode precisar de permissão do navegador)
- Câmera e galeria (usando API do navegador)
- Haptic feedback (não disponível)
- Deep linking (funciona diferente)

❌ **Não funcionam na web:**
- Funcionalidades nativas específicas do mobile
- Background tasks
- Widgets nativos

### Como Testar

1. Abra a URL do Netlify no navegador
2. Teste em modo mobile usando DevTools do Chrome:
   - Pressione F12
   - Clique no ícone de dispositivo mobile
   - Escolha "iPhone 13" ou "iPhone 14"
   - Recarregue a página

3. Teste as principais funcionalidades:
   - Login/Cadastro
   - Navegação
   - Preenchimento de formulários
   - Temas
   - Personalizações

## 🔧 Troubleshooting

### Build falhando?

**Erro: "Module not found"**
```bash
# Limpe o cache e reinstale
rm -rf node_modules
pnpm install
pnpm build:web
```

**Erro: "Out of memory"**
```bash
# Aumente o limite de memória do Node
NODE_OPTIONS="--max-old-space-size=4096" pnpm build:web
```

### Página em branco?

1. Verifique o console do navegador (F12)
2. Certifique-se que as variáveis de ambiente estão configuradas
3. Verifique se o build foi concluído com sucesso

### Performance lenta?

A versão web é otimizada para testes, não para produção. Para melhorar:
- Ative o cache no Netlify
- Use domínio personalizado
- Configure CDN do Netlify

## 🌐 Configuração de Domínio Personalizado

1. Vá em **Site settings** > **Domain management**
2. Clique em **"Add custom domain"**
3. Digite seu domínio (ex: `app.nossamaternidade.com.br`)
4. Siga as instruções para configurar o DNS

## 📊 Monitoramento

- **Build logs**: Site > Deploys > [Deploy específico] > Deploy log
- **Function logs**: Site > Functions > [Function] > Logs
- **Analytics**: Site > Analytics (grátis para sites públicos)

## 🎨 Preview URLs

Cada deploy gera uma URL única para preview:
- **Production**: `https://nossamaternidade.netlify.app`
- **Branch deploys**: `https://branch-name--nossamaternidade.netlify.app`
- **Deploy previews**: `https://deploy-preview-123--nossamaternidade.netlify.app`

## ✅ Checklist Pré-Deploy

- [ ] Código commitado no GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Build local testado
- [ ] Testes passando
- [ ] TypeScript sem erros
- [ ] Assets (imagens/ícones) no lugar correto

## 🚨 Importante

⚠️ **Esta é uma versão de TESTE/DEMO**

A versão web serve apenas para:
- Demonstração de funcionalidades
- Testes rápidos
- Preview para stakeholders
- Validação de UI/UX

Para o app completo, use:
- **iOS**: Deploy via App Store (usando EAS Build)
- **Android**: Deploy via Google Play (usando EAS Build)

## 📞 Suporte

Problemas com o deploy? Verifique:
1. [Netlify Docs](https://docs.netlify.com)
2. [Expo Web Docs](https://docs.expo.dev/workflow/web/)
3. Logs do build no Netlify

---

**Última atualização**: 2025-11-07
**Versão do Expo**: 54.0.22
**Node**: 20.x
