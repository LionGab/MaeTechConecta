/**
 * Step 5: Expectativas & Preferências (Final)
 * "Por fim, quero saber suas expectativas"
 */

import React, { useCallback } from 'react';
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
import { OnboardingData, CommunicationStyle } from '@/types/onboarding';
import { CheckboxGroup } from '@/components/onboarding/CheckboxGroup';
import { RadioGroup } from '@/components/onboarding/RadioGroup';
import { AnimatedStepContainer } from '@/components/onboarding/AnimatedStepContainer';

interface PreferencesStepProps {
  data: Partial<OnboardingData>;
  stepImage: any;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading?: boolean;
  errors: Record<string, string | null>;
}

const EXPECTATIONS_OPTIONS = [
  { value: 'conexao', label: 'Conexão' },
  { value: 'aprendizado', label: 'Aprendizado' },
  { value: 'apoio_emocional', label: 'Apoio emocional' },
  { value: 'informacoes_praticas', label: 'Informações práticas' },
  { value: 'reduzir_solidao', label: 'Reduzir solidão' },
  { value: 'celebrar_conquistas', label: 'Celebrar conquistas' },
];

const CONTENT_OPTIONS = [
  { value: 'alimentacao', label: '🍽️ Alimentação' },
  { value: 'exercicios', label: '🏃‍♀️ Exercícios' },
  { value: 'bem_estar_mental', label: '🧠 Bem-estar mental' },
  { value: 'parto', label: '👶 Parto' },
  { value: 'amamentacao', label: '🍼 Amamentação' },
  { value: 'sono', label: '😴 Sono' },
  { value: 'desenvolvimento', label: '📈 Desenvolvimento' },
  { value: 'relacionamento', label: '💑 Relacionamento' },
  { value: 'skin_care', label: '✨ Skin care' },
  { value: 'estilo_vida', label: '✨ Estilo de vida' },
];

const COMMUNICATION_OPTIONS = [
  { value: 'casual' as const, label: 'Casual e amiga' },
  { value: 'empatica' as const, label: 'Empática e acolhedora' },
  { value: 'direta' as const, label: 'Direta e objetiva' },
  { value: 'formal' as const, label: 'Formal e respeitosa' },
];

export const PreferencesStep = React.memo<PreferencesStepProps>(
  ({ data, stepImage, onUpdate, onNext, onPrev, isLoading, errors }) => {
    const handleBroughtHereChange = useCallback(
      (text: string) => {
        onUpdate({ what_brought_here: text });
      },
      [onUpdate]
    );

    const handleExpectationsChange = useCallback(
      (values: any[]) => {
        onUpdate({ expectations: values });
      },
      [onUpdate]
    );

    const handleContentChange = useCallback(
      (values: any[]) => {
        onUpdate({ content_interests: values });
      },
      [onUpdate]
    );

    const handleCommunicationChange = useCallback(
      (value: CommunicationStyle) => {
        onUpdate({ communication_style: value });
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
            Por fim, quero saber suas expectativas
          </Text>
          <Text style={styles.subtitle}>
            Pra que cada momento aqui faça sentido pra você 💙
          </Text>

          {/* O que trouxe até aqui */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              O que te trouxe até aqui hoje? (opcional)
            </Text>
            <TextInput
              style={styles.textarea}
              placeholder="Conte-nos brevemente o que te motivou..."
              placeholderTextColor={theme.colors.textMuted}
              value={data.what_brought_here || ''}
              onChangeText={handleBroughtHereChange}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Expectativas */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>O que você espera encontrar aqui?</Text>
            <CheckboxGroup
              options={EXPECTATIONS_OPTIONS}
              value={data.expectations || []}
              onChange={handleExpectationsChange}
            />
            {errors.expectations && (
              <Text style={styles.errorText}>{errors.expectations}</Text>
            )}
          </View>

          {/* Conteúdos de interesse */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Quais conteúdos te interessam?</Text>
            <CheckboxGroup
              options={CONTENT_OPTIONS}
              value={data.content_interests || []}
              onChange={handleContentChange}
            />
          </View>

          {/* Estilo de comunicação */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Como você prefere que eu fale com você?
            </Text>
            <RadioGroup
              options={COMMUNICATION_OPTIONS}
              value={data.communication_style}
              onChange={handleCommunicationChange}
            />
            {errors.communication_style && (
              <Text style={styles.errorText}>{errors.communication_style}</Text>
            )}
          </View>

          {/* Mensagem final */}
          <View style={styles.finalMessage}>
            <Text style={styles.finalMessageText}>
              🌸 Perfeito! Agora já te conheço melhor. Vamos criar uma jornada
              especial, só sua. Você merece.
            </Text>
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        {/* Botões */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onPrev}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!data.expectations || data.expectations.length === 0) &&
                styles.primaryButtonDisabled,
              isLoading && styles.primaryButtonLoading,
            ]}
            onPress={onNext}
            disabled={
              !data.expectations ||
              data.expectations.length === 0 ||
              isLoading
            }
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Finalizando...' : 'Finalizar'}
            </Text>
          </TouchableOpacity>
        </View>
      </AnimatedStepContainer>
    );
  }
);

PreferencesStep.displayName = 'PreferencesStep';

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
  finalMessage: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  finalMessageText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
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
  },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonLoading: { opacity: 0.7 },
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
