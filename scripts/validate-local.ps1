# Validação Local - Nossa Maternidade
# Script PowerShell para validar tudo localmente antes de commit

Write-Host "🔍 Validando projeto localmente..." -ForegroundColor Cyan

$ErrorActionPreference = "Continue"

# 1. Lint
Write-Host "📝 Executando lint..." -ForegroundColor Yellow
pnpm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Lint encontrou problemas" -ForegroundColor Yellow
}

# 2. Type Check
Write-Host "🔎 Executando type check..." -ForegroundColor Yellow
pnpm run typecheck
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Type check encontrou problemas" -ForegroundColor Yellow
}

# 3. Tests
Write-Host "🧪 Executando testes..." -ForegroundColor Yellow
pnpm test
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Testes falharam" -ForegroundColor Yellow
}

# 4. Coverage
Write-Host "📊 Verificando coverage..." -ForegroundColor Yellow
pnpm run test:coverage
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Coverage falhou" -ForegroundColor Yellow
}
pnpm run test:coverage:check
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Coverage < 70%" -ForegroundColor Yellow
}

# 5. Format Check
Write-Host "✨ Verificando formatação..." -ForegroundColor Yellow
pnpm run format:check
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Formatação inconsistente" -ForegroundColor Yellow
}

Write-Host "✅ Validação local concluída!" -ForegroundColor Green

