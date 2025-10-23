'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Função simplificada para inicializar o Firebase de forma consistente.
export function initializeFirebase() {
  // Se nenhuma instância do Firebase foi inicializada ainda, crie uma.
  if (!getApps().length) {
    // Verifica se a configuração foi preenchida.
    // Se a apiKey ainda for o placeholder, o app não vai funcionar.
    if (firebaseConfig.apiKey === "SUA_API_KEY") {
      console.error("Configuração do Firebase incompleta. Preencha os dados em src/firebase/config.ts");
      // Você pode querer lançar um erro aqui para interromper a execução.
    }
    initializeApp(firebaseConfig);
  }

  // Retorna as instâncias dos serviços Firebase.
  const firebaseApp = getApp();
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
