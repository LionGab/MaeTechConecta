# 🔧 Configurar Variáveis de Ambiente no Netlify

## ⚠️ Problema Resolvido

O app estava dando erro porque as variáveis de ambiente do Supabase não estavam configuradas no Netlify.

## ✅ Correções Aplicadas

1. **Supabase**: Agora usa valores dummy válidos se não configurado (evita erro de inicialização)
2. **Share**: Melhor tratamento para web (Web Share API com fallbacks)
3. **AsyncStorage**: Não usa no web (usa localStorage automaticamente)

## 📋 Configurar Variáveis no Netlify

### Opção 1: Usar Extensão Supabase (Recomendado) ⭐

A forma mais fácil é usar a extensão oficial do Supabase para Netlify:

#### Passo 1: Instalar Extensão

1. Acesse: https://app.netlify.com/extensions
2. Procure por **"Supabase"**
3. Clique em **"Install"** na extensão do Supabase

#### Passo 2: Conectar ao Site

1. Acesse seu site no Netlify
2. Vá em **Site Configuration** → **Supabase** (sidebar)
3. Clique em **"Connect"** para conectar sua conta Supabase
4. Selecione seu projeto Supabase
5. Selecione o framework (ou "Other" para prefixo customizado)
6. Clique em **"Save"**

#### Passo 3: Adicionar Variáveis para Expo

A extensão cria variáveis com nomes diferentes. Para o Expo funcionar, adicione também:

1. Vá em **Site settings** → **Environment variables**
2. Adicione as variáveis com prefixo `EXPO_PUBLIC_`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=${SUPABASE_DATABASE_URL}
   EXPO_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
   ```

   Ou configure manualmente:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

**Vantagens da Extensão:**
- ✅ Configuração automática
- ✅ Sincronização automática
- ✅ Menos chance de erro

### Opção 2: Configuração Manual

#### Passo 1: Acessar Netlify Dashboard

1. Acesse: https://app.netlify.com
2. Selecione seu site
3. Vá em **Site settings** → **Environment variables**

#### Passo 2: Adicionar Variáveis

Adicione as seguintes variáveis de ambiente:

#### Supabase (Obrigatórias)

```
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Como obter:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings → API**
4. Copie:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

#### Outras Variáveis (Opcionais)

```
EXPO_PUBLIC_GEMINI_API_KEY=AIza...
EXPO_PUBLIC_CLAUDE_API_KEY=sk-ant-...
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-...
```

### Passo 3: Fazer Deploy

Após adicionar as variáveis:

1. **Trigger novo deploy:**
   - Vá em **Deploys**
   - Clique em **Trigger deploy** → **Deploy site**

2. Ou faça commit e push:
   ```bash
   git commit --allow-empty -m "trigger: redeploy com variáveis configuradas"
   git push origin main
   ```

## ✅ Verificar

Após o deploy, o app deve:
- ✅ Inicializar sem erros
- ✅ Conectar ao Supabase corretamente
- ✅ Funcionalidades funcionando

## 🔍 Debug

Se ainda houver erros:

1. **Verificar logs do Netlify:**
   - Vá em **Deploys** → **Deploy log**
   - Procure por erros ou avisos

2. **Verificar variáveis:**
   - Confirme que as variáveis estão configuradas
   - Verifique se não há espaços extras
   - Certifique-se de que os valores estão corretos

3. **Console do navegador:**
   - Abra o DevTools (F12)
   - Veja se há erros no console
   - Verifique se as variáveis estão sendo carregadas

## 📝 Nota

- As variáveis com prefixo `EXPO_PUBLIC_` são expostas no bundle (públicas)
- Não coloque secrets sensíveis (service_role keys, etc.)
- Use apenas `anon/public` keys do Supabase

---

**Status:** ✅ Correções aplicadas | ⚠️ Configure as variáveis no Netlify

