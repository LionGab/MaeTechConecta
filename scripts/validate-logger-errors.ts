import { glob } from 'glob';
import fs from 'node:fs/promises';

const LOGGER_PATTERN = /logger\.error\s*\(/;
const SAFE_PATTERN = /(\b\w+)\s*instanceof\s+Error\s*\?\s*\1\.message\s*:\s*String\(\1\)/;

async function main() {
  const files = await glob(['src/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'], {
    ignore: ['**/node_modules/**', '**/.turbo/**', '**/dist/**'],
    nodir: true,
  });

  const offenders: string[] = [];

  await Promise.all(
    files.map(async (file) => {
      const code = await fs.readFile(file, 'utf8');
      if (LOGGER_PATTERN.test(code) && !SAFE_PATTERN.test(code)) {
        offenders.push(file);
      }
    })
  );

  if (offenders.length) {
    console.error('❌ logger.error não padronizado nos arquivos:\n' + offenders.join('\n'));
    process.exit(1);
  }

  console.log('✅ logger.error padronizado.');
}

main().catch((error) => {
  console.error('❌ Falha ao validar logger.error:', error);
  process.exit(1);
});
