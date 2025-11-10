/**
 * Sentry Configuration
 * Error tracking e performance monitoring
 */

import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

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

