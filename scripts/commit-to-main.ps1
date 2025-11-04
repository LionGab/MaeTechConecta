# Script para fazer commit e push na branch main
# Uso: .\scripts\commit-to-main.ps1

Write-Host "📦 Fazendo commit na branch main..." -ForegroundColor Cyan
Write-Host ""

# Verificar se está na branch main
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne "main") {
    Write-Host "⚠️  Você está na branch: $currentBranch" -ForegroundColor Yellow
    Write-Host "Deseja fazer commit nesta branch? (s/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "s" -and $response -ne "S") {
        Write-Host "❌ Commit cancelado" -ForegroundColor Red
        exit 1
    }
}

# Verificar status
Write-Host "📋 Status do Git:" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "📝 Adicionando mudanças..." -ForegroundColor Cyan
git add .

Write-Host ""
Write-Host "💾 Fazendo commit..." -ForegroundColor Cyan
git commit -m "feat: adicionar sistema de temas múltiplos e tema v0.app

- Criar sistema de gerenciamento de temas múltiplos
- Adicionar tema v0.app (estrutura pronta para preencher cores)
- Atualizar ThemeContext para suportar múltiplos temas
- Criar componente ThemeSelector para seleção de tema
- Adicionar helpers para gerar escalas de cores dinamicamente
- Criar documentação completa do sistema de temas
- Adicionar scripts e documentação para configuração de secrets (Fase 3)
- Corrigir script install-supabase-cli.ps1 (PATH comparison)
- Criar documentação para instalação do Supabase CLI no Windows"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit realizado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Fazendo push para origin/main..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Erro ao fazer push" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Erro ao fazer commit" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Concluído!" -ForegroundColor Green

