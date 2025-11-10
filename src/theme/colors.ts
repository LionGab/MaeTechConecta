/**
 * Tema Bubblegum - Cores convertidas para React Native
 * Fonte: https://tweakcn.com/r/themes/bubblegum.json
 *
 * OKLCH para RGB convertido
 * Light mode + Dark mode
 */

// 🎨 Paleta Acolhedora Mobile-First - Terracota, Sage, Lavanda
// Design System Superior ao projeto web
// Cores HSL convertidas para RGB para React Native

// Cores Light Mode (padrão) - Acolhedoras e Suaves
export const light = {
  // Backgrounds - Creme suave (#FCFAF8)
  background: '#FCFAF8', // Creme suave acolhedor
  foreground: '#1A1A1A', // Preto suave para melhor legibilidade

  // Cards - Branco com toque creme
  card: '#FFFFFF', // Branco puro para cards
  cardForeground: '#1A1A1A',

  // Popover
  popover: '#FFFFFF',
  popoverForeground: '#1A1A1A',

  // Primary - Terracota Maternal (#E891B5) - Rosa suave acolhedor
  primary: '#E891B5', // Terracota - Rosa suave acolhedor
  primaryForeground: '#FFFFFF',

  // Secondary - Sage Suave (#C8E0D4) - Verde acolhedor
  secondary: '#C8E0D4', // Sage - Verde suave acolhedor
  secondaryForeground: '#1A4A3A', // Verde escuro para contraste

  // Accent - Lavanda Delicado (#E8C4E8) - Suave e diferenciado
  accent: '#E8C4E8', // Lavanda - Roxo suave
  accentForeground: '#4A2A4A', // Roxo escuro para contraste

  // Muted - Creme Suave (melhor contraste)
  muted: '#F5F0E8', // Creme suave
  mutedForeground: '#6B6660', // Cinza médio para texto secundário

  // Destructive - Vermelho Suave (menos agressivo)
  destructive: '#E67E7E', // Vermelho suave acolhedor
  destructiveForeground: '#FFFFFF',

  // Border - Bege Suave
  border: '#E5DCD0', // Bege suave para bordas
  input: '#F5F0E8', // Creme suave para inputs
  ring: '#E891B5', // Rosa suave para focus (consistente com primary)

  // Sidebar
  sidebar: '#F5F0E8', // Creme suave
  sidebarForeground: '#1A1A1A',
  sidebarPrimary: '#E891B5', // Terracota
  sidebarPrimaryForeground: '#FFFFFF',
  sidebarAccent: '#E8C4E8', // Lavanda
  sidebarAccentForeground: '#4A2A4A',
  sidebarBorder: '#E5DCD0', // Bege suave
  sidebarRing: '#E891B5', // Terracota

  // Charts (cores suaves e harmoniosas)
  chart1: '#E891B5', // Terracota
  chart2: '#E8C4E8', // Lavanda
  chart3: '#C8E0D4', // Sage
  chart4: '#B8D4E8', // Azul suave
  chart5: '#F0D8B8', // Pêssego suave
};

// 🌙 Dark Mode com Tons Quentes - Não usa preto puro (reduz fadiga visual)
export const dark = {
  // Backgrounds - Marrom escuro suave (#1F1C1A)
  background: '#1F1C1A', // Marrom escuro suave (não preto puro)
  foreground: '#F5F0E8', // Creme claro para texto

  // Cards
  card: '#2A2623', // Marrom escuro mais claro
  cardForeground: '#F5F0E8',

  // Popover
  popover: '#2A2623',
  popoverForeground: '#F5F0E8',

  // Primary - Terracota mais claro para dark mode
  primary: '#F0A8C4', // Terracota mais claro para contraste
  primaryForeground: '#1F1C1A',

  // Secondary - Sage adaptado para dark
  secondary: '#A0C5B4', // Sage mais claro
  secondaryForeground: '#1F1C1A',

  // Accent - Lavanda suave
  accent: '#D8B4D8', // Lavanda suave
  accentForeground: '#1F1C1A',

  // Muted - Escuro Suave com contraste adequado
  muted: '#3A3530', // Marrom escuro suave
  mutedForeground: '#B8B0A8', // Creme médio para texto secundário

  // Destructive
  destructive: '#E67E7E', // Vermelho suave (mesmo do light)
  destructiveForeground: '#FFFFFF',

  // Border - Mais visíveis
  border: '#4A4540', // Marrom médio para bordas
  input: '#3A3530', // Marrom escuro para inputs
  ring: '#F0A8C4', // Terracota claro para focus

  // Sidebar
  sidebar: '#2A2623',
  sidebarForeground: '#F5F0E8',
  sidebarPrimary: '#F0A8C4', // Terracota claro
  sidebarPrimaryForeground: '#1F1C1A',
  sidebarAccent: '#D8B4D8', // Lavanda
  sidebarAccentForeground: '#1F1C1A',
  sidebarBorder: '#4A4540',
  sidebarRing: '#F0A8C4',

  // Charts - Ajustados para dark mode com melhor visibilidade
  chart1: '#F0A8C4', // Terracota claro
  chart2: '#D8B4D8', // Lavanda
  chart3: '#A0C5B4', // Sage
  chart4: '#B8D4E8', // Azul suave
  chart5: '#F0D8B8', // Pêssego
};

/**
 * 🎨 Cores Overlay e Transparências
 */
export const overlay = {
  primary: 'rgba(232, 145, 181, 0.1)', // Rosa suave transparente
  primaryBorder: 'rgba(232, 145, 181, 0.2)', // Rosa border suave
  primaryBorderLight: 'rgba(232, 145, 181, 0.15)', // Rosa border ultra suave
  white: 'rgba(255, 255, 255, 0.08)', // Branco transparente
  black: 'rgba(0, 0, 0, 0.5)', // Preto overlay
};

/**
 * 🌈 Gradientes
 */
export const gradients = {
  blue: ['#3B82F6', '#60A5FA'] as [string, string], // Azul
  purple: ['#8B5CF6', '#A78BFA'] as [string, string], // Roxo
  green: ['#10B981', '#34D399'] as [string, string], // Verde
  amber: ['#F59E0B', '#FBBF24'] as [string, string], // Âmbar
  pink: ['#E891B5', '#F0A8C4'] as [string, string], // Rosa (primary)
  sage: ['#C8E0D4', '#A0C5B4'] as [string, string], // Verde sage
  lavender: ['#E8C4E8', '#D8B4D8'] as [string, string], // Lavanda
};

/**
 * Padrão de tema (Light) - CORRIGIDO
 * O tema padrão deve ser light, não dark
 */
export const colors = { ...light, overlay, gradients };

/**
 * Utilitário para alternar entre temas
 */
export const getTheme = (isDark: boolean) => (isDark ? dark : light);

/**
 * 🎨 Sombras Elegantes - Material Design Inspired
 * Elevações mais suaves e acolhedoras
 */
export const shadows = {
  light: {
    xs: {
      shadowColor: 'rgba(0,0,0,0.05)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,
      boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)',
    },
    sm: {
      shadowColor: 'rgba(0,0,0,0.06)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06)',
    },
    md: {
      shadowColor: 'rgba(0,0,0,0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 4,
      boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.08), 0px 2px 4px -2px rgba(0,0,0,0.06)',
    },
    lg: {
      shadowColor: 'rgba(0,0,0,0.10)',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 1,
      shadowRadius: 15,
      elevation: 8,
      boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.10), 0px 4px 6px -4px rgba(0,0,0,0.08)',
    },
    xl: {
      shadowColor: 'rgba(0,0,0,0.12)',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 1,
      shadowRadius: 25,
      elevation: 12,
      boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.12), 0px 8px 10px -6px rgba(0,0,0,0.08)',
    },
  },
  dark: {
    xs: {
      shadowColor: 'rgba(0,0,0,0.30)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,
      boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.30)',
    },
    sm: {
      shadowColor: 'rgba(0,0,0,0.40)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.40), 0px 1px 2px -1px rgba(0,0,0,0.30)',
    },
    md: {
      shadowColor: 'rgba(0,0,0,0.50)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 4,
      boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.50), 0px 2px 4px -2px rgba(0,0,0,0.40)',
    },
    lg: {
      shadowColor: 'rgba(0,0,0,0.60)',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 1,
      shadowRadius: 15,
      elevation: 8,
      boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.60), 0px 4px 6px -4px rgba(0,0,0,0.50)',
    },
    xl: {
      shadowColor: 'rgba(0,0,0,0.70)',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 1,
      shadowRadius: 25,
      elevation: 12,
      boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.70), 0px 8px 10px -6px rgba(0,0,0,0.60)',
    },
  },
};

/**
 * 📱 Tipografia Mobile-First - Elegante e Legível
 */
export const typography = {
  fontFamily: {
    sans: 'System', // Usa fonte do sistema (melhor performance)
    serif: 'System', // Fallback para serif
    mono: 'Courier', // Fallback para mono
  },
  sizes: {
    xs: 12, // 0.75rem
    sm: 14, // 0.875rem
    base: 16, // 1rem (mínimo para evitar zoom no iOS)
    lg: 18, // 1.125rem
    xl: 20, // 1.25rem
    '2xl': 24, // 1.5rem
    '3xl': 28, // 1.75rem
    '4xl': 32, // 2rem
    '5xl': 36, // 2.25rem (novo)
    '6xl': 48, // 3rem (novo)
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

/**
 * 📱 Espaçamento Mobile-First - Mais Generoso e Acolhedor
 */
export const spacing = {
  xs: 4, // 0.25rem - 4px
  sm: 8, // 0.5rem - 8px
  md: 16, // 1rem - 16px (melhorado de 12px)
  lg: 24, // 1.5rem - 24px (melhorado de 16px)
  xl: 32, // 2rem - 32px (melhorado de 20px)
  '2xl': 48, // 3rem - 48px (melhorado de 24px)
  '3xl': 64, // 4rem - 64px (melhorado de 32px)
  '4xl': 96, // 6rem - 96px (novo)
  '5xl': 128, // 8rem - 128px (novo)
};

/**
 * 🎨 Border Radius Mobile-Friendly - Mais Suave e Acolhedor
 */
export const borderRadius = {
  sm: 4, // 0.25rem - 4px (melhorado)
  md: 8, // 0.5rem - 8px (melhorado)
  lg: 12, // 0.75rem - 12px (melhorado, padrão mobile)
  xl: 16, // 1rem - 16px
  '2xl': 24, // 1.5rem - 24px (melhorado)
  '3xl': 32, // 2rem - 32px (novo)
  full: 999, // Fully rounded
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

