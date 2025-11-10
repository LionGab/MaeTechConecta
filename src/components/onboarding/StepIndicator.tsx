/**
 * Indicador de progresso do onboarding
 * Mostra quantos steps foram completados
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '@/theme/nathTheme';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps?: number;
  style?: ViewStyle;
}

export const StepIndicator = React.memo<StepIndicatorProps>(
  ({ currentStep, totalSteps, completedSteps = 0, style }) => {
    const dots = useMemo(() => {
      return Array.from({ length: totalSteps }, (_, i) => {
        const isCompleted = i < completedSteps;
        const isCurrent = i === currentStep;

        return { index: i, isCompleted, isCurrent };
      });
    }, [totalSteps, completedSteps, currentStep]);

    return (
      <View style={[styles.container, style]}>
        {dots.map((dot, idx) => (
          <View
            key={dot.index}
            style={[styles.dot, dot.isCompleted && styles.dotCompleted, dot.isCurrent && styles.dotCurrent]}
          >
            {dot.isCompleted ? (
              <Icon name="check" size={12} color="#FFFFFF" />
            ) : (
              <View style={[styles.dotInner, dot.isCurrent && styles.dotInnerCurrent]} />
            )}
          </View>
        ))}

        {/* Label de progresso */}
        <Text style={styles.label}>
          {currentStep + 1} de {totalSteps}
        </Text>
      </View>
    );
  }
);

StepIndicator.displayName = 'StepIndicator';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotCompleted: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  dotCurrent: {
    borderColor: theme.colors.primary,
    borderWidth: 3,
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textMuted,
  },
  dotInnerCurrent: {
    backgroundColor: theme.colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    marginLeft: theme.spacing.md,
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textMuted,
  },
});

