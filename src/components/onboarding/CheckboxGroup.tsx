/**
 * Componente de grupo de checkboxes
 * Permite múltipla seleção
 */

import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '@/theme/nathTheme';

interface CheckboxOption<T = string> {
  value: T;
  label: string;
  description?: string;
}

interface CheckboxGroupProps<T = string> {
  options: CheckboxOption<T>[];
  value: T[];
  onChange: (values: T[]) => void;
  style?: ViewStyle;
  maxSelect?: number;
}

export const CheckboxGroup = React.memo<CheckboxGroupProps>(({ options, value, onChange, style, maxSelect }) => {
  const handleToggle = useCallback(
    (optionValue: string) => {
      const newValue = value.includes(optionValue as any)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue as any];

      // Respeitar limite de seleção
      if (maxSelect && newValue.length > maxSelect) {
        return;
      }

      onChange(newValue);
    },
    [value, onChange, maxSelect]
  );

  const isDisabled = (optionValue: string) => {
    return maxSelect && value.length >= maxSelect && !value.includes(optionValue as any);
  };

  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const isSelected = value.includes(option.value as any);
        const disabled = isDisabled(option.value as string);

        return (
          <TouchableOpacity
            key={option.value as string}
            style={[styles.checkbox, isSelected && styles.checkboxSelected, disabled && styles.checkboxDisabled]}
            onPress={() => handleToggle(option.value as string)}
            disabled={disabled}
            accessible={true}
            accessibilityLabel={option.label}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected, disabled }}
            activeOpacity={0.7}
          >
            <View style={[styles.checkboxBox, isSelected && styles.checkboxBoxSelected]}>
              {isSelected && <Icon name="check" size={18} color={theme.colors.primary} />}
            </View>
            <View style={styles.content}>
              <Text style={[styles.label, disabled && styles.labelDisabled]}>{option.label}</Text>
              {option.description && (
                <Text style={[styles.description, disabled && styles.descriptionDisabled]}>{option.description}</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

CheckboxGroup.displayName = 'CheckboxGroup';

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  checkboxSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.card,
  },
  checkboxBoxSelected: {
    borderColor: theme.colors.primary,
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
  labelDisabled: {
    opacity: 0.6,
  },
  description: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '400',
  },
  descriptionDisabled: {
    opacity: 0.5,
  },
});

