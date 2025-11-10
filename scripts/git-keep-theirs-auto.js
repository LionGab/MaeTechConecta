#!/usr/bin/env node

/**
 * Git Keep Theirs Auto - Mantém Mudanças Deles Automaticamente
 *
 * Resolve conflitos de merge mantendo mudanças deles
 * Sem pedir confirmação
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('✅ Git Keep Theirs Auto - Mantendo Mudanças Deles (SKIP PERMISSIONS)\n');

/**
 * Verificar se é repositório Git
 */
function isGitRepo() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Manter mudanças deles automaticamente
 */
function keepTheirs() {
  if (!isGitRepo()) {
    console.error('❌ Erro: Não é um repositório Git!\n');
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log('🔄 Mantendo mudanças deles (theirs)...');
  console.log('='.repeat(60));

  try {
    // Manter mudanças deles
    execSync('git checkout --theirs .', { stdio: 'inherit' });
    console.log('✅ Mudanças deles mantidas!\n');

    // Adicionar ao stage
    console.log('📝 Adicionando ao stage...\n');
    execSync('git add -A', { stdio: 'inherit' });
    console.log('✅ Mudanças adicionadas ao stage!\n');

    // Mostrar status
    console.log('='.repeat(60));
    console.log('📋 Status após keep theirs:');
    console.log('='.repeat(60));
    execSync('git status', { stdio: 'inherit' });

    return { success: true };
  } catch (error) {
    console.error(`❌ Erro ao manter mudanças: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

// Executar
console.log('🚀 GIT KEEP THEIRS AUTO');
console.log('='.repeat(60));

const result = keepTheirs();

if (result.success) {
  console.log('\n✅ Git Keep Theirs Auto concluído!');
  console.log('💡 Próximo passo: git commit\n');
  process.exit(0);
} else {
  console.error('❌ Git Keep Theirs Auto falhou!\n');
  process.exit(1);
}

