/**
 * Sentry Configuration
 * Error tracking e performance monitoring
 */

import * as Sentry from '@sentry/react-native';

let isInitialized = false;

export function initSentry() {
  if (isInitialized) {
    return;
  }

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    console.warn('Sentry DSN não configurado. Error tracking desabilitado.');
    return;
  }

  Sentry.init({
    dsn,
    enableInExpoDevelopment: false,
    debug: false,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development',
    beforeSend(event, hint) {
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

export default Sentry;
