# Script PowerShell para fazer commit e push para main
# Uso: .\scripts\git-commit-push.ps1 "mensagem do commit"

param(
    [Parameter(Mandatory=$false)]
    [string]$Message = "Update: Configuração de environment variables e scripts"
)

Write-Host "📦 Preparando commit e push para main..." -ForegroundColor Cyan
Write-Host ""

# Verificar se está no diretório git
if (-not (Test-Path .git)) {
    Write-Host "❌ Erro: Não está em um repositório Git!" -ForegroundColor Red
    exit 1
}

# Verificar status do git
Write-Host "📋 Verificando status do Git..." -ForegroundColor Yellow
$status = git status --porcelain

if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "ℹ️  Nenhuma mudança para commitar" -ForegroundColor Cyan
    exit 0
}

Write-Host ""
Write-Host "Mudanças detectadas:" -ForegroundColor Green
git status --short

Write-Host ""
$confirm = Read-Host "Deseja continuar com o commit? (s/N)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "❌ Operação cancelada" -ForegroundColor Red
    exit 0
}

# Adicionar todas as mudanças
Write-Host ""
Write-Host "📝 Adicionando arquivos ao staging..." -ForegroundColor Yellow
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao adicionar arquivos" -ForegroundColor Red
    exit 1
}

# Fazer commit
Write-Host ""
Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
Write-Host "Mensagem: $Message" -ForegroundColor Cyan
git commit -m $Message

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer commit" -ForegroundColor Red
    exit 1
}

# Verificar branch atual
Write-Host ""
Write-Host "🔍 Verificando branch atual..." -ForegroundColor Yellow
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "Branch atual: $currentBranch" -ForegroundColor Cyan

# Fazer push
Write-Host ""
Write-Host "🚀 Fazendo push para origin/$currentBranch..." -ForegroundColor Yellow
git push origin $currentBranch

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer push" -ForegroundColor Red
    Write-Host "💡 Dica: Verifique se você tem permissão para fazer push" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ Commit e push concluídos com sucesso!" -ForegroundColor Green
Write-Host ""

