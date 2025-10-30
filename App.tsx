import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingScreen from './src/screens/OnboardingScreen';
import ChatScreen from './src/screens/ChatScreen';
import HomeScreen from './src/screens/HomeScreen';
import DailyPlanScreen from './src/screens/DailyPlanScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { supabase } from './src/services/supabase';

const Stack = createStackNavigator();

export default function App() {
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
    return null; // Tela de loading será adicionada
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isOnboarded ? (
            <Stack.Screen 
              name="Onboarding" 
              component={OnboardingScreen}
              initialParams={{ onComplete: () => setIsOnboarded(true) }}
            />
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="DailyPlan" component={DailyPlanScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

