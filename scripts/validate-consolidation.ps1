# Script de Validação Pós-Consolidação - Nossa Maternidade
# Versão: 1.0
# Data: 04/11/2025
# PowerShell para Windows

$ErrorActionPreference = "Stop"

# Cores para output (PowerShell)
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "   $Title" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

# Contador de erros
$script:Errors = 0
$script:Warnings = 0

# ============================================
# FASE 1: VERIFICAÇÃO DE ESTRUTURA
# ============================================
Write-Header "FASE 1: Verificação de Estrutura"

Write-Info "Verificando diretórios..."

$requiredDirs = @(
    ".github/workflows",
    "src",
    "src/lib/nat-ai",
    "supabase/functions",
    "__tests__",
    "e2e",
    "docs",
    "scripts"
)

foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Success "Diretório '$dir' existe"
    } else {
        Write-Error-Custom "Diretório '$dir' NÃO ENCONTRADO"
        $script:Errors++
    }
}

Write-Info "Verificando arquivos de configuração..."

$requiredFiles = @(
    "package.json",
    "tsconfig.json",
    "vitest.config.ts",
    "app.json",
    "eas.json",
    ".env.example",
    ".github/workflows/ci.yml",
    ".github/workflows/build.yml",
    ".github/workflows/deploy.yml"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Success "Arquivo '$file' existe"
    } else {
        Write-Error-Custom "Arquivo '$file' NÃO ENCONTRADO"
        $script:Errors++
    }
}

# ============================================
# FASE 2: VERIFICAÇÃO DE DEPENDÊNCIAS
# ============================================
Write-Header "FASE 2: Verificação de Dependências"

Write-Info "Verificando node_modules..."

if (Test-Path "node_modules") {
    Write-Success "node_modules existe"
} else {
    Write-Warning-Custom "node_modules não existe. Executando 'npm install'..."
    try {
        npm install
        Write-Success "npm install concluído"
    } catch {
        Write-Error-Custom "npm install falhou"
        $script:Errors++
    }
}

if (Test-Path "package-lock.json") {
    Write-Success "package-lock.json existe"
} else {
    Write-Warning-Custom "package-lock.json não encontrado"
    $script:Warnings++
}

# ============================================
# FASE 3: VERIFICAÇÃO TYPESCRIPT
# ============================================
Write-Header "FASE 3: Verificação TypeScript"

Write-Info "Executando type check..."

try {
    npm run type-check 2>&1 | Tee-Object -FilePath "typescript-check.log"
    Write-Success "TypeScript check passou"
} catch {
    Write-Error-Custom "TypeScript check falhou. Ver typescript-check.log para detalhes"
    $script:Errors++
}

# ============================================
# FASE 4: VERIFICAÇÃO DE LINT
# ============================================
Write-Header "FASE 4: Verificação de Lint"

Write-Info "Executando ESLint..."

try {
    npm run lint 2>&1 | Tee-Object -FilePath "lint-check.log"
    Write-Success "ESLint passou"
} catch {
    Write-Warning-Custom "ESLint encontrou problemas. Ver lint-check.log"
    $script:Warnings++
}

# ============================================
# FASE 5: VERIFICAÇÃO DE TESTES
# ============================================
Write-Header "FASE 5: Verificação de Testes"

Write-Info "Contando arquivos de teste..."

$testFiles = Get-ChildItem -Path "__tests__" -Recurse -Include "*.test.ts", "*.test.tsx", "*.spec.ts", "*.spec.tsx" -ErrorAction SilentlyContinue
$testCount = $testFiles.Count

Write-Host "Encontrados $testCount arquivo(s) de teste"

if ($testCount -gt 0) {
    Write-Success "Arquivos de teste encontrados"
} else {
    Write-Warning-Custom "Nenhum arquivo de teste encontrado"
    $script:Warnings++
}

Write-Info "Executando testes..."

try {
    npm test -- --run 2>&1 | Tee-Object -FilePath "test-results.log"
    Write-Success "Testes passaram"
} catch {
    Write-Warning-Custom "Alguns testes falharam. Ver test-results.log"
    $script:Warnings++
}

# ============================================
# FASE 6: VERIFICAÇÃO DE COVERAGE
# ============================================
Write-Header "FASE 6: Verificação de Coverage"

Write-Info "Executando coverage..."

try {
    npm run test:coverage 2>&1 | Tee-Object -FilePath "coverage-results.log"
    Write-Success "Coverage executado"
    
    $coverageContent = Get-Content "coverage-results.log" -ErrorAction SilentlyContinue
    if ($coverageContent -match "Statements") {
        Write-Info "Resumo de coverage:"
        $coverageContent | Select-String -Pattern "Statements|Branches|Functions|Lines"
    }
} catch {
    Write-Warning-Custom "Coverage não pôde ser calculado"
    $script:Warnings++
}

# ============================================
# FASE 7: VERIFICAÇÃO DE EDGE FUNCTIONS
# ============================================
Write-Header "FASE 7: Verificação de Edge Functions"

Write-Info "Contando Edge Functions..."

$edgeFunctions = Get-ChildItem -Path "supabase/functions" -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne "_shared" }
$edgeFunctionsCount = $edgeFunctions.Count

Write-Host "Encontradas $edgeFunctionsCount Edge Function(s)"

if ($edgeFunctionsCount -ge 6) {
    Write-Success "Edge Functions encontradas (esperado: 6-7)"
} else {
    Write-Warning-Custom "Apenas $edgeFunctionsCount Edge Functions encontradas (esperado: 6-7)"
    $script:Warnings++
}

Write-Info "Edge Functions disponíveis:"
foreach ($func in $edgeFunctions) {
    Write-Host "  - $($func.Name)"
}

# ============================================
# FASE 8: VERIFICAÇÃO DE DOCUMENTAÇÃO
# ============================================
Write-Header "FASE 8: Verificação de Documentação"

Write-Info "Verificando documentação..."

$docsFiles = @(
    "docs/DOCUMENTATION.md",
    "docs/ARCHITECTURE.md",
    "docs/DEPLOY_PRODUCTION.md",
    "docs/ENVIRONMENTS.md"
)

foreach ($doc in $docsFiles) {
    if (Test-Path $doc) {
        $lines = (Get-Content $doc).Count
        Write-Success "$doc ($lines linhas)"
    } else {
        Write-Warning-Custom "$doc não encontrado"
        $script:Warnings++
    }
}

# ============================================
# FASE 9: VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE
# ============================================
Write-Header "FASE 9: Verificação de Variáveis de Ambiente"

Write-Info "Verificando .env.example..."

if (Test-Path ".env.example") {
    $envVars = (Get-Content ".env.example" | Select-String "=").Count
    Write-Success ".env.example contém $envVars variável(eis)"
    
    Write-Info "Variáveis críticas:"
    
    $criticalVars = @(
        "EXPO_PUBLIC_SUPABASE_URL",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY",
        "EXPO_PUBLIC_CLAUDE_API_KEY",
        "EXPO_PUBLIC_GEMINI_API_KEY"
    )
    
    foreach ($var in $criticalVars) {
        $content = Get-Content ".env.example" -ErrorAction SilentlyContinue
        if ($content -match $var) {
            Write-Success "  $var"
        } else {
            Write-Warning-Custom "  $var não encontrado"
            $script:Warnings++
        }
    }
} else {
    Write-Error-Custom ".env.example não encontrado"
    $script:Errors++
}

if (Test-Path ".env.local") {
    Write-Info ".env.local existe (não mostrar valores por segurança)"
} else {
    Write-Warning-Custom ".env.local não existe. Copie de .env.example"
    $script:Warnings++
}

# ============================================
# FASE 10: VERIFICAÇÃO DE SCRIPTS
# ============================================
Write-Header "FASE 10: Verificação de Scripts package.json"

Write-Info "Verificando scripts disponíveis..."

$requiredScripts = @(
    "test",
    "test:coverage",
    "lint",
    "type-check",
    "validate"
)

$packageJson = Get-Content "package.json" | ConvertFrom-Json

foreach ($script in $requiredScripts) {
    if ($packageJson.scripts.PSObject.Properties.Name -contains $script) {
        Write-Success "Script '$script' configurado"
    } else {
        Write-Warning-Custom "Script '$script' não encontrado"
        $script:Warnings++
    }
}

# ============================================
# FASE 11: VERIFICAÇÃO DE GIT
# ============================================
Write-Header "FASE 11: Verificação de Git"

Write-Info "Verificando status do Git..."

if (Test-Path ".git") {
    Write-Success "Repositório Git inicializado"
    
    try {
        $currentBranch = git branch --show-current
        Write-Info "Branch atual: $currentBranch"
    } catch {
        Write-Warning-Custom "Não foi possível determinar branch atual"
    }
    
    try {
        $gitStatus = git status --porcelain
        if ([string]::IsNullOrWhiteSpace($gitStatus)) {
            Write-Success "Working directory limpo"
        } else {
            Write-Warning-Custom "Existem mudanças não commitadas"
            $script:Warnings++
        }
    } catch {
        Write-Warning-Custom "Não foi possível verificar status do Git"
    }
} else {
    Write-Warning-Custom "Não é um repositório Git"
    $script:Warnings++
}

# ============================================
# FASE 12: RESUMO FINAL
# ============================================
Write-Header "RESUMO DA VALIDAÇÃO"

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Resumo dos Checks:"
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($script:Errors -eq 0 -and $script:Warnings -eq 0) {
    Write-Success "TODAS AS VERIFICAÇÕES PASSARAM! 🎉"
    Write-Host ""
    Write-Info "Status: ✅ PRONTO PARA PRODUÇÃO"
    Write-Host ""
    Write-Host "Próximos passos:"
    Write-Host "  1. Migrar código React Native para src/"
    Write-Host "  2. Migrar Edge Functions para supabase/functions/"
    Write-Host "  3. Configurar secrets no GitHub"
    Write-Host "  4. Push para repositório"
    Write-Host "  5. Verificar GitHub Actions"
    Write-Host ""
    exit 0
} elseif ($script:Errors -eq 0 -and $script:Warnings -gt 0) {
    Write-Warning-Custom "VALIDAÇÃO PASSOU COM $($script:Warnings) AVISO(S)"
    Write-Host ""
    Write-Info "Status: 🟡 FUNCIONAL MAS REQUER ATENÇÃO"
    Write-Host ""
    Write-Host "Revisar avisos acima e corrigir quando possível."
    Write-Host ""
    exit 0
} else {
    Write-Error-Custom "VALIDAÇÃO FALHOU COM $($script:Errors) ERRO(S) E $($script:Warnings) AVISO(S)"
    Write-Host ""
    Write-Info "Status: 🔴 REQUER CORREÇÕES"
    Write-Host ""
    Write-Host "Revisar erros acima antes de prosseguir."
    Write-Host ""
    Write-Host "Logs gerados:"
    Write-Host "  - typescript-check.log"
    Write-Host "  - lint-check.log"
    Write-Host "  - test-results.log"
    Write-Host "  - coverage-results.log"
    Write-Host ""
    exit 1
}


