import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, UserProfile } from '../services/supabase';
import { Logo } from '../components/Logo';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

interface OnboardingScreenProps {
  route: {
    params: {
      onComplete: () => void;
    };
  };
}

export default function OnboardingScreen({ route }: OnboardingScreenProps) {
  const navigation = useNavigation();
  const { onComplete } = route.params;

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [type, setType] = useState<'gestante' | 'mae' | 'tentante' | null>(null);
  const [pregnancyWeek, setPregnancyWeek] = useState('');
  const [babyName, setBabyName] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const preferencesOptions = [
    'Alimentação saudável 🥗',
    'Exercícios físicos 🏃',
    'Bem-estar mental 🧘',
    'Preparação para o parto 👶',
    'Amamentação 🤱',
    'Sono do bebê 😴',
    'Relacionamento 💑',
  ];

  const togglePreference = (pref: string) => {
    if (preferences.includes(pref)) {
      setPreferences(preferences.filter(p => p !== pref));
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      Alert.alert('Ops!', 'Por favor, digite seu nome');
      return;
    }
    if (step === 2 && !type) {
      Alert.alert('Ops!', 'Por favor, selecione uma opção');
      return;
    }
    if (step === 3 && type === 'gestante' && !pregnancyWeek) {
      Alert.alert('Ops!', 'Por favor, informe a semana de gravidez');
      return;
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Criar perfil no Supabase
      const { data: { user } } = await supabase.auth.signUp({
        email: `${Date.now()}@temp.com`, // Email temporário
        password: `${Date.now()}-${Math.random()}`, // Senha temporária
      });

      if (user) {
        // Salvar perfil do usuário
        const profile: Partial<UserProfile> = {
          id: user.id,
          name,
          type: type!,
          pregnancy_week: type === 'gestante' ? parseInt(pregnancyWeek) : undefined,
          baby_name: babyName || undefined,
          preferences,
          subscription_tier: 'free',
          daily_interactions: 0,
          last_interaction_date: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('user_profiles')
          .insert(profile);

        if (error) throw error;

        // Salvar dados localmente
        await AsyncStorage.setItem('onboarded', 'true');
        await AsyncStorage.setItem('userProfile', JSON.stringify(profile));

        onComplete();
      }
    } catch (error: any) {
      console.error('Erro ao completar onboarding:', error);
      Alert.alert('Erro', 'Não foi possível salvar seus dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Logo size={120} />
        </View>
        <Text style={styles.title}>Bem-vinda ao Nossa Maternidade! 👶💕</Text>
        <Text style={styles.subtitle}>
          Vou te conhecer melhor para poder te ajudar da melhor forma
        </Text>

        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Qual é o seu nome?</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Como você se identifica?</Text>
            <TouchableOpacity
              style={[styles.option, type === 'gestante' && styles.optionSelected]}
              onPress={() => setType('gestante')}
            >
              <Text style={styles.optionText}>👶 Gestante</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, type === 'mae' && styles.optionSelected]}
              onPress={() => setType('mae')}
            >
              <Text style={styles.optionText}>🤱 Mãe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, type === 'tentante' && styles.optionSelected]}
              onPress={() => setType('tentante')}
            >
              <Text style={styles.optionText}>💕 Tentante</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && type === 'gestante' && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Em que semana de gestação você está?</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 28"
              keyboardType="number-pad"
              value={pregnancyWeek}
              onChangeText={setPregnancyWeek}
            />
            <Text style={styles.subtitle}>
              Digite a semana: {pregnancyWeek || '0'}
            </Text>
          </View>
        )}

        {step === 3 && (type === 'mae' || type === 'tentante') && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Qual é o nome do seu bebê?</Text>
            <TextInput
              style={styles.input}
              placeholder="Ou deixe em branco se preferir"
              value={babyName}
              onChangeText={setBabyName}
            />
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Quais são seus principais interesses?</Text>
            <Text style={styles.subtitle}>Selecione os que mais te interessam:</Text>
            {preferencesOptions.map(pref => (
              <TouchableOpacity
                key={pref}
                style={[
                  styles.preferenceOption,
                  preferences.includes(pref) && styles.preferenceSelected,
                ]}
                onPress={() => togglePreference(pref)}
              >
                <Text style={styles.preferenceText}>{pref}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {step < 4 ? 'Próximo' : 'Começar agora!'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setStep(Math.max(1, step - 1))}>
          <Text style={styles.backButton}>{step > 1 ? 'Voltar' : ''}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold as any,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  stepContainer: {
    marginBottom: spacing['2xl'],
  },
  stepTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.foreground,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    fontSize: typography.sizes.base,
    marginBottom: spacing.lg,
    color: colors.foreground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  option: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: typography.sizes.lg,
    color: colors.foreground,
  },
  preferenceOption: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  preferenceSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
  },
  preferenceText: {
    fontSize: typography.sizes.base,
    color: colors.foreground,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.primaryForeground,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
  },
  backButton: {
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: spacing.lg,
    fontSize: typography.sizes.base,
  },
});

