/**
 * Onboarding Context v2
 * Gerencia estado global do onboarding com integração completa
 * Suporta persistência em Supabase e cache local
 */

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/services/supabase';
import { checkOnboardingCompleted, loadOnboardingData } from '@/services/onboardingService';
import { OnboardingData } from '@/types/onboarding';
import { logger } from '@/utils/logger';

interface OnboardingContextValue {
  // Estado
  isOnboardingCompleted: boolean;
  isLoadingOnboarding: boolean;
  onboardingData: OnboardingData | null;
  userId: string | null;

  // Ações
  markOnboardingComplete: () => void;
  resetOnboarding: () => Promise<void>;
  loadUserOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(true);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  /**
   * Carregar dados do onboarding
   */
  const loadUserOnboarding = useCallback(async () => {
    if (!userId) {
      setIsLoadingOnboarding(false);
      return;
    }

    try {
      setIsLoadingOnboarding(true);

      // Tentar cache local primeiro
      const cachedData = await AsyncStorage.getItem(`onboarding_${userId}`);
      if (cachedData) {
        try {
          const data = JSON.parse(cachedData);
          setOnboardingData(data);
          setIsOnboardingCompleted(true);
          setIsLoadingOnboarding(false);
          return;
        } catch (err) {
          logger.warn('Cache onboarding inválido', { userId });
        }
      }

      // Carregar do Supabase
      const isCompleted = await checkOnboardingCompleted(userId);
      if (isCompleted) {
        const data = await loadOnboardingData(userId);
        if (data) {
          setOnboardingData(data);
          await AsyncStorage.setItem(`onboarding_${userId}`, JSON.stringify(data));
        }
        setIsOnboardingCompleted(true);
      } else {
        setIsOnboardingCompleted(false);
      }
    } catch (err) {
      logger.error('Erro ao carregar onboarding', err instanceof Error ? err : undefined, {
        userId,
        error: err instanceof Error ? err.message : String(err),
      });
      setIsOnboardingCompleted(false);
    } finally {
      setIsLoadingOnboarding(false);
    }
  }, [userId]);

  /**
   * Marcar onboarding como completo
   */
  const markOnboardingComplete = useCallback(() => {
    setIsOnboardingCompleted(true);
    logger.info('Onboarding marcado como completo', { userId });
  }, [userId]);

  /**
   * Resetar onboarding (para testes)
   */
  const resetOnboarding = useCallback(async () => {
    if (!userId) return;

    try {
      setIsOnboardingCompleted(false);
      setOnboardingData(null);
      await AsyncStorage.removeItem(`onboarding_${userId}`);
      logger.info('Onboarding resetado', { userId });
    } catch (err) {
      logger.error('Erro ao resetar onboarding', err instanceof Error ? err : undefined, {
        userId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }, [userId]);

  /**
   * Efeito: Detectar usuário atual
   */
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };

    getCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Efeito: Carregar onboarding quando userId muda
   */
  useEffect(() => {
    if (userId) {
      loadUserOnboarding();
    }
  }, [userId, loadUserOnboarding]);

  const value: OnboardingContextValue = {
    isOnboardingCompleted,
    isLoadingOnboarding,
    onboardingData,
    userId,
    markOnboardingComplete,
    resetOnboarding,
    loadUserOnboarding,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

/**
 * Hook para usar contexto de onboarding
 */
export function useOnboardingContext(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext deve ser usado dentro de OnboardingProvider');
  }
  return context;
}

