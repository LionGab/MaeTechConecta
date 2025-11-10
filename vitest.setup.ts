/**
 * Vitest Setup
 * Configuração inicial para testes
 */

import { vi } from 'vitest';

declare global {
  // eslint-disable-next-line no-var
  var __DEV__: boolean;
}

globalThis.__DEV__ = false;

// Mock do Expo
vi.mock('expo', () => ({
  default: {
    Constants: {
      manifest: {},
    },
  },
}));

// Mock do React Native
vi.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: (obj: any) => obj.ios || obj.default,
  },
  Dimensions: {
    get: () => ({ width: 375, height: 812 }),
  },
}));

// Mock do AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
}));

// Mock do Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    })),
    functions: {
      invoke: vi.fn(),
    },
  })),
}));

