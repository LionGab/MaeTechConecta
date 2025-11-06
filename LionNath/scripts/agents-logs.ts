#!/usr/bin/env tsx

/**
 * Agents Logs - Mostra logs dos agentes
 */

import { logger } from './agents/utils/logger';
import * as path from 'path';
import * as fs from 'fs/promises';

async function main() {
  try {
    const dateArg = process.argv[2];
    const date = dateArg || new Date().toISOString().split('T')[0];

    console.log(`📋 Logs dos Agentes - ${date}\n`);

    // Lê logs
    const logs = await logger.readLogs(date);

    if (logs.length === 0) {
      console.log('ℹ️  Nenhum log encontrado para esta data');
      return;
    }

    // Mostra logs
    for (const log of logs) {
      console.log(log);
    }

    console.log(`\n✅ Total de logs: ${logs.length}`);
  } catch (error: any) {
    console.error('❌ Erro ao ler logs:', error);
    process.exit(1);
  }
}

main();
