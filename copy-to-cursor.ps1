# Script PowerShell para Copiar Configurações para o Cursor
# Execute: .\copy-to-cursor.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Copiando configurações para Cursor" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$sourceDir = "$PSScriptRoot\.vscode"
$cursorConfig = "$env:APPDATA\Cursor\User"

# Criar pasta se não existir
if (-not (Test-Path $cursorConfig)) {
    Write-Host "Criando pasta de configuração do Cursor..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $cursorConfig -Force | Out-Null
}

# Copiar settings.json
Write-Host "Copiando settings.json..." -ForegroundColor Green
Copy-Item "$sourceDir\settings.json" -Destination "$cursorConfig\settings.json" -Force

# Copiar extensions.json (como referência)
Write-Host "Copiando extensions.json..." -ForegroundColor Green
Copy-Item "$sourceDir\extensions.json" -Destination "$cursorConfig\extensions.json" -Force

# Copiar launch.json
if (Test-Path "$sourceDir\launch.json") {
    Write-Host "Copiando launch.json..." -ForegroundColor Green
    Copy-Item "$sourceDir\launch.json" -Destination "$cursorConfig\launch.json" -Force
}

# Copiar mcp.json
if (Test-Path "$sourceDir\mcp.json") {
    Write-Host "Copiando mcp.json..." -ForegroundColor Green
    Copy-Item "$sourceDir\mcp.json" -Destination "$cursorConfig\mcp.json" -Force
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "✅ Configurações copiadas!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Arquivos copiados para:" -ForegroundColor Yellow
Write-Host $cursorConfig -ForegroundColor White
Write-Host ""
Write-Host "⚠️ Reinicie o Cursor para aplicar as configurações" -ForegroundColor Yellow
Write-Host ""

# Perguntar se quer abrir a pasta
$response = Read-Host "Deseja abrir a pasta de configuração do Cursor? (S/N)"
if ($response -eq "S" -or $response -eq "s") {
    explorer $cursorConfig
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
