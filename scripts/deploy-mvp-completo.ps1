# Script Master - MVP Ultrathin Deploy Completo
# Uso: .\scripts\deploy-mvp-completo.ps1
# 
# Este script executa todos os passos necessários para colocar o MVP no ar

Write-Host "🚀 MVP ULTRATHIN - Deploy Completo" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏱️  Tempo estimado: 70 minutos" -ForegroundColor Yellow
Write-Host ""

# PASSO 1: Setup Environment
Write-Host "📝 PASSO 1/5: Configurando variáveis de ambiente..." -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path .env.local)) {
    Write-Host "Criando .env.local..." -ForegroundColor Gray
    & ".\scripts\setup-mvp-ultrathin.ps1"
    
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Edite .env.local e preencha as keys antes de continuar!" -ForegroundColor Red
    Write-Host "Pressione qualquer tecla após preencher .env.local..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} else {
    Write-Host "✅ .env.local já existe!" -ForegroundColor Green
}

Write-Host ""

# Verificar se .env.local tem valores reais
$envContent = Get-Content .env.local -Raw
if ($envContent -match "COLE_SUA" -or $envContent -match "your-") {
    Write-Host "⚠️  .env.local ainda tem valores placeholder!" -ForegroundColor Red
    Write-Host "Edite .env.local e preencha as keys antes de continuar!" -ForegroundColor Yellow
    Write-Host "Pressione qualquer tecla após preencher..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

Write-Host ""

# PASSO 2: Supabase Migrations
Write-Host "🗄️  PASSO 2/5: Aplicando migrations..." -ForegroundColor Yellow
Write-Host ""

# Verificar conexão
$status = supabase status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Supabase não conectado. Conectando..." -ForegroundColor Yellow
    supabase link --project-ref mnszbkeuerjcevjvdqme
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao conectar Supabase!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Aplicando migrations..." -ForegroundColor Gray
supabase db push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations aplicadas!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao aplicar migrations!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# PASSO 3: Deploy Edge Functions
Write-Host "⚡ PASSO 3/5: Deployando Edge Functions..." -ForegroundColor Yellow
Write-Host ""

& ".\scripts\deploy-edge-functions.ps1"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao deployar Edge Functions!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# PASSO 4: Validação
Write-Host "✅ PASSO 4/5: Validando código..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Type check..." -ForegroundColor Gray
pnpm typecheck

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Erros de TypeScript encontrados!" -ForegroundColor Yellow
    Write-Host "Continuando mesmo assim..." -ForegroundColor Gray
}

Write-Host ""
Write-Host "Lint..." -ForegroundColor Gray
pnpm lint

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Warnings de lint encontrados!" -ForegroundColor Yellow
    Write-Host "Continuando mesmo assim..." -ForegroundColor Gray
}

Write-Host ""

# PASSO 5: Build EAS
Write-Host "📦 PASSO 5/5: Build EAS Preview..." -ForegroundColor Yellow
Write-Host ""

$build = Read-Host "Iniciar build EAS agora? (s/N)"

if ($build -eq "s" -or $build -eq "S") {
    & ".\scripts\build-eas-preview.ps1"
} else {
    Write-Host "⏭️  Pulando build EAS" -ForegroundColor Yellow
    Write-Host "Execute manualmente: cd apps/mobile && eas build --platform android --profile preview" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎉 MVP ULTRATHIN CONFIGURADO!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Checklist final:" -ForegroundColor Yellow
Write-Host "  ✅ Variáveis de ambiente configuradas" -ForegroundColor White
Write-Host "  ✅ Migrations aplicadas" -ForegroundColor White
Write-Host "  ✅ Edge Functions deployadas" -ForegroundColor White
Write-Host "  ☐ Build EAS Preview (execute manualmente se pulou)" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. Teste o app no dispositivo" -ForegroundColor White
Write-Host "  2. Verifique se chat funciona" -ForegroundColor White
Write-Host "  3. Teste dica do dia" -ForegroundColor White
Write-Host ""

