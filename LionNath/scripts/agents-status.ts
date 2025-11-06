#!/usr/bin/env tsx

/**
 * Agents Status - Mostra status dos agentes
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { Orchestrator } from './agents/orchestrator';

const statusFile = path.join(process.cwd(), '.agents', 'status.json');

async function main() {
  try {
    console.log('📊 Status dos Agentes\n');

    // Lê status
    let status: any = {};
    try {
      const content = await fs.readFile(statusFile, 'utf8');
      status = JSON.parse(content);
    } catch (error) {
      console.log('ℹ️  Nenhum status encontrado. Execute os agentes primeiro.');
      return;
    }

    // Mostra status
    console.log(`🔄 Rodando: ${status.running ? 'Sim' : 'Não'}`);
    console.log(`📅 Última atualização: ${status.lastUpdate || 'Nunca'}\n`);

    if (status.agents && Object.keys(status.agents).length > 0) {
      console.log('📋 Agentes:');
      console.log('─'.repeat(80));
      
      for (const [type, agentStatus: any] of Object.entries(status.agents)) {
        console.log(`\n🤖 ${type}-agent:`);
        console.log(`   Última execução: ${agentStatus.lastRun || 'Nunca'}`);
        console.log(`   Sucesso: ${agentStatus.success ? '✅' : '❌'}`);
        console.log(`   Arquivos modificados: ${agentStatus.filesModified || 0}`);
        console.log(`   Commits criados: ${agentStatus.commitsCreated || 0}`);
        console.log(`   Erros: ${agentStatus.errors || 0}`);
      }
    } else {
      console.log('ℹ️  Nenhum agente executado ainda');
    }

    // Mostra locks ativos
    const locksFile = path.join(process.cwd(), '.agents', '.locks.json');
    try {
      const locksContent = await fs.readFile(locksFile, 'utf8');
      const locks = JSON.parse(locksContent);
      const activeLocks = Object.keys(locks).length;
      if (activeLocks > 0) {
        console.log(`\n🔒 Locks ativos: ${activeLocks}`);
      }
    } catch (error) {
      // Ignora se não existir
    }

    // Mostra fila de tarefas
    const queueFile = path.join(process.cwd(), '.agents', '.queue.json');
    try {
      const queueContent = await fs.readFile(queueFile, 'utf8');
      const queue = JSON.parse(queueContent);
      const pending = queue.tasks?.filter((t: any) => t.status === 'pending').length || 0;
      const inProgress = queue.tasks?.filter((t: any) => t.status === 'in_progress').length || 0;
      const completed = queue.tasks?.filter((t: any) => t.status === 'completed').length || 0;
      
      if (queue.tasks && queue.tasks.length > 0) {
        console.log(`\n📋 Fila de tarefas:`);
        console.log(`   Pendentes: ${pending}`);
        console.log(`   Em progresso: ${inProgress}`);
        console.log(`   Concluídas: ${completed}`);
      }
    } catch (error) {
      // Ignora se não existir
    }

    console.log('');

  } catch (error: any) {
    console.error('❌ Erro ao obter status:', error);
    process.exit(1);
  }
}

main();

