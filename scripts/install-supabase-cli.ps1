# Script para instalar Supabase CLI no Windows
# Uso: .\scripts\install-supabase-cli.ps1

Write-Host "🔧 Instalando Supabase CLI no Windows..." -ForegroundColor Cyan
Write-Host ""

# Verificar se já está instalado
if (Get-Command supabase -ErrorAction SilentlyContinue) {
    Write-Host "✅ Supabase CLI já está instalado!" -ForegroundColor Green
    $version = supabase --version
    Write-Host "Versão: $version" -ForegroundColor Green
    Write-Host ""
    exit 0
}

Write-Host "📦 Métodos de instalação disponíveis:" -ForegroundColor Yellow
Write-Host "1. Scoop (Recomendado - mais fácil)"
Write-Host "2. Chocolatey"
Write-Host "3. Download direto (binário)"
Write-Host ""

$method = Read-Host "Escolha o método (1-3) [padrão: 1]"

if ([string]::IsNullOrWhiteSpace($method)) {
    $method = "1"
}

switch ($method) {
    "1" {
        Write-Host "🍺 Instalando via Scoop..." -ForegroundColor Cyan
        Write-Host ""
        
        # Verificar se Scoop está instalado
        if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
            Write-Host "⚠️  Scoop não encontrado. Instalando Scoop primeiro..." -ForegroundColor Yellow
            Write-Host ""
            
            # Instalar Scoop
            Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
            Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
            
            if ($LASTEXITCODE -ne 0) {
                Write-Host "❌ Erro ao instalar Scoop" -ForegroundColor Red
                exit 1
            }
            
            Write-Host "✅ Scoop instalado!" -ForegroundColor Green
            Write-Host ""
        }
        
        # Instalar Supabase CLI via Scoop
        Write-Host "📦 Instalando Supabase CLI via Scoop..." -ForegroundColor Cyan
        scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
        scoop install supabase
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Supabase CLI instalado via Scoop!" -ForegroundColor Green
        } else {
            Write-Host "❌ Erro ao instalar via Scoop" -ForegroundColor Red
            exit 1
        }
    }
    
    "2" {
        Write-Host "🍫 Instalando via Chocolatey..." -ForegroundColor Cyan
        Write-Host ""
        
        # Verificar se Chocolatey está instalado
        if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
            Write-Host "⚠️  Chocolatey não encontrado. Instalando Chocolatey primeiro..." -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Execute como Administrador:" -ForegroundColor Yellow
            Write-Host 'Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString("https://community.chocolatey.org/install.ps1"))' -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Depois execute: choco install supabase" -ForegroundColor Yellow
            exit 1
        }
        
        # Instalar Supabase CLI via Chocolatey
        Write-Host "📦 Instalando Supabase CLI via Chocolatey..." -ForegroundColor Cyan
        choco install supabase -y
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Supabase CLI instalado via Chocolatey!" -ForegroundColor Green
        } else {
            Write-Host "❌ Erro ao instalar via Chocolatey" -ForegroundColor Red
            exit 1
        }
    }
    
    "3" {
        Write-Host "📥 Baixando binário diretamente..." -ForegroundColor Cyan
        Write-Host ""
        
        # Criar diretório local
        $supabaseDir = "$env:USERPROFILE\.local\bin"
        if (-not (Test-Path $supabaseDir)) {
            New-Item -ItemType Directory -Path $supabaseDir -Force | Out-Null
        }
        
        # URL do release mais recente
        $latestReleaseUrl = "https://api.github.com/repos/supabase/cli/releases/latest"
        Write-Host "🔍 Verificando versão mais recente..." -ForegroundColor Cyan
        
        try {
            $release = Invoke-RestMethod -Uri $latestReleaseUrl
            $version = $release.tag_name
            Write-Host "Versão mais recente: $version" -ForegroundColor Green
            
            # Encontrar asset para Windows
            $asset = $release.assets | Where-Object { $_.name -like "*windows*amd64*" -or $_.name -like "*windows*x86_64*" }
            
            if (-not $asset) {
                Write-Host "❌ Não foi possível encontrar binário para Windows" -ForegroundColor Red
                Write-Host "Tente usar Scoop ou Chocolatey (métodos 1 ou 2)" -ForegroundColor Yellow
                exit 1
            }
            
            $downloadUrl = $asset.browser_download_url
            $zipPath = "$env:TEMP\supabase-cli.zip"
            
            Write-Host "📥 Baixando Supabase CLI..." -ForegroundColor Cyan
            Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath
            
            Write-Host "📦 Extraindo..." -ForegroundColor Cyan
            Expand-Archive -Path $zipPath -DestinationPath "$env:TEMP\supabase-cli" -Force
            
            # Copiar binário
            $exePath = Get-ChildItem -Path "$env:TEMP\supabase-cli" -Filter "supabase.exe" -Recurse | Select-Object -First 1
            if ($exePath) {
                Copy-Item -Path $exePath.FullName -Destination "$supabaseDir\supabase.exe" -Force
                Write-Host "✅ Supabase CLI instalado em $supabaseDir" -ForegroundColor Green
                
                # Adicionar ao PATH (se não estiver)
                $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
                $pathArray = $currentPath -split ';' | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
                
                # Normalizar caminhos para comparação (remover trailing backslash)
                $supabaseDirNormalized = $supabaseDir.TrimEnd('\')
                
                if ($pathArray -notcontains $supabaseDir -and $pathArray -notcontains $supabaseDirNormalized) {
                    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$supabaseDir", "User")
                    Write-Host "✅ Adicionado ao PATH do usuário" -ForegroundColor Green
                    Write-Host "⚠️  Você precisa fechar e reabrir o terminal para usar o comando 'supabase'" -ForegroundColor Yellow
                } else {
                    Write-Host "ℹ️  Diretório já está no PATH" -ForegroundColor Cyan
                }
            } else {
                Write-Host "❌ Não foi possível encontrar o executável" -ForegroundColor Red
                exit 1
            }
            
            # Limpar
            Remove-Item -Path $zipPath -Force -ErrorAction SilentlyContinue
            Remove-Item -Path "$env:TEMP\supabase-cli" -Recurse -Force -ErrorAction SilentlyContinue
            
        } catch {
            Write-Host "❌ Erro ao baixar: $_" -ForegroundColor Red
            Write-Host "Tente usar Scoop ou Chocolatey (métodos 1 ou 2)" -ForegroundColor Yellow
            exit 1
        }
    }
    
    default {
        Write-Host "❌ Método inválido" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Instalação concluída!" -ForegroundColor Green
Write-Host ""

# Verificar instalação
if (Get-Command supabase -ErrorAction SilentlyContinue) {
    $version = supabase --version
    Write-Host "✅ Supabase CLI instalado com sucesso!" -ForegroundColor Green
    Write-Host "Versão: $version" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Faça login: supabase login"
    Write-Host "2. Link com projeto: supabase link --project-ref SEU-PROJECT-REF"
    Write-Host "3. Configure secrets: .\scripts\setup-secrets.ps1"
    Write-Host ""
} else {
    Write-Host "⚠️  Supabase CLI instalado, mas não encontrado no PATH" -ForegroundColor Yellow
    Write-Host "Feche e reabra o terminal, ou reinicie o PowerShell" -ForegroundColor Yellow
    Write-Host ""
}
