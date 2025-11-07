import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors, shadows, spacing, borderRadius, typography } from '@/theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DailyInsightCard } from '@/components/home/DailyInsightCard';
import { useDailyInsight } from '@/hooks/useDailyInsight';
import { RootStackParamList } from '@/navigation/types';

interface QuickActionButtonProps {
  iconName?: string;
  iconEmoji?: string;
  title: string;
  onPress: () => void;
  accessibilityLabel: string;
  gradientColors?: [string, string];
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  iconName,
  iconEmoji,
  title,
  onPress,
  accessibilityLabel,
  gradientColors,
}) => (
  <TouchableOpacity
    style={styles.quickAction}
    onPress={onPress}
    accessible={true}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
    accessibilityHint={`Abre a tela de ${title.toLowerCase()}`}
    activeOpacity={0.8}
  >
    <View style={styles.quickActionIconContainer}>
      <LinearGradient
        colors={gradientColors || colors.gradients.pink}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.quickActionIconGradient}
      >
        {iconEmoji ? (
          <Text style={styles.quickActionEmoji}>{iconEmoji}</Text>
        ) : (
          <Icon name={iconName || 'help-circle'} size={28} color="#fff" />
        )}
      </LinearGradient>
    </View>
    <Text style={styles.quickActionTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [userName, setUserName] = useState('');
  const [pregnancyWeek, setPregnancyWeek] = useState<number | null>(null);

  // Daily Insight hook
  const { insight, loading: insightLoading, regenerate, markAsViewed } = useDailyInsight();

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

  const handleChatAboutInsight = useCallback(() => {
    if (insight) {
      // Marcar como visualizada
      markAsViewed();

      // Navegar para o chat com contexto da dica
      navigation.navigate('Chat', {
        context: insight.description,
        initialPrompt: `Quero conversar sobre: ${insight.title}`,
      });
    }
  }, [insight, markAsViewed, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoHeader}>
            <Logo size={50} />
          </View>
          <View style={styles.greetingContainer}>
            <Icon name="hand-wave" size={24} color={colors.primary} />
            <Text style={styles.greeting}>Olá, {userName}!</Text>
          </View>
          {pregnancyWeek && (
            <View style={styles.subGreetingContainer}>
              <Icon name="heart-pulse" size={18} color={colors.destructive} />
              <Text style={styles.subGreeting}>Semana {pregnancyWeek} de gestação</Text>
            </View>
          )}
        </View>

        {/* Botões de ação rápida */}
        <View style={styles.quickActionsContainer}>
          <QuickActionButton
            iconEmoji="💬"
            title="Conversar"
            accessibilityLabel="Botão Conversar"
            gradientColors={colors.gradients.blue}
            onPress={() => navigation.navigate('Chat')}
          />
          <QuickActionButton
            iconEmoji="📅"
            title="Plano Diário"
            accessibilityLabel="Botão Plano Diário"
            gradientColors={colors.gradients.purple}
            onPress={() => navigation.navigate('DailyPlan')}
          />
          <QuickActionButton
            iconEmoji="📊"
            title="Progresso"
            accessibilityLabel="Botão Progresso"
            gradientColors={colors.gradients.green}
            onPress={() => Alert.alert('Em breve', 'Acompanhe seu progresso aqui!')}
          />
          <QuickActionButton
            iconEmoji="👤"
            title="Perfil"
            accessibilityLabel="Botão Perfil"
            gradientColors={colors.gradients.amber}
            onPress={() => navigation.navigate('Profile')}
          />
        </View>

        {/* Dica Diária Personalizada */}
        <DailyInsightCard
          insight={insight}
          loading={insightLoading}
          onRefresh={regenerate}
          onActionPress={handleChatAboutInsight}
        />

        {/* Dicas Rápidas */}
        <Card title="Você sabia?" icon="lightbulb-on" variant="outlined" style={styles.tipsCard}>
          <View style={styles.tipContainer}>
            <Icon name="sleep" size={24} color={colors.accent} />
            <Text style={styles.tipText}>
              Durante a gravidez, é normal sentir cansaço. Ouça seu corpo e descanse sempre que possível!
            </Text>
          </View>
        </Card>

        {/* FAQ Rápido */}
        <Card title="Perguntas Frequentes" icon="help-circle-outline" variant="elevated" style={styles.faqCard}>
          <TouchableOpacity
            style={styles.faqItem}
            onPress={() => navigation.navigate('Chat')}
            accessible={true}
            accessibilityLabel="Perguntar: Como aliviar enjoo matinal?"
            accessibilityRole="button"
            activeOpacity={0.7}
          >
            <View style={styles.faqQuestionContainer}>
              <Icon name="stomach" size={20} color={colors.primary} style={styles.faqIcon} />
              <Text style={styles.faqQuestion}>Como aliviar enjoo matinal?</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.faqItem}
            onPress={() => navigation.navigate('Chat')}
            accessible={true}
            accessibilityLabel="Perguntar: Quais exercícios posso fazer?"
            accessibilityRole="button"
            activeOpacity={0.7}
          >
            <View style={styles.faqQuestionContainer}>
              <Icon name="run" size={20} color={colors.primary} style={styles.faqIcon} />
              <Text style={styles.faqQuestion}>Quais exercícios posso fazer?</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.faqItem}
            onPress={() => navigation.navigate('Chat')}
            accessible={true}
            accessibilityLabel="Perguntar: Quando devo ir ao médico?"
            accessibilityRole="button"
            activeOpacity={0.7}
          >
            <View style={styles.faqQuestionContainer}>
              <Icon name="stethoscope" size={20} color={colors.primary} style={styles.faqIcon} />
              <Text style={styles.faqQuestion}>Quando devo ir ao médico?</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.primary} />
          </TouchableOpacity>
        </Card>

        {/* Emergency Button */}
        <Button
          variant="destructive"
          size="lg"
          fullWidth
          icon="phone-alert"
          onPress={() => {
            Alert.alert(
              '🚨 Emergência',
              'Você será direcionado para ligar para o SAMU (192).\n\nSe você está com sintomas graves, ligue imediatamente ou procure um hospital!',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Ligar Agora',
                  style: 'destructive',
                  onPress: () => Linking.openURL('tel:192'),
                },
              ]
            );
          }}
          accessibilityLabel="Botão de emergência"
          accessibilityHint="Ligar para SAMU 192 em caso de emergência médica"
          style={styles.emergencyButton}
        >
          Emergência - SAMU 192
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing['2xl'],
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  logoHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.overlay.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.overlay.primaryBorder,
  },
  greeting: {
    fontSize: typography.sizes['3xl'],
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    fontFamily: typography.fontFamily.sans,
    letterSpacing: -0.5,
  },
  subGreetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  subGreeting: {
    fontSize: typography.sizes.base,
    color: colors.mutedForeground,
    fontFamily: typography.fontFamily.sans,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing['2xl'],
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: colors.overlay.white,
    padding: spacing.lg,
    paddingVertical: spacing.xl,
    borderRadius: borderRadius.xl,
    minHeight: 120,
    ...shadows.light.lg,
    borderWidth: 1,
    borderColor: colors.overlay.primaryBorderLight,
  },
  quickActionIconContainer: {
    marginBottom: spacing.md,
  },
  quickActionIconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.dark.md,
  },
  quickActionEmoji: {
    fontSize: 32,
  },
  quickActionTitle: {
    fontSize: typography.sizes.sm,
    color: colors.foreground,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: typography.fontFamily.sans,
  },
  tipsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  tipText: {
    fontSize: typography.sizes.base,
    color: colors.mutedForeground,
    lineHeight: 24,
    fontFamily: typography.fontFamily.sans,
    flex: 1,
  },
  faqCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
    minHeight: 52,
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  faqIcon: {
    marginRight: spacing.xs,
  },
  faqQuestion: {
    fontSize: typography.sizes.base,
    color: colors.foreground,
    flex: 1,
    lineHeight: 22,
    fontFamily: typography.fontFamily.sans,
  },
  emergencyButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing['3xl'],
  },
});
