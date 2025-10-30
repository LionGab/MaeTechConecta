// ⚠️ CONFIGURE SUAS CHAVES DE API EM VARIÁVEIS DE AMBIENTE
// Crie um arquivo .env.local e adicione suas chaves
// Veja .env.example para referência

export const API_CONFIG = {
  CLAUDE_API_KEY: process.env.EXPO_PUBLIC_CLAUDE_API_KEY || '',
  OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
  PERPLEXITY_API_KEY: process.env.EXPO_PUBLIC_PERPLEXITY_API_KEY || '',
  ELEVENLABS_API_KEY: process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || '',
  HEYGEN_API_KEY: process.env.EXPO_PUBLIC_HEYGEN_API_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  ONESIGNAL_APP_ID: process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID || '',
};

export const API_URLS = {
  CLAUDE: 'https://api.anthropic.com/v1/messages',
  OPENAI: 'https://api.openai.com/v1',
  ELEVENLABS: 'https://api.elevenlabs.io/v1',
  HEYGEN: 'https://api.heygen.com/v2',
};

