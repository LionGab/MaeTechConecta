/**
 * Configuração de navegação da Nossa Maternidade
 *
 * AppNavigator - Navegador principal da aplicação
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Loading } from '@/shared/components/Loading';
import { useTheme } from '@/contexts/ThemeContext';
import { useOnboardingContext } from '@/contexts/OnboardingContext';
import { theme } from '@/theme/nathTheme';

import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { linking } from './linking';

// Lazy load screens para melhor performance
const OnboardingScreen = lazy(() =>
  import('@/screens/onboarding/OnboardingScreen').then((m) => ({ default: m.default }))
);
const DailyPlanScreen = lazy(() => import('@/screens/DailyPlanScreen').then((m) => ({ default: m.default })));
const ContentDetailScreen = lazy(() =>
  import('@/features/content/ContentDetailScreen').then((m) => ({ default: m.default }))
);
const ComponentValidationScreen = lazy(() =>
  import('@/screens/ComponentValidationScreen').then((m) => ({ default: m.default }))
);

// Wrapper com Suspense para lazy loaded screens
const withSuspense = <P extends object>(Component: React.ComponentType<P>) => {
  return function SuspendedComponent(props: P) {
    return (
      <Suspense fallback={<Loading message="Carregando..." />}>
        <Component {...props} />
      </Suspense>
    );
  };
};

const OnboardingScreenSuspended = withSuspense(OnboardingScreen);
const DailyPlanScreenSuspended = withSuspense(DailyPlanScreen);
const ContentDetailScreenSuspended = withSuspense(ContentDetailScreen);
const ComponentValidationScreenSuspended = withSuspense(ComponentValidationScreen);

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigatorContent() {
  const { isDark } = useTheme();
  const { isOnboardingCompleted, isLoadingOnboarding } = useOnboardingContext();

  if (isLoadingOnboarding) {
    return <Loading message="Carregando..." />;
  }

  return (
    <NavigationContainer linking={linking}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboardingCompleted ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreenSuspended}
            options={{
              animationEnabled: false,
              gestureEnabled: false,
            }}
          />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen
              name="DailyPlan"
              component={DailyPlanScreenSuspended}
              options={{
                headerShown: true,
                title: 'Plano Diário',
                headerStyle: { backgroundColor: theme.colors.bg },
                headerTintColor: theme.colors.text,
              }}
            />
            <Stack.Screen
              name="ContentDetail"
              component={ContentDetailScreenSuspended}
              options={{
                headerShown: true,
                title: 'Conteúdo',
                headerStyle: { backgroundColor: theme.colors.bg },
                headerTintColor: theme.colors.text,
              }}
            />
            <Stack.Screen
              name="ComponentValidation"
              component={ComponentValidationScreenSuspended}
              options={{
                headerShown: true,
                title: 'Validação de Componentes',
                headerStyle: { backgroundColor: theme.colors.bg },
                headerTintColor: theme.colors.text,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function AppNavigator() {
  return (
    <SafeAreaProvider>
      <AppNavigatorContent />
    </SafeAreaProvider>
  );
}
