/**
 * Coverage Gate Check
 * Verifica se a cobertura de testes atinge o threshold mínimo
 */

const fs = require('fs');
const path = require('path');

const threshold = parseInt(process.argv[2] || '70', 10);
const summaryPath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');

if (!fs.existsSync(summaryPath)) {
  console.error('❌ coverage-summary.json não encontrado.');
  console.error('Execute: npm run test:coverage');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const pct = summary.total?.lines?.pct || 0;

if (pct < threshold) {
  console.error(`❌ Cobertura ${pct}% < ${threshold}% (threshold mínimo)`);
  console.error('Adicione mais testes para atingir o threshold.');
  process.exit(1);
}

console.log(`✅ Cobertura OK: ${pct}% ≥ ${threshold}%`);
process.exit(0);
