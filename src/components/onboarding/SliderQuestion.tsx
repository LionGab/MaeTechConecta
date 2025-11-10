/**
 * Componente de slider para perguntas de escala (1-10)
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Slider from '@react-native-community/slider';
import { theme } from '@/theme/nathTheme';

interface SliderQuestionProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
  showValue?: boolean;
  style?: ViewStyle;
}

export const SliderQuestion = React.memo<SliderQuestionProps>(
  ({
    label,
    value,
    onChange,
    min = 1,
    max = 10,
    leftLabel = 'Baixo',
    rightLabel = 'Alto',
    showValue = true,
    style,
  }) => {
    const handleValueChange = useCallback(
      (val: number) => {
        onChange(Math.round(val));
      },
      [onChange]
    );

    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          {showValue && (
            <View style={styles.valueBadge}>
              <Text style={styles.valueText}>{value}</Text>
            </View>
          )}
        </View>

        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          value={value}
          onValueChange={handleValueChange}
          step={1}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.border}
          thumbTintColor={theme.colors.primary}
          accessible={true}
          accessibilityRole="adjustable"
          accessibilityLabel={label}
          accessibilityValue={{ min, max, now: value, text: `${value}` }}
        />

        <View style={styles.labels}>
          <Text style={styles.limitLabel}>{leftLabel}</Text>
          <Text style={styles.limitLabel}>{rightLabel}</Text>
        </View>
      </View>
    );
  }
);

SliderQuestion.displayName = 'SliderQuestion';

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    flex: 1,
  },
  valueBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  limitLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '400',
  },
});
