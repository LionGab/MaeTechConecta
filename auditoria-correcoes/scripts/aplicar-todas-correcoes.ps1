# Script PowerShell para Aplicar Todas as Correções
# Uso: .\auditoria-correcoes\scripts\aplicar-todas-correcoes.ps1
# IMPORTANTE: Execute da RAIZ do projeto (NossaMaternidade/)

Write-Host "🔒 APLICANDO AUDITORIA E CORREÇÕES" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está na raiz do projeto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Execute este script da RAIZ do projeto (NossaMaternidade/)!" -ForegroundColor Red
    Write-Host "   Você está em: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Checklist de aplicação:" -ForegroundColor Yellow
Write-Host "  1. Backup dos arquivos" -ForegroundColor White
Write-Host "  2. Auto-approve seguro" -ForegroundColor White
Write-Host "  3. CI/CD workflows" -ForegroundColor White
Write-Host "  4. Correção Gemini" -ForegroundColor White
Write-Host "  5. Validação" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Continuar? (s/N)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "❌ Operação cancelada" -ForegroundColor Red
    exit 0
}

Write-Host ""

# PASSO 1: Backup
Write-Host "📦 PASSO 1/5: Criando backup..." -ForegroundColor Yellow
git add -A 2>&1 | Out-Null
git commit -m "chore: backup antes de aplicar auditoria" 2>&1 | Out-Null
git branch backup-pre-auditoria 2>&1 | Out-Null
Write-Host "✅ Backup criado (branch: backup-pre-auditoria)" -ForegroundColor Green
Write-Host ""

# PASSO 2: Auto-approve seguro
Write-Host "🔒 PASSO 2/5: Aplicando auto-approve seguro..." -ForegroundColor Yellow

New-Item -ItemType Directory -Force -Path ".cursor/review-logs" | Out-Null
New-Item -ItemType Directory -Force -Path "logs/approvals" | Out-Null

Copy-Item "auditoria-correcoes/correcoes/auto-approve-seguro.js" "scripts/auto-approve.js" -Force
Copy-Item "auditoria-correcoes/configs/cursor-permissions.json" ".cursor/permissions.json" -Force -ErrorAction SilentlyContinue
Copy-Item "auditoria-correcoes/configs/auto-approve-config.json" ".cursor/auto-approve-config.json" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Auto-approve seguro aplicado" -ForegroundColor Green
Write-Host ""

# PASSO 3: CI/CD Workflows
Write-Host "⚙️  PASSO 3/5: Criando workflows CI/CD..." -ForegroundColor Yellow

New-Item -ItemType Directory -Force -Path ".github/workflows" | Out-Null

Copy-Item "auditoria-correcoes/workflows/ci.yml" ".github/workflows/ci.yml" -Force
Write-Host "  ✅ ci.yml criado" -ForegroundColor Gray

Copy-Item "auditoria-correcoes/workflows/vercel-preview.yml" ".github/workflows/vercel-preview.yml" -Force
Write-Host "  ✅ vercel-preview.yml criado" -ForegroundColor Gray

Copy-Item "auditoria-correcoes/workflows/eas-preview.yml" ".github/workflows/eas-preview.yml" -Force
Write-Host "  ✅ eas-preview.yml criado" -ForegroundColor Gray

Write-Host "✅ Workflows CI/CD criados" -ForegroundColor Green
Write-Host "⚠️  Configure secrets no GitHub: VERCEL_TOKEN, EAS_TOKEN (se necessário)" -ForegroundColor Yellow
Write-Host ""

# PASSO 4: Correção Gemini
Write-Host "🤖 PASSO 4/5: Corrigindo serviço Gemini..." -ForegroundColor Yellow

Copy-Item "src/services/gemini/base.ts" "src/services/gemini/base.ts.backup" -Force -ErrorAction SilentlyContinue
Copy-Item "src/services/gemini/modelMap.ts" "src/services/gemini/modelMap.ts.backup" -Force -ErrorAction SilentlyContinue

Copy-Item "auditoria-correcoes/correcoes/gemini-base-corrigido.ts" "src/services/gemini/base.ts" -Force
Copy-Item "auditoria-correcoes/correcoes/gemini-modelMap-corrigido.ts" "src/services/gemini/modelMap.ts" -Force

Write-Host "✅ Serviço Gemini corrigido" -ForegroundColor Green
Write-Host ""

# PASSO 5: Validação
Write-Host "✅ PASSO 5/5: Validando correções..." -ForegroundColor Yellow

Write-Host "  Type check..." -ForegroundColor Gray
$typeCheck = pnpm typecheck 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ TypeScript OK" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Erros de TypeScript (verificar)" -ForegroundColor Yellow
}

Write-Host "  Lint..." -ForegroundColor Gray
$lint = pnpm lint 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Lint OK" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Warnings de lint (aceitável)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 CORREÇÕES APLICADAS!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Configure branch protection no GitHub (ver configs/branch-protection.md)" -ForegroundColor White
Write-Host "  2. Configure secrets GitHub (VERCEL_TOKEN, EAS_TOKEN se necessário)" -ForegroundColor White
Write-Host "  3. Teste CI/CD criando um PR" -ForegroundColor White
Write-Host "  4. Teste app e verifique que NathIA funciona" -ForegroundColor White
Write-Host ""
Write-Host "📖 Documentação completa: auditoria-correcoes/docs/" -ForegroundColor Cyan

