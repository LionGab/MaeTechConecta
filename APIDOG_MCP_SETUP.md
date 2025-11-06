# Configuração Apidog MCP Server

Este guia explica como configurar o Apidog MCP Server no Cursor para acessar especificações de API.

## Pré-requisitos

1. **Access Token do Apidog**: Obtenha em [Apidog Settings > Personal Access Token](https://app.apidog.com/settings/tokens)
2. **Project ID**: ID do projeto Apidog que contém a especificação da API

## Configuração no Cursor

### Opção 1: Via Interface do Cursor (Recomendado)

1. Abra o Cursor
2. Clique no ícone de configurações (⚙️) no canto superior direito
3. Selecione **"MCP"** no menu lateral
4. Clique em **"+ Adicionar novo servidor MCP global"**
5. Cole a seguinte configuração (substitua os valores):

```json
{
  "mcpServers": {
    "API specification": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "apidog-mcp-server@latest",
        "--project=<project-id>"
      ],
      "env": {
        "APIDOG_ACCESS_TOKEN": "<access-token>"
      }
    }
  }
}
```

### Opção 2: Via Arquivo de Configuração

No Windows, a configuração do MCP pode estar em:
- `%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
- Ou via Settings → MCP → Edit Configuration

## Variáveis Necessárias

Substitua no arquivo de configuração:

- `<access-token>`: Seu token de acesso do Apidog
- `<project-id>`: ID do projeto Apidog (ex: `123456789`)

## Verificação

Após configurar, teste a conexão perguntando à IA:

```
Liste os recursos disponíveis do Apidog MCP
```

Ou:

```
Busque a especificação do schema Product na API
```

## Exemplo de Uso

Após configurado, você pode pedir:

- "Busque a especificação do schema Product e schemas relacionados"
- "Gere records Java para o schema Product"
- "Liste todos os endpoints da API"

## Troubleshooting

### MCP não aparece
- Reinicie o Cursor completamente
- Verifique se o Node.js está instalado (necessário para `npx`)
- Verifique se o access token está correto

### Erro de autenticação
- Verifique se o token ainda é válido
- Gere um novo token no Apidog se necessário

### Erro de projeto
- Verifique se o Project ID está correto
- Confirme que você tem acesso ao projeto no Apidog

