# Script PowerShell para configurar secrets no Supabase
# Uso: .\scripts\setup-secrets.ps1

Write-Host "🔐 Configurando Secrets no Supabase..." -ForegroundColor Cyan
Write-Host ""

# Verificar se supabase CLI está instalado
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Supabase CLI não encontrado" -ForegroundColor Red
    Write-Host "Instale com: npm install -g supabase"
    exit 1
}

# Verificar se está logado
try {
    supabase projects list 2>&1 | Out-Null
} catch {
    Write-Host "⚠️  Você precisa fazer login no Supabase" -ForegroundColor Yellow
    Write-Host "Execute: supabase login"
    exit 1
}

# Função para configurar secret
function Set-Secret {
    param(
        [string]$Name,
        [string]$Description
    )
    
    Write-Host "📝 Configurando: $Name" -ForegroundColor Yellow
    Write-Host "Descrição: $Description"
    $value = Read-Host "Digite o valor (ou pressione Enter para pular)"
    
    if ([string]::IsNullOrWhiteSpace($value)) {
        Write-Host "⏭️  Pulando $Name" -ForegroundColor Yellow
        return
    }
    
    $result = supabase secrets set "${Name}=${value}" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $Name configurado com sucesso" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao configurar $Name" -ForegroundColor Red
        Write-Host $result
    }
    Write-Host ""
}

# Secrets necessários
Write-Host "=== SECRETS DO SUPABASE ===" -ForegroundColor Cyan
Write-Host ""

Set-Secret -Name "GEMINI_API_KEY" -Description "API Key do Google Gemini (usado em nathia-chat, moderation-service, behavior-analysis)"
Set-Secret -Name "ANTHROPIC_API_KEY" -Description "API Key do Anthropic Claude (usado em nat-ai-chat, risk-classifier)"
Set-Secret -Name "OPENAI_API_KEY" -Description "API Key do OpenAI (usado em transcribe-audio)"
Set-Secret -Name "SUPABASE_URL" -Description "URL do projeto Supabase (geralmente já configurado automaticamente)"
Set-Secret -Name "SUPABASE_ANON_KEY" -Description "Chave anônima do Supabase (geralmente já configurado automaticamente)"

# Verificar secrets configurados
Write-Host ""
Write-Host "=== VERIFICANDO SECRETS CONFIGURADOS ===" -ForegroundColor Cyan
supabase secrets list

Write-Host ""
Write-Host "✅ Configuração concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:"
Write-Host "1. Verifique se todos os secrets necessários foram configurados"
Write-Host "2. Teste as Edge Functions para garantir que estão acessando os secrets corretamente"
Write-Host "3. Configure os secrets no GitHub Actions (se ainda não fez)"

