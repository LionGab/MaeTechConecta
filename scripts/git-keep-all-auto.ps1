# Script PowerShell - Git Keep All Auto (Sem Confirmação)
# Execute: .\scripts\git-keep-all-auto.ps1
# ou: npm run git:keep-all

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Git Keep All Auto - Adicionar Tudo (SKIP PERMISSIONS)" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está em um repositório Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Não é um repositório Git!" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Status atual:" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "🔄 Adicionando todas as mudanças automaticamente..." -ForegroundColor Green
git add --all

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "✅ Todas as mudanças adicionadas!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Status após add:" -ForegroundColor Yellow
git status

Write-Host ""

# Commit automático (se AUTO_COMMIT=true)
if ($env:AUTO_COMMIT -eq "true") {
    $commitMessage = $env:COMMIT_MESSAGE
    if (-not $commitMessage) {
        $commitMessage = "chore: auto commit"
    }
    
    Write-Host "💾 Fazendo commit automático..." -ForegroundColor Green
    git commit -m $commitMessage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Commit realizado!" -ForegroundColor Green
        
        # Push automático (se AUTO_PUSH=true)
        if ($env:AUTO_PUSH -eq "true") {
            Write-Host ""
            Write-Host "🚀 Fazendo push automático..." -ForegroundColor Green
            git push
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Push realizado!" -ForegroundColor Green
            }
        }
    }
}

Write-Host ""
Write-Host "✅ Git Keep All Auto concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Dicas:" -ForegroundColor Cyan
Write-Host "   - AUTO_COMMIT=true npm run git:keep-all 'mensagem' - Para commit automático" -ForegroundColor White
Write-Host "   - AUTO_PUSH=true npm run git:keep-all - Para push automático" -ForegroundColor White
Write-Host "   - AUTO_COMMIT=true AUTO_PUSH=true npm run git:keep-all 'mensagem' - Tudo automático" -ForegroundColor White
Write-Host ""


