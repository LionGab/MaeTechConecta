# Guia de Instalação MCP Tools - Outro Computador

Este guia explica como instalar e configurar as ferramentas MCP (Model Context Protocol) no Cursor em outro computador.

## Pré-requisitos

- Cursor instalado
- Node.js instalado (para executar os servidores MCP via npx)
- Acesso ao repositório do projeto

## Instalação Rápida

### 1. Clone o Repositório

```bash
git clone <seu-repositorio>
cd nossa-maternidade
```

### 2. Execute o Script de Setup

**No Linux:**
```bash
npm run mcp:setup:unix
# ou
bash scripts/setup-mcp.sh
```

**No Windows (PowerShell):**
```powershell
npm run mcp:setup
# ou
powershell -ExecutionPolicy Bypass -File scripts/setup-mcp.ps1
```

**No macOS:**
```bash
npm run mcp:setup:unix
# ou
bash scripts/setup-mcp.sh
```

### 3. Reinicie o Cursor

Feche completamente o Cursor e abra novamente para que as configurações sejam aplicadas.

## Configuração Manual (Alternativa)

Se preferir configurar manualmente:

### 1. Criar Arquivo de Configuração

O arquivo `.vscode/mcp.json` já deve estar no repositório. Se não estiver, copie o conteúdo abaixo:

```json
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
```

### 2. Copiar para o Cursor

**Linux:**
```bash
mkdir -p ~/.config/Cursor/User
cp .vscode/mcp.json ~/.config/Cursor/User/mcp.json
```

**macOS:**
```bash
mkdir -p ~/Library/Application\ Support/Cursor/User
cp .vscode/mcp.json ~/Library/Application\ Support/Cursor/User/mcp.json
```

**Windows:**
```powershell
mkdir -p $env:APPDATA\Cursor\User
copy .vscode\mcp.json $env:APPDATA\Cursor\User\mcp.json
```

## Configuração de Chaves de API

### Brave Search (Opcional)

Se quiser usar o Brave Search MCP, você precisa de uma chave de API:

1. Obtenha uma chave em: https://brave.com/search/api/
2. Edite o arquivo de configuração MCP:

**Linux/macOS:**
```bash
nano ~/.config/Cursor/User/mcp.json  # Linux
# ou
nano ~/Library/Application\ Support/Cursor/User/mcp.json  # macOS
```

**Windows:**
```powershell
notepad $env:APPDATA\Cursor\User\mcp.json
```

3. Substitua a string vazia em `BRAVE_API_KEY`:
```json
"env": {
  "BRAVE_API_KEY": "sua-chave-api-aqui"
}
```

## Verificação

### Validar Configuração

```bash
npm run mcp:validate
```

### Verificar se os Servers Estão Funcionando

1. Abra o Cursor
2. Abra o Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Procure por "MCP" ou "Model Context Protocol"
4. Verifique se os servidores aparecem na lista

## Servers MCP Incluídos

### 1. GitHub MCP Server
- **Tipo:** HTTP (Remote)
- **Acesso:** Read-only repository data
- **Configuração:** Não necessária
- **Ferramentas:** Repository, issues, pull requests, discussions

### 2. Filesystem MCP Server
- **Tipo:** Local (stdio)
- **Acesso:** Operações seguras no sistema de arquivos
- **Configuração:** Não necessária
- **Ferramentas:** read_file, list_directory, search_files

### 3. Brave Search MCP Server
- **Tipo:** Local (stdio)
- **Acesso:** Busca na web via Brave Search API
- **Configuração:** Requer BRAVE_API_KEY
- **Ferramentas:** Busca na web

## Troubleshooting

### MCP Servers Não Aparecem

1. Verifique se o arquivo `mcp.json` está no local correto
2. Reinicie o Cursor completamente
3. Verifique os logs do Cursor:
   - **Linux:** `~/.config/Cursor/logs/`
   - **macOS:** `~/Library/Application Support/Cursor/logs/`
   - **Windows:** `%APPDATA%\Cursor\logs\`

### Erro ao Executar Servers

1. Verifique se o Node.js está instalado:
   ```bash
   node --version
   npm --version
   ```

2. Verifique se o npx está disponível:
   ```bash
   npx --version
   ```

### Erro de Permissão

**Linux/macOS:**
```bash
chmod +x scripts/setup-mcp.sh
```

**Windows:**
Certifique-se de executar o PowerShell como Administrador se necessário.

## Arquivos Importantes

- `.vscode/mcp.json` - Configuração do workspace
- `~/.config/Cursor/User/mcp.json` (Linux) - Configuração global do Cursor
- `~/Library/Application Support/Cursor/User/mcp.json` (macOS) - Configuração global do Cursor
- `%APPDATA%\Cursor\User\mcp.json` (Windows) - Configuração global do Cursor
- `scripts/setup-mcp.sh` - Script de setup para Linux/macOS
- `scripts/setup-mcp.ps1` - Script de setup para Windows

## Próximos Passos

Após a instalação:

1. ✅ Reinicie o Cursor
2. ✅ Teste os MCP servers
3. ✅ Configure chaves de API se necessário
4. ✅ Consulte `MCP_SETUP.md` para mais detalhes

## Referências

- [MCP Specification](https://modelcontextprotocol.io)
- [GitHub Copilot MCP Docs](https://docs.github.com/en/copilot/customizing-copilot/using-model-context-protocol)
- [Cursor Documentation](https://cursor.sh/docs)

---

**Última atualização:** Janeiro 2025
