# Script de Migração para Monorepo
# Executa migração física dos arquivos

Write-Host "🚀 Iniciando migração para monorepo..." -ForegroundColor Cyan

# Verificar se já foi migrado
if (Test-Path "apps/mobile/src") {
    Write-Host "⚠️  Parece que a migração já foi feita (apps/mobile/src existe)" -ForegroundColor Yellow
    $continue = Read-Host "Continuar mesmo assim? (s/N)"
    if ($continue -ne "s") {
        Write-Host "❌ Migração cancelada" -ForegroundColor Red
        exit 1
    }
}

# 1. Migrar src/ para apps/mobile/src/
if (Test-Path "src" -and !(Test-Path "apps/mobile/src")) {
    Write-Host "📦 Migrando src/ para apps/mobile/src/..." -ForegroundColor Cyan
    Copy-Item -Path "src" -Destination "apps/mobile/src" -Recurse -Force
    Write-Host "✅ src/ migrado" -ForegroundColor Green
} else {
    Write-Host "⏭️  src/ já migrado ou não existe" -ForegroundColor Yellow
}

# 2. Migrar App.tsx para apps/mobile/App.tsx
if (Test-Path "App.tsx" -and !(Test-Path "apps/mobile/App.tsx")) {
    Write-Host "📦 Migrando App.tsx para apps/mobile/App.tsx..." -ForegroundColor Cyan
    Copy-Item -Path "App.tsx" -Destination "apps/mobile/App.tsx" -Force
    Write-Host "✅ App.tsx migrado" -ForegroundColor Green
} else {
    Write-Host "⏭️  App.tsx já migrado ou não existe" -ForegroundColor Yellow
}

# 3. Migrar assets/ para apps/mobile/assets/
if (Test-Path "assets" -and !(Test-Path "apps/mobile/assets")) {
    Write-Host "📦 Migrando assets/ para apps/mobile/assets/..." -ForegroundColor Cyan
    Copy-Item -Path "assets" -Destination "apps/mobile/assets" -Recurse -Force
    Write-Host "✅ assets/ migrado" -ForegroundColor Green
} else {
    Write-Host "⏭️  assets/ já migrado ou não existe" -ForegroundColor Yellow
}

# 4. Migrar babel.config.js para apps/mobile/babel.config.js
if (Test-Path "babel.config.js" -and !(Test-Path "apps/mobile/babel.config.js")) {
    Write-Host "📦 Migrando babel.config.js para apps/mobile/babel.config.js..." -ForegroundColor Cyan
    Copy-Item -Path "babel.config.js" -Destination "apps/mobile/babel.config.js" -Force
    Write-Host "✅ babel.config.js migrado" -ForegroundColor Green
} else {
    Write-Host "⏭️  babel.config.js já migrado ou não existe" -ForegroundColor Yellow
}

# 5. Migrar supabase/ para infra/supabase/
if (Test-Path "supabase" -and !(Test-Path "infra/supabase/functions")) {
    Write-Host "📦 Migrando supabase/ para infra/supabase/..." -ForegroundColor Cyan
    
    # Criar estrutura
    if (!(Test-Path "infra/supabase")) {
        New-Item -ItemType Directory -Path "infra/supabase" -Force | Out-Null
    }
    
    # Migrar functions
    if (Test-Path "supabase/functions") {
        Copy-Item -Path "supabase/functions" -Destination "infra/supabase/functions" -Recurse -Force
        Write-Host "✅ supabase/functions/ migrado" -ForegroundColor Green
    }
    
    # Migrar migrations
    if (Test-Path "supabase/migrations") {
        Copy-Item -Path "supabase/migrations" -Destination "infra/supabase/migrations" -Recurse -Force
        Write-Host "✅ supabase/migrations/ migrado" -ForegroundColor Green
    }
    
    # Migrar schema SQLs
    if (Test-Path "supabase/*.sql") {
        if (!(Test-Path "infra/supabase/schema")) {
            New-Item -ItemType Directory -Path "infra/supabase/schema" -Force | Out-Null
        }
        Copy-Item -Path "supabase/*.sql" -Destination "infra/supabase/schema" -Force
        Write-Host "✅ supabase/*.sql migrado" -ForegroundColor Green
    }
} else {
    Write-Host "⏭️  supabase/ já migrado ou não existe" -ForegroundColor Yellow
}

Write-Host "`n✅ Migração concluída!" -ForegroundColor Green
Write-Host "`n📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Verificar se todos os arquivos foram migrados corretamente"
Write-Host "2. Atualizar imports para usar @shared/*"
Write-Host "3. Executar: pnpm install"
Write-Host "4. Testar: pnpm build"
Write-Host "5. Testar: pnpm test"

