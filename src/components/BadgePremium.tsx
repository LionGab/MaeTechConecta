/**
 * 🌅 Badge Premium - Tema "Amanhecer Sereno"
 * Badge com gradientes e efeito glow
 *
 * Features:
 * - Gradientes por variante
 * - Efeito glow opcional
 * - Animações sutis
 * - Ícones premium
 *
 * @example
 * // Badge dourado com glow
 * <BadgePremium variant="gold" glow icon="crown">
 *   Premium
 * </BadgePremium>
 *
 * @example
 * // Badge de status
 * <BadgePremium variant="success" icon="check">
 *   Verificado
 * </BadgePremium>
 */

import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
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

// =====================================================
// TIPOS
// =====================================================

export type BadgePremiumVariant = 'primary' | 'gold' | 'success' | 'warning' | 'error' | 'info';
export type BadgePremiumSize = 'sm' | 'md' | 'lg';

export interface BadgePremiumProps {
  /** Texto do badge */
  children: React.ReactNode;

  /** Variante visual */
  variant?: BadgePremiumVariant;

  /** Tamanho */
  size?: BadgePremiumSize;

  /** Ícone (MaterialCommunityIcons) */
  icon?: string;

  /** Efeito glow (brilho) */
  glow?: boolean;

  /** Estilo customizado */
  style?: ViewStyle;
}

// =====================================================
// COMPONENTE
// =====================================================

const BadgePremiumComponent: React.FC<BadgePremiumProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  glow = false,
  style,
}) => {
  // Memoizar cores do gradiente
  const gradientColors = useMemo(() => {
    switch (variant) {
      case 'primary':
        return sereneDawnGradients.primary;
      case 'gold':
        return sereneDawnGradients.primaryWithGold;
      case 'success':
        return sereneDawnGradients.success;
      case 'warning':
        return sereneDawnGradients.warning;
      case 'error':
        return sereneDawnGradients.error;
      case 'info':
        return sereneDawnGradients.info;
      default:
        return sereneDawnGradients.primary;
    }
  }, [variant]);

  // Memoizar tamanho do ícone
  const iconSize = useMemo(() => {
    switch (size) {
      case 'sm':
        return 12;
      case 'md':
        return 14;
      case 'lg':
        return 16;
      default:
        return 14;
    }
  }, [size]);

  // Memoizar estilos
  const containerStyle = useMemo(
    () => [
      styles.base,
      styles[`${size}Container`],
      glow && styles.glow,
      glow &&
        getShadowStyle({
          shadowColor: gradientColors[0],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 8,
        }),
      style,
    ],
    [size, glow, gradientColors, style]
  );

  const textStyle = useMemo(() => [styles.baseText, styles[`${size}Text`]], [size]);

  return (
    <View style={containerStyle}>
      <LinearGradient
        colors={gradientColors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {icon && <Icon name={icon} size={iconSize} color={sereneDawnColors.warmWhite} style={styles.icon} />}
        <Text style={textStyle}>{children}</Text>
      </View>
    </View>
  );
};

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  base: {
    borderRadius: sereneDawnBorderRadius.full,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    ...getShadowStyle({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sereneDawnSpacing.xs,
  },
  baseText: {
    fontFamily: sereneDawnTypography.fontFamily.heading,
    fontWeight: sereneDawnTypography.weights.semibold,
    color: sereneDawnColors.warmWhite,
  },

  // Tamanhos de Container
  smContainer: {
    paddingHorizontal: sereneDawnSpacing.sm,
    paddingVertical: 4,
  },
  mdContainer: {
    paddingHorizontal: sereneDawnSpacing.md,
    paddingVertical: sereneDawnSpacing.xs,
  },
  lgContainer: {
    paddingHorizontal: sereneDawnSpacing.md,
    paddingVertical: sereneDawnSpacing.sm,
  },

  // Tamanhos de Texto
  smText: {
    fontSize: sereneDawnTypography.sizes.xs,
  },
  mdText: {
    fontSize: sereneDawnTypography.sizes.sm,
  },
  lgText: {
    fontSize: sereneDawnTypography.sizes.base,
  },

  // Glow effect (aplicado dinamicamente via useMemo no componente)
  glow: {},

  icon: {
    // Espaçamento tratado no content gap
  },
});

// Memoizar componente
export const BadgePremium = React.memo(BadgePremiumComponent);
