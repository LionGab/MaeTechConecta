# 🚀 Deploy em Produção - Nossa Maternidade

**Última atualização**: 2025-01-XX  
**Versão**: 1.0.0

---

## 📋 Pré-requisitos

### Antes de Fazer Deploy

- [ ] **Secrets configurados** no GitHub (`.github/workflows/*.yml`)
- [ ] **EAS configurado** (`eas.json` no `apps/mobile/`)
- [ ] **Supabase project** criado (dev/staging/prod)
- [ ] **Sentry project** configurado (app + functions)
- [ ] **Testes passando** (CI verde no GitHub Actions)
- [ ] **Ambientes isolados** (dev/staging/prod) configurados

---

## 🏷️ Release Train

### Cronograma

- **Semanal**: Toda quarta-feira (deploy de staging)
- **Quinzenal**: Toda segunda-feira (deploy de produção)
- **Hotfix**: Imediato (somente para bugs críticos)

### Canais EAS

1. **Internal** → Testes internos (time)
2. **Closed Beta** → Beta fechado (usuários selecionados)
3. **Production** → Produção (todos os usuários)

---

## 🚀 Deploy Automático (CI/CD)

### 1. Criar Tag de Release

```bash
# Versão semântica (ex: v1.0.0)
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### 2. Workflow Automático

O workflow `.github/workflows/release.yml` será disparado automaticamente:

1. **EAS Build** (Android + iOS)
   - Build de produção
   - Source maps gerados
   - Sentry release criado
   - Anexado ao tag GitHub

2. **EAS Submit** (Stores)
   - Android → Google Play (track: `internal` → `closed-beta` → `production`)
   - iOS → App Store (track: `internal` → `testflight` → `production`)
   - Status de submissão enviado para Slack/Email

3. **Edge Functions Deploy**
   - Deploy automático para Supabase
   - Migrations aplicadas
   - RLS policies ativadas

### 3. Verificar Release

- [ ] Builds completados com sucesso (EAS dashboard)
- [ ] Submissões nas stores ok (Google Play Console / App Store Connect)
- [ ] Sentry release visível (Sentry dashboard)
- [ ] Source maps carregados (Sentry releases)
- [ ] Edge Functions deployadas (Supabase dashboard)

---

## 📱 Build Manual (Local)

### Android

```bash
# Build de produção
cd apps/mobile
npx eas build --profile production --platform android --non-interactive

# Build de preview (staging)
npx eas build --profile preview --platform android --non-interactive

# Submit para Play Store
npx eas submit --platform android --latest --track production
```

### iOS

```bash
# Build de produção
cd apps/mobile
npx eas build --profile production --platform ios --non-interactive

# Build de preview (staging)
npx eas build --profile preview --platform ios --non-interactive

# Submit para App Store
npx eas submit --platform ios --latest --track production
```

---

## 🔄 Preview Deployments (PR)

### Automático via GitHub Actions

Cada PR cria automaticamente um preview deployment:

1. **EAS Preview Build** (mobile)
   - QR code gerado
   - Link para instalação
   - Comentado no PR
   - Ambiente isolado (staging Supabase)

---

## 🎯 Canais de Deploy

### Internal (Testes Internos)

```bash
# Build para internal track
npx eas build --profile internal --platform android --non-interactive
npx eas submit --platform android --latest --track internal
```

**Acesso**: Time interno (devs, QA)

### Closed Beta (Beta Fechado)

```bash
# Build para closed-beta track
npx eas build --profile preview --platform android --non-interactive
npx eas submit --platform android --latest --track closed-beta
```

**Acesso**: Usuários selecionados (testers)

### Production (Produção)

```bash
# Build para production track
npx eas build --profile production --platform android --non-interactive
npx eas submit --platform android --latest --track production
```

**Acesso**: Todos os usuários

---

## 🔍 Pós-Deploy

### Verificações Obrigatórias

#### 1. Sentry

- [ ] Release criado (`v1.0.0`)
- [ ] Source maps carregados
- [ ] Erros sendo capturados
- [ ] Performance metrics ativas

#### 2. Supabase

- [ ] Edge Functions deployadas
   - [ ] `nathia-chat`
   - [ ] `moderation-service`
   - [ ] `risk-classifier`
   - [ ] `behavior-analysis`
   - [ ] `lgpd-requests`
   - [ ] `transcribe-audio`
- [ ] Migrations aplicadas
- [ ] RLS policies ativas
- [ ] Logs funcionando

#### 3. App Stores

- [ ] **Android (Google Play)**:
  - [ ] Build submetido
  - [ ] Status de review
  - [ ] Track correto (internal/beta/production)
- [ ] **iOS (App Store)**:
  - [ ] Build submetido
  - [ ] Status de review
  - [ ] Track correto (internal/testflight/production)

#### 4. Analytics

- [ ] Amplitude eventos ativos
- [ ] Sentry errors mapeados
- [ ] Performance metrics coletadas

### Monitoramento (Primeiras 24h)

- **Sentry**: Verificar erros críticos (< 5min)
- **Supabase**: Logs de Edge Functions (< 5min)
- **EAS**: Status de builds e submissões (< 10min)
- **Analytics**: Funil de conversão (< 1h)

---

## 🚨 Rollback

### Em caso de problemas críticos:

#### 1. Reverter no GitHub

```bash
# Reverter tag (se necessário)
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0

# Criar hotfix
git checkout -b hotfix/v1.0.1
# ... fazer correções ...
git tag -a v1.0.1 -m "Hotfix v1.0.1"
git push origin v1.0.1
```

#### 2. Desabilitar Edge Functions

```bash
# Via Supabase CLI
supabase functions deploy nathia-chat --no-verify-jwt --disabled
```

#### 3. Reverter Migrations

```bash
# Via Supabase CLI
supabase migration down --version 20250104_xxxxx
```

#### 4. Monitorar Sentry

- Verificar erros críticos
- Analisar performance degradation
- Criar issue para correção

---

## 📊 Métricas de Sucesso

### Build & Deploy

- ✅ Build time < 10min (Android + iOS)
- ✅ Deploy time < 5min (Edge Functions)
- ✅ Zero downtime em deploys

### Performance

- ✅ Cold start < 2s (mobile)
- ✅ API latency < 500ms (p95)
- ✅ Screen load < 1s (p95)

### Qualidade

- ✅ Zero erros críticos (Sentry)
- ✅ Zero vulnerabilidades (security scan)
- ✅ Coverage ≥ 70% (testes)

---

## 🔐 Secrets e Ambientes

### Secrets no GitHub

Consulte **[docs/ENVIRONMENTS.md](./ENVIRONMENTS.md)** para lista completa de secrets.

### Ambientes

- **Development**: Local (`apps/mobile/.env.local`)
- **Staging**: Preview builds (`EXPO_PUBLIC_ENV=staging`)
- **Production**: Production builds (`EXPO_PUBLIC_ENV=production`)

---

## 📚 Referências

- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [Sentry Releases](https://docs.sentry.io/product/releases/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## 🆘 Troubleshooting

### Build falha

1. Verificar logs no EAS dashboard
2. Verificar secrets no GitHub
3. Verificar `eas.json` configurado corretamente
4. Tentar build local: `npx eas build --profile production --platform android --local`

### Submit falha

1. Verificar credenciais no App Store Connect / Google Play Console
2. Verificar track correto (internal/beta/production)
3. Verificar build anterior completado

### Edge Functions não deployam

1. Verificar Supabase CLI configurado
2. Verificar secrets no GitHub
3. Verificar logs no Supabase dashboard

---

**Última atualização**: 2025-01-XX  
**Mantido por**: Time Nossa Maternidade
