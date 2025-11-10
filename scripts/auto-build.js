#!/usr/bin/env node

/**
 * Auto Build - Build Automático sem Interação
 *
 * Executa builds EAS automaticamente sem pedir confirmação
 * Configurado para pular todas as permissões
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏗️  Build Automático (SKIP PERMISSIONS)\n');

/**
 * Executar build sem interação
 */
function runBuild(platform, profile = 'preview') {
  console.log(`\n📱 Building ${platform} (${profile})...\n`);

  try {
    // Verificar se EAS CLI está instalado
    try {
      execSync('eas --version', { stdio: 'pipe' });
    } catch (error) {
      console.error('❌ EAS CLI não instalado. Instale com: npm install -g eas-cli\n');
      return { success: false, error: 'EAS CLI not installed' };
    }

    // Comando de build com flags non-interactive
    const command = `eas build --platform ${platform} --profile ${profile} --non-interactive --no-wait`;

    console.log(`Executando: ${command}\n`);

    execSync(command, {
      stdio: 'inherit',
      env: {
        ...process.env,
        EAS_NO_VCS: '1', // Não verificar VCS
        EAS_NON_INTERACTIVE: '1',
      },
    });

    console.log(`\n✅ Build ${platform} iniciado com sucesso!\n`);
    return { success: true, platform, profile };
  } catch (error) {
    console.error(`\n❌ Build ${platform} falhou: ${error.message}\n`);
    return { success: false, error: error.message, platform };
  }
}

/**
 * Deploy Edge Functions automaticamente
 */
function deployFunctions() {
  console.log('='.repeat(60));
  console.log('🚀 DEPLOY EDGE FUNCTIONS');
  console.log('='.repeat(60));

  try {
    // Verificar se Supabase CLI está instalado
    try {
      execSync('supabase --version', { stdio: 'pipe' });
    } catch (error) {
      console.error('❌ Supabase CLI não instalado. Instale com: npm install -g supabase\n');
      return { success: false, error: 'Supabase CLI not installed' };
    }

    const functions = [
      'nathia-chat',
      'moderation-service',
      'risk-REDACTED',
      'behavior-analysis',
      'lgpd-requests',
      'transcribe-audio',
    ];

    const results = [];

    for (const func of functions) {
      console.log(`\n📦 Deploying ${func}...`);
      try {
        execSync(`supabase functions deploy ${func} --no-verify-jwt`, {
          stdio: 'inherit',
          env: {
            ...process.env,
            SUPABASE_NON_INTERACTIVE: '1',
          },
        });
        console.log(`✅ ${func} deployed\n`);
        results.push({ function: func, success: true });
      } catch (error) {
        console.error(`❌ ${func} failed: ${error.message}\n`);
        results.push({ function: func, success: false, error: error.message });
      }
    }

    const allSuccess = results.every((r) => r.success);
    return { success: allSuccess, results };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// CLI
const command = process.argv[2] || 'all';
const platform = process.argv[3] || 'android';
const profile = process.argv[4] || 'preview';

console.log('='.repeat(60));
console.log('🏗️  BUILD AUTOMÁTICO - SKIP PERMISSIONS');
console.log('='.repeat(60));

switch (command) {
  case 'android':
    runBuild('android', profile);
    break;

  case 'ios':
    runBuild('ios', profile);
    break;

  case 'all':
    console.log('\n📱 Building all platforms...\n');
    runBuild('android', profile);
    runBuild('ios', profile);
    break;

  case 'functions':
    deployFunctions();
    break;

  case 'full':
    console.log('\n🚀 Full build (mobile + functions)...\n');
    runBuild('android', profile);
    runBuild('ios', profile);
    deployFunctions();
    break;

  default:
    console.log(`
Usage: node scripts/auto-build.js <command> [platform] [profile]

Commands:
  android [profile]    - Build Android (default: preview)
  ios [profile]        - Build iOS (default: preview)
  all [profile]        - Build Android + iOS (default: preview)
  functions            - Deploy Edge Functions
  full [profile]       - Build all + Deploy functions (default: preview)

Examples:
  node scripts/auto-build.js android
  node scripts/auto-build.js ios production
  node scripts/auto-build.js all preview
  node scripts/auto-build.js functions
  node scripts/auto-build.js full

Flags automáticos aplicados:
  --non-interactive
  --no-wait
  --no-verify-jwt (functions)
    `);
    process.exit(1);
}

console.log('\n✅ Build automático concluído!\n');
process.exit(0);
