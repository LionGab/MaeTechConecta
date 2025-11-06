# Script para instalar Supabase CLI automaticamente no Windows
# Baixa o binario diretamente do GitHub

Write-Host "Instalando Supabase CLI..." -ForegroundColor Cyan

# Verificar se ja esta instalado
try {
    $version = supabase --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Supabase CLI ja instalado: $version" -ForegroundColor Green
        exit 0
    }
} catch {
    # Continuar instalacao
}

# Criar diretorio local
$supabaseDir = "$env:USERPROFILE\.local\bin"
if (-not (Test-Path $supabaseDir)) {
    New-Item -ItemType Directory -Path $supabaseDir -Force | Out-Null
}

# URL do release mais recente
$latestReleaseUrl = "https://api.github.com/repos/supabase/cli/releases/latest"
Write-Host "Verificando versao mais recente..." -ForegroundColor Yellow

try {
    $release = Invoke-RestMethod -Uri $latestReleaseUrl
    $version = $release.tag_name
    Write-Host "Versao mais recente: $version" -ForegroundColor Green
    
    # Encontrar asset para Windows
    $asset = $release.assets | Where-Object { $_.name -like "*windows*amd64*" -or $_.name -like "*windows*x86_64*" }
    
    if (-not $asset) {
        Write-Host "Nao foi possivel encontrar binario para Windows" -ForegroundColor Red
        exit 1
    }
    
    $downloadUrl = $asset.browser_download_url
    $zipPath = "$env:TEMP\supabase-cli.zip"
    
    Write-Host "Baixando Supabase CLI..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath
    
    Write-Host "Extraindo..." -ForegroundColor Yellow
    Expand-Archive -Path $zipPath -DestinationPath "$env:TEMP\supabase-cli" -Force
    
    # Copiar binario
    $exePath = Get-ChildItem -Path "$env:TEMP\supabase-cli" -Filter "supabase.exe" -Recurse | Select-Object -First 1
    if ($exePath) {
        Copy-Item -Path $exePath.FullName -Destination "$supabaseDir\supabase.exe" -Force
        Write-Host "Supabase CLI instalado em $supabaseDir" -ForegroundColor Green
        
        # Adicionar ao PATH
        $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
        $pathArray = $currentPath -split ';' | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
        
        if ($pathArray -notcontains $supabaseDir) {
            [Environment]::SetEnvironmentVariable("Path", "$currentPath;$supabaseDir", "User")
            Write-Host "Adicionado ao PATH do usuario" -ForegroundColor Green
            Write-Host "Feche e reabra o terminal para usar o comando 'supabase'" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Nao foi possivel encontrar o executavel" -ForegroundColor Red
        exit 1
    }
    
    # Limpar
    Remove-Item -Path $zipPath -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$env:TEMP\supabase-cli" -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Host "Instalacao concluida!" -ForegroundColor Green
    
} catch {
    Write-Host "Erro ao instalar: $_" -ForegroundColor Red
    exit 1
}

