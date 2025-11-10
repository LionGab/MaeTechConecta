# Script PowerShell para criar arquivo .env.local
# Uso: .\scripts\create-env-local.ps1

Write-Host "🔐 Criando arquivo .env.local..." -ForegroundColor Cyan
Write-Host ""

# Verificar se .env.local já existe
if (Test-Path .env.local) {
    Write-Host "⚠️  Arquivo .env.local já existe!" -ForegroundColor Yellow
    $overwrite = Read-Host "Deseja sobrescrever? (s/N)"
    if ($overwrite -ne "s" -and $overwrite -ne "S") {
        Write-Host "❌ Operação cancelada" -ForegroundColor Red
        exit 0
    }
}

# Verificar se .env.example existe
if (-not (Test-Path .env.example)) {
    Write-Host "⚠️  Arquivo .env.example não encontrado!" -ForegroundColor Yellow
    Write-Host "Criando template básico..." -ForegroundColor Yellow
}

# Criar conteúdo do .env.local com template
$envContent = @"
# =============================================================================
# NOSSA MATERNIDADE - Environment Variables (.env.local)
# =============================================================================
# ⚠️ Preencha apenas com novas chaves após revogar as anteriores
# =============================================================================

# ----------------------------------------------------------------------------- 
# SUPABASE - Database & Authentication
# ----------------------------------6-------------------------------------------
# ⚠️ IMPORTANTE: Expo requer prefixo EXPO_PUBLIC_* para variáveis públicas
EXPO_PUBLIC_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=REDACTED_JWT.REDACTED_JWT.a9g_JqrWWnLli_PV0sPikz8KPAWiKY81mQ1hJAbNtCo

# Service Role Key (NUNCA exponha publicamente - não usar EXPO_PUBLIC_*)
SUPABASE_SERVICE_ROLE_KEY=REDACTED_JWT.REDACTED_JWT.K0H61Di0itgPw-CTFVGtWG_XAYwg2mxKS8H_s1WKW-M

# Redirect URLs
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding
NEXT_PUBLIC_PROD_SUPABASE_REDIRECT_URL=https://nossamaternidade.netlify.app/onboarding

# ----------------------------------------------------------------------------- 
# ANTHROPIC - Claude AI
# -----------------------------------------------------------------------------
EXPO_PUBLIC_CLAUDE_API_KEY=sk-REDACTED
ANTHROPIC_API_KEY=sk-REDACTED

# ----------------------------------------------------------------------------- 
# OPENAI - GPT-4 / GPT-4o (conteúdo e recomendações)
# -----------------------------------------------------------------------------
EXPO_PUBLIC_OPENAI_API_KEY=sk-REDACTED
OPENAI_API_KEY=sk-REDACTED

# ----------------------------------------------------------------------------- 
# GOOGLE AI (Gemini)
# -----------------------------------------------------------------------------
EXPO_PUBLIC_GEMINI_API_KEY=AIzaREDACTED
GOOGLE_AI_API_KEY=AIzaREDACTED

# ----------------------------------------------------------------------------- 
# PERPLEXITY - IA de busca contextual
# -----------------------------------------------------------------------------
EXPO_PUBLIC_PERPLEXITY_API_KEY=pplx-REDACTED
PERPLEXITY_API_KEY=pplx-REDACTED

# ----------------------------------------------------------------------------- 
# CONFIGURAÇÕES DE AMBIENTE
# -----------------------------------------------------------------------------
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ----------------------------------------------------------------------------- 
# FEATURE FLAGS
# -----------------------------------------------------------------------------
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
EXPO_PUBLIC_ENABLE_GAMIFICATION=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false

# ----------------------------------------------------------------------------- 
# RATE LIMITING
# -----------------------------------------------------------------------------
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# =============================================================================
# ⚠️ NOTAS
# =============================================================================
# 1. Revogue as chaves antigas imediatamente (já expostas)
# 2. Gere novas chaves em cada plataforma
# 3. Atualize este arquivo e adicione ao .gitignore
# 4. Configure as mesmas variáveis no Netlify Dashboard
# 5. Nunca exponha SUPABASE_SERVICE_ROLE_KEY publicamente
# 6. Expo requer prefixo EXPO_PUBLIC_* para variáveis acessíveis no cliente
# =============================================================================
"@

# Escrever arquivo
try {
    $envContent | Out-File -FilePath .env.local -Encoding utf8 -NoNewline
    Write-Host "✅ Arquivo .env.local criado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Verifique se todas as chaves estão corretas" -ForegroundColor Yellow
    Write-Host "2. Revogue as chaves antigas se necessário" -ForegroundColor Yellow
    Write-Host "3. Configure as mesmas variáveis no Netlify Dashboard" -ForegroundColor Yellow
    Write-Host "4. Configure as variáveis no GitHub Secrets para CI/CD" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: O arquivo .env.local já está no .gitignore" -ForegroundColor Yellow
    Write-Host "⚠️  NUNCA commite este arquivo!" -ForegroundColor Red
} catch {
    Write-Host "❌ Erro ao criar arquivo: $_" -ForegroundColor Red
    exit 1
}


