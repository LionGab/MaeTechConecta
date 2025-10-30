import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateDailyPlan, ChatContext } from '../services/ai';
import { getDailyPlan, saveDailyPlan } from '../services/supabase';
import { format } from 'date-fns';
import { Logo } from '../components/Logo';
import { colors, shadows, spacing, borderRadius, typography } from '../theme/colors';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [pregnancyWeek, setPregnancyWeek] = useState<number | null>(null);
  const [dailyPlan, setDailyPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserProfile();
    loadDailyPlan();
  }, []);

  const loadUserProfile = async () => {
    const profileJson = await AsyncStorage.getItem('userProfile');
    if (profileJson) {
      const profile = JSON.parse(profileJson);
      setUserName(profile.name || 'Querida');
      setPregnancyWeek(profile.pregnancy_week);
    }
  };

  const loadDailyPlan = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (userId) {
      try {
        const plan = await getDailyPlan(userId, today);
        setDailyPlan(plan);
      } catch (error) {
        console.log('Nenhum plano encontrado para hoje');
      }
    }
  };

  const generateTodaysPlan = async () => {
    setLoading(true);
    try {
      const profileJson = await AsyncStorage.getItem('userProfile');
      const context: ChatContext = profileJson ? JSON.parse(profileJson) : {};

      const planData = await generateDailyPlan(context);
      setDailyPlan(planData);

      // Salvar no Supabase
      const userId = await AsyncStorage.getItem('userId');
      const today = format(new Date(), 'yyyy-MM-dd');
      
      if (userId) {
        await saveDailyPlan({
          user_id: userId,
          date: today,
          priorities: planData.priorities,
          tip: planData.tip,
          recipe: planData.recipe,
        });
      }
    } catch (error) {
      console.error('Erro ao gerar plano diário:', error);
      Alert.alert('Erro', 'Não foi possível gerar o plano diário');
    } finally {
      setLoading(false);
    }
  };

  const QuickActionButton = ({ icon, title, onPress }: any) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoHeader}>
          <Logo size={50} />
        </View>
        <Text style={styles.greeting}>Olá, {userName}! 👋</Text>
        {pregnancyWeek && (
          <Text style={styles.subGreeting}>Semana {pregnancyWeek} de gestação 💕</Text>
        )}
      </View>

      {/* Botões de ação rápida */}
      <View style={styles.quickActionsContainer}>
        <QuickActionButton
          icon="💬"
          title="Conversar"
          onPress={() => navigation.navigate('Chat' as never)}
        />
        <QuickActionButton
          icon="📅"
          title="Plano Diário"
          onPress={() => navigation.navigate('DailyPlan' as never)}
        />
        <QuickActionButton
          icon="📊"
          title="Progresso"
          onPress={() => Alert.alert('Em breve', 'Acompanhe seu progresso aqui!')}
        />
        <QuickActionButton
          icon="⚙️"
          title="Perfil"
          onPress={() => navigation.navigate('Profile' as never)}
        />
      </View>

      {/* Plano Diário */}
      <View style={styles.dailyPlanCard}>
        <View style={styles.dailyPlanHeader}>
          <Text style={styles.dailyPlanTitle}>🎯 Seu Plano de Hoje</Text>
          <TouchableOpacity onPress={generateTodaysPlan} disabled={loading}>
            <Text style={styles.refreshButton}>🔄</Text>
          </TouchableOpacity>
        </View>

        {dailyPlan ? (
          <View>
            <Text style={styles.sectionTitle}>Prioridades:</Text>
            {dailyPlan.priorities?.map((priority: string, index: number) => (
              <Text key={index} style={styles.priorityItem}>{priority}</Text>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 15 }]}>💡 Dica do Dia:</Text>
            <Text style={styles.tip}>{dailyPlan.tip}</Text>

            <Text style={[styles.sectionTitle, { marginTop: 15 }]}>🍽️ Receita:</Text>
            <Text style={styles.recipe}>{dailyPlan.recipe}</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.emptyState}>Nenhum plano gerado ainda para hoje.</Text>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={generateTodaysPlan}
              disabled={loading}
            >
              <Text style={styles.generateButtonText}>
                {loading ? 'Gerando...' : 'Gerar Plano Agora'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Dicas Rápidas */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💭 Você sabia?</Text>
        <Text style={styles.tipText}>
          Durante a gravidez, é normal sentir cansaço. Ouça seu corpo e descanse sempre que possível! 😴
        </Text>
      </View>

      {/* FAQ Rápido */}
      <View style={styles.faqCard}>
        <Text style={styles.faqTitle}>❓ Perguntas Frequentes</Text>
        <TouchableOpacity
          style={styles.faqItem}
          onPress={() => navigation.navigate('Chat' as never)}
        >
          <Text style={styles.faqQuestion}>Como aliviar enjoo matinal?</Text>
          <Text style={styles.faqArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.faqItem}
          onPress={() => navigation.navigate('Chat' as never)}
        >
          <Text style={styles.faqQuestion}>Quais exercícios posso fazer?</Text>
          <Text style={styles.faqArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.faqItem}
          onPress={() => navigation.navigate('Chat' as never)}
        >
          <Text style={styles.faqQuestion}>Quando devo ir ao médico?</Text>
          <Text style={styles.faqArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Button */}
      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={() =>
          Alert.alert(
            '🚨 Emergência',
            'Se você está com sintomas graves, ligue para o SAMU: 192\n\nOu procure um hospital imediatamente!',
            [{ text: 'Entendi', style: 'default' }]
          )
        }
      >
        <Text style={styles.emergencyButtonText}>🚨 Emergência</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingTop: 60,
  },
  logoHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold as any,
    color: colors.primary,
    textAlign: 'center',
  },
  subGreeting: {
    fontSize: typography.sizes.base,
    color: colors.mutedForeground,
    marginTop: spacing.sm,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    minWidth: 80,
    ...shadows.light.sm,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  quickActionTitle: {
    fontSize: typography.sizes.xs,
    color: colors.foreground,
    textAlign: 'center',
  },
  dailyPlanCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.light.md,
  },
  dailyPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dailyPlanTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.primary,
  },
  refreshButton: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
    color: colors.foreground,
    marginTop: spacing.md,
  },
  priorityItem: {
    fontSize: typography.sizes.sm,
    color: colors.mutedForeground,
    marginTop: spacing.sm,
  },
  tip: {
    fontSize: typography.sizes.sm,
    color: colors.mutedForeground,
    fontStyle: 'italic',
  },
  recipe: {
    fontSize: typography.sizes.sm,
    color: colors.mutedForeground,
  },
  emptyState: {
    fontSize: typography.sizes.sm,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  generateButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.light.md,
  },
  generateButtonText: {
    color: colors.primaryForeground,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold as any,
  },
  tipsCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.light.sm,
  },
  tipsTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  tipText: {
    fontSize: typography.sizes.sm,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  faqCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.light.sm,
  },
  faqTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faqQuestion: {
    fontSize: typography.sizes.sm,
    color: colors.foreground,
    flex: 1,
  },
  faqArrow: {
    fontSize: 18,
    color: colors.primary,
  },
  emergencyButton: {
    backgroundColor: colors.destructive,
    marginHorizontal: spacing.lg,
    marginBottom: 40,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.light.lg,
  },
  emergencyButtonText: {
    color: colors.destructiveForeground,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
  },
});

