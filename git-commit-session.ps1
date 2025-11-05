# Script para fazer commit das alterações desta sessão
# Correções CSS, Debug Tools e Performance

Write-Host "📋 Revisando alterações..." -ForegroundColor Cyan

# Verificar status
git status

Write-Host "`n📝 Adicionando arquivos..." -ForegroundColor Cyan

# Adicionar arquivos criados/modificados
git add share-modal.html share-modal.js
git add debug-visibility.html debug-visibility.js
git add check-css-classes.js
git add monitor-performance.js
git add globals.css maternal-gradient.css
git add tailwind.config.js
git add SOLUCAO-DOM-ERROR.md
git add SOLUCAO-MATERNAL-GRADIENT.md
git add SOLUCAO-SECURITY-ERROR.md
git add PERFORMANCE-ANALYSIS.md
git add COMMIT-MESSAGE.md

Write-Host "`n✅ Arquivos adicionados!" -ForegroundColor Green

# Fazer commit
Write-Host "`n📦 Criando commit..." -ForegroundColor Cyan

$commitMessage = @"
fix: Correções CSS, debug tools e tratamento de erros

- Adiciona DOMContentLoaded em share-modal.js para evitar erro null
- Implementa reset CSS completo e classes Tailwind como fallback
- Cria classe .maternal-gradient com variações (vertical, radial, suave, animado)
- Adiciona tratamento silencioso de SecurityError (CORS) em scripts de debug
- Cria ferramentas de debug: debug-visibility.js, check-css-classes.js, monitor-performance.js
- Adiciona documentação completa de soluções (SOLUCAO-*.md)
- Adiciona análise de performance (PERFORMANCE-ANALYSIS.md)
- Configura Tailwind CSS com variáveis HSL do tema Bubblegum

Resolve problemas de:
- Classes Tailwind não aplicadas (p-8, mb-6, etc.)
- Elementos com padding/margin zerados
- Gradiente maternal não visível
- SecurityError ao acessar Google Fonts (normal, agora tratado)
- Erro "Cannot read properties of null" em addEventListener
"@

git commit -m $commitMessage

Write-Host "`n✅ Commit criado com sucesso!" -ForegroundColor Green
Write-Host "`n💡 Para fazer push: git push" -ForegroundColor Yellow

