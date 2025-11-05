# Script rápido para instalar Supabase CLI no Windows
# Execute: .\scripts\install-supabase-cli-quick.ps1

Write-Host "🔧 Instalando Supabase CLI (Método Rápido)..." -ForegroundColor Cyan
Write-Host ""

# Verificar se já está instalado
if (Get-Command supabase -ErrorAction SilentlyContinue) {
    Write-Host "✅ Supabase CLI já está instalado!" -ForegroundColor Green
    supabase --version
    exit 0
}

# Verificar se Scoop está instalado
if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Instalando Scoop primeiro..." -ForegroundColor Yellow
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar Scoop" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Scoop instalado!" -ForegroundColor Green
    Write-Host ""
}

# Adicionar bucket do Supabase
Write-Host "📦 Adicionando bucket do Supabase..." -ForegroundColor Cyan
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git

# Instalar Supabase CLI
Write-Host "📦 Instalando Supabase CLI..." -ForegroundColor Cyan
scoop install supabase

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Supabase CLI instalado com sucesso!" -ForegroundColor Green
    Write-Host ""
    supabase --version
    Write-Host ""
    Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
    Write-Host "  1. supabase login"
    Write-Host "  2. supabase link --project-ref SEU-PROJECT-REF"
    Write-Host "  3. .\scripts\setup-secrets.ps1"
} else {
    Write-Host "❌ Erro ao instalar Supabase CLI" -ForegroundColor Red
    exit 1
}

