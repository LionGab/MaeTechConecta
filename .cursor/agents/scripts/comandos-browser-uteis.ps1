# Script com comandos úteis para visualização no browser
# Execute comandos individuais conforme necessário

# Verificar se app está rodando
function Test-AppRunning {
    $port = netstat -ano | findstr ":8081"
    if ($port) {
        Write-Host "✅ App está rodando na porta 8081" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ App NÃO está rodando" -ForegroundColor Red
        Write-Host "Execute: cd apps/mobile && pnpm dev" -ForegroundColor Yellow
        return $false
    }
}

# Abrir browser
function Open-Browser {
    param(
        [string]$Url = "http://localhost:8081"
    )
    
    if (Test-AppRunning) {
        Write-Host "Abrindo browser em $Url..." -ForegroundColor Cyan
        Start-Process $Url
    } else {
        Write-Host "App não está rodando. Não é possível abrir browser." -ForegroundColor Red
    }
}

# Ver status completo
function Get-AppStatus {
    Write-Host "`n=== Status do App ===" -ForegroundColor Cyan
    Test-AppRunning
    Write-Host "`n=== Porta 8081 ===" -ForegroundColor Cyan
    netstat -ano | findstr ":8081" | Select-Object -First 5
    Write-Host ""
}

# Menu interativo
function Show-BrowserMenu {
    Write-Host "`n=== Menu de Visualização ===" -ForegroundColor Cyan
    Write-Host "1. Verificar status do app"
    Write-Host "2. Abrir browser"
    Write-Host "3. Ver status completo"
    Write-Host "4. Sair"
    Write-Host ""
    
    $choice = Read-Host "Escolha uma opção"
    
    switch ($choice) {
        "1" { Test-AppRunning }
        "2" { Open-Browser }
        "3" { Get-AppStatus }
        "4" { Write-Host "Saindo..." -ForegroundColor Yellow; exit }
        default { Write-Host "Opção inválida" -ForegroundColor Red }
    }
}

# Exportar funções (se executar com . .\comandos-browser-uteis.ps1)
# Test-AppRunning
# Open-Browser
# Get-AppStatus

# Executar menu se executar diretamente
if ($MyInvocation.InvocationName -ne '.') {
    Show-BrowserMenu
}

