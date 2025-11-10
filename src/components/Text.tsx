/**
 * Text Component - Componente de texto com variantes tipográficas
 *
 * Todas as variantes tipográficas do design system
 */

import React, { memo, useMemo } from 'react';
import { StyleSheet, Text as RNText, type StyleProp, TextProps as RNTextProps, TextStyle } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import type { Theme } from '@/theme';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyLarge'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'error'
  | 'success'
  | 'warning';

export interface TextProps extends RNTextProps {
  /** Variante tipográfica */
  variant?: TextVariant;
  /** Cor customizada (override) */
  color?: string;
  /** Estilo customizado */
  style?: StyleProp<TextStyle>;
}

const buildTextStyle = (
  size: number,
  weight: NonNullable<TextStyle['fontWeight']>,
  color: string,
  lineHeightMultiplier: number
): TextStyle => ({
  fontSize: size,
  fontWeight: weight,
  lineHeight: Math.round(size * lineHeightMultiplier),
  color,
});

function getVariantStyles(variant: TextVariant, colors: Theme['colors'], typography: Theme['typography']): TextStyle {
  const { sizes, weights, lineHeight } = typography;
  const textPrimary = colors.textPrimary ?? colors.foreground;
  const textSecondary = colors.textSecondary ?? colors.mutedForeground;

  switch (variant) {
    case 'h1':
      return buildTextStyle(sizes['4xl'], weights.bold, textPrimary, lineHeight.tight);
    case 'h2':
      return buildTextStyle(sizes['3xl'], weights.bold, textPrimary, lineHeight.tight);
    case 'h3':
      return buildTextStyle(sizes['2xl'], weights.semibold, textPrimary, lineHeight.tight);
    case 'bodyLarge':
      return buildTextStyle(sizes.lg, weights.normal, textPrimary, lineHeight.normal);
    case 'body':
      return buildTextStyle(sizes.base, weights.normal, textPrimary, lineHeight.normal);
    case 'bodySmall':
      return buildTextStyle(sizes.sm, weights.normal, textPrimary, lineHeight.normal);
    case 'caption':
      return buildTextStyle(sizes.xs, weights.medium, textSecondary, lineHeight.tight);
    case 'label':
      return buildTextStyle(sizes.sm, weights.medium, textPrimary, lineHeight.normal);
    case 'error':
      return buildTextStyle(sizes.sm, weights.medium, colors.destructive, lineHeight.normal);
    case 'success':
      return buildTextStyle(sizes.sm, weights.medium, colors.success, lineHeight.normal);
    case 'warning':
      return buildTextStyle(sizes.sm, weights.medium, colors.warning, lineHeight.normal);
    default:
      return buildTextStyle(sizes.base, weights.normal, textPrimary, lineHeight.normal);
  }
}

const TextComponent: React.FC<TextProps> = ({ variant = 'body', color, style, children, ...props }) => {
  const { typography, colors } = useTheme();

  const baseStyle = useMemo<TextStyle>(
    () => ({
      fontFamily: typography.fontFamily.sans,
    }),
    [typography.fontFamily.sans]
  );

  const variantStyles = useMemo<TextStyle>(
    () => getVariantStyles(variant, colors, typography),
    [variant, colors, typography]
  );

  const finalStyle = useMemo<TextStyle>(() => {
    const composed: StyleProp<TextStyle> = [baseStyle, variantStyles, color ? { color } : undefined, style];

    const flattened = StyleSheet.flatten(composed);
    return (flattened ?? baseStyle) as TextStyle;
  }, [baseStyle, variantStyles, color, style]);

  return (
    <RNText style={finalStyle} {...props}>
      {children}
    </RNText>
  );
};

export const Text = memo(TextComponent);

// Exportar variantes como componentes separados para conveniência
export const H1: React.FC<Omit<TextProps, 'variant'>> = memo((props) => <Text variant="h1" {...props} />);

export const H2: React.FC<Omit<TextProps, 'variant'>> = memo((props) => <Text variant="h2" {...props} />);

export const H3: React.FC<Omit<TextProps, 'variant'>> = memo((props) => <Text variant="h3" {...props} />);

export const Body: React.FC<Omit<TextProps, 'variant'>> = memo((props) => <Text variant="body" {...props} />);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = memo((props) => <Text variant="caption" {...props} />);
