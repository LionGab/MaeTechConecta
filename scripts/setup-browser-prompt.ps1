# Script para configurar browser no prompt do PowerShell
# Execute: .\scripts\setup-browser-prompt.ps1

Write-Host "🚀 Configurando browser no prompt do PowerShell..." -ForegroundColor Cyan

$profilePath = $PROFILE
$profileDir = Split-Path $profilePath

# Criar diretório se não existir
if (-not (Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
    Write-Host "✅ Diretório criado: $profileDir" -ForegroundColor Green
}

# Caminho do script de browser info
$browserScriptPath = Join-Path $PSScriptRoot "get-browser-info.ps1"
$browserScriptRelative = "`$PSScriptRoot\scripts\get-browser-info.ps1"

# Conteúdo do profile
$profileContent = @"
# PowerShell Profile - Browser Info
# Carregado automaticamente no início do PowerShell

# Carregar função de browser info
if (Test-Path `"$browserScriptPath`") {
    . `"$browserScriptPath`"
} elseif (Test-Path `"$browserScriptRelative`") {
    . `"$browserScriptRelative`"
}

# Função para obter info do browser formatada
function Get-BrowserInfo {
    `$browser = Get-ActiveBrowser
    if (`$browser) {
        `$status = if (`$browser.running) { '🟢' } else { '⚪' }
        return "`$(`$browser.icon) `$(`$browser.name) `$status"
    }
    return ''
}

# Customizar prompt para incluir browser
function prompt {
    # Info do browser
    `$browser = Get-ActiveBrowser
    `$browserInfo = ''
    if (`$browser) {
        `$status = if (`$browser.running) { '🟢' } else { '⚪' }
        `$browserInfo = "`$(`$browser.icon) `$(`$browser.name) `$status | "
    }
    
    # Prompt base
    `$location = Get-Location
    `$path = if (`$location.Path.Length -gt 50) {
        '...' + `$location.Path.Substring(`$location.Path.Length - 47)
    } else {
        `$location.Path
    }
    
    # Branch do Git (se houver)
    `$gitBranch = ''
    try {
        `$gitStatus = git rev-parse --abbrev-ref HEAD 2>$null
        if (`$gitStatus) {
            `$gitBranch = " 🌿 [`$gitStatus]"
        }
    } catch { }
    
    # Montar prompt com cores ANSI
    `$promptText = ''
    
    # Browser info (com cor)
    if (`$browserInfo) {
        if (`$browser.running) {
            `$promptText += "`e[32m"  # Green
        } else {
            `$promptText += "`e[90m"  # DarkGray
        }
        `$promptText += `$browserInfo
        `$promptText += "`e[0m"  # Reset
    }
    
    # Path (Cyan)
    `$promptText += "`e[36m`$path`e[0m"
    
    # Git branch (Yellow)
    if (`$gitBranch) {
        `$promptText += "`e[33m`$gitBranch`e[0m"
    }
    
    # Nova linha e prompt PS
    `$promptText += "`n"
    `$promptText += "`e[34mPS`e[0m "  # Blue
    `$promptText += "`e[37m> `e[0m"   # White
    
    return `$promptText
}

Write-Host "✅ Browser configurado no prompt!" -ForegroundColor Green
"@

# Verificar se profile já existe
if (Test-Path $profilePath) {
    $backupPath = "$profilePath.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $profilePath -Destination $backupPath
    Write-Host "📋 Backup criado: $backupPath" -ForegroundColor Yellow
    
    # Verificar se já tem a configuração
    $currentContent = Get-Content $profilePath -Raw
    if ($currentContent -match 'Get-BrowserInfo|Get-ActiveBrowser') {
        Write-Host "⚠️  Browser já está configurado no profile" -ForegroundColor Yellow
        $response = Read-Host "Deseja sobrescrever? (S/N)"
        if ($response -ne 'S' -and $response -ne 's') {
            Write-Host "❌ Operação cancelada" -ForegroundColor Red
            exit 0
        }
    }
}

# Adicionar ou criar profile
if (Test-Path $profilePath) {
    $currentContent = Get-Content $profilePath -Raw
    if ($currentContent -notmatch 'Get-BrowserInfo|Get-ActiveBrowser') {
        # Adicionar ao final do profile existente
        Add-Content -Path $profilePath -Value "`n`n# Browser Info - Adicionado em $(Get-Date)`n"
        Add-Content -Path $profilePath -Value $profileContent
        Write-Host "✅ Browser adicionado ao profile existente" -ForegroundColor Green
    } else {
        # Sobrescrever seção do browser
        Write-Host "🔄 Atualizando configuração do browser..." -ForegroundColor Yellow
        Set-Content -Path $profilePath -Value $profileContent
        Write-Host "✅ Profile atualizado" -ForegroundColor Green
    }
} else {
    # Criar novo profile
    Set-Content -Path $profilePath -Value $profileContent
    Write-Host "✅ Profile criado: $profilePath" -ForegroundColor Green
}

Write-Host "`n✨ Configuração concluída!" -ForegroundColor Green
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Feche e reabra o terminal PowerShell" -ForegroundColor White
Write-Host "   2. O browser aparecerá no prompt automaticamente" -ForegroundColor White
Write-Host "   3. Execute 'Get-ActiveBrowser' para ver detalhes" -ForegroundColor White
Write-Host "`n📖 Para testar agora, execute: . `$PROFILE" -ForegroundColor Gray
