/**
 * App principal da Nossa Maternidade
 *
 * Configuração inicial e navegação da aplicação
 * Com suporte completo a Dark Mode e otimizações de performance
 */

import React from 'react';
import { ErrorBoundary } from './src/shared/components/ErrorBoundary';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AppNavigator } from './src/navigation';

export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
        // Aqui você pode enviar para serviço de analytics/crash reporting
      }}
    >
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
