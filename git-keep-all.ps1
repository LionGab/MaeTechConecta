# Script PowerShell - Git Keep All
# Execute: .\git-keep-all.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Git Keep All - Adicionar Tudo" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está em um repositório Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Não é um repositório Git!" -ForegroundColor Red
    Write-Host "Execute este comando dentro de uma pasta Git." -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Status atual:" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "🔄 Adicionando todas as mudanças..." -ForegroundColor Green
git add --all

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "✅ Todas as mudanças adicionadas!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Status após add:" -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. git commit -m 'sua mensagem'" -ForegroundColor White
Write-Host "2. git push" -ForegroundColor White
Write-Host ""

# Perguntar se quer fazer commit
$response = Read-Host "Deseja fazer commit agora? (S/N)"
if ($response -eq "S" -or $response -eq "s") {
    $message = Read-Host "Digite a mensagem do commit"
    if ($message) {
        git commit -m $message
        Write-Host "✅ Commit realizado!" -ForegroundColor Green

        $push = Read-Host "Deseja fazer push? (S/N)"
        if ($push -eq "S" -or $push -eq "s") {
            git push
            Write-Host "✅ Push realizado!" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
