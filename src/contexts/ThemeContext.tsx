/**
 * Theme Context - Gerenciamento de tema (Light/Dark Mode + Múltiplos Temas)
 *
 * Context para gerenciar tema global, preferências do usuário e seleção de temas
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getThemeColors, ThemeName, defaultTheme } from '@/theme/themes';
import type { ThemeColors } from '@/theme/themes';
import { createTheme, type Theme } from '@/theme';

type ThemeMode = 'light' | 'dark' | 'auto';

type ColorScale = Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>;

type ThemeBaseColors = Theme['colors'];

interface ThemeContextColors extends ThemeBaseColors, ThemeColors {
  primaryScale: ColorScale;
  secondaryScale: ColorScale;
  neutral: Record<0 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>;
  backgroundScale: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  success: string;
  warning: string;
  info: string;
  error: string;
  text: string;
  surface: string;
  textSecondary: string;
  onPrimary: string;
}

interface ThemeContextType {
  isDark: boolean;
  themeMode: ThemeMode;
  themeName: ThemeName;
  colors: ThemeContextColors;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setThemeName: (name: ThemeName) => void;
  theme: Theme;
  spacing: Theme['spacing'];
  typography: Theme['typography'];
  borderRadius: Theme['borderRadius'];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@nossa_maternidade:theme_mode';
const THEME_NAME_STORAGE_KEY = '@nossa_maternidade:theme_name';

function generateColorScale(baseColor: string, isDark: boolean): ColorScale {
  const scales = {
    50: isDark ? '#1A1A1A' : '#FFF5F7',
    100: isDark ? '#2D2D2D' : '#FFE3E8',
    200: isDark ? '#404040' : '#FFCCD5',
    300: isDark ? '#535353' : '#FFB0C0',
    400: isDark ? '#666666' : '#FF94AB',
    500: baseColor,
    600: isDark ? '#999999' : '#E8899A',
    700: isDark ? '#B3B3B3' : '#D66D86',
    800: isDark ? '#CCCCCC' : '#C45172',
    900: isDark ? '#E6E6E6' : '#B2355E',
  };

  return scales;
}

function generateNeutralScale(isDark: boolean) {
  return {
    0: '#FFFFFF',
    50: isDark ? '#1A1A1A' : '#FAFAFA',
    100: isDark ? '#2D2D2D' : '#F5F5F5',
    200: isDark ? '#404040' : '#E5E5E5',
    300: isDark ? '#535353' : '#D4D4D4',
    400: isDark ? '#666666' : '#A3A3A3',
    500: isDark ? '#808080' : '#737373',
    600: isDark ? '#A3A3A3' : '#525252',
    700: isDark ? '#CCCCCC' : '#404040',
    800: isDark ? '#E6E6E6' : '#262626',
    900: isDark ? '#FFFFFF' : '#171717',
  };
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [themeName, setThemeNameState] = useState<ThemeName>(defaultTheme);
  const [isDark, setIsDark] = useState<boolean>(true);

  const loadThemePreferences = useCallback(async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (!savedMode) {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, 'dark');
        setThemeModeState('dark');
      } else if (['light', 'dark', 'auto'].includes(savedMode)) {
        setThemeModeState(savedMode as ThemeMode);
      } else {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, 'dark');
        setThemeModeState('dark');
      }

      const savedThemeName = await AsyncStorage.getItem(THEME_NAME_STORAGE_KEY);
      if (savedThemeName && ['bubblegum', 'v0-app', 'mom-blue'].includes(savedThemeName)) {
        setThemeNameState(savedThemeName as ThemeName);
      }
    } catch (error) {
      console.error('Erro ao carregar preferências de tema:', error);
      setThemeModeState('dark');
    }
  }, []);

  useEffect(() => {
    loadThemePreferences();
  }, [loadThemePreferences]);

  useEffect(() => {
    const shouldBeDark = themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');
    setIsDark(shouldBeDark);
  }, [systemColorScheme, themeMode]);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Erro ao salvar preferência de tema:', error);
    }
  }, []);

  const setThemeName = useCallback(async (name: ThemeName) => {
    try {
      setThemeNameState(name);
      await AsyncStorage.setItem(THEME_NAME_STORAGE_KEY, name);
    } catch (error) {
      console.error('Erro ao salvar nome do tema:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  }, [isDark, setThemeMode]);

  const palette = useMemo(() => getThemeColors(themeName, isDark), [isDark, themeName]);
  const tokens = useMemo(() => createTheme(isDark), [isDark]);

  const colors = useMemo<ThemeContextColors>(
    () => ({
      ...tokens.colors,
      ...palette,
      primaryScale: generateColorScale(palette.primary, isDark),
      secondaryScale: generateColorScale(palette.secondary, isDark),
      neutral: generateNeutralScale(isDark),
      backgroundScale: {
        primary: palette.background,
        secondary: palette.card,
        tertiary: isDark ? '#1A1A1A' : '#FFFFFF',
      },
      success: '#81C784',
      warning: '#FFB74D',
      info: '#64B5F6',
      error: palette.destructive,
      text: palette.foreground,
      surface: palette.card,
      textSecondary: palette.mutedForeground,
      onPrimary: palette.primaryForeground,
    }),
    [isDark, palette, tokens.colors]
  );

  const theme = useMemo<Theme>(
    () => ({
      ...tokens,
      colors,
    }),
    [colors, tokens]
  );

  const value = useMemo<ThemeContextType>(
    () => ({
      isDark,
      themeMode,
      themeName,
      colors,
      toggleTheme,
      setThemeMode,
      setThemeName,
      theme,
      spacing: theme.spacing,
      typography: theme.typography,
      borderRadius: theme.borderRadius,
    }),
    [colors, isDark, setThemeMode, setThemeName, theme, themeMode, themeName, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

