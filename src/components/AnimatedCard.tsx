/**
 * AnimatedCard Component - Card com animações suaves
 *
 * Card aprimorado com animações de entrada e microinterações
 * Melhora a experiência visual e feedback ao usuário
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { Animated, ViewStyle } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { shouldUseNativeDriver } from '@/utils/animations';

import { Card, CardProps } from './Card';

export interface AnimatedCardProps extends CardProps {
  /** Animação de entrada (fade + scale) */
  animated?: boolean;

  /** Delay da animação (ms) */
  delay?: number;

  /** Duração da animação (ms) */
  duration?: number;

  /** Efeito de hover/press mais pronunciado */
  enhancedPress?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  animated = true,
  delay = 0,
  duration = 300,
  enhancedPress = false,
  style,
  ...cardProps
}) => {
  const { theme } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: shouldUseNativeDriver,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          delay,
          useNativeDriver: shouldUseNativeDriver,
        }),
      ]).start();
    }
  }, [animated, delay, duration, fadeAnim, scaleAnim]);

  const animatedStyle: ViewStyle = useMemo(
    () =>
      animated
        ? {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        : {},
    [animated, fadeAnim, scaleAnim]
  );

  const elevatedShadow = theme.shadows.lg;

  const enhancedStyle = useMemo(() => (enhancedPress ? elevatedShadow : undefined), [enhancedPress, elevatedShadow]);

  return (
    <Animated.View style={[animatedStyle, style, enhancedStyle]}>
      <Card {...cardProps} />
    </Animated.View>
  );
};

