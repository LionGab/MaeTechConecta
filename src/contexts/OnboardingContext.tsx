/**
 * Onboarding Context
 * Context para gerenciar estado do onboarding em toda a aplicação
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useOnboarding, UseOnboardingReturn } from '@/hooks/useOnboarding';
import { supabase } from '@/services/supabase';

interface OnboardingContextValue extends UseOnboardingReturn {
  userId: string | null;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [userId, setUserId] = React.useState<string | null>(null);

  // Obter usuário atual
  React.useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };

    getCurrentUser();

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const onboarding = useOnboarding(userId || undefined);

  const value: OnboardingContextValue = {
    ...onboarding,
    userId,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboardingContext(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboardingContext deve ser usado dentro de OnboardingProvider');
  }
  return context;
}
