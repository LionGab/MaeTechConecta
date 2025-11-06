/**
 * Orchestrator - Orquestrador principal dos agentes
 */

import { Agent, AgentConfig } from './types';
import { logger } from './utils/logger';
import { lockManager } from './lock-manager';
import { taskQueue } from './task-queue';
import { gitUtils } from './utils/git-utils';
import * as fs from 'fs/promises';
import * as path from 'path';

export class Orchestrator {
  private agents: Map<string, Agent> = new Map();
  private config: AgentConfig | null = null;
  private running: boolean = false;
  private statusFile: string = '.agents/status.json';

  /**
   * Carrega configuração
   */
  async loadConfig(configPath: string = 'scripts/agents/config/agent-config.json'): Promise<void> {
    try {
      const content = await fs.readFile(configPath, 'utf8');
      this.config = JSON.parse(content);
      await logger.info('orchestrator', 'Configuration loaded');
    } catch (error: any) {
      throw new Error(`Failed to load config: ${error.message}`);
    }
  }

  /**
   * Registra um agente
   */
  async registerAgent(agent: Agent): Promise<void> {
    this.agents.set(agent.getType(), agent);
    await logger.info('orchestrator', `Registered agent: ${agent.getName()}`);
  }

  /**
   * Inicializa sistema
   */
  async initialize(): Promise<void> {
    await logger.info('orchestrator', 'Initializing system');

    // Limpa locks expirados
    const cleaned = await lockManager.cleanExpired();
    if (cleaned > 0) {
      await logger.info('orchestrator', `Cleaned ${cleaned} expired locks`);
    }

    // Limpa tarefas antigas
    const removed = await taskQueue.cleanOldTasks();
    if (removed > 0) {
      await logger.info('orchestrator', `Removed ${removed} old tasks`);
    }

    // Verifica branch
    if (this.config) {
      const currentBranch = gitUtils.getCurrentBranch();
      if (currentBranch !== this.config.branch) {
        await logger.warn('orchestrator', `Current branch is ${currentBranch}, expected ${this.config.branch}`);
      }
    }

    await logger.success('orchestrator', 'System initialized');
  }

  /**
   * Executa todos os agentes
   */
  async runAll(): Promise<void> {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }

    this.running = true;
    await logger.info('orchestrator', 'Starting all agents');

    const agentPromises: Promise<void>[] = [];

    for (const [type, agentConfig] of Object.entries(this.config.agents)) {
      if (!agentConfig.enabled) {
        await logger.info('orchestrator', `Agent ${type} is disabled, skipping`);
        continue;
      }

      const agent = this.agents.get(type);
      if (!agent) {
        await logger.warn('orchestrator', `Agent ${type} not found`);
        continue;
      }

      // Executa agente em paralelo
      const promise = agent.run().then(async (result) => {
        await this.updateStatus(type, result);
      });

      agentPromises.push(promise);
    }

    // Aguarda todos os agentes
    await Promise.allSettled(agentPromises);

    await logger.success('orchestrator', 'All agents completed');
    this.running = false;
  }

  /**
   * Para todos os agentes
   */
  async stopAll(): Promise<void> {
    this.running = false;
    await logger.info('orchestrator', 'Stopping all agents');

    const stopPromises: Promise<void>[] = [];
    for (const agent of this.agents.values()) {
      stopPromises.push(agent.stop());
    }

    await Promise.all(stopPromises);
    await logger.success('orchestrator', 'All agents stopped');
  }

  /**
   * Atualiza status
   */
  async updateStatus(agentType: string, result: any): Promise<void> {
    try {
      const status = await this.getStatus();
      status.agents[agentType] = {
        lastRun: new Date().toISOString(),
        success: result.success,
        filesModified: result.filesModified.length,
        commitsCreated: result.commitsCreated,
        errors: result.errors.length,
      };
      status.lastUpdate = new Date().toISOString();
      await this.saveStatus(status);
    } catch (error) {
      // Ignora erros de status
    }
  }

  /**
   * Obtém status atual
   */
  async getStatus(): Promise<any> {
    try {
      const content = await fs.readFile(this.statusFile, 'utf8');
      return JSON.parse(content);
    } catch {
      return {
        running: this.running,
        agents: {},
        lastUpdate: new Date().toISOString(),
      };
    }
  }

  /**
   * Salva status
   */
  private async saveStatus(status: any): Promise<void> {
    const dir = path.dirname(this.statusFile);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.statusFile, JSON.stringify(status, null, 2), 'utf8');
  }

  /**
   * Verifica se está rodando
   */
  isRunning(): boolean {
    return this.running;
  }
}
