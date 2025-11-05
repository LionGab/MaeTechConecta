# Script PowerShell para fazer push de tudo para o remoto
# Uso: .\push-all.ps1

Write-Host "🚀 Iniciando push completo..." -ForegroundColor Cyan

# 1. Verificar status atual
Write-Host "`n📊 Verificando status do repositório..." -ForegroundColor Yellow
git status

# 2. Fetch para atualizar referências remotas
Write-Host "`n🔄 Buscando atualizações do remoto..." -ForegroundColor Yellow
git fetch origin

# 3. Push da branch atual primeiro
$currentBranch = git branch --show-current
Write-Host "`n📤 Fazendo push da branch atual: $currentBranch" -ForegroundColor Yellow
git push origin $currentBranch

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Erro ao fazer push da branch atual. Tentando com --force-with-lease..." -ForegroundColor Red
    git push origin $currentBranch --force-with-lease
}

# 4. Verificar se precisa fazer push de main
Write-Host "`n🔍 Verificando branch main..." -ForegroundColor Yellow

# Verificar se main está atrás do remoto
git checkout main
git pull origin main

# Verificar se há commits para fazer push
$mainStatus = git status -sb
if ($mainStatus -match "\[ahead") {
    Write-Host "`n📤 Fazendo push de main..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️ Erro ao fazer push de main. O remoto está à frente." -ForegroundColor Red
        Write-Host "💡 Fazendo pull com rebase..." -ForegroundColor Yellow
        git pull origin main --rebase
        git push origin main
    }
} else {
    Write-Host "✅ Branch main já está sincronizada" -ForegroundColor Green
}

# 5. Voltar para a branch original
Write-Host "`n🔄 Voltando para branch: $currentBranch" -ForegroundColor Yellow
git checkout $currentBranch

# 6. Push de todas as branches
Write-Host "`n📤 Fazendo push de todas as branches..." -ForegroundColor Yellow
git push --all origin

# 7. Push de todas as tags
Write-Host "`n🏷️ Fazendo push de todas as tags..." -ForegroundColor Yellow
git push --tags origin

Write-Host "`n✅ Push completo finalizado!" -ForegroundColor Green
Write-Host "📊 Status final:" -ForegroundColor Cyan
git status
