# Script de Setup MCP para Windows (PowerShell)
# Configura MCP tools no Cursor/VS Code

Write-Host "🚀 Configurando MCP Tools para Cursor/VS Code..." -ForegroundColor Cyan

$vscodeDir = ".vscode"
$mcpConfigFile = "$vscodeDir\mcp.json"
$cursorConfigFile = "$env:APPDATA\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json"

# Criar diretório .vscode se não existir
if (-not (Test-Path $vscodeDir)) {
    New-Item -ItemType Directory -Path $vscodeDir -Force | Out-Null
    Write-Host "✅ Diretório .vscode criado" -ForegroundColor Green
}

# Criar arquivo mcp.json com configuração padrão
$mcpConfig = @{
    mcpServers = @{
        github = @{
            type = "http"
            url = "https://api.githubcopilot.com/mcp/readonly"
            tools = @("*")
        }
        filesystem = @{
            type = "local"
            command = "npx"
            args = @("-y", "@modelcontextprotocol/server-filesystem", "$PWD")
            tools = @("read_file", "list_directory", "search_files")
        }
    }
} | ConvertTo-Json -Depth 10

# Salvar configuração .vscode/mcp.json
$mcpConfig | Out-File -FilePath $mcpConfigFile -Encoding UTF8 -Force
Write-Host "✅ Configuração MCP criada em $mcpConfigFile" -ForegroundColor Green

# Verificar se Cursor está instalado e configurar
if (Test-Path $env:APPDATA\Cursor) {
    Write-Host "📝 Cursor detectado - configuração adicional pode ser necessária" -ForegroundColor Yellow
    Write-Host "   Consulte: $cursorConfigFile" -ForegroundColor Gray
}

Write-Host "`n✨ Setup concluído!" -ForegroundColor Green
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Reinicie o Cursor/VS Code" -ForegroundColor White
Write-Host "   2. Certifique-se de ter as variáveis de ambiente configuradas" -ForegroundColor White
Write-Host "   3. Execute: npm run mcp:validate" -ForegroundColor White
Write-Host "`n📖 Para mais informações, veja MCP_SETUP.md" -ForegroundColor Gray
