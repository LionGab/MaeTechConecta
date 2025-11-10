declare module 'expo-blur' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export interface BlurViewProps extends ViewProps {
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
  }

  export class BlurView extends Component<BlurViewProps> {}
}
