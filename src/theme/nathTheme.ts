/**
 * 🎨 DESIGN SYSTEM NATH - TEMA UNIFICADO
 *
 * Paleta Acolhedora Mobile-First
 * Terracota (Rosa), Sage (Verde), Lavanda (Roxo)
 * Light Mode + Dark Mode com suporte completo
 *
 * Design System Unificado para Nossa Maternidade
 */

import { StyleSheet } from 'react-native';

// =====================================================
// 🎨 PALETA DE CORES - LIGHT MODE
// =====================================================

export const light = {
  // Backgrounds - Creme suave
  background: '#FCFAF8',
  foreground: '#1A1A1A',

  // Cards
  card: '#FFFFFF',
  cardForeground: '#1A1A1A',

  // Popover
  popover: '#FFFFFF',
  popoverForeground: '#1A1A1A',

  // Primary - Terracota Maternal (Rosa suave)
  primary: '#E891B5',
  primaryForeground: '#FFFFFF',

  // Secondary - Sage (Verde acolhedor)
  secondary: '#C8E0D4',
  secondaryForeground: '#1A4A3A',

  // Accent - Lavanda (Roxo suave)
  accent: '#E8C4E8',
  accentForeground: '#4A2A4A',

  // Muted
  muted: '#F5F0E8',
  mutedForeground: '#6B6660',

  // Destructive
  destructive: '#E67E7E',
  destructiveForeground: '#FFFFFF',

  // Border
  border: '#E5DCD0',
  input: '#F5F0E8',
  ring: '#E891B5',

  // Sidebar
  sidebar: '#F5F0E8',
  sidebarForeground: '#1A1A1A',
  sidebarPrimary: '#E891B5',
  sidebarPrimaryForeground: '#FFFFFF',
  sidebarAccent: '#E8C4E8',
  sidebarAccentForeground: '#4A2A4A',
  sidebarBorder: '#E5DCD0',
  sidebarRing: '#E891B5',

  // Charts
  chart1: '#E891B5',
  chart2: '#E8C4E8',
  chart3: '#C8E0D4',
  chart4: '#B8D4E8',
  chart5: '#F0D8B8',

  // States
  success: '#2E7D32',
  warning: '#C05621',
  info: '#2563EB',
};

// =====================================================
// 🌙 PALETA DE CORES - DARK MODE
// =====================================================

export const dark = {
  // Backgrounds - Marrom escuro suave
  background: '#1F1C1A',
  foreground: '#F5F0E8',

  // Cards
  card: '#2A2623',
  cardForeground: '#F5F0E8',

  // Popover
  popover: '#2A2623',
  popoverForeground: '#F5F0E8',

  // Primary
  primary: '#F0A8C4',
  primaryForeground: '#1F1C1A',

  // Secondary
  secondary: '#A0C5B4',
  secondaryForeground: '#1F1C1A',

  // Accent
  accent: '#D8B4D8',
  accentForeground: '#1F1C1A',

  // Muted
  muted: '#3A3530',
  mutedForeground: '#B8B0A8',

  // Destructive
  destructive: '#E67E7E',
  destructiveForeground: '#FFFFFF',

  // Border
  border: '#4A4540',
  input: '#3A3530',
  ring: '#F0A8C4',

  // Sidebar
  sidebar: '#2A2623',
  sidebarForeground: '#F5F0E8',
  sidebarPrimary: '#F0A8C4',
  sidebarPrimaryForeground: '#1F1C1A',
  sidebarAccent: '#D8B4D8',
  sidebarAccentForeground: '#1F1C1A',
  sidebarBorder: '#4A4540',
  sidebarRing: '#F0A8C4',

  // Charts
  chart1: '#F0A8C4',
  chart2: '#D8B4D8',
  chart3: '#A0C5B4',
  chart4: '#B8D4E8',
  chart5: '#F0D8B8',

  // States
  success: '#6EE7B7',
  warning: '#F6AD55',
  info: '#93C5FD',
};

// =====================================================
// 🎨 OVERLAYS E TRANSPARÊNCIAS
// =====================================================

export const overlay = {
  primary: 'rgba(232, 145, 181, 0.1)',
  primaryBorder: 'rgba(232, 145, 181, 0.2)',
  primaryBorderLight: 'rgba(232, 145, 181, 0.15)',
  white: 'rgba(255, 255, 255, 0.08)',
  black: 'rgba(0, 0, 0, 0.5)',
};

// =====================================================
// 🌈 GRADIENTES
// =====================================================

export const gradients = {
  blue: ['#3B82F6', '#60A5FA'] as [string, string],
  purple: ['#8B5CF6', '#A78BFA'] as [string, string],
  green: ['#10B981', '#34D399'] as [string, string],
  amber: ['#F59E0B', '#FBBF24'] as [string, string],
  pink: ['#E891B5', '#F0A8C4'] as [string, string],
  sage: ['#C8E0D4', '#A0C5B4'] as [string, string],
  lavender: ['#E8C4E8', '#D8B4D8'] as [string, string],
};

// =====================================================
// 🎨 SOMBRAS - LIGHT MODE
// =====================================================

export const shadowsLight = {
  xs: {
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: 'rgba(0,0,0,0.10)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: 'rgba(0,0,0,0.12)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 12,
  },
};

// =====================================================
// 🌙 SOMBRAS - DARK MODE
// =====================================================

export const shadowsDark = {
  xs: {
    shadowColor: 'rgba(0,0,0,0.30)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: 'rgba(0,0,0,0.40)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: 'rgba(0,0,0,0.50)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: 'rgba(0,0,0,0.60)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: 'rgba(0,0,0,0.70)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 12,
  },
};

export const shadows = { light: shadowsLight, dark: shadowsDark };

// =====================================================
// 📱 TIPOGRAFIA
// =====================================================

export const typography = {
  fontFamily: {
    sans: 'System',
    serif: 'System',
    mono: 'Courier',
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 48,
  },
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
};

// =====================================================
// 📐 ESPAÇAMENTO
// =====================================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  '5xl': 128,
};

// =====================================================
// 🎨 BORDER RADIUS
// =====================================================

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 999,
};

// =====================================================
// 🎯 TEMA CONSOLIDADO
// =====================================================

export const theme = {
  colors: light,
  spacing,
  radius: borderRadius,
  typography: {
    h1: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
    h2: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
    sub: { fontSize: 15, fontWeight: '500' as const, lineHeight: 20, opacity: 0.85 },
  },
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
  },
};

// =====================================================
// 🛠️ UTILITÁRIOS
// =====================================================

export function makeStyles<T>(fn: (t: typeof theme) => T) {
  return StyleSheet.create(fn(theme) as any) as { [K in keyof T]: any };
}

export const useThemeStyles = () => {
  return {
    color: (key: keyof typeof theme.colors) => theme.colors[key],
    space: (size: keyof typeof theme.spacing) => theme.spacing[size],
    radius: (size: keyof typeof theme.radius) => theme.radius[size],
    text: (style: keyof typeof theme.typography) => theme.typography[style],
    shadow: (name: keyof typeof theme.shadow) => theme.shadow[name],
  };
};

// =====================================================
// 🎨 RETORNO DE TEMA
// =====================================================

export function getTheme(isDark: boolean) {
  return isDark ? dark : light;
}

export function createThemeTokens(isDark: boolean) {
  const palette = isDark ? dark : light;
  return {
    mode: isDark ? 'dark' : 'light',
    isDark,
    colors: palette,
    spacing,
    borderRadius,
    typography,
    shadows: isDark ? shadowsDark : shadowsLight,
    overlay,
    gradients,
  };
}

export default theme;

