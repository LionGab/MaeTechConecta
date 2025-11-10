# Script PowerShell para Setup MVP Ultrathin
# Uso: .\scripts\setup-mvp-ultrathin.ps1

Write-Host "🚀 MVP ULTRATHIN - Setup Rápido" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
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

Write-Host "📝 Criando .env.local..." -ForegroundColor Green

# Template básico
$envContent = @"
# =============================================================================
# NOSSA MATERNIDADE - Environment Variables (.env.local)
# =============================================================================
# ⚠️ IMPORTANTE: Preencha as variáveis abaixo com suas keys reais
# =============================================================================

# -----------------------------------------------------------------------------
# SUPABASE - Database & Authentication (OBRIGATÓRIO)
# -----------------------------------------------------------------------------
# Obter em: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/settings/api
EXPO_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=COLE_SUA_ANON_KEY_AQUI

# -----------------------------------------------------------------------------
# GEMINI AI (OBRIGATÓRIO para chat funcionar)
# -----------------------------------------------------------------------------
# Obter em: https://makersuite.google.com/app/apikey
EXPO_PUBLIC_GEMINI_API_KEY=COLE_SUA_GEMINI_KEY_AQUI

# -----------------------------------------------------------------------------
# SENTRY (OPCIONAL - monitoramento de erros)
# -----------------------------------------------------------------------------
# Obter em: https://sentry.io/settings/projects/
EXPO_PUBLIC_SENTRY_DSN=
"@

$envContent | Out-File -FilePath .env.local -Encoding utf8

Write-Host "✅ Arquivo .env.local criado!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Edite .env.local e preencha as keys:" -ForegroundColor White
Write-Host "   - EXPO_PUBLIC_SUPABASE_ANON_KEY (Supabase Dashboard → Settings → API)" -ForegroundColor Gray
Write-Host "   - EXPO_PUBLIC_GEMINI_API_KEY (https://makersuite.google.com/app/apikey)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Execute migrations:" -ForegroundColor White
Write-Host "   supabase db push" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy Edge Functions:" -ForegroundColor White
Write-Host "   supabase secrets set GEMINI_API_KEY=`"SUA_KEY`"" -ForegroundColor Gray
Write-Host "   supabase functions deploy nathia-chat" -ForegroundColor Gray
Write-Host "   supabase functions deploy personalize-tip" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Build EAS Preview:" -ForegroundColor White
Write-Host "   cd apps/mobile" -ForegroundColor Gray
Write-Host "   eas build --platform android --profile preview" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Guia completo: MVP_ULTRATHIN_DEPLOY_HOJE.md" -ForegroundColor Cyan

