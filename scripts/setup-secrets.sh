#!/bin/bash
# Script para configurar secrets no Supabase
# Uso: ./scripts/setup-secrets.sh

set -e

echo "🔐 Configurando Secrets no Supabase..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI não encontrado${NC}"
    echo "Instale com: npm install -g supabase"
    exit 1
fi

# Verificar se está logado
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Você precisa fazer login no Supabase${NC}"
    echo "Execute: supabase login"
    exit 1
fi

# Função para configurar secret
set_secret() {
    local name=$1
    local description=$2
    
    echo -e "${YELLOW}📝 Configurando: ${name}${NC}"
    echo "Descrição: ${description}"
    read -p "Digite o valor (ou pressione Enter para pular): " value
    
    if [ -z "$value" ]; then
        echo -e "${YELLOW}⏭️  Pulando ${name}${NC}"
        return
    fi
    
    if supabase secrets set "${name}=${value}"; then
        echo -e "${GREEN}✅ ${name} configurado com sucesso${NC}"
    else
        echo -e "${RED}❌ Erro ao configurar ${name}${NC}"
    fi
    echo ""
}

# Secrets necessários
echo "=== SECRETS DO SUPABASE ==="
echo ""

set_secret "GEMINI_API_KEY" "API Key do Google Gemini (usado em nathia-chat, moderation-service, behavior-analysis)"
set_secret "ANTHROPIC_API_KEY" "API Key do Anthropic Claude (usado em nat-ai-chat, risk-classifier)"
set_secret "OPENAI_API_KEY" "API Key do OpenAI (usado em transcribe-audio)"
set_secret "SUPABASE_URL" "URL do projeto Supabase (geralmente já configurado automaticamente)"
set_secret "SUPABASE_ANON_KEY" "Chave anônima do Supabase (geralmente já configurado automaticamente)"

# Verificar secrets configurados
echo ""
echo "=== VERIFICANDO SECRETS CONFIGURADOS ==="
supabase secrets list

echo ""
echo -e "${GREEN}✅ Configuração concluída!${NC}"
echo ""
echo "📋 Próximos passos:"
echo "1. Verifique se todos os secrets necessários foram configurados"
echo "2. Teste as Edge Functions para garantir que estão acessando os secrets corretamente"
echo "3. Configure os secrets no GitHub Actions (se ainda não fez)"

