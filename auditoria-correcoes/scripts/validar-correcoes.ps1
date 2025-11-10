# Script PowerShell para Validar Correções
# Uso: .\auditoria-correcoes\scripts\validar-correcoes.ps1

Write-Host "✅ VALIDAÇÃO DE CORREÇÕES" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# 1. Verificar auto-approve seguro
Write-Host "1. Verificando auto-approve seguro..." -ForegroundColor Yellow
if (Test-Path "scripts/auto-approve.js") {
    $content = Get-Content "scripts/auto-approve.js" -Raw
    if ($content -match "isBranchAllowed" -and $content -match "hasCIPassed") {
        Write-Host "   ✅ Auto-approve seguro encontrado" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Auto-approve não tem gates de segurança!" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host "   ❌ scripts/auto-approve.js não encontrado!" -ForegroundColor Red
    $errors++
}

# 2. Verificar workflows CI/CD
Write-Host "2. Verificando workflows CI/CD..." -ForegroundColor Yellow
if (Test-Path ".github/workflows/ci.yml") {
    Write-Host "   ✅ ci.yml encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ .github/workflows/ci.yml não encontrado!" -ForegroundColor Red
    $errors++
}

# 3. Verificar correção Gemini
Write-Host "3. Verificando correção Gemini..." -ForegroundColor Yellow
if (Test-Path "src/services/gemini/base.ts") {
    $content = Get-Content "src/services/gemini/base.ts" -Raw
    if ($content -match "gemini-2\.0-flash-exp") {
        Write-Host "   ✅ Gemini usa modelo correto (gemini-2.0-flash-exp)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Gemini não usa modelo correto!" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host "   ❌ src/services/gemini/base.ts não encontrado!" -ForegroundColor Red
    $errors++
}

# 4. TypeScript
Write-Host "4. Verificando TypeScript..." -ForegroundColor Yellow
$typeCheck = pnpm typecheck 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ TypeScript compila sem erros" -ForegroundColor Green
} else {
    Write-Host "   ❌ Erros de TypeScript encontrados!" -ForegroundColor Red
    $errors++
}

Write-Host ""
Write-Host "📊 RESUMO" -ForegroundColor Cyan
Write-Host "  Erros: $errors" -ForegroundColor $(if ($errors -eq 0) { "Green" } else { "Red" })
Write-Host "  Warnings: $warnings" -ForegroundColor $(if ($warnings -eq 0) { "Green" } else { "Yellow" })

if ($errors -eq 0) {
    Write-Host ""
    Write-Host "✅ Todas as correções validadas!" -ForegroundColor Green
    exit 0
} else {
    Write-Host ""
    Write-Host "❌ Correções incompletas. Corrija os erros acima." -ForegroundColor Red
    exit 1
}

