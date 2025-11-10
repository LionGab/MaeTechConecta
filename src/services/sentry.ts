/**
 * Sentry Configuration
 * Error tracking e performance monitoring
 * Opcional: funciona mesmo se @sentry/react-native não estiver instalado
 */

import Constants from 'expo-constants';

// Interface para Sentry (quando não instalado)
interface SentryType {
  init: (config: {
    dsn: string;
    debug?: boolean;
    tracesSampleRate?: number;
    environment?: string;
    enableNative?: boolean;
    enableNativeNagger?: boolean;
    beforeSend?: (event: any, hint: any) => any;
  }) => void;
  captureException: (error: Error, options?: any) => void;
  captureMessage: (message: string, options?: any) => void;
  setUser: (user: any) => void;
  setContext: (name: string, context: any) => void;
  addBreadcrumb: (breadcrumb: any) => void;
}

// Importação opcional do Sentry
let Sentry: SentryType | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Sentry = require('@sentry/react-native') as SentryType;
} catch (error) {
  // Sentry não instalado - continuar sem error tracking
  console.warn('@sentry/react-native não encontrado. Error tracking desabilitado.');
}

let isInitialized = false;

function resolveSentryDsn(): string {
  const extra = Constants.expoConfig?.extra;
  if (extra && typeof extra === 'object') {
    const sentryExtra = 'sentry' in extra ? extra.sentry : undefined;
    if (sentryExtra && typeof sentryExtra === 'object' && sentryExtra !== null && 'dsn' in sentryExtra) {
      const { dsn } = sentryExtra as { dsn?: unknown };
      if (typeof dsn === 'string' && dsn.trim().length > 0) {
        return dsn;
      }
    }
  }

  const expoPublicDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (expoPublicDsn && expoPublicDsn.trim().length > 0) {
    return expoPublicDsn;
  }

  const genericDsn = process.env.SENTRY_DSN;
  if (genericDsn && genericDsn.trim().length > 0) {
    return genericDsn;
  }

  return '';
}

export function initSentry() {
  if (isInitialized) {
    return;
  }

  // Se Sentry não estiver instalado, não fazer nada
  if (!Sentry) {
    console.warn('Sentry não disponível. Error tracking desabilitado.');
    return;
  }

  const dsn = resolveSentryDsn();

  if (!dsn) {
    console.warn('Sentry DSN não configurado. Error tracking desabilitado.');
    return;
  }

  Sentry.init({
    dsn,
    debug: false,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development',
    enableNative: true,
    enableNativeNagger: false,
    beforeSend(event: any, hint: any) {
      // Filtrar erros sensíveis ou não importantes
      if (event.exception) {
        const error = hint.originalException;
        if (error && typeof error === 'object' && 'message' in error) {
          const message = (error as Error).message;
          // Não enviar erros de rede esperados
          if (message.includes('Network request failed')) {
            return null;
          }
        }
      }
      return event;
    },
  });

  isInitialized = true;
  console.log('Sentry inicializado com sucesso');
}

// Exportar Sentry ou objeto vazio se não estiver disponível
export default Sentry ||
  ({
    init: () => {},
    captureException: () => {},
    captureMessage: () => {},
    setUser: () => {},
    setContext: () => {},
    addBreadcrumb: () => {},
  } as SentryType);
