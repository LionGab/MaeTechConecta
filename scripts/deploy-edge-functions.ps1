# Script PowerShell para Deploy Rápido das Edge Functions
# Uso: .\scripts\deploy-edge-functions.ps1

Write-Host "🚀 Deploy Edge Functions - MVP Ultrathin" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está logado no Supabase
Write-Host "🔍 Verificando conexão Supabase..." -ForegroundColor Yellow
$status = supabase status 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Supabase não conectado!" -ForegroundColor Red
    Write-Host "Execute: supabase link --project-ref mnszbkeuerjcevjvdqme" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Supabase conectado!" -ForegroundColor Green
Write-Host ""

# Verificar se GEMINI_API_KEY está configurada
Write-Host "🔑 Verificando secrets..." -ForegroundColor Yellow
$secrets = supabase secrets list 2>&1

if ($secrets -notmatch "GEMINI_API_KEY") {
    Write-Host "⚠️  GEMINI_API_KEY não configurada!" -ForegroundColor Yellow
    $geminiKey = Read-Host "Cole sua Gemini API Key"
    
    if ($geminiKey) {
        Write-Host "🔐 Configurando GEMINI_API_KEY..." -ForegroundColor Yellow
        supabase secrets set GEMINI_API_KEY=$geminiKey
        supabase secrets set LLM_PROVIDER="gemini"
        Write-Host "✅ Secrets configurados!" -ForegroundColor Green
    } else {
        Write-Host "❌ Gemini API Key é obrigatória!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Secrets já configurados!" -ForegroundColor Green
}

Write-Host ""

# Deploy functions essenciais
Write-Host "📦 Deployando Edge Functions..." -ForegroundColor Yellow
Write-Host ""

# 1. nathia-chat (OBRIGATÓRIO)
Write-Host "1/2 Deployando nathia-chat..." -ForegroundColor Cyan
supabase functions deploy nathia-chat
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ nathia-chat deployed!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao deployar nathia-chat" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. personalize-tip (OBRIGATÓRIO)
Write-Host "2/2 Deployando personalize-tip..." -ForegroundColor Cyan
supabase functions deploy personalize-tip
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ personalize-tip deployed!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao deployar personalize-tip" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Deploy completo!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Teste as functions no Supabase Dashboard" -ForegroundColor White
Write-Host "2. Execute: eas build --platform android --profile preview" -ForegroundColor White

