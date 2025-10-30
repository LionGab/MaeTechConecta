# Script PowerShell - Git Keep Ours (Merge Conflicts)
# Execute: .\git-keep-ours.ps1
# Mantém todas as mudanças NOSSAS durante conflitos de merge

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Git Keep Ours - Manter Nosso" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está em um repositório Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Não é um repositório Git!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Isso vai manter TODAS as nossas mudanças!" -ForegroundColor Green
Write-Host "Mudanças deles serão descartadas!" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Tem certeza? (Digite 'SIM' para confirmar)"
if ($confirm -ne "SIM") {
    Write-Host "❌ Operação cancelada." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🔄 Mantendo nossas mudanças (ours)..." -ForegroundColor Green
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
Write-Host "Próximo passo: git commit" -ForegroundColor Cyan
Write-Host ""
