import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Logo } from '@/components/Logo';
import { PrimaryButton } from '@/shared/components';
import useThemeStyles from '@/shared/hooks/useThemeStyles';

interface HeroSectionProps {
  gradient: [string, string];
  userName: string;
  pregnancyWeek: number | null;
  message: string;
  onPressPlan: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  gradient,
  userName,
  pregnancyWeek,
  message,
  onPressPlan,
}) => {
  const { color, makeStyles, text } = useThemeStyles();
  const styles = makeStyles(({ space, radius }) => ({
    hero: {
      borderRadius: radius('2xl'),
      padding: space('xl'),
      overflow: 'hidden',
      gap: space('lg'),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    greeting: {
      ...text('title', { color: color('textOnAccent') }),
      flexShrink: 1,
      marginLeft: space('md'),
    },
    week: {
      ...text('bodySmall', { color: color('textOnAccent') }),
      opacity: 0.85,
    },
    quote: {
      ...text('headline', { color: color('textOnAccent') }),
    },
    buttonSpacing: {
      marginTop: space('sm'),
    },
  }));

  return (
    <LinearGradient colors={gradient} style={styles.hero}>
      <View style={styles.header}>
        <Logo size={48} />
        <View>
          <Text style={styles.greeting}>Olá, {userName}!</Text>
          {pregnancyWeek ? <Text style={styles.week}>Semana {pregnancyWeek} de gestação</Text> : null}
        </View>
      </View>
      <Text style={styles.quote}>{message}</Text>
      <PrimaryButton
        label="Ver plano"
        onPress={onPressPlan}
        fullWidth
        style={styles.buttonSpacing}
        accessibilityHint="Abrir plano diário personalizado"
      />
    </LinearGradient>
  );
};

HeroSection.displayName = 'HeroSection';

