/**
 * GradientView Component - Gradiente Maternal Acolhedor
 *
 * Componente para criar gradientes suaves e acolhedores
 * Baseado no tema Bubblegum com tons rosa e azul
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { colors, borderRadius } from '@/theme/colors';

// Expo Linear Gradient (opcional)
let LinearGradient: any = null;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (e) {
  // expo-linear-gradient não disponível, usar fallback
}

export type GradientVariant = 'maternal' | 'soft' | 'warm' | 'calm' | 'sunset';

export interface GradientViewProps {
  /** Conteúdo do gradiente */
  children?: React.ReactNode;

  /** Variante do gradiente */
  variant?: GradientVariant;

  /** Direção do gradiente (padrão: vertical) */
  direction?: 'horizontal' | 'vertical' | 'diagonal';

  /** Border radius */
  borderRadius?: number;

  /** Estilo customizado */
  style?: ViewStyle;

  /** Opacidade do gradiente (0-1) */
  opacity?: number;
}

/**
 * Cores dos gradientes baseados no tema Bubblegum
 */
const gradientColors = {
  maternal: {
    start: '#F0E7F0', // background (rosa muito claro)
    middle: '#FFF5F7', // rosa pastel
    end: '#E0F0F5', // azul calma claro
  },
  soft: {
    start: '#FFF5F7', // rosa pastel
    middle: '#FFE3E8', // rosa suave
    end: '#FFFFFF', // branco
  },
  warm: {
    start: '#FFF5F7', // rosa pastel
    middle: '#FFE3E8', // rosa suave
    end: '#EDD8B1', // amarelo pastel
  },
  calm: {
    start: '#E0F0F5', // azul calma claro
    middle: '#B8D8E8', // azul pastel
    end: '#F0E7F0', // rosa muito claro
  },
  sunset: {
    start: '#EDD8B1', // amarelo pastel
    middle: '#FFE3E8', // rosa suave
    end: '#DD5B9A', // rosa vibrante
  },
};

/**
 * Direções do gradiente
 */
const getGradientDirection = (direction: 'horizontal' | 'vertical' | 'diagonal') => {
  switch (direction) {
    case 'horizontal':
      return { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } };
    case 'diagonal':
      return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
    default: // vertical
      return { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
  }
};

export const GradientView: React.FC<GradientViewProps> = ({
  children,
  variant = 'maternal',
  direction = 'vertical',
  borderRadius: customBorderRadius,
  style,
  opacity = 1,
}) => {
  const gradient = gradientColors[variant];
  const gradientDirection = getGradientDirection(direction);

  // Se LinearGradient não estiver disponível, usar View sólida
  if (!LinearGradient) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: gradient.start, opacity },
          customBorderRadius !== undefined && { borderRadius: customBorderRadius },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[gradient.start, gradient.middle, gradient.end]}
      start={gradientDirection.start}
      end={gradientDirection.end}
      style={[
        styles.container,
        customBorderRadius !== undefined && { borderRadius: customBorderRadius },
        style,
        { opacity },
      ]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
});

