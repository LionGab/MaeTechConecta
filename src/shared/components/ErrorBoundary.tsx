/**
 * ErrorBoundary - Sistema de Design Bubblegum
 *
 * Captura erros React e exibe UI de fallback acolhedora
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme/colors';
import { Button } from '../../components';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>💔</Text>
          <Text style={styles.title}>Ops! Algo deu errado</Text>
          <Text style={styles.message}>
            Desculpa pelo inconveniente. Tente novamente em instantes.
          </Text>
          <Button
            variant="primary"
            onPress={this.handleReset}
            accessibilityLabel="Tentar novamente"
            style={styles.button}
          >
            Tentar Novamente
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.foreground,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontFamily: typography.fontFamily.sans,
  },
  message: {
    fontSize: typography.sizes.base,
    color: colors.mutedForeground,
    marginBottom: spacing.xl,
    textAlign: 'center',
    fontFamily: typography.fontFamily.sans,
  },
  button: {
    marginTop: spacing.md,
  },
});
