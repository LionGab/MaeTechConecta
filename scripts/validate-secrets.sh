#!/bin/bash
# Script para validar secrets configurados
# Uso: ./scripts/validate-secrets.sh

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Validando Secrets Configurados...${NC}"
echo ""

# Verificar Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI não encontrado${NC}"
    exit 1
fi

# Secrets necessários
REQUIRED_SECRETS=(
    "GEMINI_API_KEY"
    "ANTHROPIC_API_KEY"
    "OPENAI_API_KEY"
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
)

# Verificar secrets do Supabase
echo -e "${BLUE}=== SUPABASE SECRETS ===${NC}"
supabase secrets list

echo ""
echo -e "${BLUE}=== VALIDAÇÃO ===${NC}"

# Verificar cada secret
all_configured=true
for secret in "${REQUIRED_SECRETS[@]}"; do
    if supabase secrets list | grep -q "^${secret}"; then
        echo -e "${GREEN}✅ ${secret}${NC}"
    else
        echo -e "${RED}❌ ${secret} (NÃO CONFIGURADO)${NC}"
        all_configured=false
    fi
done

echo ""
if [ "$all_configured" = true ]; then
    echo -e "${GREEN}✅ Todos os secrets necessários estão configurados!${NC}"
else
    echo -e "${YELLOW}⚠️  Alguns secrets estão faltando${NC}"
    echo "Execute: ./scripts/setup-secrets.sh para configurar"
fi

echo ""
echo -e "${BLUE}=== GITHUB SECRETS ===${NC}"
echo "⚠️  Para verificar secrets do GitHub, você precisa:"
echo "1. Acessar: https://github.com/SEU-USUARIO/nossa-maternidade/settings/secrets/actions"
echo "2. Verificar manualmente se todos os secrets estão configurados"
echo ""
echo "Secrets necessários no GitHub:"
echo "  - EXPO_TOKEN"
echo "  - SUPABASE_ACCESS_TOKEN"
echo "  - SUPABASE_PROJECT_ID"
echo "  - SUPABASE_URL"
echo "  - SUPABASE_ANON_KEY"
echo "  - ANTHROPIC_API_KEY"
echo "  - GEMINI_API_KEY"
echo "  - OPENAI_API_KEY"
echo "  - SENTRY_AUTH_TOKEN (opcional)"
echo "  - SENTRY_ORG (opcional)"
echo "  - SENTRY_PROJECT (opcional)"


