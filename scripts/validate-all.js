/**
 * Script de Validação Completa
 * Executa todas as validações: TypeScript, Lint, Testes, Coverage
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDAÇÃO COMPLETA - Nossa Maternidade\n');
console.log('='.repeat(60));

let errors = 0;
let warnings = 0;

function runCommand(command, description) {
  console.log(`\n📋 ${description}`);
  console.log(`   Executando: ${command}\n`);

  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    console.log(`✅ ${description} - PASSOU\n`);
    return { success: true, output };
  } catch (error) {
    console.error(`❌ ${description} - FALHOU\n`);
    console.error(`   Erro: ${error.message}\n`);
    errors++;
    return { success: false, error: error.message };
  }
}

// 1. Validação TypeScript
console.log('\n' + '='.repeat(60));
console.log('1️⃣  VALIDAÇÃO TYPESCRIPT');
console.log('='.repeat(60));

const tsResult = runCommand('npm run typecheck', 'TypeScript Type Check');

if (!tsResult.success) {
  console.log('⚠️  Verificando tsconfig.json...\n');

  try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));

    if (!tsconfig.compilerOptions?.paths) {
      console.log('❌ tsconfig.json não tem paths configurados');
      console.log('   Adicionando paths básicos...\n');

      tsconfig.compilerOptions = tsconfig.compilerOptions || {};
      tsconfig.compilerOptions.baseUrl = '.';
      tsconfig.compilerOptions.paths = {
        '@/*': ['./src/*'],
        '@components/*': ['./src/components/*'],
        '@services/*': ['./src/services/*'],
        '@hooks/*': ['./src/hooks/*'],
        '@utils/*': ['./src/utils/*'],
        '@theme/*': ['./src/theme/*'],
      };

      fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
      console.log('✅ tsconfig.json atualizado com paths\n');
    } else {
      console.log('✅ tsconfig.json tem paths configurados');
      console.log('   Paths:', JSON.stringify(tsconfig.compilerOptions.paths, null, 2));
    }
  } catch (err) {
    console.error('❌ Erro ao ler tsconfig.json:', err.message);
  }
}

// 2. Validação Lint
console.log('\n' + '='.repeat(60));
console.log('2️⃣  VALIDAÇÃO ESLINT');
console.log('='.repeat(60));

const lintResult = runCommand('npm run lint', 'ESLint Check');

if (!lintResult.success) {
  console.log('⚠️  Tentando fix automático...\n');
  runCommand('npm run lint:fix', 'ESLint Fix Automático');
}

// 3. Validação de Testes
console.log('\n' + '='.repeat(60));
console.log('3️⃣  VALIDAÇÃO DE TESTES');
console.log('='.repeat(60));

const testResult = runCommand('npm test', 'Testes Unitários');

// 4. Validação de Coverage
console.log('\n' + '='.repeat(60));
console.log('4️⃣  VALIDAÇÃO DE COVERAGE');
console.log('='.repeat(60));

const coverageResult = runCommand('npm run test:coverage', 'Coverage Report');

if (coverageResult.success) {
  console.log('📊 Verificando threshold de 70%...\n');
  const coverageCheck = runCommand('npm run test:coverage:check', 'Coverage Threshold Check');

  if (!coverageCheck.success) {
    console.log('⚠️  Coverage abaixo de 70%');
    console.log('   Isso é normal na primeira validação. Continue implementando testes.');
  }
}

// 5. Resumo Final
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMO DA VALIDAÇÃO');
console.log('='.repeat(60));

console.log(`\n✅ Validações passadas: ${4 - errors}`);
console.log(`❌ Validações falhadas: ${errors}\n`);

if (errors === 0) {
  console.log('🎉 VALIDAÇÃO COMPLETA - TUDO OK!\n');
  console.log('✅ TypeScript configurado corretamente');
  console.log('✅ Lint configurado corretamente');
  console.log('✅ Testes executando');
  console.log('✅ Coverage calculado\n');

  console.log('🚀 Próximos passos:');
  console.log('   1. Configurar secrets (GitHub/Expo/Supabase)');
  console.log('   2. Migrar código legado (se necessário)');
  console.log('   3. Implementar mais testes para aumentar coverage\n');

  process.exit(0);
} else {
  console.log('⚠️  VALIDAÇÃO COM ERROS\n');
  console.log('📝 Ações recomendadas:');

  if (!tsResult.success) {
    console.log('   - Corrigir erros de TypeScript');
    console.log('   - Verificar imports e paths');
  }

  if (!lintResult.success) {
    console.log('   - Corrigir erros de lint');
    console.log('   - Executar: npm run lint:fix');
  }

  if (!testResult.success) {
    console.log('   - Corrigir testes que falharam');
    console.log('   - Verificar mocks e configurações');
  }

  console.log('\n');
  process.exit(1);
}

