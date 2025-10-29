#!/bin/bash

# Script de instalação para ambiente EROFS (read-only file system)
# Este script contorna limitações de instalação global usando npx

echo "🚀 Configurando projeto em ambiente EROFS..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para tentar pnpm via npx
install_with_pnpm() {
    echo -e "${YELLOW}Tentando instalar com pnpm via npx...${NC}"
    if npx -y pnpm@9.0.0 install; then
        echo -e "${GREEN}✓ Instalação com pnpm bem-sucedida!${NC}"
        return 0
    else
        echo -e "${RED}✗ Falha ao usar pnpm${NC}"
        return 1
    fi
}

# Função fallback para npm
install_with_npm() {
    echo -e "${YELLOW}Tentando instalar com npm como fallback...${NC}"
    if npm install; then
        echo -e "${GREEN}✓ Instalação com npm bem-sucedida!${NC}"
        echo -e "${YELLOW}⚠ Nota: Usando npm ao invés de pnpm. Workspace pode ter comportamento diferente.${NC}"
        return 0
    else
        echo -e "${RED}✗ Falha ao usar npm${NC}"
        return 1
    fi
}

# Tentar instalação
if ! install_with_pnpm; then
    echo ""
    echo -e "${YELLOW}pnpm falhou, tentando npm...${NC}"
    if ! install_with_npm; then
        echo ""
        echo -e "${RED}Erro: Não foi possível instalar dependências com nenhum método.${NC}"
        echo ""
        echo "Possíveis soluções:"
        echo "1. Execute este script em um ambiente com permissões de escrita"
        echo "2. Use um terminal local (não cloud/container restrito)"
        echo "3. Solicite permissões ao administrador do sistema"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}✓ Configuração concluída!${NC}"
echo ""
echo "Para iniciar o desenvolvimento:"
echo "  npm run dev    # Inicia todos os apps em modo dev"
echo "  npm run build  # Faz build de todos os projetos"
echo ""
