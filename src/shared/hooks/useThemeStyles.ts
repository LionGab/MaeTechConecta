import { useCallback, useMemo } from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import type {
  Theme,
  ThemeColorToken,
  ThemeRadiusToken,
  ThemeShadowToken,
  ThemeSpacingToken,
  ThemeTextVariant,
} from '@/theme';

type NamedStyles = StyleSheet.NamedStyles<any>;
type MakeStylesFactory<T extends NamedStyles> = (helpers: ThemeHelpers) => T;

type TypographyVariantsMap = Theme['typography']['variants'];

export interface ThemeHelpers {
  theme: Theme;
  color: (token: ThemeColorToken) => string;
  space: (token: ThemeSpacingToken) => number;
  radius: (token: ThemeRadiusToken) => number;
  text: <Variant extends ThemeTextVariant>(
    variant: Variant,
    overrides?: Partial<TypographyVariantsMap[Variant]>
  ) => TextStyle;
  shadow: (token: ThemeShadowToken) => ViewStyle;
  makeStyles: <T extends NamedStyles>(factory: MakeStylesFactory<T>) => T;
}

export function useThemeStyles(): ThemeHelpers {
  const { theme } = useTheme();

  const helpers = useMemo(() => {
    const color = (token: ThemeColorToken) => {
      const value = theme.colors[token];
      if (__DEV__ && value === undefined) {
        console.warn(`Token de cor "${String(token)}" não encontrado no tema atual`);
      }
      return value ?? token;
    };

    const space = (token: ThemeSpacingToken) => {
      const value = theme.spacing[token];
      if (__DEV__ && value === undefined) {
        console.warn(`Token de espaçamento "${String(token)}" não encontrado no tema atual`);
      }
      return value ?? 0;
    };

    const radius = (token: ThemeRadiusToken) => {
      const value = theme.borderRadius[token];
      if (__DEV__ && value === undefined) {
        console.warn(`Token de radius "${String(token)}" não encontrado no tema atual`);
      }
      return value ?? 0;
    };

    const text = <Variant extends ThemeTextVariant>(
      variant: Variant,
      overrides: Partial<TypographyVariantsMap[Variant]> = {}
    ): TextStyle => {
      const variantStyle = theme.typography.variants[variant];
      if (__DEV__ && !variantStyle) {
        console.warn(`Variante tipográfica "${String(variant)}" não encontrada`);
      }
      return {
        color: color('textPrimary'),
        ...(variantStyle as TypographyVariantsMap[Variant]),
        ...overrides,
      } as TextStyle;
    };

    const shadow = (token: ThemeShadowToken): ViewStyle => {
      const value = theme.shadows[token] as ViewStyle | undefined;
      if (__DEV__ && value === undefined) {
        console.warn(`Token de sombra "${String(token)}" não encontrado no tema atual`);
      }
      return value ?? ({} as ViewStyle);
    };

    return {
      theme,
      color,
      space,
      radius,
      text,
      shadow,
    };
  }, [theme]);

  const makeStyles = useCallback(
    <T extends NamedStyles>(factory: MakeStylesFactory<T>) => {
      return StyleSheet.create(factory({ ...helpers, makeStyles } as ThemeHelpers));
    },
    [helpers]
  );

  return {
    ...helpers,
    makeStyles,
  };
}
