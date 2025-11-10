# setup-terminal.ps1
# Script para configurar novo terminal com mesmo contexto

Write-Host "🔧 Configurando terminal..." -ForegroundColor Cyan

# 1. Navegar para o projeto
Set-Location C:\Users\Usuario\Documents\NossaMaternidade
Write-Host "✅ Diretório: $(Get-Location)" -ForegroundColor Green

# 2. Carregar variáveis de ambiente
if (Test-Path .env.local) {
    Get-Content .env.local | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, 'Process')
        }
    }
    Write-Host "✅ Variáveis de ambiente carregadas" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local não encontrado" -ForegroundColor Yellow
}

# 3. Verificar ferramentas
Write-Host "`n📋 Verificando ferramentas:" -ForegroundColor Cyan
Write-Host "  Node: $(node --version)" -ForegroundColor White
Write-Host "  pnpm: $(pnpm --version)" -ForegroundColor White
Write-Host "  Git: $(git --version)" -ForegroundColor White

# 4. Status do Git
Write-Host "`n📦 Status do Git:" -ForegroundColor Cyan
git status --short

# 5. Remotes configurados
Write-Host "`n🔗 Remotes:" -ForegroundColor Cyan
git remote -v

# 6. Branch atual
Write-Host "`n🌿 Branch atual:" -ForegroundColor Cyan
git branch --show-current

Write-Host "`n✅ Terminal configurado!" -ForegroundColor Green
Write-Host "💡 Comandos úteis:" -ForegroundColor Yellow
Write-Host "  - pnpm dev          # Iniciar app" -ForegroundColor Gray
Write-Host "  - pnpm validate     # Validar código" -ForegroundColor Gray
Write-Host "  - git status        # Ver status Git" -ForegroundColor Gray
Write-Host "  - git push origin main  # Push para origin" -ForegroundColor Gray
Write-Host "  - git push novo main    # Push para novo (privado)" -ForegroundColor Gray

