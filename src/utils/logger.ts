/**
 * Sistema de logging robusto e estruturado
 * Part of Agent 8 (Security & Compliance) + Agent 7 (Performance)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Níveis de log - usando objeto ao invés de enum conforme .cursorrules
 */
export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  CRITICAL: 4,
} as const;

export type LogLevelValue = (typeof LogLevel)[keyof typeof LogLevel];

export interface LogEntry {
  timestamp: string;
  level: LogLevelValue;
  message: string;
  context?: Record<string, any>;
  error?: any;
  user_id?: string;
}

class Logger {
  private minLevel: LogLevelValue;
  private userId?: string;

  constructor(minLevel: LogLevelValue = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private shouldLog(level: LogLevelValue): boolean {
    return level >= this.minLevel;
  }

  private getLevelName(level: LogLevelValue): string {
    const levelNames: Record<LogLevelValue, string> = {
      [LogLevel.DEBUG]: 'DEBUG',
      [LogLevel.INFO]: 'INFO',
      [LogLevel.WARN]: 'WARN',
      [LogLevel.ERROR]: 'ERROR',
      [LogLevel.CRITICAL]: 'CRITICAL',
    };
    return levelNames[level] || 'UNKNOWN';
  }

  private formatMessage(level: LogLevelValue, message: string, context?: Record<string, any>, error?: any): string {
    const prefix = `[${this.getLevelName(level)}] ${new Date().toISOString()}`;
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    const errorStr = error ? ` | Error: ${error.message || String(error)}` : '';

    return `${prefix} | ${message}${contextStr}${errorStr}`;
  }

  private log(level: LogLevelValue, message: string, context?: Record<string, any>, error?: any) {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context, error);

    // Console output com cores (desenvolvimento)
    if (__DEV__) {
      if (level === LogLevel.DEBUG) {
        console.log(`🔍 ${formattedMessage}`);
      } else if (level === LogLevel.INFO) {
        console.info(`ℹ️ ${formattedMessage}`);
      } else if (level === LogLevel.WARN) {
        console.warn(`⚠️ ${formattedMessage}`);
      } else if (level === LogLevel.ERROR) {
        console.error(`❌ ${formattedMessage}`);
      } else if (level === LogLevel.CRITICAL) {
        console.error(`🚨🚨 ${formattedMessage}`);
      }
    }

    // Em produção: enviar para serviço de logging
    // Integrar com Sentry para erros críticos
    if (level >= LogLevel.ERROR && !__DEV__) {
      try {
        const Sentry = require('@sentry/react-native').default;
        if (Sentry && Sentry.captureException) {
          if (error) {
            Sentry.captureException(error, {
              tags: {
                logLevel: this.getLevelName(level),
                component: context?.component || 'unknown',
              },
              extra: {
                message,
                context,
                userId: this.userId,
              },
            });
          } else {
            Sentry.captureMessage(message, {
              level: level === LogLevel.ERROR ? 'error' : level === LogLevel.CRITICAL ? 'fatal' : 'warning',
              tags: {
                logLevel: this.getLevelName(level),
                component: context?.component || 'unknown',
              },
              extra: {
                context,
                userId: this.userId,
              },
            });
          }
        }
      } catch (sentryError) {
        // Silenciosamente falhar se Sentry não estiver disponível
        console.error('Erro ao enviar para Sentry:', sentryError);
      }
    }

    // Se for erro crítico, salvar localmente para debug
    if (level >= LogLevel.ERROR) {
      this.saveCriticalLog(message, context, error);
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>, error?: any) {
    this.log(LogLevel.WARN, message, context, error);
  }

  error(message: string, context?: Record<string, any>, error?: any) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  critical(message: string, context?: Record<string, any>, error?: any) {
    this.log(LogLevel.CRITICAL, message, context, error);
  }

  /**
   * Salva logs críticos localmente para debug offline
   */
  private async saveCriticalLog(message: string, context?: Record<string, any>, error?: any) {
    try {
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: LogLevel.ERROR,
        message,
        context,
        error: error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : undefined,
        user_id: this.userId,
      };

      // Obter logs existentes
      const existingLogsJson = await AsyncStorage.getItem('critical_logs');
      const existingLogs: LogEntry[] = existingLogsJson ? JSON.parse(existingLogsJson) : [];

      // Adicionar novo log
      existingLogs.push(logEntry);

      // Manter apenas últimos 50 logs
      if (existingLogs.length > 50) {
        existingLogs.shift();
      }

      // Salvar
      await AsyncStorage.setItem('critical_logs', JSON.stringify(existingLogs));
    } catch (e) {
      // Silenciosamente falhar se não conseguir salvar
      console.error('Erro ao salvar log crítico:', e);
    }
  }

  /**
   * Recupera logs críticos salvos
   */
  async getCriticalLogs(): Promise<LogEntry[]> {
    try {
      const logsJson = await AsyncStorage.getItem('critical_logs');
      return logsJson ? JSON.parse(logsJson) : [];
    } catch {
      return [];
    }
  }

  /**
   * Limpa logs antigos
   */
  async clearCriticalLogs() {
    try {
      await AsyncStorage.removeItem('critical_logs');
    } catch {
      // Silenciosamente falhar
    }
  }
}

// Singleton instance
export const logger = new Logger(__DEV__ ? LogLevel.DEBUG : LogLevel.INFO);

