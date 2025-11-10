#!/usr/bin/env node

/**
 * Review Manager - Gerenciador de Revisões e Aprovações
 *
 * Script para gerenciar revisões de código, aprovações e logs
 * Integra com sistema de permissões do Cursor
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../.cursor/cli.json');
const WHITELIST_PATH = path.join(__dirname, '../.cursor/whitelist.json');
const LOGS_DIR = path.join(__dirname, '../.cursor/review-logs');

// Criar diretório de logs se não existir
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

/**
 * Carregar configuração de permissões
 */
function loadConfig() {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    return config;
  } catch (error) {
    console.error('Erro ao carregar configuração:', error.message);
    process.exit(1);
  }
}

/**
 * Carregar whitelist
 */
function loadWhitelist() {
  try {
    const whitelist = JSON.parse(fs.readFileSync(WHITELIST_PATH, 'utf-8'));
    return whitelist;
  } catch (error) {
    console.error('Erro ao carregar whitelist:', error.message);
    process.exit(1);
  }
}

/**
 * Verificar se agente/usuário está na whitelist
 */
function checkWhitelist(agentId, action) {
  const whitelist = loadWhitelist();

  // Verificar usuário padrão (sempre permitido)
  if (agentId === 'default_user') {
    return { allowed: true, trustLevel: 'admin' };
  }

  // Verificar agentes
  const agent = whitelist.agents.find((a) => a.id === agentId && a.enabled);
  if (!agent) {
    return { allowed: false, reason: 'Agent not in whitelist or disabled' };
  }

  // Verificar permissões do trust level
  const trustLevel = whitelist.trust_level_permissions[agent.trust_level] || [];
  const hasPermission = trustLevel.includes(action) || agent.permissions.includes(action);

  if (!hasPermission) {
    return {
      allowed: false,
      reason: `Action '${action}' not allowed for trust level '${agent.trust_level}'`,
    };
  }

  // Verificar restrições
  const hasRestriction = agent.restrictions.some((restriction) => {
    if (restriction === 'no_auto_apply' && action === 'auto_apply') return true;
    if (restriction === 'no_git_push' && action === 'git_push') return true;
    if (restriction === 'no_shell_destructive' && action.includes('destructive')) return true;
    return false;
  });

  if (hasRestriction) {
    return {
      allowed: false,
      reason: `Action '${action}' restricted for agent '${agentId}'`,
    };
  }

  return { allowed: true, trustLevel: agent.trust_level, agent };
}

/**
 * Registrar log de ação
 */
function logAction(agentId, action, file, severity, result, metadata = {}) {
  const config = loadConfig();

  if (!config.logging.enabled) {
    return;
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    agent_id: agentId,
    action,
    file: file || null,
    severity: severity || null,
    result,
    metadata,
    ...metadata,
  };

  // Criar arquivo de log por data
  const today = new Date().toISOString().split('T')[0];
  const logFile = path.join(LOGS_DIR, `review-${today}.json`);

  let logs = [];
  if (fs.existsSync(logFile)) {
    try {
      logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
    } catch (error) {
      console.warn('Erro ao ler log existente, criando novo:', error.message);
      logs = [];
    }
  }

  logs.push(logEntry);

  // Manter apenas últimos N logs (limite de memória)
  const maxLogs = 1000;
  if (logs.length > maxLogs) {
    logs = logs.slice(-maxLogs);
  }

  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

  // Log de auditoria separado
  if (config.logging.log_levels.includes('audit')) {
    const auditFile = path.join(LOGS_DIR, `audit-${today}.json`);
    const auditLog = {
      timestamp: logEntry.timestamp,
      agent_id: agentId,
      action,
      file,
      severity,
      result,
      requires_approval: action === 'write' || action === 'shell',
      approved: result === 'approved' || result === 'auto_approved',
    };

    let auditLogs = [];
    if (fs.existsSync(auditFile)) {
      try {
        auditLogs = JSON.parse(fs.readFileSync(auditFile, 'utf-8'));
      } catch (error) {
        auditLogs = [];
      }
    }

    auditLogs.push(auditLog);
    fs.writeFileSync(auditFile, JSON.stringify(auditLogs, null, 2));
  }
}

/**
 * Verificar se ação requer aprovação
 */
function requiresApproval(action, file, agentId) {
  const config = loadConfig();
  const whitelistCheck = checkWhitelist(agentId, action);

  // Se não está na whitelist, requer aprovação
  if (!whitelistCheck.allowed) {
    return { requires: true, reason: whitelistCheck.reason || 'Not whitelisted' };
  }

  // Verificar se ação está na lista de requer aprovação
  const approvalRequired = config.approval.required_for.some((pattern) => {
    if (pattern === 'write_restricted_files') {
      const restrictedFiles = config.permissions.write.restricted_files || [];
      return restrictedFiles.some((pattern) => file && (file.includes(pattern) || file.match(new RegExp(pattern))));
    }
    if (pattern === 'high_severity_fixes') {
      return (action === 'fix' && action.includes('severity_4')) || action.includes('severity_5');
    }
    return false;
  });

  // Verificar permissões do agente
  if (action === 'write' && config.permissions.write.require_approval) {
    return { requires: true, reason: 'Write actions require approval' };
  }

  if (action === 'shell' && config.permissions.shell.require_approval) {
    return { requires: true, reason: 'Shell commands require approval' };
  }

  // Se é reviewer e ação é apenas sugestão, não precisa aprovação
  if (whitelistCheck.trustLevel === 'reviewer' && action === 'suggest_fix') {
    return { requires: false, reason: 'Reviewer can suggest without approval' };
  }

  return { requires: approvalRequired, reason: approvalRequired ? 'Action in approval list' : 'Auto-approved' };
}

/**
 * Gerar relatório de revisão
 */
function generateReport(startDate, endDate) {
  const reports = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Percorrer todos os arquivos de log no período
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    const logFile = path.join(LOGS_DIR, `review-${dateStr}.json`);

    if (fs.existsSync(logFile)) {
      try {
        const logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
        reports.push(...logs);
      } catch (error) {
        console.warn(`Erro ao ler log ${dateStr}:`, error.message);
      }
    }
  }

  // Agregar estatísticas
  const stats = {
    total_actions: reports.length,
    by_agent: {},
    by_action: {},
    by_severity: {},
    approvals: {
      required: 0,
      approved: 0,
      denied: 0,
      pending: 0,
    },
    files_modified: new Set(),
    errors: 0,
  };

  reports.forEach((log) => {
    // Por agente
    stats.by_agent[log.agent_id] = (stats.by_agent[log.agent_id] || 0) + 1;

    // Por ação
    stats.by_action[log.action] = (stats.by_action[log.action] || 0) + 1;

    // Por severidade
    if (log.severity) {
      stats.by_severity[log.severity] = (stats.by_severity[log.severity] || 0) + 1;
    }

    // Aprovações
    if (log.requires_approval) {
      stats.approvals.required++;
      if (log.result === 'approved') stats.approvals.approved++;
      else if (log.result === 'denied') stats.approvals.denied++;
      else stats.approvals.pending++;
    }

    // Arquivos modificados
    if (log.file) {
      stats.files_modified.add(log.file);
    }

    // Erros
    if (log.result === 'error') {
      stats.errors++;
    }
  });

  stats.files_modified = Array.from(stats.files_modified);

  return {
    period: { start: startDate, end: endDate },
    stats,
    reports: reports.slice(-100), // Últimos 100 logs
  };
}

// CLI
const command = process.argv[2];

switch (command) {
  case 'check':
    const agentId = process.argv[3] || 'code-reviewer';
    const action = process.argv[4] || 'read';
    const file = process.argv[5] || null;

    const whitelistCheck = checkWhitelist(agentId, action);
    const approvalCheck = requiresApproval(action, file, agentId);

    console.log(
      JSON.stringify(
        {
          agent_id: agentId,
          action,
          file,
          whitelist: whitelistCheck,
          approval: approvalCheck,
          allowed: whitelistCheck.allowed && (!approvalCheck.requires || approvalCheck.approved),
        },
        null,
        2
      )
    );

    process.exit(whitelistCheck.allowed ? 0 : 1);
    break;

  case 'log':
    const logAgentId = process.argv[3] || 'code-reviewer';
    const logAction = process.argv[4] || 'review';
    const logFile = process.argv[5] || null;
    const logSeverity = process.argv[6] || null;
    const logResult = process.argv[7] || 'success';
    const logMetadata = process.argv[8] ? JSON.parse(process.argv[8]) : {};

    logAction(logAgentId, logAction, logFile, logSeverity, logResult, logMetadata);
    console.log('Log registrado com sucesso');
    break;

  case 'report':
    const startDate = process.argv[3] || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = process.argv[4] || new Date().toISOString().split('T')[0];

    const report = generateReport(startDate, endDate);
    console.log(JSON.stringify(report, null, 2));
    break;

  case 'approve':
    // Marcar aprovação manual (via arquivo)
    const approvalFile = path.join(LOGS_DIR, 'pending-approvals.json');
    let pendingApprovals = [];

    if (fs.existsSync(approvalFile)) {
      pendingApprovals = JSON.parse(fs.readFileSync(approvalFile, 'utf-8'));
    }

    const approvalId = process.argv[3];
    const approval = pendingApprovals.find((a) => a.id === approvalId);

    if (approval) {
      logAction(approval.agent_id, approval.action, approval.file, approval.severity, 'approved', {
        approval_id: approvalId,
        approved_by: 'manual',
        approved_at: new Date().toISOString(),
      });

      pendingApprovals = pendingApprovals.filter((a) => a.id !== approvalId);
      fs.writeFileSync(approvalFile, JSON.stringify(pendingApprovals, null, 2));

      console.log(`Aprovação ${approvalId} registrada`);
    } else {
      console.error(`Aprovação ${approvalId} não encontrada`);
      process.exit(1);
    }
    break;

  default:
    console.log(`
Usage: node review-manager.js <command> [args]

Commands:
  check <agent_id> <action> [file]     - Verificar permissões
  log <agent_id> <action> [file] [severity] [result] [metadata]  - Registrar log
  report [start_date] [end_date]       - Gerar relatório
  approve <approval_id>                - Aprovar ação pendente

Examples:
  node review-manager.js check code-reviewer read
  node review-manager.js check code-reviewer write src/components/Button.tsx
  node review-manager.js log code-reviewer review src/components/Button.tsx 3 success
  node review-manager.js report 2025-01-01 2025-01-30
    `);
    process.exit(1);
}

