/**
 * Sistema de Temas Múltiplos
 *
 * Suporta múltiplos temas: Bubblegum (padrão) e v0.app
 */

import { light as bubblegumLight, dark as bubblegumDark } from '../colors';
import { v0AppLight, v0AppDark } from './v0-app';
import { momBlueLight, momBlueDark } from './mom-blue';

export type ThemeName = 'bubblegum' | 'v0-app' | 'mom-blue';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  // Aliases for compatibility
  text?: string; // alias for foreground
  surface?: string; // alias for card
  textSecondary?: string; // alias for mutedForeground
  onPrimary?: string; // alias for primaryForeground
}

/**
 * Map de temas disponíveis
 */
export const themes = {
  bubblegum: {
    light: bubblegumLight as ThemeColors,
    dark: bubblegumDark as ThemeColors,
  },
  'v0-app': {
    light: v0AppLight as ThemeColors,
    dark: v0AppDark as ThemeColors,
  },
  'mom-blue': {
    light: momBlueLight as ThemeColors,
    dark: momBlueDark as ThemeColors,
  },
} as const;

/**
 * Obter tema por nome e modo
 */
export const getThemeColors = (themeName: ThemeName = 'bubblegum', isDark: boolean = false): ThemeColors => {
  return themes[themeName][isDark ? 'dark' : 'light'];
};

/**
 * Tema padrão (Bubblegum)
 */
export const defaultTheme: ThemeName = 'mom-blue';

