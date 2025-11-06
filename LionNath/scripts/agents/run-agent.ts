/**
 * Run Agent - Executa um agente específico
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
import { logger } from './utils/logger';
import * as fs from 'fs/promises';
import * as path from 'path';

const agentType = process.argv[2];

if (!agentType) {
  console.error('Usage: tsx scripts/agents/run-agent.ts <agent-type>');
  process.exit(1);
}

async function main() {
  try {
    // Carrega configuração
    const configPath = path.join(process.cwd(), 'scripts/agents/config/agent-config.json');
    const configContent = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configContent);

    const agentConfig = config.agents[agentType];

    if (!agentConfig || !agentConfig.enabled) {
      console.error(`Agent ${agentType} is not enabled or not found`);
      process.exit(1);
    }

    await logger.info(agentType, 'Starting agent...');

    // Cria agente
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

    // Executa agente em loop
    console.log(`Agent ${agentType} started. Running continuously...`);

    while (true) {
      try {
        const result = await agent.run();
        console.log(`[${new Date().toISOString()}] ${agentType} completed: ${result.message}`);

        // Aguarda antes da próxima execução
        const interval = config.schedule?.interval || 1800000; // 30 minutos default
        await new Promise((resolve) => setTimeout(resolve, interval));
      } catch (error: any) {
        await logger.error(agentType, `Error in agent execution: ${error.message}`, error);
        await new Promise((resolve) => setTimeout(resolve, 60000)); // Aguarda 1 minuto em caso de erro
      }
    }
  } catch (error: any) {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
