#!/usr/bin/env node

/**
 * Start Agents Simple - Versão simplificada que abre cada agente em processo separado
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const agents = ['refactor', 'performance', 'test', 'docs', 'type-safety', 'accessibility', 'security', 'cleanup'];

const processes = [];
const pidFile = path.join(__dirname, '.agents', '.pids.json');

// Cria diretório se não existir
const agentsDir = path.join(__dirname, '.agents');
if (!fs.existsSync(agentsDir)) {
  fs.mkdirSync(agentsDir, { recursive: true });
}

console.log('🚀 Starting 8 agents...\n');

const isWindows = process.platform === 'win32';
const agentScript = path.join(__dirname, 'agents', 'agents', 'run-agent-loop.ts');

// Inicia cada agente
agents.forEach((agentType, index) => {
  console.log(`[${index + 1}/8] Starting ${agentType}-agent...`);

  const args = ['tsx', agentScript, agentType];
  const command = isWindows ? 'npx.cmd' : 'npx';

  const proc = spawn(command, args, {
    detached: true,
    stdio: 'ignore',
    cwd: path.join(__dirname, '..'),
    shell: isWindows,
  });

  proc.unref(); // Permite que o processo pai termine

  processes.push({
    type: agentType,
    pid: proc.pid,
  });
});

// Salva PIDs
fs.writeFileSync(pidFile, JSON.stringify(processes, null, 2));

console.log('\n✅ All agents started!');
console.log(`📝 PIDs saved to ${pidFile}\n`);
console.log('Agents are running in background.');
console.log('Use "pnpm agents:status" to check status.');
console.log('Use "pnpm agents:stop" to stop all agents.\n');
