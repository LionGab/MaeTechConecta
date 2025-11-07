import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StatusBar, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { makeStyles, theme } from '@/theme/nathTheme';
import { SurfaceCard } from '@/shared/components/ui/SurfaceCard';
import { PrimaryButton } from '@/shared/components/ui/PrimaryButton';
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
  iconName: string;
  title: string;
  onPress: () => void;
  accessibilityLabel: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  iconName,
  title,
  onPress,
  accessibilityLabel,
}) => {
  const styles = useStyles();

  return (
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
        <Icon name={iconName} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const styles = useStyles();
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
    refetch: refetchContent,
  } = usePersonalizedContent({
    userId: userId || '',
    limit: 5,
    autoFetch: !!userId,
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    }
  };

  const handleItemCtaPressed = useCallback(
    async (item: any) => {
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
    },
    [userId, navigation]
  );

  const handleDecreaseFrequency = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('frequency_cap')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      const currentCap = typeof profile?.frequency_cap === 'number' ? profile.frequency_cap : 0;
      const updatedCap = Math.max(0, currentCap - 1);

      if (updatedCap === currentCap) {
        setShowWhyThisModal(false);
        Alert.alert('Informação', 'Você já está recebendo o mínimo de lembretes por dia.');
        return;
      }

      await updateFrequencyCap(userId, updatedCap);
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
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.bg} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#DCEBFA', '#FFF8F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.avatarContainer}>
                <Icon name="account-circle" size={60} color={theme.colors.primary} />
              </View>
              <Text style={styles.heroMessage}>
                Você é forte. Mesmo nos dias em que não parece.
              </Text>
              {pregnancyWeek && (
                <View style={styles.pregnancyBadge}>
                  <Icon name="heart-pulse" size={16} color={theme.colors.accent} />
                  <Text style={styles.pregnancyText}>Semana {pregnancyWeek}</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Plano do Dia Personalizado */}
        {userId && plan && plan.items.length > 0 && (
          <SurfaceCard style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Seu Plano de Hoje</Text>
              <TouchableOpacity
                onPress={() => setShowWhyThisModal(true)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Por que estou vendo isso?"
              >
                <Text style={styles.whyThisLink}>Por que estou vendo isso?</Text>
              </TouchableOpacity>
            </View>
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
                <Icon name="refresh" size={18} color={theme.colors.primary} />
                <Text style={styles.replanButtonText}>Replanejar hoje</Text>
              </TouchableOpacity>
            )}
          </SurfaceCard>
        )}

        {/* Conteúdo Personalizado */}
        {userId && personalizedContent.length > 0 && (
          <View style={styles.personalizedContentSection}>
            <View style={styles.sectionHeader}>
              <Icon name="star-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Recomendado para Você</Text>
            </View>
            <View style={styles.personalizedContentContainer}>
              {personalizedContent.slice(0, 3).map((item) => (
                <PersonalizedContentCard key={item.id} content={item} onInteraction={trackInteraction} isDark={false} />
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
                <Icon name="chevron-right" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Botões de ação rápida */}
        <View style={styles.quickActionsContainer}>
          <QuickActionButton
            iconName="chat"
            title="Conversar"
            accessibilityLabel="Botão Conversar"
            onPress={() => navigation.navigate('Chat')}
          />
          <QuickActionButton
            iconName="calendar-star"
            title="Plano Diário"
            accessibilityLabel="Botão Plano Diário"
            onPress={() => navigation.navigate('DailyPlan')}
          />
          <QuickActionButton
            iconName="chart-line"
            title="Progresso"
            accessibilityLabel="Botão Progresso"
            onPress={() => Alert.alert('Em breve', 'Acompanhe seu progresso aqui!')}
          />
          <QuickActionButton
            iconName="account"
            title="Perfil"
            accessibilityLabel="Botão Perfil"
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
            <Icon name="sleep" size={24} color={theme.colors.accent} />
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
              <Icon name="stomach" size={20} color={theme.colors.primary} style={styles.faqIcon} />
              <Text style={styles.faqQuestion}>Como aliviar enjoo matinal?</Text>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.primary} />
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
              <Icon name="run" size={20} color={theme.colors.primary} style={styles.faqIcon} />
              <Text style={styles.faqQuestion}>Quais exercícios posso fazer?</Text>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.primary} />
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
              <Icon name="stethoscope" size={20} color={theme.colors.primary} style={styles.faqIcon} />
              <Text style={styles.faqQuestion}>Quando devo ir ao médico?</Text>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.primary} />
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

const useStyles = () =>
  makeStyles((t) => ({
    safeArea: {
      flex: 1,
      backgroundColor: t.colors.bg,
    },
    container: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: t.spacing.xxl,
    },
    // Hero Section
    heroSection: {
      marginBottom: t.spacing.lg,
    },
    heroGradient: {
      paddingHorizontal: t.spacing.lg,
      paddingVertical: t.spacing.xl,
    },
    heroContent: {
      alignItems: 'center',
    },
    avatarContainer: {
      marginBottom: t.spacing.md,
      ...t.shadow.card,
      borderRadius: 999,
      backgroundColor: '#FFFFFF',
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
    },
    heroMessage: {
      ...t.typography.h1,
      color: t.colors.text,
      textAlign: 'center',
      marginBottom: t.spacing.md,
      paddingHorizontal: t.spacing.md,
    },
    pregnancyBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.xs,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: t.spacing.md,
      paddingVertical: t.spacing.sm,
      borderRadius: t.radius.pill,
      ...t.shadow.card,
    },
    pregnancyText: {
      ...t.typography.sub,
      color: t.colors.text,
    },
    // Quick Actions
    quickActionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: t.spacing.lg,
      marginBottom: t.spacing.lg,
      gap: t.spacing.md,
      flexWrap: 'wrap',
    },
    quickAction: {
      flex: 1,
      minWidth: '45%',
      alignItems: 'center',
      backgroundColor: t.colors.card,
      padding: t.spacing.md,
      borderRadius: t.radius.lg,
      minHeight: 100,
      ...t.shadow.card,
    },
    quickActionIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: t.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: t.spacing.sm,
      ...t.shadow.card,
    },
    quickActionTitle: {
      ...t.typography.body,
      color: t.colors.text,
      textAlign: 'center',
      fontWeight: '600',
    },
    // Cards
    tipsCard: {
      marginHorizontal: t.spacing.lg,
      marginBottom: t.spacing.lg,
    },
    tipContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: t.spacing.md,
    },
    tipText: {
      ...t.typography.body,
      color: t.colors.textMuted,
      lineHeight: 24,
      flex: 1,
    },
    faqCard: {
      marginHorizontal: t.spacing.lg,
      marginBottom: t.spacing.lg,
    },
    faqItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: t.spacing.md,
      paddingHorizontal: t.spacing.md,
      borderRadius: t.radius.md,
      backgroundColor: t.colors.bg,
      marginBottom: t.spacing.sm,
      minHeight: 52,
    },
    faqQuestionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: t.spacing.sm,
    },
    faqIcon: {
      marginRight: t.spacing.xs,
    },
    faqQuestion: {
      ...t.typography.body,
      color: t.colors.text,
      flex: 1,
      lineHeight: 22,
    },
    emergencyButton: {
      marginHorizontal: t.spacing.lg,
      marginTop: t.spacing.lg,
      marginBottom: t.spacing.xxl,
    },
    // Plano do Dia
    planCard: {
      marginBottom: t.spacing.lg,
      marginHorizontal: t.spacing.lg,
    },
    planHeader: {
      flexDirection: 'column',
      marginBottom: t.spacing.md,
    },
    planTitle: {
      ...t.typography.h2,
      color: t.colors.text,
      marginBottom: t.spacing.sm,
    },
    whyThisLink: {
      ...t.typography.sub,
      color: t.colors.primary,
      textDecorationLine: 'underline',
    },
    replanButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: t.spacing.sm,
      paddingHorizontal: t.spacing.md,
      marginTop: t.spacing.md,
      gap: t.spacing.xs,
    },
    replanButtonText: {
      ...t.typography.body,
      color: t.colors.primary,
      fontWeight: '600',
    },
    replanningContainer: {
      alignItems: 'center',
      paddingVertical: t.spacing.sm,
      marginTop: t.spacing.md,
    },
    replanningText: {
      ...t.typography.body,
      color: t.colors.textMuted,
    },
    // Conteúdo Personalizado
    personalizedContentSection: {
      marginBottom: t.spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
      paddingHorizontal: t.spacing.lg,
      marginBottom: t.spacing.md,
    },
    sectionTitle: {
      ...t.typography.h2,
      color: t.colors.text,
    },
    personalizedContentContainer: {
      gap: t.spacing.md,
    },
    viewMoreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: t.spacing.md,
      paddingHorizontal: t.spacing.lg,
      marginHorizontal: t.spacing.lg,
      marginTop: t.spacing.md,
      backgroundColor: t.colors.primarySoft,
      borderRadius: t.radius.lg,
      gap: t.spacing.xs,
      minHeight: 48,
    },
    viewMoreText: {
      ...t.typography.body,
      color: t.colors.primary,
      fontWeight: '600',
    },
  }));
