# Script PowerShell - Git Keep Ours Auto (Sem Confirmação)
# Execute: .\scripts\git-keep-ours-auto.ps1
# ou: npm run git:keep-ours

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Git Keep Ours Auto - Manter Nosso (SKIP PERMISSIONS)" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está em um repositório Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Não é um repositório Git!" -ForegroundColor Red
    exit 1
}

Write-Host "🔄 Mantendo nossas mudanças (ours) automaticamente..." -ForegroundColor Green
git checkout --ours .

Write-Host "📝 Adicionando ao stage..." -ForegroundColor Green
git add -A

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "✅ Nossas mudanças mantidas (ours)!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

git status

Write-Host ""
Write-Host "✅ Git Keep Ours Auto concluído!" -ForegroundColor Green
Write-Host "💡 Próximo passo: git commit" -ForegroundColor Cyan
Write-Host ""

