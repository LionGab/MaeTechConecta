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
import { generateDailyPlan, ChatContext } from '../services/ai';
import { getDailyPlan, saveDailyPlan } from '../services/supabase';
import { format } from 'date-fns';

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerBack}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plano Diário</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        {!dailyPlan ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📅</Text>
            <Text style={styles.emptyStateTitle}>Nenhum plano para hoje</Text>
            <Text style={styles.emptyStateDescription}>
              Gere seu plano personalizado diário com prioridades, dicas e receitas!
            </Text>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGeneratePlan}
              disabled={generating}
            >
              <Text style={styles.generateButtonText}>
                {generating ? 'Gerando...' : 'Gerar Plano Agora'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Prioridades */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>🎯 Prioridades de Hoje</Text>
              {dailyPlan.priorities?.map((priority: string, index: number) => (
                <View key={index} style={styles.priorityItem}>
                  <Text style={styles.priorityNumber}>{index + 1}</Text>
                  <Text style={styles.priorityText}>{priority}</Text>
                </View>
              ))}
            </View>

            {/* Dica do Dia */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>💡 Dica do Dia</Text>
              <Text style={styles.tipText}>{dailyPlan.tip}</Text>
            </View>

            {/* Receita */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>🍽️ Receita Especial</Text>
              <Text style={styles.recipeText}>{dailyPlan.recipe}</Text>
            </View>

            {/* Botão para gerar novo plano */}
            <TouchableOpacity
              style={styles.regenerateButton}
              onPress={handleGeneratePlan}
              disabled={generating}
            >
              <Text style={styles.regenerateButtonText}>
                {generating ? 'Gerando novo plano...' : '🔄 Gerar Novo Plano'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5F1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE5F1',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
  emptyState: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  generateButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 15,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  priorityNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFB6D4',
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  priorityText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  tipText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  recipeText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  regenerateButton: {
    backgroundColor: '#FFB6D4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  regenerateButtonText: {
    color: '#E91E63',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

