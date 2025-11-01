# ANÁLISE DETALHADA DA ARQUITETURA DE NAVEGAÇÃO E GERENCIAMENTO DE ESTADO
## Projeto: Nossa Maternidade

---

## 1. ESTRUTURA DE NAVEGAÇÃO

### 1.1 Hierarquia de Navegadores

```
AppNavigator (Stack Navigator - RootStackParamList)
├── Onboarding Screen (conditional)
└── Home (cuando onboarded === true)
    └── TabNavigator (Bottom Tab Navigator - TabParamList)
        ├── Home Screen
        ├── Chat Screen (NathIA)
        ├── Habits Screen
        ├── Content Screen
        └── Profile Screen
    
    Screens do Stack (acessíveis de qualquer tab)
    ├── DailyPlan Screen
    └── ContentDetail Screen
```

### 1.2 Arquivos de Navegação

| Arquivo | Propósito | Observações |
|---------|----------|-------------|
| `src/navigation/index.tsx` | AppNavigator principal | Gerencia Onboarding vs Home |
| `src/navigation/TabNavigator.tsx` | Bottom tab navigation | 5 tabs, lazy loading com Suspense |
| `src/navigation/types.ts` | Type definitions | RootStackParamList, TabParamList |
| `src/navigation/linking.ts` | Deep linking config | Configurado mas subutilizado |

### 1.3 Deep Linking

**Configuração:**
```typescript
prefixes: ['nossa-maternidade://', 'https://nossa-maternidade.app']

Rotas configuradas:
- /onboarding
- /home, /chat, /habits, /content, /profile
- /daily-plan
- /content/:contentId (com parse de parâmetro)
```

**PROBLEMA:** Deep linking está configurado mas não implementado nas transições reais. Nenhuma tela usa `navigation.link()` ou padrões de deep linking.

---

## 2. CONTEXTOS IMPLEMENTADOS

### 2.1 ThemeContext (src/contexts/ThemeContext.tsx)

**Funcionalidades:**
- Gerencia modo de tema (light/dark/auto)
- Suporta preferência do sistema (useColorScheme)
- Persiste preferência em AsyncStorage
- Fornece hook `useTheme()` para acesso

**Interface:**
```typescript
interface ThemeContextType {
  isDark: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  theme: ReturnType<typeof getTheme>;
}
```

**Estrutura do Provider:**
```
App.tsx
├── ErrorBoundary
└── ThemeProvider
    └── AppNavigator
```

### 2.2 PROBLEMA CRÍTICO: ThemeContext Não Está Sendo Utilizado

**Achado:** Busca por `useTheme` retornou apenas 3 resultados:
1. Definição em ThemeContext.tsx
2. Documentação em OTIMIZACOES-FINAIS.md
3. Referência em .cursorrules

**Nenhuma tela ou componente está usando `useTheme()`!**

**Padrão Atual:**
```typescript
// Em TODAS as telas:
import { colors, spacing, typography, borderRadius } from '../theme/colors';

// Uso direto, sem reatividade a mudanças de tema:
<View style={{ backgroundColor: colors.background }} />
```

---

## 3. GERENCIAMENTO DE ESTADO

### 3.1 Estratégia de Estado por Camada

| Camada | Tecnologia | Dados Armazenados | Observações |
|--------|-----------|------------------|-------------|
| **Persistência** | AsyncStorage | onboarded, userProfile, userId | Sem sincronização centralizada |
| **State Local** | useState | Inputs, loading, filtering | Em cada componente individualmente |
| **State Complexo** | useReducer | Chat messages (useChatOptimized) | Apenas em um hook |
| **Tema Global** | ThemeContext | isDark, themeMode | Configurado mas não utilizado |

### 3.2 AsyncStorage Usage Pattern

**Padrão Identificado:**
```typescript
// Em múltiplos hooks:
const loadUserProfile = async () => {
  const profileJson = await AsyncStorage.getItem('userProfile');
  if (profileJson) {
    const profile = JSON.parse(profileJson);
    setUserContext(profile);
  }
};
```

**Problema:** Cada hook/componente carrega do AsyncStorage independentemente, sem sincronização.

### 3.3 Hooks Customizados

```
src/hooks/
├── useChatOptimized.ts       (useReducer + useState + effects)
├── useUserProfile.ts         (useState + AsyncStorage)
├── useOptimizedFlatList.ts
├── useMemoizedCallback.ts
└── useDailyInteractions.ts
```

#### useChatOptimized.ts (Mais Complexo)
```typescript
// State Management:
- useReducer para state da conversa
- useState para userContext
- useState para userId
- useState para initialLoading

// Effects:
- Carrega histórico ao montar
- Verifica mensagens offline cada 30s
- Sincroniza mensagens pendentes
```

**PROBLEMA:** 4 diferentes useState quando useReducer seria melhor centralizado.

#### useUserProfile.ts (Padrão Simples)
```typescript
// Apenas carrega uma vez do AsyncStorage
// Sem atualização em tempo real
// Cada componente que precisa de perfil chama este hook
```

### 3.4 State Flow Atual

```
AsyncStorage
    ↓
useChatOptimized / useUserProfile / etc
    ↓ (cada hook independente)
HomeScreen
ChatScreen
ProfileScreen
etc...

PROBLEMA: Sem sincronização central entre hooks
```

---

## 4. INCONSISTÊNCIAS E PROBLEMAS IDENTIFICADOS

### 4.1 CRÍTICO: Dois Arquivos de Tema Diferentes

```
1. src/theme/colors.ts
   - Cores simples (light/dark)
   - Shadows, typography, spacing, borderRadius
   - Usado em 90% das telas

2. src/constants/theme.ts  
   - Tema expandido com scales
   - Colors primárias/secundárias
   - getTheme(isDark)
   - Carregado mas não é referenciado nas telas
```

**Impacto:** Inconsistência no sistema de design, confusão para novos devs.

### 4.2 Falta de Context para User Profile/Authentication

**Estado disperso:**
```typescript
// HomeScreen.tsx
const [userName, setUserName] = useState('');
const [pregnancyWeek, setPregnancyWeek] = useState<number | null>(null);
const [dailyPlan, setDailyPlan] = useState<any>(null);

// ProfileScreen.tsx
const [profile, setProfile] = useState<any>(null);

// ChatScreen.tsx
const { userContext } = useChatOptimized(); // Dentro do hook

// OnboardingScreen.tsx
const [name, setName] = useState('');
const [type, setType] = useState<'gestante' | 'mae' | 'tentante' | null>(null);
```

**Problema:** Mesmo dado (userProfile) carregado múltiplas vezes em diferentes componentes.

### 4.3 ThemeContext Não Utilizado

**Contexto Criado Mas Nunca Usado:**
- Hook `useTheme()` não é chamado em nenhuma tela
- Cores importadas diretamente: `import { colors } from '../theme/colors'`
- Tema é estático, não muda quando `toggleTheme()` é chamado

**Por Que Importa:**
1. Não há mudança dinâmica de tema na aplicação
2. Componentes não reagem a mudanças de isDark
3. Toda a lógica de tema em ThemeContext é "morta"

### 4.4 Deep Linking Subutilizado

**Configurado mas não implementado:**
```typescript
// Existe configuration em linking.ts
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['nossa-maternidade://', 'https://nossa-maternidade.app'],
  config: { /* ... */ }
}

// Mas NÃO é usado em navegação:
// ❌ Nenhuma tela usa navigation.link()
// ❌ Nenhuma transição usa deep linking
// ✅ Apenas importado no AppNavigator
```

### 4.5 Recarregamento Desnecessário de Dados

**Exemplo em HomeScreen:**
```typescript
useEffect(() => {
  loadUserProfile();  // Carrega userProfile do AsyncStorage
  loadDailyPlan();    // Carrega daily plan do Supabase
}, []);

// Mesmo dado é carregado independentemente em outros lugares
```

**Problema:** Sem source of truth centralizada.

### 4.6 Navegação de Onboarding vs Main App

**Padrão Identificado:**
```typescript
const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

useEffect(() => {
  checkOnboardingStatus();
}, []);

// Ao completar onboarding:
initialParams={{ onComplete: () => setIsOnboarded(true) }}
```

**Observação:** `onComplete` callback torna o padrão acoplado.

---

## 5. ANÁLISE DE PERFORMANCE

### 5.1 Positivos

✅ **Lazy Loading de Screens**
```typescript
const HomeScreen = lazy(() => 
  import('../screens/HomeScreen').then(m => ({ default: m.default }))
);
```

✅ **Suspense Boundary**
```typescript
<Suspense fallback={<Loading message="Carregando..." />}>
  <Component {...props} />
</Suspense>
```

✅ **Memoização em Alguns Hooks**
```typescript
const aiHistory = useMemo(() => {
  return state.messages.filter(...).slice(-20)
}, [state.messages]);
```

### 5.2 Problemas de Performance

❌ **Re-renders Desnecessários**
- TextInput `onChangeText` causa re-render da tela inteira
- Sem useMemo em renderadores de listas
- Sem React.memo em componentes fixos

❌ **Falta de Normalização de Estado**
- Arrays de objetos não normalizados
- Sem IDs únicos em algumas listas

❌ **AsyncStorage Chamado Múltiplas Vezes**
- Sem cache ou contexto
- Cada hook recarrega dados

---

## 6. ESTRUTURA DE COMPONENTES

### 6.1 Padrão de Estilo

**Padrão Atual:**
```typescript
// Em cada arquivo:
import { colors, spacing, typography, borderRadius } from '../theme/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  // ... mais estilos
});
```

**Problema:** Hard-coded colors, sem tema reativo.

### 6.2 Componentes Reutilizáveis

```
src/components/
├── Badge.tsx
├── Button.tsx
├── Card.tsx
├── Input.tsx
├── Text.tsx
├── Logo.tsx
├── WelcomeHeader.tsx
└── chat/MessageItem.tsx

src/shared/components/
├── Screen.tsx
├── Header.tsx
├── Loading.tsx
├── Toast.tsx
├── Skeleton.tsx
├── EmptyState.tsx
└── ErrorBoundary.tsx
```

✅ **Bem organizado**, mas componentes não usam ThemeContext.

---

## 7. RECOMENDAÇÕES DE MELHORIA

### PRIORIDADE ALTA

#### 1. **Criar UserProfileContext**
```typescript
interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}
```

**Benefícios:**
- Single source of truth para dados de usuário
- Automática sincronização entre telas
- Reduz chamadas ao AsyncStorage

#### 2. **Utilizar ThemeContext Corretamente**
```typescript
// Em cada componente/tela:
import { useTheme } from '../contexts/ThemeContext';

const MyScreen = () => {
  const { theme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      {/* ... */}
    </View>
  );
};
```

**Benefícios:**
- Tema dinâmico funciona
- Mudanças de isDark reagem em tempo real
- Componentes responsivos a tema

#### 3. **Consolidar Arquivo de Tema**
- Mesclar `src/theme/colors.ts` e `src/constants/theme.ts`
- Uma única fonte de verdade
- Exportar tudo de um lugar

#### 4. **Implementar AuthContext**
```typescript
interface AuthContextType {
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onboard: (profile: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
}
```

**Benefícios:**
- Gerencia onboarding state centralmente
- Valida autenticação em um lugar
- Simplifica AppNavigator

### PRIORIDADE MÉDIA

#### 5. **Refatorar useChatOptimized**
- Consolidar 4 `useState` em um único `useReducer`
- Separar side effects em custom hooks
- Memoizar callbacks com useCallback

#### 6. **Implementar Deep Linking Corretamente**
```typescript
// Em navegação:
navigation.link('content/123');

// Em componentes:
const { params } = useRoute();
const contentId = params?.contentId;
```

#### 7. **Adicionar Sincronização de Estado**
```typescript
// Listener para mudanças no AsyncStorage
// Notificar todos os subscribers quando dados mudam
```

#### 8. **Otimizar Re-renders**
```typescript
// Usar React.memo em componentes puros
export const QuickActionButton = React.memo(({ ... }) => { ... });

// Usar useMemo para dados derivados
const filteredQuickActions = useMemo(() => { ... }, [userContext]);

// Usar useCallback para handlers
const handleQuickAction = useCallback((action) => { ... }, []);
```

### PRIORIDADE BAIXA

#### 9. **Melhorar Tipagem**
- Criar arquivo `src/types/index.ts` centralizado
- Exportar todos os types dali
- Evitar `any`

#### 10. **Documentação**
- Diagrama de fluxo de estado
- Guia de como adicionar nova tela
- Padrões de gerenciamento de estado

---

## 8. DIAGRAMA DO ESTADO IDEAL

```
App.tsx
├── ErrorBoundary
├── ThemeProvider (ThemeContext)
├── AuthProvider (AuthContext)
├── UserProfileProvider (UserProfileContext)
└── AppNavigator
    ├── Onboarding (enquanto !isAuthenticated)
    └── MainNavigator (quando isAuthenticated)
        ├── TabNavigator
        │   ├── HomeScreen (usa useTheme, useUserProfile, useAuth)
        │   ├── ChatScreen (usa useChat, useTheme, useUserProfile)
        │   ├── HabitsScreen (usa useTheme)
        │   ├── ContentScreen (usa useTheme)
        │   └── ProfileScreen (usa useAuth, useUserProfile)
        └── Stack Screens
            ├── DailyPlan (usa useTheme, useUserProfile)
            └── ContentDetail (usa useTheme)
```

---

## 9. RESUMO EXECUTIVO

### Estado Atual
- Navegação bem estruturada com Stack + Tab
- ThemeContext criado mas não utilizado
- Gerenciamento de estado disperso e sem sincronização
- Deep linking configurado mas não usado
- Múltiplos arquivos de tema causando confusão

### Problemas Principais
1. **ThemeContext morto** - não está sendo consumido
2. **Falta UserProfileContext** - estado disperso entre componentes
3. **AsyncStorage chamado múltiplas vezes** - sem cache central
4. **Dois arquivos de tema** - inconsistência no design system
5. **Deep linking subutilizado** - funcionalidade perdida

### Impacto
- Mudanças de tema não funcionam
- Atualizar perfil em uma tela não reflete em outras
- Difícil de debugar onde dados vêm de fato
- Performance degradada por recarregamentos desnecessários
- Novo padrão confuso para contribuidores

### Esforço de Correção
- **Alto:** UserProfileContext + AuthContext
- **Médio:** Usar ThemeContext + consolidar temas
- **Baixo:** Implementar deep linking + otimizações

