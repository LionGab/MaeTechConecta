import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';

// Haptics é opcional - só funciona se expo-haptics estiver instalado
interface HapticsType {
  impactAsync: (style: number) => void;
  ImpactFeedbackStyle: {
    Light: number;
    Medium: number;
    Heavy: number;
  };
}

let Haptics: HapticsType | null = null;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  // expo-haptics não disponível, ignorar
}

/**
 * Button Component - Sistema de Design Bubblegum
 *
 * Componente de botão acessível e responsivo para o público C-D.
 * Implementa WCAG 2.1 AA com área de toque mínima de 44x44px.
 *
 * @example
 * <Button variant="primary" onPress={handleSubmit}>
 *   Enviar
 * </Button>
 *
 * @example
 * <Button variant="outline" icon="chat" loading={isLoading}>
 *   Conversar
 * </Button>
 */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Texto do botão */
  children: React.ReactNode;

  /** Variante visual do botão */
  variant?: ButtonVariant;

  /** Tamanho do botão */
  size?: ButtonSize;

  /** Ícone do MaterialCommunityIcons (opcional) */
  icon?: string;

  /** Posição do ícone */
  iconPosition?: 'left' | 'right';

  /** Estado de carregamento */
  loading?: boolean;

  /** Botão desabilitado */
  disabled?: boolean;

  /** Largura total (100%) */
  fullWidth?: boolean;

  /** Estilo customizado do container */
  style?: ViewStyle;

  /** Estilo customizado do texto */
  textStyle?: TextStyle;

  /** Label de acessibilidade (obrigatório para UX) */
  accessibilityLabel: string;

  /** Hint de acessibilidade (recomendado) */
  accessibilityHint?: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  ...touchableProps
}) => {
  const { colors, spacing, borderRadius, typography, theme } = useTheme();

  const styles = useMemo(
    () => createStyles({ colors, spacing, borderRadius, typography, shadows: theme.shadows }),
    [borderRadius, colors, spacing, theme.shadows, typography]
  );

  // Memoizar valores calculados
  const iconColor = useMemo(
    () => getIconColor({ variant, disabled: disabled || loading, colors }),
    [colors, disabled, loading, variant]
  );
  const iconSize = useMemo(() => getIconSize(size), [size]);

  // Memoizar estilos do container
  const containerStyle = useMemo(
    () => [
      styles.base,
      styles[`${variant}Container`],
      styles[`${size}Container`],
      fullWidth && styles.fullWidth,
      (disabled || loading) && styles.disabledContainer,
      style,
    ],
    [variant, size, fullWidth, disabled, loading, style]
  );

  // Memoizar estilos do texto
  const textStyleCombined = useMemo(
    () => [
      styles.baseText,
      styles[`${variant}Text`],
      styles[`${size}Text`],
      (disabled || loading) && styles.disabledText,
      textStyle,
    ],
    [variant, size, disabled, loading, textStyle]
  );

  // Memoizar estilo do wrapper
  const wrapperStyle = useMemo(
    () => (fullWidth ? styles.fullWidthWrapper : undefined),
    [fullWidth, styles.fullWidthWrapper]
  );

  // Callback para handlePress com haptic feedback
  const handlePress = useCallback(
    (event: Parameters<NonNullable<TouchableOpacityProps['onPress']>>[0]) => {
      // Haptic feedback (opcional - só se expo-haptics estiver disponível)
      try {
        if (Haptics?.impactAsync) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle?.Light ?? 1);
        }
      } catch (e) {
        // expo-haptics não disponível, ignorar
      }

      if (touchableProps.onPress) {
        touchableProps.onPress(event);
      }
    },
    [touchableProps.onPress]
  );

  return (
    <View style={wrapperStyle}>
      <TouchableOpacity
        style={containerStyle}
        disabled={disabled || loading}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: disabled || loading }}
        activeOpacity={0.85}
        onPress={handlePress}
        {...touchableProps}
      >
        {loading ? (
          <ActivityIndicator color={iconColor} size="small" />
        ) : (
          <View style={styles.content}>
            {icon && iconPosition === 'left' && (
              <Icon name={icon} size={iconSize} color={iconColor} style={styles.iconLeft} />
            )}

            <Text style={textStyleCombined}>{children}</Text>

            {icon && iconPosition === 'right' && (
              <Icon name={icon} size={iconSize} color={iconColor} style={styles.iconRight} />
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Helpers para cores e tamanhos
interface IconColorParams {
  variant: ButtonVariant;
  disabled: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
}

function getIconColor({ variant, disabled, colors }: IconColorParams): string {
  if (disabled) return colors.textMuted;

  if (variant === 'primary' || variant === 'destructive') return colors.textOnPrimary;
  if (variant === 'secondary') return colors.textPrimary;
  if (variant === 'outline' || variant === 'ghost') return colors.textPrimary;

  return colors.textPrimary;
}

function getIconSize(size: ButtonSize): number {
  switch (size) {
    case 'sm':
      return 16;
    case 'md':
      return 20;
    case 'lg':
      return 24;
    default:
      return 20;
  }
}

interface StyleParams {
  colors: ReturnType<typeof useTheme>['colors'];
  spacing: ReturnType<typeof useTheme>['spacing'];
  borderRadius: ReturnType<typeof useTheme>['borderRadius'];
  typography: ReturnType<typeof useTheme>['typography'];
  shadows: ReturnType<typeof useTheme>['theme']['shadows'];
}

function createStyles({ colors, spacing, borderRadius, typography, shadows }: StyleParams) {
  return StyleSheet.create({
    // Base
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.lg,
      // Área de toque mínima WCAG: 44x44px
      minHeight: 44,
      minWidth: 44,
    },

    baseText: {
      fontFamily: typography.fontFamily.sans,
      fontWeight: typography.weights.semibold,
      textAlign: 'center',
    },

    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    fullWidth: {
      width: '100%',
    },

    fullWidthWrapper: {
      width: '100%',
    },

    // Variantes de Container
    primaryContainer: {
      backgroundColor: colors.primary,
      ...shadows.md,
    },

    secondaryContainer: {
      backgroundColor: colors.secondary,
      ...shadows.sm,
    },

    outlineContainer: {
      backgroundColor: colors.surfaceSecondary,
      borderWidth: 2,
      borderColor: colors.primary,
    },

    ghostContainer: {
      backgroundColor: colors.overlaySoft,
    },

    destructiveContainer: {
      backgroundColor: colors.destructive,
      ...shadows.md,
    },

    disabledContainer: {
      backgroundColor: colors.bgMuted,
      opacity: 0.65,
      ...shadows.xs, // Sombra reduzida
    },

    // Variantes de Texto
    primaryText: {
      color: colors.textOnPrimary,
    },

    secondaryText: {
      color: colors.textPrimary,
    },

    outlineText: {
      color: colors.textPrimary,
    },

    ghostText: {
      color: colors.textPrimary,
    },

    destructiveText: {
      color: colors.textOnPrimary,
    },

    disabledText: {
      color: colors.textMuted,
    },

    // Tamanhos de Container
    smContainer: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },

    mdContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },

    lgContainer: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
    },

    // Tamanhos de Texto
    smText: {
      fontSize: typography.sizes.sm,
    },

    mdText: {
      fontSize: typography.sizes.base,
    },

    lgText: {
      fontSize: typography.sizes.lg,
    },

    // Ícones
    iconLeft: {
      marginRight: spacing.sm,
    },

    iconRight: {
      marginLeft: spacing.sm,
    },
  });
}

// Memoizar componente para evitar re-renders desnecessários
export const Button = React.memo(ButtonComponent);

