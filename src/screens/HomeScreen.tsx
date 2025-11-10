import React, { type ReactElement } from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { PorQueIssoModal } from '@/components/PorQueIssoModal';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/contexts/ThemeContext';
import { PrimaryButton } from '@/shared/components';
import { FAQ_ITEMS, HERO_MESSAGE, EMERGENCY_NUMBER } from './home/constants';
import { useHomeStyles } from './home/useHomeStyles';
import { useHomeScreenData } from './home/useHomeScreenData';
import { QuickActionsSection } from './home/sections/QuickActionsSection';
import { HeroSection } from './home/sections/HeroSection';
import { PlanSection } from './home/sections/PlanSection';
import { PersonalizedContentSection } from './home/sections/PersonalizedContentSection';
import { InsightSection } from './home/sections/InsightSection';
import { TipSection } from './home/sections/TipSection';
import { FaqSection } from './home/sections/FaqSection';

export default function HomeScreen(): ReactElement {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDark, theme } = useTheme();
  const { styles, color } = useHomeStyles();
  const {
    userName,
    pregnancyWeek,
    userId,
    showWhyThisModal,
    setShowWhyThisModal,
    plan,
    planLoading,
    replan,
    isReplanning,
    insight,
    insightLoading,
    regenerate,
    handleChatAboutInsight,
    personalizedContent,
    trackInteraction,
    handleItemCtaPressed,
    handleDecreaseFrequency,
    handleEmergencyPress,
    quickActions,
  } = useHomeScreenData({ navigation });
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={color('bgPrimary')} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <HeroSection
          gradient={theme.gradients.lavender}
          userName={userName}
          pregnancyWeek={pregnancyWeek}
          message={HERO_MESSAGE}
          onPressPlan={() => navigation.navigate('DailyPlan')}
        />

        <QuickActionsSection actions={quickActions} gradients={theme.gradients} />

        {/* Plano diário com CTA para replanejar rapidamente */}
        {userId && plan && plan.items.length > 0 && (
          <PlanSection
            items={plan.items}
            rationale={plan.rationale}
            isLoading={planLoading}
            isReplanning={isReplanning}
            onWhyThisPressed={() => setShowWhyThisModal(true)}
            onItemCtaPressed={handleItemCtaPressed}
            onReplan={replan}
          />
        )}

        {/* Sugestões personalizadas com base na jornada da mãe */}
        {userId && personalizedContent.length > 0 && (
          <PersonalizedContentSection items={personalizedContent} isDark={isDark} onTrack={trackInteraction} />
        )}

        {/* Insight diário com caminho direto para conversar com a NathIA */}
        <InsightSection
          insight={insight}
          loading={insightLoading}
          onRefresh={regenerate}
          onActionPress={handleChatAboutInsight}
        />

        <TipSection />

        <FaqSection
          items={FAQ_ITEMS}
          onSelect={(question) => navigation.navigate('Chat', { initialPrompt: question })}
        />

        <PrimaryButton
          label="Emergência - SAMU 192"
          icon={<Icon name="phone-alert" size={20} color={color('textOnPrimary')} />}
          onPress={handleEmergencyPress}
          fullWidth
          style={styles.emergencyButton}
          accessibilityHint="Ligar para o SAMU em caso de emergência médica"
        />
      </ScrollView>

      <PorQueIssoModal
        visible={showWhyThisModal}
        onClose={() => setShowWhyThisModal(false)}
        rationale={plan?.rationale}
        onDecreaseFrequency={handleDecreaseFrequency}
      />
    </SafeAreaView>
  );
}

