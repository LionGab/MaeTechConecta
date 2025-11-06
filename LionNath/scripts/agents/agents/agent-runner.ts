/**
 * Agent Runner - Executa um agente específico
 */

import { Orchestrator } from '../orchestrator';
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

const agentType = process.env.AGENT_TYPE || process.argv[2];

if (!agentType) {
  console.error('Usage: tsx agent-runner.ts <agent-type>');
  process.exit(1);
}

async function main() {
  const orchestrator = new Orchestrator();
  
  // Carrega configuração
  const configPath = path.join(__dirname, '..', 'config', 'agent-config.json');
  await orchestrator.loadConfig(configPath);
  
  // Inicializa sistema
  await orchestrator.initialize();
  
  // Cria e registra agente
  let agent;
  const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  const agentConfig = config.agents[agentType];
  
  if (!agentConfig || !agentConfig.enabled) {
    console.error(`Agent ${agentType} is not enabled or not found`);
    process.exit(1);
  }
  
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
  
  // Executa agente em loop
  console.log(`[${agentType}-agent] Starting...`);
  await logger.info(`${agentType}-agent`, 'Agent started');
  
  const interval = config.schedule?.interval || 1800000;
  
  while (true) {
    try {
      const result = await agent.run();
      console.log(`[${agentType}-agent] Completed: ${result.message}`);
      await orchestrator.updateStatus(agentType, result);
      
      console.log(`[${agentType}-agent] Waiting ${interval / 1000 / 60} minutes...`);
      await new Promise(resolve => setTimeout(resolve, interval));
    } catch (error: any) {
      console.error(`[${agentType}-agent] Error:`, error);
      await logger.error(`${agentType}-agent`, 'Execution error', error);
      await new Promise(resolve => setTimeout(resolve, 60000)); // Aguarda 1 minuto em caso de erro
    }
  }
}

main().catch(console.error);

