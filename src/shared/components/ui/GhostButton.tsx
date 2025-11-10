import React, { useCallback, useMemo } from 'react';
import {
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  type GestureResponderEvent,
} from 'react-native';

import useThemeStyles from '@/shared/hooks/useThemeStyles';

/**
 * Botão secundário com estilo "ghost" (sem preenchimento).
 *
 * Mantém tokens de cor e acessibilidade alinhados ao tema.
 */
type PointerEventsValue = ViewProps['pointerEvents'];

interface PointerEventsStyle extends ViewStyle {
  pointerEvents?: PointerEventsValue;
}

export interface GhostButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const BaseGhostButton: React.FC<GhostButtonProps> = ({
  label,
  icon,
  disabled = false,
  fullWidth = false,
  onPress,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}) => {
  const { color, space, text, makeStyles } = useThemeStyles();

  // Estilos derivados dos tokens para manter consistência com o design system.
  const styles = useMemo(
    () =>
      makeStyles(({ color: themeColor, space: themeSpace, radius }) => ({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius('xl'),
          borderWidth: 1,
          borderColor: themeColor('borderPrimary'),
          paddingVertical: themeSpace('sm'),
          paddingHorizontal: themeSpace('lg'),
          minHeight: 48,
          opacity: disabled ? 0.5 : 1,
        },
        fullWidth: {
          alignSelf: 'stretch',
        },
        content: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        icon: {
          marginRight: themeSpace('sm'),
          tintColor: themeColor('primary'),
        },
        label: {
          ...text('button', { color: themeColor('primary') }),
        },
        pressed: {
          backgroundColor: themeColor('overlaySoft'),
        },
      })),
    [disabled, makeStyles, text]
  );

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      // Ignora interações quando o botão está desabilitado.
      if (disabled) {
        return;
      }
      onPress?.(event);
    },
    [disabled, onPress]
  );

  // Web exige style.pointerEvents; plataformas nativas ainda dependem da prop pointerEvents.
  const contentPointerEventsStyle = useMemo<PointerEventsStyle | null>(
    () => (Platform.OS === 'web' ? { pointerEvents: 'none' } : null),
    []
  );
  const contentPointerEvents: PointerEventsValue | undefined = Platform.OS === 'web' ? undefined : 'none';

  return (
    <Pressable
      {...rest}
      onPress={handlePress}
      // Feedback visual sutil com pressed-state.
      style={({ pressed }) => [
        styles.container,
        fullWidth ? styles.fullWidth : null,
        pressed && !disabled ? styles.pressed : null,
        style,
      ]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      hitSlop={space('xs')}
    >
      <View style={[styles.content, contentPointerEventsStyle]} pointerEvents={contentPointerEvents}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text style={[styles.label, textStyle]}>{label}</Text>
      </View>
    </Pressable>
  );
};

export const GhostButton = React.memo(BaseGhostButton);
GhostButton.displayName = 'GhostButton';

