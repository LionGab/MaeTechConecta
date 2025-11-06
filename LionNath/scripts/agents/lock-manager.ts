/**
 * Lock Manager - Sistema de locks por arquivo
 *
 * Gerencia locks para evitar edição simultânea do mesmo arquivo
 */

import * as fs from 'fs/promises';
import * as path from 'path';

export interface FileLock {
  agent: string;
  timestamp: number;
  timeout: number; // em segundos
}

export interface LocksData {
  [filePath: string]: FileLock;
}

export class LockManager {
  private locksFile: string;
  private defaultTimeout: number = 1800; // 30 minutos

  constructor(locksFile: string = '.agents/.locks.json') {
    this.locksFile = locksFile;
  }

  /**
   * Garante que o diretório de locks existe
   */
  private async ensureLocksDir(): Promise<void> {
    const dir = path.dirname(this.locksFile);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      // Diretório já existe
    }
  }

  /**
   * Carrega locks do arquivo
   */
  private async loadLocks(): Promise<LocksData> {
    try {
      await this.ensureLocksDir();
      const content = await fs.readFile(this.locksFile, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      // Arquivo não existe, retorna objeto vazio
      return {};
    }
  }

  /**
   * Salva locks no arquivo
   */
  private async saveLocks(locks: LocksData): Promise<void> {
    await this.ensureLocksDir();
    await fs.writeFile(this.locksFile, JSON.stringify(locks, null, 2), 'utf8');
  }

  /**
   * Limpa locks expirados
   */
  private cleanExpiredLocks(locks: LocksData): LocksData {
    const now = Math.floor(Date.now() / 1000);
    const cleaned: LocksData = {};

    for (const [filePath, lock] of Object.entries(locks)) {
      const expiresAt = lock.timestamp + lock.timeout;
      if (expiresAt > now) {
        cleaned[filePath] = lock;
      }
    }

    return cleaned;
  }

  /**
   * Tenta adquirir lock para um arquivo
   */
  async acquireLock(filePath: string, agent: string, timeout?: number): Promise<boolean> {
    const locks = await this.loadLocks();
    const cleanedLocks = this.cleanExpiredLocks(locks);

    // Verifica se arquivo já está locked
    if (cleanedLocks[filePath]) {
      const existingLock = cleanedLocks[filePath];
      // Permite re-lock pelo mesmo agente
      if (existingLock.agent !== agent) {
        return false;
      }
    }

    // Adquire lock
    cleanedLocks[filePath] = {
      agent,
      timestamp: Math.floor(Date.now() / 1000),
      timeout: timeout || this.defaultTimeout,
    };

    await this.saveLocks(cleanedLocks);
    return true;
  }

  /**
   * Libera lock de um arquivo
   */
  async releaseLock(filePath: string, agent: string): Promise<void> {
    const locks = await this.loadLocks();

    if (locks[filePath] && locks[filePath].agent === agent) {
      delete locks[filePath];
      await this.saveLocks(locks);
    }
  }

  /**
   * Libera todos os locks de um agente
   */
  async releaseAgentLocks(agent: string): Promise<void> {
    const locks = await this.loadLocks();
    const cleaned: LocksData = {};

    for (const [filePath, lock] of Object.entries(locks)) {
      if (lock.agent !== agent) {
        cleaned[filePath] = lock;
      }
    }

    await this.saveLocks(cleaned);
  }

  /**
   * Verifica se arquivo está locked
   */
  async isLocked(filePath: string): Promise<boolean> {
    const locks = await this.loadLocks();
    const cleanedLocks = this.cleanExpiredLocks(locks);
    return !!cleanedLocks[filePath];
  }

  /**
   * Obtém agente que tem lock do arquivo
   */
  async getLockOwner(filePath: string): Promise<string | null> {
    const locks = await this.loadLocks();
    const cleanedLocks = this.cleanExpiredLocks(locks);
    return cleanedLocks[filePath]?.agent || null;
  }

  /**
   * Limpa todos os locks expirados
   */
  async cleanExpired(): Promise<number> {
    const locks = await this.loadLocks();
    const cleaned = this.cleanExpiredLocks(locks);
    const removed = Object.keys(locks).length - Object.keys(cleaned).length;

    if (removed > 0) {
      await this.saveLocks(cleaned);
    }

    return removed;
  }

  /**
   * Obtém todos os locks ativos
   */
  async getActiveLocks(): Promise<LocksData> {
    const locks = await this.loadLocks();
    return this.cleanExpiredLocks(locks);
  }
}

// Instância singleton
export const lockManager = new LockManager();
