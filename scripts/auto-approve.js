#!/usr/bin/env node

/**
 * Auto Approve - Aprovação Automática de Reviews
 *
 * Aprova automaticamente todas as mudanças pendentes
 * Configurado para pular awaiting review
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG_PATH = path.join(__dirname, '../.cursor/cli.json');
const APPROVALS_FILE = path.join(__dirname, '../.cursor/review-logs/pending-approvals.json');
const REVIEW_LOGS_DIR = path.join(__dirname, '../.cursor/review-logs');

console.log('✅ Auto Approve - Aprovação Automática (SKIP PERMISSIONS)\n');

/**
 * Carregar configuração
 */
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }
  } catch (error) {
    // Configuração padrão se não existir
  }

  return {
    auto_approve: true,
    skip_awaiting_review: true,
    approval_timeout: 0,
  };
}

/**
 * Auto-aprovar todas as mudanças pendentes
 */
function autoApproveAll() {
  console.log('='.repeat(60));
  console.log('🔍 Procurando aprovações pendentes...');
  console.log('='.repeat(60));

  // Criar diretório se não existir
  if (!fs.existsSync(REVIEW_LOGS_DIR)) {
    fs.mkdirSync(REVIEW_LOGS_DIR, { recursive: true });
  }

  let pendingApprovals = [];

  // Carregar aprovações pendentes
  if (fs.existsSync(APPROVALS_FILE)) {
    try {
      pendingApprovals = JSON.parse(fs.readFileSync(APPROVALS_FILE, 'utf-8'));
    } catch (error) {
      console.log('⚠️  Nenhuma aprovação pendente encontrada\n');
      return { approved: 0, total: 0 };
    }
  }

  if (pendingApprovals.length === 0) {
    console.log('✅ Nenhuma aprovação pendente\n');
    return { approved: 0, total: 0 };
  }

  console.log(`\n📝 ${pendingApprovals.length} aprovação(ões) pendente(s)\n`);

  // Auto-aprovar todas
  const approved = [];
  const today = new Date().toISOString().split('T')[0];
  const logFile = path.join(REVIEW_LOGS_DIR, `review-${today}.json`);

  pendingApprovals.forEach((approval, index) => {
    console.log(`[${index + 1}/${pendingApprovals.length}] Aprovando: ${approval.id}`);
    console.log(`   Ação: ${approval.action}`);
    console.log(`   Arquivo: ${approval.file || 'N/A'}`);
    console.log(`   Severidade: ${approval.severity || 'N/A'}\n`);

    // Registrar aprovação
    const approvalLog = {
      timestamp: new Date().toISOString(),
      agent_id: approval.agent_id || 'auto-approver',
      action: approval.action,
      file: approval.file || null,
      severity: approval.severity || null,
      result: 'auto_approved',
      approval_id: approval.id,
      approved_by: 'auto',
      approved_at: new Date().toISOString(),
      skip_awaiting_review: true,
    };

    // Salvar no log
    let logs = [];
    if (fs.existsSync(logFile)) {
      try {
        logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
      } catch (error) {
        logs = [];
      }
    }
    logs.push(approvalLog);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

    approved.push(approval.id);
  });

  // Limpar aprovações pendentes
  fs.writeFileSync(APPROVALS_FILE, JSON.stringify([], null, 2));

  console.log(`\n✅ ${approved.length}/${pendingApprovals.length} aprovação(ões) aprovada(s) automaticamente!\n`);

  return { approved: approved.length, total: pendingApprovals.length };
}

/**
 * Aprovar ação específica
 */
function approveAction(approvalId) {
  let pendingApprovals = [];

  if (fs.existsSync(APPROVALS_FILE)) {
    try {
      pendingApprovals = JSON.parse(fs.readFileSync(APPROVALS_FILE, 'utf-8'));
    } catch (error) {
      console.error(`❌ Erro ao carregar aprovações: ${error.message}\n`);
      return false;
    }
  }

  const approval = pendingApprovals.find((a) => a.id === approvalId);

  if (!approval) {
    console.error(`❌ Aprovação ${approvalId} não encontrada\n`);
    return false;
  }

  console.log(`✅ Aprovando: ${approvalId}\n`);
  console.log(`   Ação: ${approval.action}`);
  console.log(`   Arquivo: ${approval.file || 'N/A'}\n`);

  // Registrar aprovação
  const today = new Date().toISOString().split('T')[0];
  const logFile = path.join(REVIEW_LOGS_DIR, `review-${today}.json`);

  const approvalLog = {
    timestamp: new Date().toISOString(),
    agent_id: approval.agent_id || 'auto-approver',
    action: approval.action,
    file: approval.file || null,
    severity: approval.severity || null,
    result: 'auto_approved',
    approval_id: approvalId,
    approved_by: 'auto',
    approved_at: new Date().toISOString(),
  };

  let logs = [];
  if (fs.existsSync(logFile)) {
    try {
      logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
    } catch (error) {
      logs = [];
    }
  }
  logs.push(approvalLog);
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

  // Remover da lista pendente
  pendingApprovals = pendingApprovals.filter((a) => a.id !== approvalId);
  fs.writeFileSync(APPROVALS_FILE, JSON.stringify(pendingApprovals, null, 2));

  console.log(`✅ Aprovação ${approvalId} registrada\n`);
  return true;
}

/**
 * Configurar auto-aprovação global
 */
function configureAutoApprove() {
  console.log('='.repeat(60));
  console.log('⚙️  CONFIGURANDO AUTO-APROVAÇÃO');
  console.log('='.repeat(60));

  const config = loadConfig();

  // Atualizar configuração
  config.auto_approve = true;
  config.skip_awaiting_review = true;
  config.approval_timeout = 0;
  config.approval = config.approval || {};
  config.approval.default_action = 'approve';
  config.approval.auto_approve = true;

  // Salvar configuração
  const configDir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

  console.log('\n✅ Configuração de auto-aprovação salva!\n');
  console.log('📋 Configurações aplicadas:');
  console.log('   - auto_approve: true');
  console.log('   - skip_awaiting_review: true');
  console.log('   - approval_timeout: 0');
  console.log('   - default_action: approve\n');
}

// CLI
const command = process.argv[2] || 'all';
const approvalId = process.argv[3];

switch (command) {
  case 'all':
    const result = autoApproveAll();
    console.log(`\n📊 Resumo: ${result.approved}/${result.total} aprovadas\n`);
    break;

  case 'config':
    configureAutoApprove();
    break;

  case 'approve':
    if (!approvalId) {
      console.error('❌ ID de aprovação necessário\n');
      console.log('Usage: node scripts/auto-approve.js approve <approval_id>\n');
      process.exit(1);
    }
    approveAction(approvalId);
    break;

  case 'status':
    let pending = [];
    if (fs.existsSync(APPROVALS_FILE)) {
      try {
        pending = JSON.parse(fs.readFileSync(APPROVALS_FILE, 'utf-8'));
      } catch (error) {
        pending = [];
      }
    }
    console.log(`\n📊 Status: ${pending.length} aprovação(ões) pendente(s)\n`);
    if (pending.length > 0) {
      pending.forEach((a, i) => {
        console.log(`  ${i + 1}. ${a.id} - ${a.action} - ${a.file || 'N/A'}`);
      });
    }
    break;

  default:
    console.log(`
Usage: node scripts/auto-approve.js <command> [args]

Commands:
  all                    - Aprova todas as aprovações pendentes
  config                 - Configura auto-aprovação global
  approve <id>           - Aprova aprovação específica
  status                 - Mostra status de aprovações pendentes

Examples:
  node scripts/auto-approve.js all
  node scripts/auto-approve.js config
  node scripts/auto-approve.js approve approval-123
  node scripts/auto-approve.js status
    `);
    process.exit(1);
}

console.log('✅ Auto-approve concluído!\n');
process.exit(0);

