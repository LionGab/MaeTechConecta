# 📋 FASE 3: CONFIGURAÇÃO DE SECRETS - Resumo Rápido

**Tempo estimado:** 1 hora

## ✅ O Que Foi Criado

1. **Scripts de Automação:**
   - `scripts/setup-secrets.sh` - Configurar secrets no Supabase (Linux/macOS)
   - `scripts/setup-secrets.ps1` - Configurar secrets no Supabase (Windows)
   - `scripts/validate-secrets.sh` - Validar secrets configurados

2. **Documentação:**
   - `docs/FASE3_CONFIGURACAO_SECRETS.md` - Guia completo passo a passo
   - `scripts/checklist-secrets.md` - Checklist detalhado
   - `.env.example` - Template de variáveis de ambiente

## 🚀 Como Usar

### 1. Configurar Secrets no Supabase

**Linux/macOS:**

```bash
chmod +x scripts/setup-secrets.sh
./scripts/setup-secrets.sh
```

**Windows:**

```powershell
.\scripts\setup-secrets.ps1
```

### 2. Configurar Secrets no GitHub

1. Acesse: `https://github.com/SEU-USUARIO/nossa-maternidade/settings/secrets/actions`
2. Clique em "New repository secret"
3. Adicione cada secret conforme `docs/FASE3_CONFIGURACAO_SECRETS.md`

### 3. Validar Configuração

```bash
./scripts/validate-secrets.sh
```

## 📋 Secrets Necessários

### GitHub Secrets

- `EXPO_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_ID`
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`
- `OPENAI_API_KEY` (opcional)
- `SENTRY_AUTH_TOKEN` (opcional)

### Supabase Secrets

- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY` (opcional)
- `SUPABASE_URL` (geralmente automático)
- `SUPABASE_ANON_KEY` (geralmente automático)

## 📚 Documentação Completa

Para instruções detalhadas, consulte:

- **Guia completo:** `docs/FASE3_CONFIGURACAO_SECRETS.md`
- **Checklist:** `scripts/checklist-secrets.md`
- **Template:** `.env.example`

## ⚠️ Importante

- ⚠️ **NUNCA** commite secrets no código
- ✅ Use sempre GitHub Secrets para CI/CD
- ✅ Use sempre Supabase Secrets para Edge Functions
- ✅ Rotacione secrets a cada 90 dias

---

**Próximo passo:** Fase 4 - Configuração de CI/CD
