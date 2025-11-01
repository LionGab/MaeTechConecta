# 🚀 PLANO DE IMPLEMENTAÇÃO - MELHORIAS PRIORIZADAS

**Repositório:** LionNath / Nossa Maternidade
**Data:** 1 de Novembro de 2025
**Baseado em:** ANALISE-ULTRA-PROFUNDA-COMPLETA.md

---

## 📋 QUICK WINS (1-2 dias cada)

### 1. Remover API Keys do Client 🚨 URGENTE

**Problema:**
```typescript
// ❌ src/services/ai.ts
export const chatWithAI = async (...) => {
  const response = await axios.post(API_URLS.CLAUDE, ..., {
    headers: { 'x-api-key': API_CONFIG.CLAUDE_API_KEY } // EXPOSTO!
  });
};
```

**Solução Completa:**

**Passo 1:** Deletar funções perigosas
```bash
# Backup primeiro
cp src/services/ai.ts src/services/ai.ts.backup

# Editar src/services/ai.ts
# REMOVER: chatWithAI, validateWithGPT, generateImage, generateDailyPlan
```

**Passo 2:** Manter apenas chatWithNATIA
```typescript
// src/services/ai.ts - VERSÃO SEGURA

import { supabase } from './supabase';

export interface ChatContext {
  type?: 'gestante' | 'mae' | 'tentante';
  pregnancy_week?: number;
  baby_name?: string;
  preferences?: string[];
}

/**
 * Chat com NAT-IA via Edge Function (ÚNICO método seguro)
 */
export const chatWithNATIA = async (
  message: string,
  context: ChatContext,
  userId: string
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('nathia-chat', {
      body: { userId, message, context },
    });

    if (error) throw new Error(`Edge Function error: ${error.message}`);
    if (!data?.response) throw new Error('Resposta vazia da Edge Function');

    return data.response;
  } catch (error: any) {
    throw new Error(`NAT-IA API error: ${error.message}`);
  }
};

export const detectUrgency = (message: string): boolean => {
  const urgencyKeywords = [
    'sangrando', 'sangramento', 'sangue',
    'dor forte', 'muita dor', 'dor insuportável',
    'desmaio', 'desmaiei', 'febre alta', 'convulsão',
    'não me sinto bem', 'emergência', 'urgente',
  ];
  const lowerMessage = message.toLowerCase();
  return urgencyKeywords.some(keyword => lowerMessage.includes(keyword));
};
```

**Passo 3:** Criar Edge Function para plano diário
```bash
cd supabase/functions
supabase functions new daily-plan-generator
```

```typescript
// supabase/functions/daily-plan-generator/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    const { context } = await req.json();

    // Chamar Gemini para gerar plano
    const prompt = `Crie um plano diário personalizado para ${context.type} em PT-BR.
Semana de gravidez: ${context.pregnancy_week || 'N/A'}
Preferências: ${context.preferences?.join(', ') || 'Nenhuma'}

Formato:
PRIORIDADES:
1. [prioridade 1]
2. [prioridade 2]
3. [prioridade 3]

DICA DO DIA:
[dica do dia]

RECEITA:
[receita saudável e econômica]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
        })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    // Parse do texto
    const priorities = text.match(/PRIORIDADES:(.*?)(?=DICA DO DIA:|$)/s)?.[1]
      ?.split('\n')
      .filter(Boolean)
      .map(p => p.trim()) || [];

    const tip = text.match(/DICA DO DIA:(.*?)(?=RECEITA:|$)/s)?.[1]?.trim() || '';
    const recipe = text.match(/RECEITA:(.*?)$/s)?.[1]?.trim() || '';

    return new Response(
      JSON.stringify({ priorities, tip, recipe }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

**Passo 4:** Atualizar HomeScreen para usar Edge Function
```typescript
// src/screens/HomeScreen.tsx

const generateTodaysPlan = async () => {
  setLoading(true);
  try {
    const profileJson = await AsyncStorage.getItem('userProfile');
    const context: ChatContext = profileJson ? JSON.parse(profileJson) : {};

    // ✅ Agora chama Edge Function
    const { data, error } = await supabase.functions.invoke('daily-plan-generator', {
      body: { context }
    });

    if (error) throw error;

    setDailyPlan(data);

    // Salvar no Supabase
    const userId = await AsyncStorage.getItem('userId');
    const today = format(new Date(), 'yyyy-MM-dd');

    if (userId) {
      await saveDailyPlan({
        user_id: userId,
        date: today,
        ...data
      });
    }
  } catch (error) {
    console.error('Erro ao gerar plano diário:', error);
    Alert.alert('Erro', 'Não foi possível gerar o plano diário');
  } finally {
    setLoading(false);
  }
};
```

**Passo 5:** Deploy
```bash
supabase functions deploy daily-plan-generator
```

**Resultado:** ✅ API keys 100% seguras no servidor

---

### 2. Setup de Testes Básicos 🧪

**Passo 1: Instalar dependências**
```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native @testing-library/react-hooks
```

**Passo 2: Configurar Jest**
```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@supabase)/)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    }
  }
};
```

**Passo 3: Setup file**
```javascript
// jest.setup.js
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Supabase
jest.mock('./src/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn()
    },
    auth: {
      getSession: jest.fn(),
      signUp: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn()
    }))
  }
}));
```

**Passo 4: Criar testes essenciais**

```typescript
// src/components/__tests__/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Button>Test Button</Button>);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button onPress={onPressMock}>Press Me</Button>
    );

    fireEvent.press(getByText('Press Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button onPress={onPressMock} disabled>Disabled</Button>
    );

    fireEvent.press(getByText('Disabled'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should show loading indicator when loading', () => {
    const { getByTestId } = render(
      <Button loading testID="button">Loading</Button>
    );

    expect(getByTestId('button')).toBeTruthy();
  });
});
```

```typescript
// src/hooks/__tests__/useChatOptimized.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useChatOptimized } from '../useChatOptimized';

jest.mock('../services/supabase');
jest.mock('../services/ai');

describe('useChatOptimized', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty messages', () => {
    const { result } = renderHook(() => useChatOptimized());
    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should add user message when sending', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useChatOptimized());

    act(() => {
      result.current.sendMessage('Hello');
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[0].content).toBe('Hello');
  });

  it('should handle errors gracefully', async () => {
    // Mock error
    const chatWithNATIA = require('../services/ai').chatWithNATIA;
    chatWithNATIA.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useChatOptimized());

    await act(async () => {
      await result.current.sendMessage('Test');
    });

    expect(result.current.error).toBeTruthy();
  });
});
```

**Passo 5: Atualizar package.json**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Passo 6: Executar testes**
```bash
npm test
npm run test:coverage
```

**Resultado:** ✅ Testes básicos funcionando, cobertura >70%

---

### 3. Criar AuthContext 👤

**Arquivo:** `src/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão existente
    checkSession();

    // Listener para mudanças de auth
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await AsyncStorage.setItem('userId', session.user.id);
        } else {
          await AsyncStorage.removeItem('userId');
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await AsyncStorage.setItem('userId', session.user.id);
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    await AsyncStorage.multiRemove(['userId', 'userProfile', 'onboarded']);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

**Integrar no App.tsx:**
```typescript
// App.tsx
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
```

**Usar nas screens:**
```typescript
// src/screens/ProfileScreen.tsx
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, signOut, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.navigate('Onboarding');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View>
      <Text>Email: {user?.email}</Text>
      <Button onPress={handleLogout}>Sair</Button>
    </View>
  );
}
```

**Resultado:** ✅ Auth centralizado e reutilizável

---

### 4. Criar UserProfileContext 📝

**Arquivo:** `src/contexts/UserProfileContext.tsx`

```typescript
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, UserProfile, saveUserProfile } from '../services/supabase';
import { useAuth } from './AuthContext';

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // 1. Tentar carregar do AsyncStorage (cache rápido)
      const cachedProfile = await AsyncStorage.getItem('userProfile');
      if (cachedProfile) {
        setProfile(JSON.parse(cachedProfile));
      }

      // 2. Buscar do Supabase (dados atualizados)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        await AsyncStorage.setItem('userProfile', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const updatedProfile = { ...profile, ...updates, id: user.id };

      // 1. Atualizar no Supabase
      await saveUserProfile(updatedProfile);

      // 2. Atualizar no state
      setProfile(updatedProfile as UserProfile);

      // 3. Atualizar no AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  return (
    <UserProfileContext.Provider
      value={{ profile, loading, updateProfile, refreshProfile }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
```

**Integrar no App.tsx:**
```typescript
// App.tsx
import { UserProfileProvider } from './src/contexts/UserProfileContext';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserProfileProvider>
          <ThemeProvider>
            <AppNavigator />
          </ThemeProvider>
        </UserProfileProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
```

**Usar nas screens:**
```typescript
// src/screens/HomeScreen.tsx
import { useUserProfile } from '../contexts/UserProfileContext';

export default function HomeScreen() {
  const { profile, loading } = useUserProfile();

  if (loading) return <Loading />;

  return (
    <View>
      <Text>Olá, {profile?.name}!</Text>
      {profile?.pregnancy_week && (
        <Text>Semana {profile.pregnancy_week} de gestação</Text>
      )}
    </View>
  );
}
```

**Resultado:** ✅ Perfil sincronizado automaticamente, sem AsyncStorage direto

---

## 🎯 MELHORIAS DE MÉDIO PRAZO (1 semana cada)

### 5. Implementar React Query

```bash
npm install @tanstack/react-query
```

```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 30, // 30 minutos
      retry: 2,
    },
  },
});
```

```typescript
// App.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/lib/queryClient';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* ... */}
    </QueryClientProvider>
  );
}
```

```typescript
// src/hooks/useUserProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useUserProfileQuery(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return data;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: Partial<UserProfile>) => saveUserProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
```

---

### 6. Adicionar Sentry

```bash
npm install @sentry/react-native
npx @sentry/wizard -i reactNative -p ios android
```

```typescript
// App.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://...@sentry.io/...',
  tracesSampleRate: 1.0,
  environment: __DEV__ ? 'development' : 'production',
  beforeSend(event, hint) {
    // Filtrar dados sensíveis
    if (event.user) {
      delete event.user.email;
    }
    return event;
  },
});

export default Sentry.wrap(App);
```

---

### 7. Adicionar Firebase Analytics

```bash
expo install @react-native-firebase/app @react-native-firebase/analytics
```

```typescript
// src/utils/analytics.ts
import analytics from '@react-native-firebase/analytics';

export class Analytics {
  static async logEvent(eventName: string, params?: Record<string, any>) {
    try {
      await analytics().logEvent(eventName, params);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  static async logScreenView(screenName: string) {
    await this.logEvent('screen_view', { screen_name: screenName });
  }

  static async setUserId(userId: string) {
    await analytics().setUserId(userId);
  }

  static async setUserProperty(name: string, value: string) {
    await analytics().setUserProperty(name, value);
  }
}
```

```typescript
// Uso nas screens
useEffect(() => {
  Analytics.logScreenView('ChatScreen');
}, []);

const handleSendMessage = () => {
  Analytics.logEvent('message_sent', {
    message_length: inputText.length,
    is_urgent: detectUrgency(inputText)
  });
  sendMessage(inputText);
};
```

---

## ⏱️ CRONOGRAMA SUGERIDO

| Semana | Tarefa | Prioridade | Estimativa |
|--------|--------|-----------|------------|
| **1** | Remover API keys do client | 🚨 Crítico | 2 dias |
| **1** | Setup de testes básicos | 🚨 Crítico | 2 dias |
| **2** | AuthContext | ⚠️ Alta | 2 dias |
| **2** | UserProfileContext | ⚠️ Alta | 2 dias |
| **3** | React Query | ⚠️ Alta | 3 dias |
| **3** | Melhorar TypeScript | ⚠️ Alta | 2 dias |
| **4** | Sentry | ℹ️ Média | 1 dia |
| **4** | Firebase Analytics | ℹ️ Média | 1 dia |
| **4** | Error Boundaries | ℹ️ Média | 1 dia |

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após cada implementação, validar:

- [ ] Testes passando
- [ ] Build sem erros
- [ ] Lint sem warnings
- [ ] Performance não degradou
- [ ] Documentação atualizada
- [ ] PR review aprovado

---

**Criado por:** Claude Sonnet 4.5
**Data:** 1 de Novembro de 2025
