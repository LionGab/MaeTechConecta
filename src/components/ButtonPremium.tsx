/**
 * 🌅 Button Premium - Tema "Amanhecer Sereno"
 * Botão com gradiente, sombras premium e micro-interações
 *
 * Features:
 * - Gradientes suaves com toque dourado
 * - Haptic feedback
 * - Animações ao pressionar
 * - Sombras profundas
 * - Área de toque otimizada (52-60px)
 */

import React, { useCallback, useMemo, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
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
import { getShadowStyle } from '@/utils/platformStyles';

// Haptics opcional - tipado corretamente
interface HapticsType {
  impactAsync: (style: number) => Promise<void>;
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
  // Ignorar se não disponível
}

// =====================================================
// TIPOS
// =====================================================

export type ButtonPremiumVariant = 'primary' | 'primaryGold' | 'secondary' | 'outline' | 'ghost';
export type ButtonPremiumSize = 'sm' | 'md' | 'lg';

export interface ButtonPremiumProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Texto do botão */
  children: React.ReactNode;

  /** Variante visual */
  variant?: ButtonPremiumVariant;

  /** Tamanho do botão */
  size?: ButtonPremiumSize;

  /** Ícone (MaterialCommunityIcons) */
  icon?: string;

  /** Posição do ícone */
  iconPosition?: 'left' | 'right';

  /** Estado de carregamento */
  loading?: boolean;

  /** Desabilitado */
  disabled?: boolean;

  /** Largura total */
  fullWidth?: boolean;

  /** Estilo customizado do container */
  style?: ViewStyle;

  /** Estilo customizado do texto */
  textStyle?: TextStyle;

  /** Cor customizada do gradiente (sobrescreve variante) */
  gradientColors?: [string, string];

  /** Label de acessibilidade (obrigatório) */
  accessibilityLabel: string;

  /** Hint de acessibilidade */
  accessibilityHint?: string;
}

// =====================================================
// COMPONENTE
// =====================================================

const ButtonPremiumComponent: React.FC<ButtonPremiumProps> = ({
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
  gradientColors,
  accessibilityLabel,
  accessibilityHint,
  ...touchableProps
}) => {
  // Animação de escala ao pressionar
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Memoizar cores do gradiente
  const gradient = useMemo(() => {
    if (gradientColors) return gradientColors;
    switch (variant) {
      case 'primary':
        return sereneDawnGradients.primary;
      case 'primaryGold':
        return sereneDawnGradients.primaryWithGold;
      case 'secondary':
        return [sereneDawnColors.slateBlue, sereneDawnColors.sereneSky];
      case 'outline':
      case 'ghost':
        return ['transparent', 'transparent'];
      default:
        return sereneDawnGradients.primary;
    }
  }, [variant, gradientColors]);

  // Memoizar cores do texto e ícone
  const contentColor = useMemo(() => {
    if (disabled) return sereneDawnColors.slateBlue;
    switch (variant) {
      case 'primary':
      case 'primaryGold':
        return sereneDawnColors.midnightBlue;
      case 'secondary':
        return sereneDawnColors.warmWhite;
      case 'outline':
      case 'ghost':
        return sereneDawnColors.babyBlue;
      default:
        return sereneDawnColors.warmWhite;
    }
  }, [variant, disabled]);

  // Memoizar tamanho do ícone
  const iconSize = useMemo(() => {
    switch (size) {
      case 'sm':
        return 18;
      case 'md':
        return 20;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  }, [size]);

  // Memoizar estilos
  const containerStyle = useMemo(
    () => [
      styles.base,
      styles[`${size}Container`],
      fullWidth && styles.fullWidth,
      (disabled || loading) && styles.disabled,
      variant === 'outline' && styles.outlineContainer,
      style,
    ],
    [size, fullWidth, disabled, loading, variant, style]
  );

  const contentTextStyle = useMemo(
    () => [styles.baseText, styles[`${size}Text`], { color: contentColor }, textStyle],
    [size, contentColor, textStyle]
  );

  // Callbacks
  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  }, [scaleAnim]);

  const handlePress = useCallback(
    (event: Parameters<NonNullable<TouchableOpacityProps['onPress']>>[0]) => {
      // Haptic feedback
      try {
        if (Haptics?.impactAsync) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle?.Light ?? 1);
        }
      } catch (e) {
        // Ignorar
      }

      if (touchableProps.onPress) {
        touchableProps.onPress(event);
      }
    },
    [touchableProps.onPress]
  );

  return (
    <Animated.View style={[fullWidth && styles.fullWidthWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={containerStyle}
        disabled={disabled || loading}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: disabled || loading }}
        activeOpacity={0.9}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...touchableProps}
      >
        {/* Gradiente */}
        {variant !== 'ghost' && (
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Conteúdo */}
        {loading ? (
          <ActivityIndicator color={contentColor} size="small" />
        ) : (
          <View style={styles.content}>
            {icon && iconPosition === 'left' && (
              <Icon name={icon} size={iconSize} color={contentColor} style={styles.iconLeft} />
            )}

            <Text style={contentTextStyle}>{children}</Text>

            {icon && iconPosition === 'right' && (
              <Icon name={icon} size={iconSize} color={contentColor} style={styles.iconRight} />
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: sereneDawnBorderRadius.xl,
    overflow: 'hidden',
    minHeight: 52, // Touch target melhorado
    minWidth: 52,
  },
  baseText: {
    fontFamily: sereneDawnTypography.fontFamily.heading,
    fontWeight: sereneDawnTypography.weights.semibold,
    textAlign: 'center',
    letterSpacing: 0.5,
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

  // Tamanhos de Container
  smContainer: {
    paddingHorizontal: sereneDawnSpacing.md,
    paddingVertical: sereneDawnSpacing.sm,
    minHeight: 44,
    ...sereneDawnShadows.light.sm,
  },
  mdContainer: {
    paddingHorizontal: sereneDawnSpacing.lg,
    paddingVertical: sereneDawnSpacing.md,
    minHeight: 52,
    ...sereneDawnShadows.light.md,
  },
  lgContainer: {
    paddingHorizontal: sereneDawnSpacing.xl,
    paddingVertical: sereneDawnSpacing.lg,
    minHeight: 60,
    ...sereneDawnShadows.light.lg,
  },

  // Tamanhos de Texto
  smText: {
    fontSize: sereneDawnTypography.sizes.sm,
  },
  mdText: {
    fontSize: sereneDawnTypography.sizes.base,
  },
  lgText: {
    fontSize: sereneDawnTypography.sizes.lg,
  },

  // Variantes especiais
  outlineContainer: {
    borderWidth: 2,
    borderColor: sereneDawnColors.babyBlue,
  },

  // Estados
  disabled: {
    opacity: 0.5,
    ...sereneDawnShadows.light.xs,
  },

  // Ícones
  iconLeft: {
    marginRight: sereneDawnSpacing.sm,
  },
  iconRight: {
    marginLeft: sereneDawnSpacing.sm,
  },
});

// Memoizar componente
export const ButtonPremium = React.memo(ButtonPremiumComponent);
