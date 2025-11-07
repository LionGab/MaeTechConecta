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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loading } from '@/shared/components/Loading';
import { useTheme } from '@/contexts/ThemeContext';

import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { linking } from './linking';

// Lazy load screens para melhor performance
const OnboardingScreen = lazy(() => import('@/screens/OnboardingScreen').then((m) => ({ default: m.default })));
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

export function AppNavigator() {
  const { isDark, colors } = useTheme();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboarded = await AsyncStorage.getItem('onboarded');
      setIsOnboarded(onboarded === 'true');
    } catch (error) {
      console.error('Erro ao verificar onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <Loading message="Carregando..." />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isOnboarded ? (
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreenSuspended}
              listeners={{
                focus: () => {
                  // Callback será gerenciado via navigation listener
                },
              }}
            />
          ) : (
            <>
              <Stack.Screen name="Home" component={TabNavigator} />
              <Stack.Screen
                name="DailyPlan"
                component={DailyPlanScreenSuspended}
                options={{
                  headerShown: true,
                  title: 'Plano Diário',
                  headerStyle: { backgroundColor: colors.background },
                  headerTintColor: colors.foreground,
                }}
              />
              <Stack.Screen
                name="ContentDetail"
                component={ContentDetailScreenSuspended}
                options={{
                  headerShown: true,
                  title: 'Conteúdo',
                  headerStyle: { backgroundColor: colors.background },
                  headerTintColor: colors.foreground,
                }}
              />
              <Stack.Screen
                name="ComponentValidation"
                component={ComponentValidationScreenSuspended}
                options={{
                  headerShown: true,
                  title: 'Validação de Componentes',
                  headerStyle: { backgroundColor: colors.background },
                  headerTintColor: colors.foreground,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
