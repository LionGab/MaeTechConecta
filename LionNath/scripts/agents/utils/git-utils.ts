/**
 * Git Utils - Utilitários para operações Git
 *
 * Funções para commit, status, validação e operações Git
 */

import { execSync } from 'child_process';
import * as path from 'path';

export interface GitStatus {
  branch: string;
  isClean: boolean;
  modifiedFiles: string[];
  untrackedFiles: string[];
}

export interface CommitResult {
  success: boolean;
  commitHash?: string;
  error?: string;
}

export class GitUtils {
  private repoPath: string;

  constructor(repoPath: string = process.cwd()) {
    this.repoPath = repoPath;
  }

  /**
   * Executa comando git
   */
  private execGit(command: string, options: { silent?: boolean } = {}): string {
    try {
      const result = execSync(`git ${command}`, {
        cwd: this.repoPath,
        encoding: 'utf8',
        stdio: options.silent ? 'pipe' : 'inherit',
      });
      return result.toString().trim();
    } catch (error: any) {
      throw new Error(`Git command failed: ${command}\n${error.message}`);
    }
  }

  /**
   * Obtém status do repositório
   */
  getStatus(): GitStatus {
    try {
      const branch = this.execGit('rev-parse --abbrev-ref HEAD', { silent: true });
      const statusOutput = this.execGit('status --porcelain', { silent: true });

      const modifiedFiles: string[] = [];
      const untrackedFiles: string[] = [];

      if (statusOutput) {
        const lines = statusOutput.split('\n');
        for (const line of lines) {
          if (line.startsWith('??')) {
            untrackedFiles.push(line.substring(3).trim());
          } else if (line.match(/^[ MARC]{2}/)) {
            const file = line.substring(3).trim();
            if (file) {
              modifiedFiles.push(file);
            }
          }
        }
      }

      return {
        branch,
        isClean: modifiedFiles.length === 0 && untrackedFiles.length === 0,
        modifiedFiles,
        untrackedFiles,
      };
    } catch (error: any) {
      throw new Error(`Failed to get git status: ${error.message}`);
    }
  }

  /**
   * Adiciona arquivos ao staging
   */
  addFiles(files: string[]): void {
    if (files.length === 0) return;

    for (const file of files) {
      try {
        this.execGit(`add "${file}"`, { silent: true });
      } catch (error) {
        // Ignora erros de arquivos que não existem
      }
    }
  }

  /**
   * Faz commit das mudanças
   */
  commit(message: string, files?: string[]): CommitResult {
    try {
      if (files && files.length > 0) {
        this.addFiles(files);
      } else {
        // Adiciona todas as mudanças
        this.execGit('add -A', { silent: true });
      }

      // Verifica se há algo para commitar
      const status = this.getStatus();
      if (status.isClean && status.modifiedFiles.length === 0) {
        return {
          success: false,
          error: 'No changes to commit',
        };
      }

      this.execGit(`commit -m "${message.replace(/"/g, '\\"')}"`, { silent: true });

      const commitHash = this.execGit('rev-parse HEAD', { silent: true });

      return {
        success: true,
        commitHash,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtém branch atual
   */
  getCurrentBranch(): string {
    return this.execGit('rev-parse --abbrev-ref HEAD', { silent: true });
  }

  /**
   * Verifica se está em uma branch específica
   */
  isOnBranch(branch: string): boolean {
    return this.getCurrentBranch() === branch;
  }

  /**
   * Faz checkout de uma branch
   */
  checkoutBranch(branch: string): void {
    this.execGit(`checkout ${branch}`, { silent: true });
  }

  /**
   * Obtém diff de um arquivo
   */
  getFileDiff(file: string): string {
    try {
      return this.execGit(`diff "${file}"`, { silent: true });
    } catch (error) {
      return '';
    }
  }

  /**
   * Verifica se arquivo foi modificado
   */
  isFileModified(file: string): boolean {
    try {
      const diff = this.getFileDiff(file);
      return diff.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Reverte mudanças em um arquivo
   */
  revertFile(file: string): void {
    this.execGit(`checkout -- "${file}"`, { silent: true });
  }

  /**
   * Reverte todas as mudanças não commitadas
   */
  revertAll(): void {
    this.execGit('checkout -- .', { silent: true });
    this.execGit('clean -fd', { silent: true });
  }
}

// Instância singleton
export const gitUtils = new GitUtils();
