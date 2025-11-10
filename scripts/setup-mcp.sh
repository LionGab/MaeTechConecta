#!/bin/bash
# Script Bash para Configurar MCP no Cursor (Mac/Linux)
# Execute: chmod +x scripts/setup-mcp.sh && ./scripts/setup-mcp.sh

echo "===================================="
echo "Configurando MCP para Cursor"
echo "===================================="
echo ""

# Detectar sistema operacional
if [[ "$OSTYPE" == "darwin"* ]]; then
    CURSOR_MCP_PATH="$HOME/Library/Application Support/Cursor/User"
    OS_NAME="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    CURSOR_MCP_PATH="$HOME/.config/Cursor/User"
    OS_NAME="Linux"
else
    echo "❌ Sistema operacional não suportado: $OSTYPE"
    exit 1
fi

echo "Sistema detectado: $OS_NAME"
echo "Caminho do Cursor: $CURSOR_MCP_PATH"
echo ""

# Criar pasta se não existir
if [ ! -d "$CURSOR_MCP_PATH" ]; then
    echo "Criando pasta de configuração do Cursor..."
    mkdir -p "$CURSOR_MCP_PATH"
fi

# Copiar configuração MCP do workspace para Cursor
WORKSPACE_MCP_PATH=".vscode/mcp.json"
CURSOR_MCP_FILE="$CURSOR_MCP_PATH/mcp.json"

if [ -f "$WORKSPACE_MCP_PATH" ]; then
    echo "Copiando configuração MCP..."
    cp "$WORKSPACE_MCP_PATH" "$CURSOR_MCP_FILE"
    echo "✅ Configuração MCP copiada para:"
    echo "   $CURSOR_MCP_FILE"
else
    echo "⚠️ Arquivo .vscode/mcp.json não encontrado!"
    echo "   Criando configuração básica..."
    
    cat > "$CURSOR_MCP_FILE" << EOF
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "tools": ["*"]
    },
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "${workspaceFolder}"
      ],
      "env": {}
    },
    "brave-search": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-brave-search"
      ],
      "env": {
        "BRAVE_API_KEY": ""
      }
    }
  }
}
EOF
    
    echo "✅ Configuração básica criada!"
fi

echo ""
echo "===================================="
echo "✅ Configuração MCP concluída!"
echo "===================================="
echo ""
echo "⚠️ IMPORTANTE:"
echo "   1. Reinicie o Cursor para aplicar as configurações"
echo "   2. Verifique se os MCP servers estão funcionando"
echo "   3. Configure as chaves de API necessárias"
echo ""
echo "📝 Próximos passos:"
echo "   - Configure BRAVE_API_KEY no arquivo mcp.json se necessário"
echo "   - Para GitHub MCP, não precisa de configuração adicional"
echo ""
