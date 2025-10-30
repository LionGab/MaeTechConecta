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
    backgroundColor: '#FFE5F1',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  logoHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E91E63',
    textAlign: 'center',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    minWidth: 80,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  quickActionTitle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  dailyPlanCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dailyPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dailyPlanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  refreshButton: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  priorityItem: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  tip: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  recipe: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 15,
  },
  generateButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  faqCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 15,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqQuestion: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  faqArrow: {
    fontSize: 18,
    color: '#E91E63',
  },
  emergencyButton: {
    backgroundColor: '#e74c3c',
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

