# 🚀 Quick Start - Tema Bubblegum

## ⚡ Começar em 30 segundos

### 1. Copie esta linha para seu componente:

```typescript
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
```

### 2. Use em seus estilos:

```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.light.md,
  }
});
```

### 3. Pronto! 🎉

---

## 📚 Referência Rápida

### Cores Mais Usadas

| Uso | Variável | Cor |
|-----|----------|-----|
| Fundo | `colors.background` | Rosa claro |
| Texto | `colors.foreground` | Preto |
| Botões | `colors.primary` | Rosa vibrante |
| Cartões | `colors.card` | Bege |
| Secundário | `colors.secondary` | Azul pastel |
| Erro | `colors.destructive` | Vermelho |

### Espaçamento Mais Usado

```
padding: spacing.lg        // 16px (padrão)
padding: spacing.md        // 12px (menor)
padding: spacing.xl        // 20px (maior)
marginBottom: spacing.lg   // 16px
```

### Border Radius Mais Usado

```
borderRadius: borderRadius.lg      // 12px (padrão)
borderRadius: borderRadius.full    // 999px (circular)
```

### Tipografia Mais Usada

```
fontSize: typography.sizes.base    // 16px (padrão)
fontSize: typography.sizes.lg      // 18px (títulos)
fontWeight: typography.weights.bold as any  // 700
```

---

## 🎨 Paleta Completa (Cheat Sheet)

```typescript
// COLORS - Use estas variáveis
colors.primary                    // #DD5B9A (rosa vibrante)
colors.primaryForeground         // #FFFFFF (branco)
colors.secondary                 // #B8D8E8 (azul pastel)
colors.secondaryForeground       // #1A1A1A (preto)
colors.background                // #F0E7F0 (rosa claro)
colors.foreground                // #121212 (preto)
colors.card                      // #F2F1E8 (bege)
colors.cardForeground            // #121212 (preto)
colors.accent                    // #EDD8B1 (amarelo)
colors.accentForeground          // #1A1A1A (preto)
colors.muted                     // #E1E5EC (cinza claro)
colors.mutedForeground           // #696969 (cinza)
colors.border                    // #DD5B9A (rosa)
colors.input                     // #F5F1F5 (branco rosa)
colors.ring                      // #D94A7B (rosa escuro)
colors.destructive               // #D65152 (vermelho)
colors.destructiveForeground     // #FFFFFF (branco)

// SPACING - Use estes valores
spacing.xs                       // 4px
spacing.sm                       // 8px
spacing.md                       // 12px
spacing.lg                       // 16px (padrão)
spacing.xl                       // 20px
spacing['2xl']                   // 24px
spacing['3xl']                   // 32px

// BORDER RADIUS
borderRadius.sm                  // 4px
borderRadius.md                  // 8px
borderRadius.lg                  // 12px (padrão)
borderRadius.xl                  // 16px
borderRadius.full                // 999px (circular)

// TYPOGRAPHY
typography.sizes.xs              // 12px (labels)
typography.sizes.sm              // 14px (small text)
typography.sizes.base            // 16px (padrão)
typography.sizes.lg              // 18px (headings)
typography.sizes.xl              // 20px (large)
typography.sizes['2xl']          // 24px (very large)
typography.sizes['3xl']          // 28px (titles)
typography.weights.bold          // 700
typography.weights.semibold      // 600
typography.weights.medium        // 500
typography.weights.normal        // 400

// SHADOWS - Use com spread operator
...shadows.light.xs              // sombra pequena
...shadows.light.sm              // sombra média
...shadows.light.md              // sombra normal (padrão)
...shadows.light.lg              // sombra grande
```

---

## 🔧 Padrões Comuns

### Card Padrão
```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.light.md,
  }
});
```

### Botão Primário
```typescript
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.light.md,
  },
  buttonText: {
    color: colors.primaryForeground,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold as any,
  }
});
```

### Input/TextBox
```typescript
const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    fontSize: typography.sizes.base,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.foreground,
  }
});
```

### Título
```typescript
const styles = StyleSheet.create({
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.primary,
    marginBottom: spacing.lg,
  }
});
```

### Texto Secundário
```typescript
const styles = StyleSheet.create({
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.mutedForeground,
    marginTop: spacing.sm,
  }
});
```

---

## ❌ O QUE NÃO FAZER

```typescript
// ❌ ERRADO - Não use cores hardcoded
backgroundColor: '#FFE5F1'

// ✅ CORRETO - Use variáveis do tema
backgroundColor: colors.background

// ❌ ERRADO - Não use espaçamento aleatório
padding: 15

// ✅ CORRETO - Use o sistema
padding: spacing.lg  // 16px

// ❌ ERRADO - Não use borders hardcoded
borderRadius: 8

// ✅ CORRETO - Use os valores padrão
borderRadius: borderRadius.md

// ❌ ERRADO - Não adicione sombra manualmente
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3,

// ✅ CORRETO - Use spread operator
...shadows.light.md
```

---

## 📂 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `src/theme/colors.ts` | 🎨 Sistema de tema principal |
| `src/theme/index.ts` | 📦 Export central |
| `THEME_GUIDE.md` | 📖 Guia completo |
| `src/components/ThemeShowcase.tsx` | 👁️ Demo visual |

---

## 🎯 Próximos Passos

1. **Visualizar o tema:**
   ```typescript
   // Em App.tsx ou screen qualquer
   import { ThemeShowcase } from './src/components/ThemeShowcase';

   export default function App() {
     return <ThemeShowcase />;
   }
   ```

2. **Criar novo componente:**
   - Copie a importação do tema
   - Use os padrões acima
   - Pronto! 🚀

3. **Adicionar Dark Mode (futuro):**
   ```typescript
   import { getTheme } from '../theme/colors';
   const isDark = useColorScheme() === 'dark';
   const currentColors = getTheme(isDark);
   ```

---

## 💡 Dicas Pro

- **Usar `as any` para fontWeight?** Sim, é necessário em TypeScript com React Native
- **Esquecer a virgula?** Cheque o `...shadows.light.md` - precisa de vírgula antes
- **Cores estranhas?** Abra `src/theme/colors.ts` para ver valores reais
- **Quer mudar a cor primária?** Altere em 1 lugar: `src/theme/colors.ts`

---

## 🆘 Problemas Comuns

### "Module not found: colors"
Cheque o caminho de import:
```typescript
// Se estiver em src/screens/HomeScreen.tsx
import { colors } from '../theme/colors';

// Se estiver em src/components/Button.tsx
import { colors } from '../theme/colors';

// Se estiver em src/components/sub/Input.tsx
import { colors } from '../../theme/colors';
```

### Sombra não aparece no Android
Adicione `elevation` (é automático no shadows.light.*)

### Cor está diferente
Verifique se está usando `colors.primary` e não `#DD5B9A`

---

## 📞 Suporte Rápido

```
Q: Como mudo a cor primária?
A: Altere colors.primary em src/theme/colors.ts

Q: Como adiciono uma nova cor?
A: Adicione em src/theme/colors.ts e exporte

Q: Como faço Dark Mode?
A: Use getTheme(isDark) quando implementar useColorScheme()

Q: Como adiciono uma sombra?
A: Use ...shadows.light.* (já existem 4 níveis)

Q: Posso usar cores customizadas?
A: Sim, mas melhor adicionar em src/theme/colors.ts
```

---

**Versão:** 1.0.0
**Tema:** Bubblegum
**Data:** 29/10/2025

Comece agora! 🚀
