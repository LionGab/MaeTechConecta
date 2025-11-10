/**
 * Tela principal de Onboarding
 * Orquestra os 5 steps, persiste dados em Supabase
 * Animações smooth entre steps
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { useAuth } from '@clerk/clerk-react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { theme } from '@/theme/nathTheme';
import { useOnboardingForm } from '@/hooks/useOnboardingForm';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import {
  saveOnboardingData,
  ONBOARDING_STEP_IMAGES,
  generateOnboardingInsights,
} from '@/services/onboardingService';

// Steps
import { IdentityStep } from './steps/IdentityStep';
import { EmotionalStep } from './steps/EmotionalStep';
import { ChallengesStep } from './steps/ChallengesStep';
import { SupportStep } from './steps/SupportStep';
import { PreferencesStep } from './steps/PreferencesStep';

// Componentes
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { logger } from '@/utils/logger';

export default function OnboardingScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { markOnboardingComplete } = useOnboardingContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    formData,
    currentStep,
    currentStepConfig,
    isFirstStep,
    isLastStep,
    validation,
    stepValidation,
    updateField,
    updateMultipleFields,
    nextStep,
    prevStep,
    getFieldError,
    resetForm,
    getFormDataForSave,
  } = useOnboardingForm();

  // Imagem do step atual
  const stepImage = useMemo(() => {
    return ONBOARDING_STEP_IMAGES[currentStep as keyof typeof ONBOARDING_STEP_IMAGES];
  }, [currentStep]);

  // Mapa de erros do step atual
  const fieldErrors = useMemo(() => {
    const errors: Record<string, string | null> = {};
    const stepConfig = currentStepConfig;

    for (const field of stepConfig.requiredFields) {
      errors[field] = getFieldError(field);
    }

    return errors;
  }, [currentStepConfig, getFieldError]);

  /**
   * Handler para próximo step
   * Tenta avançar, valida, mostra erros
   */
  const handleNextStep = useCallback(async () => {
    if (!stepValidation.valid) {
      setError(stepValidation.errors[0] || 'Preencha todos os campos obrigatórios');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const success = nextStep();
    if (!success) {
      // Último step - salvar dados
      await handleCompleteOnboarding();
    }
  }, [stepValidation, nextStep]);

  /**
   * Handler para passo anterior
   */
  const handlePrevStep = useCallback(() => {
    setError(null);
    prevStep();
  }, [prevStep]);

  /**
   * Completar onboarding e salvar dados
   */
  const handleCompleteOnboarding = useCallback(async () => {
    if (!user?.id) {
      Alert.alert('Erro', 'Não foi possível identificar o usuário');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Validar dados completos
      const dataToSave = getFormDataForSave();
      if (!dataToSave) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }

      // Salvar em Supabase
      const result = await saveOnboardingData(user.id, dataToSave);
      if (!result.success) {
        setError(result.error || 'Erro ao salvar dados');
        return;
      }

      // Gerar insights para personalização
      const insights = generateOnboardingInsights(dataToSave);

      // Salvar localmente insights para uso imediato
      await AsyncStorage.setItem(
        'onboarding_insights',
        JSON.stringify(insights)
      );

      // Marcar onboarding como completo no contexto
      markOnboardingComplete();

      logger.info('Onboarding completado com sucesso', { userId: user.id });

      // Navegar para MainTabs
      (navigation as any).reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (err) {
      logger.error(
        'Erro ao completar onboarding',
        err instanceof Error ? err : undefined,
        {
          userId: user?.id,
          error: err instanceof Error ? err.message : String(err),
        }
      );
      setError('Erro ao processar seus dados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, getFormDataForSave, markOnboardingComplete, navigation]);

  // Renderizar step atual
  const renderCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 0:
        return (
          <IdentityStep
            data={formData}
            stepImage={stepImage}
            onUpdate={updateMultipleFields}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            errors={fieldErrors}
          />
        );
      case 1:
        return (
          <EmotionalStep
            data={formData}
            stepImage={stepImage}
            onUpdate={updateMultipleFields}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            errors={fieldErrors}
          />
        );
      case 2:
        return (
          <ChallengesStep
            data={formData}
            stepImage={stepImage}
            onUpdate={updateMultipleFields}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            errors={fieldErrors}
          />
        );
      case 3:
        return (
          <SupportStep
            data={formData}
            stepImage={stepImage}
            onUpdate={updateMultipleFields}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 4:
        return (
          <PreferencesStep
            data={formData}
            stepImage={stepImage}
            onUpdate={updateMultipleFields}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            isLoading={isLoading}
            errors={fieldErrors}
          />
        );
      default:
        return null;
    }
  }, [
    currentStep,
    formData,
    stepImage,
    updateMultipleFields,
    handleNextStep,
    handlePrevStep,
    fieldErrors,
    isLoading,
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.bg} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header com progresso */}
        <View style={styles.header}>
          <StepIndicator
            currentStep={currentStep}
            totalSteps={5}
            completedSteps={formData.completed_steps || 0}
          />
        </View>

        {/* Erro message (se houver) */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Step atual */}
        <View style={styles.stepContainer}>
          {renderCurrentStep()}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.bg,
  },
  stepContainer: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  errorContainer: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
