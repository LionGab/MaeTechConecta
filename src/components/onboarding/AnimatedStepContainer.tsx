/**
 * Contenedor animado para steps do onboarding
 * Anima transição entre steps com fade + slide
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown, withTiming, Easing } from 'react-native-reanimated';
import { theme } from '@/theme/nathTheme';

interface AnimatedStepContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  duration?: number;
}

export const AnimatedStepContainer = React.memo<AnimatedStepContainerProps>(({ children, style, duration = 300 }) => {
  return (
    <Animated.View
      style={[styles.container, style]}
      entering={FadeIn.duration(duration).springify()}
      exiting={FadeOut.duration(duration / 2)}
    >
      <View style={styles.inner}>{children}</View>
    </Animated.View>
  );
});

AnimatedStepContainer.displayName = 'AnimatedStepContainer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
});
