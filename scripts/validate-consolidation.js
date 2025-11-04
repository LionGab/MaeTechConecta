/**
 * Script de Validação Pós-Consolidação
 * Verifica se toda a estrutura foi criada corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validando Consolidação - Nossa Maternidade\n');

let errors = 0;
let warnings = 0;

function checkFile(filePath, description) {
  const fullPath = path.resolve(filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.error(`❌ ${description}: ${filePath} NÃO ENCONTRADO`);
    errors++;
    return false;
  }
}

function checkDir(dirPath, description) {
  const fullPath = path.resolve(dirPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    const files = fs.readdirSync(fullPath);
    console.log(`✅ ${description}: ${dirPath} (${files.length} arquivos)`);
    return true;
  } else {
    console.error(`❌ ${description}: ${dirPath} NÃO ENCONTRADO`);
    errors++;
    return false;
  }
}

// 1. Verificar Estrutura Base
console.log('\n📁 1. ESTRUTURA BASE\n');

checkDir('.github/workflows', 'GitHub Workflows');
checkDir('src/lib/nat-ai', 'NAT-AI Engine');
checkDir('supabase/functions', 'Edge Functions');
checkDir('__tests__', 'Testes Unitários');
checkDir('e2e', 'Testes E2E');
checkDir('docs', 'Documentação');
checkDir('scripts', 'Scripts');

// 2. Verificar Workflows CI/CD
console.log('\n🔄 2. CI/CD WORKFLOWS\n');

checkFile('.github/workflows/ci.yml', 'CI Workflow');
checkFile('.github/workflows/build.yml', 'Build Workflow');
checkFile('.github/workflows/deploy.yml', 'Deploy Workflow');

// 3. Verificar Edge Functions
console.log('\n⚡ 3. EDGE FUNCTIONS\n');

const edgeFunctions = [
  'nathia-chat',
  'moderation-service',
  'risk-classifier',
  'behavior-analysis',
  'lgpd-requests',
  'transcribe-audio',
  'nat-ai-chat',
];

edgeFunctions.forEach((func) => {
  checkFile(`supabase/functions/${func}/index.ts`, `Edge Function: ${func}`);
});

// 4. Verificar NAT-AI Engine
console.log('\n🤖 4. NAT-AI ENGINE\n');

const natAIFiles = ['system-prompt.ts', 'guardrails.ts', 'risk-analyzer.ts', 'context-manager.ts', 'team-notifier.ts'];

natAIFiles.forEach((file) => {
  checkFile(`src/lib/nat-ai/${file}`, `NAT-AI: ${file}`);
});

// 5. Verificar Testes
console.log('\n🧪 5. TESTES\n');

checkFile('__tests__/services/supabase.test.ts', 'Teste Supabase');
checkFile('__tests__/services/ai.test.ts', 'Teste AI');
checkFile('__tests__/lib/nat-ai/guardrails.test.ts', 'Teste Guardrails');
checkFile('e2e/maestro/smoke-flow.yaml', 'E2E Maestro');
checkFile('e2e/detox/.detoxrc.js', 'E2E Detox Config');

// 6. Verificar Documentação
console.log('\n📚 6. DOCUMENTAÇÃO\n');

checkFile('docs/DOCUMENTATION.md', 'DOCUMENTATION.md');
checkFile('docs/ARCHITECTURE.md', 'ARCHITECTURE.md');
checkFile('docs/DEPLOY_PRODUCTION.md', 'DEPLOY_PRODUCTION.md');
checkFile('docs/ENVIRONMENTS.md', 'ENVIRONMENTS.md');

// 7. Verificar Configuração
console.log('\n⚙️ 7. CONFIGURAÇÃO\n');

checkFile('package.json', 'package.json');
checkFile('tsconfig.json', 'tsconfig.json');
checkFile('vitest.config.ts', 'vitest.config.ts');
checkFile('app.json', 'app.json');
checkFile('eas.json', 'eas.json');
checkFile('.env.example', '.env.example');

// 8. Verificar Scripts
console.log('\n🔧 8. SCRIPTS\n');

checkFile('scripts/check-coverage.js', 'Check Coverage Script');
checkFile('scripts/validate-local.js', 'Validate Local Script');

// 9. Verificar package.json Scripts
console.log('\n📦 9. PACKAGE.JSON SCRIPTS\n');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['test', 'test:coverage', 'validate', 'lint', 'typecheck'];

  requiredScripts.forEach((script) => {
    if (packageJson.scripts[script]) {
      console.log(`✅ Script "${script}": ${packageJson.scripts[script]}`);
    } else {
      console.error(`❌ Script "${script}" NÃO ENCONTRADO`);
      errors++;
    }
  });
} catch (error) {
  console.error(`❌ Erro ao ler package.json: ${error.message}`);
  errors++;
}

// 10. Resumo Final
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMO DA VALIDAÇÃO\n');

if (errors === 0) {
  console.log('✅ VALIDAÇÃO CONCLUÍDA COM SUCESSO!');
  console.log('✅ Todos os arquivos e pastas foram criados corretamente.');
  console.log('\n🚀 Próximos passos:');
  console.log('   1. Executar: npm install');
  console.log('   2. Executar: npm run validate');
  console.log('   3. Configurar secrets (GitHub/Expo/Supabase)');
  process.exit(0);
} else {
  console.error(`❌ VALIDAÇÃO FALHOU!`);
  console.error(`❌ ${errors} erro(s) encontrado(s).`);
  console.error('\n⚠️  Corrija os erros acima antes de prosseguir.');
  process.exit(1);
}
