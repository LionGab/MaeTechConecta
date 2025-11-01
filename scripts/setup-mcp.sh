#!/bin/bash
# Script de Setup MCP para Linux/Mac (Bash)
# Configura MCP tools no Cursor/VS Code

echo "🚀 Configurando MCP Tools para Cursor/VS Code..."

VSCODE_DIR=".vscode"
MCP_CONFIG_FILE="$VSCODE_DIR/mcp.json"

# Criar diretório .vscode se não existir
if [ ! -d "$VSCODE_DIR" ]; then
    mkdir -p "$VSCODE_DIR"
    echo "✅ Diretório .vscode criado"
fi

# Criar arquivo mcp.json com configuração padrão
cat > "$MCP_CONFIG_FILE" << 'EOF'
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "tools": ["*"]
    },
    "filesystem": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "$PWD"],
      "tools": ["read_file", "list_directory", "search_files"]
    }
  }
}
EOF

# Substituir $PWD pelo diretório atual
CURRENT_DIR=$(pwd)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|\$PWD|$CURRENT_DIR|g" "$MCP_CONFIG_FILE"
else
    # Linux
    sed -i "s|\$PWD|$CURRENT_DIR|g" "$MCP_CONFIG_FILE"
fi

echo "✅ Configuração MCP criada em $MCP_CONFIG_FILE"

# Verificar se Cursor está instalado
CURSOR_CONFIG="$HOME/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"
if [ -d "$HOME/.config/Cursor" ]; then
    echo "📝 Cursor detectado - configuração adicional pode ser necessária"
    echo "   Consulte: $CURSOR_CONFIG"
fi

echo ""
echo "✨ Setup concluído!"
echo "📋 Próximos passos:"
echo "   1. Reinicie o Cursor/VS Code"
echo "   2. Certifique-se de ter as variáveis de ambiente configuradas"
echo "   3. Execute: npm run mcp:validate"
echo ""
echo "📖 Para mais informações, veja MCP_SETUP.md"

# Tornar script executável
chmod +x "$0"
