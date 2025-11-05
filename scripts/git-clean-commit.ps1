# Script PowerShell para limpar arquivos corrompidos e fazer commit
# Uso: .\scripts\git-clean-commit.ps1 "mensagem do commit"

param(
    [Parameter(Mandatory=$false)]
    [string]$Message = "fix: corrigir arquivos e adicionar scripts de configuração"
)

Write-Host "🧹 Limpando arquivos corrompidos e preparando commit..." -ForegroundColor Cyan
Write-Host ""

# Verificar se está no diretório git
if (-not (Test-Path .git)) {
    Write-Host "❌ Erro: Não está em um repositório Git!" -ForegroundColor Red
    exit 1
}

# Resetar staging para limpar arquivos problemáticos
Write-Host "📋 Resetando staging..." -ForegroundColor Yellow
git reset

# Adicionar apenas arquivos válidos conhecidos
Write-Host ""
Write-Host "📝 Adicionando arquivos válidos..." -ForegroundColor Yellow

# Lista de arquivos válidos para adicionar
$validFiles = @(
    "scripts/git-commit-push.ps1",
    "scripts/git-clean-commit.ps1",
    "CORRIGIR_ERRO_COMMIT.md",
    "CONFIGURAR_ENV_LOCAL.md",
    "scripts/create-env-local.ps1",
    "scripts/validate-secrets.ps1",
    ".gitignore",
    "babel.config.js",
    "package.json",
    "src/config/api.ts",
    "src/services/supabase.ts",
    "src/features/content/ContentDetailScreen.tsx"
)

# Adicionar arquivos válidos que existem
$addedFiles = @()
foreach ($file in $validFiles) {
    if (Test-Path $file) {
        try {
            git add $file 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                $addedFiles += $file
                Write-Host "  ✅ $file" -ForegroundColor Green
            }
        } catch {
            Write-Host "  ⚠️  $file (pulando)" -ForegroundColor Yellow
        }
    }
}

# Verificar se há arquivos adicionados
if ($addedFiles.Count -eq 0) {
    Write-Host ""
    Write-Host "⚠️  Nenhum arquivo válido foi adicionado" -ForegroundColor Yellow
    Write-Host "💡 Verifique se há mudanças para commitar" -ForegroundColor Cyan
    exit 0
}

Write-Host ""
Write-Host "📦 Arquivos adicionados: $($addedFiles.Count)" -ForegroundColor Green

# Verificar status antes de commitar
Write-Host ""
Write-Host "📋 Status do staging:" -ForegroundColor Yellow
git status --short

Write-Host ""
$confirm = Read-Host "Deseja continuar com o commit? (s/N)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "❌ Operação cancelada" -ForegroundColor Red
    exit 0
}

# Fazer commit
Write-Host ""
Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
Write-Host "Mensagem: $Message" -ForegroundColor Cyan

try {
    $commitOutput = git commit -m "$Message" 2>&1
    $commitOutput | Write-Host
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Commit realizado com sucesso!" -ForegroundColor Green
        
        # Verificar branch atual
        $currentBranch = git rev-parse --abbrev-ref HEAD
        Write-Host ""
        Write-Host "🚀 Fazendo push para origin/$currentBranch..." -ForegroundColor Yellow
        
        git push origin $currentBranch
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "⚠️  Commit realizado, mas push falhou" -ForegroundColor Yellow
            Write-Host "💡 Execute manualmente: git push origin $currentBranch" -ForegroundColor Cyan
        }
    } else {
        Write-Host ""
        Write-Host "❌ Erro ao fazer commit (exit code: $LASTEXITCODE)" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Possíveis causas:" -ForegroundColor Yellow
        Write-Host "  - Configuração do Git não está completa" -ForegroundColor Yellow
        Write-Host "  - Execute: git config --global user.name 'Seu Nome'" -ForegroundColor Cyan
        Write-Host "  - Execute: git config --global user.email 'seu@email.com'" -ForegroundColor Cyan
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "❌ Erro ao fazer commit: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Concluído!" -ForegroundColor Green

