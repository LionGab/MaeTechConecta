/**
 * Tipos de navegação da Nossa Maternidade
 */

export type RootStackParamList = {
  Onboarding: { onComplete?: () => void } | undefined;
  MainTabs: undefined;
  Chat: { context?: string; initialPrompt?: string } | undefined;
  DailyPlan: undefined;
  Profile: undefined;
  Habits: undefined;
  Content: undefined;
  ContentDetail: { contentId: string };
  ComponentValidation: undefined;
};

export type TabParamList = {
  Home: undefined;
  Chat: { context?: string; initialPrompt?: string } | undefined;
  DesafiosDoDia: undefined;
  RedeValente: undefined;
  MaeValente: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
