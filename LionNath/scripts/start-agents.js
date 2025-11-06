#!/usr/bin/env node

/**
 * Start Agents - Inicia sistema de agentes
 *
 * Inicia cada agente em um processo separado usando tsx
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const agents = ['refactor', 'performance', 'test', 'docs', 'type-safety', 'accessibility', 'security', 'cleanup'];

const processes = [];
const pidFile = path.join(process.cwd(), '.agents', '.pids.json');

// Cria diretório se não existir
const agentsDir = path.join(process.cwd(), '.agents');
if (!fs.existsSync(agentsDir)) {
  fs.mkdirSync(agentsDir, { recursive: true });
}

console.log('🚀 Starting 8 agents in separate processes...\n');

// Inicia cada agente em processo separado
agents.forEach((agentType, index) => {
  console.log(`Starting ${agentType}-agent (${index + 1}/8)...`);

  const agentScript = path.join(process.cwd(), 'scripts', 'agents', 'run-agent.ts');
  const process = spawn('npx', ['tsx', agentScript, agentType], {
    detached: false,
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true,
  });

  processes.push({
    type: agentType,
    process,
    pid: process.pid,
  });

  process.on('error', (error) => {
    console.error(`❌ Error starting ${agentType}-agent:`, error);
  });

  process.on('exit', (code) => {
    console.log(`✅ ${agentType}-agent exited with code ${code}`);
  });
});

// Salva PIDs
const pids = processes.map((p) => ({ type: p.type, pid: p.pid }));
fs.writeFileSync(pidFile, JSON.stringify(pids, null, 2));

console.log('\n✅ All agents started!');
console.log(`📝 PIDs saved to ${pidFile}`);
console.log('\nPress Ctrl+C to stop all agents...\n');

// Handler para parar todos os processos
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping all agents...');
  processes.forEach(({ process, type }) => {
    try {
      process.kill('SIGTERM');
      console.log(`✅ Stopped ${type}-agent`);
    } catch (error) {
      console.error(`❌ Error stopping ${type}-agent:`, error);
    }
  });

  // Remove arquivo de PIDs
  if (fs.existsSync(pidFile)) {
    fs.unlinkSync(pidFile);
  }

  process.exit(0);
});

// Mantém processo principal vivo
process.stdin.resume();
