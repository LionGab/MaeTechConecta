# Script para abrir browser na URL do app Expo
# Nota: Este script abre o browser padrao, nao o browser integrado do Cursor
# Para o browser integrado, use Ctrl+Shift+B no Cursor

$url = "http://localhost:8081"

Write-Host "Abrindo browser em $url..." -ForegroundColor Cyan

# Verificar se a porta esta ativa
$portCheck = Test-NetConnection -ComputerName localhost -Port 8081 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($portCheck) {
    Write-Host "Porta 8081 esta ativa" -ForegroundColor Green
    Start-Process $url
    Write-Host "Browser aberto!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Yellow
    Write-Host "1. Configure viewport para iPhone 13 (390x844) via DevTools (F12 -> Ctrl+Shift+M)" -ForegroundColor White
    Write-Host "2. Monitore console, network e performance" -ForegroundColor White
    Write-Host "3. Teste todas as telas do app" -ForegroundColor White
} else {
    Write-Host "Porta 8081 nao esta ativa" -ForegroundColor Red
    Write-Host "Execute pnpm dev primeiro para iniciar o app" -ForegroundColor Yellow
}
