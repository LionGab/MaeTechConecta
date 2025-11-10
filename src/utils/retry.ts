/**
 * Sistema robusto de retry com backoff exponencial
 * Part of Agent 7 (Performance) + Agent 8 (Security) collaboration
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: any) => void;
}

interface Logger {
  error: (message: string, error?: any) => void;
  warn: (message: string, error?: any) => void;
  info: (message: string) => void;
}

/**
 * Retry function com backoff exponencial
 *
 * @param fn - Função async para retry
 * @param options - Opções de configuração
 * @returns Resultado da função ou erro após todos retries
 *
 * @example
 * const result = await retryWithBackoff(
 *   () => apiCall(),
 *   { maxRetries: 3, initialDelay: 1000 }
 * );
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
  logger: Logger | null = null
): Promise<T> {
  const { maxRetries = 3, initialDelay = 1000, maxDelay = 10000, backoffMultiplier = 2, onRetry } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();

      if (attempt > 0) {
        logger?.info(`Retry bem-sucedido após ${attempt} tentativa(s)`);
      }

      return result;
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = Math.min(initialDelay * Math.pow(backoffMultiplier, attempt), maxDelay);

        logger?.warn(`Tentativa ${attempt + 1}/${maxRetries + 1} falhou. Retry em ${delay}ms`, error);

        if (onRetry) {
          onRetry(attempt + 1, error);
        }

        await sleep(delay);
      } else {
        logger?.error(`Todas as ${maxRetries + 1} tentativas falharam`, error);
      }
    }
  }

  throw lastError;
}

/**
 * Sleep helper function
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Verifica se o erro é recuperável (network error, timeout)
 */
export function isRecoverableError(error: any): boolean {
  if (!error) return false;

  // Network errors
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network')) {
    return true;
  }

  // Timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return true;
  }

  // HTTP 5xx errors (server errors)
  if (error.response?.status >= 500 && error.response?.status < 600) {
    return true;
  }

  return false;
}

/**
 * Retry inteligente que só tenta novamente para erros recuperáveis
 */
export async function smartRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
  logger: Logger | null = null
): Promise<T> {
  try {
    return await retryWithBackoff(fn, options, logger);
  } catch (error) {
    // Se não for erro recuperável, falha imediatamente
    if (!isRecoverableError(error)) {
      logger?.error('Erro não-recuperável detectado, sem retry', error);
      throw error;
    }

    // Última tentativa manual se for recuperável
    logger?.info('Tentando recuperação adicional...');
    try {
      return await fn();
    } catch (finalError) {
      logger?.error('Recuperação falhou', finalError);
      throw finalError;
    }
  }
}
