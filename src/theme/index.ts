/**
 * Tema Bubblegum - Export Central
 * Use este arquivo para importar tudo que precisa do tema
 */

// New Nath Theme System
export { theme as nathTheme, makeStyles, useThemeStyles } from './nathTheme';
export { default as defaultTheme } from './nathTheme';

// Legacy theme exports (keep for backwards compatibility)
export { light, dark, colors, getTheme, shadows, typography, spacing, borderRadius, default as theme } from './colors';

// Tipo helper para cores
export type ThemeColors = typeof import('./colors').colors;

// Type helper para shadows
export type Shadows = typeof import('./colors').shadows;
