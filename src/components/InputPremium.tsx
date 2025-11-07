/**
 * 🌅 Input Premium - Tema "Amanhecer Sereno"
 * Campo de entrada com efeito glass e gradiente dourado
 *
 * Features:
 * - Efeito glassmorphism
 * - Gradiente dourado no focus
 * - Borda animada
 * - Ícones premium
 * - Validação visual elegante
 *
 * @example
 * // Input básico
 * <InputPremium
 *   label="Email"
 *   value={email}
 *   onChangeText={setEmail}
 *   icon="email"
 *   placeholder="seu@email.com"
 * />
 *
 * @example
 * // Input com validação
 * <InputPremium
 *   label="Senha"
 *   value={password}
 *   onChangeText={setPassword}
 *   error={passwordError}
 *   icon="lock"
 *   secureTextEntry
 *   required
 * />
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  Animated,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  sereneDawnColors,
  sereneDawnGradients,
  sereneDawnOverlay,
  sereneDawnTypography,
  sereneDawnSpacing,
  sereneDawnBorderRadius,
} from '@/theme/sereneDawn';
import { getShadowStyle } from '@/utils/platformStyles';

// =====================================================
// TIPOS
// =====================================================

export interface InputPremiumProps extends TextInputProps {
  /** Label acima do input */
  label?: string;

  /** Mensagem de erro */
  error?: string;

  /** Mensagem de ajuda */
  helperText?: string;

  /** Ícone (MaterialCommunityIcons) */
  icon?: string;

  /** Cor do ícone */
  iconColor?: string;

  /** Input obrigatório */
  required?: boolean;

  /** Estilo customizado do container */
  containerStyle?: ViewStyle;

  /** Usar efeito glass */
  useGlass?: boolean;
}

// =====================================================
// COMPONENTE
// =====================================================

const InputPremiumComponent: React.FC<InputPremiumProps> = ({
  label,
  error,
  helperText,
  icon,
  iconColor = sereneDawnColors.champagne,
  required = false,
  containerStyle,
  useGlass = true,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = React.useRef(new Animated.Value(0)).current;

  // Animação de focus com tipos corretos
  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      Animated.spring(focusAnim, {
        toValue: 1,
        useNativeDriver: false,
        speed: 50,
      }).start();
      textInputProps.onFocus?.(e);
    },
    [focusAnim, textInputProps.onFocus]
  );

  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      Animated.spring(focusAnim, {
        toValue: 0,
        useNativeDriver: false,
        speed: 50,
      }).start();
      textInputProps.onBlur?.(e);
    },
    [focusAnim, textInputProps.onBlur]
  );

  // Cor da borda animada
  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [sereneDawnOverlay.primaryBorder, sereneDawnColors.champagne],
  });

  // Brilho no focus (glow)
  const glowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  // Estilos memoizados
  const inputContainerStyle = useMemo(
    () => [styles.inputContainer, error && styles.inputContainerError, containerStyle],
    [error, containerStyle]
  );

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {/* Input Container */}
      <Animated.View
        style={[
          styles.inputContainer,
          inputContainerStyle,
          {
            borderColor: error ? sereneDawnColors.error : borderColor,
          },
          Platform.OS === 'web'
            ? getShadowStyle({
                shadowColor: error ? sereneDawnColors.error : sereneDawnColors.champagne,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 2.62,
                elevation: 4,
              })
            : {
                shadowColor: error ? sereneDawnColors.error : sereneDawnColors.champagne,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: glowOpacity,
                shadowRadius: 2.62,
                elevation: 4,
              },
        ]}
      >
        {/* Background Glass */}
        {useGlass && <View style={[StyleSheet.absoluteFill, { backgroundColor: sereneDawnOverlay.glass }]} />}

        {/* Gradiente sutil no focus */}
        {isFocused && (
          <LinearGradient
            colors={[sereneDawnOverlay.gold, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        )}

        {/* Ícone */}
        {icon && <Icon name={icon} size={20} color={error ? sereneDawnColors.error : iconColor} style={styles.icon} />}

        {/* Input */}
        <TextInput
          {...textInputProps}
          style={[styles.input, textInputProps.style]}
          placeholderTextColor={sereneDawnColors.slateBlue}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {/* Ícone de validação */}
        {error && <Icon name="alert-circle" size={20} color={sereneDawnColors.error} style={styles.validationIcon} />}
      </Animated.View>

      {/* Mensagem de erro ou ajuda */}
      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={14} color={sereneDawnColors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: sereneDawnSpacing.md,
  },
  label: {
    fontSize: sereneDawnTypography.sizes.sm,
    fontWeight: sereneDawnTypography.weights.semibold,
    color: sereneDawnColors.warmWhite,
    marginBottom: sereneDawnSpacing.xs,
    fontFamily: sereneDawnTypography.fontFamily.heading,
  },
  required: {
    color: sereneDawnColors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: sereneDawnBorderRadius.lg,
    paddingHorizontal: sereneDawnSpacing.md,
    minHeight: 52,
    overflow: 'hidden',
    ...getShadowStyle({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    }),
  },
  inputContainerError: {
    borderColor: sereneDawnColors.error,
  },
  icon: {
    marginRight: sereneDawnSpacing.sm,
  },
  input: {
    flex: 1,
    fontSize: sereneDawnTypography.sizes.base,
    color: sereneDawnColors.warmWhite,
    fontFamily: sereneDawnTypography.fontFamily.body,
    minHeight: 44, // Touch target
  },
  validationIcon: {
    marginLeft: sereneDawnSpacing.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: sereneDawnSpacing.xs,
    gap: sereneDawnSpacing.xs,
  },
  errorText: {
    fontSize: sereneDawnTypography.sizes.xs,
    color: sereneDawnColors.error,
    fontFamily: sereneDawnTypography.fontFamily.body,
  },
  helperText: {
    fontSize: sereneDawnTypography.sizes.xs,
    color: sereneDawnColors.slateBlue,
    marginTop: sereneDawnSpacing.xs,
    fontFamily: sereneDawnTypography.fontFamily.body,
  },
});

// Memoizar componente
export const InputPremium = React.memo(InputPremiumComponent);
