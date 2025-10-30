import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Card Component - Sistema de Design Bubblegum
 *
 * Container de conteúdo com bordas arredondadas e sombra.
 * Otimizado para público C-D com hierarquia visual clara.
 *
 * @example
 * <Card title="Dica do Dia" variant="elevated">
 *   <Text>Conteúdo aqui</Text>
 * </Card>
 *
 * @example
 * <Card
 *   title="Prioridade"
 *   icon="star"
 *   onPress={handlePress}
 *   accessibilityLabel="Ver detalhes da prioridade"
 * >
 *   <Text>Minha tarefa importante</Text>
 * </Card>
 */

export type CardVariant = 'elevated' | 'outlined' | 'flat';

export interface CardProps {
  /** Conteúdo do card */
  children: React.ReactNode;

  /** Título do card (opcional) */
  title?: string;

  /** Subtítulo/descrição (opcional) */
  subtitle?: string;

  /** Ícone do MaterialCommunityIcons (opcional) */
  icon?: string;

  /** Cor do ícone (padrão: primary) */
  iconColor?: string;

  /** Variante visual do card */
  variant?: CardVariant;

  /** Função de toque (torna o card clicável) */
  onPress?: () => void;

  /** Estilo customizado do container */
  style?: ViewStyle;

  /** Estilo customizado do título */
  titleStyle?: TextStyle;

  /** Estilo customizado do conteúdo */
  contentStyle?: ViewStyle;

  /** Label de acessibilidade (obrigatório se onPress presente) */
  accessibilityLabel?: string;

  /** Hint de acessibilidade */
  accessibilityHint?: string;

  /** Padding customizado (sobrescreve padrão) */
  padding?: keyof typeof spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  iconColor = colors.primary,
  variant = 'elevated',
  onPress,
  style,
  titleStyle,
  contentStyle,
  accessibilityLabel,
  accessibilityHint,
  padding = 'lg',
}) => {
  const containerStyle = [
    styles.base,
    styles[variant],
    { padding: spacing[padding] },
    style,
  ];

  const CardContainer = onPress ? TouchableOpacity : View;

  const touchableProps: Partial<TouchableOpacityProps> = onPress
    ? {
        onPress,
        accessible: true,
        accessibilityRole: 'button',
        accessibilityLabel: accessibilityLabel || title || 'Card',
        accessibilityHint: accessibilityHint,
        activeOpacity: 0.7,
      }
    : {};

  return (
    <CardContainer style={containerStyle} {...touchableProps}>
      {/* Header com título e ícone */}
      {(title || icon) && (
        <View style={styles.header}>
          {icon && (
            <Icon
              name={icon}
              size={24}
              color={iconColor}
              style={styles.headerIcon}
            />
          )}
          <View style={styles.headerText}>
            {title && (
              <Text style={[styles.title, titleStyle]}>{title}</Text>
            )}
            {subtitle && (
              <Text style={styles.subtitle}>{subtitle}</Text>
            )}
          </View>
        </View>
      )}

      {/* Conteúdo */}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },

  // Variantes
  elevated: {
    ...shadows.light.md,
  },

  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },

  flat: {
    // Sem sombra nem borda
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  headerIcon: {
    marginRight: spacing.sm,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold as any,
    color: colors.foreground,
    fontFamily: typography.fontFamily.sans,
  },

  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.mutedForeground,
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.sans,
  },

  // Conteúdo
  content: {
    // Estilos customizados podem ser aplicados via contentStyle prop
  },
});
