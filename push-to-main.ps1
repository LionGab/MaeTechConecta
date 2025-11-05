# Script PowerShell para fazer merge da branch atual em main e push
# Uso: .\push-to-main.ps1

Write-Host "🚀 Fazendo merge da branch atual em main e push..." -ForegroundColor Cyan

# 1. Salvar branch atual
$currentBranch = git branch --show-current
Write-Host "`n📍 Branch atual: $currentBranch" -ForegroundColor Yellow

# 2. Verificar se há mudanças não commitadas
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️ Há mudanças não commitadas. Fazendo stash..." -ForegroundColor Yellow
    git stash push -m "Stash automático antes de merge em main"
}

# 3. Atualizar main local
Write-Host "`n🔄 Atualizando branch main..." -ForegroundColor Yellow
git checkout main
git pull origin main

# 4. Verificar se há conflitos potenciais
Write-Host "`n🔍 Verificando diferenças..." -ForegroundColor Yellow
$diff = git diff main $currentBranch --stat
if ($diff) {
    Write-Host "📋 Mudanças encontradas:" -ForegroundColor Cyan
    Write-Host $diff
}

# 5. Fazer merge da branch atual em main
Write-Host "`n🔀 Fazendo merge de $currentBranch em main..." -ForegroundColor Yellow
git merge $currentBranch --no-ff -m "Merge $currentBranch em main"

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Conflitos detectados! Resolva manualmente e depois:" -ForegroundColor Red
    Write-Host "   git add ." -ForegroundColor White
    Write-Host "   git commit -m 'Resolve merge conflicts'" -ForegroundColor White
    Write-Host "   git push origin main" -ForegroundColor White
    exit 1
}

# 6. Push para main
Write-Host "`n📤 Fazendo push para origin/main..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Erro ao fazer push. O remoto está à frente." -ForegroundColor Red
    Write-Host "💡 Tentando pull com rebase..." -ForegroundColor Yellow
    git pull origin main --rebase
    
    if ($LASTEXITCODE -eq 0) {
        git push origin main
    } else {
        Write-Host "❌ Erro ao fazer rebase. Resolva manualmente." -ForegroundColor Red
        exit 1
    }
}

# 7. Voltar para branch original
Write-Host "`n🔄 Voltando para branch: $currentBranch" -ForegroundColor Yellow
git checkout $currentBranch

# 8. Restaurar stash se houver
if ($status) {
    Write-Host "`n📦 Restaurando mudanças..." -ForegroundColor Yellow
    git stash pop
}

Write-Host "`n✅ Merge e push concluídos com sucesso!" -ForegroundColor Green
Write-Host "📊 Status final:" -ForegroundColor Cyan
git status
