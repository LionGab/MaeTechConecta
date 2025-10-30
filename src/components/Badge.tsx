import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

/**
 * Badge Component - Sistema de Design Bubblegum
 *
 * Tag/Badge para indicar status, categorias ou avisos.
 * Otimizado para público C-D com cores claras e legibilidade alta.
 *
 * @example
 * <Badge variant="info">Novo</Badge>
 *
 * @example
 * <Badge variant="error" size="sm">Urgente</Badge>
 */

export type BadgeVariant = 'info' | 'warning' | 'error' | 'success';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  /** Texto do badge */
  children: React.ReactNode;

  /** Variante visual do badge */
  variant?: BadgeVariant;

  /** Tamanho do badge */
  size?: BadgeSize;

  /** Estilo customizado */
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'md',
  style,
}) => {
  const containerStyle = [
    styles.base,
    styles[`${variant}Container`],
    styles[`${size}Container`],
    style,
  ];

  const textStyle = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
  ];

  return (
    <View
      style={containerStyle}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${variant}: ${children}`}
    >
      <Text style={textStyle}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Base
  base: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },

  baseText: {
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.weights.semibold as any,
    textAlign: 'center',
  },

  // Variantes de Container
  infoContainer: {
    backgroundColor: colors.secondary, // Azul pastel
    borderColor: colors.primary,
  },

  warningContainer: {
    backgroundColor: colors.accent, // Amarelo pastel
    borderColor: '#D4A574', // Tom mais escuro do amarelo
  },

  errorContainer: {
    backgroundColor: '#FFEBEE', // Vermelho muito claro
    borderColor: colors.destructive,
  },

  successContainer: {
    backgroundColor: '#E8F5E9', // Verde muito claro
    borderColor: '#4CAF50', // Verde
  },

  // Variantes de Texto
  infoText: {
    color: colors.primary,
  },

  warningText: {
    color: '#8B5E3C', // Marrom escuro para contraste
  },

  errorText: {
    color: colors.destructive,
  },

  successText: {
    color: '#2E7D32', // Verde escuro
  },

  // Tamanhos de Container
  smContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },

  mdContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  // Tamanhos de Texto
  smText: {
    fontSize: typography.sizes.xs,
  },

  mdText: {
    fontSize: typography.sizes.sm,
  },
});
