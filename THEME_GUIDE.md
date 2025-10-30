# 🎨 Guia de Tema Bubblegum - Nossa Maternidade

## 📖 Introdução

O tema Bubblegum foi integrado ao projeto com um **Design System centralizado** em `src/theme/colors.ts`. Todas as cores, tipografia, espaçamento e sombras são controladas de um único lugar.

## 🎯 Como Usar

### 1. Importar o Tema

```typescript
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
```

### 2. Usar as Cores

```typescript
// Backgrounds
backgroundColor: colors.background      // Rosa muito claro (#F0E7F0)

// Texto
color: colors.foreground               // Preto (#121212)

// Cards/Containers
backgroundColor: colors.card           // Bege claro (#F2F1E8)

// Destaques (primária)
backgroundColor: colors.primary        // Rosa vibrante (#DD5B9A)
color: colors.primaryForeground        // Branco (#FFFFFF)

// Secundária (azul pastel)
backgroundColor: colors.secondary      // Azul (#B8D8E8)

// Avisos/Erros
backgroundColor: colors.destructive    // Vermelho (#D65152)

// Muted (textos secundários)
color: colors.mutedForeground         // Cinza (#696969)
```

### 3. Usar Espaçamento

```typescript
// Padrão: xs(4) → sm(8) → md(12) → lg(16) → xl(20) → 2xl(24) → 3xl(32)
padding: spacing.lg          // 16px
marginBottom: spacing.md     // 12px
paddingHorizontal: spacing.xl // 20px
```

### 4. Usar Border Radius

```typescript
// Padrão: sm(4) → md(8) → lg(12) → xl(16) → full(999)
borderRadius: borderRadius.md    // 8px
borderRadius: borderRadius.full  // 999px (circular)
```

### 5. Usar Tipografia

```typescript
// Tamanhos: xs(12) → sm(14) → base(16) → lg(18) → xl(20) → 2xl(24) → 3xl(28) → 4xl(32)
fontSize: typography.sizes.base       // 16px
fontSize: typography.sizes['2xl']     // 24px

// Pesos: normal(400) → medium(500) → semibold(600) → bold(700)
fontWeight: typography.weights.bold

// Famílias: 'Poppins', 'Lora', 'Fira Code'
fontFamily: typography.fontFamily.sans
```

### 6. Usar Sombras

```typescript
// Opções: xs, sm, md, lg
...shadows.light.sm   // Sombra pequena
...shadows.light.md   // Sombra média
...shadows.light.lg   // Sombra grande

// Em componentes:
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.light.md,  // Spread operator adiciona shadow + elevation
  }
});
```

## 📊 Paleta de Cores

### Light Mode (Padrão)
| Uso | Cor | Hex |
|-----|-----|-----|
| Background | Rosa claro | #F0E7F0 |
| Card | Bege claro | #F2F1E8 |
| Primary | Rosa vibrante | #DD5B9A |
| Secondary | Azul pastel | #B8D8E8 |
| Accent | Amarelo | #EDD8B1 |
| Text | Preto | #121212 |
| Text Muted | Cinza | #696969 |

### Dark Mode
(Disponível via `dark` export, mas app atual usa apenas light mode)

## 🔄 Mudança de Tema (Futuro)

Para adicionar suporte a Dark Mode no futuro:

```typescript
import { getTheme } from '../theme/colors';

// Em seu componente:
const isDark = useColorScheme() === 'dark';
const currentColors = getTheme(isDark);

const styles = StyleSheet.create({
  container: {
    backgroundColor: currentColors.background,
  }
});
```

## ✅ Exemplo Completo

```typescript
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Componente</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Pressione-me</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold as any,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.light.md,
  },
  buttonText: {
    color: colors.primaryForeground,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold as any,
  },
});

export default MyComponent;
```

## 📝 Checklist para Novos Componentes

- [ ] Importar `{ colors, spacing, borderRadius, typography, shadows }`
- [ ] Usar `colors.*` para todos as cores (nunca hex hardcoded)
- [ ] Usar `spacing.*` para padding/margin (nunca números hardcoded)
- [ ] Usar `borderRadius.*` para cantos arredondados
- [ ] Usar `typography.sizes` para fontSize
- [ ] Usar `typography.weights` para fontWeight
- [ ] Usar `shadows.light.*` para sombras
- [ ] Usar `as any` para fontWeight em TypeScript

## 🎨 Cores Disponíveis

```typescript
// Primárias
colors.primary              // Rosa vibrante (#DD5B9A)
colors.primaryForeground    // Branco (#FFFFFF)

// Backgrounds
colors.background           // Rosa claro (#F0E7F0)
colors.card                 // Bege (#F2F1E8)
colors.popover              // Branco (#FFFFFF)

// Tipografia
colors.foreground           // Preto (#121212)
colors.mutedForeground      // Cinza (#696969)

// Secundária
colors.secondary            // Azul (#B8D8E8)
colors.secondaryForeground  // Preto escuro (#1A1A1A)

// Muted
colors.muted                // Cinza claro (#E1E5EC)
colors.mutedForeground      // Cinza (#696969)

// Accent
colors.accent               // Amarelo (#EDD8B1)
colors.accentForeground     // Preto (#1A1A1A)

// Estados
colors.destructive          // Vermelho (#D65152)
colors.destructiveForeground// Branco (#FFFFFF)
colors.border               // Rosa (#DD5B9A)
colors.input                // Branco com rosa (#F5F1F5)
colors.ring                 // Rosa escuro (#D94A7B)

// Sidebar (para futuros componentes)
colors.sidebar              // Rosa (#F0D9F0)
colors.sidebarPrimary       // Rosa avermelhado (#E44B7A)
colors.sidebarAccent        // Rosa claro (#D8A5C8)
```

## 🔧 Espaçamento

```typescript
spacing.xs    // 4px
spacing.sm    // 8px
spacing.md    // 12px
spacing.lg    // 16px
spacing.xl    // 20px
spacing.2xl   // 24px
spacing.3xl   // 32px
```

## 🎭 Border Radius

```typescript
borderRadius.sm     // 4px
borderRadius.md     // 8px
borderRadius.lg     // 12px
borderRadius.xl     // 16px
borderRadius.full   // 999px (circular)
```

## 📐 Tipografia

### Tamanhos
```typescript
typography.sizes.xs     // 12px (labels, small text)
typography.sizes.sm     // 14px (body text)
typography.sizes.base   // 16px (default)
typography.sizes.lg     // 18px (headings)
typography.sizes.xl     // 20px (large headings)
typography.sizes.2xl    // 24px (very large)
typography.sizes.3xl    // 28px (titles)
typography.sizes.4xl    // 32px (page titles)
```

### Pesos
```typescript
typography.weights.normal      // 400
typography.weights.medium      // 500
typography.weights.semibold    // 600
typography.weights.bold        // 700
```

## 💡 Dicas

1. **Nunca use cores hardcoded** - sempre use o objeto `colors`
2. **Evite `as any`** - exceto para `fontWeight` onde é necessário
3. **Use spread operator** para sombras: `...shadows.light.md`
4. **Sempre use spacing systemático** - não use números arbitrários
5. **Para futuros temas**, use `getTheme(isDark)` ao invés de mudar todo código

## 🚀 Próximos Passos

- [ ] Adicionar suporte a Dark Mode (usar `useColorScheme()`)
- [ ] Criar componentes reutilizáveis (Button, Card, Input)
- [ ] Adicionar animações e transições
- [ ] Criar uma biblioteca de componentes estilizados

---

**Criado em:** 29/10/2025
**Versão:** 1.0.0
**Tema:** Bubblegum (OKLCH Color Space)
