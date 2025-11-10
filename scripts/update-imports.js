#!/usr/bin/env node
/**
 * Script para atualizar imports relativos para path aliases (@/*)
 * Uso: node scripts/update-imports.js
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

console.log('🔄 Atualizando imports relativos para path aliases...');
console.log(`   Diretório: ${rootDir}`);

// Padrões de substituição
const replacements = [
  // Padrões com ../../ (dois níveis) - processar primeiro
  { pattern: /from ['"]\.\.\/\.\.\/components\//g, replacement: "from '@/components/" },
  { pattern: /from ['"]\.\.\/\.\.\/services\//g, replacement: "from '@/services/" },
  { pattern: /from ['"]\.\.\/\.\.\/hooks\//g, replacement: "from '@/hooks/" },
  { pattern: /from ['"]\.\.\/\.\.\/utils\//g, replacement: "from '@/utils/" },
  { pattern: /from ['"]\.\.\/\.\.\/theme\//g, replacement: "from '@/theme/" },
  { pattern: /from ['"]\.\.\/\.\.\/config\//g, replacement: "from '@/config/" },
  { pattern: /from ['"]\.\.\/\.\.\/lib\//g, replacement: "from '@/lib/" },
  { pattern: /from ['"]\.\.\/\.\.\/shared\//g, replacement: "from '@/shared/" },
  { pattern: /from ['"]\.\.\/\.\.\/screens\//g, replacement: "from '@/screens/" },
  { pattern: /from ['"]\.\.\/\.\.\/features\//g, replacement: "from '@/features/" },
  { pattern: /from ['"]\.\.\/\.\.\/navigation\//g, replacement: "from '@/navigation/" },
  { pattern: /from ['"]\.\.\/\.\.\/constants\//g, replacement: "from '@/constants/" },
  { pattern: /from ['"]\.\.\/\.\.\/contexts\//g, replacement: "from '@/contexts/" },

  // Padrões com ../ (um nível)
  { pattern: /from ['"]\.\.\/components\//g, replacement: "from '@/components/" },
  { pattern: /from ['"]\.\.\/services\//g, replacement: "from '@/services/" },
  { pattern: /from ['"]\.\.\/hooks\//g, replacement: "from '@/hooks/" },
  { pattern: /from ['"]\.\.\/utils\//g, replacement: "from '@/utils/" },
  { pattern: /from ['"]\.\.\/theme\//g, replacement: "from '@/theme/" },
  { pattern: /from ['"]\.\.\/config\//g, replacement: "from '@/config/" },
  { pattern: /from ['"]\.\.\/lib\//g, replacement: "from '@/lib/" },
  { pattern: /from ['"]\.\.\/shared\//g, replacement: "from '@/shared/" },
  { pattern: /from ['"]\.\.\/screens\//g, replacement: "from '@/screens/" },
  { pattern: /from ['"]\.\.\/features\//g, replacement: "from '@/features/" },
  { pattern: /from ['"]\.\.\/navigation\//g, replacement: "from '@/navigation/" },
  { pattern: /from ['"]\.\.\/constants\//g, replacement: "from '@/constants/" },
  { pattern: /from ['"]\.\.\/contexts\//g, replacement: "from '@/contexts/" },

  // Padrões especiais (index.ts, etc)
  { pattern: /from ['"]\.\.\/components['"]/g, replacement: "from '@/components'" },
  { pattern: /from ['"]\.\.\/\.\.\/components['"]/g, replacement: "from '@/components'" },
];

async function updateImports() {
  try {
    // Buscar todos os arquivos .ts e .tsx em src
    const files = await glob('src/**/*.{ts,tsx}', {
      cwd: rootDir,
      ignore: ['**/node_modules/**'],
      absolute: true,
    });

    let totalFiles = 0;
    let totalReplacements = 0;

    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        let fileReplacements = 0;

        // Aplicar todas as substituições
        for (const { pattern, replacement } of replacements) {
          const matches = content.match(pattern);
          if (matches) {
            newContent = newContent.replace(pattern, replacement);
            fileReplacements += matches.length;
          }
        }

        // Salvar apenas se houver mudanças
        if (newContent !== content) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          const relativePath = path.relative(rootDir, filePath);
          console.log(`  ✓ ${relativePath}: ${fileReplacements} substituições`);
          totalFiles++;
          totalReplacements += fileReplacements;
        }
      } catch (error) {
        console.error(`  ✗ Erro ao processar ${filePath}:`, error.message);
      }
    }

    console.log('\n✅ Concluído!');
    console.log(`   Arquivos atualizados: ${totalFiles}`);
    console.log(`   Total de substituições: ${totalReplacements}`);
    console.log("\n⚠️  Execute 'npm run typecheck' para validar os imports");
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

updateImports();

