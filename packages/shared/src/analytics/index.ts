/**
 * Analytics - Amplitude Integration
 *
 * Integração com Amplitude para tracking de eventos e funil de conversão
 */

// Client-side only (browser/mobile)
interface AmplitudeClient {
  track: (eventName: string, properties?: Record<string, unknown>) => void;
  setUserId: (userId: string) => void;
  identify: (identify: unknown) => void;
  Identify?: new () => { set: (properties: Record<string, unknown>) => unknown };
}

let amplitudeClient: AmplitudeClient | null = null;
let isInitialized = false;

/**
 * Inicializa o cliente Amplitude para tracking de eventos
 *
 * @param {string} apiKey - API key do Amplitude
 * @param {string} [userId] - ID do usuário (opcional)
 * @param {object} [options] - Opções de configuração
 * @param {boolean} [options.enableLogging] - Habilitar logs de debug
 * @param {object} [options.defaultTracking] - Configurações de tracking padrão
 * @param {boolean} [options.defaultTracking.pageViews] - Tracking automático de page views
 * @param {boolean} [options.defaultTracking.sessions] - Tracking automático de sessões
 * @param {boolean} [options.defaultTracking.formInteractions] - Tracking automático de formulários
 *
 * @example
 * ```typescript
 * initAnalytics('your-api-key', 'user-123', {
 *   enableLogging: true,
 *   defaultTracking: { pageViews: true }
 * });
 * ```
 */
export function initAnalytics(
  apiKey: string,
  userId?: string,
  options?: {
    enableLogging?: boolean;
    defaultTracking?: {
      pageViews?: boolean;
      sessions?: boolean;
      formInteractions?: boolean;
    };
  }
) {
  if (typeof window === 'undefined') {
    // Server-side rendering (Edge Functions)
    return;
  }

  try {
    // Dynamic import para evitar bundle no server
    import('@amplitude/analytics-browser').then((Amplitude) => {
      const client = Amplitude.init(apiKey, userId, {
        defaultTracking: {
          pageViews: options?.defaultTracking?.pageViews ?? true,
          sessions: options?.defaultTracking?.sessions ?? true,
          formInteractions: options?.defaultTracking?.formInteractions ?? true,
        },
        ...options,
      });
      amplitudeClient = client as unknown as AmplitudeClient;
      isInitialized = true;
    });
  } catch (error) {
    console.error('Failed to initialize Amplitude:', error);
  }
}

/**
 * Rastreia um evento customizado no Amplitude
 *
 * @param {string} eventName - Nome do evento a ser rastreado
 * @param {Record<string, unknown>} [properties] - Propriedades adicionais do evento
 *
 * @example
 * ```typescript
 * trackEvent('button_clicked', {
 *   button_name: 'sign_up',
 *   location: 'home_page'
 * });
 * ```
 */
export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (!isInitialized || !amplitudeClient) {
    console.warn('Amplitude not initialized. Event not tracked:', eventName);
    return;
  }

  try {
    amplitudeClient.track(eventName, {
      ...properties,
      timestamp: Date.now(),
      platform: typeof window !== 'undefined' ? 'web' : 'mobile',
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

/**
 * Eventos de conversão pré-definidos
 */
export const ConversionEvents = {
  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_ABANDONED: 'onboarding_abandoned',

  // Chat
  CHAT_FIRST_MESSAGE: 'chat_first_message',
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  CHAT_MESSAGE_RECEIVED: 'chat_message_received',

  // Daily Plan
  DAILY_PLAN_VIEWED: 'daily_plan_viewed',
  DAILY_PLAN_GENERATED: 'daily_plan_generated',
  DAILY_PLAN_COMPLETED: 'daily_plan_completed',

  // Profile
  PROFILE_VIEWED: 'profile_viewed',
  PROFILE_COMPLETED: 'profile_completed',
  PROFILE_UPDATED: 'profile_updated',

  // Gamification
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  POINTS_EARNED: 'points_earned',

  // Engagement
  APP_OPENED: 'app_opened',
  APP_CLOSED: 'app_closed',
  SCREEN_VIEWED: 'screen_viewed',
} as const;

/**
 * Rastreia um evento de conversão
 */
export function trackConversion(event: keyof typeof ConversionEvents | string, properties?: Record<string, unknown>) {
  const eventName = ConversionEvents[event as keyof typeof ConversionEvents] || event;
  trackEvent(eventName, {
    ...properties,
    conversion_step: event,
  });
}

/**
 * Rastreia visualização de tela
 */
export function trackScreenView(screenName: string, properties?: Record<string, unknown>) {
  trackEvent(ConversionEvents.SCREEN_VIEWED, {
    screen: screenName,
    ...properties,
  });
}

/**
 * Rastreia erro (combinado com Sentry)
 */
export function trackError(error: Error, context?: Record<string, unknown>) {
  trackEvent('error_occurred', {
    error_name: error.name,
    error_message: error.message,
    error_stack: error.stack,
    ...context,
  });
}

/**
 * Define o identificador único do usuário no Amplitude
 *
 * @param {string} userId - ID único do usuário
 *
 * @example
 * ```typescript
 * setUserId('user-123-abc');
 * ```
 */
export function setUserId(userId: string) {
  if (!isInitialized || !amplitudeClient) return;

  try {
    amplitudeClient.setUserId(userId);
  } catch (error) {
    console.error('Failed to set user ID:', error);
  }
}

/**
 * Define propriedades persistentes do usuário no Amplitude
 *
 * @param {Record<string, unknown>} properties - Objeto com propriedades do usuário
 *
 * @example
 * ```typescript
 * setUserProperties({
 *   plan: 'premium',
 *   pregnancy_week: 32,
 *   user_type: 'gestante'
 * });
 * ```
 */
export function setUserProperties(properties: Record<string, unknown>) {
  if (!isInitialized || !amplitudeClient) return;

  try {
    if (amplitudeClient.Identify) {
      const identify = new amplitudeClient.Identify();
      amplitudeClient.identify(identify.set(properties));
    }
  } catch (error) {
    console.error('Failed to set user properties:', error);
  }
}

