/**
 * Deep Linking Configuration - Nossa Maternidade
 *
 * Configuração de deep linking para o app
 */

import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['nossa-maternidade://', 'https://nossa-maternidade.app'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      Home: {
        screens: {
          Home: 'home',
          Chat: 'chat',
          Habits: 'habits',
          Content: 'content',
          Profile: 'profile',
        },
      },
      DailyPlan: 'daily-plan',
      ContentDetail: {
        path: 'content/:contentId',
        parse: {
          contentId: (contentId: string) => contentId,
        },
      },
    },
  },
};

/**
 * Função auxiliar para navegar via deep link
 */
export function handleDeepLink(url: string) {
  // Extrair path do URL
  const path = url.replace(/^(nossa-maternidade:\/\/|https:\/\/nossa-maternidade\.app\/?)/, '');

  // Parsear parâmetros
  const [screen, ...params] = path.split('/');

  return {
    screen,
    params: params.length > 0 ? { contentId: params[0] } : undefined,
  };
}
