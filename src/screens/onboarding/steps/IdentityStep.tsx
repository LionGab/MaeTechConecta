/**
 * Step 1: Apresentação & Identidade
 * "Oi, eu sou a Nath 🌸 Quero te conhecer melhor"
 */

import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { theme } from '@/theme/nathTheme';
import { OnboardingData, MaternalStage, LABELS } from '@/types/onboarding';
import { RadioGroup } from '@/components/onboarding/RadioGroup';
import { AnimatedStepContainer } from '@/components/onboarding/AnimatedStepContainer';

interface IdentityStepProps {
  data: Partial<OnboardingData>;
  stepImage: any;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors: Record<string, string | null>;
}

const MATERNAL_STAGES: { value: MaternalStage; label: string }[] = [
  { value: 'tentante', label: 'Tentante' },
  { value: 'gestante', label: 'Gestante' },
  { value: 'puerperio', label: 'Mãe no puerpério' },
  { value: 'mae_estabelecida', label: 'Mãe já estabelecida' },
];

export const IdentityStep = React.memo<IdentityStepProps>(({ data, stepImage, onUpdate, onNext, onPrev, errors }) => {
  const [showGestationInput, setShowGestationInput] = useState(data.maternal_stage === 'gestante');

  const handleMaternalStageChange = useCallback(
    (value: MaternalStage) => {
      onUpdate({ maternal_stage: value });
      setShowGestationInput(value === 'gestante');
    },
    [onUpdate]
  );

  const handleGestationWeekChange = useCallback(
    (text: string) => {
      const value = parseInt(text, 10);
      if (!isNaN(value) && value >= 1 && value <= 40) {
        onUpdate({ gestation_week: value });
      }
    },
    [onUpdate]
  );

  const handleNameChange = useCallback(
    (text: string) => {
      onUpdate({ name: text });
    },
    [onUpdate]
  );

  const handleBabyNameChange = useCallback(
    (text: string) => {
      onUpdate({ baby_name: text });
    },
    [onUpdate]
  );

  return (
    <AnimatedStepContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Imagem da Nath */}
        <Image source={stepImage} style={styles.image} resizeMode="contain" />

        {/* Texto de boas-vindas */}
        <Text style={styles.title}>Oi, eu sou a Nath 🌸</Text>
        <Text style={styles.subtitle}>Quero te conhecer melhor pra deixar tudo aqui com a sua cara.</Text>

        {/* Campo de nome */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Qual é o seu nome?</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Digite seu nome"
            placeholderTextColor={theme.colors.textMuted}
            value={data.name || ''}
            onChangeText={handleNameChange}
            accessible={true}
            accessibilityLabel="Campo de nome"
            accessibilityHint="Digite seu nome completo"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Seleção de tipo de mãe */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Como você se identifica?</Text>
          <RadioGroup options={MATERNAL_STAGES} value={data.maternal_stage} onChange={handleMaternalStageChange} />
          {errors.maternal_stage && <Text style={styles.errorText}>{errors.maternal_stage}</Text>}
        </View>

        {/* Campo de semana de gestação (condicional) */}
        {showGestationInput && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Em que semana de gestação você está?</Text>
            <TextInput
              style={[styles.input, errors.gestation_week && styles.inputError]}
              placeholder="Ex: 20"
              placeholderTextColor={theme.colors.textMuted}
              value={data.gestation_week?.toString() || ''}
              onChangeText={handleGestationWeekChange}
              keyboardType="number-pad"
              maxLength={2}
              accessible={true}
              accessibilityLabel="Semana de gestação"
              accessibilityHint="Digite um número entre 1 e 40"
            />
            {errors.gestation_week && <Text style={styles.errorText}>{errors.gestation_week}</Text>}
          </View>
        )}

        {/* Campo de nome do bebê (opcional) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Qual é o nome do seu bebê? (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do bebê"
            placeholderTextColor={theme.colors.textMuted}
            value={data.baby_name || ''}
            onChangeText={handleBabyNameChange}
            accessible={true}
            accessibilityLabel="Nome do bebê"
            accessibilityHint="Campo opcional"
          />
        </View>

        {/* Espaçador */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Botões de ação */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
          <Text style={styles.secondaryButtonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, (!data.name || !data.maternal_stage) && styles.primaryButtonDisabled]}
          onPress={onNext}
          disabled={!data.name || !data.maternal_stage}
        >
          <Text style={styles.primaryButtonText}>Avançar</Text>
        </TouchableOpacity>
      </View>
    </AnimatedStepContainer>
  );
});

IdentityStep.displayName = 'IdentityStep';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  input: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.card,
  },
  inputError: {
    borderColor: theme.colors.accent,
  },
  errorText: {
    color: theme.colors.accent,
    fontSize: 12,
    marginTop: theme.spacing.sm,
    fontWeight: '500',
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
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
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
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

