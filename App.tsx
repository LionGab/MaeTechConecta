/**
 * App principal da Nossa Maternidade
 *
 * Configuração inicial e navegação da aplicação
 * Com suporte completo a Dark Mode e otimizações de performance
 */

import React, { useEffect } from 'react';
import { ErrorBoundary } from './src/shared/components/ErrorBoundary';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AppNavigator } from './src/navigation/index';
import { initSentry } from './src/services/sentry';

export default function App() {
  useEffect(() => {
    // Inicializar Sentry em produção
    if (process.env.NODE_ENV === 'production') {
      initSentry();
    }
  }, []);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
        // Sentry capturará automaticamente se inicializado
      }}
    >
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
