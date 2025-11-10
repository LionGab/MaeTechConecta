/**
 * Bottom Tab Navigator da Nossa Maternidade
 *
 * Navegação principal com 5 tabs MVP Influencer
 * Home → NathIA → DesafiosDoDia → RedeValente → MãeValente
 * Personalização completa via onboarding
 * Otimizado com lazy loading
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { lazy, Suspense } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Loading } from '@/shared/components/Loading';
import { theme } from '@/theme/nathTheme';

import { TabParamList } from './types';

// Lazy load screens para melhor performance
const HomeScreen = lazy(() => import('@/screens/HomeScreen').then((m) => ({ default: m.default })));
const ChatScreen = lazy(() => import('@/screens/ChatScreen').then((m) => ({ default: m.default })));
const DesafiosDoDiaScreen = lazy(() => import('@/screens/DailyPlanScreen').then((m) => ({ default: m.default })));
const RedeValenteScreen = lazy(() => import('@/screens/RedeValenteScreen').then((m) => ({ default: m.default })));
const MaeValenteScreen = lazy(() => import('@/features/habits/HabitsScreen').then((m) => ({ default: m.default })));

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

const HomeScreenSuspended = withSuspense(HomeScreen);
const ChatScreenSuspended = withSuspense(ChatScreen);
const DesafiosDoDiaScreenSuspended = withSuspense(DesafiosDoDiaScreen);
const RedeValenteScreenSuspended = withSuspense(RedeValenteScreen);
const MaeValenteScreenSuspended = withSuspense(MaeValenteScreen);

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: theme.spacing.sm,
          paddingTop: theme.spacing.sm,
          borderTopLeftRadius: theme.radius.md,
          borderTopRightRadius: theme.radius.md,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIconStyle: {
          marginTop: theme.spacing.xs,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreenSuspended}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
          tabBarAccessibilityLabel: 'Página inicial',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreenSuspended}
        options={{
          tabBarLabel: 'NathIA',
          tabBarIcon: ({ color, size }) => <Icon name="robot" size={size} color={color} />,
          tabBarAccessibilityLabel: 'Conversar com IA',
        }}
      />
      <Tab.Screen
        name="DesafiosDoDia"
        component={DesafiosDoDiaScreenSuspended}
        options={{
          tabBarLabel: 'Desafios',
          tabBarIcon: ({ color, size }) => <Icon name="target" size={size} color={color} />,
          tabBarAccessibilityLabel: 'Desafios do Dia',
        }}
      />
      <Tab.Screen
        name="RedeValente"
        component={RedeValenteScreenSuspended}
        options={{
          tabBarLabel: 'Rede',
          tabBarIcon: ({ color, size }) => <Icon name="account-group" size={size} color={color} />,
          tabBarAccessibilityLabel: 'Rede Valente - Comunidade',
        }}
      />
      <Tab.Screen
        name="MaeValente"
        component={MaeValenteScreenSuspended}
        options={{
          tabBarLabel: 'Mãe Valente',
          tabBarIcon: ({ color, size }) => <Icon name="heart" size={size} color={color} />,
          tabBarAccessibilityLabel: 'Mãe Valente - Hábitos',
        }}
      />
    </Tab.Navigator>
  );
}

