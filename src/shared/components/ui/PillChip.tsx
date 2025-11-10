import React, { useCallback, useMemo } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
  type GestureResponderEvent,
} from 'react-native';

import useThemeStyles from '@/shared/hooks/useThemeStyles';

export interface PillChipProps extends Omit<PressableProps, 'style'> {
  label: string;
  selected?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const BasePillChip: React.FC<PillChipProps> = ({
  label,
  selected = false,
  leadingIcon,
  trailingIcon,
  disabled = false,
  onPress,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}) => {
  const { space, text, makeStyles } = useThemeStyles();

  // Estilos ajustam automaticamente as cores conforme o estado selecionado.
  const styles = useMemo(
    () =>
      makeStyles(({ color: themeColor, space: themeSpace, radius: themeRadius }) => {
        const backgroundColor = selected ? themeColor('accent') : themeColor('bgMuted');
        const borderColor = selected ? themeColor('accentForeground') : themeColor('borderPrimary');

        return {
          container: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: themeSpace('xs'),
            paddingHorizontal: themeSpace('md'),
            borderRadius: themeRadius('full'),
            backgroundColor,
            borderWidth: 1,
            borderColor,
            opacity: disabled ? 0.5 : 1,
          },
          iconOffset: {
            marginRight: themeSpace('sm'),
          },
          iconTrailing: {
            marginLeft: themeSpace('sm'),
          },
          label: {
            ...text('bodySmall', {
              color: selected ? themeColor('textOnAccent') : themeColor('textPrimary'),
            }),
          },
          pressed: {
            transform: [{ scale: 0.97 }],
          },
        };
      }),
    [disabled, makeStyles, selected, text]
  );

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      // Evita alterar filtros quando chip estiver inativo.
      if (disabled) {
        return;
      }
      onPress?.(event);
    },
    [disabled, onPress]
  );

  return (
    <Pressable
      {...rest}
      onPress={handlePress}
      // Efeito de escala transmite feedback tátil nas interações.
      style={({ pressed }) => [styles.container, pressed && !disabled ? styles.pressed : null, style]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, selected }}
      hitSlop={space('xs')}
    >
      {leadingIcon ? <View style={styles.iconOffset}>{leadingIcon}</View> : null}
      <Text style={[styles.label, textStyle]}>{label}</Text>
      {trailingIcon ? <View style={styles.iconTrailing}>{trailingIcon}</View> : null}
    </Pressable>
  );
};

export const PillChip = React.memo(BasePillChip);
PillChip.displayName = 'PillChip';
