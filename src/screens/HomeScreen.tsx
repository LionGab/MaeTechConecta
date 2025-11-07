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
import { PlanoDoDia } from '@/components/PlanoDoDia';
import { PorQueIssoModal } from '@/components/PorQueIssoModal';
import { usePlanoDoDia } from '@/hooks/usePlanoDoDia';
import { supabase } from '@/services/supabase';
import { updateFrequencyCap, ingestEvent } from '@/services/personalization';
import { usePersonalizedContent } from '@/hooks/usePersonalizedContent';
import { PersonalizedContentCard } from '@/components/PersonalizedContentCard';

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
  const [userId, setUserId] = useState<string | null>(null);
  const [showWhyThisModal, setShowWhyThisModal] = useState(false);

  // Daily Insight hook
  const { insight, loading: insightLoading, regenerate, markAsViewed } = useDailyInsight();

  // Plano do Dia hook
  const { plan, isLoading: planLoading, replan, isReplanning } = usePlanoDoDia(userId || '', !!userId);

  // Personalized Content hook
  const {
    content: personalizedContent,
    isLoading: contentLoading,
    trackInteraction,
    refetch: refetchContent
  } = usePersonalizedContent({
    userId: userId || '',
    limit: 5,
    autoFetch: !!userId
  });

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

    // Carregar userId da sessão
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    }
  };

  const handleItemCtaPressed = useCallback(async (item: any) => {
    if (!userId) return;

    // Registrar evento de CTA clicado
    try {
      await ingestEvent(userId, 'notification_opened', {
        type: item.type,
        cta: item.cta,
        scheduled_at: item.scheduled_at,
      });

      // Ação baseada no tipo
      if (item.type === 'habit') {
        // Navegar para Meus Hábitos
        navigation.navigate('Habits' as any);
      } else if (item.type === 'content') {
        // Navegar para Mãe Valente
        navigation.navigate('MaeValente' as any);
      } else if (item.type === 'check-in') {
        // Navegar para Chat
        navigation.navigate('Chat');
      }

      Alert.alert('✅ Ação registrada!', 'Continuamos te acompanhando. 💕');
    } catch (error) {
      console.error('Error handling CTA:', error);
    }
  }, [userId, navigation]);

  const handleDecreaseFrequency = useCallback(async () => {
    if (!userId) return;

    try {
      // Reduzir frequency_cap em 1 (mín. 0)
      await updateFrequencyCap(userId, 1);
      setShowWhyThisModal(false);
      Alert.alert(
        '✅ Frequência atualizada',
        'Você receberá menos lembretes por dia. Você pode ajustar isso quando quiser.'
      );
    } catch (error) {
      console.error('Error updating frequency:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a frequência.');
    }
  }, [userId]);

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

        {/* Plano do Dia Personalizado */}
        {userId && plan && plan.items.length > 0 && (
          <Card
            title="💕 Seu Plano de Hoje"
            icon="calendar-star"
            variant="outlined"
            style={styles.planCard}
          >
            <PlanoDoDia
              items={plan.items}
              rationale={plan.rationale}
              onWhyThisPressed={() => setShowWhyThisModal(true)}
              onItemCtaPressed={handleItemCtaPressed}
              isLoading={planLoading}
            />
            {isReplanning ? (
              <View style={styles.replanningContainer}>
                <Text style={styles.replanningText}>Replanejando...</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.replanButton}
                onPress={replan}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Replanejar hoje"
              >
                <Icon name="refresh" size={18} color={colors.primary} />
                <Text style={styles.replanButtonText}>Replanejar hoje</Text>
              </TouchableOpacity>
            )}
          </Card>
        )}

        {/* Conteúdo Personalizado */}
        {userId && personalizedContent.length > 0 && (
          <View style={styles.personalizedContentSection}>
            <View style={styles.sectionHeader}>
              <Icon name="star-outline" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Recomendado para Você</Text>
            </View>
            <View style={styles.personalizedContentContainer}>
              {personalizedContent.slice(0, 3).map((item) => (
                <PersonalizedContentCard
                  key={item.id}
                  content={item}
                  onInteraction={trackInteraction}
                  isDark={false}
                />
              ))}
            </View>
            {personalizedContent.length > 3 && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => Alert.alert('Em breve', 'Você poderá ver mais conteúdos personalizados!')}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Ver mais conteúdos recomendados"
              >
                <Text style={styles.viewMoreText}>Ver mais conteúdos</Text>
                <Icon name="chevron-right" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}

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

      {/* Modal "Por que isso?" */}
      <PorQueIssoModal
        visible={showWhyThisModal}
        onClose={() => setShowWhyThisModal(false)}
        rationale={plan?.rationale}
        onDecreaseFrequency={handleDecreaseFrequency}
      />
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
  // Plano do Dia
  planCard: {
    marginBottom: spacing.xl,
  },
  replanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  replanButtonText: {
    fontSize: typography.sizes.base,
    color: colors.primary,
    fontWeight: '600',
    fontFamily: typography.fontFamily.sans,
  },
  replanningContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  replanningText: {
    fontSize: typography.sizes.base,
    color: colors.mutedForeground,
    fontFamily: typography.fontFamily.sans,
  },
  // Conteúdo Personalizado
  personalizedContentSection: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.foreground,
    fontFamily: typography.fontFamily.sans,
  },
  personalizedContentContainer: {
    gap: spacing.md,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.overlay.primary,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  viewMoreText: {
    fontSize: typography.sizes.base,
    color: colors.primary,
    fontWeight: '600',
    fontFamily: typography.fontFamily.sans,
  },
});
