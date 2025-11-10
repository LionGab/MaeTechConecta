#!/usr/bin/env node

/**
 * Auto Approve Guarded - Fluxo endurecido para aprovações automáticas
 *
 * - Requer CI bem-sucedido (CI_PASSED=true) ou override explícito (--force)
 * - Limita auto-approve a uma allowlist de branches segura
 * - Registra todas as decisões em `logs/approvals/YYYY-MM-DD.json`
 * - Mantém compatibilidade com os arquivos `.cursor` para histórico legado
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, '.cursor/cli.json');
const CURSOR_REVIEW_LOGS_DIR = path.join(ROOT, '.cursor/review-logs');
const PENDING_APPROVALS_FILE = path.join(CURSOR_REVIEW_LOGS_DIR, 'pending-approvals.json');
const AUDIT_LOG_DIR = path.join(ROOT, 'logs/approvals');

const DEFAULT_BRANCH_ALLOWLIST = ['release/agents', 'infra/automation', 'infra/ci'];
const ALLOWED_BRANCHES = (process.env.AUTO_APPROVE_BRANCHES || DEFAULT_BRANCH_ALLOWLIST.join(','))
  .split(',')
  .map((branch) => branch.trim())
  .filter(Boolean);

const CI_PASSED = process.env.CI_PASSED === 'true';
const CI_PIPELINE_ID = process.env.GITHUB_RUN_ID || process.env.CI_RUN_ID || null;
const ACTOR = process.env.GITHUB_ACTOR || process.env.USER || 'unknown-actor';
const OVERRIDE_ENV = process.env.AUTO_APPROVE_OVERRIDE === 'true';
const FORCE_MODE = process.argv.includes('--force') || OVERRIDE_ENV;
const COMMAND = process.argv[2] || 'all';
const COMMAND_ARGS = process.argv.slice(3);

function loadJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error(`❌ Falha ao ler ${filePath}: ${error.message}`);
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getCurrentBranch() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    return branch;
  } catch (error) {
    console.error('❌ Não foi possível identificar a branch atual.');
    throw error;
  }
}

function ensureGuards() {
  const branch = getCurrentBranch();

  if (!ALLOWED_BRANCHES.includes(branch) && !FORCE_MODE) {
    console.error(`❌ Branch '${branch}' não está na allowlist: ${ALLOWED_BRANCHES.join(', ')}`);
    console.error('   Use revisão humana ou execute com --force após analisar riscos.');
    process.exit(1);
  }

  if (!CI_PASSED && !FORCE_MODE) {
    console.error('❌ Auto-approve bloqueado: variável CI_PASSED precisa ser "true" (pipeline verde).');
    console.error('   Rode as checagens locais (pnpm run validate) ou reexecute o CI.');
    process.exit(1);
  }
}

function buildAuditLogEntry(payload) {
  return {
    ...payload,
    timestamp: new Date().toISOString(),
    actor: ACTOR,
    branch: getCurrentBranch(),
    ci_pipeline_id: CI_PIPELINE_ID,
    ci_passed: CI_PASSED,
    force_mode: FORCE_MODE,
  };
}

function appendAuditLog(entry) {
  fs.mkdirSync(AUDIT_LOG_DIR, { recursive: true });
  const filename = `approvals-${new Date().toISOString().split('T')[0]}.json`;
  const filePath = path.join(AUDIT_LOG_DIR, filename);

  const currentLogs = loadJson(filePath, []);
  currentLogs.push(entry);
  writeJson(filePath, currentLogs);
}

function loadPendingApprovals() {
  return loadJson(PENDING_APPROVALS_FILE, []);
}

function savePendingApprovals(approvals) {
  writeJson(PENDING_APPROVALS_FILE, approvals);
}

function guardConfig() {
  const config = loadJson(CONFIG_PATH, {});

  // Travar defaults seguros
  config.auto_approve = false;
  config.skip_awaiting_review = false;
  config.approval_timeout = config.approval_timeout ?? 0;
  config.approval = {
    ...(config.approval || {}),
    default_action: 'review',
    auto_approve: false,
  };

  writeJson(CONFIG_PATH, config);

  console.log('⚙️  Configuração atualizada: auto_approve desativado por padrão.');
}

function listStatus() {
  const pending = loadPendingApprovals();
  console.log(`📊 ${pending.length} aprovação(ões) pendente(s).`);
  pending.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.id} · ${item.action} · ${item.file || 'sem arquivo'}`);
  });
}

function approveAll() {
  ensureGuards();
  const pending = loadPendingApprovals();

  if (pending.length === 0) {
    console.log('✅ Nenhuma aprovação pendente.');
    appendAuditLog(buildAuditLogEntry({ type: 'auto-approve', approvals_found: 0, approvals_granted: 0 }));
    return;
  }

  console.log(`📝 Encontradas ${pending.length} aprovações pendentes.`);

  const approvedIds = [];

  pending.forEach((item, index) => {
    console.log(`[${index + 1}/${pending.length}] Aprovando ${item.id} (${item.action})`);

    appendAuditLog(
      buildAuditLogEntry({
        type: 'auto-approve-item',
        approval_id: item.id,
        action: item.action,
        file: item.file || null,
        severity: item.severity || null,
        agent_id: item.agent_id || 'auto-approver',
        decision: 'approved',
      })
    );

    approvedIds.push(item.id);
  });

  savePendingApprovals([]);
  appendAuditLog(buildAuditLogEntry({ type: 'auto-approve', approvals_found: pending.length, approvals_granted: approvedIds.length }));
  console.log(`✅ ${approvedIds.length}/${pending.length} aprovações liberadas.`);
}

function approveSingle(id) {
  ensureGuards();
  const pending = loadPendingApprovals();
  const target = pending.find((item) => item.id === id);

  if (!target) {
    console.error(`❌ Aprovação ${id} não encontrada.`);
    appendAuditLog(buildAuditLogEntry({ type: 'auto-approve-item', approval_id: id, decision: 'not_found' }));
    process.exit(1);
  }

  appendAuditLog(
    buildAuditLogEntry({
      type: 'auto-approve-item',
      approval_id: target.id,
      action: target.action,
      file: target.file || null,
      severity: target.severity || null,
      agent_id: target.agent_id || 'auto-approver',
      decision: 'approved',
    })
  );

  savePendingApprovals(pending.filter((item) => item.id !== id));
  console.log(`✅ Aprovação ${id} concluída.`);
}

function showUsage() {
  console.log(`
Usage: node scripts/auto-approve.js <command> [args]

Commands:
  all                    Aprova todas as mudanças pendentes (respeitando guardrails)
  approve <id>           Aprova uma mudança específica
  status                 Lista aprovações pendentes
  configure              Reescreve .cursor/cli.json com defaults seguros

Flags:
  --force                Ignora validações (usar apenas com registro manual da revisão)

Variáveis de ambiente:
  CI_PASSED              Deve ser 'true' após pipeline verde
  AUTO_APPROVE_BRANCHES  Lista de branches permitidas (separadas por vírgula)
  AUTO_APPROVE_OVERRIDE  Use 'true' apenas em incidentes para liberar auto-approve
`);
}

(function main() {
  fs.mkdirSync(CURSOR_REVIEW_LOGS_DIR, { recursive: true });
  fs.mkdirSync(AUDIT_LOG_DIR, { recursive: true });

  switch (COMMAND) {
    case 'all': {
      approveAll();
      break;
    }
    case 'approve': {
      const target = COMMAND_ARGS[0];
      if (!target) {
        console.error('❌ Informe o ID de aprovação.');
        showUsage();
        process.exit(1);
      }
      approveSingle(target);
      break;
    }
    case 'status': {
      listStatus();
      break;
    }
    case 'configure': {
      guardConfig();
      break;
    }
    default: {
      showUsage();
      process.exit(1);
    }
  }
})();
