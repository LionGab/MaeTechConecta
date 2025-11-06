/**
 * Run Agent TS - Executa um agente específico (TypeScript)
 */

import { Orchestrator } from './orchestrator';
import { RefactorAgent } from './agents/refactor-agent';
import { CleanupAgent } from './agents/cleanup-agent';
import { PerformanceAgent } from './agents/performance-agent';
import { TestAgent } from './agents/test-agent';
import { DocsAgent } from './agents/docs-agent';
import { TypeSafetyAgent } from './agents/type-safety-agent';
import { AccessibilityAgent } from './agents/accessibility-agent';
import { SecurityAgent } from './agents/security-agent';
import * as fs from 'fs/promises';
import * as path from 'path';

const agentType = process.argv[2];

if (!agentType) {
  console.error('Usage: tsx run-agent-ts.ts <agent-type>');
  process.exit(1);
}

async function main() {
  const orchestrator = new Orchestrator();
  const configPath = path.join(__dirname, 'config', 'agent-config.json');

  try {
    // Carrega configuração
    await orchestrator.loadConfig(configPath);

    // Inicializa sistema
    await orchestrator.initialize();

    // Cria e registra agente
    const configContent = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configContent);
    const agentConfig = config.agents[agentType];

    if (!agentConfig || !agentConfig.enabled) {
      console.error(`Agent ${agentType} is not enabled or not found`);
      process.exit(1);
    }

    let agent;

    switch (agentType) {
      case 'refactor':
        agent = new RefactorAgent(agentConfig.maxFiles, config.blacklist);
        break;
      case 'cleanup':
        agent = new CleanupAgent(agentConfig.maxFiles, config.blacklist);
        break;
      case 'performance':
        agent = new PerformanceAgent(agentConfig.maxFiles, config.blacklist);
        break;
      case 'test':
        agent = new TestAgent(agentConfig.maxFiles, config.blacklist);
        break;
      case 'docs':
        agent = new DocsAgent(agentConfig.maxFiles, config.blacklist);
        break;
      case 'type-safety':
        agent = new TypeSafetyAgent(agentConfig.maxFiles, config.blacklist);
        break;
      case 'accessibility':
        agent = new AccessibilityAgent(agentConfig.maxFiles, config.blacklist);
        break;
      case 'security':
        agent = new SecurityAgent(agentConfig.maxFiles, config.blacklist);
        break;
      default:
        console.error(`Unknown agent type: ${agentType}`);
        process.exit(1);
    }

    await orchestrator.registerAgent(agent);

    console.log(`Starting ${agentType}-agent in continuous mode...`);
    console.log(`Max files per run: ${agentConfig.maxFiles}`);
    console.log(`Interval: ${config.schedule.interval / 1000 / 60} minutes`);
    console.log('');

    // Executa agente em loop contínuo
    let runCount = 0;

    while (true) {
      try {
        runCount++;
        console.log(`[Run #${runCount}] Starting execution...`);

        const result = await agent.run();

        console.log(`[Run #${runCount}] Completed:`);
        console.log(`  - Files modified: ${result.filesModified.length}`);
        console.log(`  - Commits created: ${result.commitsCreated}`);
        console.log(`  - Errors: ${result.errors.length}`);
        console.log(`  - Message: ${result.message}`);
        console.log('');

        // Atualiza status
        await orchestrator.updateStatus(agentType, result);

        // Aguarda antes da próxima execução
        const interval = config.schedule.interval || 1800000; // 30 minutos padrão
        console.log(`Waiting ${interval / 1000 / 60} minutes until next run...`);
        console.log('');

        await new Promise((resolve) => setTimeout(resolve, interval));
      } catch (error: any) {
        console.error(`[Run #${runCount}] Error:`, error.message);
        console.error(error.stack);
        console.log('Waiting 1 minute before retry...');
        console.log('');
        await new Promise((resolve) => setTimeout(resolve, 60000)); // 1 minuto em caso de erro
      }
    }
  } catch (error: any) {
    console.error('Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main().catch(console.error);
