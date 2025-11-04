# ✅ Tema v0.app - Integração Completa

**Status:** ✅ Estrutura criada | ⚠️ Cores precisam ser preenchidas

## 📋 O Que Foi Criado

### 1. Sistema de Temas Múltiplos ✅

**Arquivos criados:**

- `src/theme/themes/v0-app.ts` - Tema v0.app (estrutura pronta)
- `src/theme/themes/index.ts` - Sistema de gerenciamento de temas
- `src/components/ThemeSelector.tsx` - Componente para selecionar tema

**Arquivos atualizados:**

- `src/contexts/ThemeContext.tsx` - Suporte a múltiplos temas

### 2. Funcionalidades

- ✅ Suporte a múltiplos temas (Bubblegum e v0.app)
- ✅ Troca de tema em tempo real
- ✅ Persistência de preferência de tema
- ✅ Componente ThemeSelector para UI
- ✅ Compatibilidade com código existente

## 🎯 Como Usar

### Mudar Tema Programaticamente

```typescript
import { useTheme } from '@/contexts/ThemeContext';

const MyComponent = () => {
  const { themeName, setThemeName, colors } = useTheme();

  // Mudar para tema v0.app
  const switchToV0App = () => {
    setThemeName('v0-app');
  };

  // Usar cores do tema atual
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.foreground }}>Texto</Text>
    </View>
  );
};
```

### Usar Componente de Seleção

```typescript
import { ThemeSelector } from '@/components/ThemeSelector';

const SettingsScreen = () => {
  return (
    <ScrollView>
      <ThemeSelector />
    </ScrollView>
  );
};
```

## ⚠️ IMPORTANTE: Preencher Cores

O tema v0.app está criado mas **precisa das cores reais** do design do v0.app.

### O Que Fazer

1. **Acesse o link:**
   - https://v0.app/chat/duplicate-of-nossa-maternidade-app-ScMbww6iS8W

2. **Extraia as cores:**
   - Use DevTools do navegador (F12)
   - Ou ferramentas de extração de cores
   - Copie valores hex/rgb

3. **Atualize o arquivo:**
   - `src/theme/themes/v0-app.ts`
   - Substitua todos os `TODO` pelas cores reais

### Estrutura de Cores a Preencher

```typescript
// src/theme/themes/v0-app.ts

export const v0AppLight = {
  background: '#FFFFFF', // TODO: Substituir por cor real
  foreground: '#0A0A0A', // TODO: Substituir por cor real
  primary: '#0070F3', // TODO: Substituir por cor primária real
  // ... preencher todas as cores
};
```

## 📚 Documentação

- **Guia completo:** `docs/TEMA_V0_APP.md`
- **Resumo:** `REFATORACAO_TEMA_V0_APP.md`

## ✅ Checklist

- [x] Sistema de temas múltiplos criado
- [x] Tema v0.app criado (estrutura)
- [x] ThemeContext atualizado
- [x] Componente ThemeSelector criado
- [ ] **Cores do v0.app extraídas e preenchidas** ⚠️
- [ ] Componentes testados com novo tema
- [ ] Ajustes de cores se necessário

---

**Próximo passo:** Preencher cores do v0.app em `src/theme/themes/v0-app.ts`
