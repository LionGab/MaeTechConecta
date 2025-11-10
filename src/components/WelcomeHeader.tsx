import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { Logo } from './Logo';

interface WelcomeHeaderProps {
  name: string;
  pregnancyWeek?: number;
}

/**
 * WelcomeHeader Component - Sistema de Design Bubblegum
 *
 * Cabeçalho de boas-vindas personalizado com logo, nome e semana de gestação.
 * Otimizado para acessibilidade com roles semânticos.
 */
const WelcomeHeaderComponent: React.FC<WelcomeHeaderProps> = ({ name, pregnancyWeek }) => {
  const { spacing, typography, colors } = useTheme();
  const largeSpacing = spacing.lg;
  const mediumSpacing = spacing.md;
  const smallSpacing = spacing.xs;
  const headingSize = typography.sizes['2xl'];
  const bodySize = typography.sizes.base;
  const headingWeight = typography.weights.bold;
  const bodyWeight = typography.weights.normal;
  const fontFamilySans = typography.fontFamily.sans;

  const containerStyle = useMemo<ViewStyle>(
    () => ({
      paddingVertical: largeSpacing,
    }),
    [largeSpacing]
  );

  const greetingStyle = useMemo<TextStyle>(
    () => ({
      fontSize: headingSize,
      fontWeight: headingWeight,
      color: colors.primary,
      marginTop: mediumSpacing,
      fontFamily: fontFamilySans,
    }),
    [colors.primary, fontFamilySans, headingSize, headingWeight, mediumSpacing]
  );

  const subtitleStyle = useMemo<TextStyle>(
    () => ({
      fontSize: bodySize,
      fontWeight: bodyWeight,
      color: colors.textSecondary ?? colors.mutedForeground,
      marginTop: smallSpacing,
      fontFamily: fontFamilySans,
    }),
    [bodySize, bodyWeight, colors.mutedForeground, colors.textSecondary, fontFamilySans, smallSpacing]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Logo size={80} />
      <Text style={greetingStyle} accessibilityRole="header" accessibilityLabel={`Olá, ${name}`}>
        Olá, {name}! 👋
      </Text>
      {typeof pregnancyWeek === 'number' && (
        <Text
          style={subtitleStyle}
          accessibilityRole="text"
          accessibilityLabel={`Você está na semana ${pregnancyWeek} de gestação`}
        >
          Semana {pregnancyWeek} de gestação 💕
        </Text>
      )}
    </View>
  );
};

export const WelcomeHeader = memo(WelcomeHeaderComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
