import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../theme/colors';

interface LogoProps {
  size?: number;
  style?: any;
}

/**
 * Logo Component - Sistema de Design Bubblegum
 *
 * Logo ilustrativo do app Nossa Maternidade.
 * Componente decorativo (accessible={false}).
 */
export const Logo: React.FC<LogoProps> = ({ size = 80, style }) => {
  return (
    <View
      style={[styles.container, { width: size, height: size }, style]}
      accessible={false} // Componente decorativo
    >
      <View style={[styles.logoCircle, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={styles.placeholder}>
          <View style={styles.avatar}>
            <View style={styles.hair} />
            <View style={styles.face}>
              <View style={styles.eyes}>
                <View style={styles.eye} />
                <View style={styles.eye} />
              </View>
              <View style={styles.smile} />
            </View>
          </View>
          <View style={styles.baby} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    // Rosa claro - usando accent (amarelo pastel) como base do círculo
    backgroundColor: colors.secondary, // Azul pastel para suavidade
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary, // Rosa vibrante
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: '60%',
    height: '60%',
    position: 'relative',
    top: -5,
  },
  hair: {
    width: '100%',
    height: '40%',
    // Tom de cabelo - usando mutedForeground como aproximação
    backgroundColor: '#8B4513', // Mantido (não há equivalente no tema)
    borderRadius: borderRadius.lg,
    position: 'absolute',
    top: -10,
  },
  face: {
    width: '70%',
    height: '70%',
    // Tom de pele - usando accent (amarelo pastel claro)
    backgroundColor: colors.accent, // Amarelo pastel
    borderRadius: borderRadius.xl,
    position: 'absolute',
    top: '15%',
    left: '15%',
  },
  eyes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: '25%',
  },
  eye: {
    width: 8,
    height: 8,
    backgroundColor: colors.foreground, // Preto
    borderRadius: borderRadius.full,
  },
  smile: {
    width: 20,
    height: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary, // Rosa vibrante
    borderRadius: borderRadius.full,
    marginTop: '15%',
    marginLeft: '20%',
  },
  baby: {
    position: 'absolute',
    bottom: '5%',
    width: '40%',
    height: '35%',
    backgroundColor: colors.accent, // Amarelo pastel para bebê
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary, // Rosa vibrante
  },
});

