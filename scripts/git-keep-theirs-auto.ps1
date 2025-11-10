# Script PowerShell - Git Keep Theirs Auto (Sem Confirmação)
# Execute: .\scripts\git-keep-theirs-auto.ps1
# ou: npm run git:keep-theirs

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Git Keep Theirs Auto - Manter Deles (SKIP PERMISSIONS)" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está em um repositório Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Não é um repositório Git!" -ForegroundColor Red
    exit 1
}

Write-Host "🔄 Mantendo mudanças deles (theirs) automaticamente..." -ForegroundColor Green
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
Write-Host "✅ Git Keep Theirs Auto concluído!" -ForegroundColor Green
Write-Host "💡 Próximo passo: git commit" -ForegroundColor Cyan
Write-Host ""


