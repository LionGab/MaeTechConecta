# Nath Theme System - Usage Guide

## Design Identity: "Mae Guerreira"
Emotional design system that transforms pain into strength, providing warmth and care.

## Theme Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | #FFF8F3 | Warm, welcoming background |
| `card` | #FFFFFF | Clean neutral cards |
| `primary` | #6DA9E4 | Comforting blue |
| `primarySoft` | #DCEBFA | Soft blue (chips/highlights) |
| `accent` | #FF8BA3 | Emotional pink detail |
| `text` | #6A5450 | Warm brown (main text) |
| `textMuted` | #9E928C | Warm gray (supporting text) |
| `border` | #EFE7E2 | Soft dividers |
| `success` | #6BC3A3 | Care/progress green |

## Import Methods

### Method 1: Direct Theme Import
```typescript
import { nathTheme } from '@/theme';

const MyComponent = () => (
  <View style={{ backgroundColor: nathTheme.colors.bg }}>
    <Text style={{ color: nathTheme.colors.text }}>Hello</Text>
  </View>
);
```

### Method 2: makeStyles Hook (Recommended)
```typescript
import { makeStyles } from '@/theme';

const MyComponent = () => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text
  }
}));
```

### Method 3: useThemeStyles Hook (Inline)
```typescript
import { useThemeStyles } from '@/theme';
// OR
import useThemeStyles from '@/shared/hooks/useThemeStyles';

const MyComponent = () => {
  const t = useThemeStyles();

  return (
    <View style={{
      backgroundColor: t.color('bg'),
      padding: t.space('md'),
      borderRadius: t.radius('sm')
    }}>
      <Text style={{
        ...t.text('h1'),
        color: t.color('text')
      }}>
        Hello
      </Text>
    </View>
  );
};
```

## Design Tokens

### Spacing
- `xs: 4px` - Minimal spacing
- `sm: 8px` - Small spacing
- `md: 16px` - Standard spacing (most common)
- `lg: 24px` - Large spacing
- `xl: 32px` - Extra large spacing
- `xxl: 40px` - Maximum spacing

### Border Radius
- `sm: 12px` - Small corners (buttons, inputs)
- `md: 18px` - Medium corners (cards)
- `lg: 26px` - Large corners (large cards)
- `pill: 999px` - Pill shape (badges, tags)

### Typography
```typescript
h1: { fontSize: 22, fontWeight: "600", lineHeight: 28 }
h2: { fontSize: 18, fontWeight: "600", lineHeight: 24 }
body: { fontSize: 16, fontWeight: "400", lineHeight: 22 }
sub: { fontSize: 15, fontWeight: "500", lineHeight: 20, opacity: 0.85 }
```

### Shadow
```typescript
card: {
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3
}
```

## Complete Example

```typescript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { makeStyles } from '@/theme';

export const WelcomeCard = () => {
  const styles = useStyles();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Bem-vinda, Mae Guerreira</Text>
      <Text style={styles.subtitle}>Sua jornada importa</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    ...theme.shadow.card
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.sm,
    alignItems: 'center'
  },
  buttonText: {
    ...theme.typography.h2,
    color: theme.colors.card
  }
}));
```

## Migration from Old Theme

### Before (Old Bubblegum Theme)
```typescript
import { colors } from '@/theme';

<View style={{ backgroundColor: colors.primary }}>
```

### After (New Nath Theme)
```typescript
import { nathTheme } from '@/theme';

<View style={{ backgroundColor: nathTheme.colors.primary }}>
```

## Files Structure

```
src/
  theme/
    nathTheme.ts           # Main theme definition
    index.ts               # Export hub
  shared/
    hooks/
      useThemeStyles.ts    # Standalone hook
```

## Type Safety

All theme tokens are fully typed:

```typescript
// Type-safe color access
const color: string = nathTheme.colors.primary; // OK
const invalid = nathTheme.colors.invalid; // Error: Property 'invalid' does not exist

// Type-safe spacing
const space: number = nathTheme.spacing.md; // OK

// Type-safe radius
const radius: number = nathTheme.radius.sm; // OK
```
