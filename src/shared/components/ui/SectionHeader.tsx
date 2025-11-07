import React, { useMemo } from 'react';
import { Pressable, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

import useThemeStyles from '@/shared/hooks/useThemeStyles';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onActionPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}

const BaseSectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  actionLabel,
  onActionPress,
  containerStyle,
  titleStyle,
  subtitleStyle,
}) => {
  const { space, text, makeStyles } = useThemeStyles();

  // Header com tipografia consistente e espaçamento previsível.
  const styles = useMemo(
    () =>
      makeStyles(({ color: themeColor, space: themeSpace }) => ({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: themeSpace('md'),
          paddingVertical: themeSpace('sm'),
        },
        textStack: {
          flexDirection: 'row',
          alignItems: 'center',
          flexShrink: 1,
        },
        icon: {
          marginRight: themeSpace('sm'),
        },
        title: {
          ...text('title', { color: themeColor('textPrimary') }),
        },
        subtitle: {
          ...text('bodySmall', {
            color: themeColor('textSecondary'),
          }),
          marginTop: themeSpace('xs'),
        },
        subtitleWrapper: {
          marginLeft: themeSpace('sm'),
        },
        action: {
          paddingHorizontal: themeSpace('sm'),
          paddingVertical: themeSpace('xs'),
        },
        actionLabel: {
          ...text('bodySmall', { color: themeColor('primary') }),
        },
      })),
    [makeStyles, text],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={{ flex: 1 }}>
        <View style={styles.textStack}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <Text style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        </View>
        {subtitle ? (
          <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          style={styles.action}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={space('xs')}
        >
          {/* Ação minimalista para não competir com o título */}
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export const SectionHeader = React.memo(BaseSectionHeader);
SectionHeader.displayName = 'SectionHeader';
