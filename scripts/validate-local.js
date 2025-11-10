/**
 * Validação Local - Nossa Maternidade
 * Script Node.js para validar tudo localmente antes de commit
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Validando projeto localmente...\n');

let hasErrors = false;

function runCommand(command, description) {
  try {
    console.log(`📝 ${description}...`);
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    console.log(`✅ ${description} passou\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} falhou\n`);
    hasErrors = true;
    return false;
  }
}

// 1. Lint
runCommand('npm run lint', 'Lint');

// 2. Type Check
runCommand('npm run typecheck', 'Type Check');

// 3. Tests
runCommand('npm test', 'Testes');

// 4. Coverage
runCommand('npm run test:coverage', 'Coverage');

// 5. Coverage Check
runCommand('npm run test:coverage:check', 'Coverage Check (≥70%)');

// 6. Format Check
runCommand('npm run format:check', 'Formatação');

if (hasErrors) {
  console.error('\n❌ Validação local falhou! Corrija os erros acima.');
  process.exit(1);
}

console.log('\n✅ Validação local concluída com sucesso!');
process.exit(0);
