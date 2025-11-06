/**
 * Base Agent - Classe base para todos os agentes
 */

import { Agent, AgentResult } from './types';
import { lockManager } from './lock-manager';
import { taskQueue, Task, TaskPriority } from './task-queue';
import { logger } from './utils/logger';
import { gitUtils } from './utils/git-utils';
import { validation } from './utils/validation';
import * as fs from 'fs/promises';
import * as path from 'path';
import { glob as globSync } from 'glob';

export abstract class BaseAgent implements Agent {
  protected name: string;
  protected type: string;
  protected running: boolean = false;
  protected maxFiles: number;
  protected blacklist: string[];

  constructor(name: string, type: string, maxFiles: number = 10, blacklist: string[] = []) {
    this.name = name;
    this.type = type;
    this.maxFiles = maxFiles;
    this.blacklist = blacklist;
  }

  getName(): string {
    return this.name;
  }

  getType(): string {
    return this.type;
  }

  isRunning(): boolean {
    return this.running;
  }

  async stop(): Promise<void> {
    this.running = false;
    await lockManager.releaseAgentLocks(this.name);
    await logger.info(this.name, 'Agent stopped');
  }

  /**
   * Verifica se arquivo está na blacklist
   */
  protected isBlacklisted(filePath: string): boolean {
    return this.blacklist.some((pattern) => filePath.includes(pattern));
  }

  /**
   * Descobre arquivos para processar
   */
  protected abstract discoverFiles(): Promise<string[]>;

  /**
   * Processa um arquivo específico
   */
  protected abstract processFile(filePath: string): Promise<{ modified: boolean; description: string }>;

  /**
   * Executa o agente
   */
  async run(): Promise<AgentResult> {
    this.running = true;
    const result: AgentResult = {
      success: true,
      filesModified: [],
      commitsCreated: 0,
      errors: [],
      message: '',
    };

    try {
      await logger.info(this.name, 'Starting agent execution');

      // Descobre arquivos para processar
      const files = await this.discoverFiles();
      const filesToProcess = files.filter((f) => !this.isBlacklisted(f)).slice(0, this.maxFiles);

      await logger.info(this.name, `Found ${filesToProcess.length} files to process`);

      // Processa cada arquivo
      for (const filePath of filesToProcess) {
        if (!this.running) break;

        try {
          // Tenta adquirir lock
          const lockAcquired = await lockManager.acquireLock(filePath, this.name);
          if (!lockAcquired) {
            await logger.warn(this.name, `Could not acquire lock for ${filePath}`);
            continue;
          }

          try {
            // Processa arquivo
            const processResult = await this.processFile(filePath);

            if (processResult.modified) {
              result.filesModified.push(filePath);

              // Valida mudanças
              const validationResult = await validation.validateAll({
                lint: true,
                typeCheck: true,
                tests: false, // Não roda testes a cada arquivo
                format: true,
              });

              if (validationResult.success) {
                // Faz commit
                const commitMessage = `chore(agents): ${this.name} - ${processResult.description}`;
                const commitResult = gitUtils.commit(commitMessage, [filePath]);

                if (commitResult.success) {
                  result.commitsCreated++;
                  await logger.success(this.name, `Committed changes to ${filePath}`);
                } else {
                  await logger.error(this.name, `Failed to commit ${filePath}: ${commitResult.error}`);
                  result.errors.push(`Commit failed for ${filePath}: ${commitResult.error}`);
                  // Reverte mudanças se commit falhou
                  gitUtils.revertFile(filePath);
                }
              } else {
                await logger.warn(this.name, `Validation failed for ${filePath}, reverting changes`);
                result.errors.push(`Validation failed for ${filePath}`);
                gitUtils.revertFile(filePath);
              }
            }
          } finally {
            // Libera lock
            await lockManager.releaseLock(filePath, this.name);
          }
        } catch (error: any) {
          await logger.error(this.name, `Error processing ${filePath}`, error);
          result.errors.push(`Error processing ${filePath}: ${error.message}`);
          result.success = false;
        }
      }

      result.message = `Processed ${filesToProcess.length} files, modified ${result.filesModified.length}, created ${result.commitsCreated} commits`;
      await logger.success(this.name, result.message);
    } catch (error: any) {
      await logger.error(this.name, 'Agent execution failed', error);
      result.success = false;
      result.errors.push(error.message);
    } finally {
      this.running = false;
    }

    return result;
  }

  /**
   * Lê conteúdo de arquivo
   */
  protected async readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf8');
  }

  /**
   * Escreve conteúdo em arquivo
   */
  protected async writeFile(filePath: string, content: string): Promise<void> {
    await fs.writeFile(filePath, content, 'utf8');
  }

  /**
   * Verifica se arquivo existe
   */
  protected async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
