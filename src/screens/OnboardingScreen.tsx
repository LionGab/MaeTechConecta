/**
 * Onboarding Screen - Tour das Funcionalidades
 * Apresenta as principais features do app de forma visual e interativa
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { borderRadius, colors, shadows, spacing, typography } from '@/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 🎨 Cores Azuis Modernas (matching WelcomeScreen e theme colors)
const BLUE_THEME = {
  // Backgrounds - Azul escuro profundo
  darkBlue: '#0A2540', // Background principal
  deepBlue: '#0F3460', // Cards e elementos
  navyBlue: '#16213E', // Popover e contraste

  // Azuis primários - Vibrantes e modernos
  primaryBlue: '#3B82F6', // Blue 500 - Primário
  lightBlue: '#60A5FA', // Blue 400 - Hover/Active
  skyBlue: '#93C5FD', // Blue 300 - Highlights
  accentBlue: '#0EA5E9', // Sky 500 - Accent

  // Cinzas azulados - Texto e borders
  mutedBlue: '#475569', // Slate 600 - Texto terciário
  grayBlue: '#64748B', // Slate 500 - Texto secundário
  borderBlue: '#334155', // Slate 700 - Borders

  // Cores claras
  white: '#FFFFFF',
  lightGray: '#F1F5F9', // Slate 100
  darkGray: '#94A3B8', // Slate 400
};

// Breakpoints para responsividade mobile-first
const isSmallDevice = SCREEN_WIDTH < 375; // iPhone SE, etc
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414; // iPhone 12, etc
const isLargeDevice = SCREEN_WIDTH >= 414; // iPhone Pro Max, etc

// Valores responsivos
const getResponsiveValue = (small: number, medium: number, large: number) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

interface OnboardingScreenProps {
  onComplete?: () => void;
  route?: any;
}

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  features: FeatureItem[];
  image?: string;
}

interface FeatureItem {
  emoji: string;
  text: string;
  color: string;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'home',
    title: 'Home com o NathIA',
    subtitle: 'Sua assistente virtual empática',
    description: 'Converse com a NathIA, sua companheira virtual que entende seu momento e oferece suporte personalizado 24/7.',
    icon: 'robot-happy',
    color: BLUE_THEME.primaryBlue, // Azul primário
    features: [
      { emoji: '💙', text: 'Chat empático e acolhedor', color: '#60A5FA' },
      { emoji: '✨', text: 'Respostas personalizadas', color: '#93C5FD' },
      { emoji: '🧠', text: 'Memória de conversas anteriores', color: '#3B82F6' },
      { emoji: '🤗', text: 'Suporte emocional sempre disponível', color: '#0EA5E9' },
    ],
  },
  {
    id: 'apoio-emocional',
    title: 'Apoio Emocional',
    subtitle: 'Análise de sentimentos com IA',
    description: 'Análise de sentimentos com IA e sugestões personalizadas para seu bem-estar emocional.',
    icon: 'heart-pulse',
    color: BLUE_THEME.accentBlue, // Sky blue - Accent
    features: [
      { emoji: '💕', text: 'Análise de sentimentos em tempo real', color: '#F472B6' },
      { emoji: '🌟', text: 'Sugestões personalizadas de bem-estar', color: '#FBBF24' },
      { emoji: '🛡️', text: 'Acompanhamento emocional', color: '#60A5FA' },
      { emoji: '🧘', text: 'Recursos de autocuidado', color: '#A78BFA' },
    ],
  },
  {
    id: 'rotina-organizada',
    title: 'Rotina Organizada',
    subtitle: 'Gerencie tudo com facilidade',
    description: 'Gerencie alimentação, sono e atividades do seu bebê com facilidade e tranquilidade.',
    icon: 'calendar-check',
    color: BLUE_THEME.lightBlue, // Azul claro
    features: [
      { emoji: '🍼', text: 'Controle de alimentação do bebê', color: '#93C5FD' },
      { emoji: '😴', text: 'Acompanhamento de sono', color: '#A78BFA' },
      { emoji: '📅', text: 'Agenda de atividades', color: '#60A5FA' },
      { emoji: '⏰', text: 'Lembretes personalizados', color: '#3B82F6' },
    ],
  },
  {
    id: 'mundo-nath',
    title: 'MundoNath',
    subtitle: 'Comunidade e conexão',
    description: 'Conecte-se com outras mães, compartilhe experiências e encontre apoio na comunidade.',
    icon: 'account-group',
    color: BLUE_THEME.skyBlue, // Azul céu claro
    image: require('@/assets/images/nat1.png'),
    features: [
      { emoji: '👥', text: 'Comunidade de mães', color: '#60A5FA' },
      { emoji: '💬', text: 'Compartilhamento de experiências', color: '#93C5FD' },
      { emoji: '🎯', text: 'Grupos temáticos', color: '#3B82F6' },
      { emoji: '🤝', text: 'Suporte mútuo', color: '#0EA5E9' },
    ],
  },
  {
    id: 'conteudo-exclusivo',
    title: 'Conteúdo Exclusivo',
    subtitle: 'Dicas e estratégias da Nathalia Valente',
    description: 'Acesso a dicas, receitas e estratégias da Nathalia Valente para sua jornada.',
    icon: 'book-open-variant',
    color: '#6366F1', // Indigo 500 - Para variedade
    features: [
      { emoji: '📚', text: 'Dicas exclusivas da Nathalia', color: '#818CF8' },
      { emoji: '🥗', text: 'Receitas saudáveis', color: '#34D399' },
      { emoji: '✨', text: 'Estratégias práticas', color: '#FBBF24' },
      { emoji: '🔄', text: 'Conteúdo atualizado', color: '#60A5FA' },
    ],
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('onboarded', 'true');
      if (onComplete) {
        onComplete();
      } else {
        // Se não tiver callback, navegar para Home
        (navigation as any).navigate('Home');
      }
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    }
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
    const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
    });

    // Tamanhos responsivos
    const iconSize = getResponsiveValue(60, 70, 80);
    const iconContainerSize = getResponsiveValue(120, 140, 160);

    return (
      <View style={styles.slide}>
        <ScrollView
          contentContainerStyle={styles.slideScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={[styles.slideContent, { opacity }]}>
            {/* Icon/Logo */}
            <View
              style={[
                styles.iconContainer,
                {
                  width: iconContainerSize,
                  height: iconContainerSize,
                  borderRadius: iconContainerSize / 2,
                  backgroundColor: `${item.color}20`,
                },
              ]}
            >
              <Icon name={item.icon} size={iconSize} color={item.color} />
            </View>

            {/* Optional Image */}
            {item.image && (
              <View style={styles.slideImageContainer}>
                <Image source={item.image} style={styles.slideImage} resizeMode="contain" />
              </View>
            )}

            {/* Title */}
            <Text style={styles.title}>{item.title}</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>{item.subtitle}</Text>

            {/* Description */}
            <Text style={styles.description}>{item.description}</Text>

            {/* Features */}
            <View style={styles.featuresContainer}>
              {item.features.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  {/* Emoji Icon Container */}
                  <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}20` }]}>
                    <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                  </View>

                  {/* Feature Text */}
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {ONBOARDING_SLIDES.map((_, index) => {
          const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                  backgroundColor: currentIndex === index ? BLUE_THEME.primaryBlue : BLUE_THEME.grayBlue,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE_THEME.darkBlue} />

      {/* Background Gradient */}
      <LinearGradient
        colors={[BLUE_THEME.darkBlue, BLUE_THEME.deepBlue, BLUE_THEME.navyBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative Circles - Glassmorphism */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header com Skip */}
        <View style={styles.header}>
          {/* Espaçador esquerdo para centralizar logo */}
          <View style={styles.headerSpacer} />

          {/* Logo centralizada */}
          <View style={styles.logoContainer}>
            <Logo size={getResponsiveValue(32, 36, 40)} />
          </View>

          {/* Botão Skip à direita */}
          <View style={styles.headerSpacer}>
            {currentIndex < ONBOARDING_SLIDES.length - 1 && (
              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>Pular</Text>
              </TouchableOpacity>
            )}
          </View>
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

      {/* Actions */}
      <View style={styles.actions}>
        {currentIndex > 0 && (
          <Button
            variant="outline"
            size="lg"
            onPress={handleBack}
            icon="arrow-left"
            accessibilityLabel="Voltar para slide anterior"
            style={styles.backButton}
          >
            Voltar
          </Button>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth={currentIndex === 0}
          onPress={handleNext}
          icon={currentIndex === ONBOARDING_SLIDES.length - 1 ? 'check-circle' : 'arrow-right'}
          iconPosition="right"
          accessibilityLabel={
            currentIndex === ONBOARDING_SLIDES.length - 1
              ? 'Começar a usar o app'
              : 'Ir para próximo slide'
          }
          style={currentIndex === 0 ? { flex: 1 } : styles.nextButton}
        >
          {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Começar agora!' : 'Próximo'}
        </Button>
      </View>
      </SafeAreaView>
    </View>
  );
};

// Estilos base (valores fixos)
const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE_THEME.darkBlue,
  },
  safeArea: {
    flex: 1,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    opacity: 0.5,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(96, 165, 250, 0.08)',
    opacity: 0.4,
  },
  logoContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  skipButton: {
    padding: spacing.sm,
    minWidth: 44, // Touch target mínimo
    minHeight: 44,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  pagination: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
    minHeight: 32,
  },
  backButton: {
    flex: 1,
    minHeight: 44, // Touch target mínimo
  },
  nextButton: {
    flex: 2,
    minHeight: 44, // Touch target mínimo
  },
});

// Função para obter estilos responsivos
const getStyles = () => ({
  ...baseStyles,
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: getResponsiveValue(spacing.md, spacing.lg, spacing.lg),
    paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.sm,
    paddingBottom: spacing.sm,
    minHeight: getResponsiveValue(50, 56, 60),
  },
  headerSpacer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  skipText: {
    fontSize: getResponsiveValue(typography.sizes.sm, typography.sizes.base, typography.sizes.base),
    color: BLUE_THEME.darkGray,
    fontFamily: typography.fontFamily.sans,
  },
  slideScrollContent: {
    flexGrow: 1,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    paddingHorizontal: getResponsiveValue(spacing.md, spacing.lg, spacing.xl),
    paddingVertical: getResponsiveValue(spacing.md, spacing.lg, spacing.xl),
  },
  slideContent: {
    alignItems: 'center' as const,
    width: '100%' as const,
    maxWidth: getResponsiveValue(SCREEN_WIDTH - spacing.lg * 2, 400, 450),
  },
  iconContainer: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: getResponsiveValue(spacing.lg, spacing.xl, spacing.xl),
    borderWidth: 2,
    borderColor: 'rgba(147, 197, 253, 0.2)',
    ...shadows.dark.lg,
  },
  slideImageContainer: {
    width: '100%' as const,
    alignItems: 'center' as const,
    marginBottom: getResponsiveValue(spacing.lg, spacing.xl, spacing.xl),
  },
  slideImage: {
    width: getResponsiveValue(SCREEN_WIDTH * 0.5, SCREEN_WIDTH * 0.45, SCREEN_WIDTH * 0.4),
    height: getResponsiveValue(SCREEN_WIDTH * 0.5, SCREEN_WIDTH * 0.45, SCREEN_WIDTH * 0.4),
    maxWidth: 220,
    maxHeight: 220,
  },
  title: {
    fontSize: getResponsiveValue(typography.sizes['2xl'], typography.sizes['3xl'], typography.sizes['3xl']),
    fontWeight: typography.weights.bold as any,
    color: BLUE_THEME.white,
    textAlign: 'center' as const,
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily.sans,
    paddingHorizontal: spacing.sm,
  },
  subtitle: {
    fontSize: getResponsiveValue(typography.sizes.lg, typography.sizes.xl, typography.sizes.xl),
    fontWeight: typography.weights.semibold as any,
    color: BLUE_THEME.skyBlue,
    textAlign: 'center' as const,
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.sans,
    paddingHorizontal: spacing.sm,
  },
  description: {
    fontSize: getResponsiveValue(typography.sizes.sm, typography.sizes.base, typography.sizes.base),
    color: BLUE_THEME.darkGray,
    textAlign: 'center' as const,
    lineHeight: getResponsiveValue(
      typography.lineHeight.normal * typography.sizes.sm,
      typography.lineHeight.relaxed * typography.sizes.base,
      typography.lineHeight.relaxed * typography.sizes.base
    ),
    marginBottom: getResponsiveValue(spacing.lg, spacing.xl, spacing.xl),
    fontFamily: typography.fontFamily.sans,
    paddingHorizontal: spacing.sm,
  },
  featuresContainer: {
    width: '100%' as const,
    gap: getResponsiveValue(spacing.sm, spacing.md, spacing.md),
  },
  featureItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // White overlay for card effect
    padding: getResponsiveValue(spacing.md, spacing.md + 2, spacing.lg),
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.15)',
    ...shadows.dark.lg,
    minHeight: getResponsiveValue(52, 56, 60), // Larger touch target
    gap: getResponsiveValue(spacing.sm, spacing.md, spacing.md),
  },
  featureIconContainer: {
    width: getResponsiveValue(40, 44, 48),
    height: getResponsiveValue(40, 44, 48),
    borderRadius: getResponsiveValue(10, 11, 12),
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.2)',
    ...shadows.dark.md,
  },
  featureEmoji: {
    fontSize: getResponsiveValue(20, 22, 24),
    textAlign: 'center' as const,
    lineHeight: getResponsiveValue(24, 26, 28),
  },
  featureText: {
    fontSize: getResponsiveValue(typography.sizes.sm, typography.sizes.base, typography.sizes.base),
    color: BLUE_THEME.white,
    flex: 1,
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.weights.medium as any,
    lineHeight: getResponsiveValue(
      typography.lineHeight.relaxed * typography.sizes.sm,
      typography.lineHeight.relaxed * typography.sizes.base,
      typography.lineHeight.relaxed * typography.sizes.base
    ),
  },
  paginationDot: {
    height: getResponsiveValue(6, 8, 8),
    borderRadius: getResponsiveValue(3, 4, 4),
    backgroundColor: BLUE_THEME.grayBlue,
  },
  actions: {
    flexDirection: 'row' as const,
    paddingHorizontal: getResponsiveValue(spacing.md, spacing.lg, spacing.xl),
    paddingBottom: Platform.OS === 'ios' ? getResponsiveValue(spacing.lg, spacing.xl, spacing.xl) : spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
    alignItems: 'center' as const,
    minHeight: getResponsiveValue(60, 70, 80),
  },
});

const styles = getStyles();

export default OnboardingScreen;
