/**
 * Sentry Wrapper - Edge Functions
 * 
 * Wrapper para error tracking em Edge Functions
 */

interface SentryOptions {
  dsn?: string;
  environment?: string;
  release?: string;
}

/**
 * Inicializa Sentry (se disponível)
 */
export function initSentry(options: SentryOptions = {}) {
  // Em Edge Functions, Sentry pode ser configurado via env vars
  // ou usando @sentry/deno se disponível
  const dsn = options.dsn || Deno.env.get('SENTRY_DSN');
  
  if (!dsn) {
    console.warn('Sentry DSN não configurado');
    return;
  }

  // TODO: Implementar inicialização do Sentry para Deno
  // Por enquanto, apenas log
  console.log('Sentry inicializado para Edge Functions');
}

/**
 * Captura erro no Sentry
 */
export function captureException(error: Error, context?: Record<string, unknown>) {
  console.error('Error capturado:', error, context);
  
  // TODO: Enviar para Sentry
  // Por enquanto, apenas log
}

/**
 * Captura mensagem no Sentry
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  console.log(`[${level.toUpperCase()}] ${message}`);
  
  // TODO: Enviar para Sentry
  // Por enquanto, apenas log
}

/**
 * Wrapper para Edge Functions com Sentry
 */
export function withSentry(
  handler: (req: Request) => Promise<Response>,
  options: SentryOptions = {}
) {
  return async (req: Request): Promise<Response> => {
    try {
      // Inicializar Sentry se ainda não foi
      initSentry(options);
      
      // Executar handler
      return await handler(req);
    } catch (error) {
      // Capturar erro no Sentry
      captureException(error as Error, {
        url: req.url,
        method: req.method,
        headers: Object.fromEntries(req.headers.entries()),
      });
      
      // Retornar erro genérico (sem expor detalhes)
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: 'An error occurred processing your request',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}

