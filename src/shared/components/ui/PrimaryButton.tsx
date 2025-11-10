import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
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

/**
 * Botão principal com preenchimento sólido.
 *
 * Usa tokens do tema para garantir consistência visual e acessibilidade.
 */
export interface PrimaryButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const BasePrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}) => {
  const { color, space, text, shadow, makeStyles } = useThemeStyles();

  // Memoizamos estilos para evitar recomputações em cada render.
  const styles = useMemo(
    () =>
      makeStyles(({ color: themeColor, space: themeSpace, radius: themeRadius }) => ({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: themeColor('primary'),
          paddingVertical: themeSpace('md'),
          paddingHorizontal: themeSpace('xl'),
          borderRadius: themeRadius('xl'),
          minHeight: 52,
          opacity: disabled ? 0.6 : 1,
        },
        containerFullWidth: {
          alignSelf: 'stretch',
        },
        content: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        iconWrapper: {
          marginRight: themeSpace('sm'),
        },
        pressed: {
          opacity: 0.92,
        },
        label: {
          ...text('button', { color: themeColor('textOnPrimary') }),
        },
        labelLoading: {
          opacity: 0.8,
        },
      })),
    [disabled, makeStyles, text]
  );

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      // Evita múltiplos disparos enquanto o botão está desabilitado ou carregando.
      if (disabled || loading) {
        return;
      }
      onPress?.(event);
    },
    [disabled, loading, onPress]
  );

  return (
    <Pressable
      {...rest}
      onPress={handlePress}
      // Aplicamos tokens do tema + feedback visual quando o botão é pressionado.
      style={({ pressed }) => [
        styles.container,
        shadow('md'),
        fullWidth ? styles.containerFullWidth : null,
        pressed ? styles.pressed : null,
        style,
      ]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      hitSlop={space('xs')}
    >
      <View style={styles.content} pointerEvents="none">
        {/* Indicador de carregamento ou ícone à esquerda */}
        {loading ? (
          <ActivityIndicator size="small" color={color('textOnPrimary')} />
        ) : icon ? (
          <View style={styles.iconWrapper}>{icon}</View>
        ) : null}

        {/* Texto mantém legibilidade mesmo em estados carregando/disabled */}
        <Text style={[styles.label, loading ? styles.labelLoading : null, textStyle]}>{label}</Text>
      </View>
    </Pressable>
  );
};

export const PrimaryButton = React.memo(BasePrimaryButton);
PrimaryButton.displayName = 'PrimaryButton';
