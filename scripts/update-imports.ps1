# Script para atualizar imports relativos para path aliases (@/*)
# Uso: .\scripts\update-imports.ps1

$ErrorActionPreference = "Stop"

# Garantir que estamos no diretório raiz
$scriptDir = $PSScriptRoot
$rootDir = Split-Path $scriptDir -Parent
Set-Location $rootDir

Write-Host "🔄 Atualizando imports relativos para path aliases..." -ForegroundColor Cyan
Write-Host "   Diretório: $rootDir" -ForegroundColor Gray

$files = Get-ChildItem -Path "src" -Include *.ts,*.tsx -Recurse | Where-Object { 
    $_.FullName -notmatch "node_modules" 
}

$totalFiles = 0
$totalReplacements = 0

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        $originalContent = $content
        $fileReplacements = 0

        # Padrões de substituição - processar do mais específico para o mais genérico
        $replacements = @(
            # Padrões com ../../ (dois níveis) - processar primeiro
            @{Old = "from '\.\.\/\.\.\/components\/"; New = "from '@/components/"},
            @{Old = "from '\.\.\/\.\.\/services\/"; New = "from '@/services/'},
            @{Old = "from '\.\.\/\.\.\/hooks\/"; New = "from '@/hooks/"},
            @{Old = "from '\.\.\/\.\.\/utils\/"; New = "from '@/utils/'},
            @{Old = "from '\.\.\/\.\.\/theme\/"; New = "from '@/theme/"},
            @{Old = "from '\.\.\/\.\.\/config\/"; New = "from '@/config/'},
            @{Old = "from '\.\.\/\.\.\/lib\/"; New = "from '@/lib/'},
            @{Old = "from '\.\.\/\.\.\/shared\/"; New = "from '@/shared/"},
            @{Old = "from '\.\.\/\.\.\/screens\/"; New = "from '@/screens/'},
            @{Old = "from '\.\.\/\.\.\/features\/"; New = "from '@/features/'},
            @{Old = "from '\.\.\/\.\.\/navigation\/"; New = "from '@/navigation/"},
            @{Old = "from '\.\.\/\.\.\/constants\/"; New = "from '@/constants/"},
            @{Old = "from '\.\.\/\.\.\/contexts\/"; New = "from '@/contexts/'},
            
            # Padrões com ../ (um nível)
            @{Old = "from '\.\.\/components\/"; New = "from '@/components/"},
            @{Old = "from '\.\.\/services\/"; New = "from '@/services/'},
            @{Old = "from '\.\.\/hooks\/"; New = "from '@/hooks/"},
            @{Old = "from '\.\.\/utils\/"; New = "from '@/utils/'},
            @{Old = "from '\.\.\/theme\/"; New = "from '@/theme/"},
            @{Old = "from '\.\.\/config\/"; New = "from '@/config/'},
            @{Old = "from '\.\.\/lib\/"; New = "from '@/lib/'},
            @{Old = "from '\.\.\/shared\/"; New = "from '@/shared/"},
            @{Old = "from '\.\.\/screens\/"; New = "from '@/screens/'},
            @{Old = "from '\.\.\/features\/"; New = "from '@/features/'},
            @{Old = "from '\.\.\/navigation\/"; New = "from '@/navigation/'},
            @{Old = "from '\.\.\/constants\/"; New = "from '@/constants/'},
            @{Old = "from '\.\.\/contexts\/"; New = "from '@/contexts/'},
            
            # Padrões com aspas duplas
            @{Old = 'from "\.\.\/\.\.\/components\/'; New = 'from "@/components/'},
            @{Old = 'from "\.\.\/\.\.\/services\/'; New = 'from "@/services/'},
            @{Old = 'from "\.\.\/\.\.\/hooks\/'; New = 'from "@/hooks/'},
            @{Old = 'from "\.\.\/\.\.\/utils\/'; New = 'from "@/utils/'},
            @{Old = 'from "\.\.\/\.\.\/theme\/'; New = 'from "@/theme/'},
            @{Old = 'from "\.\.\/\.\.\/config\/'; New = 'from "@/config/'},
            @{Old = 'from "\.\.\/\.\.\/lib\/'; New = 'from "@/lib/'},
            @{Old = 'from "\.\.\/\.\.\/shared\/'; New = 'from "@/shared/'},
            @{Old = 'from "\.\.\/\.\.\/screens\/'; New = 'from "@/screens/'},
            @{Old = 'from "\.\.\/\.\.\/features\/'; New = 'from "@/features/'},
            @{Old = 'from "\.\.\/\.\.\/navigation\/'; New = 'from "@/navigation/'},
            @{Old = 'from "\.\.\/\.\.\/constants\/'; New = 'from "@/constants/'},
            @{Old = 'from "\.\.\/\.\.\/contexts\/'; New = 'from "@/contexts/'},
            
            @{Old = 'from "\.\.\/components\/'; New = 'from "@/components/'},
            @{Old = 'from "\.\.\/services\/'; New = 'from "@/services/'},
            @{Old = 'from "\.\.\/hooks\/'; New = 'from "@/hooks/'},
            @{Old = 'from "\.\.\/utils\/'; New = 'from "@/utils/'},
            @{Old = 'from "\.\.\/theme\/'; New = 'from "@/theme/'},
            @{Old = 'from "\.\.\/config\/'; New = 'from "@/config/'},
            @{Old = 'from "\.\.\/lib\/'; New = 'from "@/lib/'},
            @{Old = 'from "\.\.\/shared\/'; New = 'from "@/shared/'},
            @{Old = 'from "\.\.\/screens\/'; New = 'from "@/screens/'},
            @{Old = 'from "\.\.\/features\/'; New = 'from "@/features/'},
            @{Old = 'from "\.\.\/navigation\/'; New = 'from "@/navigation/'},
            @{Old = 'from "\.\.\/constants\/'; New = 'from "@/constants/'},
            @{Old = 'from "\.\.\/contexts\/'; New = 'from "@/contexts/'},
            
            # Padrões especiais (index.ts, etc)
            @{Old = "from '\.\.\/components'"; New = "from '@/components'"},
            @{Old = "from '\.\.\/\.\.\/components'"; New = "from '@/components'"},
            @{Old = 'from "\.\.\/components"'; New = 'from "@/components"'},
            @{Old = 'from "\.\.\/\.\.\/components"'; New = 'from "@/components"'}
        )

        foreach ($repl in $replacements) {
            $beforeCount = ([regex]::Matches($content, $repl.Old)).Count
            if ($beforeCount -gt 0) {
                $content = $content -replace $repl.Old, $repl.New
                $fileReplacements += $beforeCount
            }
        }

        if ($content -ne $originalContent) {
            [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
            $totalFiles++
            $totalReplacements += $fileReplacements
            Write-Host "  ✓ $($file.Name): $fileReplacements substituições" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "  ✗ Erro ao processar $($file.Name): $_" -ForegroundColor Red
    }
}

Write-Host "`n✅ Concluído!" -ForegroundColor Green
Write-Host "   Arquivos atualizados: $totalFiles" -ForegroundColor Cyan
Write-Host "   Total de substituições: $totalReplacements" -ForegroundColor Cyan
Write-Host "`n⚠️  Execute 'npm run typecheck' para validar os imports" -ForegroundColor Yellow
