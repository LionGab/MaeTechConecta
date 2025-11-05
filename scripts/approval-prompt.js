#!/usr/bin/env node

/**
 * Approval Prompt - Sistema de Aprovação Interativa
 *
 * Solicita aprovação do usuário antes de aplicar mudanças críticas
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CONFIG_PATH = path.join(__dirname, '../.cursor/cli.json');
const APPROVALS_FILE = path.join(__dirname, '../.cursor/review-logs/pending-approvals.json');
const REVIEW_MANAGER = path.join(__dirname, 'review-manager.js');

/**
 * Carregar configuração
 */
function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  } catch (error) {
    console.error('Erro ao carregar configuração:', error.message);
    process.exit(1);
  }
}

/**
 * Salvar aprovação pendente
 */
function savePendingApproval(approval) {
  let pending = [];

  if (fs.existsSync(APPROVALS_FILE)) {
    try {
      pending = JSON.parse(fs.readFileSync(APPROVALS_FILE, 'utf-8'));
    } catch (error) {
      pending = [];
    }
  }

  pending.push(approval);
  fs.writeFileSync(APPROVALS_FILE, JSON.stringify(pending, null, 2));
}

/**
 * Solicitar aprovação do usuário
 */
async function requestApproval(approvalData) {
  const config = loadConfig();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\n⚠️  APROVAÇÃO REQUERIDA');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Agente: ${approvalData.agent_id}`);
  console.log(`Ação: ${approvalData.action}`);
  console.log(`Arquivo: ${approvalData.file || 'N/A'}`);
  console.log(`Severidade: ${approvalData.severity || 'N/A'}`);
  console.log(`Descrição: ${approvalData.description || 'N/A'}`);

  if (approvalData.diff) {
    console.log('\n📝 Diferenças:');
    console.log(approvalData.diff);
  }

  console.log('═══════════════════════════════════════════════════\n');

  return new Promise((resolve) => {
    rl.question('Aprovar esta ação? (s/N): ', (answer) => {
      rl.close();

      const approved = answer.toLowerCase() === 's' || answer.toLowerCase() === 'y';

      if (approved) {
        // Executar ação via review-manager
        const { exec } = require('child_process');
        exec(`node ${REVIEW_MANAGER} approve ${approvalData.id}`, (error, stdout, stderr) => {
          if (error) {
            console.error('Erro ao registrar aprovação:', error);
            resolve(false);
            return;
          }
          console.log('✅ Ação aprovada e registrada');
          resolve(true);
        });
      } else {
        console.log('❌ Ação negada');
        resolve(false);
      }
    });

    // Timeout automático
    setTimeout(
      () => {
        rl.close();
        console.log(`\n⏱️  Timeout: ${config.approval.timeout}s excedido`);
        console.log(`Ação negada por padrão (config: ${config.approval.default_action})`);
        resolve(false);
      },
      (config.approval.timeout || 300) * 1000
    );
  });
}

// CLI
const approvalId = process.argv[2];

if (!approvalId) {
  console.log(`
Usage: node approval-prompt.js <approval_id>

Solicita aprovação interativa do usuário para ação pendente.
  `);
  process.exit(1);
}

// Carregar aprovação pendente
let pendingApprovals = [];
if (fs.existsSync(APPROVALS_FILE)) {
  try {
    pendingApprovals = JSON.parse(fs.readFileSync(APPROVALS_FILE, 'utf-8'));
  } catch (error) {
    console.error('Erro ao carregar aprovações pendentes:', error.message);
    process.exit(1);
  }
}

const approval = pendingApprovals.find((a) => a.id === approvalId);

if (!approval) {
  console.error(`Aprovação ${approvalId} não encontrada`);
  process.exit(1);
}

// Solicitar aprovação
requestApproval(approval).then((approved) => {
  process.exit(approved ? 0 : 1);
});
