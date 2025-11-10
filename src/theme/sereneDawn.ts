/**
 * 🌅 Tema "Amanhecer Sereno" (Serene Dawn)
 * Design Premium Elite para Nossa Maternidade
 *
 * Conceito: Transição suave de cores do céu ao amanhecer
 * Evoca calma, esperança e a beleza de um novo dia
 * Sofisticação + Calor + Serenidade
 */

// =====================================================
// 🎨 PALETA DE CORES SERENE DAWN
// =====================================================

export const sereneDawnColors = {
  // 🌙 Azuis Noturnos/Crepusculares Profundos
  midnightBlue: '#0A1931', // Azul Meia-Noite Profundo - Background principal
  darkPetrol: '#1B2A41', // Azul Petróleo Escuro - Cards e seções
  navyDeep: '#0F1E2E', // Navy profundo - Popover

  // 🌅 Azuis Céu Suaves e Vibrantes
  slateBlue: '#5D7B9B', // Azul Ardósia Suave - Textos secundários
  sereneSky: '#7FB0DA', // Azul Céu Claro/Sereno - Primário
  babyBlue: '#ADD8E6', // Azul Bebê Ultra-Claro - Destaques

  // ✨ Toques de Calor (Neutros Quentes e Degradê)
  champagne: '#FFD700', // Dourado Suave/Champanhe - Luxo e acolhimento
  warmWhite: '#F8F8F8', // Branco Quente/Off-White - Textos principais
  platinum: '#DCDCDC', // Cinza Claro/Platina - Bordas e separadores

  // 🌊 Azuis Secundários
  deepOcean: '#0D1B2A', // Azul Oceano Profundo - Contraste
  twilight: '#1E3A5F', // Azul Crepúsculo - Variação de card

  // 🌟 Acentos e Estados
  success: '#34D399', // Verde sucesso
  warning: '#FBBF24', // Amarelo aviso
  error: '#F87171', // Vermelho erro (suave)
  info: '#60A5FA', // Azul info
};

// =====================================================
// 🎨 TEMA LIGHT MODE - SERENE DAWN
// =====================================================

export const sereneDawnLight = {
  // Backgrounds
  background: sereneDawnColors.warmWhite, // Fundo principal claro
  foreground: sereneDawnColors.midnightBlue, // Texto principal escuro

  // Cards - Com leve toque azulado
  card: '#FFFFFF', // Branco puro para cards
  cardForeground: sereneDawnColors.midnightBlue,

  // Popover
  popover: '#FFFFFF',
  popoverForeground: sereneDawnColors.midnightBlue,

  // Primary - Azul Sereno com toque dourado
  primary: sereneDawnColors.sereneSky,
  primaryForeground: '#FFFFFF',
  primaryHover: sereneDawnColors.babyBlue,

  // Secondary - Azul Ardósia
  secondary: sereneDawnColors.slateBlue,
  secondaryForeground: '#FFFFFF',

  // Accent - Dourado Champanhe (luxo)
  accent: sereneDawnColors.champagne,
  accentForeground: sereneDawnColors.midnightBlue,

  // Muted - Tons suaves
  muted: '#F1F5F9',
  mutedForeground: sereneDawnColors.slateBlue,

  // Destructive
  destructive: sereneDawnColors.error,
  destructiveForeground: '#FFFFFF',

  // Border
  border: sereneDawnColors.platinum,
  input: '#F1F5F9',
  ring: sereneDawnColors.sereneSky,

  // States
  success: sereneDawnColors.success,
  warning: sereneDawnColors.warning,
  error: sereneDawnColors.error,
  info: sereneDawnColors.info,
};

// =====================================================
// 🌙 TEMA DARK MODE - SERENE DAWN
// =====================================================

export const sereneDawnDark = {
  // Backgrounds - Azul escuro profundo
  background: sereneDawnColors.midnightBlue,
  foreground: sereneDawnColors.warmWhite,

  // Cards - Azul petróleo
  card: sereneDawnColors.darkPetrol,
  cardForeground: sereneDawnColors.warmWhite,

  // Popover
  popover: sereneDawnColors.twilight,
  popoverForeground: sereneDawnColors.warmWhite,

  // Primary - Azul céu (mais claro para contraste)
  primary: sereneDawnColors.babyBlue,
  primaryForeground: sereneDawnColors.midnightBlue,
  primaryHover: sereneDawnColors.sereneSky,

  // Secondary
  secondary: sereneDawnColors.slateBlue,
  secondaryForeground: sereneDawnColors.warmWhite,

  // Accent - Dourado suave
  accent: sereneDawnColors.champagne,
  accentForeground: sereneDawnColors.midnightBlue,

  // Muted
  muted: sereneDawnColors.deepOcean,
  mutedForeground: sereneDawnColors.slateBlue,

  // Destructive
  destructive: sereneDawnColors.error,
  destructiveForeground: '#FFFFFF',

  // Border
  border: sereneDawnColors.twilight,
  input: sereneDawnColors.deepOcean,
  ring: sereneDawnColors.babyBlue,

  // States
  success: sereneDawnColors.success,
  warning: sereneDawnColors.warning,
  error: sereneDawnColors.error,
  info: sereneDawnColors.info,
};

// =====================================================
// 🌈 GRADIENTES PREMIUM
// =====================================================

export const sereneDawnGradients = {
  // Primário - Azul sereno com toque dourado
  primary: [sereneDawnColors.sereneSky, sereneDawnColors.babyBlue] as [string, string],
  primaryWithGold: [sereneDawnColors.sereneSky, sereneDawnColors.champagne] as [string, string],

  // Luxo - Dourado suave
  luxury: [sereneDawnColors.champagne, '#FFEAA7'] as [string, string],

  // Crepúsculo - Azul profundo para escuro
  twilight: [sereneDawnColors.midnightBlue, sereneDawnColors.darkPetrol] as [string, string],

  // Aurora - Do escuro ao claro (amanhecer)
  aurora: [sereneDawnColors.deepOcean, sereneDawnColors.sereneSky, sereneDawnColors.babyBlue] as [
    string,
    string,
    string,
  ],

  // Calma - Tons suaves
  calm: [sereneDawnColors.babyBlue, sereneDawnColors.warmWhite] as [string, string],

  // Estados
  success: ['#34D399', '#6EE7B7'] as [string, string],
  warning: ['#FBBF24', '#FCD34D'] as [string, string],
  error: ['#F87171', '#FCA5A5'] as [string, string],
  info: [sereneDawnColors.info, '#93C5FD'] as [string, string],
};

// =====================================================
// ✨ OVERLAY E TRANSPARÊNCIAS
// =====================================================

export const sereneDawnOverlay = {
  primary: 'rgba(127, 176, 218, 0.1)', // Azul sereno transparente
  primaryBorder: 'rgba(127, 176, 218, 0.2)',
  primaryBorderLight: 'rgba(127, 176, 218, 0.15)',
  gold: 'rgba(255, 215, 0, 0.1)', // Dourado transparente
  goldBorder: 'rgba(255, 215, 0, 0.2)',
  white: 'rgba(255, 255, 255, 0.06)', // Branco transparente (dark mode)
  black: 'rgba(0, 0, 0, 0.5)', // Overlay modal
  glass: 'rgba(255, 255, 255, 0.1)', // Efeito vidro
};

// =====================================================
// 🎨 SOMBRAS PREMIUM
// Mais profundas e suaves para efeito "floating"
// =====================================================

export const sereneDawnShadows = {
  light: {
    xs: {
      shadowColor: 'rgba(10, 25, 49, 0.08)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: 'rgba(10, 25, 49, 0.10)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: 'rgba(10, 25, 49, 0.12)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: 'rgba(10, 25, 49, 0.15)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: 'rgba(10, 25, 49, 0.18)',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 12,
    },
    '2xl': {
      shadowColor: 'rgba(10, 25, 49, 0.20)',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 1,
      shadowRadius: 32,
      elevation: 16,
    },
  },
  dark: {
    xs: {
      shadowColor: 'rgba(0, 0, 0, 0.40)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: 'rgba(0, 0, 0, 0.50)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: 'rgba(0, 0, 0, 0.60)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: 'rgba(0, 0, 0, 0.70)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: 'rgba(0, 0, 0, 0.80)',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 12,
    },
    '2xl': {
      shadowColor: 'rgba(0, 0, 0, 0.90)',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 1,
      shadowRadius: 32,
      elevation: 16,
    },
  },
};

// =====================================================
// 📱 TIPOGRAFIA PREMIUM
// Inter para títulos, Roboto para corpo
// =====================================================

export const sereneDawnTypography = {
  fontFamily: {
    heading: 'Inter', // Títulos (Semibold/Bold)
    body: 'Roboto', // Corpo (Regular)
    sans: 'System', // Fallback (usa fonte do sistema)
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
    '7xl': 60, // Novos tamanhos maiores
    '8xl': 72,
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
  },
};

// =====================================================
// 📐 ESPAÇAMENTO GENEROSO
// Mais respiro, menos claustrofóbico
// =====================================================

export const sereneDawnSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  '5xl': 128,
  '6xl': 192, // Novos espaçamentos maiores
};

// =====================================================
// 🎨 BORDER RADIUS SUAVE
// Mais arredondado para sensação premium
// =====================================================

export const sereneDawnBorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 999,
};

// =====================================================
// 🌟 EXPORT PADRÃO
// =====================================================

export default {
  light: sereneDawnLight,
  dark: sereneDawnDark,
  colors: sereneDawnColors,
  gradients: sereneDawnGradients,
  overlay: sereneDawnOverlay,
  shadows: sereneDawnShadows,
  typography: sereneDawnTypography,
  spacing: sereneDawnSpacing,
  borderRadius: sereneDawnBorderRadius,
};
