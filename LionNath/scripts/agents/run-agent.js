#!/usr/bin/env node

/**
 * Run Agent - Executa um agente específico em loop contínuo
 */

const path = require('path');
const { spawn } = require('child_process');

const agentType = process.argv[2];

if (!agentType) {
  console.error('Usage: node run-agent.js <agent-type>');
  process.exit(1);
}

const projectRoot = path.join(__dirname, '../..');
const agentRunnerScript = path.join(__dirname, 'agents', 'agent-runner.ts');

console.log(`[${agentType}-agent] Starting agent runner...`);

// Executa agent-runner.ts usando tsx
const child = spawn('npx', ['tsx', agentRunnerScript, agentType], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, AGENT_TYPE: agentType },
});

child.on('error', (error) => {
  console.error(`[${agentType}-agent] Error:`, error);
});

child.on('exit', (code) => {
  console.log(`[${agentType}-agent] Exited with code ${code}`);
  process.exit(code || 0);
});

// Mantém processo vivo
process.stdin.resume();
