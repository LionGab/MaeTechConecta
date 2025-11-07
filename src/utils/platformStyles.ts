/**
 * Platform Styles Utilities
 * Helpers para lidar com diferenças entre React Native e React Native Web
 */

import { Platform, ViewStyle } from 'react-native';

/**
 * Converte shadow props do React Native para boxShadow do Web
 *
 * @example
 * const styles = {
 *   container: {
 *     ...getShadowStyle({ shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4 })
 *   }
 * }
 */
export function getShadowStyle(shadowProps: {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}): ViewStyle {
  const {
    shadowColor = '#000',
    shadowOffset = { width: 0, height: 2 },
    shadowOpacity = 0.25,
    shadowRadius = 3.84,
    elevation,
  } = shadowProps;

  if (Platform.OS === 'web') {
    // React Native Web usa boxShadow
    const { width, height } = shadowOffset;
    const color = shadowColor;
    const alpha = shadowOpacity;

    // Converte cor hex para rgba se necessário
    let rgbaColor = color;
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      rgbaColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return {
      boxShadow: `${width}px ${height}px ${shadowRadius}px ${rgbaColor}`,
    } as ViewStyle;
  }

  // React Native nativo mantém as props originais
  return {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    ...(elevation !== undefined && Platform.OS === 'android' ? { elevation } : {}),
  };
}

/**
 * Cria estilos de sombra pré-definidos compatíveis com web e mobile
 */
export const shadows = {
  sm: getShadowStyle({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  }),

  md: getShadowStyle({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  }),

  lg: getShadowStyle({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  }),

  xl: getShadowStyle({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  }),
};
