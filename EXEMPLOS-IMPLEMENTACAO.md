# EXEMPLOS DE IMPLEMENTAÇÃO - CORREÇÃO DE PROBLEMAS

---

## PROBLEMA 1: ThemeContext Não Está Sendo Utilizado

### Antes (Padrão Atual - Quebrado)

```typescript
// HomeScreen.tsx
import { colors, spacing, typography } from '../theme/colors';

export default function HomeScreen() {
  return (
    <View style={{ backgroundColor: colors.background }}>
      {/* ... */}
    </View>
  );
}

// Resultado: Tema é ESTÁTICO, nunca muda quando toggleTheme() é chamado
```

### Depois (Corrigido)

```typescript
// HomeScreen.tsx
import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen() {
  const { theme, isDark } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background, // Reativo ao isDark!
      padding: theme.spacing?.lg ?? spacing.lg,
    },
    text: {
      color: theme.foreground,
      fontSize: theme.typography?.sizes?.base ?? typography.sizes.base,
    },
  });

  return (
    <View style={styles.container}>
      {/* Agora responde quando tema mudar */}
    </View>
  );
}
```

**Mudanças Necessárias em ThemeContext:**

```typescript
// src/contexts/ThemeContext.tsx - adicionar spacing e typography ao theme
const theme = getTheme(isDark);

const value: ThemeContextType = {
  isDark,
  themeMode,
  toggleTheme,
  setThemeMode,
  theme,
  // Adicionar:
  spacing, // Do tema
  typography, // Do tema
  borderRadius, // Do tema
};
```

---

## PROBLEMA 2: Falta UserProfileContext

### Implementação Completa

```typescript
// src/contexts/UserProfileContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, supabase } from '../services/supabase';

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar perfil ao montar
  useEffect(() => {
    refreshProfile();
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Tentar carregar do Supabase primeiro
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile(data as UserProfile);
          // Sincronizar com AsyncStorage
          await AsyncStorage.setItem('userProfile', JSON.stringify(data));
          return;
        }
      }

      // Fallback: carregar do AsyncStorage se Supabase falhar
      const profileJson = await AsyncStorage.getItem('userProfile');
      if (profileJson) {
        setProfile(JSON.parse(profileJson));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
      console.error('Erro ao carregar perfil:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!profile) {
      throw new Error('Perfil não carregado');
    }

    try {
      setError(null);
      const updatedProfile = { ...profile, ...updates } as UserProfile;

      // Atualizar no Supabase
      const { error: supabaseError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', profile.id);

      if (supabaseError) throw supabaseError;

      // Atualizar estado local
      setProfile(updatedProfile);

      // Sincronizar com AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
      setError(errorMsg);
      throw err;
    }
  }, [profile]);

  const value: UserProfileContextType = {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile deve ser usado dentro de UserProfileProvider');
  }
  return context;
};
```

### Como Usar em Componentes

**Antes (Disperso):**

```typescript
// HomeScreen.tsx
const [userName, setUserName] = useState('');
const [pregnancyWeek, setPregnancyWeek] = useState<number | null>(null);

useEffect(() => {
  loadUserProfile();
}, []);

const loadUserProfile = async () => {
  const profileJson = await AsyncStorage.getItem('userProfile');
  if (profileJson) {
    const profile = JSON.parse(profileJson);
    setUserName(profile.name);
    setPregnancyWeek(profile.pregnancy_week);
  }
};
```

**Depois (Centralizado):**

```typescript
// HomeScreen.tsx
export default function HomeScreen() {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return <Loading />;
  }

  return (
    <View>
      <Text>Olá, {profile?.name}!</Text>
      <Text>Semana {profile?.pregnancy_week}</Text>
    </View>
  );
}
```

---

## PROBLEMA 3: Dois Arquivos de Tema

### Consolidação

**Antes:**

```typescript
// src/theme/colors.ts - básico
// src/constants/theme.ts - expandido
// Confusão! Qual usar?
```

**Depois - Arquivo Único:**

```typescript
// src/theme/index.ts
export { light, dark, colors, shadows, typography, spacing, borderRadius, getTheme } from './colors';

// Re-exportar scales expandidas de constants/theme
export const themeScales = {
  primaryScale: {
    50: '#FFF5F7',
    100: '#FFE3E8',
    // ... resto
  },
  // ... resto
};

// Type helpers
export type ThemeColors = typeof import('./colors').colors;
export type ThemeType = ReturnType<typeof getTheme>;
```

**Usar em qualquer lugar:**

```typescript
import { colors, spacing, themeScales } from '../theme';
```

---

## PROBLEMA 4: AuthContext (Onboarding/Autenticação)

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, UserProfile } from '../services/supabase';

interface AuthContextType {
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  onboard: (profile: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const onboarded = await AsyncStorage.getItem('onboarded');

      if (storedUserId && onboarded === 'true') {
        setUserId(storedUserId);
      }
    } catch (err) {
      console.error('Erro ao verificar auth:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onboard = useCallback(async (profile: Partial<UserProfile>) => {
    try {
      setError(null);

      // Criar usuário
      const { data: { user } } = await supabase.auth.signUp({
        email: `${Date.now()}@temp.com`,
        password: `${Date.now()}-${Math.random()}`,
      });

      if (!user) throw new Error('Falha ao criar usuário');

      // Salvar perfil
      const fullProfile = {
        id: user.id,
        ...profile,
        subscription_tier: 'free',
        daily_interactions: 0,
        last_interaction_date: new Date().toISOString(),
      };

      const { error: dbError } = await supabase
        .from('user_profiles')
        .insert([fullProfile]);

      if (dbError) throw dbError;

      // Salvar no AsyncStorage
      await AsyncStorage.setItem('userId', user.id);
      await AsyncStorage.setItem('onboarded', 'true');
      await AsyncStorage.setItem('userProfile', JSON.stringify(fullProfile));

      setUserId(user.id);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro no onboarding';
      setError(errorMsg);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);

      // Limpar AsyncStorage
      await AsyncStorage.multiRemove(['userId', 'onboarded', 'userProfile']);

      // Logout do Supabase
      await supabase.auth.signOut();

      setUserId(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro no logout';
      setError(errorMsg);
      throw err;
    }
  }, []);

  const value: AuthContextType = {
    userId,
    isAuthenticated: userId !== null,
    isLoading,
    error,
    onboard,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
```

### Usar em AppNavigator

**Antes (Acoplado):**

```typescript
export function AppNavigator() {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  // ... lógica complexa

  return (
    {!isOnboarded ? (
      <Stack.Screen
        name="Onboarding"
        initialParams={{ onComplete: () => setIsOnboarded(true) }}
      />
    ) : (
      <Stack.Screen name="Home" component={TabNavigator} />
    )}
  );
}
```

**Depois (Limpo):**

```typescript
export function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="Home" component={TabNavigator} />
          <Stack.Screen name="DailyPlan" component={DailyPlanScreen} />
          <Stack.Screen name="ContentDetail" component={ContentDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
```

---

## PROBLEMA 5: App.tsx Estrutura Ideal

```typescript
// App.tsx - FINAL CORRETO
import React from 'react';
import { ErrorBoundary } from './src/shared/components/ErrorBoundary';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { UserProfileProvider } from './src/contexts/UserProfileContext';
import { AppNavigator } from './src/navigation/index';

export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Erro capturado:', error, errorInfo);
        // Enviar para analytics/crash reporting
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <UserProfileProvider>
            <AppNavigator />
          </UserProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
```

**Ordem de Providers (de baixo para cima):**

1. ErrorBoundary (top-level error handling)
2. ThemeProvider (tema aplicado globalmente)
3. AuthProvider (valida se está autenticado)
4. UserProfileProvider (carrega dados do usuário)
5. AppNavigator (usa todos os contextos acima)

---

## PROBLEMA 6: Deep Linking - Implementação Correta

```typescript
// Exemplo: Navegar para conteúdo específico
import { useNavigation } from '@react-navigation/native';

export function ContentCard({ contentId, title }: { contentId: string; title: string }) {
  const navigation = useNavigation();

  const handlePress = () => {
    // Opção 1: navigate com params (recomendado)
    navigation.navigate('ContentDetail', { contentId });

    // Opção 2: deep link (se vier de fora da app)
    // navigation.navigate('ContentDetail', { contentId }); // Mesmo resultado
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
```

```typescript
// ContentDetailScreen.tsx - Receber parâmetro
import { useRoute } from '@react-navigation/native';

export default function ContentDetailScreen() {
  const route = useRoute();
  const { contentId } = route.params as { contentId: string };

  useEffect(() => {
    loadContent(contentId);
  }, [contentId]);

  return (
    // ...
  );
}
```

---

## CHECKLIST DE IMPLEMENTAÇÃO

### Ordem Recomendada

- [ ] **Semana 1:** AuthContext + AppNavigator refactor
  - Criar AuthContext
  - Refatorar AppNavigator
  - Testar Onboarding/Login

- [ ] **Semana 2:** UserProfileContext
  - Criar UserProfileContext
  - Atualizar HomeScreen, ProfileScreen, ChatScreen
  - Teste sincronização entre telas

- [ ] **Semana 3:** Usar ThemeContext
  - Adicionar spacing, typography ao context
  - Atualizar todas as telas
  - Testar dark mode

- [ ] **Semana 4:** Consolidação + Deep Linking
  - Mesclar theme/colors.ts + constants/theme.ts
  - Implementar deep linking
  - Limpar arquivos antigos
  - Atualizar documentação

---

## TESTES SUGERIDOS

```typescript
// __tests__/AuthContext.test.tsx
describe('AuthContext', () => {
  it('deve fazer onboarding corretamente', async () => {
    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);

    await act(async () => {
      await result.current.onboard({ name: 'Maria' });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userId).not.toBeNull();
  });
});
```
