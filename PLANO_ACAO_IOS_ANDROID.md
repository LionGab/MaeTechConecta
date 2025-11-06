# 🚀 Plano de Ação - iOS/Android - Nossa Maternidade

**Data:** 2025-11-06  
**Status Atual:** 75% completo (código) | 0% publicado  
**Objetivo:** Publicar app nas lojas iOS e Android

---

## 📊 RESUMO EXECUTIVO

### Estado Atual
- ✅ **Código:** 75% completo (telas, componentes, navegação)
- ✅ **Backend:** Schema SQL pronto, Edge Functions implementadas
- ⚠️ **Configuração:** Supabase precisa ser configurado (env vars vazias)
- ❌ **Autenticação:** Autenticação fake (email temporário)
- ❌ **Features:** Botões fake no ProfileScreen

### Prioridades (Conforme Solicitação)
1. 🔴 **Autenticação Real** - Apple Sign-In + Google Sign-In (PRIORIDADE 1)
2. 🟡 **Features Fake** - Botões não funcionais no ProfileScreen (PRIORIDADE 2)

### Tempo Estimado
- **Autenticação Real:** 1-2 dias (Apple + Google Sign-In)
- **Features Fake:** 15 minutos - 1 hora (dependendo da solução)
- **Total:** 1-2 dias para desbloquear publicação

---

## 🎯 FASES DO PLANO

### **FASE 1: CONFIGURAÇÃO BASE** ⏱️ 2-3 horas
*Objetivo: Deixar app rodando localmente*

#### ✅ 1.1 Configurar Supabase (30 min)
- [ ] Criar projeto no Supabase Dashboard
- [ ] Anotar `SUPABASE_URL` e `SUPABASE_ANON_KEY`
- [ ] Executar schema SQL (`supabase/schema-nossa-maternidade-completo.sql`)
- [ ] Verificar tabelas criadas

**Comandos:**
```bash
# Verificar tabelas criadas
# No SQL Editor do Supabase:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

#### ✅ 1.2 Configurar Variáveis de Ambiente (15 min)
- [ ] Criar `.env.local` na raiz do projeto
- [ ] Preencher `EXPO_PUBLIC_SUPABASE_URL`
- [ ] Preencher `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Adicionar `.env.local` ao `.gitignore`

**Template `.env.local`:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
EXPO_PUBLIC_SENTRY_DSN=  # Opcional
```

#### ✅ 1.3 Configurar Gemini API (30 min)
- [ ] Obter API key em https://makersuite.google.com/app/apikey
- [ ] Adicionar secret no Supabase:
  - Dashboard → Project Settings → Secrets
  - Nome: `GEMINI_API_KEY`
  - Valor: sua API key

#### ✅ 1.4 Deploy Edge Function (45 min)
- [ ] Instalar Supabase CLI globalmente
- [ ] Fazer login no CLI
- [ ] Linkar projeto local com Supabase
- [ ] Deploy da função `nathia-chat`

**Comandos:**
```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Link projeto (pegar PROJECT_REF no dashboard)
supabase link --project-ref SEU-PROJECT-REF

# Deploy
supabase functions deploy nathia-chat
```

#### ✅ 1.5 Testar App Localmente (30 min)
- [ ] Rodar `pnpm --filter apps/mobile run dev`
- [ ] Testar onboarding completo
- [ ] Testar chat com NathIA
- [ ] Verificar logs no console

**Comandos:**
```bash
cd apps/mobile
pnpm dev
# Escanear QR code com Expo Go
```

---

### **FASE 2: AUTENTICAÇÃO REAL** ⏱️ 1-2 dias
*Objetivo: Substituir autenticação fake por Apple/Google Sign-In*

#### 🔴 2.1 Configurar Apple Sign-In (iOS) (4-6 horas)
- [ ] Criar App ID no Apple Developer Portal
- [ ] Configurar Sign In with Apple capability
- [ ] Instalar `expo-apple-authentication`
- [ ] Implementar botão Apple Sign-In no `OnboardingScreen`
- [ ] Integrar com Supabase Auth
- [ ] Testar no simulador iOS

**Dependências:**
```bash
pnpm --filter apps/mobile add expo-apple-authentication
```

**Configuração `app.json`:**
```json
{
  "expo": {
    "ios": {
      "entitlements": {
        "com.apple.developer.applesignin": ["Default"]
      }
    },
    "plugins": [
      "expo-apple-authentication"
    ]
  }
}
```

#### 🔴 2.2 Configurar Google Sign-In (Android) (4-6 horas)
- [ ] Criar OAuth 2.0 Client no Google Cloud Console
- [ ] Obter `clientId` para Android
- [ ] Instalar `@react-native-google-signin/google-signin`
- [ ] Implementar botão Google Sign-In no `OnboardingScreen`
- [ ] Integrar com Supabase Auth
- [ ] Testar no emulador Android

**Dependências:**
```bash
pnpm --filter apps/mobile add @react-native-google-signin/google-signin
```

**Configuração Supabase:**
- Dashboard → Authentication → Providers
- Habilitar Google provider
- Adicionar Client ID e Secret

#### 🔴 2.3 Remover Autenticação Fake (30 min)
- [ ] Remover input de email temporário do `OnboardingScreen`
- [ ] Remover lógica de `signInAnonymously` fake
- [ ] Garantir que apenas Apple/Google Sign-In funcionam
- [ ] Atualizar testes

---

### **FASE 3: CORRIGIR FEATURES FAKE** ⏱️ 15 min - 1 hora
*Objetivo: Remover ou implementar botões fake no ProfileScreen*

#### 🟡 3.1 Corrigir ProfileScreen - Botões Fake (15 min - 1 hora)

**Opção A: Remover Botões (Rápido - 2 minutos)**
- [ ] Comentar ou remover linhas 95-118 de `src/screens/ProfileScreen.tsx`
- [ ] Remover seção "Configurações" completa

**Opção B: Adicionar "Coming Soon" (Recomendado - 15 minutos)**
- [ ] Criar função `handleComingSoon` no ProfileScreen
- [ ] Adicionar `onPress` em cada botão fake
- [ ] Mostrar Alert com mensagem "Em Breve"

**Código para Opção B:**
```typescript
const handleComingSoon = (feature: string) => {
  Alert.alert(
    'Em Breve',
    `A funcionalidade "${feature}" estará disponível em breve! ✨`
  );
};

// Em cada TouchableOpacity:
<TouchableOpacity
  style={styles.settingItem}
  onPress={() => handleComingSoon('Notificações')}
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Notificações - Em breve"
>
  <Text style={styles.settingText}>🔔 Notificações</Text>
  <Text style={styles.settingArrow}>→</Text>
</TouchableOpacity>
```

**Opção C: Implementar Telas Completas (1-2 dias)**
- [ ] Criar NotificationsSettingsScreen
- [ ] Criar AppearanceSettingsScreen
- [ ] Criar PrivacySettingsScreen
- [ ] Criar SupportScreen
- [ ] Adicionar navegação para cada tela

**Recomendação:** Opção B (15 minutos) para MVP rápido

---

### **FASE 4: ASSETS E CONFIGURAÇÃO** ⏱️ 1 dia
*Objetivo: Criar assets profissionais para as lojas*

#### ✅ 4.1 Criar App Icon (2 horas)
- [ ] **iOS:** 1024x1024px PNG
- [ ] **Android:** 512x512px PNG (adaptive icon)
- [ ] Design profissional com logo
- [ ] Salvar em `apps/mobile/assets/icon.png` e `adaptive-icon.png`

#### ✅ 4.2 Criar Splash Screen (1 hora)
- [ ] **iOS:** 2048x2732px (iPad Pro 12.9")
- [ ] **Android:** 1920x1920px
- [ ] Design consistente com tema
- [ ] Salvar em `apps/mobile/assets/splash.png`

#### ✅ 4.3 Criar Screenshots (2 horas)
- [ ] **iOS:** Mínimo 2, recomendado 8
  - iPhone 14 Pro Max (1290x2796px)
  - iPad Pro 12.9" (2048x2732px)
- [ ] **Android:** Mínimo 2, recomendado 8
  - Phone (1080x1920px)
  - Tablet (1200x1920px)

**Telas para screenshots:**
1. HomeScreen (melhor tela!)
2. ChatScreen (mostra IA)
3. DailyPlanScreen (mostra planejamento)
4. OnboardingScreen (opcional)

#### ✅ 4.4 Configurar EAS Build (2 horas)
- [ ] Instalar EAS CLI
- [ ] Login no Expo
- [ ] Configurar credenciais:
  - **iOS:** Apple Developer Account
  - **Android:** Google Play Console (service account)
- [ ] Atualizar `eas.json` com credenciais reais

**Comandos:**
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar iOS
eas build:configure
# Seguir wizard (precisa Apple Developer Account)

# Configurar Android
eas build:configure
# Seguir wizard (precisa Google Play Console)
```

---

### **FASE 5: BUILD E TESTE** ⏱️ 1-2 dias
*Objetivo: Gerar builds de teste e validar*

#### ✅ 5.1 Build Development (2 horas)
- [ ] Build iOS development
- [ ] Build Android development
- [ ] Instalar em dispositivos físicos
- [ ] Testar fluxo completo

**Comandos:**
```bash
# Build iOS development
eas build --platform ios --profile development

# Build Android development
eas build --platform android --profile development
```

#### ✅ 5.2 Teste Interno (1 dia)
- [ ] TestFlight (iOS) - adicionar testadores
- [ ] Google Play Internal Testing (Android)
- [ ] Coletar feedback
- [ ] Corrigir bugs críticos

#### ✅ 5.3 Build Preview (2 horas)
- [ ] Build iOS preview (APK não funciona, precisa .ipa)
- [ ] Build Android preview (APK)
- [ ] Distribuir para testadores externos

**Comandos:**
```bash
# Build preview
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

---

### **FASE 6: SUBMISSÃO NAS LOJAS** ⏱️ 2-3 dias
*Objetivo: Publicar nas lojas Apple e Google*

#### ✅ 6.1 Apple App Store (1-2 dias)
- [ ] Criar App Store Connect listing
- [ ] Preencher informações:
  - Nome: "Nossa Maternidade"
  - Subtítulo: "Assistente IA para mães e gestantes"
  - Descrição (até 4000 caracteres)
  - Palavras-chave
  - Categoria: Saúde e Fitness
  - Classificação: 4+
- [ ] Upload screenshots
- [ ] Upload app preview video (opcional)
- [ ] Configurar Privacy Policy URL
- [ ] Configurar Terms of Service URL
- [ ] Submeter para review
- [ ] Aguardar aprovação (1-3 dias típico)

**Requisitos Apple:**
- ✅ Apple Sign-In implementado (obrigatório se usar social auth)
- ✅ Privacy Policy URL
- ✅ Terms of Service URL
- ✅ Screenshots (mínimo 2)
- ✅ App Icon
- ✅ Descrição completa

#### ✅ 6.2 Google Play Store (1-2 dias)
- [ ] Criar app no Google Play Console
- [ ] Preencher informações:
  - Nome: "Nossa Maternidade"
  - Descrição curta (80 caracteres)
  - Descrição completa (4000 caracteres)
  - Categoria: Saúde e Fitness
  - Classificação: Para todos
- [ ] Upload screenshots
- [ ] Upload feature graphic (1024x500px)
- [ ] Configurar Privacy Policy URL (obrigatório)
- [ ] Configurar Terms of Service URL
- [ ] Preencher formulário de dados de saúde (se aplicável)
- [ ] Submeter para review
- [ ] Aguardar aprovação (1-7 dias típico)

**Requisitos Google:**
- ✅ Privacy Policy URL (obrigatório)
- ✅ Terms of Service URL
- ✅ Screenshots (mínimo 2)
- ✅ App Icon
- ✅ Feature Graphic

---

## 📋 CHECKLIST COMPLETO

### Configuração Base
- [ ] Supabase configurado
- [ ] Schema SQL executado
- [ ] Variáveis de ambiente preenchidas
- [ ] Gemini API configurada
- [ ] Edge Function deployed
- [ ] App rodando localmente

### Autenticação
- [ ] Apple Sign-In configurado (iOS)
- [ ] Google Sign-In configurado (Android)
- [ ] Autenticação fake removida
- [ ] Testes de autenticação passando

### Features Fake
- [ ] ProfileScreen corrigido (botões fake removidos ou "Coming Soon" adicionado)

### Assets
- [ ] App Icon criado (iOS + Android)
- [ ] Splash Screen criado
- [ ] Screenshots criados (mínimo 2 por plataforma)
- [ ] Feature Graphic criado (Android)

### Build
- [ ] EAS CLI instalado e configurado
- [ ] Credenciais iOS configuradas
- [ ] Credenciais Android configuradas
- [ ] Build development funcionando
- [ ] TestFlight configurado (iOS)
- [ ] Google Play Internal Testing configurado

### Submissão
- [ ] App Store Connect listing criado
- [ ] Google Play Console listing criado
- [ ] Apps submetidos para review
- [ ] Aguardando aprovação

---

## 💰 CUSTOS ESTIMADOS

### Desenvolvimento
- **Apple Sign-In:** 6 horas × R$ 100-150/h = **R$ 600-900**
- **Google Sign-In:** 6 horas × R$ 100-150/h = **R$ 600-900**
- **Features Fake (ProfileScreen):** 15 min - 1 hora × R$ 100-150/h = **R$ 25-150**
- **Assets (Design):** 5 horas × R$ 100-150/h = **R$ 500-750**
- **Total Desenvolvimento:** **R$ 1.725-2.700**

### Infraestrutura
- **Supabase:** R$ 0 (free tier) até R$ 25/mês (pro)
- **Expo EAS:** R$ 0 (free tier) até R$ 29/mês (pro)
- **Apple Developer:** **R$ 399/ano** (obrigatório iOS)
- **Google Play:** **R$ 25 (one-time)** (obrigatório Android)

### Total Estimado
- **Desenvolvimento:** R$ 1.725-2.700
- **Infraestrutura:** R$ 424-453 (primeiro ano)
- **TOTAL:** **R$ 2.149-3.153**

---

## ⏱️ CRONOGRAMA SUGERIDO

### Semana 1 (Configuração + Autenticação)
- **Dia 1:** Fase 1 (Configuração Base) - 2-3 horas
- **Dia 2-3:** Fase 2.1 (Apple Sign-In) - 4-6 horas
- **Dia 4-5:** Fase 2.2 (Google Sign-In) - 4-6 horas
- **Dia 5:** Fase 2.3 (Remover fake auth) - 30 min

### Semana 2 (Features + Assets)
- **Dia 1:** Fase 3 (Corrigir Features Fake) - 15 min - 1 hora
- **Dia 2:** Fase 4 (Assets) - 5 horas
- **Dia 3:** Fase 4.4 (Configurar EAS) - 2 horas
- **Dia 4-5:** Fase 5 (Build e Teste) - 1-2 dias

### Semana 3 (Submissão)
- **Dia 1-2:** Fase 6 (Submeter nas lojas)
- **Dia 3-7:** Aguardar aprovação

**Total:** 2-3 semanas

---

## 🚨 RISCOS E MITIGAÇÕES

### Risco 1: Rejeição nas Lojas
- **Probabilidade:** Média
- **Impacto:** Alto (atrasa publicação)
- **Mitigação:** Seguir checklist completo, testar em TestFlight/Internal Testing antes

### Risco 2: Bugs em Produção
- **Probabilidade:** Média
- **Impacto:** Médio
- **Mitigação:** Teste interno robusto, Sentry para monitoramento

### Risco 3: Custos de Infraestrutura
- **Probabilidade:** Baixa
- **Impacto:** Baixo (free tiers geralmente suficientes)
- **Mitigação:** Começar com free tiers, escalar conforme necessário

---

## 📚 RECURSOS E DOCUMENTAÇÃO

### Documentação Interna
- `COMO-DEIXAR-APP-FUNCIONAL.md` - Guia de configuração
- `DESIGN-REVIEW-CONSOLIDATED.md` - Análise de blockers
- `STATUS-APP.md` - Status atual do app

### Links Úteis
- **Supabase:** https://supabase.com/docs
- **Expo EAS:** https://docs.expo.dev/build/introduction/
- **Apple Developer:** https://developer.apple.com/
- **Google Play Console:** https://play.google.com/console
- **Apple Sign-In:** https://docs.expo.dev/versions/latest/sdk/apple-authentication/
- **Google Sign-In:** https://react-native-google-signin.github.io/docs/

---

## ✅ PRÓXIMOS PASSOS IMEDIATOS

1. **HOJE:**
   - [ ] Ler este plano completo
   - [ ] Iniciar Fase 1 (Configuração Base) - 2-3 horas
   - [ ] Verificar problema do tema não estar sendo aplicado

2. **ESTA SEMANA:**
   - [ ] Completar Fase 1 (Configuração Base)
   - [ ] Iniciar Fase 2.1 (Apple Sign-In)
   - [ ] Iniciar Fase 2.2 (Google Sign-In)

3. **PRÓXIMA SEMANA:**
   - [ ] Completar Fase 2 (Autenticação Real)
   - [ ] Completar Fase 3 (Features Fake)
   - [ ] Iniciar Fase 4 (Assets)

---

**Tudo pronto para começar!** 🚀

**Prioridades definidas:**
1. 🔴 Autenticação Real (Apple + Google Sign-In)
2. 🟡 Features Fake (ProfileScreen)

**Foco em executar e publicar!** Sem preocupação com compliance por enquanto.

