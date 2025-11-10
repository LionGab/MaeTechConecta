import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GhostButton, PrimaryButton, SurfaceCard } from '@/shared/components';
import { resetPasswordForEmail, signInWithEmail, signInWithEmailOtp } from '@/services/auth';
import type { RootStackParamList } from '@/navigation/types';
import { useSignInStyles } from '@/screens/signIn/useSignInStyles';

type Navigation = StackNavigationProp<RootStackParamList>;

const MIN_PASSWORD_LENGTH = 6;

function isEmailValid(value: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value.trim().toLowerCase());
}

const SignInScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { styles, placeholderColor } = useSignInStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [loadingTarget, setLoadingTarget] = useState<'email-password' | 'magic-link' | 'reset' | null>(null);

  const clearMessages = useCallback(() => {
    setEmailError(null);
    setPasswordError(null);
    setGlobalError(null);
    setInfoMessage(null);
  }, []);

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      if (emailError) {
        setEmailError(null);
      }
    },
    [emailError]
  );

  const handlePasswordChange = useCallback(
    (value: string) => {
      setPassword(value);
      if (passwordError) {
        setPasswordError(null);
      }
    },
    [passwordError]
  );

  const withLoading = useCallback(
    async (target: 'email-password' | 'magic-link' | 'reset', action: () => Promise<void>) => {
      setLoadingTarget(target);
      try {
        await action();
      } finally {
        setLoadingTarget(null);
      }
    },
    []
  );

  const navigateToHome = useCallback(async () => {
    await AsyncStorage.setItem('onboarded', 'true');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  }, [navigation]);

  const handleSignIn = useCallback(async () => {
    clearMessages();

    if (!isEmailValid(email)) {
      setEmailError('Digite um e-mail válido');
      return;
    }

    if (password.trim().length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`);
      return;
    }

    await withLoading('email-password', async () => {
      try {
        console.log('[SignIn] Tentando login com email e senha', { email });
        await signInWithEmail(email.trim().toLowerCase(), password);
        await navigateToHome();
      } catch (error) {
        console.error('[SignIn] Falha no login', error);
        const message =
          error instanceof Error ? error.message : 'Não conseguimos fazer o login agora. Tente novamente.';
        setGlobalError(message);
      }
    });
  }, [clearMessages, email, navigateToHome, password, withLoading]);

  const handleMagicLink = useCallback(async () => {
    clearMessages();

    if (!isEmailValid(email)) {
      setEmailError('Digite um e-mail válido para receber o link mágico');
      return;
    }

    await withLoading('magic-link', async () => {
      try {
        console.log('[SignIn] Enviando magic link', { email });
        await signInWithEmailOtp(email.trim().toLowerCase());
        setInfoMessage('Enviamos um link mágico para o seu e-mail. Abra para continuar.');
      } catch (error) {
        console.error('[SignIn] Falha ao enviar link mágico', error);
        const message =
          error instanceof Error ? error.message : 'Não conseguimos enviar o link agora. Tente novamente.';
        setGlobalError(message);
      }
    });
  }, [clearMessages, email, withLoading]);

  const handlePasswordReset = useCallback(async () => {
    clearMessages();

    if (!isEmailValid(email)) {
      setEmailError('Informe o e-mail cadastrado para redefinir a senha');
      return;
    }

    await withLoading('reset', async () => {
      try {
        console.log('[SignIn] Solicitando redefinição de senha', { email });
        await resetPasswordForEmail(email.trim().toLowerCase());
        setInfoMessage('Enviamos um e-mail com as instruções para redefinir sua senha.');
      } catch (error) {
        console.error('[SignIn] Falha na redefinição de senha', error);
        const message = error instanceof Error ? error.message : 'Não foi possível iniciar a redefinição agora.';
        setGlobalError(message);
      }
    });
  }, [clearMessages, email, withLoading]);

  const handleBackToOnboarding = useCallback(() => {
    navigation.navigate('Onboarding');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardWrapper}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Bem-vinda de volta</Text>
            <Text style={styles.subtitle}>Entre para continuar sua jornada de cuidado e apoio.</Text>
          </View>

          <SurfaceCard padding="xl" elevation="md" style={styles.card}>
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>E-mail</Text>
              </View>
              <View
                style={[
                  styles.inputWrapper,
                  isEmailFocused ? styles.inputWrapperFocused : null,
                  emailError ? styles.inputWrapperError : null,
                ]}
              >
                <TextInput
                  value={email}
                  onChangeText={handleEmailChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  placeholderTextColor={placeholderColor}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  style={styles.textInput}
                  accessibilityLabel="E-mail"
                  accessibilityHint="Digite o e-mail cadastrado na plataforma"
                  returnKeyType="next"
                />
              </View>
              {emailError ? (
                <Text style={[styles.feedback, styles.feedbackError, styles.feedbackSpacing]}>{emailError}</Text>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Senha</Text>
                <Text style={styles.helperLabel}>mín. {MIN_PASSWORD_LENGTH} caracteres</Text>
              </View>
              <View
                style={[
                  styles.inputWrapper,
                  isPasswordFocused ? styles.inputWrapperFocused : null,
                  passwordError ? styles.inputWrapperError : null,
                ]}
              >
                <TextInput
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry
                  textContentType="password"
                  autoComplete="password"
                  placeholder="Digite sua senha"
                  placeholderTextColor={placeholderColor}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  style={styles.textInput}
                  accessibilityLabel="Senha"
                  accessibilityHint="Digite a senha da sua conta"
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                />
              </View>
              {passwordError ? (
                <Text style={[styles.feedback, styles.feedbackError, styles.feedbackSpacing]}>{passwordError}</Text>
              ) : null}
            </View>

            {globalError ? (
              <Text
                style={[styles.feedback, styles.feedbackError, styles.feedbackSpacing]}
                accessibilityLiveRegion="assertive"
              >
                {globalError}
              </Text>
            ) : null}

            {infoMessage ? (
              <Text
                style={[styles.feedback, styles.feedbackSuccess, styles.feedbackSpacing]}
                accessibilityLiveRegion="polite"
              >
                {infoMessage}
              </Text>
            ) : null}

            <View style={styles.actions}>
              <PrimaryButton
                label="Entrar"
                onPress={handleSignIn}
                fullWidth
                loading={loadingTarget === 'email-password'}
                accessibilityHint="Autenticar usando e-mail e senha"
              />
              <GhostButton
                label="Receber link mágico por e-mail"
                onPress={handleMagicLink}
                fullWidth
                disabled={loadingTarget !== null}
                accessibilityHint="Enviar um link seguro para entrar sem senha"
              />
              <GhostButton
                label="Esqueci minha senha"
                onPress={handlePasswordReset}
                fullWidth
                disabled={loadingTarget !== null}
                accessibilityHint="Receber instruções para redefinir a senha"
              />
            </View>
          </SurfaceCard>

          <View style={styles.footer}>
            <GhostButton
              label="Voltar para o começo"
              onPress={handleBackToOnboarding}
              accessibilityHint="Retornar ao onboarding para rever as etapas iniciais"
            />
            <Text style={styles.footerText}>
              Suas credenciais são protegidas pelo Supabase. Ficou com dúvidas? Fale com a nossa equipe.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
