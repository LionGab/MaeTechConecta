# Script PowerShell - Git Keep Theirs (Merge Conflicts)
# Execute: .\git-keep-theirs.ps1
# Mantém todas as mudanças DELES durante conflitos de merge

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Git Keep Theirs - Manter Deles" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está em um repositório Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Não é um repositório Git!" -ForegroundColor Red
    exit 1
}

Write-Host "⚠️  ATENÇÃO: Isso vai manter TODAS as mudanças deles!" -ForegroundColor Yellow
Write-Host "Suas mudanças locais serão SUBSTITUÍDAS!" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "Tem certeza? (Digite 'SIM' para confirmar)"
if ($confirm -ne "SIM") {
    Write-Host "❌ Operação cancelada." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🔄 Mantendo mudanças deles (theirs)..." -ForegroundColor Green
git checkout --theirs .

Write-Host "📝 Adicionando ao stage..." -ForegroundColor Green
git add -A

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "✅ Mudanças mantidas (theirs)!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

git status

Write-Host ""
Write-Host "Próximo passo: git commit" -ForegroundColor Cyan
Write-Host ""
