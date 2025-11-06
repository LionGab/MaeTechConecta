# 🚨 PLANO DE AÇÃO URGENTE - Nossa Maternidade

**Baseado em:** RELATORIO-ANALISE-MOBILE.md  
**Score Atual:** 4.5/10 ⚠️  
**Status:** **NÃO PRONTO PARA PUBLICAÇÃO**

---

## 📊 RESUMO EXECUTIVO

### Situação Crítica
- **5 bloqueadores críticos** impedem publicação
- **Score de readiness:** 4.5/10 (meta: 9/10)
- **Timeline estimada:** 4-6 semanas para publicação
- **Custo estimado:** R$ 5.000 - 10.000

### Principais Bloqueadores
1. 🔴 Política de Privacidade AUSENTE
2. 🔴 Termos de Serviço AUSENTES
3. 🔴 Violação LGPD (dados de saúde sem consentimento)
4. 🔴 Credenciais EAS inválidas (placeholders iOS)
5. 🔴 Ícones/Splash genéricos

---

## 🎯 AÇÕES PRIORITÁRIAS (POR ORDEM)

### FASE 1: COMPLIANCE & LEGAL (SEMANA 1) 🔴 CRÍTICO

#### ✅ **AÇÃO 1.1: Criar Estrutura de Compliance**
**Prioridade:** 🔴 CRÍTICA  
**Tempo:** 30 minutos  
**Custo:** R$ 0

```bash
# Criar estrutura de diretórios
mkdir -p docs/legal
mkdir -p docs/assets/screenshots/ios
mkdir -p docs/assets/screenshots/android
mkdir -p docs/assets/marketing

# Criar placeholders para não esquecer
touch docs/legal/privacy-policy.md
touch docs/legal/terms-of-service.md
touch docs/legal/lgpd-compliance-checklist.md
```

**O que fazer:**
- Criar estrutura de pastas
- Adicionar arquivos placeholder com TODOs
- Commitar estrutura inicial

---

#### ✅ **AÇÃO 1.2: Implementar Consentimento LGPD no Onboarding**
**Prioridade:** 🔴 CRÍTICA  
**Tempo:** 2-4 horas  
**Custo:** R$ 0 (dev interno)

**Arquivo:** `src/screens/OnboardingScreen.tsx`

**Código a implementar:**
```typescript
// Adicionar estados para consentimentos
const [lgpdConsent, setLgpdConsent] = useState(false);
const [healthDataConsent, setHealthDataConsent] = useState(false);

// Adicionar checkboxes no Step 1 (antes de coletar dados)
<Checkbox
  checked={lgpdConsent}
  onValueChange={setLgpdConsent}
  label="Li e aceito a Política de Privacidade e Termos de Serviço"
  required
/>
<Checkbox
  checked={healthDataConsent}
  onValueChange={setHealthDataConsent}
  label="Autorizo o tratamento dos meus dados de saúde para personalização do app"
  required
/>

// Validar antes de prosseguir
if (!lgpdConsent || !healthDataConsent) {
  Alert.alert('Atenção', 'É necessário aceitar os termos para continuar');
  return;
}
```

**Impacto:** 
- ✅ Resolve violação LGPD imediata
- ✅ Permite continuar desenvolvimento sem risco legal
- ✅ Requisito obrigatório para publicação

---

#### ✅ **AÇÃO 1.3: Contratar Advogado LGPD**
**Prioridade:** 🔴 CRÍTICA  
**Tempo:** 1-2 semanas  
**Custo:** R$ 2.000 - 5.000

**O que solicitar:**
- ✅ Política de Privacidade completa (em português)
- ✅ Termos de Serviço (especialmente para IAP/assinaturas)
- ✅ Revisão de coleta de dados de saúde
- ✅ Documentação de base legal (LGPD Art. 7)

**Onde encontrar:**
- Ordem dos Advogados do Brasil (OAB)
- Escritórios especializados em Direito Digital
- Fiverr/99freelas (mais barato, menos recomendado)

**Próximo passo após receber:**
- Hospedar em: `https://nossamaternidade.com.br/privacidade`
- Adicionar links no app.json
- Adicionar links nas telas do app

---

### FASE 2: FUNCIONALIDADES CRÍTICAS (SEMANA 2) 🟡 ALTA

#### ✅ **AÇÃO 2.1: Substituir Autenticação Temporária**
**Prioridade:** 🟡 ALTA  
**Tempo:** 1-2 dias  
**Custo:** R$ 0 (bibliotecas grátis)

**Problema atual:**
```typescript
email: `${Date.now()}@temp.com`, // ❌ Viola políticas das lojas
```

**Solução:**

**Para iOS (obrigatório):**
```bash
npx expo install expo-apple-authentication
```

**Para Android:**
```bash
npm install @react-native-google-signin/google-signin
```

**Código exemplo:**
```typescript
// iOS
import * as AppleAuthentication from 'expo-apple-authentication';

const handleAppleSignIn = async () => {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });
  
  // Usar credential.user, credential.email, etc.
};

// Android
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const handleGoogleSignIn = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  // Usar userInfo.user.email, etc.
};
```

**Impacto:**
- ✅ Remove violação de políticas
- ✅ Melhora UX (autenticação social)
- ✅ Obrigatório para iOS

---

#### ✅ **AÇÃO 2.2: Adicionar Justificativas de Permissões**
**Prioridade:** 🟡 ALTA  
**Tempo:** 15 minutos  
**Custo:** R$ 0

**Arquivo:** `app.json`

**Atualizar:**
```json
{
  "ios": {
    "infoPlist": {
      "NSMicrophoneUsageDescription": "Permite comandos de voz para a assistente NathIA",
      "NSCameraUsageDescription": "Para compartilhar fotos de momentos especiais (futuro)",
      "NSPhotoLibraryUsageDescription": "Para salvar imagens do app em sua galeria"
    }
  },
  "android": {
    "permissions": [
      {
        "name": "android.permission.RECORD_AUDIO",
        "description": "Permite comandos de voz para a assistente NathIA"
      },
      {
        "name": "android.permission.INTERNET",
        "description": "Necessário para comunicação com servidores"
      }
    ]
  }
}
```

---

#### ✅ **AÇÃO 2.3: Implementar Sistema de Moderação Básico**
**Prioridade:** 🟡 ALTA  
**Tempo:** 1 semana  
**Custo:** R$ 0

**Criar arquivo:** `src/utils/moderation.ts`

```typescript
// Lista de palavras proibidas (exemplo básico)
const FORBIDDEN_WORDS = [
  // Palavras ofensivas, etc.
  // Adicionar lista apropriada
];

export function moderateContent(content: string): {
  isSafe: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  const lowerContent = content.toLowerCase();
  
  FORBIDDEN_WORDS.forEach(word => {
    if (lowerContent.includes(word.toLowerCase())) {
      violations.push(word);
    }
  });
  
  return {
    isSafe: violations.length === 0,
    violations
  };
}
```

**Usar antes de postar:**
```typescript
const moderationResult = moderateContent(userInput);
if (!moderationResult.isSafe) {
  Alert.alert('Conteúdo bloqueado', 'Sua mensagem contém palavras inadequadas');
  return;
}
```

---

### FASE 3: ASSETS & DESIGN (SEMANA 2-3) 🟡 ALTA

#### ✅ **AÇÃO 3.1: Criar/Contratar Ícones e Splash**
**Prioridade:** 🟡 ALTA  
**Tempo:** 3-5 dias  
**Custo:** R$ 1.000 - 2.000 (se contratar) ou R$ 0 (DIY)

**O que precisa:**
- Ícone iOS: 1024x1024px (PNG sem alpha)
- Ícone Android: 512x512px (adaptive icon)
- Splash screen: Marca + loading animado

**Opções:**
1. **Contratar designer** (Fiverr, 99freelas) - R$ 1.000-2.000
2. **DIY com Figma** - R$ 0 (usar templates)
3. **Geradores online** - R$ 0-50 (appicon.co, etc)

**Depois de criar:**
```bash
# Substituir arquivos
apps/mobile/assets/icon.png
apps/mobile/assets/splash.png
apps/mobile/assets/adaptive-icon.png

# Testar visualização
eas build --profile preview --platform all
```

---

#### ✅ **AÇÃO 3.2: Criar Screenshots para Lojas**
**Prioridade:** 🟡 ALTA  
**Tempo:** 1-2 dias  
**Custo:** R$ 0 (DIY) ou R$ 500-1.500 (designer)

**Screenshots obrigatórios:**
1. Onboarding (Step 1)
2. Onboarding (Step 2 - Tipo)
3. Home Screen
4. Chat NathIA
5. Comunidade (quando implementada)
6. Conteúdos
7. Perfil
8. Feature destaque

**Tamanhos necessários:**
- **iOS:** 6.5" (1290x2796px), 5.5" (1242x2208px)
- **Android:** Mínimo 320px, máximo 3840px (16:9 ou 9:16)

**Como fazer:**
```bash
# 1. Rodar app em simulador
npx expo start

# 2. Capturar telas (Cmd+S no simulador iOS, ou screenshot tool)
# 3. Salvar em docs/assets/screenshots/
```

---

#### ✅ **AÇÃO 3.3: Criar Feature Graphic (Google Play)**
**Prioridade:** 🟡 MÉDIA  
**Tempo:** 1-2 dias  
**Custo:** R$ 300-800 (designer) ou R$ 0 (DIY)

**Especificações:**
- Tamanho: 1024x500px
- Formato: PNG
- Conteúdo: Logo + tagline + visual acolhedor

---

### FASE 4: CONFIGURAÇÃO TÉCNICA (SEMANA 3-4) 🟡 ALTA

#### ✅ **AÇÃO 4.1: Configurar Apple Developer Account**
**Prioridade:** 🟡 ALTA  
**Tempo:** 1-2 dias (após aprovação)  
**Custo:** $99/ano (~R$ 500)

**Passos:**
1. Cadastrar em: https://developer.apple.com
2. Pagar $99/ano
3. Criar App ID: `com.nossa.maternidade`
4. Gerar certificados de distribuição
5. Atualizar `eas.json`:

```json
{
  "ios": {
    "appleId": "seu-email-real@exemplo.com",
    "ascAppId": "1234567890", // Obter no App Store Connect
    "appleTeamId": "ABCD123456" // Obter no Apple Developer
  }
}
```

---

#### ✅ **AÇÃO 4.2: Configurar Google Play Developer Account**
**Prioridade:** 🟡 ALTA  
**Tempo:** 1 dia  
**Custo:** $25 one-time (~R$ 130)

**Passos:**
1. Cadastrar em: https://play.google.com/console
2. Pagar $25 (taxa única)
3. Criar Service Account Key
4. Salvar `service-account-key.json`
5. Adicionar ao `.gitignore`

---

#### ✅ **AÇÃO 4.3: Atualizar .gitignore**
**Prioridade:** 🟡 MÉDIA  
**Tempo:** 5 minutos  
**Custo:** R$ 0

```bash
# Adicionar ao .gitignore
echo "" >> .gitignore
echo "# Credenciais de produção" >> .gitignore
echo "service-account-key.json" >> .gitignore
echo "*.p12" >> .gitignore
echo "*.mobileprovision" >> .gitignore
echo ".env.production" >> .gitignore
```

---

### FASE 5: TESTES & AJUSTES (SEMANA 4-5) 🟢 MÉDIA

#### ✅ **AÇÃO 5.1: Build Preview para Testes**
**Prioridade:** 🟢 MÉDIA  
**Tempo:** 2-3 horas  
**Custo:** R$ 0

```bash
# Build para testes
eas build --profile preview --platform all

# Distribuir:
# - iOS: TestFlight (mínimo 20 testadores)
# - Android: Google Play Internal Testing (mínimo 20 testadores)
```

**Período de teste:** Mínimo 14 dias

---

#### ✅ **AÇÃO 5.2: Preparar Metadados para Lojas**
**Prioridade:** 🟢 MÉDIA  
**Tempo:** 1-2 dias  
**Custo:** R$ 0

**Google Play Console:**
- Título, descrição, screenshots
- Categoria, classificação etária
- Declaração de dados coletados

**App Store Connect:**
- Título, subtítulo, descrição
- Screenshots, keywords
- Privacy Nutrition Labels
- Notas para revisão + conta demo

---

## 📅 TIMELINE RECOMENDADA

```
SEMANA 1: [====================] Compliance Legal (CRÍTICO)
          - Estrutura de pastas
          - Consentimento LGPD no app
          - Contratar advogado

SEMANA 2: [====================] Features + Assets
          - Autenticação real
          - Moderação básica
          - Ícones/screenshots

SEMANA 3: [====================] Assets + Config
          - Feature graphic
          - Configurar contas developer
          - Credenciais EAS

SEMANA 4: [====================] Testes
          - Build preview
          - Testes internos
          - Ajustes

SEMANA 5: [==========          ] Finalização
          - Metadados lojas
          - Build produção
          - Submissão
```

---

## 🚨 AÇÕES IMEDIATAS (HOJE)

### 1. Criar Branch de Release
```bash
git checkout -b release/v1.0.0-pre-production
```

### 2. Criar Estrutura de Compliance
```bash
mkdir -p docs/legal
mkdir -p docs/assets/screenshots/{ios,android}
mkdir -p docs/assets/marketing
touch docs/legal/privacy-policy.md
touch docs/legal/terms-of-service.md
```

### 3. Implementar Consentimento LGPD
- Editar `src/screens/OnboardingScreen.tsx`
- Adicionar checkboxes de consentimento
- Validar antes de coletar dados

### 4. Atualizar .gitignore
```bash
echo "service-account-key.json" >> .gitignore
echo "*.p12" >> .gitignore
echo ".env.production" >> .gitignore
```

### 5. Contratar Advogado LGPD
- Buscar em OAB ou escritórios especializados
- Solicitar orçamento
- Iniciar processo (1-2 semanas)

---

## 💰 BREAKDOWN DE CUSTOS

| Item | Custo | Prioridade |
|------|-------|------------|
| Advogado LGPD | R$ 2.000 - 5.000 | 🔴 CRÍTICO |
| Apple Developer | R$ 500/ano | 🟡 ALTA |
| Google Play Developer | R$ 130 (one-time) | 🟡 ALTA |
| Designer (ícones) | R$ 1.000 - 2.000 | 🟡 ALTA |
| Designer (screenshots) | R$ 500 - 1.500 | 🟡 MÉDIA |
| Domínio + Hospedagem | R$ 150/ano | 🟡 MÉDIA |
| **TOTAL** | **R$ 4.280 - 9.280** | |

---

## ✅ CHECKLIST RÁPIDO

### Esta Semana (Semana 1)
- [ ] Criar estrutura de compliance
- [ ] Implementar consentimento LGPD no app
- [ ] Contratar advogado LGPD
- [ ] Atualizar .gitignore
- [ ] Criar branch release/v1.0.0-pre-production

### Próxima Semana (Semana 2)
- [ ] Substituir autenticação temporária
- [ ] Adicionar justificativas de permissões
- [ ] Implementar moderação básica
- [ ] Criar/contratar ícones e splash
- [ ] Criar screenshots

### Semanas 3-4
- [ ] Configurar Apple Developer Account
- [ ] Configurar Google Play Developer Account
- [ ] Atualizar credenciais EAS
- [ ] Criar feature graphic

### Semanas 5-6
- [ ] Build preview e testes
- [ ] Preparar metadados para lojas
- [ ] Build produção
- [ ] Submeter para review

---

## 🎯 RECOMENDAÇÃO FINAL

**NÃO PUBLIQUE AINDA.** Comece pela Semana 1 (Compliance Legal) - é o bloqueador mais crítico e leva mais tempo. Enquanto isso, você pode trabalhar em paralelo nas features e assets.

**Prioridade de execução:**
1. 🔴 **HOJE:** Implementar consentimento LGPD no app
2. 🔴 **ESTA SEMANA:** Contratar advogado LGPD
3. 🟡 **PRÓXIMA SEMANA:** Features críticas + Assets
4. 🟡 **SEMANAS 3-4:** Configuração técnica
5. 🟢 **SEMANAS 5-6:** Testes e submissão

---

**Criado em:** 2025-11-06  
**Baseado em:** RELATORIO-ANALISE-MOBILE.md  
**Próxima revisão:** Após completar Semana 1

