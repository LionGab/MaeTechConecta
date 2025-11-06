/**
 * Run Agent Loop - Loop de execução para um agente
 */

import { BaseAgent } from '../base-agent';
import { RefactorAgent } from './refactor-agent';
import { CleanupAgent } from './cleanup-agent';
import { PerformanceAgent } from './performance-agent';
import { TestAgent } from './test-agent';
import { DocsAgent } from './docs-agent';
import { TypeSafetyAgent } from './type-safety-agent';
import { AccessibilityAgent } from './accessibility-agent';
import { SecurityAgent } from './security-agent';
import { logger } from '../utils/logger';
import * as fs from 'fs/promises';
import * as path from 'path';

const agentType = process.argv[2];

if (!agentType) {
  console.error('Usage: tsx run-agent-loop.ts <agent-type>');
  process.exit(1);
}

async function main() {
  // Carrega configuração
  const configPath = path.join(__dirname, '..', 'config', 'agent-config.json');
  const configContent = await fs.readFile(configPath, 'utf8');
  const config = JSON.parse(configContent);

  const agentConfig = config.agents[agentType];

  if (!agentConfig || !agentConfig.enabled) {
    console.error(`Agent ${agentType} is not enabled or not found`);
    process.exit(1);
  }

  // Cria agente
  let agent: BaseAgent;

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

  await logger.info(agent.getName(), 'Agent started');

  // Loop de execução
  let runCount = 0;
  const maxRuns = 100; // Limite de execuções

  while (runCount < maxRuns) {
    try {
      const result = await agent.run();
      runCount++;

      if (result.success) {
        await logger.success(agent.getName(), `Run ${runCount} completed: ${result.message}`);
      } else {
        await logger.warn(agent.getName(), `Run ${runCount} completed with errors: ${result.errors.join(', ')}`);
      }

      // Aguarda antes da próxima execução
      const interval = config.schedule?.interval || 1800000; // 30 minutos padrão
      await new Promise((resolve) => setTimeout(resolve, interval));
    } catch (error: any) {
      await logger.error(agent.getName(), `Run ${runCount} failed`, error);
      await new Promise((resolve) => setTimeout(resolve, 60000)); // Aguarda 1 minuto em caso de erro
    }
  }

  await logger.info(agent.getName(), 'Agent stopped (max runs reached)');
}

main().catch(async (error) => {
  console.error('Fatal error:', error);
  await logger.error('run-agent-loop', 'Fatal error', error);
  process.exit(1);
});
