# 🎨 Como Preencher o Tema v0.app

## 📋 Passo a Passo

### 1. Acessar o Design do v0.app

1. **Acesse o link:**
   - https://v0.app/chat/duplicate-of-nossa-maternidade-app-ScMbww6iS8W

2. **Abra DevTools:**
   - Pressione `F12` no navegador
   - Vá na aba "Elements" ou "Inspector"

3. **Selecione elementos:**
   - Clique em elementos do design
   - Veja as cores CSS no painel direito
   - Copie valores hex/rgb

### 2. Extrair Cores

**Cores principais a extrair:**

- Background colors
- Primary color (cor principal)
- Secondary color
- Text colors (foreground)
- Border colors
- Card colors
- Input colors
- Accent colors
- Destructive colors
- Sidebar colors
- Chart colors

### 3. Preencher o Arquivo

**Arquivo:** `src/theme/themes/v0-app.ts`

**Substitua os valores `TODO` pelas cores reais:**

```typescript
export const v0AppLight = {
  // Backgrounds
  background: '#FFFFFF', // TODO: Substituir por cor real
  foreground: '#0A0A0A', // TODO: Substituir por cor real
  
  // Cards
  card: '#FAFAFA', // TODO: Substituir por cor real
  cardForeground: '#0A0A0A',
  
  // Primary (cor principal do v0.app)
  primary: '#0070F3', // TODO: Substituir por cor primária real
  primaryForeground: '#FFFFFF',
  
  // Secondary
  secondary: '#F1F3F5', // TODO: Substituir por cor secundária real
  secondaryForeground: '#0A0A0A',
  
  // ... preencher todas as cores
};
```

### 4. Verificar

Após preencher:

1. **Testar tema:**
   ```typescript
   const { setThemeName } = useTheme();
   setThemeName('v0-app');
   ```

2. **Verificar cores:**
   - Todas as cores devem aparecer corretamente
   - Verificar contraste (WCAG 2.1 AA)
   - Ajustar se necessário

## 🎯 Estrutura de Cores

O arquivo `src/theme/themes/v0-app.ts` tem esta estrutura:

```typescript
export const v0AppLight = {
  // Backgrounds
  background: string,
  foreground: string,
  
  // Cards
  card: string,
  cardForeground: string,
  
  // Popover
  popover: string,
  popoverForeground: string,
  
  // Primary
  primary: string,
  primaryForeground: string,
  
  // Secondary
  secondary: string,
  secondaryForeground: string,
  
  // Muted
  muted: string,
  mutedForeground: string,
  
  // Accent
  accent: string,
  accentForeground: string,
  
  // Destructive
  destructive: string,
  destructiveForeground: string,
  
  // Border
  border: string,
  input: string,
  ring: string,
  
  // Sidebar
  sidebar: string,
  sidebarForeground: string,
  sidebarPrimary: string,
  sidebarPrimaryForeground: string,
  sidebarAccent: string,
  sidebarAccentForeground: string,
  sidebarBorder: string,
  sidebarRing: string,
  
  // Charts
  chart1: string,
  chart2: string,
  chart3: string,
  chart4: string,
  chart5: string,
};
```

**Repita para `v0AppDark` também!**

## ✅ Checklist

- [ ] Acessar link do v0.app
- [ ] Extrair cores do design
- [ ] Preencher `v0AppLight` em `src/theme/themes/v0-app.ts`
- [ ] Preencher `v0AppDark` em `src/theme/themes/v0-app.ts`
- [ ] Testar tema v0.app
- [ ] Verificar contraste de cores
- [ ] Ajustar se necessário

---

**Status:** ⚠️ Aguardando preenchimento das cores do v0.app

