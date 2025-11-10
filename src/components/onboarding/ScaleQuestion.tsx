/**
 * Componente de escala (5 opções)
 * Usado para qualidade de sono, etc
 */

import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/theme/nathTheme';

interface ScaleOption {
  value: string;
  label: string;
  emoji?: string;
}

interface ScaleQuestionProps {
  value: string | undefined;
  onChange: (value: string) => void;
  options: ScaleOption[];
  style?: ViewStyle;
}

export const ScaleQuestion = React.memo<ScaleQuestionProps>(({ value, onChange, options, style }) => {
  const handlePress = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
    },
    [onChange]
  );

  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.option,
            value === option.value && styles.optionSelected,
            index === 0 && styles.optionFirst,
            index === options.length - 1 && styles.optionLast,
          ]}
          onPress={() => handlePress(option.value)}
          accessible={true}
          accessibilityLabel={option.label}
          accessibilityRole="radio"
          accessibilityState={{ selected: value === option.value }}
          activeOpacity={0.7}
        >
          {option.emoji && <Text style={styles.emoji}>{option.emoji}</Text>}
          <Text style={[styles.label, value === option.value && styles.labelSelected]} numberOfLines={2}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

ScaleQuestion.displayName = 'ScaleQuestion';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  option: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
  },
  optionFirst: {
    borderTopLeftRadius: theme.radius.md,
    borderBottomLeftRadius: theme.radius.md,
  },
  optionLast: {
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
  },
  optionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  emoji: {
    fontSize: 20,
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.text,
    textAlign: 'center',
  },
  labelSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

