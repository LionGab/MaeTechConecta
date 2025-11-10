#!/usr/bin/env node

/**
 * Git Keep Ours Auto - Mantém Nossas Mudanças Automaticamente
 *
 * Resolve conflitos de merge mantendo nossas mudanças
 * Sem pedir confirmação
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('✅ Git Keep Ours Auto - Mantendo Nossas Mudanças (SKIP PERMISSIONS)\n');

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
 * Manter nossas mudanças automaticamente
 */
function keepOurs() {
  if (!isGitRepo()) {
    console.error('❌ Erro: Não é um repositório Git!\n');
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log('🔄 Mantendo nossas mudanças (ours)...');
  console.log('='.repeat(60));

  try {
    // Manter nossas mudanças
    execSync('git checkout --ours .', { stdio: 'inherit' });
    console.log('✅ Mudanças nossas mantidas!\n');

    // Adicionar ao stage
    console.log('📝 Adicionando ao stage...\n');
    execSync('git add -A', { stdio: 'inherit' });
    console.log('✅ Mudanças adicionadas ao stage!\n');

    // Mostrar status
    console.log('='.repeat(60));
    console.log('📋 Status após keep ours:');
    console.log('='.repeat(60));
    execSync('git status', { stdio: 'inherit' });

    return { success: true };
  } catch (error) {
    console.error(`❌ Erro ao manter mudanças: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

// Executar
console.log('🚀 GIT KEEP OURS AUTO');
console.log('='.repeat(60));

const result = keepOurs();

if (result.success) {
  console.log('\n✅ Git Keep Ours Auto concluído!');
  console.log('💡 Próximo passo: git commit\n');
  process.exit(0);
} else {
  console.error('❌ Git Keep Ours Auto falhou!\n');
  process.exit(1);
}

