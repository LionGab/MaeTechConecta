# Configuração Apidog MCP - Guia Rápido

## ✅ Configuração já adicionada

A configuração do Apidog MCP Server já foi adicionada ao arquivo `mcp.json`.

## 🔧 Próximos Passos

### 1. Obter Access Token do Apidog

1. Acesse: https://app.apidog.com/settings/tokens
2. Crie um novo Personal Access Token
3. Copie o token gerado

### 2. Obter Project ID

1. Acesse seu projeto no Apidog
2. Na URL ou nas configurações do projeto, encontre o Project ID
3. Exemplo de URL: `https://app.apidog.com/project/123456789/...` → Project ID é `123456789`

### 3. Atualizar Configuração

Edite o arquivo `c:\Users\Usuario\.cursor\mcp.json` e substitua:

- `<access-token>` pelo seu token real
- `<project-id>` pelo ID do seu projeto

Exemplo:
```json
"API specification": {
  "command": "cmd",
  "args": [
    "/c",
    "npx",
    "-y",
    "apidog-mcp-server@latest",
    "--project=123456789"
  ],
  "env": {
    "APIDOG_ACCESS_TOKEN": "your-real-token-here"
  }
}
```

### 4. Reiniciar Cursor

Após atualizar, reinicie completamente o Cursor para carregar a nova configuração MCP.

### 5. Testar

Após reiniciar, pergunte à IA:
- "Liste os recursos do Apidog MCP"
- "Busque a especificação do schema Product"

## 📝 Nota

Se você já tem os valores, posso atualizar o arquivo automaticamente. Basta me informar:
- Access Token: `seu-token`
- Project ID: `seu-project-id`

