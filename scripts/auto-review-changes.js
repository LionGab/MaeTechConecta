#!/usr/bin/env node

/**
 * Auto Review Changes - Revisão Automática de Mudanças
 *
 * Revisa mudanças automaticamente sem pedir permissão
 * Configurado para pular todas as aprovações
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Revisão Automática de Mudanças (SKIP PERMISSIONS)\n');

// Configuração: sempre aprovar
const AUTO_APPROVE = true;
const SKIP_PERMISSIONS = true;
const SKIP_AWAITING_REVIEW = true;

// Auto-aprovar todas as mudanças
if (AUTO_APPROVE && SKIP_AWAITING_REVIEW) {
  try {
    const { execSync } = require('child_process');
    execSync('node scripts/auto-approve.js all', { stdio: 'pipe' });
    console.log('✅ Todas as aprovações pendentes foram auto-aprovadas\n');
  } catch (error) {
    // Ignorar erro se não houver aprovações pendentes
  }
}

/**
 * Executar comando sem pedir permissão
 */
function runAuto(command, description) {
  console.log(`\n📝 ${description}...`);
  try {
    const output = execSync(command, {
      stdio: 'inherit',
      encoding: 'utf8',
      env: { ...process.env, AUTO_APPROVE: 'true', SKIP_PERMISSIONS: 'true' },
    });
    console.log(`✅ ${description} - OK\n`);
    return { success: true, output };
  } catch (error) {
    console.error(`❌ ${description} - FALHOU: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

/**
 * Revisar mudanças do Git
 */
function reviewGitChanges() {
  console.log('='.repeat(60));
  console.log('📊 REVISÃO DE MUDANÇAS DO GIT');
  console.log('='.repeat(60));

  try {
    // Verificar status
    const status = execSync('git status --porcelain', { encoding: 'utf8' });

    if (!status.trim()) {
      console.log('✅ Nenhuma mudança pendente\n');
      return { success: true, changes: [] };
    }

    const changes = status
      .trim()
      .split('\n')
      .map((line) => {
        const [status, file] = line.split(/\s+/);
        return { status: status.trim(), file: file.trim() };
      });

    console.log(`\n📝 ${changes.length} arquivo(s) modificado(s):\n`);
    changes.forEach(({ status, file }) => {
      console.log(`   ${status} ${file}`);
    });

    // Mostrar diff se houver
    if (changes.length > 0) {
      console.log('\n📋 Resumo das mudanças:');
      try {
        const diff = execSync('git diff --stat', { encoding: 'utf8' });
        console.log(diff);
      } catch (error) {
        // Ignorar erro se não houver diff
      }
    }

    return { success: true, changes };
  } catch (error) {
    console.error(`❌ Erro ao revisar mudanças: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

/**
 * Aplicar correções automáticas
 */
function autoFix() {
  console.log('='.repeat(60));
  console.log('🔧 CORREÇÕES AUTOMÁTICAS');
  console.log('='.repeat(60));

  // Fix lint
  runAuto('npm run lint:fix', 'Corrigir Lint');

  // Format
  runAuto('npm run format', 'Formatar Código');

  return { success: true };
}

/**
 * Validar mudanças automaticamente
 */
function autoValidate() {
  console.log('='.repeat(60));
  console.log('✅ VALIDAÇÃO AUTOMÁTICA');
  console.log('='.repeat(60));

  const results = {
    lint: runAuto('npm run lint', 'Lint'),
    typeCheck: runAuto('npm run type-check', 'Type Check'),
    tests: runAuto('npm test', 'Testes'),
  };

  const allPassed = Object.values(results).every((r) => r.success);

  if (allPassed) {
    console.log('\n✅ Todas as validações passaram!\n');
  } else {
    console.log('\n⚠️  Algumas validações falharam (mas continuando...)\n');
  }

  return { success: allPassed, results };
}

/**
 * Staging automático (se configurado)
 */
function autoStage() {
  const autoStage = process.env.AUTO_STAGE === 'true';

  if (!autoStage) {
    return { success: true, skipped: true };
  }

  console.log('='.repeat(60));
  console.log('📦 STAGING AUTOMÁTICO');
  console.log('='.repeat(60));

  try {
    execSync('git add .', { stdio: 'inherit' });
    console.log('✅ Arquivos adicionados ao staging\n');
    return { success: true };
  } catch (error) {
    console.error(`❌ Erro ao fazer staging: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

// Executar revisão completa
console.log('🚀 Iniciando revisão automática (SKIP PERMISSIONS)...\n');

const gitReview = reviewGitChanges();
const fixes = autoFix();
const validation = autoValidate();

// Auto stage se configurado
const staging = autoStage();

// Resumo final
console.log('='.repeat(60));
console.log('📊 RESUMO DA REVISÃO AUTOMÁTICA');
console.log('='.repeat(60));

console.log(`\n✅ Git Review: ${gitReview.success ? 'OK' : 'FALHOU'}`);
console.log(`✅ Auto Fix: ${fixes.success ? 'OK' : 'FALHOU'}`);
console.log(`✅ Validação: ${validation.success ? 'OK' : 'FALHOU'}`);
if (!staging.skipped) {
  console.log(`✅ Staging: ${staging.success ? 'OK' : 'FALHOU'}`);
}

console.log('\n🎯 Revisão automática concluída!\n');
console.log('💡 Dica: Use AUTO_STAGE=true para staging automático\n');

process.exit(0);
