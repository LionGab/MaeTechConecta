import React, { useMemo } from 'react';
import { Pressable, PressableProps, StyleProp, View, ViewProps, ViewStyle } from 'react-native';

import useThemeStyles from '@/shared/hooks/useThemeStyles';

type SurfaceCardElevation = 'none' | 'xs' | 'sm' | 'md' | 'lg';

export interface SurfaceCardProps extends ViewProps {
  elevation?: SurfaceCardElevation;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'md' | 'lg' | 'xl' | '2xl';
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
}

const ELEVATION_MAP: Record<Exclude<SurfaceCardElevation, 'none'>, 'xs' | 'sm' | 'md' | 'lg'> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

const BaseSurfaceCard: React.FC<React.PropsWithChildren<SurfaceCardProps>> = ({
  elevation = 'md',
  padding = 'lg',
  rounded = 'xl',
  onPress,
  style,
  children,
  ...rest
}) => {
  const { space, shadow, makeStyles } = useThemeStyles();

  // Cartão reutilizável com padding, raio e sombra derivados do tema.
  const styles = useMemo(
    () =>
      makeStyles(({ color: themeColor, space: themeSpace, radius: themeRadius }) => ({
        container: {
          backgroundColor: themeColor('surfacePrimary'),
          borderRadius: themeRadius(rounded),
          padding: padding === 'none' ? 0 : themeSpace(padding),
          borderWidth: 1,
          borderColor: themeColor('overlaySoft'),
        },
        pressFeedback: {
          opacity: 0.95,
        },
      })),
    [makeStyles, padding, rounded]
  );

  const elevationStyle = elevation === 'none' ? null : shadow(ELEVATION_MAP[elevation] ?? 'md');

  if (onPress) {
    return (
      <Pressable
        {...rest}
        onPress={onPress}
        // Usa estado pressed para comunicar interação sem perder a sombra.
        style={({ pressed }) => [styles.container, elevationStyle, pressed ? styles.pressFeedback : null, style]}
        accessibilityRole="button"
        accessibilityState={{ disabled: false, pressed: false }}
        accessible
        hitSlop={space('sm')}
      >
        {children}
      </Pressable>
    );
  }

  return (
    // Variante estática mantém mesma base visual para conteúdos não interativos.
    <View {...rest} style={[styles.container, elevationStyle, style]}>
      {children}
    </View>
  );
};

export const SurfaceCard = React.memo(BaseSurfaceCard);
SurfaceCard.displayName = 'SurfaceCard';
