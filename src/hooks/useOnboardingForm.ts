/**
 * Hook para gerenciar formulário do onboarding
 * Controla estado, navegação entre steps, validação
 */

import { useState, useCallback, useMemo } from 'react';
import { OnboardingFormState, OnboardingData, ONBOARDING_STEPS, OnboardingStepConfig } from '@/types/onboarding';
import { validateOnboardingStep, validateOnboardingData, ValidationResult } from '@/services/onboardingService';
import { logger } from '@/utils/logger';

/**
 * Estado inicial do formulário
 */
const initialFormState: OnboardingFormState = {
  current_step: 0,
  name: '',
  maternal_stage: undefined,
  gestation_week: undefined,
  baby_name: undefined,
  baby_age_months: undefined,
  self_care_frequency: undefined,
  emotional_state: undefined,
  stress_level: 5,
  sleep_quality: undefined,
  energy_level: 5,
  main_challenges: [],
  challenges_details: '',
  main_needs: [],
  support_network: undefined,
  support_details: '',
  what_brought_here: '',
  expectations: [],
  content_interests: [],
  communication_style: undefined,
  completed_steps: 0,
};

interface UseOnboardingFormReturn {
  // Estado
  formData: OnboardingFormState;
  currentStep: number;
  currentStepConfig: OnboardingStepConfig;
  isFirstStep: boolean;
  isLastStep: boolean;

  // Validação
  validation: ValidationResult;
  stepValidation: ValidationResult;

  // Ações
  updateField: <T extends keyof OnboardingData>(field: T, value: OnboardingData[T]) => void;
  updateMultipleFields: (updates: Partial<OnboardingData>) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  goToStep: (step: number) => void;

  // Utilidades
  getFieldError: (field: keyof OnboardingData) => string | null;
  resetForm: () => void;
  completeStep: () => void;
  getFormDataForSave: () => OnboardingData | null;
}

/**
 * Hook principal de gerenciamento do formulário de onboarding
 */
export function useOnboardingForm(): UseOnboardingFormReturn {
  const [formData, setFormData] = useState<OnboardingFormState>(initialFormState);

  // Validação completa
  const validation = useMemo(() => {
    // Se completou todos os steps, validar completo
    if (formData.current_step === 4) {
      return validateOnboardingData(formData as OnboardingData);
    }
    return { valid: true, errors: [] };
  }, [formData]);

  // Validação do step atual
  const stepValidation = useMemo(() => {
    return validateOnboardingStep(formData.current_step, formData);
  }, [formData, formData.current_step]);

  // Config do step atual
  const currentStepConfig = useMemo(() => {
    return ONBOARDING_STEPS[formData.current_step] || ONBOARDING_STEPS[0];
  }, [formData.current_step]);

  // Helpers de navegação
  const isFirstStep = formData.current_step === 0;
  const isLastStep = formData.current_step === ONBOARDING_STEPS.length - 1;

  /**
   * Atualizar campo individual
   */
  const updateField = useCallback(<T extends keyof OnboardingData>(field: T, value: OnboardingData[T]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    logger.debug('Onboarding field updated', { field, value });
  }, []);

  /**
   * Atualizar múltiplos campos de uma vez
   */
  const updateMultipleFields = useCallback((updates: Partial<OnboardingData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));

    logger.debug('Onboarding fields updated', { count: Object.keys(updates).length });
  }, []);

  /**
   * Avançar para próximo step (com validação)
   */
  const nextStep = useCallback((): boolean => {
    // Validar step atual
    if (!stepValidation.valid) {
      logger.warn('Step validation failed', {
        step: formData.current_step,
        errors: stepValidation.errors,
      });
      return false;
    }

    // Se é o último step, não avançar
    if (isLastStep) {
      return false;
    }

    setFormData((prev) => ({
      ...prev,
      current_step: prev.current_step + 1,
      completed_steps: Math.min(prev.current_step + 1, ONBOARDING_STEPS.length),
    }));

    return true;
  }, [formData.current_step, isLastStep, stepValidation]);

  /**
   * Voltar para step anterior
   */
  const prevStep = useCallback(() => {
    if (!isFirstStep) {
      setFormData((prev) => ({
        ...prev,
        current_step: prev.current_step - 1,
      }));
    }
  }, [isFirstStep]);

  /**
   * Ir para step específico
   */
  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < ONBOARDING_STEPS.length) {
      setFormData((prev) => ({
        ...prev,
        current_step: step,
      }));
    }
  }, []);

  /**
   * Obter erro de um campo específico
   */
  const getFieldError = useCallback(
    (field: keyof OnboardingData): string | null => {
      const stepConfig = ONBOARDING_STEPS[formData.current_step];
      if (!stepConfig.requiredFields.includes(field)) {
        return null;
      }

      // Verificar se há erro de validação para este field
      const errorMessage = stepValidation.errors.find((e) => e.includes(field as string));
      return errorMessage || null;
    },
    [formData.current_step, stepValidation]
  );

  /**
   * Resetar formulário
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    logger.info('Onboarding form reset');
  }, []);

  /**
   * Marcar step como completo
   */
  const completeStep = useCallback(() => {
    if (stepValidation.valid) {
      setFormData((prev) => ({
        ...prev,
        completed_steps: Math.min(prev.current_step + 1, ONBOARDING_STEPS.length),
      }));
    }
  }, [stepValidation]);

  /**
   * Obter dados para salvar (validação completa)
   */
  const getFormDataForSave = useCallback((): OnboardingData | null => {
    if (!validation.valid) {
      logger.warn('Form validation failed', { errors: validation.errors });
      return null;
    }

    return {
      name: formData.name!,
      maternal_stage: formData.maternal_stage!,
      gestation_week: formData.gestation_week,
      baby_name: formData.baby_name,
      baby_age_months: formData.baby_age_months,
      self_care_frequency: formData.self_care_frequency!,
      emotional_state: formData.emotional_state!,
      stress_level: formData.stress_level!,
      sleep_quality: formData.sleep_quality!,
      energy_level: formData.energy_level!,
      main_challenges: formData.main_challenges!,
      challenges_details: formData.challenges_details,
      main_needs: formData.main_needs!,
      support_network: formData.support_network!,
      support_details: formData.support_details,
      what_brought_here: formData.what_brought_here,
      expectations: formData.expectations!,
      content_interests: formData.content_interests!,
      communication_style: formData.communication_style!,
      completed_at: new Date(),
    };
  }, [formData, validation]);

  return {
    // Estado
    formData,
    currentStep: formData.current_step,
    currentStepConfig,
    isFirstStep,
    isLastStep,

    // Validação
    validation,
    stepValidation,

    // Ações
    updateField,
    updateMultipleFields,
    nextStep,
    prevStep,
    goToStep,

    // Utilidades
    getFieldError,
    resetForm,
    completeStep,
    getFormDataForSave,
  };
}
