import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/theme/nathTheme';

interface PillChipProps {
  text: string;
  icon?: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'urgent';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PillChip: React.FC<PillChipProps> = ({
  text,
  icon,
  onPress,
  disabled = false,
  variant = 'default',
  style,
  textStyle,
}) => {
  const isUrgent = variant === 'urgent';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isUrgent && styles.containerUrgent,
        disabled && styles.containerDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{ disabled }}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text
        style={[
          styles.text,
          isUrgent && styles.textUrgent,
          disabled && styles.textDisabled,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 44,
  },
  containerUrgent: {
    backgroundColor: 'rgba(255, 139, 163, 0.15)',
    borderColor: 'rgba(255, 139, 163, 0.3)',
  },
  containerDisabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.border,
  },
  icon: {
    fontSize: 20,
  },
  text: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
  },
  textUrgent: {
    color: theme.colors.accent,
    fontWeight: '700',
  },
  textDisabled: {
    color: theme.colors.textMuted,
  },
});
