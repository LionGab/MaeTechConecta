/**
 * Tema Bubblegum - Export Central
 * Use este arquivo para importar tudo que precisa do tema
 */

export { light, dark, colors, getTheme, shadows, typography, spacing, borderRadius, default as theme } from './colors';

// Tipo helper para cores
export type ThemeColors = typeof import('./colors').colors;

// Type helper para shadows
export type Shadows = typeof import('./colors').shadows;
