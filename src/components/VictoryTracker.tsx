import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

export interface VictoryTrackerItem {
  label: string;
  achieved: number;
  goal: number;
}

export interface VictoryTrackerProps {
  items: VictoryTrackerItem[];
}

/**
 * Mini tracker para visualizar vitórias semanais.
 */
export const VictoryTracker: React.FC<VictoryTrackerProps> = React.memo(({ items }) => {
  const { colors, spacing, borderRadius, typography } = useTheme();

  const maxGoal = useMemo(() => {
    const computed = Math.max(...items.map((item) => item.goal), 1);
    console.log('VictoryTracker:maxGoal', computed);
    return computed;
  }, [items]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface ?? colors.card,
          borderColor: colors.border,
          padding: spacing.lg,
          borderRadius: borderRadius.md,
        },
      ]}
      accessibilityRole="summary"
      accessibilityLabel="Monitor de vitórias"
    >
      <Text style={[typography.subtitle, { color: colors.textPrimary ?? colors.foreground, marginBottom: spacing.md }]}>
        Vitórias recentes
      </Text>

      {items.map((item) => {
        const progress = Math.min(item.achieved / item.goal, 1);
        const widthPercentage = `${progress * 100}%`;

        return (
          <View key={item.label} style={styles.item} accessibilityRole="adjustable" accessibilityLabel={item.label}>
            <View style={styles.itemHeader}>
              <Text style={[typography.body, { color: colors.textPrimary ?? colors.foreground }]}>{item.label}</Text>
              <Text style={[typography.caption, { color: colors.textSecondary ?? colors.mutedForeground }]}>
                {item.achieved}/{item.goal}
              </Text>
            </View>

            <View
              style={[
                styles.progressTrack,
                {
                  backgroundColor: colors.muted,
                  borderRadius: borderRadius.sm,
                },
              ]}
              accessibilityRole="progressbar"
              accessibilityValue={{ min: 0, max: item.goal, now: item.achieved }}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: widthPercentage,
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.sm,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}

      <Text style={[typography.caption, styles.footer, { color: colors.textSecondary ?? colors.mutedForeground }]}>
        Meta máxima atual: {maxGoal}
      </Text>
    </View>
  );
});

VictoryTracker.displayName = 'VictoryTracker';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    width: '100%',
  },
  item: {
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTrack: {
    height: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  footer: {
    marginTop: 12,
  },
});

export default VictoryTracker;
