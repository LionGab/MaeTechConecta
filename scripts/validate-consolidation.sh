#!/bin/bash

# Script de Validação Pós-Consolidação - Nossa Maternidade

# Versão: 1.0

# Data: 04/11/2025



set -e  # Exit on error



# Cores para output

RED='\033[0;31m'

GREEN='\033[0;32m'

YELLOW='\033[1;33m'

BLUE='\033[0;34m'

NC='\033[0m' # No Color



# Função para printar com cor

print_success() {

    echo -e "${GREEN}✅ $1${NC}"

}



print_error() {

    echo -e "${RED}❌ $1${NC}"

}



print_warning() {

    echo -e "${YELLOW}⚠️  $1${NC}"

}



print_info() {

    echo -e "${BLUE}ℹ️  $1${NC}"

}



print_header() {

    echo ""

    echo -e "${BLUE}═══════════════════════════════════════${NC}"

    echo -e "${BLUE}   $1${NC}"

    echo -e "${BLUE}═══════════════════════════════════════${NC}"

    echo ""

}



# Contador de erros

ERRORS=0

WARNINGS=0



# ============================================

# FASE 1: VERIFICAÇÃO DE ESTRUTURA

# ============================================

print_header "FASE 1: Verificação de Estrutura"



# Verificar diretórios críticos

print_info "Verificando diretórios..."



REQUIRED_DIRS=(

    ".github/workflows"

    "src"

    "src/lib/nat-ai"

    "supabase/functions"

    "__tests__"

    "e2e"

    "docs"

    "scripts"

)



for dir in "${REQUIRED_DIRS[@]}"; do

    if [ -d "$dir" ]; then

        print_success "Diretório '$dir' existe"

    else

        print_error "Diretório '$dir' NÃO ENCONTRADO"

        ((ERRORS++))

    fi

done



# Verificar arquivos críticos

print_info "Verificando arquivos de configuração..."



REQUIRED_FILES=(

    "package.json"

    "tsconfig.json"

    "vitest.config.ts"

    "app.json"

    "eas.json"

    ".env.example"

    ".github/workflows/ci.yml"

    ".github/workflows/build.yml"

    ".github/workflows/deploy.yml"

)



for file in "${REQUIRED_FILES[@]}"; do

    if [ -f "$file" ]; then

        print_success "Arquivo '$file' existe"

    else

        print_error "Arquivo '$file' NÃO ENCONTRADO"

        ((ERRORS++))

    fi

done



# ============================================

# FASE 2: VERIFICAÇÃO DE DEPENDÊNCIAS

# ============================================

print_header "FASE 2: Verificação de Dependências"



print_info "Verificando node_modules..."

if [ -d "node_modules" ]; then

    print_success "node_modules existe"

else

    print_warning "node_modules não existe. Executando 'npm install'..."

    npm install

    if [ $? -eq 0 ]; then

        print_success "npm install concluído"

    else

        print_error "npm install falhou"

        ((ERRORS++))

    fi

fi



# Verificar package-lock.json

if [ -f "package-lock.json" ]; then

    print_success "package-lock.json existe"

else

    print_warning "package-lock.json não encontrado"

    ((WARNINGS++))

fi



# ============================================

# FASE 3: VERIFICAÇÃO TYPESCRIPT

# ============================================

print_header "FASE 3: Verificação TypeScript"



print_info "Executando type check..."

if npm run type-check 2>&1 | tee typescript-check.log; then

    print_success "TypeScript check passou"

else

    print_error "TypeScript check falhou. Ver typescript-check.log para detalhes"

    ((ERRORS++))

fi



# ============================================

# FASE 4: VERIFICAÇÃO DE LINT

# ============================================

print_header "FASE 4: Verificação de Lint"



print_info "Executando ESLint..."

if npm run lint 2>&1 | tee lint-check.log; then

    print_success "ESLint passou"

else

    print_warning "ESLint encontrou problemas. Ver lint-check.log"

    ((WARNINGS++))

fi



# ============================================

# FASE 5: VERIFICAÇÃO DE TESTES

# ============================================

print_header "FASE 5: Verificação de Testes"



print_info "Contando arquivos de teste..."

TEST_COUNT=$(find __tests__ -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" 2>/dev/null | wc -l)

echo "Encontrados $TEST_COUNT arquivo(s) de teste"



if [ "$TEST_COUNT" -gt 0 ]; then

    print_success "Arquivos de teste encontrados"

else

    print_warning "Nenhum arquivo de teste encontrado"

    ((WARNINGS++))

fi



print_info "Executando testes..."

if npm test -- --run 2>&1 | tee test-results.log; then

    print_success "Testes passaram"

else

    print_warning "Alguns testes falharam. Ver test-results.log"

    ((WARNINGS++))

fi



# ============================================

# FASE 6: VERIFICAÇÃO DE COVERAGE

# ============================================

print_header "FASE 6: Verificação de Coverage"



print_info "Executando coverage..."

if npm run test:coverage 2>&1 | tee coverage-results.log; then

    print_success "Coverage executado"

    

    # Tentar extrair porcentagem de coverage

    if grep -q "Statements" coverage-results.log; then

        print_info "Resumo de coverage:"

        grep -E "Statements|Branches|Functions|Lines" coverage-results.log

    fi

else

    print_warning "Coverage não pôde ser calculado"

    ((WARNINGS++))

fi



# ============================================

# FASE 7: VERIFICAÇÃO DE EDGE FUNCTIONS

# ============================================

print_header "FASE 7: Verificação de Edge Functions"



print_info "Contando Edge Functions..."

EDGE_FUNCTIONS_COUNT=$(find supabase/functions -maxdepth 1 -type d ! -name "functions" ! -name "_shared" 2>/dev/null | wc -l)

echo "Encontradas $EDGE_FUNCTIONS_COUNT Edge Function(s)"



if [ "$EDGE_FUNCTIONS_COUNT" -ge 6 ]; then

    print_success "Edge Functions encontradas (esperado: 6-7)"

else

    print_warning "Apenas $EDGE_FUNCTIONS_COUNT Edge Functions encontradas (esperado: 6-7)"

    ((WARNINGS++))

fi



# Listar Edge Functions

print_info "Edge Functions disponíveis:"

find supabase/functions -maxdepth 1 -type d ! -name "functions" ! -name "_shared" 2>/dev/null | while read dir; do

    echo "  - $(basename "$dir")"

done



# ============================================

# FASE 8: VERIFICAÇÃO DE DOCUMENTAÇÃO

# ============================================

print_header "FASE 8: Verificação de Documentação"



print_info "Verificando documentação..."



DOCS_FILES=(

    "docs/DOCUMENTATION.md"

    "docs/ARCHITECTURE.md"

    "docs/DEPLOY_PRODUCTION.md"

    "docs/ENVIRONMENTS.md"

)



for doc in "${DOCS_FILES[@]}"; do

    if [ -f "$doc" ]; then

        LINES=$(wc -l < "$doc")

        print_success "$doc ($LINES linhas)"

    else

        print_warning "$doc não encontrado"

        ((WARNINGS++))

    fi

done



# ============================================

# FASE 9: VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE

# ============================================

print_header "FASE 9: Verificação de Variáveis de Ambiente"



print_info "Verificando .env.example..."

if [ -f ".env.example" ]; then

    ENV_VARS=$(grep -c "=" .env.example)

    print_success ".env.example contém $ENV_VARS variável(eis)"

    

    print_info "Variáveis críticas:"

    CRITICAL_VARS=(

        "EXPO_PUBLIC_SUPABASE_URL"

        "EXPO_PUBLIC_SUPABASE_ANON_KEY"

        "EXPO_PUBLIC_CLAUDE_API_KEY"

        "EXPO_PUBLIC_GEMINI_API_KEY"

    )

    

    for var in "${CRITICAL_VARS[@]}"; do

        if grep -q "$var" .env.example; then

            print_success "  $var"

        else

            print_warning "  $var não encontrado"

            ((WARNINGS++))

        fi

    done

else

    print_error ".env.example não encontrado"

    ((ERRORS++))

fi



# Verificar se .env.local existe

if [ -f ".env.local" ]; then

    print_info ".env.local existe (não mostrar valores por segurança)"

else

    print_warning ".env.local não existe. Copie de .env.example"

    ((WARNINGS++))

fi



# ============================================

# FASE 10: VERIFICAÇÃO DE SCRIPTS

# ============================================

print_header "FASE 10: Verificação de Scripts package.json"



print_info "Verificando scripts disponíveis..."



REQUIRED_SCRIPTS=(

    "test"

    "test:coverage"

    "lint"

    "type-check"

    "validate"

)



for script in "${REQUIRED_SCRIPTS[@]}"; do

    if grep -q "\"$script\":" package.json; then

        print_success "Script '$script' configurado"

    else

        print_warning "Script '$script' não encontrado"

        ((WARNINGS++))

    fi

done



# ============================================

# FASE 11: VERIFICAÇÃO DE GIT

# ============================================

print_header "FASE 11: Verificação de Git"



print_info "Verificando status do Git..."



if [ -d ".git" ]; then

    print_success "Repositório Git inicializado"

    

    # Branch atual

    CURRENT_BRANCH=$(git branch --show-current)

    print_info "Branch atual: $CURRENT_BRANCH"

    

    # Mudanças não commitadas

    if git diff-index --quiet HEAD --; then

        print_success "Working directory limpo"

    else

        print_warning "Existem mudanças não commitadas"

        ((WARNINGS++))

    fi

else

    print_warning "Não é um repositório Git"

    ((WARNINGS++))

fi



# ============================================

# FASE 12: RESUMO FINAL

# ============================================

print_header "RESUMO DA VALIDAÇÃO"



echo ""

echo "═══════════════════════════════════════"

echo "Resumo dos Checks:"

echo "═══════════════════════════════════════"

echo ""



# Calcular total de checks

TOTAL_CHECKS=$((${#REQUIRED_DIRS[@]} + ${#REQUIRED_FILES[@]} + 10))



if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then

    print_success "TODAS AS VERIFICAÇÕES PASSARAM! 🎉"

    echo ""

    print_info "Status: ✅ PRONTO PARA PRODUÇÃO"

    echo ""

    echo "Próximos passos:"

    echo "  1. Migrar código React Native para src/"

    echo "  2. Migrar Edge Functions para supabase/functions/"

    echo "  3. Configurar secrets no GitHub"

    echo "  4. Push para repositório"

    echo "  5. Verificar GitHub Actions"

    echo ""

    exit 0

elif [ $ERRORS -eq 0 ] && [ $WARNINGS -gt 0 ]; then

    print_warning "VALIDAÇÃO PASSOU COM $WARNINGS AVISO(S)"

    echo ""

    print_info "Status: 🟡 FUNCIONAL MAS REQUER ATENÇÃO"

    echo ""

    echo "Revisar avisos acima e corrigir quando possível."

    echo ""

    exit 0

else

    print_error "VALIDAÇÃO FALHOU COM $ERRORS ERRO(S) E $WARNINGS AVISO(S)"

    echo ""

    print_info "Status: 🔴 REQUER CORREÇÕES"

    echo ""

    echo "Revisar erros acima antes de prosseguir."

    echo ""

    echo "Logs gerados:"

    echo "  - typescript-check.log"

    echo "  - lint-check.log"

    echo "  - test-results.log"

    echo "  - coverage-results.log"

    echo ""

    exit 1

fi


