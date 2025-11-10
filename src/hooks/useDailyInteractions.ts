import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { canUserInteract, DAILY_INTERACTION_LIMITS } from '@/services/payments';

export const useDailyInteractions = () => {
  const [dailyCount, setDailyCount] = useState(0);
  const [lastDate, setLastDate] = useState<string>('');

  useEffect(() => {
    checkAndResetDailyCount();
  }, []);

  const checkAndResetDailyCount = async () => {
    const today = new Date().toDateString();
    const storedDate = await AsyncStorage.getItem('lastInteractionDate');

    if (storedDate !== today) {
      setDailyCount(0);
      setLastDate(today);
      await AsyncStorage.setItem('lastInteractionDate', today);
      await AsyncStorage.setItem('dailyInteractions', '0');
    } else {
      const count = parseInt((await AsyncStorage.getItem('dailyInteractions')) || '0');
      setDailyCount(count);
    }
  };

  const incrementInteraction = async () => {
    const newCount = dailyCount + 1;
    setDailyCount(newCount);
    await AsyncStorage.setItem('dailyInteractions', newCount.toString());
  };

  const canInteract = async (subscriptionTier: 'free' | 'premium'): Promise<boolean> => {
    if (subscriptionTier === 'premium') return true;

    const limit = DAILY_INTERACTION_LIMITS.FREE;
    return dailyCount < limit;
  };

  const resetDailyCount = async () => {
    setDailyCount(0);
    await AsyncStorage.setItem('dailyInteractions', '0');
  };

  return {
    dailyCount,
    incrementInteraction,
    canInteract,
    resetDailyCount,
  };
};
