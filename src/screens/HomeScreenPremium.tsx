/**
 * 🌅 Home Screen Premium - Tema "Amanhecer Sereno"
 * Exemplo de implementação do tema Serene Dawn
 * 
 * Features:
 * - Background com gradiente premium
 * - Cards glass com efeito glassmorphism
 * - Botões com gradiente azul→dourado
 * - Micro-interações e haptic feedback
 * - Tipografia Inter + Roboto
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logo } from '@/components/Logo';
import { ButtonPremium } from '@/components/ButtonPremium';
import { CardGlass } from '@/components/CardGlass';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '@/navigation/types';
import {
  sereneDawnColors,
  sereneDawnGradients,
  sereneDawnOverlay,
  sereneDawnShadows,
  sereneDawnTypography,
  sereneDawnSpacing,
  sereneDawnBorderRadius,
} from '@/theme/sereneDawn';

// =====================================================
// QUICK ACTION BUTTON
// =====================================================

interface QuickActionButtonProps {
  iconEmoji?: string;
  title: string;
  onPress: () => void;
  accessibilityLabel: string;
  gradientColors?: [string, string];
}

const QuickActionButton: React.FC<QuickActionButtonProps> = React.memo(
  ({ iconEmoji, title, onPress, accessibilityLabel, gradientColors }) => (
    <TouchableOpacity
      style={styles.quickAction}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      activeOpacity={0.8}
    >
      {/* Background glass */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: sereneDawnOverlay.glass },
        ]}
      />

      <LinearGradient
        colors={gradientColors || sereneDawnGradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        opacity={0.3}
      />

      {/* Conteúdo */}
      <View style={styles.quickActionContent}>
        <View style={styles.quickActionIconContainer}>
          <LinearGradient
            colors={gradientColors || sereneDawnGradients.primaryWithGold}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickActionIconGradient}
          >
            <Text style={styles.quickActionEmoji}>{iconEmoji || '✨'}</Text>
          </LinearGradient>
        </View>
        <Text style={styles.quickActionTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
);

// =====================================================
// HOME SCREEN COMPONENT
// =====================================================

export default function HomeScreenPremium() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [userName, setUserName] = useState('');
  const [pregnancyWeek, setPregnancyWeek] = useState<number | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const profileJson = await AsyncStorage.getItem('userProfile');
    if (profileJson) {
      const profile = JSON.parse(profileJson);
      setUserName(profile.name || 'Querida');
      setPregnancyWeek(profile.pregnancy_week);
    }
  };

  const handleEmergency = useCallback(() => {
    Alert.alert(
      '🚨 Emergência',
      'Você será direcionado para ligar para o SAMU (192).',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ligar Agora',
          style: 'destructive',
          onPress: () => {
            // Implementar ligação
          },
        },
      ]
    );
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={sereneDawnColors.midnightBlue} />

      {/* Background Gradient Premium */}
      <LinearGradient
        colors={[
          sereneDawnColors.midnightBlue,
          sereneDawnColors.darkPetrol,
          sereneDawnColors.twilight,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Círculos decorativos */}
      <View style={[styles.decorativeCircle1, { backgroundColor: `${sereneDawnColors.sereneSky}12` }]} />
      <View style={[styles.decorativeCircle2, { backgroundColor: `${sereneDawnColors.champagne}10` }]} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoHeader}>
              <Logo size={50} />
            </View>

            {/* Greeting Card Glass */}
            <CardGlass variant="default" padding="lg" style={styles.greetingCard}>
              <View style={styles.greetingContent}>
                <Icon name="hand-wave" size={28} color={sereneDawnColors.champagne} />
                <Text style={styles.greeting}>Olá, {userName}!</Text>
              </View>
              {pregnancyWeek && (
                <View style={styles.subGreetingContainer}>
                  <Icon name="heart-pulse" size={18} color={sereneDawnColors.success} />
                  <Text style={styles.subGreeting}>Semana {pregnancyWeek} de gestação</Text>
                </View>
              )}
            </CardGlass>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <QuickActionButton
              iconEmoji="💬"
              title="Conversar"
              accessibilityLabel="Botão Conversar"
              gradientColors={[sereneDawnColors.sereneSky, sereneDawnColors.babyBlue]}
              onPress={() => navigation.navigate('Chat')}
            />
            <QuickActionButton
              iconEmoji="📅"
              title="Plano Diário"
              accessibilityLabel="Botão Plano Diário"
              gradientColors={[sereneDawnColors.slateBlue, sereneDawnColors.sereneSky]}
              onPress={() => navigation.navigate('DailyPlan')}
            />
            <QuickActionButton
              iconEmoji="📊"
              title="Progresso"
              accessibilityLabel="Botão Progresso"
              gradientColors={[sereneDawnColors.sereneSky, sereneDawnColors.champagne]}
              onPress={() => Alert.alert('Em breve', 'Acompanhe seu progresso aqui!')}
            />
            <QuickActionButton
              iconEmoji="👤"
              title="Perfil"
              accessibilityLabel="Botão Perfil"
              gradientColors={[sereneDawnColors.champagne, '#FFEAA7']}
              onPress={() => navigation.navigate('Profile')}
            />
          </View>

          {/* Plano do Dia */}
          <CardGlass
            title="💕 Seu Plano de Hoje"
            subtitle="Personalizado para você"
            icon="calendar-star"
            iconColor={sereneDawnColors.champagne}
            variant="elevated"
            style={styles.planCard}
          >
            <Text style={styles.planText}>
              Seu plano personalizado aparecerá aqui com base nas suas necessidades.
            </Text>

            <ButtonPremium
              variant="primaryGold"
              size="md"
              icon="refresh"
              iconPosition="left"
              onPress={() => Alert.alert('Replanejar', 'Gerando novo plano...')}
              accessibilityLabel="Replanejar hoje"
              style={styles.replanButton}
            >
              Replanejar hoje
            </ButtonPremium>
          </CardGlass>

          {/* Dica Diária */}
          <CardGlass
            title="✨ Dica do Dia"
            icon="lightbulb-on"
            iconColor={sereneDawnColors.warning}
            variant="default"
            style={styles.tipCard}
          >
            <View style={styles.tipContainer}>
              <Icon name="sleep" size={32} color={sereneDawnColors.babyBlue} />
              <Text style={styles.tipText}>
                Durante a gravidez, é normal sentir cansaço. Ouça seu corpo e descanse sempre que possível!
              </Text>
            </View>

            <ButtonPremium
              variant="ghost"
              size="sm"
              icon="chat"
              iconPosition="right"
              onPress={() => navigation.navigate('Chat')}
              accessibilityLabel="Conversar sobre esta dica"
              style={styles.tipButton}
            >
              Conversar sobre isso
            </ButtonPremium>
          </CardGlass>

          {/* FAQ Rápido */}
          <CardGlass
            title="💭 Perguntas Frequentes"
            icon="help-circle-outline"
            iconColor={sereneDawnColors.info}
            variant="outlined"
            style={styles.faqCard}
          >
            {[
              { icon: 'stomach', text: 'Como aliviar enjoo matinal?' },
              { icon: 'run', text: 'Quais exercícios posso fazer?' },
              { icon: 'stethoscope', text: 'Quando devo ir ao médico?' },
            ].map((faq, index) => (
              <TouchableOpacity
                key={index}
                style={styles.faqItem}
                onPress={() => navigation.navigate('Chat')}
                accessible={true}
                accessibilityRole="button"
                activeOpacity={0.7}
              >
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: sereneDawnOverlay.glass },
                  ]}
                />
                <Icon name={faq.icon} size={20} color={sereneDawnColors.babyBlue} />
                <Text style={styles.faqQuestion}>{faq.text}</Text>
                <Icon name="chevron-right" size={20} color={sereneDawnColors.slateBlue} />
              </TouchableOpacity>
            ))}
          </CardGlass>

          {/* Emergency Button */}
          <ButtonPremium
            variant="primary"
            size="lg"
            fullWidth
            icon="phone-alert"
            iconPosition="left"
            gradientColors={[sereneDawnColors.error, '#FCA5A5']}
            onPress={handleEmergency}
            accessibilityLabel="Botão de emergência - SAMU 192"
            style={styles.emergencyButton}
          >
            Emergência - SAMU 192
          </ButtonPremium>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: sereneDawnColors.midnightBlue,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: sereneDawnSpacing['3xl'],
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.6,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.5,
  },

  // Header
  header: {
    padding: sereneDawnSpacing.lg,
    paddingTop: sereneDawnSpacing.xl,
  },
  logoHeader: {
    alignItems: 'center',
    marginBottom: sereneDawnSpacing.lg,
  },
  greetingCard: {
    marginTop: sereneDawnSpacing.md,
  },
  greetingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sereneDawnSpacing.md,
    marginBottom: sereneDawnSpacing.sm,
  },
  greeting: {
    fontSize: sereneDawnTypography.sizes['3xl'],
    fontWeight: sereneDawnTypography.weights.bold,
    color: sereneDawnColors.warmWhite,
    fontFamily: sereneDawnTypography.fontFamily.heading,
    letterSpacing: -0.5,
  },
  subGreetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sereneDawnSpacing.xs,
    marginTop: sereneDawnSpacing.xs,
  },
  subGreeting: {
    fontSize: sereneDawnTypography.sizes.base,
    color: sereneDawnColors.slateBlue,
    fontFamily: sereneDawnTypography.fontFamily.body,
  },

  // Quick Actions
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: sereneDawnSpacing.lg,
    marginBottom: sereneDawnSpacing['2xl'],
    gap: sereneDawnSpacing.md,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    borderRadius: sereneDawnBorderRadius.xl,
    minHeight: 120,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: sereneDawnOverlay.primaryBorder,
    ...sereneDawnShadows.dark.md,
  },
  quickActionContent: {
    alignItems: 'center',
    padding: sereneDawnSpacing.lg,
  },
  quickActionIconContainer: {
    marginBottom: sereneDawnSpacing.md,
  },
  quickActionIconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...sereneDawnShadows.dark.md,
  },
  quickActionEmoji: {
    fontSize: 32,
  },
  quickActionTitle: {
    fontSize: sereneDawnTypography.sizes.sm,
    color: sereneDawnColors.warmWhite,
    textAlign: 'center',
    fontWeight: sereneDawnTypography.weights.semibold,
    fontFamily: sereneDawnTypography.fontFamily.heading,
  },

  // Cards
  planCard: {
    marginHorizontal: sereneDawnSpacing.lg,
    marginBottom: sereneDawnSpacing.xl,
  },
  planText: {
    fontSize: sereneDawnTypography.sizes.base,
    color: sereneDawnColors.slateBlue,
    lineHeight: 24,
    fontFamily: sereneDawnTypography.fontFamily.body,
    marginBottom: sereneDawnSpacing.lg,
  },
  replanButton: {
    marginTop: sereneDawnSpacing.md,
  },

  tipCard: {
    marginHorizontal: sereneDawnSpacing.lg,
    marginBottom: sereneDawnSpacing.xl,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: sereneDawnSpacing.md,
    marginBottom: sereneDawnSpacing.md,
  },
  tipText: {
    fontSize: sereneDawnTypography.sizes.base,
    color: sereneDawnColors.warmWhite,
    lineHeight: 24,
    fontFamily: sereneDawnTypography.fontFamily.body,
    flex: 1,
  },
  tipButton: {
    marginTop: sereneDawnSpacing.sm,
  },

  faqCard: {
    marginHorizontal: sereneDawnSpacing.lg,
    marginBottom: sereneDawnSpacing.xl,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sereneDawnSpacing.md,
    paddingVertical: sereneDawnSpacing.md,
    paddingHorizontal: sereneDawnSpacing.md,
    borderRadius: sereneDawnBorderRadius.md,
    marginBottom: sereneDawnSpacing.sm,
    minHeight: 56,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: sereneDawnOverlay.primaryBorderLight,
  },
  faqQuestion: {
    fontSize: sereneDawnTypography.sizes.base,
    color: sereneDawnColors.warmWhite,
    flex: 1,
    fontFamily: sereneDawnTypography.fontFamily.body,
  },

  emergencyButton: {
    marginHorizontal: sereneDawnSpacing.lg,
    marginTop: sereneDawnSpacing.xl,
  },
});

