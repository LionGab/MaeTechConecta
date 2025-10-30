import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Logo } from './Logo';

interface WelcomeHeaderProps {
  name: string;
  pregnancyWeek?: number;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ name, pregnancyWeek }) => {
  return (
    <View style={styles.container}>
      <Logo size={80} />
      <Text style={styles.greeting}>Olá, {name}! 👋</Text>
      {pregnancyWeek && (
        <Text style={styles.subGreeting}>Semana {pregnancyWeek} de gestação 💕</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    marginTop: 10,
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
});

