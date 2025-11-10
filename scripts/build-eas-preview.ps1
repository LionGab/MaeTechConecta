# Script PowerShell para Build EAS Preview
# Uso: .\scripts\build-eas-preview.ps1

Write-Host "🚀 Build EAS Preview - MVP Ultrathin" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está no diretório correto
if (-not (Test-Path "apps/mobile")) {
    Write-Host "❌ Execute este script da raiz do projeto!" -ForegroundColor Red
    exit 1
}

# Verificar se EAS CLI está instalado
Write-Host "🔍 Verificando EAS CLI..." -ForegroundColor Yellow
$easVersion = eas --version 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  EAS CLI não encontrado!" -ForegroundColor Yellow
    $install = Read-Host "Instalar EAS CLI? (s/N)"
    
    if ($install -eq "s" -or $install -eq "S") {
        Write-Host "📦 Instalando EAS CLI..." -ForegroundColor Yellow
        npm install -g eas-cli
    } else {
        Write-Host "❌ EAS CLI é obrigatório!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ EAS CLI encontrado!" -ForegroundColor Green
Write-Host ""

# Verificar login
Write-Host "🔍 Verificando login EAS..." -ForegroundColor Yellow
$whoami = eas whoami 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Não está logado no EAS!" -ForegroundColor Yellow
    Write-Host "🔐 Fazendo login..." -ForegroundColor Yellow
    eas login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao fazer login!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Logado no EAS!" -ForegroundColor Green
Write-Host ""

# Navegar para apps/mobile
Set-Location apps/mobile

Write-Host "📦 Iniciando build Android Preview..." -ForegroundColor Yellow
Write-Host "⏳ Isso pode levar 15-30 minutos..." -ForegroundColor Gray
Write-Host ""

# Build Android Preview
eas build --platform android --profile preview

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Build iniciado com sucesso!" -ForegroundColor Green
    Write-Host "📱 Acompanhe o progresso no link acima" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Erro ao iniciar build!" -ForegroundColor Red
    exit 1
}

# Voltar para raiz
Set-Location ../..

