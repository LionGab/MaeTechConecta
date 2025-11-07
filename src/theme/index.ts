/**
 * Tema Unificado - Tokens declarativos para o Design System mobile-first
 */

import type { TextStyle, ViewStyle } from 'react-native';

export { theme as nathTheme, makeStyles, useThemeStyles } from './nathTheme';
export { default as defaultTheme } from './nathTheme';

import {
  light,
  dark,
  colors as baseColors,
  overlay,
  gradients,
  getTheme as getPalette,
  shadows,
  typography as baseTypography,
  spacing as baseSpacing,
  borderRadius as baseBorderRadius,
} from './colors';

type Palette = typeof light;
type ShadowSet = typeof shadows.light;

interface ThemeSemanticColors {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgMuted: string;
  surfacePrimary: string;
  surfaceSecondary: string;
  surfaceTertiary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  textOnSecondary: string;
  textOnAccent: string;
  borderPrimary: string;
  borderMuted: string;
  focusRing: string;
  success: string;
  warning: string;
  info: string;
  danger: string;
  overlaySoft: string;
  overlayStrong: string;
  gradientPrimary: [string, string];
  gradientSecondary: [string, string];
}

export interface ThemeTypographyVariants {
  display: TextStyle;
  headline: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  bodySmall: TextStyle;
  button: TextStyle;
  caption: TextStyle;
  overline: TextStyle;
}

export interface ThemeTypography {
  fontFamily: typeof baseTypography.fontFamily;
  sizes: typeof baseTypography.sizes;
  weights: typeof baseTypography.weights;
  lineHeight: typeof baseTypography.lineHeight;
  variants: ThemeTypographyVariants;
}

export interface ThemeTokens {
  mode: 'light' | 'dark';
  isDark: boolean;
  colors: Palette & ThemeSemanticColors;
  spacing: typeof baseSpacing;
  borderRadius: typeof baseBorderRadius;
  typography: ThemeTypography;
  shadows: ShadowSet;
  overlay: typeof overlay;
  gradients: typeof gradients;
}

function buildSemanticColors(palette: Palette, isDark: boolean): ThemeSemanticColors {
  const success = '#81C784';
  const warning = '#FFB74D';
  const info = '#64B5F6';

  return {
    bgPrimary: palette.background,
    bgSecondary: palette.card,
    bgTertiary: palette.popover,
    bgMuted: palette.muted,
    surfacePrimary: palette.card,
    surfaceSecondary: palette.popover,
    surfaceTertiary: palette.sidebar,
    textPrimary: palette.foreground,
    textSecondary: palette.mutedForeground,
    textMuted: isDark ? '#B8B0A8' : '#6B6660',
    textOnPrimary: palette.primaryForeground,
    textOnSecondary: palette.secondaryForeground,
    textOnAccent: palette.accentForeground,
    borderPrimary: palette.border,
    borderMuted: palette.input,
    focusRing: palette.ring,
    success,
    warning,
    info,
    danger: palette.destructive,
    overlaySoft: overlay.primary,
    overlayStrong: overlay.black,
    gradientPrimary: gradients.pink,
    gradientSecondary: gradients.lavender,
  };
}

function buildTypographyVariants(): ThemeTypographyVariants {
  const { sizes, weights, fontFamily, lineHeight } = baseTypography;
  const lineHeightFor = (size: number, factor: keyof typeof lineHeight = 'relaxed') =>
    Math.round(size * lineHeight[factor]);

  return {
    display: {
      fontSize: sizes['5xl'],
      fontWeight: weights.bold,
      lineHeight: lineHeightFor(sizes['5xl'], 'loose'),
      fontFamily: fontFamily.sans,
    },
    headline: {
      fontSize: sizes['3xl'],
      fontWeight: weights.bold,
      lineHeight: lineHeightFor(sizes['3xl']),
      fontFamily: fontFamily.sans,
    },
    title: {
      fontSize: sizes['2xl'],
      fontWeight: weights.semibold,
      lineHeight: lineHeightFor(sizes['2xl']),
      fontFamily: fontFamily.sans,
    },
    subtitle: {
      fontSize: sizes.xl,
      fontWeight: weights.medium,
      lineHeight: lineHeightFor(sizes.xl),
      fontFamily: fontFamily.sans,
    },
    body: {
      fontSize: sizes.base,
      fontWeight: weights.normal,
      lineHeight: lineHeightFor(sizes.base, 'normal'),
      fontFamily: fontFamily.sans,
    },
    bodySmall: {
      fontSize: sizes.sm,
      fontWeight: weights.normal,
      lineHeight: lineHeightFor(sizes.sm, 'normal'),
      fontFamily: fontFamily.sans,
    },
    button: {
      fontSize: sizes.base,
      fontWeight: weights.semibold,
      lineHeight: lineHeightFor(sizes.base),
      fontFamily: fontFamily.sans,
    },
    caption: {
      fontSize: sizes.xs,
      fontWeight: weights.medium,
      lineHeight: lineHeightFor(sizes.xs, 'tight'),
      fontFamily: fontFamily.sans,
    },
    overline: {
      fontSize: sizes.xs,
      fontWeight: weights.semibold,
      letterSpacing: 1.2,
      lineHeight: lineHeightFor(sizes.xs, 'tight'),
      textTransform: 'uppercase',
      fontFamily: fontFamily.sans,
    },
  };
}

export function createTheme(isDark = false): ThemeTokens {
  const palette = isDark ? dark : light;

  return {
    mode: isDark ? 'dark' : 'light',
    isDark,
    colors: {
      ...palette,
      ...buildSemanticColors(palette, isDark),
    },
    spacing: { ...baseSpacing },
    borderRadius: { ...baseBorderRadius },
    typography: {
      fontFamily: { ...baseTypography.fontFamily },
      sizes: { ...baseTypography.sizes },
      weights: { ...baseTypography.weights },
      lineHeight: { ...baseTypography.lineHeight },
      variants: buildTypographyVariants(),
    },
    shadows: isDark ? { ...shadows.dark } : { ...shadows.light },
    overlay: { ...overlay },
    gradients: { ...gradients },
  };
}

export type Theme = ThemeTokens;
export type ThemeMode = Theme['mode'];
export type ThemeColorToken = keyof Theme['colors'];
export type ThemeSpacingToken = keyof Theme['spacing'];
export type ThemeRadiusToken = keyof Theme['borderRadius'];
export type ThemeShadowToken = keyof Theme['shadows'];
export type ThemeTextVariant = keyof ThemeTypographyVariants;

export const theme = createTheme(false);

export function resolveTheme(isDark: boolean): ThemeTokens {
  return createTheme(isDark);
}

export function getThemeColor(token: ThemeColorToken, isDark = false): string {
  const currentTheme = createTheme(isDark);
  return currentTheme.colors[token];
}

export function getShadow(token: ThemeShadowToken, isDark = false): ViewStyle {
  const currentTheme = createTheme(isDark);
  return currentTheme.shadows[token];
}

export {
  light,
  dark,
  baseColors as colors,
  overlay,
  gradients,
  getPalette as getTheme,
  shadows,
  baseTypography as typography,
  baseSpacing as spacing,
  baseBorderRadius as borderRadius,
};

export default theme;
