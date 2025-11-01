# 📦 Guia de Instalação MCP Tools em Outro Computador

Este guia explica como configurar MCP (Model Context Protocol) tools no Cursor/VS Code em um computador diferente.

## 📋 Pré-requisitos

- Node.js instalado (versão 18 ou superior)
- Cursor ou VS Code instalado
- Acesso ao repositório do projeto

## 🚀 Instalação Rápida

### Windows (PowerShell)

```powershell
# 1. Clone o repositório (se ainda não tiver)
git clone <url-do-repositorio>
cd nossa-maternidade

# 2. Instale as dependências
npm install

# 3. Execute o script de setup
npm run mcp:setup
# ou diretamente:
powershell -ExecutionPolicy Bypass -File scripts/setup-mcp.ps1
```

### Linux/Mac (Bash)

```bash
# 1. Clone o repositório (se ainda não tiver)
git clone <url-do-repositorio>
cd nossa-maternidade

# 2. Instale as dependências
npm install

# 3. Execute o script de setup
npm run mcp:setup:unix
# ou diretamente:
bash scripts/setup-mcp.sh
```

## 📝 Configuração Manual (Alternativa)

Se preferir configurar manualmente:

### 1. Criar diretório .vscode

```bash
mkdir -p .vscode
```

### 2. Criar arquivo .vscode/mcp.json

Crie o arquivo `.vscode/mcp.json` com o seguinte conteúdo:

```json
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
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${workspaceFolder}"],
      "tools": ["read_file", "list_directory", "search_files"]
    }
  }
}
```

### 3. Configuração no Cursor (se aplicável)

Se estiver usando o Cursor, você também pode precisar configurar as MCP tools nas configurações globais:

**Windows:**
```
%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
```

**Linux:**
```
~/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**macOS:**
```
~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

## 🔐 Variáveis de Ambiente

Configure as seguintes variáveis de ambiente, se necessário:

### Windows (PowerShell)

```powershell
# GitHub Personal Access Token (se usar GitHub MCP)
$env:COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN = "seu-token-aqui"

# Sentry (se usar Sentry MCP)
$env:COPILOT_MCP_SENTRY_ACCESS_TOKEN = "seu-token-aqui"
```

### Linux/Mac (Bash)

Adicione ao seu `~/.bashrc` ou `~/.zshrc`:

```bash
# GitHub Personal Access Token
export COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN="seu-token-aqui"

# Sentry
export COPILOT_MCP_SENTRY_ACCESS_TOKEN="seu-token-aqui"
```

## ✅ Validação

Após a configuração, valide se está funcionando:

```bash
npm run mcp:validate
```

Você deve ver a mensagem:
```
MCP config validado em .vscode/mcp.json
```

## 🔄 Reiniciar Editor

**Importante:** Reinicie o Cursor/VS Code para que as mudanças tenham efeito:

- **Cursor/VS Code:** `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac) → "Developer: Reload Window"

## 🧪 Testando MCP Tools

Para testar se as MCP tools estão funcionando:

1. Abra o Cursor/VS Code
2. Abra o chat do Cursor/Claude
3. Peça para listar os arquivos do projeto ou ler um arquivo específico
4. Se funcionar, as MCP tools estão configuradas corretamente

## 📚 Servidores MCP Disponíveis

### GitHub MCP Server
- **Tipo:** HTTP (Remoto)
- **Funcionalidade:** Acesso read-only a repositórios, issues, pull requests
- **Configuração:** Já incluído no `mcp.json`

### Filesystem MCP Server
- **Tipo:** Local
- **Funcionalidade:** Operações seguras no sistema de arquivos
- **Ferramentas:**
  - `read_file`: Ler arquivos
  - `list_directory`: Listar diretórios
  - `search_files`: Buscar arquivos

### Adicionar Mais Servidores

Para adicionar outros servidores MCP, edite o arquivo `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "github": { /* ... */ },
    "filesystem": { /* ... */ },
    "seu-servidor": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@seu-pacote"],
      "tools": ["tool1", "tool2"]
    }
  }
}
```

## 🐛 Troubleshooting

### MCP Server não inicia

```bash
# Verificar Node.js
node --version  # Deve ser >= 18

# Verificar dependências
npm install

# Validar configuração
npm run mcp:validate
```

### Problemas de autenticação

- Verifique se as variáveis de ambiente estão configuradas
- Certifique-se de que os tokens têm as permissões corretas
- No caso do GitHub, o token precisa ter escopo `repo` (read-only)

### Cursor não detecta MCP

1. Verifique se o arquivo `.vscode/mcp.json` existe e está válido
2. Reinicie o Cursor completamente
3. Verifique as configurações globais do Cursor (veja seção acima)

### Erro de permissão no Linux/Mac

```bash
# Dar permissão de execução ao script
chmod +x scripts/setup-mcp.sh
```

## 📖 Documentação Adicional

- **MCP_SETUP.md**: Guia completo de configuração MCP
- **MCP Specification**: https://modelcontextprotocol.io
- **GitHub MCP Server**: https://docs.github.com/en/copilot/customizing-copilot/using-model-context-protocol/using-the-github-mcp-server

## ✨ Checklist de Instalação

- [ ] Node.js instalado e funcionando
- [ ] Repositório clonado
- [ ] Dependências instaladas (`npm install`)
- [ ] Script de setup executado (`npm run mcp:setup` ou `npm run mcp:setup:unix`)
- [ ] Arquivo `.vscode/mcp.json` criado e válido
- [ ] Variáveis de ambiente configuradas (se necessário)
- [ ] Cursor/VS Code reiniciado
- [ ] Validação executada (`npm run mcp:validate`)
- [ ] Teste básico realizado (pedir ao AI para listar arquivos)

---

**Última atualização:** Outubro 2025  
**Mantido por:** Equipe Nossa Maternidade
