/**
 * 🌅 Card Glass - Tema "Amanhecer Sereno"
 * Card com efeito glassmorphism premium
 *
 * Features:
 * - Efeito vidro fosco (blur)
 * - Gradientes sutis
 * - Sombras profundas
 * - Bordas com glow dourado
 * - Animações suaves
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  sereneDawnColors,
  sereneDawnOverlay,
  sereneDawnShadows,
  sereneDawnTypography,
  sereneDawnSpacing,
  sereneDawnBorderRadius,
} from '@/theme/sereneDawn';
import { getShadowStyle } from '@/utils/platformStyles';

// =====================================================
// TIPOS
// =====================================================

export type CardGlassVariant = 'default' | 'elevated' | 'outlined' | 'glow';

export interface CardGlassProps {
  /** Conteúdo do card */
  children: React.ReactNode;

  /** Título (opcional) */
  title?: string;

  /** Subtítulo (opcional) */
  subtitle?: string;

  /** Ícone (MaterialCommunityIcons) */
  icon?: string;

  /** Cor do ícone */
  iconColor?: string;

  /** Variante visual */
  variant?: CardGlassVariant;

  /** Função de toque (torna clicável) */
  onPress?: () => void;

  /** Estilo customizado do container */
  style?: ViewStyle;

  /** Estilo customizado do título */
  titleStyle?: TextStyle;

  /** Estilo customizado do conteúdo */
  contentStyle?: ViewStyle;

  /** Label de acessibilidade */
  accessibilityLabel?: string;

  /** Hint de acessibilidade */
  accessibilityHint?: string;

  /** Padding customizado */
  padding?: keyof typeof sereneDawnSpacing;

  /** Usar blur nativo (pode ter problemas de performance) */
  useNativeBlur?: boolean;
}

// =====================================================
// COMPONENTE
// =====================================================

const CardGlassComponent: React.FC<CardGlassProps> = ({
  children,
  title,
  subtitle,
  icon,
  iconColor = sereneDawnColors.champagne,
  variant = 'default',
  onPress,
  style,
  titleStyle,
  contentStyle,
  accessibilityLabel,
  accessibilityHint,
  padding = 'lg',
  useNativeBlur = false,
}) => {
  // Memoizar estilos do container
  const containerStyle = useMemo(
    () => [styles.base, styles[variant], { padding: sereneDawnSpacing[padding] }, style],
    [variant, padding, style]
  );

  // Memoizar props de acessibilidade
  const touchableProps: Partial<TouchableOpacityProps> = useMemo(
    () =>
      onPress
        ? {
            onPress,
            accessible: true,
            accessibilityRole: 'button',
            accessibilityLabel: accessibilityLabel || title || 'Card',
            accessibilityHint: accessibilityHint,
            activeOpacity: 0.8,
          }
        : {},
    [onPress, accessibilityLabel, title, accessibilityHint]
  );

  // Renderizar conteúdo interno
  const renderContent = () => (
    <>
      {/* Background Gradient com efeito glass */}
      {useNativeBlur ? (
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: sereneDawnOverlay.glass }]} />
      )}

      <LinearGradient
        colors={[sereneDawnOverlay.white, 'rgba(127, 176, 218, 0.08)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Header com título e ícone */}
      {(title || icon) && (
        <View style={styles.header}>
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
              <Icon name={icon} size={24} color={iconColor} />
            </View>
          )}
          <View style={styles.headerText}>
            {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
      )}

      {/* Conteúdo */}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </>
  );

  // Renderizar como TouchableOpacity ou View
  if (onPress) {
    return (
      <TouchableOpacity style={containerStyle} {...touchableProps}>
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{renderContent()}</View>;
};

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  base: {
    borderRadius: sereneDawnBorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: sereneDawnOverlay.primaryBorder,
  },

  // Variantes
  default: {
    ...getShadowStyle({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    }),
  },
  elevated: {
    ...getShadowStyle({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
    }),
  },
  outlined: {
    borderWidth: 2,
    borderColor: sereneDawnOverlay.primaryBorderLight,
  },
  glow: {
    ...getShadowStyle({
      shadowColor: sereneDawnColors.champagne,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.44,
      shadowRadius: 16,
      elevation: 16,
    }),
    borderWidth: 1,
    borderColor: sereneDawnOverlay.goldBorder,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sereneDawnSpacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: sereneDawnSpacing.md,
    borderWidth: 1,
    borderColor: sereneDawnOverlay.goldBorder,
    ...getShadowStyle({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    }),
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: sereneDawnTypography.sizes.lg,
    fontWeight: sereneDawnTypography.weights.semibold,
    color: sereneDawnColors.warmWhite,
    fontFamily: sereneDawnTypography.fontFamily.heading,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: sereneDawnTypography.sizes.sm,
    color: sereneDawnColors.slateBlue,
    marginTop: sereneDawnSpacing.xs,
    fontFamily: sereneDawnTypography.fontFamily.body,
  },

  // Conteúdo
  content: {
    // Estilos customizados via contentStyle prop
  },
});

// Memoizar componente
export const CardGlass = React.memo(CardGlassComponent);
