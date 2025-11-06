#!/usr/bin/env tsx

/**
 * Start Agents - Inicia sistema de 8 agentes
 *
 * Executa cada agente imediatamente em uma sessão separada
 */

import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { logger } from './agents/utils/logger';

const agents = ['refactor', 'performance', 'test', 'docs', 'type-safety', 'accessibility', 'security', 'cleanup'];

const processes: Array<{ type: string; process: any; pid: number }> = [];
const pidFile = path.join(process.cwd(), '.agents', '.pids.json');

async function main() {
  try {
    console.log('🚀 Iniciando 8 agentes em sessões separadas...\n');

    // Cria diretório se não existir
    const agentsDir = path.join(process.cwd(), '.agents');
    await fs.mkdir(agentsDir, { recursive: true });

    // Carrega configuração
    const configPath = process.argv[2] || 'scripts/agents/config/agent-config.json';
    const configContent = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configContent);

    // Verifica se sistema está habilitado
    if (!config.enabled) {
      console.log('⚠️  Sistema de agentes está desabilitado na configuração');
      console.log('   Para habilitar, mude "enabled" para true em agent-config.json');
      return;
    }

    // Inicia cada agente em processo separado
    for (let i = 0; i < agents.length; i++) {
      const agentType = agents[i];
      const agentConfig = config.agents[agentType];

      if (!agentConfig || !agentConfig.enabled) {
        console.log(`⏭️  ${agentType}-agent está desabilitado, pulando...`);
        continue;
      }

      console.log(`🤖 Iniciando ${agentType}-agent (${i + 1}/8)...`);

      // Executa agente usando tsx diretamente
      const agentScript = path.join(__dirname, 'agents', 'run-agent-once.ts');
      const childProcess = spawn('tsx', [agentScript, agentType], {
        cwd: process.cwd(),
        stdio: 'inherit',
        shell: true,
      });

      processes.push({
        type: agentType,
        process: childProcess,
        pid: childProcess.pid!,
      });

      childProcess.on('error', (error) => {
        console.error(`❌ Erro ao iniciar ${agentType}-agent:`, error);
      });

      childProcess.on('exit', (code) => {
        console.log(`✅ ${agentType}-agent finalizou com código ${code}`);
      });
    }

    // Salva PIDs
    const pids = processes.map((p) => ({ type: p.type, pid: p.pid }));
    await fs.writeFile(pidFile, JSON.stringify(pids, null, 2), 'utf8');

    console.log(`\n✅ Todos os agentes iniciados!`);
    console.log(`📝 PIDs salvos em ${pidFile}`);
    console.log(`\n⏳ Aguardando conclusão de todos os agentes...\n`);

    // Aguarda todos os processos terminarem
    await Promise.all(
      processes.map(
        ({ process, type }) =>
          new Promise<void>((resolve) => {
            process.on('exit', () => {
              resolve();
            });
          })
      )
    );

    console.log('\n✅ Todos os agentes concluídos!');

    // Gera relatório
    const statusFile = path.join(process.cwd(), '.agents', 'status.json');
    try {
      const statusContent = await fs.readFile(statusFile, 'utf8');
      const status = JSON.parse(statusContent);
      console.log('\n📊 Status Final:');
      console.log(JSON.stringify(status, null, 2));
    } catch (error) {
      // Ignora se não existir
    }
  } catch (error: any) {
    console.error('❌ Erro ao iniciar agentes:', error);
    await logger.error('start-agents', 'Failed to start agents', error);
    process.exit(1);
  }
}

// Handler para parar todos os processos
process.on('SIGINT', async () => {
  console.log('\n🛑 Parando todos os agentes...');
  for (const { process, type } of processes) {
    try {
      process.kill('SIGTERM');
      console.log(`✅ Parado ${type}-agent`);
    } catch (error) {
      console.error(`❌ Erro ao parar ${type}-agent:`, error);
    }
  }

  // Remove arquivo de PIDs
  try {
    await fs.unlink(pidFile);
  } catch (error) {
    // Ignora se não existir
  }

  process.exit(0);
});

main();
