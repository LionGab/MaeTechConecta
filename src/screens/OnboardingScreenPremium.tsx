/**
 * 🌅 Onboarding Screen Premium - Tema "Amanhecer Sereno"
 * Design elite para Nossa Maternidade
 *
 * Features:
 * - Gradientes suaves com toque dourado
 * - Animações micro-interativas
 * - Tipografia premium (Inter + Roboto)
 * - Cards flutuantes com efeito glass
 * - Sombras profundas e suaves
 */

import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logo } from '@/components/Logo';
import {
  sereneDawnColors,
  sereneDawnGradients,
  sereneDawnOverlay,
  sereneDawnShadows,
  sereneDawnTypography,
  sereneDawnSpacing,
  sereneDawnBorderRadius,
  sereneDawnDark,
} from '@/theme/sereneDawn';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Valores responsivos
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
const isLargeDevice = SCREEN_WIDTH >= 414;

const getResponsiveValue = (small: number, medium: number, large: number) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

// =====================================================
// TIPOS
// =====================================================

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: FeatureItem[];
  gradient: [string, string];
}

interface FeatureItem {
  emoji: string;
  text: string;
  color: string;
}

// =====================================================
// DADOS DAS SLIDES
// =====================================================

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'home',
    title: 'Home com o NathIA',
    subtitle: 'Sua assistente virtual empática',
    description:
      'Converse com a NathIA, sua companheira virtual que entende seu momento e oferece suporte personalizado 24/7.',
    gradient: sereneDawnGradients.primary,
    features: [
      { emoji: '💙', text: 'Chat empático e acolhedor', color: sereneDawnColors.babyBlue },
      { emoji: '✨', text: 'Respostas personalizadas', color: sereneDawnColors.sereneSky },
      { emoji: '🧠', text: 'Memória de conversas anteriores', color: sereneDawnColors.slateBlue },
      { emoji: '🤗', text: 'Suporte emocional sempre disponível', color: sereneDawnColors.champagne },
    ],
  },
  {
    id: 'apoio-emocional',
    title: 'Apoio Emocional',
    subtitle: 'Análise de sentimentos com IA',
    description: 'Análise de sentimentos com IA e sugestões personalizadas para seu bem-estar emocional.',
    gradient: [sereneDawnColors.slateBlue, sereneDawnColors.sereneSky],
    features: [
      { emoji: '💕', text: 'Análise de sentimentos em tempo real', color: '#F472B6' },
      { emoji: '🌟', text: 'Sugestões personalizadas de bem-estar', color: sereneDawnColors.champagne },
      { emoji: '🛡️', text: 'Acompanhamento emocional', color: sereneDawnColors.babyBlue },
      { emoji: '🧘', text: 'Recursos de autocuidado', color: '#A78BFA' },
    ],
  },
  {
    id: 'rotina-organizada',
    title: 'Rotina Organizada',
    subtitle: 'Gerencie tudo com facilidade',
    description: 'Gerencie alimentação, sono e atividades do seu bebê com facilidade e tranquilidade.',
    gradient: [sereneDawnColors.sereneSky, sereneDawnColors.babyBlue],
    features: [
      { emoji: '🍼', text: 'Controle de alimentação do bebê', color: sereneDawnColors.babyBlue },
      { emoji: '😴', text: 'Acompanhamento de sono', color: '#A78BFA' },
      { emoji: '📅', text: 'Agenda de atividades', color: sereneDawnColors.sereneSky },
      { emoji: '⏰', text: 'Lembretes personalizados', color: sereneDawnColors.slateBlue },
    ],
  },
  {
    id: 'mundo-nath',
    title: 'MundoNath',
    subtitle: 'Comunidade e conexão',
    description: 'Conecte-se com outras mães, compartilhe experiências e encontre apoio na comunidade.',
    gradient: [sereneDawnColors.babyBlue, sereneDawnColors.champagne],
    features: [
      { emoji: '👥', text: 'Comunidade de mães', color: sereneDawnColors.sereneSky },
      { emoji: '💬', text: 'Compartilhamento de experiências', color: sereneDawnColors.babyBlue },
      { emoji: '🎯', text: 'Grupos temáticos', color: sereneDawnColors.slateBlue },
      { emoji: '🤝', text: 'Suporte mútuo', color: sereneDawnColors.champagne },
    ],
  },
  {
    id: 'conteudo-exclusivo',
    title: 'Conteúdo Exclusivo',
    subtitle: 'Dicas e estratégias da Nathalia Valente',
    description: 'Acesso a dicas, receitas e estratégias da Nathalia Valente para sua jornada.',
    gradient: [sereneDawnColors.champagne, '#FFEAA7'],
    features: [
      { emoji: '📚', text: 'Dicas exclusivas da Nathalia', color: '#818CF8' },
      { emoji: '🥗', text: 'Receitas saudáveis', color: '#34D399' },
      { emoji: '✨', text: 'Estratégias práticas', color: sereneDawnColors.champagne },
      { emoji: '🔄', text: 'Conteúdo atualizado', color: sereneDawnColors.sereneSky },
    ],
  },
];

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function OnboardingScreenPremium() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = useCallback(() => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      handleComplete();
    }
  }, [currentIndex]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  }, [currentIndex]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, []);

  const handleComplete = useCallback(async () => {
    try {
      await AsyncStorage.setItem('onboarded', 'true');
      (navigation as any).reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    }
  }, [navigation]);

  // =====================================================
  // RENDER SLIDE
  // =====================================================

  const renderSlide = useCallback(
    ({ item, index }: { item: OnboardingSlide; index: number }) => {
      const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.5, 1, 0.5],
      });

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.9, 1, 0.9],
      });

      return (
        <Animated.View style={[styles.slide, { opacity, transform: [{ scale }] }]}>
          {/* Logo centralizada */}
          <View style={styles.logoContainer}>
            <Logo size={getResponsiveValue(SCREEN_WIDTH * 0.22, SCREEN_WIDTH * 0.25, SCREEN_WIDTH * 0.28)} />
          </View>

          {/* Título */}
          <Text style={styles.title}>{item.title}</Text>

          {/* Subtítulo */}
          <Text style={styles.subtitle}>{item.subtitle}</Text>

          {/* Descrição */}
          <Text style={styles.description}>{item.description}</Text>

          {/* Features - Cards Premium */}
          <View style={styles.featuresContainer}>
            {item.features.map((feature, idx) => (
              <Animated.View
                key={idx}
                style={[
                  styles.featureCard,
                  {
                    opacity: scrollX.interpolate({
                      inputRange,
                      outputRange: [0, 1, 0],
                    }),
                    transform: [
                      {
                        translateY: scrollX.interpolate({
                          inputRange,
                          outputRange: [20, 0, 20],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {/* Background com gradiente sutil e blur */}
                <LinearGradient
                  colors={[`${feature.color}15`, `${feature.color}08`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />

                {/* Conteúdo */}
                <View style={styles.featureContent}>
                  {/* Emoji container com destaque dourado */}
                  <View style={[styles.featureEmojiContainer, { backgroundColor: `${feature.color}20` }]}>
                    <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                  </View>

                  {/* Texto */}
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      );
    },
    [scrollX]
  );

  // =====================================================
  // RENDER PAGINATION
  // =====================================================

  const renderPagination = useCallback(() => {
    return (
      <View style={styles.pagination}>
        {ONBOARDING_SLIDES.map((_, index) => {
          const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 32, 8],
            extrapolate: 'clamp',
          });
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          const isActive = currentIndex === index;

          return (
            <Animated.View key={index} style={styles.dotContainer}>
              <Animated.View
                style={[
                  styles.paginationDot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                  },
                ]}
              >
                {isActive && (
                  <LinearGradient
                    colors={sereneDawnGradients.primaryWithGold}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                )}
              </Animated.View>
            </Animated.View>
          );
        })}
      </View>
    );
  }, [scrollX, currentIndex]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={sereneDawnColors.midnightBlue} />

      {/* Background Gradient - Amanhecer */}
      <LinearGradient
        colors={[sereneDawnColors.midnightBlue, sereneDawnColors.darkPetrol, sereneDawnColors.twilight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Círculos decorativos com blur */}
      <View style={[styles.decorativeCircle1, { backgroundColor: `${sereneDawnColors.sereneSky}15` }]} />
      <View style={[styles.decorativeCircle2, { backgroundColor: `${sereneDawnColors.champagne}10` }]} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header com Skip */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          {currentIndex < ONBOARDING_SLIDES.length - 1 && (
            <TouchableOpacity
              onPress={handleSkip}
              style={styles.skipButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Pular onboarding"
            >
              <Text style={styles.skipText}>Pular</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_SLIDES}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          removeClippedSubviews={Platform.OS === 'android'}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          windowSize={2}
        />

        {/* Pagination */}
        {renderPagination()}

        {/* Actions - Botões Premium */}
        <View style={styles.actions}>
          {currentIndex > 0 && (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <LinearGradient
                colors={['rgba(127, 176, 218, 0.15)', 'rgba(127, 176, 218, 0.08)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.backButtonGradient}
              >
                <Text style={styles.backButtonText}>Voltar</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleNext}
            style={[styles.nextButton, currentIndex === 0 && { flex: 1 }]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Começar' : 'Próximo'}
          >
            <LinearGradient
              colors={sereneDawnGradients.primaryWithGold}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Começar agora!' : 'Próximo'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: sereneDawnColors.midnightBlue,
  },
  safeArea: {
    flex: 1,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -120,
    right: -120,
    width: 350,
    height: 350,
    borderRadius: 175,
    opacity: 0.6,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getResponsiveValue(sereneDawnSpacing.md, sereneDawnSpacing.lg, sereneDawnSpacing.lg),
    paddingTop: Platform.OS === 'ios' ? sereneDawnSpacing.sm : sereneDawnSpacing.xs,
    paddingBottom: sereneDawnSpacing.md,
    minHeight: getResponsiveValue(52, 56, 60),
  },
  headerSpacer: {
    flex: 1,
  },
  skipButton: {
    padding: sereneDawnSpacing.sm,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    fontSize: getResponsiveValue(
      sereneDawnTypography.sizes.sm,
      sereneDawnTypography.sizes.base,
      sereneDawnTypography.sizes.base
    ),
    color: sereneDawnColors.slateBlue,
    fontWeight: sereneDawnTypography.weights.medium,
    fontFamily: sereneDawnTypography.fontFamily.body,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getResponsiveValue(sereneDawnSpacing.lg, sereneDawnSpacing.xl, sereneDawnSpacing['2xl']),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: getResponsiveValue(sereneDawnSpacing.lg, sereneDawnSpacing.xl, sereneDawnSpacing.xl),
  },
  title: {
    fontSize: getResponsiveValue(26, 28, 32),
    fontWeight: sereneDawnTypography.weights.bold,
    color: sereneDawnColors.warmWhite,
    textAlign: 'center',
    marginBottom: getResponsiveValue(sereneDawnSpacing.sm, sereneDawnSpacing.md, sereneDawnSpacing.md),
    fontFamily: sereneDawnTypography.fontFamily.heading,
    lineHeight: getResponsiveValue(32, 36, 40),
    letterSpacing: sereneDawnTypography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: getResponsiveValue(16, 18, 20),
    fontWeight: sereneDawnTypography.weights.semibold,
    color: sereneDawnColors.babyBlue,
    textAlign: 'center',
    marginBottom: getResponsiveValue(sereneDawnSpacing.sm, sereneDawnSpacing.md, sereneDawnSpacing.md),
    fontFamily: sereneDawnTypography.fontFamily.heading,
    lineHeight: getResponsiveValue(22, 26, 28),
  },
  description: {
    fontSize: getResponsiveValue(14, 15, 16),
    color: sereneDawnColors.slateBlue,
    textAlign: 'center',
    lineHeight: getResponsiveValue(22, 24, 26),
    marginBottom: getResponsiveValue(sereneDawnSpacing.lg, sereneDawnSpacing.xl, sereneDawnSpacing.xl),
    fontFamily: sereneDawnTypography.fontFamily.body,
    paddingHorizontal: sereneDawnSpacing.md,
  },
  featuresContainer: {
    width: '100%',
    gap: getResponsiveValue(sereneDawnSpacing.sm, sereneDawnSpacing.md, sereneDawnSpacing.md),
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: sereneDawnBorderRadius.lg,
    borderWidth: 1,
    borderColor: sereneDawnOverlay.primaryBorder,
    minHeight: getResponsiveValue(56, 60, 64),
    overflow: 'hidden',
    ...sereneDawnShadows.dark.md,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getResponsiveValue(sereneDawnSpacing.md, sereneDawnSpacing.md, sereneDawnSpacing.lg),
    gap: getResponsiveValue(sereneDawnSpacing.sm, sereneDawnSpacing.md, sereneDawnSpacing.md),
    flex: 1,
  },
  featureEmojiContainer: {
    width: getResponsiveValue(40, 44, 48),
    height: getResponsiveValue(40, 44, 48),
    borderRadius: getResponsiveValue(10, 11, 12),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: sereneDawnOverlay.goldBorder,
    ...sereneDawnShadows.dark.sm,
  },
  featureEmoji: {
    fontSize: getResponsiveValue(20, 22, 24),
  },
  featureText: {
    fontSize: getResponsiveValue(14, 15, 16),
    color: sereneDawnColors.warmWhite,
    flex: 1,
    fontFamily: sereneDawnTypography.fontFamily.body,
    fontWeight: sereneDawnTypography.weights.medium,
    lineHeight: getResponsiveValue(20, 22, 24),
    letterSpacing: 0.2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: sereneDawnSpacing.sm,
    minHeight: 40,
    marginVertical: sereneDawnSpacing.md,
  },
  dotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    height: getResponsiveValue(8, 8, 10),
    borderRadius: getResponsiveValue(4, 4, 5),
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: getResponsiveValue(sereneDawnSpacing.lg, sereneDawnSpacing.xl, sereneDawnSpacing.xl),
    paddingBottom:
      Platform.OS === 'ios'
        ? getResponsiveValue(sereneDawnSpacing.xl, sereneDawnSpacing['2xl'], sereneDawnSpacing['2xl'])
        : sereneDawnSpacing.xl,
    paddingTop: sereneDawnSpacing.md,
    gap: sereneDawnSpacing.md,
    alignItems: 'center',
    minHeight: getResponsiveValue(72, 80, 88),
  },
  backButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: sereneDawnBorderRadius.xl,
    overflow: 'hidden',
    ...sereneDawnShadows.dark.sm,
  },
  backButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: sereneDawnSpacing.md,
    paddingHorizontal: sereneDawnSpacing.lg,
    borderRadius: sereneDawnBorderRadius.xl,
    borderWidth: 1,
    borderColor: sereneDawnOverlay.primaryBorder,
  },
  backButtonText: {
    fontSize: getResponsiveValue(
      sereneDawnTypography.sizes.base,
      sereneDawnTypography.sizes.base,
      sereneDawnTypography.sizes.lg
    ),
    fontWeight: sereneDawnTypography.weights.semibold,
    color: sereneDawnColors.babyBlue,
    fontFamily: sereneDawnTypography.fontFamily.heading,
  },
  nextButton: {
    flex: 2,
    minHeight: 52,
    borderRadius: sereneDawnBorderRadius.xl,
    overflow: 'hidden',
    ...sereneDawnShadows.dark.lg,
  },
  nextButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: sereneDawnSpacing.md,
    paddingHorizontal: sereneDawnSpacing.xl,
    borderRadius: sereneDawnBorderRadius.xl,
  },
  nextButtonText: {
    fontSize: getResponsiveValue(
      sereneDawnTypography.sizes.base,
      sereneDawnTypography.sizes.lg,
      sereneDawnTypography.sizes.lg
    ),
    fontWeight: sereneDawnTypography.weights.bold,
    color: sereneDawnColors.midnightBlue,
    fontFamily: sereneDawnTypography.fontFamily.heading,
    letterSpacing: 0.5,
  },
});
