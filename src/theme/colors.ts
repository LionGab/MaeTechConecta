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
  background: '#F0E7F0',      // oklch(0.9399 0.0203 345.6985) - Rosa muito claro
  foreground: '#121212',      // oklch(0.4712 0 0) - Preto

  // Cards
  card: '#F2F1E8',            // oklch(0.9498 0.0500 86.8891) - Bege claro
  cardForeground: '#121212',

  // Popover
  popover: '#FFFFFF',         // oklch(1.0000 0 0) - Branco puro
  popoverForeground: '#121212',

  // Primary (destaque principal - rosa)
  primary: '#DD5B9A',         // oklch(0.6209 0.1801 348.1385) - Rosa vibrante
  primaryForeground: '#FFFFFF',

  // Secondary (azul)
  secondary: '#B8D8E8',       // oklch(0.8095 0.0694 198.1863) - Azul pastel
  secondaryForeground: '#1A1A1A',

  // Muted (cinza neutro)
  muted: '#E1E5EC',           // oklch(0.8800 0.0504 212.0952) - Cinza claro
  mutedForeground: '#696969',

  // Accent (amarelo/verde)
  accent: '#EDD8B1',          // oklch(0.9195 0.0801 87.6670) - Amarelo pastel
  accentForeground: '#1A1A1A',

  // Destructive (vermelho)
  destructive: '#D65152',     // oklch(0.7091 0.1697 21.9551) - Vermelho
  destructiveForeground: '#FFFFFF',

  // Border
  border: '#DD5B9A',          // Rosa para bordas
  input: '#F5F1F5',           // oklch(0.9189 0 0) - Branco com toque de rosa
  ring: '#D94A7B',            // oklch(0.7002 0.1597 350.7532) - Rosa escuro

  // Sidebar
  sidebar: '#F0D9F0',         // oklch(0.9140 0.0424 343.0913)
  sidebarForeground: '#1A1A1A', // oklch(0.3211 0 0)
  sidebarPrimary: '#E44B7A',  // oklch(0.6559 0.2118 354.3084)
  sidebarPrimaryForeground: '#FFFFFF',
  sidebarAccent: '#D8A5C8',   // oklch(0.8228 0.1095 346.0184)
  sidebarAccentForeground: '#1A1A1A',
  sidebarBorder: '#F5F0F5',   // oklch(0.9464 0.0327 307.1745)
  sidebarRing: '#E44B7A',     // oklch(0.6559 0.2118 354.3084)

  // Charts (cores para gráficos)
  chart1: '#D94A7B',          // oklch(0.7002 0.1597 350.7532)
  chart2: '#B0D4E0',          // oklch(0.8189 0.0799 212.0892)
  chart3: '#EDD8B1',          // oklch(0.9195 0.0801 87.6670)
  chart4: '#E8C8D0',          // oklch(0.7998 0.1110 348.1791)
  chart5: '#DD6B9A',          // oklch(0.6197 0.1899 353.9091)
};

// Cores Dark Mode
export const dark = {
  // Backgrounds
  background: '#3C3C4D',      // oklch(0.2497 0.0305 234.1628) - Azul escuro
  foreground: '#EDE3EE',      // oklch(0.9306 0.0197 349.0785) - Branco/rosa claro

  // Cards
  card: '#474A5E',            // oklch(0.2902 0.0299 233.5352) - Azul-cinza
  cardForeground: '#EDE3EE',

  // Popover
  popover: '#474A5E',
  popoverForeground: '#EDE3EE',

  // Primary (amarelo/verde - contraste com fundo escuro)
  primary: '#E8D8B1',         // oklch(0.9195 0.0801 87.6670) - Amarelo claro
  primaryForeground: '#3C3C4D',

  // Secondary (vermelho suave)
  secondary: '#D4999D',       // oklch(0.7794 0.0803 4.1330) - Rosa avermelhado
  secondaryForeground: '#3C3C4D',

  // Muted
  muted: '#565969',           // oklch(0.2713 0.0086 255.5780) - Cinza escuro
  mutedForeground: '#D4999D',

  // Accent (rosa)
  accent: '#D45B82',          // oklch(0.6699 0.0988 356.9762) - Rosa
  accentForeground: '#EDE3EE',

  // Destructive
  destructive: '#D84860',     // oklch(0.6702 0.1806 350.3599) - Vermelho
  destructiveForeground: '#3C3C4D',

  // Border
  border: '#565969',
  input: '#4F525D',           // oklch(0.3093 0.0305 232.0027)
  ring: '#93B7D8',            // oklch(0.6998 0.0896 201.8672) - Azul claro

  // Sidebar
  sidebar: '#353542',         // oklch(0.2303 0.0270 235.9743)
  sidebarForeground: '#F5F3F7', // oklch(0.9670 0.0029 264.5419)
  sidebarPrimary: '#E44B7A',  // oklch(0.6559 0.2118 354.3084)
  sidebarPrimaryForeground: '#FFFFFF',
  sidebarAccent: '#D8A5C8',   // oklch(0.8228 0.1095 346.0184)
  sidebarAccentForeground: '#565969', // oklch(0.2781 0.0296 256.8480)
  sidebarBorder: '#565969',   // oklch(0.3729 0.0306 259.7328)
  sidebarRing: '#E44B7A',     // oklch(0.6559 0.2118 354.3084)

  // Charts (cores para gráficos)
  chart1: '#93B7D8',          // oklch(0.6998 0.0896 201.8672)
  chart2: '#D4999D',          // oklch(0.7794 0.0803 4.1330)
  chart3: '#D45B82',          // oklch(0.6699 0.0988 356.9762)
  chart4: '#5B7A9D',          // oklch(0.4408 0.0702 217.0848)
  chart5: '#565969',          // oklch(0.2713 0.0086 255.5780)
};

/**
 * Padrão de tema (Light) - CORRIGIDO
 * O tema padrão deve ser light, não dark
 */
export const colors = light;

/**
 * Utilitário para alternar entre temas
 */
export const getTheme = (isDark: boolean) => isDark ? dark : light;

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
      // Web (react-native-web)
      boxShadow: '0px 1px 2px rgba(0,0,0,0.12)',
    },
    sm: {
      shadowColor: 'rgba(0,0,0,0.14)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
      boxShadow: '0px 2px 4px rgba(0,0,0,0.14)',
    },
    md: {
      shadowColor: 'rgba(0,0,0,0.16)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 4,
      boxShadow: '0px 4px 12px rgba(0,0,0,0.16)',
    },
    lg: {
      shadowColor: 'rgba(0,0,0,0.20)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 8,
      boxShadow: '0px 8px 24px rgba(0,0,0,0.20)',
    },
  },
  dark: {
    xs: {
      shadowColor: 'rgba(0,0,0,0.40)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,
      boxShadow: '0px 1px 2px rgba(0,0,0,0.40)',
    },
    sm: {
      shadowColor: 'rgba(0,0,0,0.45)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
      boxShadow: '0px 2px 4px rgba(0,0,0,0.45)',
    },
    md: {
      shadowColor: 'rgba(0,0,0,0.50)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 4,
      boxShadow: '0px 4px 12px rgba(0,0,0,0.50)',
    },
    lg: {
      shadowColor: 'rgba(0,0,0,0.55)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 8,
      boxShadow: '0px 8px 24px rgba(0,0,0,0.55)',
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
 * Border radius (base: 0.4rem = 6.4px ≈ 6px)
 * Seguindo o tema oficial do tweakcn
 */
export const borderRadius = {
  sm: 2,      // calc(0.4rem - 4px) ≈ 2px
  md: 4,      // calc(0.4rem - 2px) ≈ 4px
  lg: 6,      // 0.4rem ≈ 6px (base)
  xl: 10,     // calc(0.4rem + 4px) ≈ 10px
  full: 999,  // Fully rounded
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
