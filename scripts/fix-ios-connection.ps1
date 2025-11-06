# 🔧 Script para Resolver Problemas de Conexão iOS com Expo

Write-Host "🔧 Fix: iOS Connection Error" -ForegroundColor Cyan
Write-Host ""

# Verificar se está no diretório correto
if (-not (Test-Path "apps/mobile/package.json")) {
    Write-Host "❌ Erro: Execute este script da raiz do projeto" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Opções disponíveis:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Usar TUNNEL (Recomendado - funciona mesmo em redes diferentes)" -ForegroundColor Green
Write-Host "2. Usar LAN (requer mesma rede Wi-Fi)" -ForegroundColor Green
Write-Host "3. Usar Localhost (apenas simulador)" -ForegroundColor Green
Write-Host "4. Configurar Firewall (permitir porta 8081)" -ForegroundColor Green
Write-Host "5. Verificar IP atual" -ForegroundColor Green
Write-Host "6. Limpar cache e reiniciar" -ForegroundColor Green
Write-Host ""

$opcao = Read-Host "Escolha uma opção (1-6)"

switch ($opcao) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Iniciando com TUNNEL..." -ForegroundColor Cyan
        Write-Host "   Isso usa o servidor do Expo para conectar" -ForegroundColor Gray
        Write-Host "   Funciona mesmo em redes diferentes!" -ForegroundColor Gray
        Write-Host ""
        Set-Location apps/mobile
        pnpm dev:tunnel
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 Iniciando com LAN..." -ForegroundColor Cyan
        Write-Host "   Certifique-se de que iOS e PC estão na mesma rede Wi-Fi" -ForegroundColor Yellow
        Write-Host ""
        Set-Location apps/mobile
        pnpm dev:lan
    }
    "3" {
        Write-Host ""
        Write-Host "🚀 Iniciando com Localhost..." -ForegroundColor Cyan
        Write-Host "   Isso só funciona no simulador iOS, não em dispositivos físicos" -ForegroundColor Yellow
        Write-Host ""
        Set-Location apps/mobile
        pnpm dev:localhost
    }
    "4" {
        Write-Host ""
        Write-Host "🔧 Configurando Firewall..." -ForegroundColor Cyan

        # Verificar se está rodando como administrador
        $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

        if (-not $isAdmin) {
            Write-Host "⚠️  Aviso: Precisa executar como Administrador para configurar firewall" -ForegroundColor Yellow
            Write-Host "   Execute o PowerShell como Administrador e rode novamente" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "   Ou configure manualmente:" -ForegroundColor Yellow
            Write-Host "   1. Abra Windows Defender Firewall" -ForegroundColor Gray
            Write-Host "   2. Configurações Avançadas" -ForegroundColor Gray
            Write-Host "   3. Regras de Entrada → Nova Regra" -ForegroundColor Gray
            Write-Host "   4. Porta → TCP → 8081 → Permitir" -ForegroundColor Gray
            Write-Host ""
        } else {
            Write-Host "   Criando regra de firewall para porta 8081..." -ForegroundColor Gray
            try {
                New-NetFirewallRule -DisplayName "Expo Metro Bundler" -Direction Inbound -LocalPort 8081 -Protocol TCP -Action Allow -ErrorAction SilentlyContinue
                Write-Host "✅ Firewall configurado!" -ForegroundColor Green
            } catch {
                Write-Host "⚠️  Erro ao configurar firewall: $_" -ForegroundColor Yellow
                Write-Host "   Configure manualmente seguindo as instruções acima" -ForegroundColor Yellow
            }
        }
    }
    "5" {
        Write-Host ""
        Write-Host "🔍 Verificando IP atual..." -ForegroundColor Cyan
        Write-Host ""

        $ipv4 = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.*" } | Select-Object -First 1

        if ($ipv4) {
            Write-Host "✅ IP encontrado: $($ipv4.IPAddress)" -ForegroundColor Green
            Write-Host ""
            Write-Host "   Certifique-se de que o iOS está na mesma rede Wi-Fi" -ForegroundColor Yellow
            Write-Host "   O Expo deve mostrar: exp://$($ipv4.IPAddress):8081" -ForegroundColor Gray
        } else {
            Write-Host "⚠️  Não foi possível encontrar IP da rede local" -ForegroundColor Yellow
            Write-Host "   Verifique sua conexão Wi-Fi" -ForegroundColor Yellow
        }

        Write-Host ""
        Write-Host "   Para ver todos os IPs:" -ForegroundColor Gray
        Write-Host "   ipconfig | findstr IPv4" -ForegroundColor DarkGray
    }
    "6" {
        Write-Host ""
        Write-Host "🧹 Limpando cache..." -ForegroundColor Cyan

        # Parar processos Node
        Write-Host "   Parando processos Node..." -ForegroundColor Gray
        Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

        Set-Location apps/mobile

        # Limpar cache
        Write-Host "   Limpando cache do Expo..." -ForegroundColor Gray
        pnpm clean

        Write-Host ""
        Write-Host "✅ Cache limpo!" -ForegroundColor Green
        Write-Host ""
        Write-Host "   Agora execute: pnpm dev" -ForegroundColor Yellow
        Write-Host "   Ou escolha uma opção de conexão (1-3)" -ForegroundColor Yellow
    }
    default {
        Write-Host ""
        Write-Host "❌ Opção inválida" -ForegroundColor Red
        Write-Host "   Escolha uma opção de 1 a 6" -ForegroundColor Yellow
    }
}

Write-Host ""

