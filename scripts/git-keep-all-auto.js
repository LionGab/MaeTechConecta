#!/usr/bin/env node

/**
 * Git Keep All Auto - Adiciona Todas as Mudanças Automaticamente
 *
 * Adiciona todas as mudanças ao staging sem pedir confirmação
 * Configurado para skip permissions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Git Keep All Auto - Adicionando Todas as Mudanças (SKIP PERMISSIONS)\n');

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
 * Adicionar todas as mudanças automaticamente
 */
function keepAll() {
  if (!isGitRepo()) {
    console.error('❌ Erro: Não é um repositório Git!\n');
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log('📋 Status atual:');
  console.log('='.repeat(60));

  try {
    execSync('git status --short', { stdio: 'inherit' });
  } catch (error) {
    // Ignorar se não houver mudanças
  }

  console.log('\n🔄 Adicionando todas as mudanças...\n');

  try {
    // Adicionar todas as mudanças (tracked + untracked)
    execSync('git add --all', { stdio: 'inherit' });
    console.log('✅ Todas as mudanças adicionadas!\n');

    // Mostrar status após add
    console.log('='.repeat(60));
    console.log('📋 Status após add:');
    console.log('='.repeat(60));
    execSync('git status', { stdio: 'inherit' });

    return { success: true };
  } catch (error) {
    console.error(`❌ Erro ao adicionar mudanças: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

/**
 * Commit automático (se configurado)
 */
function autoCommit(message) {
  const autoCommit = process.env.AUTO_COMMIT === 'true';
  const commitMessage = message || process.env.COMMIT_MESSAGE || 'chore: auto commit';

  if (!autoCommit) {
    return { success: true, skipped: true };
  }

  console.log('\n💾 Fazendo commit automático...\n');

  try {
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    console.log('✅ Commit realizado!\n');
    return { success: true };
  } catch (error) {
    console.error(`❌ Erro ao fazer commit: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

/**
 * Push automático (se configurado)
 */
function autoPush() {
  const autoPush = process.env.AUTO_PUSH === 'true';

  if (!autoPush) {
    return { success: true, skipped: true };
  }

  console.log('\n🚀 Fazendo push automático...\n');

  try {
    execSync('git push', { stdio: 'inherit' });
    console.log('✅ Push realizado!\n');
    return { success: true };
  } catch (error) {
    console.error(`❌ Erro ao fazer push: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

// Executar
console.log('='.repeat(60));
console.log('🚀 GIT KEEP ALL AUTO');
console.log('='.repeat(60));

const keepResult = keepAll();

if (keepResult.success) {
  // Commit automático (se configurado)
  const commitMessage = process.argv[2];
  const commitResult = autoCommit(commitMessage);

  // Push automático (se configurado)
  if (commitResult.success && !commitResult.skipped) {
    autoPush();
  }

  console.log('='.repeat(60));
  console.log('✅ Git Keep All Auto concluído!');
  console.log('='.repeat(60));
  console.log('\n💡 Dicas:');
  console.log('   - AUTO_COMMIT=true npm run git:keep-all "mensagem" - Para commit automático');
  console.log('   - AUTO_PUSH=true npm run git:keep-all - Para push automático');
  console.log('   - AUTO_COMMIT=true AUTO_PUSH=true npm run git:keep-all "mensagem" - Tudo automático\n');
  process.exit(0);
} else {
  console.error('❌ Git Keep All Auto falhou!\n');
  process.exit(1);
}
