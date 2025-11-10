import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ChatContext } from '@/services/ai';
// TODO: Migrar para daily-insight Edge Function (já implementada)
import { getDailyPlan, saveDailyPlan } from '@/services/supabase';
import { makeStyles, theme } from '@/theme/nathTheme';
import { EmptyState } from '@/shared/components/EmptyState';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function DailyPlanScreen() {
  const navigation = useNavigation();
  const [dailyPlan, setDailyPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadDailyPlan();
  }, []);

  const loadDailyPlan = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const today = format(new Date(), 'yyyy-MM-dd');

      if (userId) {
        const plan = await getDailyPlan(userId, today);
        setDailyPlan(plan);
      }
    } catch (error) {
      console.log('Erro ao carregar plano:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      const profileJson = await AsyncStorage.getItem('userProfile');
      const context: ChatContext = profileJson ? JSON.parse(profileJson) : {};

      // TODO: Migrar para daily-insight Edge Function
      // Fallback temporário com dados estáticos
      const planData = {
        priorities: ['💧 Beber 8 copos de água', '📅 Marcar consulta pré-natal', '🧘 Exercícios leves'],
        tip: 'Cuidar de você é cuidar do seu bebê! Tire um tempo para respirar hoje. 💕',
        recipe: 'Vitamina de Banana: 1 banana + 1 copo de leite + 1 colher de mel. Batido com gelo!',
      };
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

      Alert.alert('Sucesso!', 'Plano gerado com sucesso! 🎉');
    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      Alert.alert('Erro', 'Não foi possível gerar o plano');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Voltar"
          size="sm"
        >
          Voltar
        </Button>
        <Text style={styles.headerTitle}>Plano Diário</Text>
        <View style={{ width: 80 }} />
      </View>

      <View style={styles.content}>
        {!dailyPlan ? (
          <EmptyState
            icon="sprout"
            title="Nenhum plano para hoje"
            description="Gere seu plano personalizado diário com prioridades, dicas e receitas para cuidar de você!"
            actionLabel={generating ? 'Gerando...' : 'Gerar Plano Agora'}
            onAction={handleGeneratePlan}
          />
        ) : (
          <>
            {/* Prioridades */}
            <Card variant="elevated" style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Icon name="target" size={24} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Prioridades de Hoje</Text>
              </View>
              {dailyPlan.priorities?.map((priority: string, index: number) => (
                <View key={index} style={styles.priorityItem}>
                  <View style={styles.priorityNumber}>
                    <Text style={styles.priorityNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.priorityText}>{priority}</Text>
                </View>
              ))}
            </Card>

            {/* Dica do Dia */}
            <Card variant="elevated" style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Icon name="lightbulb-outline" size={24} color={theme.colors.accent} />
                <Text style={styles.sectionTitle}>Dica do Dia</Text>
              </View>
              <Text style={styles.tipText}>{dailyPlan.tip}</Text>
            </Card>

            {/* Receita */}
            <Card variant="elevated" style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Icon name="food-apple" size={24} color={theme.colors.success} />
                <Text style={styles.sectionTitle}>Receita Especial</Text>
              </View>
              <Text style={styles.recipeText}>{dailyPlan.recipe}</Text>
            </Card>

            {/* Botão para gerar novo plano */}
            <Button
              variant="ghost"
              icon="refresh"
              onPress={handleGeneratePlan}
              disabled={generating}
              accessibilityLabel="Gerar novo plano"
              style={styles.regenerateButton}
              fullWidth
            >
              {generating ? 'Gerando novo plano...' : 'Gerar Novo Plano'}
            </Button>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: t.colors.bg,
  },
  loadingText: {
    ...t.typography.body,
    color: t.colors.textMuted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: t.spacing.lg,
    backgroundColor: t.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
  },
  headerTitle: {
    ...t.typography.h1,
    color: t.colors.text,
  },
  content: {
    padding: t.spacing.lg,
  },
  sectionCard: {
    marginBottom: t.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: t.spacing.md,
    gap: t.spacing.sm,
  },
  sectionTitle: {
    ...t.typography.h2,
    color: t.colors.text,
    flex: 1,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: t.spacing.md,
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.md,
    backgroundColor: t.colors.primarySoft,
    borderRadius: t.radius.sm,
  },
  priorityNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: t.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: t.spacing.md,
  },
  priorityNumberText: {
    ...t.typography.body,
    fontWeight: '600',
    color: t.colors.card,
  },
  priorityText: {
    flex: 1,
    ...t.typography.body,
    color: t.colors.text,
    lineHeight: 22,
  },
  tipText: {
    ...t.typography.body,
    color: t.colors.textMuted,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  recipeText: {
    ...t.typography.body,
    color: t.colors.text,
    lineHeight: 22,
  },
  regenerateButton: {
    marginBottom: 40,
  },
}));

