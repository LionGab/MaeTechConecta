# Script para remover submodule LionNath-archive
# Uso: .\scripts\remove-submodule.ps1

Write-Host "🗑️  Removendo submodule LionNath-archive..." -ForegroundColor Cyan
Write-Host ""

# Nome do submodule
$submoduleName = "LionNath-archive"

# Verificar se o diretório existe
if (-not (Test-Path $submoduleName)) {
    Write-Host "⚠️  Diretório $submoduleName não encontrado localmente" -ForegroundColor Yellow
    Write-Host "Pode ser que já tenha sido removido ou seja apenas um submodule no Git" -ForegroundColor Yellow
    Write-Host ""
}

# Verificar se é um submodule
Write-Host "📋 Verificando se é um submodule..." -ForegroundColor Cyan
$isSubmodule = git ls-files --error-unmatch $submoduleName 2>&1 | Out-Null
$submoduleExists = git ls-files | Select-String -Pattern $submoduleName

if ($submoduleExists) {
    Write-Host "✅ Encontrado como submodule no Git" -ForegroundColor Green
} else {
    Write-Host "⚠️  Não encontrado como submodule no Git" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Removendo submodule..." -ForegroundColor Cyan

# Passo 1: Desinicializar o submodule (se existir)
Write-Host "1. Desinicializando submodule..." -ForegroundColor Yellow
git submodule deinit -f $submoduleName 2>&1 | Out-Null

# Passo 2: Remover módulo do Git
Write-Host "2. Removendo módulo do Git..." -ForegroundColor Yellow
if (Test-Path ".git/modules/$submoduleName") {
    Remove-Item -Recurse -Force ".git/modules/$submoduleName" -ErrorAction SilentlyContinue
    Write-Host "   ✅ Módulo removido do .git/modules/" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Módulo não encontrado em .git/modules/" -ForegroundColor Cyan
}

# Passo 3: Remover do índice do Git
Write-Host "3. Removendo do índice do Git..." -ForegroundColor Yellow
git rm -f $submoduleName 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Removido do índice do Git" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Não estava no índice do Git" -ForegroundColor Yellow
}

# Passo 4: Remover diretório local (se existir)
Write-Host "4. Removendo diretório local..." -ForegroundColor Yellow
if (Test-Path $submoduleName) {
    Remove-Item -Recurse -Force $submoduleName -ErrorAction SilentlyContinue
    Write-Host "   ✅ Diretório local removido" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Diretório local não encontrado" -ForegroundColor Cyan
}

# Passo 5: Verificar e remover .gitmodules se necessário
Write-Host "5. Verificando .gitmodules..." -ForegroundColor Yellow
if (Test-Path ".gitmodules") {
    $gitmodules = Get-Content ".gitmodules" -Raw
    if ($gitmodules -match "\[submodule\s+`"$submoduleName`"\]") {
        Write-Host "   ⚠️  Encontrado em .gitmodules - removendo..." -ForegroundColor Yellow
        
        # Remover entrada do .gitmodules
        $lines = Get-Content ".gitmodules"
        $newLines = @()
        $skipNext = 0
        
        for ($i = 0; $i -lt $lines.Length; $i++) {
            if ($lines[$i] -match "\[submodule\s+`"$submoduleName`"\]") {
                $skipNext = 2  # Pular linha atual e próximas 2 (path e url)
            } elseif ($skipNext -gt 0) {
                $skipNext--
            } else {
                $newLines += $lines[$i]
            }
        }
        
        if ($newLines.Length -eq 0) {
            Remove-Item ".gitmodules"
            Write-Host "   ✅ .gitmodules removido (estava vazio)" -ForegroundColor Green
        } else {
            $newLines | Set-Content ".gitmodules"
            Write-Host "   ✅ Entrada removida do .gitmodules" -ForegroundColor Green
        }
    } else {
        Write-Host "   ℹ️  Não encontrado em .gitmodules" -ForegroundColor Cyan
    }
} else {
    Write-Host "   ℹ️  .gitmodules não existe" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ Submodule removido com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Fazer commit das mudanças:"
Write-Host "   git add ."
Write-Host "   git commit -m 'chore: remover submodule LionNath-archive'"
Write-Host ""
Write-Host "2. Push para main:"
Write-Host "   git push origin main"
Write-Host ""

