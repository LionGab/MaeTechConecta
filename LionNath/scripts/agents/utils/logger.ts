/**
 * Logger - Sistema de logs rotativo diário
 *
 * Gerencia logs dos agentes com rotação diária e níveis de log
 */

import * as fs from 'fs/promises';
import * as path from 'path';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

interface LogEntry {
  timestamp: string;
  agent: string;
  level: LogLevel;
  message: string;
}

export class Logger {
  private logDir: string;
  private currentLogFile: string;

  constructor(logDir: string = '.agents/logs') {
    this.logDir = logDir;
    this.currentLogFile = this.getLogFileName();
  }

  /**
   * Gera nome do arquivo de log baseado na data
   */
  private getLogFileName(): string {
    const today = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `${today}.log`);
  }

  /**
   * Garante que o diretório de logs existe
   */
  private async ensureLogDir(): Promise<void> {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
    } catch (error) {
      // Diretório já existe ou erro de permissão
    }
  }

  /**
   * Formata entrada de log
   */
  private formatLog(agent: string, level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${agent}] [${level}] ${message}\n`;
  }

  /**
   * Escreve log no arquivo
   */
  private async writeLog(agent: string, level: LogLevel, message: string): Promise<void> {
    await this.ensureLogDir();

    // Verifica se precisa rotacionar (novo dia)
    const newLogFile = this.getLogFileName();
    if (newLogFile !== this.currentLogFile) {
      this.currentLogFile = newLogFile;
    }

    const logEntry = this.formatLog(agent, level, message);

    try {
      await fs.appendFile(this.currentLogFile, logEntry, 'utf8');
    } catch (error) {
      console.error(`Erro ao escrever log: ${error}`);
    }
  }

  /**
   * Log de informação
   */
  async info(agent: string, message: string): Promise<void> {
    console.log(`[INFO] [${agent}] ${message}`);
    await this.writeLog(agent, LogLevel.INFO, message);
  }

  /**
   * Log de aviso
   */
  async warn(agent: string, message: string): Promise<void> {
    console.warn(`[WARN] [${agent}] ${message}`);
    await this.writeLog(agent, LogLevel.WARN, message);
  }

  /**
   * Log de erro
   */
  async error(agent: string, message: string, error?: Error): Promise<void> {
    const errorMessage = error ? `${message}: ${error.message}\n${error.stack}` : message;
    console.error(`[ERROR] [${agent}] ${errorMessage}`);
    await this.writeLog(agent, LogLevel.ERROR, errorMessage);
  }

  /**
   * Log de sucesso
   */
  async success(agent: string, message: string): Promise<void> {
    console.log(`[SUCCESS] [${agent}] ${message}`);
    await this.writeLog(agent, LogLevel.SUCCESS, message);
  }

  /**
   * Lê logs do dia atual
   */
  async readTodayLogs(): Promise<string[]> {
    try {
      const content = await fs.readFile(this.currentLogFile, 'utf8');
      return content.split('\n').filter((line) => line.trim());
    } catch (error) {
      return [];
    }
  }

  /**
   * Lê logs de uma data específica
   */
  async readLogs(date: string): Promise<string[]> {
    const logFile = path.join(this.logDir, `${date}.log`);
    try {
      const content = await fs.readFile(logFile, 'utf8');
      return content.split('\n').filter((line) => line.trim());
    } catch (error) {
      return [];
    }
  }
}

// Instância singleton
export const logger = new Logger();
