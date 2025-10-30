import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logo } from '../components/Logo';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const profileJson = await AsyncStorage.getItem('userProfile');
    if (profileJson) {
      setProfile(JSON.parse(profileJson));
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('onboarded');
            await AsyncStorage.removeItem('userProfile');
            await AsyncStorage.removeItem('userId');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            } as any);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerBack}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.logoContainer}>
            <Logo size={100} />
          </View>
          <Text style={styles.userName}>{profile?.name || 'Usuário'}</Text>
          <Text style={styles.userType}>
            {profile?.type === 'gestante' && '👶 Gestante'}
            {profile?.type === 'mae' && '🤱 Mãe'}
            {profile?.type === 'tentante' && '💕 Tentante'}
          </Text>
          {profile?.pregnancy_week && (
            <Text style={styles.weekInfo}>Semana {profile.pregnancy_week}</Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Dias no app</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.daily_interactions || 0}</Text>
            <Text style={styles.statLabel}>Interações hoje</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {profile?.subscription_tier === 'premium' ? '⭐' : '🆓'}
            </Text>
            <Text style={styles.statLabel}>Plano</Text>
          </View>
        </View>

        {/* Preferences */}
        {profile?.preferences && profile.preferences.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Interesses</Text>
            {profile.preferences.map((pref: string, index: number) => (
              <View key={index} style={styles.preferenceItem}>
                <Text style={styles.preferenceText}>{pref}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>🔔 Notificações</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>🎨 Aparência</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>🔒 Privacidade</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>❓ Ajuda & Suporte</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.aboutText}>
            Nossa Maternidade é sua assistente virtual personalizada para gravidez e maternidade. 💕
          </Text>
          <Text style={styles.versionText}>Versão 1.0.0</Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5F1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#FFB6D4',
  },
  headerBack: {
    fontSize: 16,
    color: '#E91E63',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    marginBottom: 20,
  },
  logoContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  weekInfo: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: 'bold',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 15,
  },
  preferenceItem: {
    backgroundColor: '#FFE5F1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  preferenceText: {
    fontSize: 14,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 14,
    color: '#333',
  },
  settingArrow: {
    fontSize: 18,
    color: '#E91E63',
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});

