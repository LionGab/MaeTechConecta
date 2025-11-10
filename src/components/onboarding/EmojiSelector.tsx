/**
 * Componente para seleção visual de emojis
 * Usado em questões de emoção
 */

import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/theme/nathTheme';
import { Emotion, EMOTION_EMOJIS } from '@/types/onboarding';

interface EmojiOption {
  value: Emotion;
  emoji: string;
  label: string;
}

interface EmojiSelectorProps {
  value: Emotion | undefined;
  onChange: (value: Emotion) => void;
  options: EmojiOption[];
  style?: ViewStyle;
}

export const EmojiSelector = React.memo<EmojiSelectorProps>(
  ({ value, onChange, options, style }) => {
    const handlePress = useCallback(
      (optionValue: Emotion) => {
        onChange(optionValue);
      },
      [onChange]
    );

    return (
      <View style={[styles.container, style]}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              value === option.value && styles.optionSelected,
            ]}
            onPress={() => handlePress(option.value)}
            accessible={true}
            accessibilityLabel={option.label}
            accessibilityRole="radio"
            accessibilityState={{ selected: value === option.value }}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{option.emoji}</Text>
            <Text style={styles.label}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
);

EmojiSelector.displayName = 'EmojiSelector';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  option: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  optionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  emoji: {
    fontSize: 40,
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text,
    textAlign: 'center',
  },
});
