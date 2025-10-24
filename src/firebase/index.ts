'use client';

import { firebaseConfig, isFirebaseConfigValid } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';

// Interface para o resultado da inicialização
export interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  isInitialized: boolean;
  initError: Error | null;
}

// Cache do Firebase inicializado
let firebaseServicesCache: FirebaseServices | null = null;

/**
 * Inicializa o Firebase com tratamento robusto de erros.
 * Usa cache para evitar múltiplas inicializações.
 */
export function initializeFirebase(): FirebaseServices {
  // Retorna cache se já inicializado
  if (firebaseServicesCache) {
    return firebaseServicesCache;
  }

  try {
    // Validação da configuração
    if (!isFirebaseConfigValid()) {
      const error = new Error(
        'Firebase não configurado. Configure as variáveis NEXT_PUBLIC_FIREBASE_* em .env.local ou no Netlify'
      );
      console.error('❌ Erro de configuração do Firebase:', error);

      throw error;
    }

    // Inicializa Firebase apenas se não existir
    let firebaseApp: FirebaseApp;

    if (!getApps().length) {
      console.log('🔥 Inicializando Firebase...');
      firebaseApp = initializeApp(firebaseConfig);
      console.log('✅ Firebase inicializado com sucesso!');
    } else {
      console.log('🔥 Usando instância Firebase existente');
      firebaseApp = getApp();
    }

    // Obtém serviços Firebase
    const auth = getAuth(firebaseApp);
    const firestore = getFirestore(firebaseApp);

    // Conecta aos emuladores em desenvolvimento (se configurado)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true';

      if (useEmulators) {
        try {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          connectFirestoreEmulator(firestore, 'localhost', 8080);
          console.log('🔌 Conectado aos emuladores Firebase');
        } catch (emulatorError) {
          console.warn('⚠️ Erro ao conectar emuladores (pode já estar conectado):', emulatorError);
        }
      }
    }

    // Cache dos serviços
    firebaseServicesCache = {
      firebaseApp,
      auth,
      firestore,
      isInitialized: true,
      initError: null,
    };

    return firebaseServicesCache;

  } catch (error) {
    console.error('❌ Erro fatal ao inicializar Firebase:', error);

    // Retorna objeto de erro para permitir que a aplicação continue
    // (mas sem funcionalidade de autenticação)
    const errorObject: FirebaseServices = {
      firebaseApp: null as any,
      auth: null as any,
      firestore: null as any,
      isInitialized: false,
      initError: error instanceof Error ? error : new Error(String(error)),
    };

    firebaseServicesCache = errorObject;
    return errorObject;
  }
}

/**
 * Reseta o cache do Firebase (útil para testes)
 */
export function resetFirebaseCache(): void {
  firebaseServicesCache = null;
}

/**
 * Verifica se o Firebase está pronto para uso
 */
export function isFirebaseReady(): boolean {
  const services = initializeFirebase();
  return services.isInitialized && !services.initError;
}

// Exportações
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
