/**
 * Componente de grupo de radio buttons
 * Permite seleção única
 */

import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/theme/nathTheme';

interface RadioOption<T = string> {
  value: T;
  label: string;
  description?: string;
}

interface RadioGroupProps<T = string> {
  options: RadioOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  style?: ViewStyle;
}

export const RadioGroup = React.memo<RadioGroupProps>(({ options, value, onChange, style }) => {
  const handlePress = useCallback(
    (optionValue: any) => {
      onChange(optionValue);
    },
    [onChange]
  );

  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <TouchableOpacity
            key={option.value as string}
            style={[styles.radio, isSelected && styles.radioSelected]}
            onPress={() => handlePress(option.value)}
            accessible={true}
            accessibilityLabel={option.label}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            activeOpacity={0.7}
          >
            <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
              {isSelected && <View style={styles.radioDot} />}
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>{option.label}</Text>
              {option.description && <Text style={styles.description}>{option.description}</Text>}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

RadioGroup.displayName = 'RadioGroup';

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  radioSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  radioCircleSelected: {
    borderColor: theme.colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '400',
    lineHeight: 18,
  },
});

