# ⚡ Plano de Ação Rápido - iOS/Android

**Versão:** Executável para começar HOJE  
**Tempo Total:** 4-6 semanas  
**Status:** App 75% pronto, precisa configuração + compliance

---

## 🎯 AÇÕES IMEDIATAS (HOJE)

### 1. Configurar Supabase (30 min)
```bash
# 1. Criar projeto em https://supabase.com/dashboard
# 2. Anotar URL e anon key
# 3. Executar SQL: supabase/schema-nossa-maternidade-completo.sql
# 4. Verificar tabelas criadas
```

### 2. Preencher .env (15 min)
```bash
# Criar .env.local na raiz:
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### 3. Configurar Gemini API (30 min)
```bash
# 1. Obter key em https://makersuite.google.com/app/apikey
# 2. Supabase Dashboard → Settings → Secrets
# 3. Adicionar: GEMINI_API_KEY = sua-key
```

### 4. Deploy Edge Function (45 min)
```bash
npm install -g supabase
supabase login
supabase link --project-ref SEU-PROJECT-REF
supabase functions deploy nathia-chat
```

### 5. Testar App (30 min)
```bash
cd apps/mobile
pnpm dev
# Escanear QR no Expo Go
```

**✅ Total: ~2.5 horas**

---

## 🚨 BLOQUEADORES CRÍTICOS (Resolvidos ANTES de publicar)

### 1. LGPD Compliance (2-3 semanas)
- [ ] Contratar advogado (R$ 3.500-8.000) ou usar templates
- [ ] Criar Privacy Policy + Terms of Service
- [ ] Hostear documentos (Netlify/Vercel)
- [ ] Implementar checkboxes no OnboardingScreen (4 horas dev)

### 2. Autenticação Real (1-2 dias)
- [ ] Apple Sign-In (iOS) - 4-6 horas
- [ ] Google Sign-In (Android) - 4-6 horas
- [ ] Remover autenticação fake

### 3. Correções (1 dia)
- [ ] ProfileScreen: remover botões fake ou adicionar "Coming Soon"
- [ ] Acessibilidade: ProfileScreen + DailyPlanScreen (2 horas)

---

## 📋 CHECKLIST RÁPIDO

### Configuração Base (HOJE)
- [ ] Supabase criado
- [ ] SQL executado
- [ ] .env preenchido
- [ ] Gemini API configurada
- [ ] Edge Function deployed
- [ ] App rodando

### Compliance (2-3 semanas)
- [ ] Advogado contratado OU templates prontos
- [ ] Privacy Policy criada
- [ ] Terms of Service criados
- [ ] Documentos hosteados
- [ ] LGPD consent implementado no app

### Autenticação (1-2 dias)
- [ ] Apple Sign-In configurado
- [ ] Google Sign-In configurado
- [ ] Fake auth removida

### Correções (1 dia)
- [ ] ProfileScreen corrigido
- [ ] DailyPlanScreen com acessibilidade
- [ ] SafeAreaView em todas as telas

### Assets (1 dia)
- [ ] App Icon (1024x1024 iOS, 512x512 Android)
- [ ] Splash Screen
- [ ] Screenshots (mínimo 2 por plataforma)

### Build (1-2 dias)
- [ ] EAS configurado
- [ ] Build development funcionando
- [ ] TestFlight/Internal Testing configurado

### Submissão (2-3 dias)
- [ ] App Store Connect listing
- [ ] Google Play Console listing
- [ ] Apps submetidos
- [ ] Aguardando aprovação (1-7 dias)

---

## 💰 CUSTOS RESUMIDOS

- **Desenvolvimento:** R$ 2.500-3.750
- **Legal:** R$ 3.500-8.000
- **Infraestrutura:** R$ 424-453 (primeiro ano)
- **TOTAL:** **R$ 6.424-12.204**

---

## ⏱️ CRONOGRAMA REALISTA

- **Semana 1:** Configuração + Legal (contratar advogado)
- **Semana 2:** Autenticação (Apple + Google)
- **Semana 3:** Correções + Assets + Build
- **Semana 4:** Legal (receber docs) + Submissão
- **Semana 5:** Aguardar aprovação

**Total: 4-5 semanas**

---

## 🚀 COMEÇAR AGORA

1. **Leia:** `PLANO_ACAO_IOS_ANDROID.md` (plano completo)
2. **Execute:** Ações imediatas acima (HOJE)
3. **Contrate:** Advogado LGPD (Semana 1, Dia 1)
4. **Siga:** Fases em ordem

**Tudo detalhado no plano completo!** 📖

