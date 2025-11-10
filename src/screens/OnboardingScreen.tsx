import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { Button } from '@/components/Button';
import { SupportHero } from '@/components/SupportHero';
import { SupportCard } from '@/components/SupportCard';
import { VictoryTracker } from '@/components/VictoryTracker';
import { useTheme } from '@/contexts/ThemeContext';

interface OnboardingScreenProps {
  onComplete?: () => void;
}

const COMPLETED_KEY = '@nossa_maternidade:onboarding_completed';

const FORCE_WORDS = [
  {
    id: 'forca',
    author: 'NathIA',
    message: 'Você é forte. Mesmo nos dias em que não parece. Vamos transformar esse hate em combustível.',
    supportLevel: 'inspirational' as const,
  },
  {
    id: 'rede',
    author: 'Rede Azul',
    message: 'Toda mãe merece apoio. Escolha quem caminha ao seu lado e lembre-se: pedir ajuda é prova de coragem.',
    supportLevel: 'practical' as const,
  },
  {
    id: 'celebrar',
    author: 'Mães Vencedoras',
    message: 'Cada passo é vitória. Guarde fotos, lembretes e mensagens para revisitar sempre que precisar.',
    supportLevel: 'celebration' as const,
  },
];

const TRACKER_DATA = [
  { label: 'Mensagens de apoio recebidas', achieved: 3, goal: 5 },
  { label: 'Momentos celebrados', achieved: 2, goal: 4 },
  { label: 'Check-ins com a NathIA', achieved: 4, goal: 5 },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const navigation = useNavigation();
  const { colors, spacing, borderRadius, typography } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        stepsBar: { flexDirection: 'row', justifyContent: 'center', paddingVertical: spacing.md },
        stepDot: { height: 6, borderRadius: 3, marginHorizontal: 4 },
        content: { flex: 1, paddingHorizontal: spacing.lg },
        heroSpacing: { marginBottom: spacing.lg },
        stepTitle: { ...typography.subtitle, color: colors.textPrimary ?? colors.foreground, marginBottom: spacing.sm },
        scrollArea: { paddingBottom: spacing.lg },
        cardsWrapper: { paddingBottom: spacing.lg },
        cardSpacing: { marginBottom: spacing.md },
        selectedCard: { borderColor: colors.primary, borderWidth: 2 },
        trackerSpacing: { marginTop: spacing.md },
        summary: {
          marginTop: spacing.lg,
          padding: spacing.md,
          borderRadius: borderRadius.md,
          backgroundColor: colors.secondary,
        },
        summaryText: { ...typography.body, color: colors.secondaryForeground },
        buttonsRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.lg,
        },
        backButton: { flex: 1, minHeight: 48, marginRight: spacing.md },
        nextButton: { flex: 2, minHeight: 48 },
        skipLink: { alignSelf: 'center', marginBottom: spacing.lg },
        skipText: { ...typography.body, color: colors.primary, textDecorationLine: 'underline' },
      }),
    [borderRadius.md, colors, spacing.lg, spacing.md, typography.body, typography.subtitle]
  );

  const [step, setStep] = useState(0);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(COMPLETED_KEY, 'true');
      if (selectedWordId) {
        console.log('Onboarding:selectedWord', selectedWordId);
      }
      onComplete?.();
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' as never }] });
    } catch (error) {
      console.error('Erro ao concluir onboarding', error);
    }
  }, [navigation, onComplete, selectedWordId]);

  const handleNext = useCallback(() => {
    if (step < 2) {
      setStep((current) => current + 1);
      return;
    }
    completeOnboarding();
  }, [completeOnboarding, step]);

  const handleBack = useCallback(() => {
    setStep((current) => {
      if (current === 0) {
        return current;
      }
      return current - 1;
    });
  }, []);

  const handleSkip = useCallback(() => {
    console.log('Onboarding:skip');
    completeOnboarding();
  }, [completeOnboarding]);

  const stepContent =
    step === 0 ? (
      <View style={styles.heroSpacing}>
        <SupportHero
          title="Você é forte. Mesmo nos dias em que não parece."
          subtitle="Transforme o hate desta semana em vitória. Estamos montando uma rede azul só para você."
          ctaLabel="Quero começar agora"
          onPressCTA={handleNext}
          secondaryLabel="Ver rotinas de apoio"
          onPressSecondary={() => setStep(1)}
        />
      </View>
    ) : step === 1 ? (
      <ScrollView contentContainerStyle={[styles.scrollArea, styles.cardsWrapper]}>
        <Text style={styles.stepTitle}>Escolha uma palavra de força para hoje</Text>
        {FORCE_WORDS.map((option) => {
          const isSelected = option.id === selectedWordId;
          return (
            <View key={option.id} style={styles.cardSpacing}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  console.log('Onboarding:selectWord', option.id);
                  setSelectedWordId((current) => (current === option.id ? null : option.id));
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <SupportCard
                  author={option.author}
                  message={option.message}
                  supportLevel={option.supportLevel}
                  onPressSave={() => {
                    console.log('Onboarding:saveWord', option.id);
                    setSelectedWordId(option.id);
                  }}
                  onPressShare={() => {
                    console.log('Onboarding:shareWord', option.id);
                  }}
                  style={isSelected ? styles.selectedCard : undefined}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    ) : (
      <ScrollView contentContainerStyle={styles.scrollArea}>
        <Text style={styles.stepTitle}>Seus próximos passos</Text>
        <View style={styles.trackerSpacing}>
          <VictoryTracker items={TRACKER_DATA} />
        </View>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            A cada vitória registrada, vamos sugerir novas mensagens e momentos para celebrar. Importar suas fotos agora
            ajuda a NathIA a moldar um feed azul de apoio personalizado.
          </Text>
        </View>
      </ScrollView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stepsBar} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 2, now: step }}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[
              styles.stepDot,
              {
                width: index === step ? 36 : 12,
                backgroundColor: index === step ? colors.primary : colors.muted,
              },
            ]}
            accessibilityLabel={`Etapa ${index + 1}`}
          />
        ))}
      </View>
      <View style={styles.content}>{stepContent}</View>
      <View style={styles.buttonsRow}>
        <Button
          variant="secondary"
          onPress={handleBack}
          disabled={step === 0}
          style={styles.backButton}
          accessibilityLabel="Voltar etapa"
        >
          Voltar
        </Button>
        <Button
          onPress={handleNext}
          style={styles.nextButton}
          accessibilityLabel={step === 2 ? 'Finalizar onboarding' : 'Avançar etapa'}
        >
          {step === 2 ? 'Finalizar' : 'Avançar'}
        </Button>
      </View>
      <TouchableOpacity
        onPress={handleSkip}
        style={styles.skipLink}
        accessibilityRole="button"
        accessibilityLabel="Pular onboarding"
      >
        <Text style={styles.skipText}>Pular por enquanto</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
