# =====================================================
# Instalar Supabase CLI (Windows)
# =====================================================

Write-Host "Instalando Supabase CLI..." -ForegroundColor Cyan

# Verificar se já está instalado
$supabaseInstalled = $false
try {
    $version = supabase --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: Supabase CLI ja esta instalado!" -ForegroundColor Green
        Write-Host "   Versao: $version" -ForegroundColor Gray
        $supabaseInstalled = $true
    }
} catch {
    $supabaseInstalled = $false
}

if (-not $supabaseInstalled) {
    Write-Host "Baixando Supabase CLI..." -ForegroundColor Yellow
    
    # URL do release mais recente
    $downloadUrl = "https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.zip"
    $zipPath = "$env:TEMP\supabase.zip"
    $extractPath = "$env:TEMP\supabase"
    $installPath = "$env:LOCALAPPDATA\supabase"
    
    try {
        # Baixar
        Write-Host "   Baixando de GitHub..." -ForegroundColor Gray
        Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath -UseBasicParsing
        
        # Extrair
        Write-Host "   Extraindo..." -ForegroundColor Gray
        if (Test-Path $extractPath) {
            Remove-Item $extractPath -Recurse -Force
        }
        Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
        
        # Encontrar executável
        $supabaseExe = Get-ChildItem -Path $extractPath -Recurse -Filter "supabase.exe" | Select-Object -First 1
        
        if ($supabaseExe) {
            # Criar diretório de instalação
            if (-not (Test-Path $installPath)) {
                New-Item -ItemType Directory -Path $installPath -Force | Out-Null
            }
            
            # Copiar executável
            Copy-Item $supabaseExe.FullName -Destination "$installPath\supabase.exe" -Force
            
            # Adicionar ao PATH do usuário
            $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
            if ($userPath -notlike "*$installPath*") {
                [Environment]::SetEnvironmentVariable("Path", "$userPath;$installPath", "User")
                $env:Path += ";$installPath"
            }
            
            Write-Host "OK: Supabase CLI instalado com sucesso!" -ForegroundColor Green
            Write-Host "   Localizacao: $installPath\supabase.exe" -ForegroundColor Gray
            Write-Host "   Adicionado ao PATH do usuario" -ForegroundColor Gray
            Write-Host ""
            Write-Host "NOTA: Feche e reabra o terminal para usar o comando 'supabase'" -ForegroundColor Yellow
            Write-Host "   Ou use o caminho completo: $installPath\supabase.exe" -ForegroundColor Gray
            
            # Verificar instalação
            & "$installPath\supabase.exe" --version
        } else {
            Write-Host "ERRO: Executavel nao encontrado no ZIP" -ForegroundColor Red
            exit 1
        }
        
        # Limpar arquivos temporários
        Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
        Remove-Item $extractPath -Recurse -Force -ErrorAction SilentlyContinue
        
    } catch {
        Write-Host "ERRO ao instalar: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Instalacao concluida!" -ForegroundColor Green


