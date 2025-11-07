import { theme } from '../../theme/nathTheme';

/**
 * Hook for using theme styles with type safety
 *
 * Usage:
 * ```tsx
 * const themeStyles = useThemeStyles();
 *
 * <View style={{ backgroundColor: themeStyles.color('bg') }} />
 * <View style={{ padding: themeStyles.space('md') }} />
 * <View style={{ borderRadius: themeStyles.radius('sm') }} />
 * ```
 */
export const useThemeStyles = () => {
  return {
    color: (key: keyof typeof theme.colors) => theme.colors[key],
    space: (size: keyof typeof theme.spacing) => theme.spacing[size],
    radius: (size: keyof typeof theme.radius) => theme.radius[size],
    text: (style: keyof typeof theme.typography) => theme.typography[style],
    shadow: (name: keyof typeof theme.shadow) => theme.shadow[name]
  };
};

export default useThemeStyles;
