import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
  style?: any;
}

export const Logo: React.FC<LogoProps> = ({ size = 80, style }) => {
  // Placeholder para logo - substitua pela URL da imagem real
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <View style={[styles.logoCircle, { width: size, height: size, borderRadius: size / 2 }]}>
        {/* Aqui irá a imagem real quando disponível */}
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
    backgroundColor: '#FFB6D4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E91E63',
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
    backgroundColor: '#8B4513',
    borderRadius: 20,
    position: 'absolute',
    top: -10,
  },
  face: {
    width: '70%',
    height: '70%',
    backgroundColor: '#FDBCB4',
    borderRadius: 30,
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
    backgroundColor: '#333',
    borderRadius: 4,
  },
  smile: {
    width: 20,
    height: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#E91E63',
    borderRadius: 50,
    marginTop: '15%',
    marginLeft: '20%',
  },
  baby: {
    position: 'absolute',
    bottom: '5%',
    width: '40%',
    height: '35%',
    backgroundColor: '#F5DEB3',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E91E63',
  },
});

