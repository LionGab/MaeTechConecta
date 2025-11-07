import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { PrimaryButton, SectionHeader, SurfaceCard } from '@/shared/components';
import useThemeStyles from '@/shared/hooks/useThemeStyles';
import type { GradientKey, QuickAction } from '../types';

interface QuickActionsSectionProps {
  actions: QuickAction[];
  gradients: Record<GradientKey, [string, string]>;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({ actions, gradients }) => {
  const { color, space, text, makeStyles } = useThemeStyles();

  const styles = makeStyles(({ radius }) => ({
    container: {
      gap: space('md'),
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: space('md'),
    },
    card: {
      flex: 1,
      minWidth: '45%',
    },
    gradient: {
      borderRadius: radius('xl'),
      padding: space('lg'),
      alignItems: 'center',
    },
    emoji: {
      ...text('headline'),
      color: color('textOnAccent'),
      textAlign: 'center',
    },
    label: {
      ...text('bodySmall'),
      color: color('textOnAccent'),
      textAlign: 'center',
      marginTop: space('sm'),
      fontWeight: '600',
    },
    buttonSpacing: {
      marginTop: space('sm'),
    },
  }));

  return (
    <SurfaceCard padding="lg" elevation="sm" style={styles.container}>
      <SectionHeader title="Ações rápidas" subtitle="Escolha o próximo passo que faz sentido agora" />
      <View style={styles.grid}>
        {actions.map((action) => (
          <SurfaceCard key={action.key} padding="lg" elevation="xs" rounded="xl" style={styles.card}>
            <LinearGradient colors={gradients[action.gradientKey]} style={styles.gradient}>
              <Text style={styles.emoji}>{action.emoji}</Text>
              <Text style={styles.label}>{action.label}</Text>
            </LinearGradient>
            <PrimaryButton
              label="Abrir"
              onPress={action.onPress}
              fullWidth
              style={styles.buttonSpacing}
              accessibilityLabel={action.accessibilityLabel}
            />
          </SurfaceCard>
        ))}
      </View>
    </SurfaceCard>
  );
};

QuickActionsSection.displayName = 'QuickActionsSection';
