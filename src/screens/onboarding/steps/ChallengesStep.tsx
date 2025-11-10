/**
 * Step 3: Desafios & Necessidades
 * "Quero entender seus desafios"
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { theme } from '@/theme/nathTheme';
import { OnboardingData, MAIN_CHALLENGES, MAIN_NEEDS } from '@/types/onboarding';
import { CheckboxGroup } from '@/components/onboarding/CheckboxGroup';
import { RadioGroup } from '@/components/onboarding/RadioGroup';
import { AnimatedStepContainer } from '@/components/onboarding/AnimatedStepContainer';

interface ChallengesStepProps {
  data: Partial<OnboardingData>;
  stepImage: any;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors: Record<string, string | null>;
}

const CHALLENGES_OPTIONS = [
  { value: 'sono_bebe', label: 'Sono do bebê' },
  { value: 'amamentacao', label: 'Amamentação' },
  { value: 'falta_tempo', label: 'Falta de tempo' },
  { value: 'ansiedade', label: 'Ansiedade' },
  { value: 'rotina', label: 'Rotina' },
  { value: 'falta_apoio', label: 'Falta de apoio' },
  { value: 'culpa', label: 'Culpa' },
  { value: 'exaustao', label: 'Exaustão' },
  { value: 'julgamento', label: 'Julgamento' },
  { value: 'relacionamento', label: 'Relacionamento' },
  { value: 'trabalho', label: 'Trabalho' },
];

const NEEDS_OPTIONS = [
  { value: 'descanso', label: 'Descanso' },
  { value: 'organizacao', label: 'Organização' },
  { value: 'apoio_emocional', label: 'Apoio emocional' },
  { value: 'conexao', label: 'Conexão' },
  { value: 'autocuidado', label: 'Autocuidado' },
  { value: 'ajuda_profissional', label: 'Ajuda profissional' },
  { value: 'dicas_praticas', label: 'Dicas práticas' },
];

export const ChallengesStep = React.memo<ChallengesStepProps>(
  ({ data, stepImage, onUpdate, onNext, onPrev, errors }) => {
    const handleChallengesChange = useCallback(
      (values: any[]) => {
        onUpdate({ main_challenges: values });
      },
      [onUpdate]
    );

    const handleDetailsChange = useCallback(
      (text: string) => {
        onUpdate({ challenges_details: text });
      },
      [onUpdate]
    );

    const handleNeedsChange = useCallback(
      (values: any[]) => {
        onUpdate({ main_needs: values });
      },
      [onUpdate]
    );

    return (
      <AnimatedStepContainer style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Imagem */}
          <Image
            source={stepImage}
            style={styles.image}
            resizeMode="contain"
          />

          {/* Título */}
          <Text style={styles.title}>
            Agora quero entender seus desafios
          </Text>
          <Text style={styles.subtitle}>
            O que está mais desafiador pra você nesse momento?
          </Text>

          {/* Principais desafios */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Quais são seus principais desafios?</Text>
            <CheckboxGroup
              options={CHALLENGES_OPTIONS}
              value={data.main_challenges || []}
              onChange={handleChallengesChange}
            />
            {errors.main_challenges && (
              <Text style={styles.errorText}>{errors.main_challenges}</Text>
            )}
          </View>

          {/* Detalhes dos desafios */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Quer compartilhar mais sobre algum desafio? (opcional)
            </Text>
            <TextInput
              style={styles.textarea}
              placeholder="Digite o que você gostaria de compartilhar..."
              placeholderTextColor={theme.colors.textMuted}
              value={data.challenges_details || ''}
              onChangeText={handleDetailsChange}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Necessidades principais */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              O que você mais precisa agora? (Escolha até 3)
            </Text>
            <CheckboxGroup
              options={NEEDS_OPTIONS}
              value={data.main_needs || []}
              onChange={handleNeedsChange}
              maxSelect={3}
            />
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        {/* Botões */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
            <Text style={styles.secondaryButtonText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!data.main_challenges || data.main_challenges.length === 0) &&
                styles.primaryButtonDisabled,
            ]}
            onPress={onNext}
            disabled={
              !data.main_challenges || data.main_challenges.length === 0
            }
          >
            <Text style={styles.primaryButtonText}>Avançar</Text>
          </TouchableOpacity>
        </View>
      </AnimatedStepContainer>
    );
  }
);

ChallengesStep.displayName = 'ChallengesStep';

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
  formGroup: { marginBottom: theme.spacing.lg },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  textarea: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.card,
    minHeight: 100,
  },
  errorText: {
    color: theme.colors.accent,
    fontSize: 12,
    marginTop: theme.spacing.sm,
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
