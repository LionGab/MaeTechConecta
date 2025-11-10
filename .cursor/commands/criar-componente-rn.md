# Comando: Criar Componente React Native

Crie um componente React Native seguindo todas as regras do .cursorrules e os padrões do projeto.

## Requisitos Obrigatórios

### 1. TypeScript com Tipos Explícitos

- Sempre usar tipos explícitos (evitar `any`)
- Preferir `interfaces` sobre `type` para objetos
- Props tipadas com interface exportada
- Usar `React.FC<PropsInterface>` ou tipagem explícita
- Sem type assertions desnecessárias (`as`, `!`)

### 2. Performance e Otimização

- Usar `React.memo` quando o componente é puro e renderiza frequentemente
- Usar `useCallback` para handlers passados como props
- Usar `useMemo` para computações pesadas ou objetos/arrays recriados
- Avaliar necessidade caso a caso (não aplicar cegamente)

### 3. Acessibilidade (WCAG 2.1 AA)

- **Obrigatório**: `accessibilityLabel` descritivo em elementos interativos
- `accessibilityRole` correto (button, text, header, etc.)
- `accessibilityHint` quando a ação não é óbvia
- `accessibilityState` para estados (disabled, selected, etc.)
- Área de toque mínima: **44x44px** (iOS) / **48dp** (Android)
- Contraste: 4.5:1+ (texto normal), 3:1+ (texto grande)
- `accessibilityLiveRegion` para mudanças dinâmicas importantes

### 4. Estilização Mobile-First

#### Importar Tema (Padrão do Projeto)

```typescript
import { colors, spacing, typography, borderRadius, shadows } from '@/theme/colors';
```

**OU** usar `useTheme()` quando necessário reagir a mudanças de tema:

```typescript
import { useTheme } from '@/contexts/ThemeContext';
const { theme } = useTheme();
```

#### Regras de Estilo

- **SEMPRE** usar `StyleSheet.create()` para estilos
- **NUNCA** usar cores hardcoded - sempre usar `colors.*` do tema
- Usar `spacing`, `typography`, `borderRadius` do tema
- Dark mode: suporte automático via tema (cores adaptam automaticamente)
- Usar `SafeAreaView` quando necessário (iOS notches, Android status bar)
- Mobile-first design (otimizar para mobile, depois tablet)

### 5. Haptic Feedback (Opcional)

```typescript
// Haptics é opcional - só funciona se expo-haptics estiver instalado
let Haptics: any = null;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  // expo-haptics não disponível, ignorar
}

// No handler:
try {
  if (Haptics && Haptics.impactAsync) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle?.Light || 1);
  }
} catch (e) {
  // expo-haptics não disponível, ignorar
}
```

### 6. Estrutura de Arquivo

1. **Imports** (ordenados: React → RN → Expo → Externos → Internos)
2. **Interfaces/Types** exportadas
3. **Componente** principal exportado
4. **Helpers/utilities** (funções auxiliares)
5. **Styles** (StyleSheet.create)
6. **JSDoc** obrigatório para componentes públicos

### 7. Exemplo Completo

```typescript
import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@/theme/colors';

// Haptics é opcional
let Haptics: any = null;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  // expo-haptics não disponível
}

/**
 * ComponentName - Descrição do componente
 *
 * Componente acessível e responsivo seguindo WCAG 2.1 AA.
 *
 * @example
 * <ComponentName
 *   title="Título"
 *   onPress={handlePress}
 *   accessibilityLabel="Ação do componente"
 * />
 */
export interface ComponentNameProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Título do componente */
  title: string;
  /** Handler do evento de toque */
  onPress: () => void;
  /** Prop opcional */
  variant?: 'primary' | 'secondary';
  /** Estilo customizado */
  style?: ViewStyle;
  /** Label de acessibilidade (obrigatório) */
  accessibilityLabel: string;
  /** Hint de acessibilidade */
  accessibilityHint?: string;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  accessibilityLabel,
  accessibilityHint,
  ...touchableProps
}) => {
  const handlePress = useCallback((event: any) => {
    // Haptic feedback opcional
    try {
      if (Haptics && Haptics.impactAsync) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle?.Light || 1);
      }
    } catch (e) {
      // Ignorar se não disponível
    }

    onPress();
  }, [onPress]);

  const containerStyle = [
    styles.base,
    styles[`${variant}Container`],
    style,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      activeOpacity={0.85}
      {...touchableProps}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    minHeight: 44, // iOS touch target mínimo
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryContainer: {
    backgroundColor: colors.primary,
    ...shadows.light.md,
  },
  secondaryContainer: {
    backgroundColor: colors.secondary,
    ...shadows.light.sm,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold as any,
    fontFamily: typography.fontFamily.sans,
    color: colors.primaryForeground,
  },
});
```

## Checklist Final

### TypeScript

- [ ] Tipos explícitos (sem `any` desnecessário)
- [ ] Interface exportada para props
- [ ] `React.FC<PropsInterface>` usado
- [ ] Sem type assertions desnecessárias

### Performance

- [ ] `React.memo` usado quando apropriado
- [ ] `useCallback` para handlers passados como props
- [ ] `useMemo` para computações pesadas (quando necessário)

### Acessibilidade

- [ ] `accessibilityLabel` presente e descritivo
- [ ] `accessibilityRole` correto
- [ ] `accessibilityHint` quando necessário
- [ ] `accessibilityState` para estados dinâmicos
- [ ] Área de toque mínima: 44x44px
- [ ] Contraste adequado (via tema)

### Estilização

- [ ] `StyleSheet.create()` usado
- [ ] Tema importado de `@/theme/colors` (ou `useTheme()` quando necessário)
- [ ] **NUNCA** cores hardcoded - sempre `colors.*`
- [ ] `spacing`, `typography`, `borderRadius` do tema
- [ ] Dark mode suportado automaticamente
- [ ] `SafeAreaView` quando necessário
- [ ] Mobile-first design

### Estrutura

- [ ] JSDoc completo com exemplos
- [ ] Estrutura: imports → interfaces → componente → helpers → styles
- [ ] Imports organizados
- [ ] Haptic feedback opcional (se aplicável)

## Instruções para o Cursor

Crie o componente seguindo **TODOS** os requisitos acima.

1. **Siga os padrões do projeto**: Importe de `@/theme/colors` (não use `useTheme()` a menos que necessário)
2. **Acessibilidade é obrigatória**: Sempre inclua `accessibilityLabel` em elementos interativos
3. **Performance com critério**: Use `React.memo`, `useCallback`, `useMemo` quando fizer sentido, não automaticamente
4. **Cores sempre do tema**: Nunca use cores hardcoded como `#FF0000` ou `'red'`
5. **Se algo não for aplicável**, explique o motivo no código

**Referências**: Ver componentes em `src/components/` (Button.tsx, Card.tsx) como exemplos do padrão do projeto.
