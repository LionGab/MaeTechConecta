#!/usr/bin/env tsx

/**
 * Stop Agents - Para todos os agentes em execução
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { logger } from './agents/utils/logger';

const pidFile = path.join(process.cwd(), '.agents', '.pids.json');

async function main() {
  try {
    console.log('🛑 Parando todos os agentes...\n');

    // Lê arquivo de PIDs
    let pids: Array<{ type: string; pid: number }> = [];
    try {
      const content = await fs.readFile(pidFile, 'utf8');
      pids = JSON.parse(content);
    } catch (error) {
      console.log('ℹ️  Nenhum agente em execução encontrado');
      return;
    }

    // Para cada processo
    for (const { type, pid } of pids) {
      try {
        // Tenta parar processo (Windows/Linux)
        if (process.platform === 'win32') {
          // Windows
          const { execSync } = await import('child_process');
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        } else {
          // Linux/Mac
          const { execSync } = await import('child_process');
          execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
        }
        console.log(`✅ Parado ${type}-agent (PID: ${pid})`);
      } catch (error) {
        console.log(`⚠️  Não foi possível parar ${type}-agent (PID: ${pid})`);
      }
    }

    // Remove arquivo de PIDs
    try {
      await fs.unlink(pidFile);
    } catch (error) {
      // Ignora se não existir
    }

    await logger.info('stop-agents', 'All agents stopped');
    console.log('\n✅ Todos os agentes foram parados');
  } catch (error: any) {
    console.error('❌ Erro ao parar agentes:', error);
    await logger.error('stop-agents', 'Failed to stop agents', error);
    process.exit(1);
  }
}

main();
