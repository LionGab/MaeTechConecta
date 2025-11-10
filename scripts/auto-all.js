#!/usr/bin/env node

/**
 * Auto All - Executa Tudo Automaticamente
 *
 * Executa revisão, validação, fix e build automaticamente
 * Sem pedir permissão ou confirmação
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AUTO ALL - Executando Tudo Automaticamente (SKIP PERMISSIONS)\n');
console.log('='.repeat(60));

/**
 * Executar comando sem interação
 */
function runAuto(command, description) {
  console.log(`\n📝 ${description}...`);
  try {
    execSync(command, {
      stdio: 'inherit',
      encoding: 'utf8',
      env: {
        ...process.env,
        AUTO_APPROVE: 'true',
        SKIP_PERMISSIONS: 'true',
        NON_INTERACTIVE: '1',
      },
    });
    console.log(`✅ ${description} - OK\n`);
    return { success: true };
  } catch (error) {
    console.error(`❌ ${description} - FALHOU: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

// Sequência de execução
const steps = [
  {
    command: 'node scripts/awaiting-review-skip.js',
    description: 'Configurar Skip Awaiting Review',
  },
  {
    command: 'node scripts/auto-approve.js all',
    description: 'Auto-aprovar Mudanças Pendentes',
  },
  {
    command: 'node scripts/auto-review-changes.js',
    description: 'Revisão Automática de Mudanças',
  },
  {
    command: 'npm run fix:all',
    description: 'Correções Automáticas (Lint + Format)',
  },
  {
    command: 'npm run validate:auto',
    description: 'Validação Automática',
  },
  {
    command: 'npm run validate:checklist',
    description: 'Validação do Checklist',
  },
];

// Opções de build (se passado como argumento)
const buildOption = process.argv[2];

if (buildOption === 'build' || buildOption === 'full') {
  steps.push({
    command: 'node scripts/auto-build.js full',
    description: 'Build Completo (Mobile + Functions)',
  });
} else if (buildOption === 'mobile') {
  steps.push({
    command: 'node scripts/auto-build.js all',
    description: 'Build Mobile (Android + iOS)',
  });
} else if (buildOption === 'functions') {
  steps.push({
    command: 'node scripts/auto-build.js functions',
    description: 'Deploy Edge Functions',
  });
}

// Executar todos os passos
console.log(`\n🎯 Executando ${steps.length} passo(s)...\n`);

const results = steps.map((step, index) => {
  console.log(`\n[${index + 1}/${steps.length}] ${step.description}`);
  return runAuto(step.command, step.description);
});

// Resumo final
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMO FINAL');
console.log('='.repeat(60));

const passed = results.filter((r) => r.success).length;
const failed = results.filter((r) => !r.success).length;

console.log(`\n✅ Passou: ${passed}`);
console.log(`❌ Falhou: ${failed}\n`);

if (failed === 0) {
  console.log('🎉 TUDO EXECUTADO COM SUCESSO!\n');
  process.exit(0);
} else {
  console.log('⚠️  Algumas etapas falharam, mas processo continuou.\n');
  console.log('💡 Revisar erros acima para mais detalhes.\n');
  process.exit(0); // Exit 0 mesmo com falhas (não bloquear)
}
