# Script de sincronização rápida - Nossa Maternidade (PowerShell)
# Uso: .\scripts\sync-context.ps1

Write-Host "🔄 Sincronizando contexto..." -ForegroundColor Cyan

# 1. Pull do Git
Write-Host "📥 Fazendo pull do repositório..." -ForegroundColor Yellow
git pull origin main

# 2. Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
pnpm install

# 3. Verificar versões
Write-Host "✅ Verificando versões instaladas..." -ForegroundColor Yellow
Set-Location apps/mobile
pnpm list expo @types/jest @sentry/react-native react-native-web
Set-Location ../..

Write-Host ""
Write-Host "✨ Sincronização completa!" -ForegroundColor Green
Write-Host "📖 Para mais detalhes, veja: docs/CONTEXTO_RAPIDO.md" -ForegroundColor Cyan

