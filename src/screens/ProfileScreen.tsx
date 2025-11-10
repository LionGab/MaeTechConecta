import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from '@/components/Card';
import theme from '@/constants/theme';

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

  const handleComingSoon = (feature: string) => {
    Alert.alert('Em Breve', `A funcionalidade "${feature}" estará disponível em breve! ✨`);
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
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
    ]);
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
          <View style={styles.avatarContainer}>
            <Image source={require('@/assets/images/nat2.png')} style={styles.avatarImage} resizeMode="cover" />
          </View>
          <Text style={styles.userName}>{profile?.name || 'Usuário'}</Text>
          <Text style={styles.userType}>
            {profile?.type === 'gestante' && '👶 Gestante'}
            {profile?.type === 'mae' && '🤱 Mãe'}
            {profile?.type === 'tentante' && '💕 Tentante'}
          </Text>
          {profile?.pregnancy_week && <Text style={styles.weekInfo}>Semana {profile.pregnancy_week}</Text>}
        </View>

        {/* Stats - Using Card for SurfaceCard */}
        <Card variant="elevated" style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <LinearGradient
                  colors={theme.colors.gradients.pink}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statIconGradient}
                >
                  <Text style={styles.statEmoji}>📅</Text>
                </LinearGradient>
              </View>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Dias no app</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <LinearGradient
                  colors={theme.colors.gradients.lavender}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statIconGradient}
                >
                  <Text style={styles.statEmoji}>💬</Text>
                </LinearGradient>
              </View>
              <Text style={styles.statNumber}>{profile?.daily_interactions || 0}</Text>
              <Text style={styles.statLabel}>Interações hoje</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <LinearGradient
                  colors={theme.colors.gradients.amber}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statIconGradient}
                >
                  <Text style={styles.statEmoji}>{profile?.subscription_tier === 'premium' ? '⭐' : '🎁'}</Text>
                </LinearGradient>
              </View>
              <Text style={styles.statNumber}>{profile?.subscription_tier === 'premium' ? 'Pro' : 'Free'}</Text>
              <Text style={styles.statLabel}>Plano</Text>
            </View>
          </View>
        </Card>

        {/* Preferences */}
        {profile?.preferences && profile.preferences.length > 0 && (
          <Card variant="elevated" style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Interesses</Text>
            {profile.preferences.map((pref: string, index: number) => (
              <View key={index} style={styles.preferenceItem}>
                <Text style={styles.preferenceText}>{pref}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Settings */}
        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleComingSoon('Notificações')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Notificações - Em breve"
          >
            <View style={styles.settingLeft}>
              <Icon name="bell-outline" size={24} color={theme.colors.foreground} style={styles.settingIcon} />
              <View>
                <Text style={styles.settingText}>Notificações</Text>
                <Text style={styles.settingSubtitle}>Gerencie suas notificações</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.mutedForeground} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleComingSoon('Aparência')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Aparência - Em breve"
          >
            <View style={styles.settingLeft}>
              <Icon name="palette-outline" size={24} color={theme.colors.foreground} style={styles.settingIcon} />
              <View>
                <Text style={styles.settingText}>Aparência</Text>
                <Text style={styles.settingSubtitle}>Tema e personalização</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.mutedForeground} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleComingSoon('Privacidade')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Privacidade - Em breve"
          >
            <View style={styles.settingLeft}>
              <Icon name="lock-outline" size={24} color={theme.colors.foreground} style={styles.settingIcon} />
              <View>
                <Text style={styles.settingText}>Privacidade</Text>
                <Text style={styles.settingSubtitle}>Dados e segurança</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.mutedForeground} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleComingSoon('Ajuda & Suporte')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Ajuda & Suporte - Em breve"
          >
            <View style={styles.settingLeft}>
              <Icon name="help-circle-outline" size={24} color={theme.colors.foreground} style={styles.settingIcon} />
              <View>
                <Text style={styles.settingText}>Ajuda & Suporte</Text>
                <Text style={styles.settingSubtitle}>Tire suas dúvidas</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.mutedForeground} />
          </TouchableOpacity>
        </Card>

        {/* About */}
        <Card variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.aboutText}>
            Nossa Maternidade é sua assistente virtual personalizada para gravidez e maternidade.
          </Text>
          <Text style={styles.versionText}>Versão 1.0.0</Text>
        </Card>

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
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerBack: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.primary,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.foreground,
  },
  content: {
    padding: theme.spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing['2xl'],
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  avatarContainer: {
    marginBottom: theme.spacing.lg,
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: theme.colors.primary,
    ...theme.shadows.lg,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.primary,
  },
  userType: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.primary,
  },
  weekInfo: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold as any,
    fontFamily: theme.typography.fontFamily.primary,
  },
  statsCard: {
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statIconContainer: {
    marginBottom: theme.spacing.xs,
  },
  statIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  statEmoji: {
    fontSize: 28,
  },
  statNumber: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.foreground,
    fontFamily: theme.typography.fontFamily.primary,
  },
  statLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.mutedForeground,
    fontFamily: theme.typography.fontFamily.primary,
    textAlign: 'center',
  },
  sectionCard: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily.primary,
  },
  preferenceItem: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  preferenceText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.foreground,
    fontFamily: theme.typography.fontFamily.primary,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: theme.spacing.md,
  },
  settingText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.foreground,
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.weights.medium as any,
  },
  settingSubtitle: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.mutedForeground,
    fontFamily: theme.typography.fontFamily.primary,
    marginTop: 2,
  },
  aboutText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.mutedForeground,
    lineHeight: theme.typography.lineHeights.normal,
    marginBottom: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily.primary,
  },
  versionText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.mutedForeground,
    fontFamily: theme.typography.fontFamily.primary,
  },
  logoutButton: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: theme.colors.destructive,
    ...theme.shadows.sm,
  },
  logoutText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.destructive,
    fontWeight: theme.typography.weights.bold as any,
    fontFamily: theme.typography.fontFamily.primary,
  },
});

