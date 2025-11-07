/**
 * 🛡️ Error Boundary - Tratamento de Erros Premium
 * Component para capturar erros e exibir fallback elegante
 * 
 * Features:
 * - Captura erros de renderização
 * - UI premium de fallback
 * - Logging de erros
 * - Retry automático
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  sereneDawnColors,
  sereneDawnGradients,
  sereneDawnShadows,
  sereneDawnTypography,
  sereneDawnSpacing,
  sereneDawnBorderRadius,
} from '@/theme/sereneDawn';

// =====================================================
// TIPOS
// =====================================================

interface ErrorBoundaryProps {
  /** Children components */
  children: ReactNode;
  
  /** Callback quando ocorre erro */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  
  /** Componente de fallback customizado */
  fallback?: (error: Error, retry: () => void) => ReactNode;
  
  /** Texto do título de erro */
  errorTitle?: string;
  
  /** Texto da mensagem de erro */
  errorMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// =====================================================
// COMPONENTE
// =====================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Atualizar state para exibir fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log do erro
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Callback opcional
    this.props.onError?.(error, errorInfo);
    
    // TODO: Enviar para serviço de monitoring (Sentry, etc)
    // if (__DEV__) {
    //   console.log('Error details:', errorInfo.componentStack);
    // }
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Usar fallback customizado se fornecido
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Fallback padrão premium
      return (
        <View style={styles.container}>
          <LinearGradient
            colors={[
              sereneDawnColors.midnightBlue,
              sereneDawnColors.darkPetrol,
            ]}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.content}>
            {/* Ícone de erro */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={sereneDawnGradients.error}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Icon name="alert-circle" size={48} color={sereneDawnColors.warmWhite} />
              </LinearGradient>
            </View>

            {/* Título */}
            <Text style={styles.title}>
              {this.props.errorTitle || 'Ops! Algo deu errado'}
            </Text>

            {/* Mensagem */}
            <Text style={styles.message}>
              {this.props.errorMessage ||
                'Desculpe, encontramos um problema. Por favor, tente novamente.'}
            </Text>

            {/* Detalhes do erro (apenas em dev) */}
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}

            {/* Botão Retry */}
            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Tentar novamente"
            >
              <LinearGradient
                colors={sereneDawnGradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.retryGradient}
              >
                <Icon name="refresh" size={20} color={sereneDawnColors.midnightBlue} />
                <Text style={styles.retryText}>Tentar Novamente</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: sereneDawnSpacing.xl,
    maxWidth: 400,
  },
  iconContainer: {
    marginBottom: sereneDawnSpacing.xl,
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    ...sereneDawnShadows.dark.xl,
  },
  title: {
    fontSize: sereneDawnTypography.sizes['3xl'],
    fontWeight: sereneDawnTypography.weights.bold,
    color: sereneDawnColors.warmWhite,
    textAlign: 'center',
    marginBottom: sereneDawnSpacing.md,
    fontFamily: sereneDawnTypography.fontFamily.heading,
  },
  message: {
    fontSize: sereneDawnTypography.sizes.base,
    color: sereneDawnColors.slateBlue,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: sereneDawnSpacing.xl,
    fontFamily: sereneDawnTypography.fontFamily.body,
  },
  errorDetails: {
    backgroundColor: sereneDawnColors.darkPetrol,
    padding: sereneDawnSpacing.md,
    borderRadius: sereneDawnBorderRadius.md,
    marginBottom: sereneDawnSpacing.xl,
    maxWidth: '100%',
  },
  errorText: {
    fontSize: sereneDawnTypography.sizes.xs,
    color: sereneDawnColors.error,
    fontFamily: 'monospace',
  },
  retryButton: {
    minWidth: 200,
    borderRadius: sereneDawnBorderRadius.xl,
    overflow: 'hidden',
    ...sereneDawnShadows.dark.lg,
  },
  retryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sereneDawnSpacing.md,
    paddingHorizontal: sereneDawnSpacing.xl,
    gap: sereneDawnSpacing.sm,
    minHeight: 52,
  },
  retryText: {
    fontSize: sereneDawnTypography.sizes.base,
    fontWeight: sereneDawnTypography.weights.semibold,
    color: sereneDawnColors.midnightBlue,
    fontFamily: sereneDawnTypography.fontFamily.heading,
  },
});

export default ErrorBoundary;

