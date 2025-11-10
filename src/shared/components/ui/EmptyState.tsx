import React, { useMemo } from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

import useThemeStyles from '@/shared/hooks/useThemeStyles';

import { GhostButton } from './GhostButton';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateAction {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  testID?: string;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  illustration?: React.ReactNode;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
}

const BaseEmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  illustration,
  primaryAction,
  secondaryAction,
  containerStyle,
  titleStyle,
  descriptionStyle,
}) => {
  const { text, makeStyles } = useThemeStyles();

  // Layout centrado com espaçamento generoso para reforçar a mensagem de vazio.
  const styles = useMemo(
    () =>
      makeStyles(({ color: themeColor, space: themeSpace }) => ({
        container: {
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: themeSpace('xl'),
          paddingVertical: themeSpace('xl'),
          gap: themeSpace('lg'),
        },
        illustrationWrapper: {
          width: '100%',
          alignItems: 'center',
        },
        textBlock: {
          alignItems: 'center',
          gap: themeSpace('sm'),
        },
        title: {
          ...text('headline', { color: themeColor('textPrimary') }),
          textAlign: 'center',
        },
        description: {
          ...text('body', {
            color: themeColor('textSecondary'),
          }),
          textAlign: 'center',
        },
        actions: {
          width: '100%',
          gap: themeSpace('sm'),
        },
      })),
    [makeStyles, text]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {illustration ? <View style={styles.illustrationWrapper}>{illustration}</View> : null}

      <View style={styles.textBlock}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <Text style={[styles.description, descriptionStyle]}>{description}</Text>
      </View>

      {(primaryAction || secondaryAction) && (
        <View style={styles.actions}>
          {/* Ações empilhadas para manter foco visual na chamada principal */}
          {primaryAction ? (
            <PrimaryButton
              label={primaryAction.label}
              onPress={primaryAction.onPress}
              icon={primaryAction.icon}
              testID={primaryAction.testID}
              fullWidth
            />
          ) : null}
          {secondaryAction ? (
            <GhostButton
              label={secondaryAction.label}
              onPress={secondaryAction.onPress}
              icon={secondaryAction.icon}
              testID={secondaryAction.testID}
              fullWidth
            />
          ) : null}
        </View>
      )}
    </View>
  );
};

export const EmptyState = React.memo(BaseEmptyState);
EmptyState.displayName = 'EmptyState';

