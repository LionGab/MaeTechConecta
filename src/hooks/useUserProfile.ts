import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../services/supabase';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileJson = await AsyncStorage.getItem('userProfile');
      if (profileJson) {
        setProfile(JSON.parse(profileJson));
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updatedProfile = { ...profile, ...updates } as UserProfile;
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  return { profile, loading, updateProfile, reload: loadProfile };
};

