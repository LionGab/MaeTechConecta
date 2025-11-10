/**
 * Step 4: Rede de Apoio
 * "Ninguém deveria viver maternidade sozinha"
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { theme } from '@/theme/nathTheme';
import { OnboardingData, SupportNetworkLevel } from '@/types/onboarding';
import { RadioGroup } from '@/components/onboarding/RadioGroup';
import { AnimatedStepContainer } from '@/components/onboarding/AnimatedStepContainer';

interface SupportStepProps {
  data: Partial<OnboardingData>;
  stepImage: any;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SUPPORT_OPTIONS = [
  {
    value: 'mucho' as const,
    label: 'Sim, tenho muito apoio',
    description: 'Tenho uma boa rede de familiares, amigos ou parceiro',
  },
  {
    value: 'algum' as const,
    label: 'Tenho algum',
    description: 'Tenho apoio mas nem sempre disponível',
  },
  {
    value: 'pouco' as const,
    label: 'Pouco',
    description: 'Tenho algumas pessoas, mas não é suficiente',
  },
  {
    value: 'nenhum' as const,
    label: 'Nenhum',
    description: 'Sinto que estou sozinha nessa jornada',
  },
];

export const SupportStep = React.memo<SupportStepProps>(({ data, stepImage, onUpdate, onNext, onPrev }) => {
  const handleSupportChange = useCallback(
    (value: SupportNetworkLevel) => {
      onUpdate({ support_network: value });
    },
    [onUpdate]
  );

  const handleDetailsChange = useCallback(
    (text: string) => {
      onUpdate({ support_details: text });
    },
    [onUpdate]
  );

  return (
    <AnimatedStepContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Imagem */}
        <Image source={stepImage} style={styles.image} resizeMode="contain" />

        {/* Título */}
        <Text style={styles.title}>Ninguém deveria viver maternidade sozinha</Text>
        <Text style={styles.subtitle}>Me conta um pouco sobre o seu círculo.</Text>

        {/* Rede de apoio */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Você tem uma rede de apoio (família, amigos, parceiro)?</Text>
          <RadioGroup options={SUPPORT_OPTIONS} value={data.support_network} onChange={handleSupportChange} />
        </View>

        {/* Detalhes da rede */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Quer contar mais sobre sua rede de apoio? (opcional)</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Ex: Minha mãe ajuda nos fins de semana, meu parceiro está sempre perto..."
            placeholderTextColor={theme.colors.textMuted}
            value={data.support_details || ''}
            onChangeText={handleDetailsChange}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Mensagem de apoio */}
        <View style={styles.supportMessage}>
          <Text style={styles.supportText}>
            💙 Mesmo que você sinta que está sozinha agora, sabe que estou aqui pra você. A gente tira força uma da
            outra.
          </Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Botões */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onPrev}>
          <Text style={styles.secondaryButtonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
          <Text style={styles.primaryButtonText}>Avançar</Text>
        </TouchableOpacity>
      </View>
    </AnimatedStepContainer>
  );
});

SupportStep.displayName = 'SupportStep';

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
  supportMessage: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  supportText: {
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
