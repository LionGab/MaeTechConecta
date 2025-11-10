import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Platform } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

export interface SupportHeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onPressCTA: () => void;
  /** Texto do CTA secundário opcional */
  secondaryLabel?: string;
  /** Callback para CTA secundário */
  onPressSecondary?: () => void;
  /** Imagem emocional opcional para o cabeçalho */
  backgroundImage?: { uri: string };
}

/**
 * Hero acolhedor para mães que buscam transformar dor em vitória.
 */
export const SupportHero: React.FC<SupportHeroProps> = React.memo(
  ({ title, subtitle, ctaLabel, onPressCTA, secondaryLabel, onPressSecondary, backgroundImage }) => {
    const { colors, spacing, borderRadius, typography } = useTheme();

    const borderRadiusValue = borderRadius.lg;

    const containerStyle = useMemo(
      () => [
        styles.container,
        {
          paddingTop: spacing.lg,
          paddingBottom: spacing.lg,
          paddingHorizontal: spacing.lg,
          backgroundColor: colors.primary,
          borderRadius: borderRadiusValue,
        },
      ],
      [borderRadiusValue, colors.primary, spacing.lg]
    );

    const titleStyle = useMemo(
      () => [styles.title, typography.display, { color: colors.onPrimary }],
      [colors.onPrimary, typography.display]
    );

    const subtitleStyle = useMemo(
      () => [styles.subtitle, typography.body, { color: colors.onPrimary, opacity: 0.9 }],
      [colors.onPrimary, typography.body]
    );

    const primaryButtonStyle = useMemo(
      () => [
        styles.button,
        {
          backgroundColor: colors.accent,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          borderRadius: borderRadius.md,
        },
      ],
      [borderRadius.md, colors.accent, spacing.lg, spacing.md]
    );

    const secondaryButtonStyle = useMemo(
      () => [
        styles.button,
        styles.secondaryButton,
        {
          borderColor: colors.onPrimary,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          borderRadius: borderRadius.md,
        },
      ],
      [borderRadius.md, colors.onPrimary, spacing.lg, spacing.md]
    );

    const handlePrimaryPress = useCallback(() => {
      console.log('SupportHero:onPressCTA');
      onPressCTA();
    }, [onPressCTA]);

    const handleSecondaryPress = useCallback(() => {
      if (!onPressSecondary) return;
      console.log('SupportHero:onPressSecondary');
      onPressSecondary();
    }, [onPressSecondary]);

    const content = (
      <View style={containerStyle}>
        <Text style={titleStyle} accessible accessibilityRole="header" accessibilityLabel={title}>
          {title}
        </Text>

        <Text style={subtitleStyle} accessibilityLabel={subtitle} accessibilityHint="Mensagem de apoio">
          {subtitle}
        </Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[primaryButtonStyle, styles.actionButton]}
            onPress={handlePrimaryPress}
            accessibilityRole="button"
            accessibilityLabel={ctaLabel}
            accessibilityHint="Vai orientar primeiro passo para transformar dor em vitória"
            activeOpacity={0.88}
          >
            <Text style={[typography.button, { color: colors.onPrimary }]}>{ctaLabel}</Text>
          </TouchableOpacity>

          {secondaryLabel && onPressSecondary ? (
            <TouchableOpacity
              style={[secondaryButtonStyle, styles.actionButton, styles.secondaryAction]}
              onPress={handleSecondaryPress}
              accessibilityRole="button"
              accessibilityLabel={secondaryLabel}
              accessibilityHint="Opção secundária de suporte"
              activeOpacity={0.88}
            >
              <Text style={[typography.button, { color: colors.onPrimary }]}>{secondaryLabel}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );

    if (!backgroundImage) {
      return content;
    }

    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        imageStyle={{ borderRadius: borderRadiusValue }}
        accessibilityRole="image"
        accessibilityLabel="Imagem de mãe acolhida"
      >
        {content}
      </ImageBackground>
    );
  }
);

SupportHero.displayName = 'SupportHero';

const styles = StyleSheet.create({
  container: {
    minHeight: 220,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  button: {
    minWidth: 160,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: Platform.select({ ios: 12, android: 12, default: 16 }) ?? 12,
    marginBottom: 12,
  },
  secondaryAction: {
    marginRight: 0,
  },
  secondaryButton: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
  },
});

export default SupportHero;
