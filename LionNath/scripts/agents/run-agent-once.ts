#!/usr/bin/env tsx

/**
 * Run Agent Once - Executa um agente uma única vez
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
  console.error('Usage: tsx run-agent-once.ts <agent-type>');
  process.exit(1);
}

async function main() {
  try {
    const orchestrator = new Orchestrator();

    // Carrega configuração
    const configPath = 'scripts/agents/config/agent-config.json';
    await orchestrator.loadConfig(configPath);

    // Inicializa sistema
    await orchestrator.initialize();

    // Carrega configuração para obter parâmetros
    const configContent = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configContent);
    const agentConfig = config.agents[agentType];

    if (!agentConfig || !agentConfig.enabled) {
      console.error(`Agent ${agentType} is not enabled or not found`);
      process.exit(1);
    }

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

    await orchestrator.registerAgent(agent);

    // Executa agente uma única vez
    console.log(`🤖 Executando ${agentType}-agent...`);

    const result = await agent.run();

    console.log(`✅ ${agentType}-agent concluído:`);
    console.log(`   ${result.message}`);
    console.log(`   Arquivos modificados: ${result.filesModified.length}`);
    console.log(`   Commits criados: ${result.commitsCreated}`);
    if (result.errors.length > 0) {
      console.log(`   Erros: ${result.errors.length}`);
      result.errors.forEach((error) => console.log(`     - ${error}`));
    }

    // Atualiza status no orchestrator
    await orchestrator.updateStatus(agentType, result);
  } catch (error: any) {
    console.error(`❌ Erro ao executar ${agentType}-agent:`, error);
    await logger.error(agentType, 'Agent execution error', error);
    process.exit(1);
  }
}

main();
