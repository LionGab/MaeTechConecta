/**
 * Sentry Configuration
 * Error tracking e performance monitoring
 */

module.exports = {
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
  enableInExpoDevelopment: false,
  debug: false,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development',
};
