# 🎨 Design Review: ProfileScreen
**App:** Nossa Maternidade Mobile
**Versão:** 1.0.0
**Design System:** Bubblegum (OKLCH)
**Data:** 2025-11-06
**Revisor:** Claude (Design Agent)

---

## 📊 Pontuação Final
**35/50 pontos (70%)** ⭐⭐⭐

### Breakdown por Categoria
| Categoria | Pontuação | Peso | Total |
|-----------|-----------|------|-------|
| **1. Consistência do Design System** | 9/10 | 20% | 9.0 |
| **2. Acessibilidade (WCAG 2.1 AA)** | 2/10 | 20% | 2.0 |
| **3. Hierarquia Visual** | 9/10 | 15% | 9.0 |
| **4. Responsividade** | 8/10 | 15% | 8.0 |
| **5. UX para Público-Alvo** | 6/10 | 20% | 6.0 |
| **6. Performance** | 7/10 | 10% | 7.0 |
| **TOTAL** | **35/50** | **100%** | **35.0** |

---

## 🚨 Status de Publicação
### ❌ **REPROVADO PARA PRODUÇÃO**
**Bloqueadores Críticos:** 2
**Melhorias Críticas:** 8
**Melhorias Recomendadas:** 6

**Recomendação:** Este screen está em **estado de PROTÓTIPO** e NÃO DEVE ser publicado nas stores sem implementar as correções críticas. Estimativa de trabalho necessário: **1-2 dias de desenvolvimento**.

---

## 🎯 Resumo Executivo

### 🚨 **CRÍTICO:** Bloqueadores que Impedem Publicação

#### 1. **Botões de Configurações Não Funcionam** ❌
**Severidade:** 🔴 CRÍTICA
**Localização:** `ProfileScreen.tsx:99-117`

Todos os 4 botões de configurações são **FALSOS** - aparentam ser clicáveis mas não fazem nada:

```typescript
// ❌ PROBLEMA: Botões sem onPress handler
<TouchableOpacity style={styles.settingItem}>
  <Text style={styles.settingText}>🔔 Notificações</Text>
  <Text style={styles.settingArrow}>→</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.settingItem}>
  <Text style={styles.settingText}>🎨 Aparência</Text>
  <Text style={styles.settingArrow}>→</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.settingItem}>
  <Text style={styles.settingText}>🔒 Privacidade</Text>
  <Text style={styles.settingArrow}>→</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.settingItem}>
  <Text style={styles.settingText}>❓ Ajuda & Suporte</Text>
  <Text style={styles.settingArrow}>→</Text>
</TouchableOpacity>
```

**❌ Impacto:**
- **UX Enganosa:** Usuário clica e nada acontece → Frustração
- **Violação das Diretrizes das Stores:** Apple e Google rejeitam apps com funcionalidades não implementadas
- **Perda de Confiança:** Usuário questiona qualidade do app
- **Avaliações Negativas:** "App não funciona", "Botões quebrados"

**✅ Soluções:**

**Opção A: Implementar as Telas de Configurações (Recomendado)**
```typescript
const handleNotifications = () => {
  navigation.navigate('NotificationsSettings' as never);
};

const handleAppearance = () => {
  navigation.navigate('AppearanceSettings' as never);
};

const handlePrivacy = () => {
  navigation.navigate('PrivacySettings' as never);
};

const handleSupport = () => {
  navigation.navigate('Support' as never);
};

// Aplicar:
<TouchableOpacity
  style={styles.settingItem}
  onPress={handleNotifications}
  accessible={true}
  accessibilityLabel="Configurações de notificações"
  accessibilityRole="button"
>
  <Icon name="bell" size={20} color={colors.foreground} />
  <Text style={styles.settingText}>Notificações</Text>
  <Icon name="chevron-right" size={20} color={colors.mutedForeground} />
</TouchableOpacity>
```

**Opção B: Remover Botões Não Implementados (Rápido para MVP)**
```typescript
// Comentar ou remover seções 99-117
// Deixar apenas funcionalidades implementadas
```

**Opção C: Adicionar "Em Breve" (Temporário)**
```typescript
const handleComingSoon = (feature: string) => {
  Alert.alert(
    'Em Breve',
    `A funcionalidade "${feature}" estará disponível em breve! ✨`,
    [{ text: 'OK' }]
  );
};

<TouchableOpacity
  style={styles.settingItem}
  onPress={() => handleComingSoon('Notificações')}
>
```

**⏱️ Tempo Estimado:**
- Opção A: 1-2 dias (criar 4 telas de settings)
- Opção B: 2 minutos (remover código)
- Opção C: 15 minutos (adicionar alerts)

---

#### 2. **Zero Implementação de Acessibilidade** ❌
**Severidade:** 🔴 CRÍTICA
**Localização:** TODO O ARQUIVO

O screen **NÃO TEM NENHUM** label de acessibilidade:

```typescript
// ❌ PROBLEMA: Botões sem accessibility
<TouchableOpacity onPress={() => navigation.goBack()}>
  <Text style={styles.headerBack}>← Voltar</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
  <Text style={styles.logoutText}>Sair da Conta</Text>
</TouchableOpacity>
```

**❌ Impacto:**
- **Viola WCAG 2.1 AA:** Obrigatório para conformidade legal
- **Inacessível para Deficientes Visuais:** Screen readers não conseguem navegar
- **Rejeição Potencial nas Stores:** Apple exige conformidade com acessibilidade
- **Exclusão de Público:** ~6.5 milhões de deficientes visuais no Brasil (IBGE)

**✅ Correção:**
```typescript
<TouchableOpacity
  onPress={() => navigation.goBack()}
  accessible={true}
  accessibilityLabel="Voltar"
  accessibilityRole="button"
  accessibilityHint="Retorna para a tela anterior"
>
  <Text style={styles.headerBack}>← Voltar</Text>
</TouchableOpacity>

<Text
  style={styles.headerTitle}
  accessibilityRole="header"
>
  Perfil
</Text>

<Text
  style={styles.userName}
  accessibilityRole="header"
  accessibilityLabel={`Nome: ${profile?.name || 'Usuário'}`}
>
  {profile?.name || 'Usuário'}
</Text>

<TouchableOpacity
  style={styles.settingItem}
  onPress={handleNotifications}
  accessible={true}
  accessibilityLabel="Configurações de notificações"
  accessibilityRole="button"
  accessibilityHint="Abre as configurações de notificações do aplicativo"
>
  <Text style={styles.settingText}>🔔 Notificações</Text>
  <Text style={styles.settingArrow}>→</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.logoutButton}
  onPress={handleLogout}
  accessible={true}
  accessibilityLabel="Sair da conta"
  accessibilityRole="button"
  accessibilityHint="Remove seus dados e retorna para a tela inicial"
>
  <Text style={styles.logoutText}>Sair da Conta</Text>
</TouchableOpacity>
```

**⏱️ Tempo Estimado:** 30-45 minutos (adicionar labels em todos os elementos interativos)

---

### ⚠️ Problemas Críticos (Não-bloqueantes, mas Urgentes)

#### 3. **Touch Targets Abaixo do Mínimo** ⚠️
**Severidade:** 🟡 ALTA
**Localização:** `ProfileScreen.tsx:238-245`

```typescript
settingItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: spacing.md, // ❌ Provavelmente 16px (precisa 44px)
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
}
```

**❌ Impacto:**
- Viola WCAG 2.5.5 (Target Size)
- Difícil de clicar para usuários com tremor ou amamentando

**✅ Correção:**
```typescript
settingItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: spacing.md,
  minHeight: 44, // ✅ Garantir mínimo WCAG
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
}
```

---

#### 4. **Valor Hardcoded no Spacer** ⚠️
**Severidade:** 🟡 ALTA
**Localização:** `ProfileScreen.tsx:49`

```typescript
<Text style={styles.headerTitle}>Perfil</Text>
<View style={{ width: 60 }} /> {/* ❌ HARDCODED */}
```

**❌ Impacto:**
- Quebra consistência do Design System
- Pode desalinhar em diferentes devices

**✅ Correção:**
```typescript
<Text style={styles.headerTitle}>Perfil</Text>
<View style={styles.headerSpacer} />

// No StyleSheet:
headerSpacer: {
  width: spacing['3xl'], // ✅ Usar token do design system
}
```

---

#### 5. **Emojis em Vez de Ícones** ⚠️
**Severidade:** 🟡 MÉDIA
**Localização:** `ProfileScreen.tsx:60-62, 100-115`

```typescript
// ❌ PROBLEMA: Emojis renderizam diferente entre devices
<Text style={styles.userType}>
  {profile?.type === 'gestante' && '👶 Gestante'}
  {profile?.type === 'mae' && '🤱 Mãe'}
  {profile?.type === 'tentante' && '💕 Tentante'}
</Text>

<TouchableOpacity style={styles.settingItem}>
  <Text style={styles.settingText}>🔔 Notificações</Text>
  <Text style={styles.settingArrow}>→</Text>
</TouchableOpacity>
```

**✅ Correção:**
```typescript
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

<View style={styles.userTypeContainer}>
  {profile?.type === 'gestante' && (
    <>
      <Icon name="baby-carriage" size={20} color={colors.primary} />
      <Text style={styles.userType}>Gestante</Text>
    </>
  )}
  {profile?.type === 'mae' && (
    <>
      <Icon name="mother-nurse" size={20} color={colors.primary} />
      <Text style={styles.userType}>Mãe</Text>
    </>
  )}
  {profile?.type === 'tentante' && (
    <>
      <Icon name="heart" size={20} color={colors.primary} />
      <Text style={styles.userType}>Tentante</Text>
    </>
  )}
</View>

<TouchableOpacity style={styles.settingItem}>
  <Icon name="bell" size={20} color={colors.foreground} />
  <Text style={styles.settingText}>Notificações</Text>
  <Icon name="chevron-right" size={20} color={colors.mutedForeground} />
</TouchableOpacity>
```

---

#### 6. **Dados Mockados ("Dias no app": 0)** ⚠️
**Severidade:** 🟡 MÉDIA
**Localização:** `ProfileScreen.tsx:70`

```typescript
<View style={styles.statItem}>
  <Text style={styles.statNumber}>0</Text> {/* ❌ Hardcoded */}
  <Text style={styles.statLabel}>Dias no app</Text>
</View>
```

**❌ Impacto:**
- Aparenta funcionalidade não implementada
- Perde oportunidade de gamificação

**✅ Correção:**
```typescript
const [daysInApp, setDaysInApp] = useState(0);

useEffect(() => {
  calculateDaysInApp();
}, []);

const calculateDaysInApp = async () => {
  const userId = await AsyncStorage.getItem('userId');
  if (userId) {
    // Fetch from Supabase
    const { data } = await supabase
      .from('profiles')
      .select('created_at')
      .eq('id', userId)
      .single();

    if (data?.created_at) {
      const days = Math.floor(
        (Date.now() - new Date(data.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      setDaysInApp(days);
    }
  }
};

<Text style={styles.statNumber}>{daysInApp}</Text>
```

---

#### 7. **Sem Loading State** ⚠️
**Severidade:** 🟡 MÉDIA
**Localização:** `ProfileScreen.tsx:16-21`

```typescript
const loadProfile = async () => {
  const profileJson = await AsyncStorage.getItem('userProfile');
  if (profileJson) {
    setProfile(JSON.parse(profileJson));
  }
};
```

**❌ Impacto:**
- Screen aparece vazio durante loading
- Experiência ruim em conexões lentas

**✅ Correção:**
```typescript
const [loading, setLoading] = useState(true);

const loadProfile = async () => {
  setLoading(true);
  try {
    const profileJson = await AsyncStorage.getItem('userProfile');
    if (profileJson) {
      setProfile(JSON.parse(profileJson));
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    Alert.alert('Erro', 'Não foi possível carregar seu perfil.');
  } finally {
    setLoading(false);
  }
};

// No render:
{loading ? (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>Carregando perfil...</Text>
  </View>
) : (
  // Conteúdo normal
)}
```

---

#### 8. **Sem Pull-to-Refresh** ⚠️
**Severidade:** 🟢 BAIXA
**Localização:** `ProfileScreen.tsx:43`

```typescript
<ScrollView style={styles.container}>
  {/* ❌ Falta RefreshControl */}
</ScrollView>
```

**✅ Correção:**
```typescript
const [refreshing, setRefreshing] = useState(false);

const onRefresh = useCallback(async () => {
  setRefreshing(true);
  await loadProfile();
  setRefreshing(false);
}, []);

<ScrollView
  style={styles.container}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.primary}
      colors={[colors.primary]}
    />
  }
>
```

---

### ⭐ Pontos Fortes

1. **Boa Consistência do Design System** (9/10)
   - Uso correto de tokens (cores, espaçamento, tipografia, shadows)
   - Apenas 1 valor hardcoded encontrado

2. **Hierarquia Visual Clara** (9/10)
   - Estrutura bem organizada em cards
   - Uso inteligente de shadows para profundidade
   - Tipografia bem hierarquizada

3. **Logout com Confirmação** (✅)
   - Implementado corretamente com Alert.alert
   - Limpa AsyncStorage completamente
   - Reseta navigation stack

---

## 🔍 Análise Detalhada

### 1. Consistência do Design System (9/10) ⭐

**Análise:** Quase perfeito, com apenas 1 exceção.

#### ✅ Uso de Tokens
**Arquivo:** `ProfileScreen.tsx:6`
```typescript
import { borderRadius, colors, shadows, spacing, typography } from '@/theme/colors';
```

**Verificação de Estilos:**
- ✅ **Cores:** 100% usa `colors.*` (20+ ocorrências)
- ✅ **Espaçamento:** 99% usa `spacing.*` (1 hardcoded)
- ✅ **Tipografia:** 100% usa `typography.*`
- ✅ **Border Radius:** 100% usa `borderRadius.*`
- ✅ **Shadows:** Usa `shadows.light.*` (excelente!)

**❌ Única Exceção:**
```typescript
// ProfileScreen.tsx:49
<View style={{ width: 60 }} /> // ❌ Deveria ser spacing['3xl']
```

---

### 2. Acessibilidade - WCAG 2.1 AA (2/10) 🚨

**Análise:** REPROVADO. Zero implementação de acessibilidade.

#### ❌ Problemas Críticos

**A) Nenhum Elemento Tem Labels**
- ❌ Botão "Voltar": Sem accessibility (linha 45)
- ❌ Título "Perfil": Sem accessibilityRole="header" (linha 48)
- ❌ Nome do usuário: Sem accessibilityRole="header" (linha 58)
- ❌ Botões de configurações: Sem accessibility (linhas 99-117)
- ❌ Botão "Sair da Conta": Sem accessibility (linha 130)

**B) Touch Targets Não Especificados**
- ❌ Settings items: paddingVertical provavelmente < 44px
- ❌ Back button: Tamanho não garantido
- ❌ Logout button: Padding apenas (não garante 44x44px)

**C) Nenhum Feedback para Screen Readers**
- Screen readers não conseguem identificar o propósito dos elementos
- Usuários cegos/com baixa visão não conseguem usar o screen

---

### 3. Hierarquia Visual (9/10) ⭐

**Análise:** Excelente estrutura e uso de profundidade.

#### ✅ Pontos Fortes

**A) Cards com Shadows**
```typescript
// ProfileScreen.tsx:164-171
avatarSection: {
  alignItems: 'center',
  backgroundColor: colors.card,
  padding: spacing['2xl'],
  borderRadius: borderRadius.lg,
  marginBottom: spacing.lg,
  ...shadows.light.md, // ✅ Depth perfeito
}
```

**B) Tipografia Hierarquizada**
```typescript
userName: {
  fontSize: typography.sizes['2xl'], // ✅ Grande para destaque
  fontWeight: typography.weights.bold,
}

statNumber: {
  fontSize: typography.sizes['2xl'], // ✅ Números proeminentes
  fontWeight: typography.weights.bold,
  color: colors.primary,
}

statLabel: {
  fontSize: typography.sizes.xs, // ✅ Labels discretas
  color: colors.mutedForeground,
}
```

**C) Seções Bem Organizadas**
1. Avatar + Nome (destaque máximo)
2. Stats (visão rápida)
3. Interesses (personalização)
4. Configurações (ações secundárias)
5. Sobre (informações terciárias)
6. Logout (ação destrutiva isolada)

---

### 4. Responsividade (8/10) ⭐

**Análise:** Boa, mas falta SafeAreaView.

#### ✅ Pontos Fortes

**A) ScrollView para Conteúdo Longo**
```typescript
<ScrollView style={styles.container}>
  {/* Suporta perfis com muitos interesses */}
</ScrollView>
```

**B) Stats com Flexbox**
```typescript
statsCard: {
  flexDirection: 'row',
  justifyContent: 'space-around', // ✅ Distribui uniformemente
}
```

#### ⚠️ Melhorias

**Falta SafeAreaView:**
```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

return (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <ScrollView style={styles.container}>
      {/* ... */}
    </ScrollView>
  </SafeAreaView>
);
```

---

### 5. UX para Público-Alvo (6/10) ⚠️

**Análise:** Potencial alto, mas prejudicado por funcionalidades fake.

#### ✅ Pontos Fortes

**A) Informações Relevantes**
- Tipo de usuário (gestante/mãe/tentante)
- Semana de gravidez (para gestantes)
- Interesses personalizados
- Plano (free/premium)

**B) Logout com Confirmação Segura**
```typescript
const handleLogout = () => {
  Alert.alert('Sair', 'Tem certeza que deseja sair?', [
    { text: 'Cancelar', style: 'cancel' },
    {
      text: 'Sair',
      style: 'destructive',
      onPress: async () => {
        await AsyncStorage.removeItem('onboarded');
        await AsyncStorage.removeItem('userProfile');
        await AsyncStorage.removeItem('userId');
        navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] } as any);
      },
    },
  ]);
};
```

**C) Visual Acolhedor**
- Logo como avatar (familiar)
- Cores suaves
- Linguagem empática ("Nossa Maternidade é sua assistente...")

#### ❌ Problemas que Prejudicam UX

**A) Botões de Configurações Não Funcionam**
- Usuário clica em "Notificações" → Nada acontece → Frustração

**B) "Dias no app" Sempre Zero**
- Perde oportunidade de gamificação e engajamento

**C) Sem Feedback de Loading**
- Screen aparece vazio inicialmente

---

### 6. Performance (7/10) ⭐

**Análise:** Boa, mas pode melhorar.

#### ✅ Pontos Fortes

**A) Sem Re-renders Desnecessários**
- Estado simples (apenas `profile`)
- Sem cálculos complexos

**B) AsyncStorage Eficiente**
- Carrega apenas 1 item do storage

#### ⚠️ Melhorias

**useCallback em Handlers:**
```typescript
const loadProfile = useCallback(async () => {
  // ...
}, []);

const handleLogout = useCallback(() => {
  // ...
}, [navigation]);
```

**useMemo para Interesses:**
```typescript
const preferencesList = useMemo(() => {
  return profile?.preferences?.map((pref: string, index: number) => (
    <View key={index} style={styles.preferenceItem}>
      <Text style={styles.preferenceText}>{pref}</Text>
    </View>
  ));
}, [profile?.preferences]);
```

---

## 📋 Checklist de Correções

### 🔴 BLOQUEADORES - Implementar IMEDIATAMENTE

- [ ] **Implementar ou remover botões de configurações fake**
  📍 `ProfileScreen.tsx:99-117`
  ⏱️ Tempo: 2 minutos (remover) OU 1-2 dias (implementar)

  **Opção A: Remover (Rápido para MVP)**
  ```typescript
  // Comentar linhas 95-118 inteiras
  ```

  **Opção B: Adicionar "Em Breve" (15 minutos)**
  ```typescript
  const handleComingSoon = (feature: string) => {
    Alert.alert('Em Breve', `A funcionalidade "${feature}" estará disponível em breve! ✨`);
  };

  <TouchableOpacity
    style={styles.settingItem}
    onPress={() => handleComingSoon('Notificações')}
  >
  ```

- [ ] **Implementar acessibilidade completa**
  📍 TODO O ARQUIVO
  ⏱️ Tempo: 30-45 minutos

  **Elementos Críticos:**
  ```typescript
  // Botão Voltar
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    accessible={true}
    accessibilityLabel="Voltar"
    accessibilityRole="button"
  >

  // Títulos
  <Text style={styles.headerTitle} accessibilityRole="header">
    Perfil
  </Text>

  <Text style={styles.userName} accessibilityRole="header">
    {profile?.name || 'Usuário'}
  </Text>

  // Configurações (se mantidas)
  <TouchableOpacity
    style={styles.settingItem}
    accessible={true}
    accessibilityLabel="Configurações de notificações"
    accessibilityRole="button"
    accessibilityHint="Abre configurações de notificações"
  >

  // Logout
  <TouchableOpacity
    style={styles.logoutButton}
    onPress={handleLogout}
    accessible={true}
    accessibilityLabel="Sair da conta"
    accessibilityRole="button"
    accessibilityHint="Remove dados e retorna para tela inicial"
  >
  ```

---

### 🟡 Alta Prioridade (Implementar antes do lançamento)

- [ ] **Corrigir valor hardcoded no spacer**
  📍 `ProfileScreen.tsx:49`
  ⏱️ Tempo: 2 minutos
  ```typescript
  // Substituir:
  <View style={{ width: 60 }} />

  // Por:
  <View style={styles.headerSpacer} />

  // No StyleSheet:
  headerSpacer: {
    width: spacing['3xl'],
  }
  ```

- [ ] **Adicionar minHeight aos settings items**
  📍 `ProfileScreen.tsx:238-245`
  ⏱️ Tempo: 2 minutos
  ```typescript
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: 44, // ✅ Adicionar
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  }
  ```

- [ ] **Implementar cálculo de "Dias no app"**
  📍 `ProfileScreen.tsx:70`
  ⏱️ Tempo: 20 minutos
  ```typescript
  const [daysInApp, setDaysInApp] = useState(0);

  useEffect(() => {
    calculateDaysInApp();
  }, []);

  const calculateDaysInApp = async () => {
    const createdAt = await AsyncStorage.getItem('userCreatedAt');
    if (createdAt) {
      const days = Math.floor(
        (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      setDaysInApp(days);
    }
  };

  <Text style={styles.statNumber}>{daysInApp}</Text>
  ```

- [ ] **Adicionar loading state**
  📍 `ProfileScreen.tsx:16-21`
  ⏱️ Tempo: 15 minutos
  ```typescript
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profileJson = await AsyncStorage.getItem('userProfile');
      if (profileJson) {
        setProfile(JSON.parse(profileJson));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar seu perfil.');
    } finally {
      setLoading(false);
    }
  };

  // No render:
  {loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Carregando perfil...</Text>
    </View>
  ) : (
    // Conteúdo normal
  )}
  ```

---

### 🟢 Média Prioridade (Implementar em sprint seguinte)

- [ ] **Substituir emojis por Icons**
  📍 `ProfileScreen.tsx:60-62, 100-115`
  ⏱️ Tempo: 30 minutos
  ```typescript
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

  // Tipo de usuário:
  <View style={styles.userTypeContainer}>
    <Icon
      name={
        profile?.type === 'gestante' ? 'baby-carriage' :
        profile?.type === 'mae' ? 'mother-nurse' :
        'heart'
      }
      size={20}
      color={colors.primary}
    />
    <Text style={styles.userType}>
      {profile?.type === 'gestante' && 'Gestante'}
      {profile?.type === 'mae' && 'Mãe'}
      {profile?.type === 'tentante' && 'Tentante'}
    </Text>
  </View>

  // Settings items:
  <TouchableOpacity style={styles.settingItem}>
    <Icon name="bell" size={20} color={colors.foreground} />
    <Text style={styles.settingText}>Notificações</Text>
    <Icon name="chevron-right" size={20} color={colors.mutedForeground} />
  </TouchableOpacity>
  ```

- [ ] **Adicionar pull-to-refresh**
  📍 `ProfileScreen.tsx:43`
  ⏱️ Tempo: 10 minutos
  ```typescript
  import { RefreshControl } from 'react-native';

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, []);

  <ScrollView
    style={styles.container}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={colors.primary}
        colors={[colors.primary]}
      />
    }
  >
  ```

- [ ] **Adicionar SafeAreaView**
  ⏱️ Tempo: 5 minutos
  ```typescript
  import { SafeAreaView } from 'react-native-safe-area-context';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        {/* ... */}
      </ScrollView>
    </SafeAreaView>
  );

  // Estilo:
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  }
  ```

---

### 🟡 Baixa Prioridade (Nice to have)

- [ ] **Adicionar useCallback e useMemo**
  ⏱️ Tempo: 10 minutos
  ```typescript
  const loadProfile = useCallback(async () => {
    // ...
  }, []);

  const handleLogout = useCallback(() => {
    // ...
  }, [navigation]);

  const preferencesList = useMemo(() => {
    return profile?.preferences?.map((pref: string, index: number) => (
      <View key={index} style={styles.preferenceItem}>
        <Text style={styles.preferenceText}>{pref}</Text>
      </View>
    ));
  }, [profile?.preferences]);
  ```

- [ ] **Adicionar animação de entrada no avatar**
  ⏱️ Tempo: 15 minutos
  ```typescript
  import { Animated } from 'react-native';

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
    <Logo size={100} />
  </Animated.View>
  ```

- [ ] **Adicionar edição do perfil**
  ⏱️ Tempo: 2-3 horas
  ```typescript
  <TouchableOpacity
    style={styles.editButton}
    onPress={() => navigation.navigate('EditProfile' as never)}
  >
    <Icon name="pencil" size={20} color={colors.primary} />
    <Text style={styles.editText}>Editar Perfil</Text>
  </TouchableOpacity>
  ```

---

## 💰 Estimativa de Custo e Tempo

### Cenário 1: MVP Rápido (Remover Fake Buttons)
| Prioridade | Tempo Total | Custo Dev Jr. (R$ 30/h) | Custo Dev Pleno (R$ 60/h) |
|------------|-------------|-------------------------|---------------------------|
| 🔴 Bloqueadores | 32-47 min | R$ 16-24 | R$ 32-48 |
| 🟡 Alta | 39 min | R$ 20 | R$ 40 |
| 🟢 Média | 45 min | R$ 23 | R$ 46 |
| **TOTAL** | **2h** | **R$ 60** | **R$ 120** |

### Cenário 2: Completo (Implementar Screens de Settings)
| Prioridade | Tempo Total | Custo Dev Jr. (R$ 30/h) | Custo Dev Pleno (R$ 60/h) |
|------------|-------------|-------------------------|---------------------------|
| 🔴 Bloqueadores | 1-2 dias | R$ 480-960 | R$ 960-1920 |
| 🟡 Alta | 39 min | R$ 20 | R$ 40 |
| 🟢 Média | 45 min | R$ 23 | R$ 46 |
| **TOTAL** | **1.5-2 dias** | **R$ 523-1003** | **R$ 1006-2006** |

**Recomendação:** Cenário 1 (MVP) para lançamento rápido. Implementar Settings screens em sprint seguinte.

---

## 🎯 Comparação com Outras Screens

| Screen | Pontuação | Bloqueadores | Acessibilidade | Status |
|--------|-----------|--------------|----------------|--------|
| **HomeScreen** | 48.5/50 (97%) | 0 | 9/10 | ✅ Aprovado |
| **ChatScreen** | 47/50 (94%) | 0 | 8/10 | ✅ Aprovado |
| **OnboardingScreen** | 47/50 (94%)* | 2 | 9/10 | ❌ Bloqueado |
| **ProfileScreen** | 35/50 (70%) | 2 | 2/10 | ❌ Bloqueado |

*Score técnico. OnboardingScreen bloqueado por LGPD, ProfileScreen bloqueado por funcionalidades fake.

### 🚨 ProfileScreen é o Screen com PIOR Score

**Por quê?**
1. Funcionalidades fake (settings buttons)
2. Zero acessibilidade
3. Dados mockados (dias no app = 0)
4. Sem loading state
5. Estado de protótipo não finalizado

**ProfileScreen vs OnboardingScreen:**
- OnboardingScreen: Tecnicamente excelente, bloqueado por conformidade legal (LGPD)
- ProfileScreen: Tecnicamente incompleto, bloqueado por funcionalidades não implementadas

---

## 📸 Recomendação para App Stores

### ❌ **NÃO usar ProfileScreen para Screenshots**

**Motivos:**
1. Botões fake serão notados pelos revisores da Apple/Google
2. "Dias no app: 0" aparenta funcionalidade quebrada
3. Menos visual atraente que HomeScreen ou ChatScreen
4. Não demonstra valor do app

**Alternative:** Use HomeScreen ou ChatScreen para screenshots principais.

---

## 🚀 Próximos Passos Recomendados

### IMEDIATO (Hoje):
1. **Remover botões de configurações fake** (2 min)
   - Comentar linhas 95-118

2. **Adicionar acessibilidade básica** (30 min)
   - Labels em botões Voltar e Logout
   - accessibilityRole="header" em títulos

### SPRINT ATUAL:
3. **Implementar correções de Alta Prioridade** (39 min)
   - Spacer hardcoded → token
   - Touch targets 44px
   - Cálculo de "Dias no app"
   - Loading state

### PRÓXIMO SPRINT:
4. **Implementar Settings Screens** (1-2 dias)
   - NotificationsSettings
   - AppearanceSettings
   - PrivacySettings
   - Support

5. **Implementar correções de Média Prioridade** (45 min)
   - Emojis → Icons
   - Pull-to-refresh
   - SafeAreaView

---

## 📞 Contato para Dúvidas

Se houver dúvidas sobre implementação das correções, consulte:
- **Documentação WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **React Native Accessibility:** https://reactnative.dev/docs/accessibility
- **React Navigation:** https://reactnavigation.org/docs/getting-started

---

## ✅ CONCLUSÃO

ProfileScreen está **REPROVADO PARA PRODUÇÃO** com pontuação de **70% (35/50)**.

**2 bloqueadores críticos identificados:**
1. ❌ Botões de configurações não funcionam (fake navigation)
2. ❌ Zero implementação de acessibilidade (viola WCAG)

**Este é o screen com MENOR score do projeto** e requer **1-2 dias de desenvolvimento** para atingir padrão de produção.

**Recomendação:**
- **Curto prazo (MVP):** Remover settings buttons + adicionar acessibilidade básica (~1 hora)
- **Médio prazo:** Implementar settings screens completos (~1-2 dias)

Após correções, este screen tem potencial para atingir **45-48/50 (90-96%)**.
