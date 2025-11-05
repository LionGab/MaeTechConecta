# 🚀 Configuração Rápida - Para Funcionar Hoje

## ⚡ Checklist Rápido (15 minutos)

### 1. Criar Projeto no Supabase (5 min)
1. Acesse: https://supabase.com/dashboard
2. Clique em "New Project"
3. Preencha:
   - Nome: `nossa-maternidade`
   - Database Password: (anote esta senha!)
   - Region: South America (São Paulo)
4. Aguarde a criação (1-2 min)

### 2. Executar Schema SQL (2 min)
1. No Dashboard → **SQL Editor**
2. Abra o arquivo: `CHECK_AND_CREATE_TABLES.sql` ou `EXECUTE_TUDO.sql`
3. Copie TODO o conteúdo
4. Cole no SQL Editor
5. Clique em **"Run"**

### 3. Configurar Variáveis de Ambiente (3 min)
1. No Dashboard → **Settings → API**
2. Copie:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Edite `/workspace/.env.local`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. Obter Gemini API Key (3 min)
1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com Google
3. Clique em "Create API Key"
4. Copie a chave (começa com `AIza...`)

### 5. Configurar Secrets no Supabase (2 min)
1. No Dashboard → **Edge Functions → Manage secrets**
2. Adicione:
   - Nome: `GEMINI_API_KEY`
   - Valor: Cole a chave copiada
   - Clique em "Add secret"

### 6. Deploy Edge Function (5 min)
```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Login
supabase login

# Link com projeto (obter PROJECT-REF em Settings → General)
supabase link --project-ref SEU-PROJECT-REF

# Deploy
supabase functions deploy nathia-chat
```

### 7. Testar o App
```bash
cd /workspace
pnpm dev
```

Escaneie o QR Code com Expo Go!

---

## ✅ Verificações Finais

- [ ] Supabase projeto criado
- [ ] Schema SQL executado sem erros
- [ ] `.env.local` preenchido com credenciais
- [ ] Gemini API Key obtida
- [ ] Secret `GEMINI_API_KEY` adicionado no Supabase
- [ ] Edge Function `nathia-chat` deployed
- [ ] App inicia sem erros
- [ ] Onboarding funciona
- [ ] Chat NathIA responde

---

## 🚨 Problemas Comuns

### "Supabase URL not configured"
- Verifique se `.env.local` existe e está preenchido
- Reinicie o Metro bundler (Ctrl+C e `pnpm dev` novamente)

### "Edge Function not found"
- Verifique se fez deploy: `supabase functions deploy nathia-chat`
- Verifique se o secret está configurado

### "Chat não responde"
- Verifique logs no Dashboard → Edge Functions → Logs
- Confirme que `GEMINI_API_KEY` está configurada

---

## 📱 Funcionalidades Principais

### ✅ Já Funcionando:
- ✅ Onboarding completo
- ✅ Home Screen com plano diário
- ✅ Chat com NathIA (via Edge Function)
- ✅ Hábitos diários
- ✅ Feed de conteúdos
- ✅ Perfil do usuário
- ✅ Dark Mode
- ✅ Navegação completa

### ⚠️ Requer Configuração:
- ⚠️ Supabase (obrigatório)
- ⚠️ Gemini API Key (obrigatório para chat)
- ⚠️ Edge Function deploy (obrigatório para chat)

---

## 🎯 Próximos Passos Após Funcionar

1. Testar todas as funcionalidades
2. Personalizar conteúdos
3. Configurar notificações push (opcional)
4. Configurar pagamentos Stripe (opcional)
5. Deploy para produção (EAS Build)

---

**Tempo Total:** ~20 minutos  
**Dificuldade:** Baixa  
**Resultado:** App 100% funcional! 🎉
