import { StyleSheet } from 'react-native';

// Design System | Nath - Mae que transforma dor em forca

export const theme = {
  colors: {
    bg: '#FFF8F3', // Fundo acolhedor
    card: '#FFFFFF', // Cards neutros limpos
    primary: '#6DA9E4', // Azul acolhedor
    primarySoft: '#DCEBFA', // Azul suave (chips / highlight)
    accent: '#FF8BA3', // Rosa detalhe emocional
    text: '#6A5450', // Marrom quente (texto principal)
    textMuted: '#9E928C', // Cinza quente (suporte emocional)
    border: '#EFE7E2', // Divisores suaves
    success: '#6BC3A3', // Verde cuidado / progresso
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  radius: {
    sm: 12,
    md: 18,
    lg: 26,
    pill: 999,
  },

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

// Hook para criar estilos usando tokens
export function makeStyles<T>(fn: (t: typeof theme) => T) {
  return StyleSheet.create(fn(theme) as any) as { [K in keyof T]: any };
}

// Helpers opcionais (se quiser programar estilos inline facil)
export const useThemeStyles = () => {
  return {
    color: (key: keyof typeof theme.colors) => theme.colors[key],
    space: (size: keyof typeof theme.spacing) => theme.spacing[size],
    radius: (size: keyof typeof theme.radius) => theme.radius[size],
    text: (style: keyof typeof theme.typography) => theme.typography[style],
    shadow: (name: keyof typeof theme.shadow) => theme.shadow[name],
  };
};

// Export default for convenience
export default theme;
