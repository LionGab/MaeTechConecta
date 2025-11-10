import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDailyInsight } from '@/hooks/useDailyInsight';
import { usePlanoDoDia } from '@/hooks/usePlanoDoDia';
import { usePersonalizedContent } from '@/hooks/usePersonalizedContent';
import { ingestEvent, updateFrequencyCap } from '@/services/personalization';
import { supabase } from '@/services/supabase';
import type { NavigationProp } from '@react-navigation/native';

import { EMERGENCY_NUMBER } from './constants';
import type { RootStackParamList } from '@/navigation/types';
import type { QuickAction } from './types';

interface UseHomeScreenDataParams {
  navigation: NavigationProp<RootStackParamList>;
}

export const useHomeScreenData = ({ navigation }: UseHomeScreenDataParams) => {
  const [userName, setUserName] = useState<string>('mãe valente');
  const [pregnancyWeek, setPregnancyWeek] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showWhyThisModal, setShowWhyThisModal] = useState(false);

  const { insight, loading: insightLoading, regenerate, markAsViewed } = useDailyInsight();
  const { plan, isLoading: planLoading, replan, isReplanning } = usePlanoDoDia(userId ?? '', Boolean(userId));
  const { content: personalizedContent, trackInteraction } = usePersonalizedContent({
    userId: userId ?? '',
    limit: 5,
    autoFetch: Boolean(userId),
  });

  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        key: 'chat',
        label: 'Conversar',
        emoji: '💬',
        gradientKey: 'pink',
        onPress: () => navigation.navigate('Chat'),
        accessibilityLabel: 'Abrir chat acolhedor',
      },
      {
        key: 'plan',
        label: 'Plano do dia',
        emoji: '🗓️',
        gradientKey: 'lavender',
        onPress: () => navigation.navigate('DailyPlan'),
        accessibilityLabel: 'Ver plano diário personalizado',
      },
      {
        key: 'progress',
        label: 'Progresso',
        emoji: '📊',
        gradientKey: 'green',
        onPress: () => Alert.alert('Em breve', 'Acompanhe seu progresso em uma próxima atualização.'),
        accessibilityLabel: 'Visualizar progresso',
      },
      {
        key: 'profile',
        label: 'Perfil',
        emoji: '👤',
        gradientKey: 'amber',
        onPress: () => navigation.navigate('Profile'),
        accessibilityLabel: 'Editar perfil',
      },
    ],
    [navigation]
  );

  useEffect(() => {
    void loadUserProfile();
  }, []);

  const loadUserProfile = useCallback(async () => {
    try {
      const profileJson = await AsyncStorage.getItem('userProfile');
      if (profileJson) {
        const profile = JSON.parse(profileJson);
        setUserName(profile.name ?? 'mãe valente');
        setPregnancyWeek(profile.pregnancy_week ?? null);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil local:', error);
    }
  }, []);

  const handleItemCtaPressed = useCallback(
    async (item: any) => {
      if (!userId) {
        return;
      }
      try {
        await ingestEvent(userId, 'notification_opened', {
          type: item.type,
          cta: item.cta,
          scheduled_at: item.scheduled_at,
        });
        if (item.type === 'habit') {
          navigation.navigate('Habits' as never);
        } else if (item.type === 'content') {
          navigation.navigate('MaeValente' as never);
        } else if (item.type === 'check-in') {
          navigation.navigate('Chat');
        }
        Alert.alert('Ação registrada', 'Estamos ao seu lado em cada passo. 💕');
      } catch (error) {
        console.error('Erro ao processar CTA:', error);
      }
    },
    [navigation, userId]
  );

  const handleDecreaseFrequency = useCallback(async () => {
    if (!userId) {
      return;
    }
    try {
      const { data, error } = await supabase.from('user_profiles').select('frequency_cap').eq('id', userId).single();
      if (error) {
        throw error;
      }
      const currentCap = typeof data?.frequency_cap === 'number' ? data.frequency_cap : 0;
      const updatedCap = Math.max(0, currentCap - 1);
      if (updatedCap === currentCap) {
        Alert.alert('Tudo certo', 'Você já está no limite mínimo de lembretes diários.');
        setShowWhyThisModal(false);
        return;
      }
      await updateFrequencyCap(userId, updatedCap);
      Alert.alert('Frequência atualizada', 'Diminuímos o volume de lembretes para você descansar mais.');
      setShowWhyThisModal(false);
    } catch (error) {
      console.error('Erro ao atualizar frequência:', error);
      Alert.alert('Ops', 'Não conseguimos ajustar agora. Tente novamente mais tarde.');
    }
  }, [userId]);

  const handleChatAboutInsight = useCallback(() => {
    if (!insight) return;
    markAsViewed();
    navigation.navigate('Chat', {
      context: insight.description,
      initialPrompt: `Quero conversar sobre: ${insight.title}`,
    });
  }, [insight, markAsViewed, navigation]);

  const handleEmergencyPress = useCallback(() => {
    Alert.alert(
      '🚨 Emergência',
      'Você será direcionado para ligar para o SAMU (192).\nSe estiver em risco, ligue imediatamente ou procure um hospital!',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ligar agora', style: 'destructive', onPress: () => Linking.openURL(`tel:${EMERGENCY_NUMBER}`) },
      ]
    );
  }, []);

  return {
    userName,
    pregnancyWeek,
    userId,
    showWhyThisModal,
    setShowWhyThisModal,
    plan,
    planLoading,
    replan,
    isReplanning,
    insight,
    insightLoading,
    regenerate,
    handleChatAboutInsight,
    personalizedContent,
    trackInteraction,
    handleItemCtaPressed,
    handleDecreaseFrequency,
    handleEmergencyPress,
    quickActions,
  };
};
