/**
 * Tema Bubblegum - Cores convertidas para React Native
 * Fonte: https://tweakcn.com/r/themes/bubblegum.json
 *
 * OKLCH para RGB convertido
 * Light mode + Dark mode
 */

// Cores Light Mode (padrão)
export const light = {
  // Backgrounds
  background: '#F0E7F0',
  foreground: '#121212',
  // Cards
  card: '#F2F1E8',
  cardForeground: '#121212',
  // Popover
  popover: '#FFFFFF',
  popoverForeground: '#121212',
  // Primary (destaque principal - rosa)
  primary: '#DD5B9A',
  primaryForeground: '#FFFFFF',
  // Secondary (azul)
  secondary: '#B8D8E8',
  secondaryForeground: '#1A1A1A',
  // Muted (cinza neutro)
  muted: '#E1E5EC',
  mutedForeground: '#696969',
  // Accent (amarelo/verde)
  accent: '#EDD8B1',
  accentForeground: '#1A1A1A',
  // Destructive (vermelho)
  destructive: '#D65152',
  destructiveForeground: '#FFFFFF',
  // Border
  border: '#DD5B9A',
  input: '#F5F1F5',
  ring: '#D94A7B',
};

// Cores Dark Mode
export const dark = {
  // Backgrounds
  background: '#3C3C4D',
  foreground: '#EDE3EE',
  // Cards
  card: '#474A5E',
  cardForeground: '#EDE3EE',
  // Popover
  popover: '#474A5E',
  popoverForeground: '#EDE3EE',
  // Primary (amarelo/verde - contraste com fundo escuro)
  primary: '#E8D8B1',
  primaryForeground: '#3C3C4D',
  // Secondary (vermelho suave)
  secondary: '#D4999D',
  secondaryForeground: '#3C3C4D',
  // Muted
  muted: '#565969',
  mutedForeground: '#D4999D',
  // Accent (rosa)
  accent: '#D45B82',
  accentForeground: '#EDE3EE',
  // Destructive
  destructive: '#D84860',
  destructiveForeground: '#3C3C4D',
  // Border
  border: '#565969',
  input: '#4F525D',
  ring: '#93B7D8',
};

/**
 * Padrão de tema (Light) - CORRIGIDO
 * O tema padrão deve ser light, não dark
 */
export const colors = light;

/**
 * Utilitário para alternar entre temas
 */
export const getTheme = (isDark: boolean) => (isDark ? dark : light);

/**
 * Sombras (shadows) do tema
 */
export const shadows = {
  light: {
    xs: {
      shadowColor: 'rgba(0,0,0,0.12)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: 'rgba(0,0,0,0.14)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: 'rgba(0,0,0,0.16)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: 'rgba(0,0,0,0.20)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  dark: {
    xs: {
      shadowColor: 'rgba(0,0,0,0.40)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: 'rgba(0,0,0,0.45)',
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
      shadowColor: 'rgba(0,0,0,0.55)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};

/**
 * Tipografia do tema
 */
export const typography = {
  fontFamily: {
    sans: 'Poppins',
    serif: 'Lora',
    mono: 'Fira Code',
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
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

/**
 * Espaçamento (spacing)
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
};

/**
 * Border radius
 */
export const borderRadius = {
  sm: 2,
  md: 4,
  lg: 6,
  xl: 10,
  full: 999,
};

export default {
  light,
  dark,
  colors,
  shadows,
  typography,
  spacing,
  borderRadius,
};
