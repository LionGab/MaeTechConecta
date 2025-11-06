/**
 * Expo App Configuration
 * 
 * Processa variáveis de ambiente e retorna configuração dinâmica
 * Necessário porque app.json não processa process.env
 */

module.exports = {
  expo: {
    name: 'Nossa Maternidade',
    slug: 'nossa-maternidade',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#FFE5F1',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.nossa.maternidade',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFE5F1',
      },
      package: 'com.nossa.maternidade',
      permissions: ['RECORD_AUDIO', 'INTERNET'],
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'nossa-maternidade',
              host: 'auth',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    scheme: 'nossa-maternidade',
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      'expo-notifications',
      'expo-av',
      '@react-native-voice/voice',
    ],
    extra: {
      // Sentry DSN - processa variáveis de ambiente corretamente
      sentry: {
        dsn: process.env.SENTRY_DSN || process.env.EXPO_PUBLIC_SENTRY_DSN || '',
      },
      // Outras variáveis de ambiente para acesso via Constants.expoConfig.extra
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
    },
  },
};

