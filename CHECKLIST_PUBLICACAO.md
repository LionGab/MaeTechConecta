# ✅ Checklist de Publicação - iOS/Android

**Versão:** Checklist rápido para acompanhamento  
**Use junto com:** `PLANO_ACAO_IOS_ANDROID.md`

---

## 📱 FASE 1: CONFIGURAÇÃO BASE

- [ ] Projeto Supabase criado
- [ ] Schema SQL executado
- [ ] Variáveis `.env.local` preenchidas
- [ ] Gemini API configurada (Supabase Secrets)
- [ ] Edge Function `nathia-chat` deployed
- [ ] App rodando localmente com Expo Go

**Tempo:** 2-3 horas  
**Status:** ⏳

---

## ⚖️ FASE 2: COMPLIANCE LEGAL

- [ ] Advogado LGPD contratado OU templates escolhidos
- [ ] Privacy Policy criada e hosteada (URL pública)
- [ ] Terms of Service criados e hosteados (URL pública)
- [ ] Componente `LGPDConsent` implementado
- [ ] Consentimentos integrados no OnboardingScreen
- [ ] Consentimentos salvos no banco (`user_profiles.consent_*`)

**Tempo:** 2-3 semanas (legal) + 4 horas (dev)  
**Status:** ⏳

---

## 🔐 FASE 3: AUTENTICAÇÃO REAL

- [ ] Apple Sign-In configurado (iOS)
- [ ] Google Sign-In configurado (Android)
- [ ] Autenticação fake removida do OnboardingScreen
- [ ] Testado em simulador iOS
- [ ] Testado em emulador Android

**Tempo:** 1-2 dias  
**Status:** ⏳

---

## 🔧 FASE 4: CORREÇÕES

- [ ] ProfileScreen: botões fake removidos OU "Coming Soon" adicionado
- [ ] ProfileScreen: acessibilidade completa (WCAG 2.1 AA)
- [ ] DailyPlanScreen: acessibilidade completa (WCAG 2.1 AA)
- [ ] SafeAreaView em todas as telas
- [ ] Pull-to-refresh implementado onde falta
- [ ] Emojis substituídos por ícones (opcional)

**Tempo:** 1-2 dias  
**Status:** ⏳

---

## 🎨 FASE 5: ASSETS

- [ ] App Icon iOS (1024x1024px)
- [ ] App Icon Android (512x512px)
- [ ] Splash Screen iOS
- [ ] Splash Screen Android
- [ ] Screenshots iOS (mínimo 2, recomendado 8)
- [ ] Screenshots Android (mínimo 2, recomendado 8)
- [ ] Feature Graphic Android (1024x500px)

**Tempo:** 1 dia  
**Status:** ⏳

---

## 🏗️ FASE 6: BUILD E TESTE

- [ ] EAS CLI instalado e configurado
- [ ] Credenciais iOS configuradas (Apple Developer Account)
- [ ] Credenciais Android configuradas (Google Play Console)
- [ ] Build development iOS funcionando
- [ ] Build development Android funcionando
- [ ] TestFlight configurado (iOS)
- [ ] Google Play Internal Testing configurado
- [ ] Testado em dispositivos físicos
- [ ] Bugs críticos corrigidos

**Tempo:** 1-2 dias  
**Status:** ⏳

---

## 🚀 FASE 7: SUBMISSÃO

### Apple App Store
- [ ] App Store Connect listing criado
- [ ] Informações preenchidas (nome, descrição, categoria)
- [ ] Screenshots enviados
- [ ] Privacy Policy URL configurada
- [ ] Terms of Service URL configurada
- [ ] App submetido para review
- [ ] Aguardando aprovação (1-3 dias)

### Google Play Store
- [ ] Google Play Console listing criado
- [ ] Informações preenchidas (nome, descrição, categoria)
- [ ] Screenshots enviados
- [ ] Feature Graphic enviado
- [ ] Privacy Policy URL configurada (obrigatório)
- [ ] Terms of Service URL configurada
- [ ] App submetido para review
- [ ] Aguardando aprovação (1-7 dias)

**Tempo:** 2-3 dias + aprovação  
**Status:** ⏳

---

## 📊 PROGRESSO GERAL

```
Fase 1: Configuração Base     [░░░░░░░░░░] 0%
Fase 2: Compliance Legal       [░░░░░░░░░░] 0%
Fase 3: Autenticação Real      [░░░░░░░░░░] 0%
Fase 4: Correções              [░░░░░░░░░░] 0%
Fase 5: Assets                 [░░░░░░░░░░] 0%
Fase 6: Build e Teste          [░░░░░░░░░░] 0%
Fase 7: Submissão              [░░░░░░░░░░] 0%

TOTAL: [░░░░░░░░░░] 0%
```

---

## 🎯 PRÓXIMAS AÇÕES (HOJE)

1. [ ] Configurar Supabase
2. [ ] Preencher .env.local
3. [ ] Configurar Gemini API
4. [ ] Deploy Edge Function
5. [ ] Testar app localmente

**Tempo estimado:** 2-3 horas

---

## 📚 DOCUMENTAÇÃO RELACIONADA

- `PLANO_ACAO_IOS_ANDROID.md` - Plano completo detalhado
- `PLANO_ACAO_RAPIDO.md` - Versão rápida executável
- `COMO-DEIXAR-APP-FUNCIONAL.md` - Guia de configuração
- `DESIGN-REVIEW-CONSOLIDATED.md` - Análise de blockers

---

**Atualize este checklist conforme progride!** ✅

