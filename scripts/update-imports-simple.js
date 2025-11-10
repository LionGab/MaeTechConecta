const fs = require('fs');
const path = require('path');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && file !== 'node_modules') {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const srcDir = path.join(__dirname, '..', 'src');
const files = findFiles(srcDir);

const replacements = [
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
  { pattern: /from ['"]\.\.\/components['"]/g, replacement: "from '@/components'" },
  { pattern: /from ['"]\.\.\/\.\.\/components['"]/g, replacement: "from '@/components'" },
];

let totalFiles = 0;
let totalReplacements = 0;

console.log('🔄 Atualizando imports...\n');

files.forEach((filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fileReplacements = 0;

    replacements.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        fileReplacements += matches.length;
      }
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      const relativePath = path.relative(path.join(__dirname, '..'), filePath);
      console.log(`✓ ${relativePath}: ${fileReplacements} substituições`);
      totalFiles++;
      totalReplacements += fileReplacements;
    }
  } catch (error) {
    console.error(`✗ Erro em ${filePath}:`, error.message);
  }
});

console.log(`\n✅ Concluído!`);
console.log(`   Arquivos atualizados: ${totalFiles}`);
console.log(`   Total de substituições: ${totalReplacements}`);
console.log(`\n⚠️  Execute 'npm run typecheck' para validar`);

