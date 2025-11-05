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
try {
    $status = git status --porcelain 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao verificar status do Git" -ForegroundColor Red
        Write-Host $status
        exit 1
    }
} catch {
    Write-Host "❌ Erro ao verificar status: $_" -ForegroundColor Red
    exit 1
}

if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "ℹ️  Nenhuma mudança para commitar" -ForegroundColor Cyan
    exit 0
}

Write-Host ""
Write-Host "Mudanças detectadas:" -ForegroundColor Green
try {
    git status --short
} catch {
    Write-Host "⚠️  Aviso: Não foi possível mostrar status detalhado" -ForegroundColor Yellow
}

Write-Host ""
$confirm = Read-Host "Deseja continuar com o commit? (s/N)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "❌ Operação cancelada" -ForegroundColor Red
    exit 0
}

# Adicionar todas as mudanças
Write-Host ""
Write-Host "📝 Adicionando arquivos ao staging..." -ForegroundColor Yellow
try {
    git add . 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao adicionar arquivos (exit code: $LASTEXITCODE)" -ForegroundColor Red
        Write-Host "💡 Dica: Verifique se há arquivos muito grandes ou problemas de permissão" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Erro ao adicionar arquivos: $_" -ForegroundColor Red
    exit 1
}

# Fazer commit
Write-Host ""
Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
Write-Host "Mensagem: $Message" -ForegroundColor Cyan

try {
    git commit -m "$Message" 2>&1 | Out-String | Write-Host
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Erro ao fazer commit (exit code: $LASTEXITCODE)" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Possíveis causas:" -ForegroundColor Yellow
        Write-Host "  - Nenhuma mudança foi adicionada (git add não funcionou)" -ForegroundColor Yellow
        Write-Host "  - Configuração do Git não está completa (user.name ou user.email)" -ForegroundColor Yellow
        Write-Host "  - Mensagem de commit muito longa ou com caracteres especiais" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "💡 Verifique com:" -ForegroundColor Cyan
        Write-Host "  git config --list" -ForegroundColor Cyan
        Write-Host "  git status" -ForegroundColor Cyan
        exit 1
    }
} catch {
    Write-Host "❌ Erro ao fazer commit: $_" -ForegroundColor Red
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

