# Script para diagnosticar e corrigir problemas de acesso do PowerShell
# Execute: .\scripts\fix-powershell-access.ps1

Write-Host "🔍 Diagnosticando problemas de acesso do PowerShell..." -ForegroundColor Cyan
Write-Host ""

# Verificar permissões do diretório atual
$currentDir = Get-Location
Write-Host "📁 Diretório atual: $currentDir" -ForegroundColor Yellow

try {
    $testFile = Join-Path $currentDir "test-access.tmp"
    "test" | Out-File -FilePath $testFile -ErrorAction Stop
    Remove-Item $testFile -Force
    Write-Host "✅ Permissões de escrita: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Permissões de escrita: FALHOU" -ForegroundColor Red
    Write-Host "   Erro: $_" -ForegroundColor Red
}

# Verificar profile do PowerShell
Write-Host ""
Write-Host "📋 Verificando profile do PowerShell..." -ForegroundColor Yellow
$profilePath = $PROFILE

if (Test-Path $profilePath) {
    Write-Host "✅ Profile encontrado: $profilePath" -ForegroundColor Green
    try {
        $content = Get-Content $profilePath -ErrorAction Stop
        Write-Host "✅ Profile pode ser lido: OK" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro ao ler profile: $_" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Profile não encontrado: $profilePath" -ForegroundColor Yellow
}

# Verificar script de browser info
Write-Host ""
Write-Host "🌐 Verificando script de browser info..." -ForegroundColor Yellow
$browserScript = "C:\Users\Usuario\Documents\LionNath\scripts\get-browser-info.ps1"

if (Test-Path $browserScript) {
    Write-Host "✅ Script encontrado: $browserScript" -ForegroundColor Green
    try {
        . $browserScript
        $browser = Get-ActiveBrowser
        if ($browser) {
            Write-Host "✅ Função Get-ActiveBrowser: OK" -ForegroundColor Green
            Write-Host "   Browser detectado: $($browser.name) ($($browser.icon))" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "❌ Erro ao carregar script: $_" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Script não encontrado: $browserScript" -ForegroundColor Red
}

# Verificar extensão do PowerShell
Write-Host ""
Write-Host "🔌 Verificando configurações do PowerShell Extension..." -ForegroundColor Yellow

$vscodeSettings = ".vscode\settings.json"
if (Test-Path $vscodeSettings) {
    Write-Host "✅ Settings do VS Code encontrado" -ForegroundColor Green
    $settings = Get-Content $vscodeSettings -Raw | ConvertFrom-Json
    if ($settings.'powershell.scriptAnalysis.enable') {
        Write-Host "   Script Analysis: $($settings.'powershell.scriptAnalysis.enable')" -ForegroundColor Cyan
    }
    if ($settings.'powershell.integratedConsole.showOnStartup') {
        Write-Host "   Show on Startup: $($settings.'powershell.integratedConsole.showOnStartup')" -ForegroundColor Cyan
    }
}

# Sugestões de correção
Write-Host ""
Write-Host "💡 Sugestões:" -ForegroundColor Cyan
Write-Host "   1. Se houver erro de acesso, verifique permissões do diretório" -ForegroundColor White
Write-Host "   2. Execute PowerShell como administrador se necessário" -ForegroundColor White
Write-Host "   3. Verifique se o .gitignore não está bloqueando arquivos" -ForegroundColor White
Write-Host "   4. Feche e reabra o terminal após mudanças" -ForegroundColor White

Write-Host ""
Write-Host "✨ Diagnóstico concluído!" -ForegroundColor Green

