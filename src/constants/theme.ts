/**
 * Design System Completo - Nossa Maternidade
 *
 * Tema maternal acolhedor baseado no Bubblegum
 * Adaptado para maternidade com foco em acolhimento visual
 */

import { light, dark, shadows, typography, spacing, borderRadius, gradients } from '@/theme/colors';

/**
 * Cores expandidas do tema
 */
export const theme = {
  colors: {
    // Tema completo do light (base)
    ...light,
    gradients,

    // Primárias (Rosa maternal do tema Bubblegum) - Escalas
    primaryScale: {
      50: '#FFF5F7',
      100: '#FFE3E8',
      200: '#FFCCD5',
      300: '#FFB0C0',
      400: '#FF94AB',
      500: light.primary, // '#DD5B9A' - Main
      600: '#E8899A',
      700: '#D66D86',
      800: '#C45172',
      900: '#B2355E',
    },

    // Secundárias (Azul calma do tema Bubblegum) - Escalas
    secondaryScale: {
      50: '#F0F8FA',
      100: '#E0F0F5',
      200: '#C0E1EB',
      300: '#A0D2E1',
      400: '#80C3D7',
      500: light.secondary, // '#B8D8E8' - Main
      600: '#95B8C8',
      700: '#7298A8',
      800: '#4F7888',
      900: '#2C5868',
    },

    // Neutras (Off-white quente)
    neutral: {
      0: '#FFFFFF',
      50: light.background, // '#F0E7F0'
      100: '#F8F5F6',
      200: '#F0EBEC',
      300: '#E0D5D7',
      400: '#C9B8BB',
      500: '#998388',
      600: '#6E595D',
      700: '#4A3A3D',
      800: '#2D2426',
      900: '#1A1315',
    },

    // Funcionais
    success: '#81C784',
    warning: '#FFB74D',
    error: light.destructive, // '#D65152'
    info: '#64B5F6',

    // Background (objetos separados)
    backgroundScale: {
      primary: light.background,
      secondary: light.card,
      tertiary: '#FFFFFF',
    },
  },

  // Dark mode colors
  dark: {
    ...dark,
    gradients,
    primary: {
      50: '#2D2426',
      100: '#3A3032',
      200: '#4A3A3D',
      300: '#5A4447',
      400: '#6A4E51',
      500: dark.primary, // '#E8D8B1'
      600: '#D4C89D',
      700: '#C0B889',
      800: '#ACA875',
      900: '#989861',
    },
    background: {
      primary: dark.background,
      secondary: dark.card,
      tertiary: '#474A5E',
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  typography: {
    fontFamily: {
      primary: typography.fontFamily.sans,
      secondary: typography.fontFamily.sans,
    },
    sizes: typography.sizes,
    weights: typography.weights,
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },

  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },

  shadows: {
    // Sombras suaves e acolhedoras
    sm: {
      shadowColor: 'rgba(221, 91, 154, 0.08)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 2,
    },
    md: {
      shadowColor: 'rgba(221, 91, 154, 0.12)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 4,
    },
    lg: {
      shadowColor: 'rgba(221, 91, 154, 0.16)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 8,
    },
  },

  animations: {
    // Timings suaves e orgânicos
    fast: 150,
    normal: 250,
    slow: 400,
    // Easings orgânicos
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeIn: 'cubic-bezier(0.7, 0, 0.84, 0)',
    easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  },
};

/**
 * Helper para obter tema (light/dark)
 */
export const getTheme = (isDark: boolean) => {
  if (isDark) {
    return {
      ...theme,
      colors: theme.dark,
      shadows: shadows.dark,
    };
  }
  return {
    ...theme,
    colors: theme.colors,
    shadows: shadows.light,
  };
};

export default theme;
