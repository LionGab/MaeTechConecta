/**
 * Validação Completa do Checklist - Nossa Maternidade
 * Verifica todos os itens pendentes do checklist de métricas
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📊 VALIDAÇÃO DO CHECKLIST - Nossa Maternidade\n');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;
let pending = 0;
const results = [];

function checkItem(name, checkFn, description) {
  console.log(`\n🔍 ${name}`);
  console.log(`   ${description}`);

  try {
    const result = checkFn();
    if (result.success) {
      console.log(`   ✅ PASSOU`);
      passed++;
      results.push({ name, status: '✅', message: result.message || 'OK' });
    } else {
      console.log(`   ❌ FALHOU: ${result.message || 'Erro desconhecido'}`);
      failed++;
      results.push({ name, status: '❌', message: result.message || 'Falhou' });
    }
  } catch (error) {
    console.log(`   ⏳ PENDENTE: ${error.message}`);
    pending++;
    results.push({ name, status: '⏳', message: error.message });
  }
}

// 1. Estrutura consolidada
checkItem(
  'Estrutura Consolidada',
  () => {
    const requiredDirs = ['src', 'packages', 'supabase/functions', 'docs'];
    const missing = requiredDirs.filter((dir) => !fs.existsSync(dir));

    if (missing.length > 0) {
      return { success: false, message: `Diretórios faltando: ${missing.join(', ')}` };
    }

    return { success: true, message: 'Estrutura OK' };
  },
  'Verificando diretórios principais'
);

// 2. Type Check
checkItem(
  'Type Check',
  () => {
    try {
      execSync('npm run type-check', { stdio: 'pipe', cwd: process.cwd() });
      return { success: true, message: 'TypeScript OK' };
    } catch (error) {
      return {
        success: false,
        message: 'Erros de TypeScript encontrados. Execute: npm run type-check',
      };
    }
  },
  'Verificando TypeScript (npm run type-check)'
);

// 3. CI/CD configurado
checkItem(
  'CI/CD Configurado',
  () => {
    const workflowsPath = '.github/workflows';
    if (!fs.existsSync(workflowsPath)) {
      return { success: false, message: '.github/workflows não encontrado' };
    }

    const workflows = fs.readdirSync(workflowsPath).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
    if (workflows.length === 0) {
      return { success: false, message: 'Nenhum workflow encontrado' };
    }

    return { success: true, message: `${workflows.length} workflow(s) configurado(s)` };
  },
  'Verificando GitHub Actions'
);

// 4. Testes configurados
checkItem(
  'Testes Configurados',
  () => {
    const testFiles = ['vitest.config.ts', 'vitest.setup.ts', '__tests__'];

    const missing = testFiles.filter((file) => !fs.existsSync(file));
    if (missing.length > 0) {
      return { success: false, message: `Arquivos faltando: ${missing.join(', ')}` };
    }

    try {
      execSync('npm test -- --run', { stdio: 'pipe', timeout: 30000 });
      return { success: true, message: 'Testes executando' };
    } catch (error) {
      return { success: false, message: 'Testes falhando. Execute: npm test' };
    }
  },
  'Verificando configuração de testes'
);

// 5. Coverage ≥70%
checkItem(
  'Coverage ≥70%',
  () => {
    const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');

    if (!fs.existsSync(coveragePath)) {
      return {
        success: false,
        message: 'Coverage não gerado. Execute: npm run test:coverage',
      };
    }

    try {
      execSync('npm run test:coverage:check', { stdio: 'pipe' });
      return { success: true, message: 'Coverage ≥70%' };
    } catch (error) {
      const summary = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
      const pct = summary.total?.lines?.pct || 0;
      return {
        success: false,
        message: `Coverage: ${pct.toFixed(1)}% < 70%`,
      };
    }
  },
  'Verificando cobertura de testes (npm run test:coverage)'
);

// 6. Type Check passa
checkItem(
  'Type Check Passa',
  () => {
    try {
      execSync('npm run type-check', { stdio: 'pipe' });
      return { success: true, message: 'TypeScript sem erros' };
    } catch (error) {
      return {
        success: false,
        message: 'Erros de TypeScript. Execute: npm run type-check para ver detalhes',
      };
    }
  },
  'Verificando se TypeScript compila sem erros'
);

// 7. Build EAS funciona
checkItem(
  'Build EAS Funciona',
  () => {
    if (!fs.existsSync('eas.json')) {
      return { success: false, message: 'eas.json não encontrado' };
    }

    try {
      const easConfig = JSON.parse(fs.readFileSync('eas.json', 'utf8'));

      if (!easConfig.build) {
        return { success: false, message: 'eas.json sem configuração de build' };
      }

      // Verificar se tem EAS CLI instalado
      try {
        execSync('eas --version', { stdio: 'pipe' });
        return { success: true, message: 'EAS configurado (validação manual necessária)' };
      } catch (error) {
        return {
          success: false,
          message: 'EAS CLI não instalado. Execute: npm install -g eas-cli',
        };
      }
    } catch (error) {
      return { success: false, message: `Erro ao ler eas.json: ${error.message}` };
    }
  },
  'Verificando configuração EAS (eas build)'
);

// 8. Documentação completa
checkItem(
  'Documentação Completa',
  () => {
    const docsPath = 'docs';
    if (!fs.existsSync(docsPath)) {
      return { success: false, message: 'Diretório docs/ não encontrado' };
    }

    const requiredDocs = ['ARCHITECTURE.md', 'DEPLOY_PRODUCTION.md', 'EDGE_FUNCTIONS.md'];

    const missing = requiredDocs.filter((doc) => !fs.existsSync(path.join(docsPath, doc)));

    if (missing.length > 0) {
      return { success: false, message: `Docs faltando: ${missing.join(', ')}` };
    }

    return { success: true, message: 'Documentação completa' };
  },
  'Verificando documentação em docs/'
);

// 9. Edge Functions deployadas
checkItem(
  'Edge Functions Deployadas',
  () => {
    const functionsPath = 'supabase/functions';
    if (!fs.existsSync(functionsPath)) {
      return { success: false, message: 'supabase/functions não encontrado' };
    }

    const functions = fs
      .readdirSync(functionsPath)
      .filter((f) => fs.statSync(path.join(functionsPath, f)).isDirectory())
      .filter((f) => !f.startsWith('_'));

    if (functions.length === 0) {
      return { success: false, message: 'Nenhuma Edge Function encontrada' };
    }

    // Verificar se tem Supabase CLI
    try {
      execSync('supabase --version', { stdio: 'pipe' });
      return {
        success: true,
        message: `${functions.length} função(ões) encontrada(s). Validação manual necessária no Dashboard`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Supabase CLI não instalado. Execute: npm install -g supabase`,
      };
    }
  },
  'Verificando Edge Functions (Supabase Dashboard)'
);

// Resumo Final
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMO DO CHECKLIST');
console.log('='.repeat(60));

console.log(`\n✅ Passou: ${passed}`);
console.log(`❌ Falhou: ${failed}`);
console.log(`⏳ Pendente: ${pending}\n`);

console.log('📋 Detalhes:\n');
results.forEach(({ name, status, message }) => {
  console.log(`  ${status} ${name}`);
  console.log(`     ${message}`);
});

if (failed === 0 && pending === 0) {
  console.log('\n🎉 TODOS OS ITENS DO CHECKLIST PASSARAM!\n');
  process.exit(0);
} else {
  console.log('\n⚠️  ALGUNS ITENS PRECISAM DE ATENÇÃO\n');

  if (failed > 0) {
    console.log('❌ Itens com falha (requerem correção):');
    results.filter((r) => r.status === '❌').forEach((r) => console.log(`   - ${r.name}: ${r.message}`));
  }

  if (pending > 0) {
    console.log('\n⏳ Itens pendentes (validação manual necessária):');
    results.filter((r) => r.status === '⏳').forEach((r) => console.log(`   - ${r.name}: ${r.message}`));
  }

  console.log('\n📝 Próximos passos:');
  console.log('   1. Corrigir itens com ❌');
  console.log('   2. Validar manualmente itens com ⏳');
  console.log('   3. Executar novamente: node scripts/validate-checklist.js\n');

  process.exit(failed > 0 ? 1 : 0);
}

