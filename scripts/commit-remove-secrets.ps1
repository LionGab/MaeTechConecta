# Script para fazer commit das mudanças de remoção de secrets
# Uso: .\scripts\commit-remove-secrets.ps1

Write-Host "🔐 Fazendo commit da remoção de secrets dos arquivos de documentação..." -ForegroundColor Cyan
Write-Host ""

# Adicionar mudanças
Write-Host "📦 Adicionando mudanças..." -ForegroundColor Cyan
git add .

# Fazer commit
Write-Host "💾 Fazendo commit..." -ForegroundColor Cyan
git commit -m "security: remover chaves de API dos arquivos de documentação

- Substituir chaves reais por placeholders seguros
- Adicionar instruções de como obter as chaves
- Corrigir erro de secrets scanning no Netlify
- Remover chave Gemini API de arquivos .md
- Remover token JWT do Supabase de arquivos .md
- Adicionar links e instruções de como obter as chaves"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit realizado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Fazendo push para main..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Secrets removidos e mudanças enviadas para o GitHub!" -ForegroundColor Green
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


