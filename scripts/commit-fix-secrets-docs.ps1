# Script para fazer commit da correção do arquivo REMOVER_SECRETS_DOCS.md
# Uso: .\scripts\commit-fix-secrets-docs.ps1

Write-Host "🔐 Corrigindo arquivo REMOVER_SECRETS_DOCS.md..." -ForegroundColor Cyan
Write-Host ""

# Adicionar mudanças
Write-Host "📦 Adicionando mudanças..." -ForegroundColor Cyan
git add .

# Fazer commit
Write-Host "💾 Fazendo commit..." -ForegroundColor Cyan
git commit -m "security: remover referências a chaves antigas em REMOVER_SECRETS_DOCS.md

- Substituir exemplos de chaves reais por descrições genéricas
- Remover padrões que o Netlify detecta como secrets
- Corrigir erro de secrets scanning no Netlify"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit realizado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Fazendo push para main..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Arquivo corrigido e mudanças enviadas para o GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Próximo passo:" -ForegroundColor Cyan
        Write-Host "   O Netlify deve fazer um novo build automaticamente" -ForegroundColor Cyan
        Write-Host "   O build deve passar sem erros de secrets scanning" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ Erro ao fazer push" -ForegroundColor Red
        Write-Host "Execute manualmente: git push origin main" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "⚠️  Nenhuma mudança para commitar" -ForegroundColor Yellow
    Write-Host "Execute: git status para verificar" -ForegroundColor Yellow
}

Write-Host ""

