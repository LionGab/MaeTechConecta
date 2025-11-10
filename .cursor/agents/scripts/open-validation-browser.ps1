# Script para abrir browser na tela de validação de componentes
# Validação visual das correções do Agente 1 - Frontend

Write-Host "🌐 Abrindo browser para validação de componentes..." -ForegroundColor Cyan

# URL da tela de validação
$validationUrl = "http://localhost:8081/component-validation"

# Verificar se o app está rodando
$portCheck = netstat -ano | findstr ":8081"
if (-not $portCheck) {
    Write-Host "❌ App não está rodando na porta 8081" -ForegroundColor Red
    Write-Host "Execute: pnpm dev" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ App está rodando na porta 8081" -ForegroundColor Green

# Tentar abrir no browser padrão
Write-Host "📱 Abrindo: $validationUrl" -ForegroundColor Cyan

# Windows: abrir no navegador padrão
Start-Process $validationUrl

Write-Host ""
Write-Host "✅ Browser aberto!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Checklist de Validação:" -ForegroundColor Yellow
Write-Host "  ✅ Button: Variantes, tamanhos, estados (loading, disabled, ícone)" -ForegroundColor White
Write-Host "  ✅ Card: Variantes (elevated, outlined, flat), clicável" -ForegroundColor White
Write-Host "  ✅ Input: Normal, com ícone, com erro, com helper text" -ForegroundColor White
Write-Host "  ✅ Text: Todas as variantes (h1, h2, h3, subtitle, body, caption)" -ForegroundColor White
Write-Host "  ✅ Badge: Variantes (info, success, warning, error), tamanhos" -ForegroundColor White
Write-Host "  ✅ GradientView: Gradiente com tipos explícitos" -ForegroundColor White
Write-Host "  ✅ EnhancedButton: Botão com animações" -ForegroundColor White
Write-Host "  ✅ AnimatedCard: Card com animações" -ForegroundColor White
Write-Host ""
Write-Host "💡 Dica: Use F12 para abrir DevTools e verificar:" -ForegroundColor Cyan
Write-Host "  - Console: Erros e warnings" -ForegroundColor White
Write-Host "  - Network: Requisições" -ForegroundColor White
Write-Host "  - Performance: FPS e memória" -ForegroundColor White
Write-Host "  - Accessibility: Árvore de acessibilidade" -ForegroundColor White


