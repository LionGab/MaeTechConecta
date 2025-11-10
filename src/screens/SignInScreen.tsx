import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GhostButton, PrimaryButton, SurfaceCard } from '@/shared/components';
import type { RootStackParamList } from '@/navigation/types';
import { useSignInForm } from '@/screens/signIn/useSignInForm';
import { useSignInStyles } from '@/screens/signIn/useSignInStyles';

type Navigation = StackNavigationProp<RootStackParamList>;

const SignInScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { styles, placeholderColor } = useSignInStyles();
  const {
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
  } = useSignInForm(navigation);

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
              {emailError ? <Text style={[styles.feedback, styles.feedbackError]}>{emailError}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Senha</Text>
                <Text style={styles.helperLabel}>mín. 6 caracteres</Text>
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
              {passwordError ? <Text style={[styles.feedback, styles.feedbackError]}>{passwordError}</Text> : null}
            </View>

            {globalError ? (
              <Text style={[styles.feedback, styles.feedbackError]} accessibilityLiveRegion="assertive">
                {globalError}
              </Text>
            ) : null}

            {infoMessage ? (
              <Text style={[styles.feedback, styles.feedbackSuccess]} accessibilityLiveRegion="polite">
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
