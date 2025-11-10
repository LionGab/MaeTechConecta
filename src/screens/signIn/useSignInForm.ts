import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';

import { resetPasswordForEmail, signInWithEmail, signInWithEmailOtp } from '@/services/auth';
import type { RootStackParamList } from '@/navigation/types';

type Navigation = StackNavigationProp<RootStackParamList>;

const MIN_PASSWORD_LENGTH = 6;

function isEmailValid(value: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value.trim().toLowerCase());
}

export const useSignInForm = (navigation: Navigation) => {
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
        routes: [{ name: 'MainTabs' }],
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

  return {
    email,
    password,
    isEmailFocused,
    isPasswordFocused,
    emailError,
    passwordError,
    globalError,
    infoMessage,
    loadingTarget,
    setEmailFocused,
    setPasswordFocused,
    handleEmailChange,
    handlePasswordChange,
    handleSignIn,
    handleMagicLink,
    handlePasswordReset,
    handleBackToOnboarding,
  };
};

