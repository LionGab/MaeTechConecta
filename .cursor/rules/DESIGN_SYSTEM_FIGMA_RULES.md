# 🎨 Design System Rules - Nossa Maternidade

# Regras Completas para Integração Figma → React Native

> **Framework:** React Native + Expo SDK 54  
> **Target:** Mobile-First (iOS/Android) - Público C-D (Mães brasileiras)  
> **Última atualização:** Janeiro 2025

---

## 📋 Índice

1. [Token Definitions](#1-token-definitions)
2. [Component Library](#2-component-library)
3. [Frameworks & Libraries](#3-frameworks--libraries)
4. [Asset Management](#4-asset-management)
5. [Icon System](#5-icon-system)
6. [Styling Approach](#6-styling-approach)
7. [Project Structure](#7-project-structure)
8. [Figma Integration Patterns](#8-figma-integration-patterns)

---

## 1. Token Definitions

### 1.1 Temas Disponíveis

O app possui **DOIS design systems** distintos:

#### **Tema 1: Bubblegum (Original)** - Acolhedor e Maternal

- **Filosofia:** Creme suave, cores quentes, não usa preto puro no dark mode
- **Target:** Experiência acolhedora, acessível, maternal
- **Localização:** `src/theme/colors.ts`

#### **Tema 2: Serene Dawn (Premium)** - Elegante e Sofisticado

- **Filosofia:** Amanhecer, azuis profundos, dourado, glassmorphism
- **Target:** Experiência premium elite
- **Localização:** `src/theme/sereneDawn.ts`

---

### 1.2 Cores - Tema Bubblegum

**Light Mode:**

```typescript
// Backgrounds
background: '#FCFAF8'; // Creme suave acolhedor
foreground: '#1A1A1A'; // Preto suave para legibilidade

// Primary Colors
primary: '#E891B5'; // Terracota - Rosa suave maternal
primaryForeground: '#FFFFFF';

secondary: '#C8E0D4'; // Sage - Verde suave acolhedor
secondaryForeground: '#1A4A3A';

accent: '#E8C4E8'; // Lavanda - Roxo suave
accentForeground: '#4A2A4A';

// Functional
destructive: '#E67E7E'; // Vermelho suave (menos agressivo)
success: '#81C784'; // Verde sucesso
warning: '#FFB74D'; // Âmbar aviso
info: '#64B5F6'; // Azul info

// Neutrals
muted: '#F5F0E8'; // Creme suave
mutedForeground: '#6B6660'; // Cinza médio

// Borders
border: '#E5DCD0'; // Bege suave
input: '#F5F0E8'; // Creme suave
ring: '#E891B5'; // Rosa focus
```

**Dark Mode:**

```typescript
// Backgrounds - Marrom escuro (NÃO preto puro)
background: '#1F1C1A'; // Marrom escuro suave
foreground: '#F5F0E8'; // Creme claro

card: '#2A2623'; // Marrom escuro mais claro
cardForeground: '#F5F0E8';

// Primary Colors (mais claros para contraste)
primary: '#F0A8C4'; // Terracota claro
primaryForeground: '#1F1C1A';

secondary: '#A0C5B4'; // Sage claro
secondaryForeground: '#1F1C1A';

accent: '#D8B4D8'; // Lavanda suave
accentForeground: '#1F1C1A';
```

**Gradientes:**

```typescript
gradients: {
  blue: ['#3B82F6', '#60A5FA'],
  purple: ['#8B5CF6', '#A78BFA'],
  green: ['#10B981', '#34D399'],
  amber: ['#F59E0B', '#FBBF24'],
  pink: ['#E891B5', '#F0A8C4'],     // Primary
  sage: ['#C8E0D4', '#A0C5B4'],
  lavender: ['#E8C4E8', '#D8B4D8'],
}
```

**Overlays:**

```typescript
overlay: {
  primary: 'rgba(232, 145, 181, 0.1)',       // Rosa transparente
  primaryBorder: 'rgba(232, 145, 181, 0.2)', // Rosa border
  primaryBorderLight: 'rgba(232, 145, 181, 0.15)',
  white: 'rgba(255, 255, 255, 0.08)',        // Branco transparente
  black: 'rgba(0, 0, 0, 0.5)',               // Overlay modal
}
```

---

### 1.3 Cores - Tema Serene Dawn (Premium)

**Paleta Base:**

```typescript
sereneDawnColors: {
  // Azuis Noturnos/Crepusculares
  midnightBlue: '#0A1931',    // Background principal
  darkPetrol: '#1B2A41',      // Cards e seções
  navyDeep: '#0F1E2E',        // Popover

  // Azuis Céu Suaves
  slateBlue: '#5D7B9B',       // Textos secundários
  sereneSky: '#7FB0DA',       // Primário
  babyBlue: '#ADD8E6',        // Destaques

  // Toques de Calor
  champagne: '#FFD700',       // Dourado/Luxo
  warmWhite: '#F8F8F8',       // Textos principais
  platinum: '#DCDCDC',        // Bordas

  // Azuis Secundários
  deepOcean: '#0D1B2A',       // Contraste
  twilight: '#1E3A5F',        // Variação card

  // Estados
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
}
```

**Gradientes Premium:**

```typescript
sereneDawnGradients: {
  // Primários
  primary: ['#7FB0DA', '#ADD8E6'],
  primaryWithGold: ['#7FB0DA', '#FFD700'], // ⭐ Usado em badges, botões premium

  // Luxo
  luxury: ['#FFD700', '#FFEAA7'],

  // Ambientes
  twilight: ['#0A1931', '#1B2A41'],
  aurora: ['#0D1B2A', '#7FB0DA', '#ADD8E6'],  // 3 cores
  calm: ['#ADD8E6', '#F8F8F8'],

  // Estados
  success: ['#34D399', '#6EE7B7'],
  warning: ['#FBBF24', '#FCD34D'],
  error: ['#F87171', '#FCA5A5'],
  info: ['#60A5FA', '#93C5FD'],
}
```

**Overlays (Glassmorphism):**

```typescript
sereneDawnOverlay: {
  primary: 'rgba(127, 176, 218, 0.1)',
  primaryBorder: 'rgba(127, 176, 218, 0.2)',
  primaryBorderLight: 'rgba(127, 176, 218, 0.15)',
  gold: 'rgba(255, 215, 0, 0.1)',
  goldBorder: 'rgba(255, 215, 0, 0.2)',
  white: 'rgba(255, 255, 255, 0.06)',    // Dark mode glass
  black: 'rgba(0, 0, 0, 0.5)',           // Modal overlay
  glass: 'rgba(255, 255, 255, 0.1)',     // Efeito vidro fosco
}
```

---

### 1.4 Tipografia

#### Bubblegum Theme:

```typescript
typography: {
  fontFamily: {
    sans: 'System',    // Fonte do sistema (melhor performance)
    serif: 'System',
    mono: 'Courier',
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,          // ✅ Mínimo (evita zoom no iOS)
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 48,
  },
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
}
```

#### Serene Dawn Theme (Premium):

```typescript
sereneDawnTypography: {
  fontFamily: {
    heading: 'Inter',   // Títulos (Semibold/Bold)
    body: 'Roboto',     // Corpo (Regular)
    sans: 'System',     // Fallback
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 48,
    '7xl': 60,          // ⭐ Novos tamanhos maiores
    '8xl': 72,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
  },
}
```

**Regras de Uso:**

- ✅ Mínimo **16px** para corpo de texto (evita zoom no iOS)
- ✅ Títulos: **≥24px** (hierarquia clara)
- ✅ Classe C-D: fontes generosas, contraste alto
- ✅ Line-height: **1.5** (normal) para leitura confortável

---

### 1.5 Espaçamento

#### Bubblegum Theme:

```typescript
spacing: {
  xs: 4,      // 0.25rem
  sm: 8,      // 0.5rem
  md: 16,     // 1rem (melhorado de 12px)
  lg: 24,     // 1.5rem (melhorado de 16px)
  xl: 32,     // 2rem (melhorado de 20px)
  '2xl': 48,  // 3rem (melhorado de 24px)
  '3xl': 64,  // 4rem (melhorado de 32px)
  '4xl': 96,  // 6rem (novo)
  '5xl': 128, // 8rem (novo)
}
```

#### Serene Dawn Theme (Premium):

```typescript
sereneDawnSpacing: {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  '5xl': 128,
  '6xl': 192,  // ⭐ Novo espaçamento maior
}
```

**Regras de Uso:**

- ✅ **md (16px):** padrão interno de cards/containers
- ✅ **lg (24px):** margens entre seções
- ✅ **xl (32px):** padding de telas
- ✅ **2xl (48px):** espaçamento entre seções principais

---

### 1.6 Border Radius

#### Bubblegum Theme:

```typescript
borderRadius: {
  sm: 4,      // 0.25rem
  md: 8,      // 0.5rem
  lg: 12,     // 0.75rem (padrão mobile)
  xl: 16,     // 1rem
  '2xl': 24,  // 1.5rem (melhorado)
  '3xl': 32,  // 2rem (novo)
  full: 999,  // Fully rounded
}
```

#### Serene Dawn Theme (Premium):

```typescript
sereneDawnBorderRadius: {
  sm: 6,      // ⭐ Mais arredondado
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 999,
}
```

**Regras de Uso:**

- ✅ **lg (12-16px):** padrão para cards e botões
- ✅ **xl (16-20px):** componentes premium
- ✅ **full (999px):** badges, avatares, pills

---

### 1.7 Sombras

#### Bubblegum Theme (Light Mode):

```typescript
shadows: {
  light: {
    xs: {
      shadowColor: 'rgba(0,0,0,0.05)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,  // Android
    },
    sm: {
      shadowColor: 'rgba(0,0,0,0.06)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: 'rgba(0,0,0,0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: 'rgba(0,0,0,0.10)',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 1,
      shadowRadius: 15,
      elevation: 8,
    },
    xl: {
      shadowColor: 'rgba(0,0,0,0.12)',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 1,
      shadowRadius: 25,
      elevation: 12,
    },
  },
}
```

#### Serene Dawn Theme (Dark Mode - Mais Profundas):

```typescript
sereneDawnShadows: {
  dark: {
    xs: {
      shadowColor: 'rgba(0,0,0,0.40)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: 'rgba(0,0,0,0.50)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: 'rgba(0,0,0,0.60)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: 'rgba(0,0,0,0.70)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: 'rgba(0,0,0,0.80)',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 12,
    },
    '2xl': {
      shadowColor: 'rgba(0,0,0,0.90)',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 1,
      shadowRadius: 32,
      elevation: 16,
    },
  },
}
```

**Regras de Uso:**

- ✅ iOS: `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`
- ✅ Android: `elevation`
- ✅ Cards: `md` ou `lg`
- ✅ Botões: `sm` ou `md`
- ✅ Modais: `xl` ou `2xl`

---

## 2. Component Library

### 2.1 Estrutura de Componentes

```
src/components/
├── Base Components (Tema Bubblegum)
│   ├── Button.tsx           → Botão acessível 44x44px mínimo
│   ├── Card.tsx             → Container com sombra e bordas
│   ├── Input.tsx            → Input com validação
│   ├── Badge.tsx            → Badge de status
│   ├── Text.tsx             → Tipografia (H1, H2, Body, Caption)
│   └── Logo.tsx             → Logo responsivo
│
├── Premium Components (Tema Serene Dawn)
│   ├── ButtonPremium.tsx    → Gradientes + haptic feedback
│   ├── BadgePremium.tsx     → Gradientes + glow effect
│   ├── CardGlass.tsx        → Glassmorphism + blur
│   └── InputPremium.tsx     → Gradientes + animações
│
├── Feature Components
│   ├── PlanoDoDia.tsx       → Plano diário personalizado
│   ├── PersonalizedContentCard.tsx
│   ├── PorQueIssoModal.tsx
│   └── chat/
│       ├── MessageItem.tsx
│       ├── TypingIndicator.tsx
│       └── MessageSkeleton.tsx
│
└── Utility Components
    ├── AnimatedCard.tsx      → Card com animações
    ├── EnhancedButton.tsx    → Botão com estados avançados
    ├── GradientView.tsx      → Container com gradiente
    └── Spacing.tsx           → Helpers de espaçamento
```

---

### 2.2 Anatomia de Componente Base (Button)

```typescript
// src/components/Button.tsx

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;                    // MaterialCommunityIcons
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel: string;       // ✅ Obrigatório
  accessibilityHint?: string;
}

// Exemplo de uso
<Button
  variant="primary"
  size="md"
  icon="chat"
  loading={isLoading}
  fullWidth
  accessibilityLabel="Enviar mensagem"
  accessibilityHint="Envia sua mensagem para a NathIA"
  onPress={handleSubmit}
>
  Enviar
</Button>
```

**Regras de Implementação:**

- ✅ Sempre usar `StyleSheet.create()` para performance
- ✅ Memoizar componente com `React.memo`
- ✅ Usar `useMemo` e `useCallback` para otimização
- ✅ `minHeight: 44px` e `minWidth: 44px` (WCAG touch target)
- ✅ `accessibilityLabel` obrigatório
- ✅ `accessibilityRole="button"` para screen readers
- ✅ Haptic feedback opcional (expo-haptics)

---

### 2.3 Anatomia de Componente Premium (ButtonPremium)

```typescript
// src/components/ButtonPremium.tsx

export interface ButtonPremiumProps {
  children: React.ReactNode;
  variant?: 'primary' | 'primaryGold' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradientColors?: [string, string];   // ⭐ Customizar gradiente
  accessibilityLabel: string;
  accessibilityHint?: string;
}

// Exemplo de uso
<ButtonPremium
  variant="primaryGold"
  size="lg"
  icon="crown"
  gradientColors={sereneDawnGradients.primaryWithGold}
  accessibilityLabel="Ativar plano premium"
  onPress={handleUpgrade}
>
  Ativar Premium
</ButtonPremium>
```

**Features Premium:**

- ✅ Gradientes via `LinearGradient` (expo-linear-gradient)
- ✅ Animação de escala ao pressionar (Animated API)
- ✅ Haptic feedback (expo-haptics)
- ✅ Sombras premium profundas (xl, 2xl)
- ✅ `minHeight: 52-60px` (touch target melhorado)

---

### 2.4 Padrões de Card

#### Card Base (Bubblegum):

```typescript
<Card
  title="Dica do Dia"
  icon="lightbulb-on"
  iconColor={colors.primary}
  variant="elevated"
  padding="lg"
  style={styles.tipCard}
  onPress={() => navigation.navigate('Tips')}
  accessibilityLabel="Dica do dia - Toque para ver detalhes"
>
  <Text style={styles.tipText}>
    Durante a gravidez, é normal sentir cansaço...
  </Text>
</Card>
```

#### Card Glass (Premium):

```typescript
<CardGlass
  title="Seu Plano de Hoje"
  subtitle="Personalizado para você"
  icon="calendar-star"
  iconColor={sereneDawnColors.champagne}
  variant="glow"
  useNativeBlur={true}
  padding="xl"
  style={styles.planCard}
>
  <PlanoDoDia items={plan.items} />
</CardGlass>
```

---

## 3. Frameworks & Libraries

### 3.1 Stack Tecnológico

| Categoria      | Tecnologia                | Versão | Uso                                 |
| -------------- | ------------------------- | ------ | ----------------------------------- |
| **Framework**  | React Native              | 0.76+  | Base do app mobile                  |
| **SDK**        | Expo                      | 54.0.0 | Build, deploy, OTA updates          |
| **Linguagem**  | TypeScript                | 5.3+   | Type safety                         |
| **Navegação**  | @react-navigation/native  | 7.0+   | Stack, Tab, Drawer navigation       |
| **State**      | Zustand                   | 5.0+   | Global state (alternativa ao Redux) |
| **Storage**    | AsyncStorage              | 2.0+   | Persistência local                  |
| **Backend**    | Supabase                  | 2.50+  | Auth, Database, Edge Functions      |
| **AI**         | Claude Sonnet 4 + GPT-4o  | -      | Chat inteligente                    |
| **Gradientes** | expo-linear-gradient      | 14.0+  | Gradientes nativos                  |
| **Blur**       | expo-blur                 | 14.0+  | Glassmorphism                       |
| **Ícones**     | react-native-vector-icons | 10.0+  | MaterialCommunityIcons              |
| **Haptics**    | expo-haptics              | 14.0+  | Feedback tátil                      |
| **Forms**      | react-hook-form           | 7.54+  | Validação de formulários            |
| **Testing**    | Vitest + Detox            | -      | Unit + E2E tests                    |

---

### 3.2 Build System

**Configuração:**

- **Bundler:** Metro (padrão React Native)
- **Build:** EAS Build (Expo Application Services)
- **OTA Updates:** Expo Updates
- **Hot Reload:** Fast Refresh habilitado

**Scripts Principais:**

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "test": "vitest",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\""
  }
}
```

---

### 3.3 Configuração do Tema

**ThemeContext (src/contexts/ThemeContext.tsx):**

```typescript
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('dark');
  const [themeName, setThemeName] = useState<'bubblegum' | 'v0-app'>('bubblegum');
  const [isDark, setIsDark] = useState(true);

  const colors = getThemeColors(themeName, isDark);

  const theme = {
    colors,
    shadows: isDark ? shadows.dark : shadows.light,
    typography,
    spacing,
    borderRadius,
  };

  return (
    <ThemeContext.Provider value={{ isDark, themeMode, themeName, colors, theme, toggleTheme, setThemeMode, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Uso
const { theme, isDark, toggleTheme } = useTheme();
```

---

## 4. Asset Management

### 4.1 Estrutura de Assets

```
src/assets/
├── images/
│   ├── nat1.png          → Avatar Nathalia Valente
│   ├── nat2.png
│   └── nat3.png
└── [outros assets]

apps/mobile/assets/
├── adaptive-icon.png     → Android adaptive icon
├── icon.png              → App icon (1024x1024)
├── splash.png            → Splash screen
└── favicon.png           → Web favicon
```

---

### 4.2 Otimização de Imagens

**Regras:**

- ✅ **PNG:** ícones, logos, imagens com transparência
- ✅ **JPEG/WebP:** fotos, imagens realistas
- ✅ **SVG:** ícones simples (via react-native-svg)
- ✅ **Compressão:** TinyPNG ou similar
- ✅ **Responsive:** fornecer múltiplas resoluções (@2x, @3x)

**Exemplo de Uso:**

```typescript
import { Image } from 'react-native';

// Asset local
<Image
  source={require('@/assets/images/nat1.png')}
  style={{ width: 100, height: 100 }}
  resizeMode="cover"
/>

// URL remota (com cache)
<Image
  source={{ uri: 'https://supabase.co/storage/v1/object/public/images/avatar.png' }}
  style={{ width: 100, height: 100 }}
  resizeMode="cover"
/>

// Expo Image (recomendado para performance)
import { Image as ExpoImage } from 'expo-image';

<ExpoImage
  source={require('@/assets/images/nat1.png')}
  style={{ width: 100, height: 100 }}
  contentFit="cover"
  transition={300}
/>
```

---

### 4.3 CDN e Storage

**Supabase Storage:**

- Imagens de perfil: `supabase.storage.from('avatars')`
- Conteúdo: `supabase.storage.from('content')`
- Cache: 30 dias (CDN Cloudflare)

---

## 5. Icon System

### 5.1 Biblioteca: MaterialCommunityIcons

**Instalação:**

```bash
npm install react-native-vector-icons
```

**Configuração (app.json):**

```json
{
  "expo": {
    "plugins": [
      [
        "expo-font",
        {
          "fonts": ["./node_modules/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf"]
        }
      ]
    ]
  }
}
```

---

### 5.2 Uso de Ícones

**Import:**

```typescript
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
```

**Exemplos:**

```typescript
// Ícone simples
<Icon name="heart" size={24} color={colors.primary} />

// Ícone em botão
<Button icon="chat" variant="primary">
  Conversar
</Button>

// Ícone em card
<Card icon="lightbulb-on" iconColor={colors.accent} title="Dica">
  Conteúdo aqui
</Card>

// Ícone animado (rotação)
<Animated.View style={{ transform: [{ rotate: spinValue }] }}>
  <Icon name="loading" size={32} color={colors.primary} />
</Animated.View>
```

---

### 5.3 Ícones Principais do App

| Contexto      | Ícone           | Nome              |
| ------------- | --------------- | ----------------- |
| Chat          | `chat`          | Chat/Conversa     |
| Home          | `home`          | Tela inicial      |
| Perfil        | `account`       | Perfil do usuário |
| Plano Diário  | `calendar-star` | Calendário        |
| Progresso     | `chart-line`    | Gráfico           |
| Hábitos       | `check-circle`  | Check/Confirmar   |
| Emergência    | `phone-alert`   | Telefone alerta   |
| Sono          | `sleep`         | Dormir            |
| Alimentação   | `food-apple`    | Maçã/Alimento     |
| Exercício     | `run`           | Correr/Exercício  |
| Médico        | `stethoscope`   | Estetoscópio      |
| Premium       | `crown`         | Coroa             |
| Notificações  | `bell`          | Sino              |
| Configurações | `cog`           | Engrenagem        |
| Sair          | `logout`        | Logout            |

**Buscar ícones:**
https://pictogrammers.com/library/mdi/

---

## 6. Styling Approach

### 6.1 StyleSheet.create() (Obrigatório)

**❌ Evitar:**

```typescript
// Estilos inline (ruim para performance)
<View style={{ padding: 16, backgroundColor: '#E891B5' }}>
  <Text style={{ fontSize: 18, color: '#FFFFFF' }}>Olá</Text>
</View>
```

**✅ Correto:**

```typescript
import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme/colors';

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: typography.sizes.lg,
    color: colors.primaryForeground,
    fontFamily: typography.fontFamily.sans,
  },
});

// Uso
<View style={styles.container}>
  <Text style={styles.text}>Olá</Text>
</View>
```

---

### 6.2 Memoização e Performance

**React.memo:**

```typescript
const ButtonComponent: React.FC<ButtonProps> = ({ children, variant, onPress }) => {
  // Implementação
};

export const Button = React.memo(ButtonComponent);
```

**useMemo:**

```typescript
const containerStyle = useMemo(
  () => [styles.base, styles[variant], fullWidth && styles.fullWidth, disabled && styles.disabled, style],
  [variant, fullWidth, disabled, style]
);
```

**useCallback:**

```typescript
const handlePress = useCallback(
  (event) => {
    // Haptic feedback
    Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (onPress) {
      onPress(event);
    }
  },
  [onPress]
);
```

---

### 6.3 Responsive Design

**Detecção de tamanho:**

```typescript
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
const isLargeDevice = SCREEN_WIDTH >= 414;

const getResponsiveValue = (small: number, medium: number, large: number) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

// Uso
const styles = StyleSheet.create({
  title: {
    fontSize: getResponsiveValue(22, 26, 30),
    lineHeight: getResponsiveValue(28, 32, 38),
  },
});
```

---

### 6.4 Acessibilidade (WCAG 2.1 AA)

**Regras Obrigatórias:**

1. **Touch Target:** 44x44px mínimo (iOS), 48dp mínimo (Android)

```typescript
const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

2. **Contraste de Cores:**
   - Texto normal (≤18px): **4.5:1** mínimo
   - Texto grande (≥18px): **3:1** mínimo

3. **accessibilityLabel:** Obrigatório para todos os elementos interativos

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Enviar mensagem"
  accessibilityHint="Envia sua mensagem para a NathIA"
  accessibilityState={{ disabled: false }}
  onPress={handleSubmit}
>
  <Text>Enviar</Text>
</TouchableOpacity>
```

4. **accessibilityRole:** Correto para cada tipo de elemento
   - `button`: botões
   - `header`: títulos/cabeçalhos
   - `text`: textos
   - `link`: links
   - `image`: imagens
   - `switch`: toggles
   - `checkbox`: checkboxes

5. **Screen Reader Support:**

```typescript
// VoiceOver (iOS) e TalkBack (Android)
<View
  accessible={true}
  accessibilityLabel="Plano do dia"
  accessibilityHint="Mostra suas tarefas personalizadas"
  accessibilityRole="summary"
>
  {/* Conteúdo */}
</View>

// Elementos decorativos (não devem ser lidos)
<View accessible={false} importantForAccessibility="no">
  <Icon name="decoration" size={20} color={colors.muted} />
</View>
```

---

## 7. Project Structure

### 7.1 Estrutura Completa

```
NossaMaternidade/
├── src/
│   ├── app/                      → App Router (se usar Expo Router)
│   ├── assets/                   → Imagens, fontes
│   │   └── images/
│   ├── components/               → Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── ButtonPremium.tsx
│   │   ├── Card.tsx
│   │   ├── CardGlass.tsx
│   │   ├── Badge.tsx
│   │   ├── BadgePremium.tsx
│   │   ├── Input.tsx
│   │   ├── InputPremium.tsx
│   │   ├── Text.tsx
│   │   ├── Logo.tsx
│   │   ├── PlanoDoDia.tsx
│   │   ├── PersonalizedContentCard.tsx
│   │   ├── PorQueIssoModal.tsx
│   │   ├── chat/
│   │   │   ├── MessageItem.tsx
│   │   │   ├── TypingIndicator.tsx
│   │   │   └── MessageSkeleton.tsx
│   │   └── home/
│   │       └── DailyInsightCard.tsx
│   ├── contexts/                 → React Contexts
│   │   ├── ThemeContext.tsx
│   │   └── AuthContext.tsx
│   ├── features/                 → Features modulares
│   │   ├── auth/
│   │   ├── chat/
│   │   └── habits/
│   ├── hooks/                    → Custom hooks
│   │   ├── useTheme.ts
│   │   ├── useDailyInsight.ts
│   │   ├── usePlanoDoDia.ts
│   │   ├── usePersonalizedContent.ts
│   │   └── useUserProfile.ts
│   ├── lib/                      → Bibliotecas internas
│   │   ├── nat-ai/               → Sistema de IA
│   │   └── utils/
│   ├── navigation/               → Navegação
│   │   ├── AppNavigator.tsx
│   │   ├── types.ts
│   │   └── linking.ts
│   ├── screens/                  → Telas principais
│   │   ├── HomeScreen.tsx
│   │   ├── HomeScreenPremium.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── OnboardingScreenPremium.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── HabitsScreen.tsx
│   ├── services/                 → Serviços externos
│   │   ├── supabase.ts           → Cliente Supabase
│   │   ├── ai.ts                 → APIs de IA
│   │   ├── notifications.ts      → Push notifications
│   │   └── personalization.ts    → Sistema de personalização
│   ├── theme/                    → Design System Tokens
│   │   ├── colors.ts             → Tema Bubblegum
│   │   ├── sereneDawn.ts         → Tema Serene Dawn (Premium)
│   │   ├── index.ts
│   │   └── themes/
│   │       ├── index.ts
│   │       └── v0-app.ts
│   ├── types/                    → TypeScript types globais
│   │   ├── supabase.ts
│   │   └── index.ts
│   └── utils/                    → Utilitários
│       ├── validation.ts
│       └── formatters.ts
├── supabase/                     → Backend
│   ├── functions/                → Edge Functions
│   │   ├── ingest-event/         → Ingestão de eventos
│   │   ├── build-signals/        → Construção de sinais
│   │   ├── infer-preferences/    → Inferência de preferências
│   │   ├── curate-content-personalized/ → Curadoria de conteúdo
│   │   ├── compose-copy/         → Composição de mensagens
│   │   ├── plan-daily/           → Planejamento diário
│   │   └── dispatch-plan/        → Envio de notificações
│   └── migrations/               → SQL migrations
├── .cursor/                      → Configurações Cursor AI
│   ├── rules/                    → Regras de revisão
│   └── commands/                 → Comandos customizados
├── docs/                         → Documentação
├── __tests__/                    → Testes
├── app.json                      → Config Expo
├── eas.json                      → Config EAS Build
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

### 7.2 Path Aliases

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/screens/*": ["src/screens/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/theme/*": ["src/theme/*"],
      "@/services/*": ["src/services/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"],
      "@/navigation/*": ["src/navigation/*"],
      "@/contexts/*": ["src/contexts/*"]
    }
  }
}
```

**Uso:**

```typescript
// ❌ Evitar
import { Button } from '../../../components/Button';

// ✅ Correto
import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';
import { useTheme } from '@/hooks/useTheme';
```

---

## 8. Figma Integration Patterns

### 8.1 Workflow: Figma → React Native

**Passo 1: Receber Design do Figma**

- Exportar tokens (cores, tipografia, espaçamento) via Figma plugin
- Usar Figma DevMode para specs precisas
- Exportar assets (PNG @2x/@3x, SVG)

**Passo 2: Mapear Tokens**

- Converter tokens Figma para TypeScript
- Atualizar `src/theme/colors.ts` ou `src/theme/sereneDawn.ts`
- Verificar contraste WCAG 2.1 AA

**Passo 3: Criar/Atualizar Componentes**

- Criar componente no `src/components/`
- Implementar com `StyleSheet.create()`
- Adicionar acessibilidade
- Memoizar com `React.memo`

**Passo 4: Testar**

- Testar em iOS (iPhone 13, 15)
- Testar em Android (Pixel 5, Galaxy S21)
- Testar dark mode
- Testar acessibilidade (VoiceOver/TalkBack)

---

### 8.2 Conversão de Tokens Figma

**Cores:**

```typescript
// Figma: #E891B5 (Primary)
// React Native:
primary: '#E891B5',
primaryForeground: '#FFFFFF',

// Figma: rgba(232, 145, 181, 0.1) (Primary/10%)
// React Native:
overlay: {
  primary: 'rgba(232, 145, 181, 0.1)',
}
```

**Espaçamento:**

```typescript
// Figma: 16px → spacing.md
// React Native:
spacing: {
  md: 16,
}
```

**Tipografia:**

```typescript
// Figma: Inter/Bold/24px → typography.sizes['2xl']
// React Native:
typography: {
  sizes: {
    '2xl': 24,
  },
  weights: {
    bold: '700',
  },
  fontFamily: {
    heading: 'Inter',
  },
}
```

**Sombras:**

```typescript
// Figma: Drop Shadow (0px 4px 6px rgba(0,0,0,0.08))
// React Native (iOS):
shadows: {
  light: {
    md: {
      shadowColor: 'rgba(0,0,0,0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 4,  // Android
    },
  },
}
```

**Border Radius:**

```typescript
// Figma: 12px → borderRadius.lg
// React Native:
borderRadius: {
  lg: 12,
}
```

---

### 8.3 Export de Assets do Figma

**Configurações de Export:**

1. **Ícones/Logos:**
   - Formato: **PNG** (se tiver transparência) ou **SVG** (vetorial)
   - Resolução: **@1x, @2x, @3x** (para PNG)
   - Nome: `icon-name.png` (kebab-case)

2. **Imagens/Fotos:**
   - Formato: **JPEG** ou **WebP** (melhor compressão)
   - Resolução: **@1x, @2x, @3x**
   - Compressão: TinyPNG ou similar
   - Nome: `image-name.jpg`

3. **Ilustrações:**
   - Formato: **SVG** (se possível)
   - Fallback: **PNG** @2x/@3x
   - Nome: `illustration-name.svg`

**Estrutura de Nomenclatura:**

```
assets/images/
├── logo@2x.png          → Logo 2x resolution
├── logo@3x.png          → Logo 3x resolution
├── avatar-nat@2x.png    → Avatar Nathalia 2x
├── avatar-nat@3x.png    → Avatar Nathalia 3x
└── illustration-onboarding.svg  → SVG (escalável)
```

---

### 8.4 Checklists de Integração

**Checklist: Cores**

- [ ] Todas as cores possuem light/dark variants
- [ ] Contraste WCAG 2.1 AA verificado (4.5:1 texto normal, 3:1 texto grande)
- [ ] Overlays e transparências definidas
- [ ] Gradientes mapeados corretamente

**Checklist: Tipografia**

- [ ] Fontes customizadas carregadas (se necessário)
- [ ] Tamanhos mínimos respeitados (16px corpo)
- [ ] Pesos mapeados corretamente (300-800)
- [ ] Line-heights definidos

**Checklist: Componente**

- [ ] Usa tokens de tema (não hardcoded)
- [ ] Implementa acessibilidade (accessibilityLabel, role)
- [ ] Touch target ≥44x44px
- [ ] Memoizado com React.memo
- [ ] Estilos em StyleSheet.create()
- [ ] Responsive (testa em múltiplos tamanhos)
- [ ] Funciona em light/dark mode
- [ ] Documentado com JSDoc

**Checklist: Assets**

- [ ] Exportados em múltiplas resoluções (@2x/@3x)
- [ ] Comprimidos (TinyPNG, ImageOptim)
- [ ] Nomes em kebab-case
- [ ] Localizados em `src/assets/images/`

---

### 8.5 Plugins Figma Recomendados

| Plugin                            | Uso                                     |
| --------------------------------- | --------------------------------------- |
| **Contrast**                      | Verificar contraste WCAG                |
| **A11y - Color Contrast Checker** | Acessibilidade de cores                 |
| **Design Tokens**                 | Exportar tokens para JSON               |
| **Figma to Code (React Native)**  | Converter design em código              |
| **Inspect**                       | Specs detalhadas (padding, margin, etc) |
| **TinyImage**                     | Comprimir imagens antes de exportar     |

---

## 9. Regras de Implementação (Resumo)

### 9.1 Regras de Ouro

1. **✅ SEMPRE usar tokens de tema** (nunca hardcoded)
2. **✅ SEMPRE implementar acessibilidade** (accessibilityLabel, role)
3. **✅ SEMPRE usar StyleSheet.create()** (performance)
4. **✅ SEMPRE memoizar componentes** (React.memo)
5. **✅ SEMPRE respeitar touch targets** (≥44x44px)
6. **✅ SEMPRE testar em light/dark mode**
7. **✅ SEMPRE testar em múltiplos tamanhos de tela**
8. **✅ SEMPRE documentar componentes** (JSDoc)

---

### 9.2 Exemplo de Componente Completo

```typescript
/**
 * 🌅 Button Premium - Tema "Amanhecer Sereno"
 * Botão com gradiente, sombras premium e micro-interações
 *
 * Features:
 * - Gradientes suaves com toque dourado
 * - Haptic feedback
 * - Animações ao pressionar
 * - Sombras profundas
 * - Área de toque otimizada (52-60px)
 *
 * @example
 * <ButtonPremium
 *   variant="primaryGold"
 *   size="lg"
 *   icon="crown"
 *   accessibilityLabel="Ativar plano premium"
 *   onPress={handleUpgrade}
 * >
 *   Ativar Premium
 * </ButtonPremium>
 */

import React, { useCallback, useMemo, useRef } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  sereneDawnColors,
  sereneDawnGradients,
  sereneDawnShadows,
  sereneDawnTypography,
  sereneDawnSpacing,
  sereneDawnBorderRadius,
} from '@/theme/sereneDawn';

export interface ButtonPremiumProps {
  children: React.ReactNode;
  variant?: 'primary' | 'primaryGold' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradientColors?: [string, string];
  accessibilityLabel: string;
  accessibilityHint?: string;
  onPress?: () => void;
}

const ButtonPremiumComponent: React.FC<ButtonPremiumProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  gradientColors,
  accessibilityLabel,
  accessibilityHint,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Memoizar cores do gradiente
  const gradient = useMemo(() => {
    if (gradientColors) return gradientColors;
    switch (variant) {
      case 'primary':
        return sereneDawnGradients.primary;
      case 'primaryGold':
        return sereneDawnGradients.primaryWithGold;
      default:
        return sereneDawnGradients.primary;
    }
  }, [variant, gradientColors]);

  // Memoizar estilos
  const containerStyle = useMemo(
    () => [
      styles.base,
      styles[`${size}Container`],
      fullWidth && styles.fullWidth,
      (disabled || loading) && styles.disabled,
      style,
    ],
    [size, fullWidth, disabled, loading, style]
  );

  const textStyleCombined = useMemo(
    () => [styles.baseText, styles[`${size}Text`], textStyle],
    [size, textStyle]
  );

  // Callbacks
  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePress = useCallback(() => {
    // Haptic feedback
    try {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Ignorar se não disponível
    }

    if (onPress) {
      onPress();
    }
  }, [onPress]);

  return (
    <Animated.View style={[fullWidth && styles.fullWidthWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={containerStyle}
        disabled={disabled || loading}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: disabled || loading }}
        activeOpacity={0.9}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Gradiente */}
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Conteúdo */}
        {loading ? (
          <ActivityIndicator color={sereneDawnColors.midnightBlue} size="small" />
        ) : (
          <View style={styles.content}>
            {icon && iconPosition === 'left' && (
              <Icon name={icon} size={20} color={sereneDawnColors.midnightBlue} style={styles.iconLeft} />
            )}

            <Text style={textStyleCombined}>{children}</Text>

            {icon && iconPosition === 'right' && (
              <Icon name={icon} size={20} color={sereneDawnColors.midnightBlue} style={styles.iconRight} />
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: sereneDawnBorderRadius.xl,
    overflow: 'hidden',
    minHeight: 52,  // ✅ Touch target
    minWidth: 52,
  },
  baseText: {
    fontFamily: sereneDawnTypography.fontFamily.heading,
    fontWeight: sereneDawnTypography.weights.semibold,
    color: sereneDawnColors.midnightBlue,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  fullWidthWrapper: {
    width: '100%',
  },

  // Tamanhos de Container
  smContainer: {
    paddingHorizontal: sereneDawnSpacing.md,
    paddingVertical: sereneDawnSpacing.sm,
    minHeight: 44,
    ...sereneDawnShadows.light.sm,
  },
  mdContainer: {
    paddingHorizontal: sereneDawnSpacing.lg,
    paddingVertical: sereneDawnSpacing.md,
    minHeight: 52,
    ...sereneDawnShadows.light.md,
  },
  lgContainer: {
    paddingHorizontal: sereneDawnSpacing.xl,
    paddingVertical: sereneDawnSpacing.lg,
    minHeight: 60,
    ...sereneDawnShadows.light.lg,
  },

  // Tamanhos de Texto
  smText: {
    fontSize: sereneDawnTypography.sizes.sm,
  },
  mdText: {
    fontSize: sereneDawnTypography.sizes.base,
  },
  lgText: {
    fontSize: sereneDawnTypography.sizes.lg,
  },

  // Estados
  disabled: {
    opacity: 0.5,
  },

  // Ícones
  iconLeft: {
    marginRight: sereneDawnSpacing.sm,
  },
  iconRight: {
    marginLeft: sereneDawnSpacing.sm,
  },
});

export const ButtonPremium = React.memo(ButtonPremiumComponent);
```

---

## 10. Recursos Adicionais

### 10.1 Links Úteis

| Recurso                      | URL                                           |
| ---------------------------- | --------------------------------------------- |
| **React Native Docs**        | https://reactnative.dev/docs/getting-started  |
| **Expo Docs**                | https://docs.expo.dev/                        |
| **Material Community Icons** | https://pictogrammers.com/library/mdi/        |
| **Supabase Docs**            | https://supabase.com/docs                     |
| **WCAG 2.1**                 | https://www.w3.org/WAI/WCAG21/quickref/       |
| **Contrast Checker**         | https://webaim.org/resources/contrastchecker/ |

---

### 10.2 Comandos Úteis

```bash
# Iniciar app
npm start

# Build Android (EAS)
eas build --platform android --profile preview

# Build iOS (EAS)
eas build --platform ios --profile preview

# Validar código
npm run type-check
npm run lint
npm run test

# Gerar build de produção
eas build --platform all --profile production
```

---

## 📝 Conclusão

Este documento serve como **fonte única de verdade** para integração de designs Figma no app Nossa Maternidade (React Native + Expo).

**Principais pontos:**

- ✅ **2 temas completos:** Bubblegum (acolhedor) + Serene Dawn (premium)
- ✅ **Tokens bem definidos:** cores, tipografia, espaçamento, sombras
- ✅ **Componentes base + premium**
- ✅ **Acessibilidade WCAG 2.1 AA obrigatória**
- ✅ **Performance mobile-first**
- ✅ **Público classe C-D priorizado**

**Próximos passos:**

1. Revisar tokens ao receber novos designs do Figma
2. Implementar componentes seguindo este guia
3. Testar em iOS + Android + Dark Mode
4. Validar acessibilidade
5. Deploy via EAS Build

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0  
**Mantido por:** LionNath (Cursor AI)
