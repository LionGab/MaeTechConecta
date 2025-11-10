import type { Theme } from '@/theme';

export type GradientKey = keyof Theme['gradients'];

export interface QuickAction {
  key: string;
  label: string;
  emoji: string;
  gradientKey: GradientKey;
  onPress: () => void;
  accessibilityLabel: string;
}

