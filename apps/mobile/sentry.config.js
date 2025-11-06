/**
 * Sentry Configuration - Mobile App
 *
 * Configuração para Sentry no Expo
 */

module.exports = {
  dsn: process.env.SENTRY_DSN || process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: false,
  // Release tracking
  release: process.env.EAS_BUILD_ID || 'local',
  environment: process.env.NODE_ENV || 'development',
  // Source maps
  enableNativeCrashHandling: true,
  enableAutoSessionTracking: true,
  // Performance
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
};
