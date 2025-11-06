#!/usr/bin/env node

/**
 * Run Agent Simple - Versão simplificada para executar agentes
 * Usa tsx para executar TypeScript diretamente
 */

const { spawn } = require('child_process');
const path = require('path');

const agentType = process.argv[2];

if (!agentType) {
  console.error('Usage: node run-agent-simple.js <agent-type>');
  process.exit(1);
}

const agentFile = path.join(__dirname, 'agents', `${agentType}-agent.ts`);

if (!require('fs').existsSync(agentFile)) {
  console.error(`Agent file not found: ${agentFile}`);
  process.exit(1);
}

// Executa agente usando tsx
const process = spawn('npx', ['tsx', agentFile], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..', '..'),
});

process.on('error', (error) => {
  console.error(`Error running agent: ${error.message}`);
  process.exit(1);
});

process.on('exit', (code) => {
  process.exit(code || 0);
});
