/**
 * Tema v0.app - Nossa Maternidade
 *
 * Tema baseado no design do site v0-nossa-maternidade-app.vercel.app
 * Design moderno, limpo e acolhedor com foco em maternidade
 * Cores suaves e profissionais que transmitem segurança e conforto
 */

// Cores Light Mode - v0.app Theme (Inspirado no site)
export const v0AppLight = {
  // Backgrounds - Branco suave e acolhedor
  background: '#FEFEFE', // Branco quase puro, mas suave
  foreground: '#1A1A1A', // Preto suave para texto (não puro para reduzir cansaço visual)

  // Cards - Branco puro com sombras suaves
  card: '#FFFFFF', // Branco puro para cards destacados
  cardForeground: '#1A1A1A',

  // Popover
  popover: '#FFFFFF',
  popoverForeground: '#1A1A1A',

  // Primary - Azul suave e acolhedor (inspirado em designs modernos de saúde/maternidade)
  primary: '#4A90E2', // Azul suave e confiável (não muito vibrante)
  primaryForeground: '#FFFFFF',

  // Secondary - Azul muito claro e suave
  secondary: '#E8F4F8', // Azul claro acolhedor
  secondaryForeground: '#2C5F7C', // Azul escuro para contraste

  // Muted - Cinza muito suave
  muted: '#F7F9FA', // Cinza quase branco
  mutedForeground: '#6B7280', // Cinza médio para texto secundário

  // Accent - Azul céu suave
  accent: '#5BA3D0', // Azul céu acolhedor
  accentForeground: '#FFFFFF',

  // Destructive - Vermelho suave (não agressivo)
  destructive: '#E57373', // Vermelho suave e não alarmante
  destructiveForeground: '#FFFFFF',

  // Border - Cinza muito claro
  border: '#E5E7EB', // Cinza claro suave
  input: '#F9FAFB', // Fundo de input quase branco
  ring: '#4A90E2', // Ring azul primário

  // Sidebar - Branco suave
  sidebar: '#FAFBFC', // Branco com leve tom cinza
  sidebarForeground: '#1A1A1A',
  sidebarPrimary: '#4A90E2',
  sidebarPrimaryForeground: '#FFFFFF',
  sidebarAccent: '#E8F4F8',
  sidebarAccentForeground: '#2C5F7C',
  sidebarBorder: '#E5E7EB',
  sidebarRing: '#4A90E2',

  // Charts - Paleta harmoniosa de azuis e complementares
  chart1: '#4A90E2', // Azul primário
  chart2: '#5BA3D0', // Azul céu
  chart3: '#7BB3D9', // Azul médio
  chart4: '#9CC3E2', // Azul claro
  chart5: '#B8D4EB', // Azul muito claro
};

// Cores Dark Mode - v0.app Theme (Suave e acolhedor)
export const v0AppDark = {
  // Backgrounds - Azul escuro suave (não preto puro)
  background: '#0F172A', // Azul escuro profundo (Slate 900)
  foreground: '#F1F5F9', // Branco suave para texto

  // Cards - Azul escuro intermediário
  card: '#1E293B', // Slate 800 - Card destacado
  cardForeground: '#F1F5F9',

  // Popover
  popover: '#1E293B',
  popoverForeground: '#F1F5F9',

  // Primary - Azul claro vibrante para dark mode
  primary: '#60A5FA', // Blue 400 - Azul claro e confortável
  primaryForeground: '#0F172A', // Preto para contraste

  // Secondary - Azul escuro suave
  secondary: '#1E3A5F', // Azul escuro acolhedor
  secondaryForeground: '#BFDBFE', // Azul muito claro

  // Muted - Cinza azulado escuro
  muted: '#334155', // Slate 700
  mutedForeground: '#94A3B8', // Slate 400

  // Accent - Azul céu claro
  accent: '#38BDF8', // Sky 400
  accentForeground: '#0F172A',

  // Destructive - Vermelho suave
  destructive: '#F87171', // Red 400
  destructiveForeground: '#FFFFFF',

  // Border - Cinza azulado
  border: '#334155', // Slate 700
  input: '#1E293B', // Slate 800
  ring: '#60A5FA', // Blue 400

  // Sidebar - Azul escuro
  sidebar: '#1E293B', // Slate 800
  sidebarForeground: '#F1F5F9',
  sidebarPrimary: '#60A5FA',
  sidebarPrimaryForeground: '#0F172A',
  sidebarAccent: '#1E3A5F',
  sidebarAccentForeground: '#BFDBFE',
  sidebarBorder: '#334155',
  sidebarRing: '#60A5FA',

  // Charts - Paleta de azuis claros para dark mode
  chart1: '#60A5FA', // Blue 400
  chart2: '#38BDF8', // Sky 400
  chart3: '#818CF8', // Indigo 400
  chart4: '#A78BFA', // Violet 400
  chart5: '#C084FC', // Fuchsia 400
};

/**
 * Export default (light mode)
 */
export const v0AppColors = v0AppLight;
