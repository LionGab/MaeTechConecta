# 🎀 Guia Rápido - Nossa Maternidade Web

**Para a influenciadora testar o app AGORA! 🚀**

## ⚡ Deploy Rápido (5 minutos)

### 1️⃣ Login no Netlify

1. Acesse: https://app.netlify.com
2. Clique em **"Sign up"** ou **"Log in"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Netlify

### 2️⃣ Conectar Repositório

1. Clique em **"Add new site"** → **"Import an existing project"**
2. Escolha **GitHub**
3. Procure por **"NossaMaternidade"** e selecione
4. Clique em **"Authorize Netlify"** se pedir

### 3️⃣ Configurar (já está tudo pronto!)

**O Netlify vai detectar tudo automaticamente!**

Apenas confirme que está assim:
- ✅ Base directory: `.`
- ✅ Build command: `pnpm install && cd apps/mobile && pnpm run build:web`
- ✅ Publish directory: `apps/mobile/dist`

### 4️⃣ Adicionar Variáveis de Ambiente

1. Vá em **"Site settings"** → **"Environment variables"**
2. Clique em **"Add a variable"**
3. Adicione estas 3 variáveis (peça as chaves para o dev):

```
EXPO_PUBLIC_SUPABASE_URL = [pedir ao dev]
EXPO_PUBLIC_SUPABASE_ANON_KEY = [pedir ao dev]
EXPO_PUBLIC_PROJECT_ID = nossa-maternidade
```

### 5️⃣ Deploy! 🎉

1. Clique em **"Deploy site"**
2. Aguarde 5-10 minutos ☕
3. A URL vai aparecer tipo: `https://nossa-maternidade-abc123.netlify.app`

## 📱 Como Testar no Celular

### iPhone/Android:

1. Abra o Safari (iPhone) ou Chrome (Android)
2. Cole a URL do Netlify
3. Clique em **"Adicionar à tela inicial"**
4. Use como um app normal! 🎊

### No Computador (modo mobile):

1. Abra o Google Chrome
2. Cole a URL do Netlify
3. Aperte **F12** (abre DevTools)
4. Clique no ícone de celular 📱 (topo esquerdo)
5. Escolha **"iPhone 13"** ou **"iPhone 14"**
6. Recarregue a página (F5)

## ✅ O que Testar

### Básico (teste primeiro!)
- [ ] Login/Cadastro funciona?
- [ ] Consegue navegar entre as telas?
- [ ] Formulários funcionam?
- [ ] Botões clicam?
- [ ] Temas claro/escuro funcionam?

### Funcionalidades Principais
- [ ] Plano Diário carrega?
- [ ] Chat funciona?
- [ ] Conteúdo educativo aparece?
- [ ] Perfil abre?
- [ ] Configurações funcionam?

### Visual
- [ ] Cores estão bonitas?
- [ ] Fontes legíveis?
- [ ] Imagens carregam?
- [ ] Layout responsivo?
- [ ] Animações suaves?

## 🎨 Personalize a URL

Depois que testar e aprovar:

1. **Site settings** → **Domain management**
2. **Add custom domain**
3. Digite: `app.nossamaternidade.com.br`
4. Configure o DNS conforme instruído

## ⚠️ Importante Saber

### ✅ Funciona Perfeitamente:
- Todas as telas
- Navegação
- Formulários
- Login/Cadastro
- Temas
- Conteúdo
- Chat
- Perfil

### ⚡ Funciona com Limitações:
- Notificações (só do navegador)
- Áudio (precisa de permissão)
- Câmera (usa API do navegador)

### ❌ Não Funciona:
- Vibração do celular
- Notificações push nativas
- Background tasks

## 🆘 Problemas?

### Página em branco?
→ Espera 1 minuto e recarrega (F5)

### Não carrega?
→ Verifica se adicionou as 3 variáveis de ambiente

### Build falhou?
→ Confere se escolheu o repositório certo

### Outra coisa?
→ Chama o dev! 😊

## 📞 Contatos Úteis

- **Suporte Netlify**: https://docs.netlify.com
- **Status do Build**: Netlify → Deploys → [seu deploy]
- **Logs de Erro**: Netlify → Deploys → [seu deploy] → Deploy log

---

## 🎁 Bônus: Deploy Instantâneo via CLI

Se você tem Node.js instalado:

```bash
# No terminal/cmd
cd apps/mobile
pnpm build:web

# Instala Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy!
netlify deploy --prod
```

Pronto! Em 2 minutos está no ar! 🚀

---

**Versão**: 1.0.0
**Data**: 07/11/2025
**Build testado**: ✅ Funcionando perfeitamente!

**Bons testes! 💖**

