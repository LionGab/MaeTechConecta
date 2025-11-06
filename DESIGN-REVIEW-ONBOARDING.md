# 🎨 Design Review: OnboardingScreen.tsx

**Data:** 2025-11-06
**Auditor:** Design Agent (Especialista UI/UX Mobile)
**Foco:** Publicação App Store + Google Play
**Público-Alvo:** Mães brasileiras classe C-D

---

## ✅ APROVADO - Aspectos Positivos

### 1. Acessibilidade Excelente
- ✅ **Todos os botões interativos** têm `accessibilityLabel` descritivo
- ✅ **`accessibilityRole`** corretamente implementado:
  - `button` para opções de tipo (Gestante/Mãe/Tentante)
  - `checkbox` para preferências
- ✅ **`accessibilityState`** com `selected`/`checked` dinâmico
- ✅ **`accessibilityHint`** no botão principal (ex: "Avançar para o passo 2 de 4")
- ✅ **Área de toque PERFEITA:**
  - Opções principais: **60px** (linha 337) ✅ Acima do mínimo 44px
  - Preferências: **52px** (linha 361) ✅ Acima do mínimo 44px

### 2. Consistência com Tema Bubblegum (Quase Perfeita)
- ✅ **0 cores hardcodadas** - 100% usando `colors.*` do tema
- ✅ **0 espaçamentos hardcodados** - 100% usando `spacing.*`
- ✅ **0 tipografia hardcodada** - 100% usando `typography.sizes.*` e `typography.weights.*`
- ✅ **0 borderRadius hardcodado** - 100% usando `borderRadius.lg`
- ✅ **Sombras do tema** - Usando `shadows.light.sm` e `shadows.light.md`

### 3. Hierarquia Visual Clara
- ✅ **Título principal** bem destacado: `typography.sizes['2xl']` (linha 302)
- ✅ **Ícone decorativo** no título (mother-heart, 32px)
- ✅ **Subtítulos** adequados: `typography.sizes.xl` para perguntas
- ✅ **Espaçamento generoso** entre seções: `spacing['2xl']`
- ✅ **Logo bem posicionada** (120px, centralizada)

### 4. Responsividade Completa
- ✅ **ScrollView** para conteúdo dinâmico (linha 116)
- ✅ **SafeAreaView** para áreas seguras (notch, home indicator)
- ✅ **Botões fullWidth** para melhor toque em telas pequenas
- ✅ **Textos centralizados** para legibilidade

### 5. UX para Público-Alvo (Classe C-D) - EXCELENTE
- ✅ **Linguagem simples e acolhedora:**
  - "Bem-vinda ao Nossa Maternidade!"
  - "Qual é o seu nome?"
  - "Como você se identifica?"
- ✅ **Ícones intuitivos:**
  - 👶 baby-carriage (Gestante)
  - 🤱 mother-nurse (Mãe)
  - 💕 heart-multiple (Tentante)
- ✅ **Botões descritivos:**
  - "Próximo" (com seta →)
  - "Começar agora!" (com check ✓)
  - "Voltar" (com seta ←)
- ✅ **Feedback visual claro:**
  - Estados selecionados destacados (fundo secundário + borda primary)
  - Loading state no botão
- ✅ **Mensagens de erro amigáveis:**
  - "Ops!" (tom leve)
  - "Por favor, digite seu nome" (sem jargão técnico)
- ✅ **Tamanhos de fonte generosos:** 16px+ (base), 18px (lg), 20px (xl), 24px (2xl)

---

## ⚠️ ATENÇÃO - Melhorias Sugeridas (Não Críticas)

### 1. Indicador de Progresso FALTANDO
**Problema:** Usuário não sabe em qual step está (1 de 4, 2 de 4, etc.)

**Impacto:**
- Usuário pode se sentir perdido
- Não sabe quanto falta para terminar
- Pode desistir no meio

**Sugestão:**
```tsx
// Adicionar acima do stepTitle:
<View style={styles.progressContainer}>
  <Text style={styles.progressText}>Passo {step} de 4</Text>
  <View style={styles.progressBar}>
    <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
  </View>
</View>

// Estilos:
progressContainer: {
  marginBottom: spacing.lg,
  alignItems: 'center',
},
progressText: {
  fontSize: typography.sizes.sm,
  color: colors.mutedForeground,
  marginBottom: spacing.xs,
  fontFamily: typography.fontFamily.sans,
},
progressBar: {
  width: '100%',
  height: 4,
  backgroundColor: colors.muted,
  borderRadius: borderRadius.full,
  overflow: 'hidden',
},
progressFill: {
  height: '100%',
  backgroundColor: colors.primary,
},
```

**Benefício:** Reduz ansiedade, aumenta taxa de conclusão

---

### 2. Alguns Valores Hardcoded (Não Crítico)
**Problema:** Poucos valores numéricos diretos no código

**Localização:**
- `minHeight: 60` (linha 337) - Opções principais
- `minHeight: 52` (linha 361) - Preferências
- `borderWidth: 2` (linha 335, 366)
- `borderWidth: 1` (linha 359)

**Sugestão:** Criar constantes no tema
```tsx
// Em src/theme/colors.ts adicionar:
export const sizes = {
  minTouchArea: 44,
  optionHeight: 60,
  preferenceHeight: 52,
};

export const borders = {
  thin: 1,
  medium: 2,
  thick: 3,
};

// Usar:
minHeight: sizes.optionHeight,
borderWidth: borders.medium,
```

**Benefício:** Mais consistência, mais fácil de ajustar globalmente

---

### 3. Acessibilidade de Títulos
**Problema:** Títulos sem `accessibilityRole="header"`

**Localização:**
- Linha 123: `<Text style={styles.title}>` (título principal)
- Linha 129, 143, 190, 206, 219: `<Text style={styles.stepTitle}>` (títulos de steps)

**Sugestão:**
```tsx
<Text
  style={styles.title}
  accessibilityRole="header"
  accessibilityLevel={1}
>
  Bem-vinda ao Nossa Maternidade!
</Text>

<Text
  style={styles.stepTitle}
  accessibilityRole="header"
  accessibilityLevel={2}
>
  Qual é o seu nome?
</Text>
```

**Benefício:** Melhor navegação para leitores de tela (VoiceOver/TalkBack)

---

### 4. Logo Decorativa sem Acessibilidade
**Problema:** Logo não marcado como decorativo

**Localização:** Linha 119: `<Logo size={120} />`

**Sugestão:**
```tsx
<View
  style={styles.logoContainer}
  accessible={false}
  importantForAccessibility="no"
>
  <Logo size={120} />
</View>
```

**Benefício:** Leitores de tela não anunciam elemento decorativo, focam no conteúdo

---

### 5. Validação de Semana de Gestação
**Problema:** Aceita qualquer número (ex: 100, -5)

**Localização:** Linha 55-57

**Sugestão:**
```tsx
const handleNext = () => {
  if (step === 1 && !name.trim()) {
    Alert.alert('Ops!', 'Por favor, digite seu nome');
    return;
  }
  if (step === 2 && !type) {
    Alert.alert('Ops!', 'Por favor, selecione uma opção');
    return;
  }
  if (step === 3 && type === 'gestante') {
    const week = parseInt(pregnancyWeek);
    if (!pregnancyWeek || isNaN(week)) {
      Alert.alert('Ops!', 'Por favor, informe a semana de gravidez');
      return;
    }
    if (week < 1 || week > 42) {
      Alert.alert('Ops!', 'A semana deve estar entre 1 e 42');
      return;
    }
  }
  // resto do código...
};
```

**Benefício:** Evita dados inválidos, melhora experiência

---

## ❌ PROBLEMAS CRÍTICOS (Bloqueiam Publicação)

### 1. 🔴 AUSÊNCIA DE CONSENTIMENTO LGPD (CRÍTICO)

**Severidade:** 🔴 **BLOQUEADOR** - Violação da Lei Geral de Proteção de Dados

**Problema:**
O app coleta **dados sensíveis de saúde** sem consentimento explícito:
- Semana de gestação (linha 84)
- Nome do bebê (linha 85)
- Preferências de saúde (linha 86)

**Violações:**
- ❌ **LGPD Art. 11** - Tratamento de dados sensíveis sem consentimento
- ❌ **LGPD Art. 8** - Falta consentimento expresso e destacado
- ❌ **App Store Guidelines** - Requer consentimento antes de coletar dados de saúde
- ❌ **Google Play Policy** - Mesma exigência

**Impacto:**
- ⛔ **REJEIÇÃO AUTOMÁTICA** nas lojas
- ⚖️ Multa de até **R$ 50 milhões** (LGPD Art. 52)
- 🚫 Impossibilidade de operar legalmente no Brasil

**Solução OBRIGATÓRIA:**

```tsx
// ADICIONAR NO STEP 1 (ou antes):

const [lgpdConsent, setLgpdConsent] = useState(false);
const [healthDataConsent, setHealthDataConsent] = useState(false);

// No JSX, ANTES do input de nome:
{step === 1 && (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Qual é o seu nome?</Text>

    {/* NOVO: Checkboxes LGPD */}
    <View style={styles.consentContainer}>
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setLgpdConsent(!lgpdConsent)}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityLabel="Li e aceito a Política de Privacidade e Termos de Serviço"
        accessibilityState={{ checked: lgpdConsent }}
      >
        <Icon
          name={lgpdConsent ? 'checkbox-marked' : 'checkbox-blank-outline'}
          size={24}
          color={lgpdConsent ? colors.primary : colors.mutedForeground}
        />
        <Text style={styles.checkboxText}>
          Li e aceito a{' '}
          <Text style={styles.linkText} onPress={() => openPrivacyPolicy()}>
            Política de Privacidade
          </Text>
          {' '}e{' '}
          <Text style={styles.linkText} onPress={() => openTerms()}>
            Termos de Serviço
          </Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setHealthDataConsent(!healthDataConsent)}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityLabel="Autorizo o tratamento dos meus dados de saúde"
        accessibilityState={{ checked: healthDataConsent }}
      >
        <Icon
          name={healthDataConsent ? 'checkbox-marked' : 'checkbox-blank-outline'}
          size={24}
          color={healthDataConsent ? colors.primary : colors.mutedForeground}
        />
        <Text style={styles.checkboxText}>
          Autorizo o tratamento dos meus dados de saúde (semana de gestação,
          preferências) para personalização do app
        </Text>
      </TouchableOpacity>
    </View>

    <Input
      label="Nome completo"
      value={name}
      onChangeText={setName}
      placeholder="Digite seu nome"
      icon="account"
      required
    />
  </View>
)}

// Atualizar handleNext:
const handleNext = () => {
  if (step === 1) {
    if (!name.trim()) {
      Alert.alert('Ops!', 'Por favor, digite seu nome');
      return;
    }
    if (!lgpdConsent || !healthDataConsent) {
      Alert.alert(
        'Atenção',
        'Para continuar, é necessário aceitar a Política de Privacidade e autorizar o tratamento de dados de saúde.',
        [{ text: 'OK' }]
      );
      return;
    }
  }
  // resto do código...
};

// Adicionar estilos:
consentContainer: {
  marginBottom: spacing.lg,
  gap: spacing.md,
},
checkboxRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: spacing.sm,
  padding: spacing.sm,
  backgroundColor: colors.muted,
  borderRadius: borderRadius.md,
},
checkboxText: {
  flex: 1,
  fontSize: typography.sizes.sm,
  color: colors.foreground,
  fontFamily: typography.fontFamily.sans,
  lineHeight: 20,
},
linkText: {
  color: colors.primary,
  textDecorationLine: 'underline',
  fontWeight: typography.weights.medium as any,
},

// Adicionar funções de navegação:
const openPrivacyPolicy = () => {
  Linking.openURL('https://nossamaternidade.com.br/privacidade');
};

const openTerms = () => {
  Linking.openURL('https://nossamaternidade.com.br/termos');
};
```

**Arquivos Necessários (CRÍTICO):**
1. ❌ Política de Privacidade: `https://nossamaternidade.com.br/privacidade`
2. ❌ Termos de Serviço: `https://nossamaternidade.com.br/termos`

**⚠️ SEM ISSO, O APP SERÁ REJEITADO IMEDIATAMENTE.**

---

### 2. 🔴 EMAIL TEMPORÁRIO INVÁLIDO (BLOQUEADOR)

**Severidade:** 🔴 **ALTO RISCO** - Viola políticas das lojas

**Problema:** Linha 74
```tsx
email: `${Date.now()}@temp.com`, // ❌ VIOLA POLÍTICAS
```

**Violações:**
- ❌ App Store: "Apps must use legitimate authentication"
- ❌ Google Play: "Deceptive behavior - fake accounts"

**Impacto:**
- Pode causar rejeição manual por reviewer
- Viola boas práticas de autenticação
- Impossível recuperar conta se dispositivo for perdido

**Solução OBRIGATÓRIA:**

**Opção A: Apple Sign-In + Google Sign-In (RECOMENDADO)**
```bash
npx expo install expo-apple-authentication @react-native-google-signin/google-signin
```

```tsx
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// No handleComplete, substituir signUp por:
const handleComplete = async () => {
  setLoading(true);
  try {
    let userId: string;
    let email: string;

    // iOS: Apple Sign-In (OBRIGATÓRIO para iOS)
    if (Platform.OS === 'ios') {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Autenticar no Supabase com Apple token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
      });

      if (error) throw error;
      userId = data.user!.id;
      email = data.user!.email!;
    }
    // Android/Web: Google Sign-In
    else {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken!,
      });

      if (error) throw error;
      userId = data.user!.id;
      email = data.user!.email!;
    }

    // Salvar perfil (resto do código igual)
    const profile: Partial<UserProfile> = {
      id: userId,
      name,
      type: type!,
      // ... resto
    };

    // ... resto do código
  } catch (error: any) {
    if (error.code === 'ERR_CANCELED') {
      // Usuário cancelou login
      return;
    }
    console.error('Erro ao autenticar:', error);
    Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente.');
  } finally {
    setLoading(false);
  }
};
```

**Opção B: Email/Senha Real (Menos recomendado)**
```tsx
// Adicionar step 0 para coletar email/senha ANTES do nome:
{step === 0 && (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Crie sua conta</Text>
    <Input
      label="Email"
      value={email}
      onChangeText={setEmail}
      placeholder="seu@email.com"
      keyboardType="email-address"
      autoCapitalize="none"
      icon="email"
      required
    />
    <Input
      label="Senha"
      value={password}
      onChangeText={setPassword}
      placeholder="Mínimo 6 caracteres"
      secureTextEntry
      icon="lock"
      required
    />
  </View>
)}

// Usar email/senha reais no signUp
const { data: { user } } = await supabase.auth.signUp({
  email: email,
  password: password,
});
```

**⚠️ IMPLEMENTAR ANTES DE SUBMETER ÀS LOJAS.**

---

## 💡 SUGESTÕES DE CÓDIGO - Implementação Completa

### Código Completo com TODAS as Melhorias

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Logo } from '@/components/Logo';
import { supabase, UserProfile } from '@/services/supabase';
import { borderRadius, colors, shadows, spacing, typography } from '@/theme/colors';

interface OnboardingScreenProps {
  onComplete?: () => void;
  route?: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, route }) => {
  const navigation = useNavigation();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [type, setType] = useState<'gestante' | 'mae' | 'tentante' | null>(null);
  const [pregnancyWeek, setPregnancyWeek] = useState('');
  const [babyName, setBabyName] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // NOVO: Estados LGPD
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [healthDataConsent, setHealthDataConsent] = useState(false);

  const preferencesOptions = [
    { label: 'Alimentação saudável', icon: 'food-apple' },
    { label: 'Exercícios físicos', icon: 'run' },
    { label: 'Bem-estar mental', icon: 'meditation' },
    { label: 'Preparação para o parto', icon: 'baby-carriage' },
    { label: 'Amamentação', icon: 'mother-nurse' },
    { label: 'Sono do bebê', icon: 'sleep' },
    { label: 'Relacionamento', icon: 'heart-multiple' },
  ];

  const togglePreference = (pref: string) => {
    if (preferences.includes(pref)) {
      setPreferences(preferences.filter((p) => p !== pref));
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  // NOVO: Funções para abrir documentos legais
  const openPrivacyPolicy = () => {
    Linking.openURL('https://nossamaternidade.com.br/privacidade');
  };

  const openTerms = () => {
    Linking.openURL('https://nossamaternidade.com.br/termos');
  };

  const handleNext = () => {
    // NOVO: Validação LGPD
    if (step === 1) {
      if (!name.trim()) {
        Alert.alert('Ops!', 'Por favor, digite seu nome');
        return;
      }
      if (!lgpdConsent || !healthDataConsent) {
        Alert.alert(
          'Atenção',
          'Para continuar, é necessário aceitar a Política de Privacidade e autorizar o tratamento de dados de saúde.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    if (step === 2 && !type) {
      Alert.alert('Ops!', 'Por favor, selecione uma opção');
      return;
    }

    // NOVO: Validação de semana de gestação
    if (step === 3 && type === 'gestante') {
      const week = parseInt(pregnancyWeek);
      if (!pregnancyWeek || isNaN(week)) {
        Alert.alert('Ops!', 'Por favor, informe a semana de gravidez');
        return;
      }
      if (week < 1 || week > 42) {
        Alert.alert('Ops!', 'A semana deve estar entre 1 e 42');
        return;
      }
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
      let userId: string;
      let userEmail: string;

      // NOVO: Autenticação real (Apple/Google Sign-In)
      if (Platform.OS === 'ios') {
        // Apple Sign-In (OBRIGATÓRIO para iOS)
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });

        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken!,
        });

        if (error) throw error;
        userId = data.user!.id;
        userEmail = data.user!.email!;
      } else {
        // Google Sign-In (Android/Web)
        await GoogleSignin.hasPlayServices();
        const { idToken } = await GoogleSignin.signIn();

        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken!,
        });

        if (error) throw error;
        userId = data.user!.id;
        userEmail = data.user!.email!;
      }

      // Salvar perfil do usuário
      const profile: Partial<UserProfile> = {
        id: userId,
        name,
        type: type!,
        pregnancy_week: type === 'gestante' ? parseInt(pregnancyWeek) : undefined,
        baby_name: babyName || undefined,
        preferences,
        subscription_tier: 'free',
        daily_interactions: 0,
        last_interaction_date: new Date().toISOString(),
        // NOVO: Registrar consentimentos LGPD
        lgpd_consent_date: new Date().toISOString(),
        health_data_consent: true,
      };

      const { error } = await supabase.from('user_profiles').insert(profile);

      if (error) throw error;

      // Salvar dados localmente
      await AsyncStorage.setItem('onboarded', 'true');
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));

      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        // Usuário cancelou login
        setLoading(false);
        return;
      }
      console.error('Erro ao completar onboarding:', error);
      Alert.alert('Erro', 'Não foi possível salvar seus dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Logo decorativa (não anunciada por leitores de tela) */}
          <View
            style={styles.logoContainer}
            accessible={false}
            importantForAccessibility="no"
          >
            <Logo size={120} />
          </View>

          <View style={styles.titleContainer}>
            <Icon name="mother-heart" size={32} color={colors.primary} />
            <Text
              style={styles.title}
              accessibilityRole="header"
              accessibilityLevel={1}
            >
              Bem-vinda ao Nossa Maternidade!
            </Text>
          </View>

          <Text style={styles.subtitle}>
            Vou te conhecer melhor para poder te ajudar da melhor forma
          </Text>

          {/* NOVO: Indicador de progresso */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Passo {step} de 4</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
            </View>
          </View>

          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text
                style={styles.stepTitle}
                accessibilityRole="header"
                accessibilityLevel={2}
              >
                Qual é o seu nome?
              </Text>

              {/* NOVO: Checkboxes LGPD */}
              <View style={styles.consentContainer}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setLgpdConsent(!lgpdConsent)}
                  accessible={true}
                  accessibilityRole="checkbox"
                  accessibilityLabel="Li e aceito a Política de Privacidade e Termos de Serviço"
                  accessibilityState={{ checked: lgpdConsent }}
                >
                  <Icon
                    name={lgpdConsent ? 'checkbox-marked' : 'checkbox-blank-outline'}
                    size={24}
                    color={lgpdConsent ? colors.primary : colors.mutedForeground}
                  />
                  <Text style={styles.checkboxText}>
                    Li e aceito a{' '}
                    <Text style={styles.linkText} onPress={openPrivacyPolicy}>
                      Política de Privacidade
                    </Text>
                    {' '}e{' '}
                    <Text style={styles.linkText} onPress={openTerms}>
                      Termos de Serviço
                    </Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setHealthDataConsent(!healthDataConsent)}
                  accessible={true}
                  accessibilityRole="checkbox"
                  accessibilityLabel="Autorizo o tratamento dos meus dados de saúde"
                  accessibilityState={{ checked: healthDataConsent }}
                >
                  <Icon
                    name={healthDataConsent ? 'checkbox-marked' : 'checkbox-blank-outline'}
                    size={24}
                    color={healthDataConsent ? colors.primary : colors.mutedForeground}
                  />
                  <Text style={styles.checkboxText}>
                    Autorizo o tratamento dos meus dados de saúde (semana de gestação,
                    preferências) para personalização do app
                  </Text>
                </TouchableOpacity>
              </View>

              <Input
                label="Nome completo"
                value={name}
                onChangeText={setName}
                placeholder="Digite seu nome"
                icon="account"
                required
              />
            </View>
          )}

          {/* Steps 2, 3, 4 permanecem iguais... */}
          {/* (copiar código existente) */}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleNext}
            loading={loading}
            disabled={loading}
            icon={step < 4 ? 'arrow-right' : 'check-circle'}
            iconPosition="right"
            accessibilityLabel={step < 4 ? 'Ir para próximo passo' : 'Começar a usar o app'}
            accessibilityHint={step < 4 ? `Avançar para o passo ${step + 1} de 4` : 'Finalizar cadastro e começar'}
          >
            {step < 4 ? 'Próximo' : 'Começar agora!'}
          </Button>

          {step > 1 && (
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onPress={() => setStep(Math.max(1, step - 1))}
              icon="arrow-left"
              accessibilityLabel="Voltar para passo anterior"
              style={styles.backButton}
            >
              Voltar
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Estilos existentes permanecem...

  // NOVOS estilos:
  progressContainer: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  progressText: {
    fontSize: typography.sizes.sm,
    color: colors.mutedForeground,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.sans,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.muted,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  consentContainer: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.muted,
    borderRadius: borderRadius.md,
    minHeight: 44, // Área mínima de toque
  },
  checkboxText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.foreground,
    fontFamily: typography.fontFamily.sans,
    lineHeight: 20,
  },
  linkText: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontWeight: typography.weights.medium as any,
  },
});

export default OnboardingScreen;
```

---

## 📊 SCORE DE QUALIDADE

### Scores Individuais

| Categoria | Score | Observações |
|-----------|-------|-------------|
| **Acessibilidade** | 9/10 | Excelente! Falta apenas `accessibilityRole="header"` nos títulos |
| **Consistência Tema** | 9.5/10 | Quase perfeito! Poucos valores hardcoded (minHeight, borderWidth) |
| **Hierarquia Visual** | 9/10 | Clara e bem estruturada. Falta indicador de progresso |
| **Responsividade** | 10/10 | Perfeita! ScrollView, SafeAreaView, fullWidth |
| **UX para Público-Alvo** | 9.5/10 | Excelente linguagem e feedback visual |

### Score Técnico (Sem Bloqueadores)
**47/50 (94%)** ⭐⭐⭐⭐⭐

**Classificação:** EXCELENTE - Código de alta qualidade

---

### Score Real (Com Bloqueadores LGPD)

| Categoria | Score Real | Motivo |
|-----------|-----------|--------|
| **Pronto para Produção** | **0/10** | ❌ Bloqueadores críticos impedem publicação |
| **Compliance Legal** | **0/10** | ❌ Violação LGPD = Multa R$ 50M |
| **Aprovação App Store** | **0/10** | ❌ Falta consentimento + auth inválida |
| **Aprovação Google Play** | **0/10** | ❌ Mesmos problemas |

**Score Total Real: 0/50** 🔴

**Status:** ⛔ **NÃO PUBLIQUE** - Corrigir bloqueadores ANTES de submeter

---

## 🎯 PRIORIZAÇÃO DE AÇÕES

### 🔴 CRÍTICO (Fazer AGORA - Bloqueiam Publicação)

1. **Implementar checkboxes LGPD** (2-4 horas)
2. **Substituir autenticação temporária** por Apple/Google Sign-In (1-2 dias)
3. **Criar Política de Privacidade** (contratar advogado) (1-2 semanas)
4. **Criar Termos de Serviço** (advogado) (1 semana)

### 🟡 IMPORTANTE (Fazer em Breve - Melhoram UX)

5. **Adicionar indicador de progresso** (30 minutos)
6. **Validação de semana de gestação** (15 minutos)
7. **Adicionar `accessibilityRole="header"`** (10 minutos)
8. **Marcar Logo como decorativa** (5 minutos)

### 🟢 OPCIONAL (Polimento)

9. **Refatorar valores hardcoded** para constantes do tema (1 hora)

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Antes de Publicar nas Lojas

- [ ] ✅ **Checkboxes LGPD implementados** (Problema Crítico #1)
- [ ] ✅ **Apple Sign-In configurado** (iOS)
- [ ] ✅ **Google Sign-In configurado** (Android)
- [ ] ✅ **Política de Privacidade publicada** em URL pública
- [ ] ✅ **Termos de Serviço publicados** em URL pública
- [ ] ✅ **Links funcionando** no app (Linking.openURL)
- [ ] ✅ **Consentimentos salvos** no banco (lgpd_consent_date, health_data_consent)
- [ ] ✅ **Testado em dispositivo real** (iOS + Android)
- [ ] ✅ **Screenshot tirado** (para loja) com nova versão

### Melhorias de UX (Recomendadas)

- [ ] ⚠️ **Indicador de progresso** implementado
- [ ] ⚠️ **Validação de semana** (1-42) implementada
- [ ] ⚠️ **accessibilityRole="header"** adicionado
- [ ] ⚠️ **Logo marcada como decorativa**

---

## 💼 CUSTO ESTIMADO DAS CORREÇÕES

| Item | Tempo Dev | Custo Externo | Total |
|------|-----------|---------------|-------|
| Checkboxes LGPD | 2-4h | - | 2-4h dev |
| Apple/Google Sign-In | 1-2 dias | - | 1-2 dias dev |
| Política de Privacidade | - | R$ 2.000-5.000 | R$ 2.000-5.000 |
| Termos de Serviço | - | R$ 1.500-3.000 | R$ 1.500-3.000 |
| Hospedagem docs | - | R$ 150/ano | R$ 150/ano |
| **TOTAL** | **2-3 dias** | **R$ 3.650-8.150** | **R$ 3.650-8.150** |

---

## 🚀 PRÓXIMOS PASSOS

1. **HOJE:** Implementar checkboxes LGPD no código
2. **ESTA SEMANA:** Contratar advogado para documentos legais
3. **PRÓXIMA SEMANA:** Configurar Apple/Google Sign-In
4. **EM 2 SEMANAS:** Publicar docs legais no site
5. **EM 3 SEMANAS:** Testar tudo + screenshots
6. **EM 1 MÊS:** Submeter para App Store + Google Play

---

## 📞 RECURSOS ÚTEIS

### Documentação
- [Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [React Native Google Sign-In](https://github.com/react-native-google-signin/google-signin)
- [LGPD - Lei Completa](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Developer Policy](https://play.google.com/about/developer-content-policy/)

### Ferramentas
- [LGPD Generator](https://www.iubenda.com/en/privacy-policy-generator) (Template de Política)
- [Termly](https://termly.io/) (Gerador de Termos)

---

**Fim do Design Review**

**Próxima ação recomendada:** Implementar checkboxes LGPD HOJE mesmo!
