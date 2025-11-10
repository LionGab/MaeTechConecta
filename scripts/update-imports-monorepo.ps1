# Script para atualizar imports para usar @shared/*
# Após migração física dos arquivos

Write-Host "🔄 Atualizando imports para monorepo..." -ForegroundColor Cyan

# Lista de arquivos para atualizar
$files = Get-ChildItem -Path "apps/mobile/src" -Recurse -Include "*.ts", "*.tsx" | Where-Object {
    $content = Get-Content $_.FullName -Raw
    $content -match "@/lib|@/theme|@/utils|@/shared"
}

if ($files.Count -eq 0) {
    Write-Host "✅ Nenhum arquivo precisa ser atualizado" -ForegroundColor Green
    exit 0
}

Write-Host "📝 Encontrados $($files.Count) arquivos para atualizar" -ForegroundColor Cyan

foreach ($file in $files) {
    Write-Host "  - Atualizando: $($file.FullName)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw
    
    # Substituir imports
    $content = $content -replace "@/lib/nat-ai", "@shared/nat-ai"
    $content = $content -replace "@/theme", "@shared/theme"
    $content = $content -replace "@/utils", "@shared/utils"
    $content = $content -replace "@/shared", "@shared"
    
    # Salvar
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "`n✅ Imports atualizados!" -ForegroundColor Green
Write-Host "`n📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Verificar se não há erros: pnpm typecheck"
Write-Host "2. Testar: pnpm build"
Write-Host "3. Testar: pnpm test"


