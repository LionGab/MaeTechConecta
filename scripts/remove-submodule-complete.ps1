# Script completo para remover submodule LionNath-archive e fazer commit
# Uso: .\scripts\remove-submodule-complete.ps1

Write-Host "🗑️  Removendo submodule LionNath-archive completamente..." -ForegroundColor Cyan
Write-Host ""

$submoduleName = "LionNath-archive"

# Passo 1: Desinicializar submodule
Write-Host "1. Desinicializando submodule..." -ForegroundColor Yellow
git submodule deinit -f $submoduleName 2>&1 | Out-Null

# Passo 2: Remover módulo do Git
Write-Host "2. Removendo módulo do Git..." -ForegroundColor Yellow
if (Test-Path ".git/modules/$submoduleName") {
    Remove-Item -Recurse -Force ".git/modules/$submoduleName" -ErrorAction SilentlyContinue
    Write-Host "   ✅ Módulo removido" -ForegroundColor Green
}

# Passo 3: Remover do índice do Git
Write-Host "3. Removendo do índice do Git..." -ForegroundColor Yellow
git rm -f $submoduleName 2>&1 | Out-Null

# Passo 4: Remover diretório local
Write-Host "4. Removendo diretório local..." -ForegroundColor Yellow
if (Test-Path $submoduleName) {
    Remove-Item -Recurse -Force $submoduleName -ErrorAction SilentlyContinue
    Write-Host "   ✅ Diretório removido" -ForegroundColor Green
}

# Passo 5: Remover do .gitmodules
Write-Host "5. Removendo do .gitmodules..." -ForegroundColor Yellow
if (Test-Path ".gitmodules") {
    $content = Get-Content ".gitmodules" -Raw
    if ($content -match "\[submodule\s+`"$submoduleName`"\]") {
        $lines = Get-Content ".gitmodules"
        $newLines = @()
        $skip = 0
        
        foreach ($line in $lines) {
            if ($line -match "\[submodule\s+`"$submoduleName`"\]") {
                $skip = 3  # Pular esta linha e próximas 2 (path e url)
            } elseif ($skip -gt 0 -and $line -match "^\s*(path|url)\s*=") {
                $skip--
            } elseif ($skip -gt 0) {
                $skip--
            } else {
                $newLines += $line
            }
        }
        
        if ($newLines.Length -eq 0 -or ($newLines -join "`n").Trim() -eq "") {
            Remove-Item ".gitmodules"
            Write-Host "   ✅ .gitmodules removido" -ForegroundColor Green
        } else {
            $newLines | Set-Content ".gitmodules"
            Write-Host "   ✅ Entrada removida do .gitmodules" -ForegroundColor Green
        }
    }
}

# Passo 6: Remover do .git/config se necessário
Write-Host "6. Verificando .git/config..." -ForegroundColor Yellow
$gitConfig = Get-Content ".git/config" -ErrorAction SilentlyContinue
if ($gitConfig -and ($gitConfig | Select-String -Pattern "submodule.*$submoduleName")) {
    # Criar novo conteúdo sem a entrada do submodule
    $newConfig = @()
    $skipSection = $false
    
    foreach ($line in $gitConfig) {
        if ($line -match "\[submodule\s+`"$submoduleName`"\]") {
            $skipSection = $true
        } elseif ($skipSection -and $line -match "^\[") {
            $skipSection = $false
            $newConfig += $line
        } elseif (-not $skipSection) {
            $newConfig += $line
        }
    }
    
    $newConfig | Set-Content ".git/config"
    Write-Host "   ✅ Entrada removida do .git/config" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Submodule removido completamente!" -ForegroundColor Green
Write-Host ""

# Adicionar mudanças
Write-Host "📦 Adicionando mudanças..." -ForegroundColor Cyan
git add .

# Fazer commit
Write-Host "💾 Fazendo commit..." -ForegroundColor Cyan
git commit -m "chore: remover submodule LionNath-archive

- Remover submodule LionNath-archive que causava erro no Netlify
- Submodule não tinha URL configurada no .gitmodules
- Não é mais necessário para o projeto"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit realizado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Fazendo push para main..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Submodule removido e mudanças enviadas para o GitHub!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Erro ao fazer push" -ForegroundColor Red
        Write-Host "Execute manualmente: git push origin main" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "⚠️  Nenhuma mudança para commitar (submodule já estava removido?)" -ForegroundColor Yellow
    Write-Host "Execute: git status para verificar" -ForegroundColor Yellow
}

Write-Host ""

