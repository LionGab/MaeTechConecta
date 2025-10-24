// Firebase Configuration
// Este arquivo configura o Firebase usando variáveis de ambiente para segurança.
// Em produção, configure estas variáveis no painel do Netlify/Vercel.

// Validação de ambiente
function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;

  if (!value) {
    console.error(`❌ Variável de ambiente ${key} não configurada!`);
    console.error(`Configure em .env.local ou no painel do Netlify`);
  }

  return value || '';
}

// Configuração do Firebase
export const firebaseConfig = {
  apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY', 'AIzaSyCBp3XJkLAVUbJ3zPbgKG_WJdeTHK0LaOY'),
  authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'studio-1781279445-a66f7.firebaseapp.com'),
  projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'studio-1781279445-a66f7'),
  storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'studio-1781279445-a66f7.appspot.com'),
  messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', '739802775325'),
  appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID', '1:739802775325:web:47a05d59d22721e6e2abf4')
};

// Validação da configuração
export function isFirebaseConfigValid(): boolean {
  const requiredFields = [
    firebaseConfig.apiKey,
    firebaseConfig.authDomain,
    firebaseConfig.projectId,
    firebaseConfig.storageBucket,
    firebaseConfig.messagingSenderId,
    firebaseConfig.appId,
  ];

  const isValid = requiredFields.every(field => field && field.length > 0);

  if (!isValid) {
    console.error('❌ Configuração do Firebase incompleta!');
    console.error('Verifique as variáveis de ambiente NEXT_PUBLIC_FIREBASE_*');
  }

  return isValid;
}

// Log de diagnóstico (apenas em desenvolvimento)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 Firebase Config Status:', {
    isValid: isFirebaseConfigValid(),
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
  });
}
