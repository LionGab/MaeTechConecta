/**
 * ThemeSelector Component
 *
 * Componente para selecionar tema (Bubblegum ou v0.app)
 *
 * @example
 * <ThemeSelector />
 */

import React, { memo, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeName } from '@/theme/themes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ThemeSelectorComponent: React.FC = () => {
  const { themeName, setThemeName, theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;
  const spacingLg = spacing.lg;
  const spacingMd = spacing.md;
  const headingSize = typography.sizes['2xl'];
  const bodySmSize = typography.sizes.sm;
  const labelSize = typography.sizes.lg;
  const boldWeight = typography.weights.bold;
  const mediumWeight = typography.weights.medium;
  const sansFont = typography.fontFamily.sans;

  const themes: Array<{ name: ThemeName; label: string; description: string }> = [
    {
      name: 'bubblegum',
      label: 'Bubblegum',
      description: 'Tema rosa acolhedor (padrão)',
    },
    {
      name: 'v0-app',
      label: 'v0.app',
      description: 'Tema moderno do v0.app',
    },
  ];

  const containerStyle = useMemo<ViewStyle>(
    () => ({
      paddingHorizontal: spacingLg,
      paddingVertical: spacingLg,
      backgroundColor: colors.background,
    }),
    [colors.background, spacingLg]
  );

  const titleStyle = useMemo<TextStyle>(
    () => ({
      fontSize: headingSize,
      fontWeight: boldWeight,
      color: colors.textPrimary ?? colors.foreground,
    }),
    [boldWeight, colors.foreground, colors.textPrimary, headingSize]
  );

  const subtitleStyle = useMemo<TextStyle>(
    () => ({
      fontSize: bodySmSize,
      color: colors.textSecondary ?? colors.mutedForeground,
      marginBottom: spacingMd,
    }),
    [bodySmSize, colors.mutedForeground, colors.textSecondary, spacingMd]
  );

  const baseCardStyle = useMemo<ViewStyle>(
    () => ({
      borderRadius: borderRadius.md,
      paddingVertical: spacingLg,
      paddingHorizontal: spacingLg,
      marginBottom: spacingMd,
      minHeight: 80,
      borderWidth: 1,
    }),
    [borderRadius.md, spacingLg, spacingMd]
  );

  const themeLabelBase = useMemo<TextStyle>(
    () => ({
      fontSize: labelSize,
    }),
    [labelSize]
  );

  const descriptionBase = useMemo<TextStyle>(
    () => ({
      fontSize: bodySmSize,
    }),
    [bodySmSize]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={titleStyle}>Escolher Tema</Text>
      <Text style={subtitleStyle}>Selecione o tema visual do app</Text>

      <ScrollView style={styles.themesList} contentContainerStyle={styles.themesListContent}>
        {themes.map((theme) => {
          const isSelected = themeName === theme.name;
          const primaryColor = typeof colors.primary === 'string' ? colors.primary : (colors.primary[500] ?? '#DD5B9A');
          const cardColor = typeof colors.card === 'string' ? colors.card : '#FFFFFF';
          const borderColorDefault = typeof colors.border === 'string' ? colors.border : '#E5E5E5';
          const foregroundColor = colors.textPrimary ?? colors.foreground;
          const mutedColor = colors.textSecondary ?? colors.mutedForeground;

          const cardStyle = {
            ...baseCardStyle,
            backgroundColor: isSelected ? primaryColor : cardColor,
            borderColor: isSelected ? primaryColor : borderColorDefault,
            borderWidth: isSelected ? 2 : 1,
          };

          const labelStyle = {
            ...themeLabelBase,
            color: isSelected ? colors.primaryForeground : foregroundColor,
            fontWeight: isSelected ? boldWeight : mediumWeight,
            fontFamily: sansFont,
          };

          const descriptionStyle = {
            ...descriptionBase,
            color: isSelected ? colors.primaryForeground : mutedColor,
            fontFamily: sansFont,
          };

          return (
            <TouchableOpacity
              key={theme.name}
              style={cardStyle}
              onPress={() => setThemeName(theme.name)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Selecionar tema ${theme.label}`}
              accessibilityHint={theme.description}
              accessibilityState={{ selected: isSelected }}
            >
              <View style={styles.themeContent}>
                <View style={styles.themeInfo}>
                  <Text style={labelStyle}>{theme.label}</Text>
                  <Text style={descriptionStyle}>{theme.description}</Text>
                </View>

                {isSelected && (
                  <Icon name="check-circle" size={24} color={colors.primaryForeground} style={styles.checkIcon} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export const ThemeSelector = memo(ThemeSelectorComponent);

const styles = StyleSheet.create({
  container: {},
  themesList: {
    flex: 1,
  },
  themesListContent: {
    paddingBottom: 24,
  },
  themeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeInfo: {
    flex: 1,
  },
  checkIcon: {
    marginLeft: 12,
  },
});

