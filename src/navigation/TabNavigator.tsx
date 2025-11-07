/**
 * Bottom Tab Navigator da Nossa Maternidade
 *
 * Navegação principal do app com 5 tabs
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
const HabitsScreen = lazy(() => import('@/features/habits/HabitsScreen').then((m) => ({ default: m.default })));
const ContentFeedScreen = lazy(() =>
  import('@/features/content/ContentFeedScreen').then((m) => ({ default: m.default }))
);
const ProfileScreen = lazy(() => import('@/screens/ProfileScreen').then((m) => ({ default: m.default })));

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
const HabitsScreenSuspended = withSuspense(HabitsScreen);
const ContentFeedScreenSuspended = withSuspense(ContentFeedScreen);
const ProfileScreenSuspended = withSuspense(ProfileScreen);

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
          tabBarLabel: 'Início',
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
          tabBarAccessibilityLabel: 'Conversar com NathIA',
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsScreenSuspended}
        options={{
          tabBarLabel: 'Hábitos',
          tabBarIcon: ({ color, size }) => <Icon name="check-circle" size={size} color={color} />,
          tabBarAccessibilityLabel: 'Meus hábitos',
        }}
      />
      <Tab.Screen
        name="Content"
        component={ContentFeedScreenSuspended}
        options={{
          tabBarLabel: 'Conteúdos',
          tabBarIcon: ({ color, size }) => <Icon name="play-circle" size={size} color={color} />,
          tabBarAccessibilityLabel: 'Conteúdos exclusivos',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreenSuspended}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <Icon name="account-circle" size={size} color={color} />,
          tabBarAccessibilityLabel: 'Meu perfil',
        }}
      />
    </Tab.Navigator>
  );
}
