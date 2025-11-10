/**
 * Step 2: Autocuidado & Emoções
 * "Vamos entender como você está hoje?"
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '@/theme/nathTheme';
import { OnboardingData, SelfCareFrequency, LABELS, EMOTION_EMOJIS } from '@/types/onboarding';
import { EmojiSelector } from '@/components/onboarding/EmojiSelector';
import { SliderQuestion } from '@/components/onboarding/SliderQuestion';
import { RadioGroup } from '@/components/onboarding/RadioGroup';
import { ScaleQuestion } from '@/components/onboarding/ScaleQuestion';
import { AnimatedStepContainer } from '@/components/onboarding/AnimatedStepContainer';

interface EmotionalStepProps {
  data: Partial<OnboardingData>;
  stepImage: any;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors: Record<string, string | null>;
}

const SELF_CARE_OPTIONS = [
  { value: 'nunca' as const, label: 'Nunca' },
  { value: '1x_semana' as const, label: '1x por semana' },
  { value: '2-3x_semana' as const, label: '2-3x por semana' },
  { value: 'diariamente' as const, label: 'Diariamente' },
];

const EMOTION_OPTIONS = [
  { value: 'exausta' as const, emoji: '😫', label: 'Exausta' },
  { value: 'ansiosa' as const, emoji: '😰', label: 'Ansiosa' },
  { value: 'feliz' as const, emoji: '😊', label: 'Feliz' },
  { value: 'insegura' as const, emoji: '😕', label: 'Insegura' },
  { value: 'equilibrada' as const, emoji: '😌', label: 'Equilibrada' },
  { value: 'triste' as const, emoji: '😢', label: 'Triste' },
];

const SLEEP_OPTIONS = [
  { value: 'pessima', label: 'Péssima', emoji: '😴' },
  { value: 'ruim', label: 'Ruim' },
  { value: 'regular', label: 'Regular' },
  { value: 'boa', label: 'Boa' },
  { value: 'otima', label: 'Ótima' },
];

export const EmotionalStep = React.memo<EmotionalStepProps>(({ data, stepImage, onUpdate, onNext, onPrev, errors }) => {
  const handleSelfCareChange = useCallback(
    (value: SelfCareFrequency) => {
      onUpdate({ self_care_frequency: value });
    },
    [onUpdate]
  );

  const handleEmotionChange = useCallback(
    (value: string) => {
      onUpdate({ emotional_state: value as any });
    },
    [onUpdate]
  );

  const handleStressChange = useCallback(
    (value: number) => {
      onUpdate({ stress_level: value });
    },
    [onUpdate]
  );

  const handleSleepChange = useCallback(
    (value: string) => {
      onUpdate({ sleep_quality: value as any });
    },
    [onUpdate]
  );

  const handleEnergyChange = useCallback(
    (value: number) => {
      onUpdate({ energy_level: value });
    },
    [onUpdate]
  );

  return (
    <AnimatedStepContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Imagem da Nath */}
        <Image source={stepImage} style={styles.image} resizeMode="contain" />

        {/* Título */}
        <Text style={styles.title}>Eu sei que a maternidade pode ser intensa</Text>
        <Text style={styles.subtitle}>Vamos entender como você está hoje?</Text>

        {/* Self-care frequency */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Com que frequência você consegue fazer algo por você?</Text>
          <RadioGroup options={SELF_CARE_OPTIONS} value={data.self_care_frequency} onChange={handleSelfCareChange} />
        </View>

        {/* Emoção */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Como você está se sentindo hoje?</Text>
          <EmojiSelector value={data.emotional_state as any} onChange={handleEmotionChange} options={EMOTION_OPTIONS} />
        </View>

        {/* Stress level */}
        <View style={styles.formGroup}>
          <SliderQuestion
            label="Em uma escala de 1 a 10, qual seu nível de estresse hoje?"
            value={data.stress_level || 5}
            onChange={handleStressChange}
            leftLabel="Baixo"
            rightLabel="Alto"
          />
        </View>

        {/* Sleep quality */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Como está a qualidade do seu sono?</Text>
          <ScaleQuestion value={data.sleep_quality} onChange={handleSleepChange} options={SLEEP_OPTIONS} />
        </View>

        {/* Energy level */}
        <View style={styles.formGroup}>
          <SliderQuestion
            label="Em uma escala de 1 a 10, qual seu nível de energia hoje?"
            value={data.energy_level || 5}
            onChange={handleEnergyChange}
            leftLabel="Cansada"
            rightLabel="Energética"
          />
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Botões de ação */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
          <Text style={styles.secondaryButtonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!data.self_care_frequency || !data.emotional_state) && styles.primaryButtonDisabled,
          ]}
          onPress={onNext}
          disabled={!data.self_care_frequency || !data.emotional_state}
        >
          <Text style={styles.primaryButtonText}>Avançar</Text>
        </TouchableOpacity>
      </View>
    </AnimatedStepContainer>
  );
});

EmotionalStep.displayName = 'EmotionalStep';

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  spacer: {
    flex: 1,
    minHeight: theme.spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
