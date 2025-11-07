# Regras Tailwind CSS v4.0 - Guia Completo para Agentes

## ⚠️ IMPORTANTE: Este projeto usa React Native, NÃO Tailwind CSS
**NÃO aplicar estas regras no projeto atual.** Este documento serve apenas como referência para projetos web futuros que usem Tailwind CSS v4.

---

## 🎯 Mudanças Críticas da v3 → v4

### 1. Configuração Agora é em CSS (NÃO mais JavaScript)

❌ **ANTES (v3 - tailwind.config.js):**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6'
      }
    }
  }
}
```

✅ **AGORA (v4 - CSS com @theme):**
```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --font-display: "Satoshi", sans-serif;
  --breakpoint-3xl: 1920px;
  --spacing-18: 4.5rem;
}
```

**Regra para Agentes:**
- **NUNCA** criar ou modificar `tailwind.config.js` em projetos v4
- **SEMPRE** usar `@theme` no arquivo CSS principal
- Variáveis CSS customizadas seguem padrão: `--{categoria}-{nome}: {valor}`

---

### 2. Sistema de Cores OKLCH (Nova Paleta Padrão)

✅ **Definir cores com OKLCH:**
```css
@theme {
  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-500: oklch(0.70 0.15 120);
  --color-avocado-900: oklch(0.30 0.15 120);
}
```

**Benefícios:**
- Cores mais vibrantes e consistentes
- Melhor uniformidade perceptual
- Suporte nativo no CSS moderno

**Regra para Agentes:**
- **PREFERIR** OKLCH ao definir cores customizadas
- Hex e RGB ainda funcionam, mas OKLCH é recomendado
- Formato OKLCH: `oklch(luminosidade croma matiz)`

---

### 3. Utilitários de Opacidade Removidos

❌ **NÃO usar mais:**
```html
<div class="bg-black text-opacity-50">
<div class="bg-opacity-75 bg-blue-500">
```

✅ **USAR modificadores de barra:**
```html
<div class="bg-black/50">
<div class="bg-blue-500/75">
<div class="text-gray-900/60">
```

**Regra para Agentes:**
- **NUNCA** usar `text-opacity-*`, `bg-opacity-*`, `border-opacity-*`
- **SEMPRE** usar sintaxe `/` para opacidade: `{utility}-{color}/{opacity}`

---

### 4. Espaçamento: `space-*` → `gap-*`

❌ **NÃO usar mais:**
```html
<div class="flex space-x-4">
<div class="flex flex-col space-y-2">
```

✅ **USAR gap:**
```html
<div class="flex gap-x-4">
<div class="flex flex-col gap-y-2">
<div class="flex gap-4"> <!-- equivalente a space-x-4 e space-y-4 -->
```

**Regra para Agentes:**
- **SUBSTITUIR** `space-x-*` por `gap-x-*`
- **SUBSTITUIR** `space-y-*` por `gap-y-*`
- `gap-*` funciona melhor com Flexbox e Grid

---

### 5. Sombras Renomeadas

❌ **ANTES (v3):**
```html
<div class="shadow">
<div class="shadow-sm">
<div class="shadow-lg">
```

✅ **AGORA (v4):**
```html
<div class="shadow-xs">  <!-- era "shadow" ou "shadow-sm" -->
<div class="shadow-sm">  <!-- novo tamanho -->
<div class="shadow-xl">  <!-- era "shadow-lg" -->
```

**Mapeamento completo:**
- `shadow` → `shadow-xs`
- `shadow-sm` → `shadow-xs` (removido)
- `shadow-md` → `shadow-sm`
- `shadow-lg` → `shadow-xl`
- `shadow-xl` → `shadow-2xl`

**Regra para Agentes:**
- **VERIFICAR** mapeamento de sombras ao migrar
- Usar ferramenta de upgrade: `npx @tailwindcss/upgrade@next`

---

### 6. Cor de Borda Padrão Mudou

⚠️ **MUDANÇA COMPORTAMENTAL:**

**v3:** `border` aplicava cor cinza padrão
**v4:** `border` herda `currentColor` (cor do texto)

❌ **Problema:**
```html
<div class="border"> <!-- Antes: cinza / Agora: cor do texto -->
```

✅ **Solução explícita:**
```html
<div class="border border-gray-300"> <!-- Especificar cor -->
<div class="border border-current">  <!-- Explícito: usar cor do texto -->
```

**Regra para Agentes:**
- **SEMPRE** especificar cor da borda quando usar `border`
- Não assumir cor cinza padrão
- Testar visualmente componentes com bordas

---

### 7. Plugins Agora São Importados no CSS

❌ **ANTES (v3 - tailwind.config.js):**
```javascript
module.exports = {
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
```

✅ **AGORA (v4 - CSS):**
```css
@import "tailwindcss";
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";
```

**Regra para Agentes:**
- **NUNCA** adicionar plugins em `tailwind.config.js`
- **SEMPRE** usar `@plugin` no CSS
- Ordem importa: plugins depois de `@import "tailwindcss"`

---

### 8. Detecção Automática de Conteúdo

✅ **v4 detecta automaticamente:**
- Arquivos de template (`.html`, `.jsx`, `.tsx`, `.vue`, etc)
- Respeita `.gitignore` por padrão
- Não precisa configurar `content: []`

❌ **NÃO configurar manualmente em v4:**
```javascript
// NÃO necessário em v4
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}']
}
```

**Regra para Agentes:**
- **REMOVER** configuração `content` ao migrar para v4
- Confiar na detecção automática
- Se necessário, usar `.gitignore` para excluir pastas

---

### 9. Variáveis CSS Nativas Expostas

✅ **v4 expõe tokens de tema como CSS vars:**
```css
/* Tokens de tema ficam disponíveis como: */
:root {
  --spacing-4: 1rem;
  --color-blue-500: #3b82f6;
  --font-sans: ui-sans-serif, system-ui;
}
```

**Uso em CSS customizado:**
```css
.custom-component {
  padding: var(--spacing-4);
  color: var(--color-blue-500);
  font-family: var(--font-sans);
}
```

**Regra para Agentes:**
- **USAR** variáveis CSS do Tailwind em estilos customizados
- Manter consistência com o sistema de design
- Acessar tokens via `var(--{categoria}-{nome})`

---

## 🚀 Migração de Projeto v3 → v4

### Ferramenta Oficial de Upgrade

```bash
npx @tailwindcss/upgrade@next
```

**O que ela faz:**
- Converte `tailwind.config.js` para `@theme` no CSS
- Substitui utilitários obsoletos (`space-*`, `*-opacity-*`)
- Atualiza sombras (`shadow` → `shadow-xs`)
- Migra plugins para `@plugin`
- Gera relatório de mudanças

**Regra para Agentes:**
- **SEMPRE** sugerir ferramenta de upgrade primeiro
- Revisar mudanças automatizadas manualmente
- Testar app completo após migração

---

## 📋 Checklist de Validação (Pós-Migração)

### Antes de Aprovar Mudanças:

- [ ] ✅ `tailwind.config.js` removido ou vazio
- [ ] ✅ `@theme` definido no CSS principal
- [ ] ✅ Plugins migrados para `@plugin`
- [ ] ✅ Nenhum uso de `*-opacity-*`
- [ ] ✅ `space-x/y-*` substituído por `gap-x/y-*`
- [ ] ✅ Sombras atualizadas (shadow → shadow-xs)
- [ ] ✅ Bordas com cores explícitas
- [ ] ✅ Build funciona sem erros
- [ ] ✅ Testes visuais passam
- [ ] ✅ Dark mode funciona (se aplicável)

---

## 🎨 Exemplo Completo de Projeto v4

### Estrutura de Arquivos

```
src/
├── styles/
│   └── globals.css          # Configuração principal
├── components/
│   └── Button.tsx
└── app/
    └── page.tsx
```

### globals.css

```css
@import "tailwindcss";

/* Tema customizado */
@theme {
  /* Cores */
  --color-brand-50: oklch(0.98 0.02 250);
  --color-brand-500: oklch(0.60 0.20 250);
  --color-brand-900: oklch(0.30 0.15 250);
  
  /* Tipografia */
  --font-display: "Inter", sans-serif;
  --font-body: "Roboto", sans-serif;
  
  /* Espaçamento */
  --spacing-18: 4.5rem;
  --spacing-22: 5.5rem;
  
  /* Breakpoints */
  --breakpoint-3xl: 1920px;
  --breakpoint-4xl: 2560px;
  
  /* Bordas */
  --radius-large: 1rem;
  --radius-xl: 1.5rem;
}

/* Plugins */
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";

/* Estilos globais */
body {
  font-family: var(--font-body);
}

h1, h2, h3 {
  font-family: var(--font-display);
}
```

### Button.tsx (Exemplo de Componente)

```tsx
/**
 * Button Component - Tailwind CSS v4
 */
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ 
  variant = 'primary', 
  children,
  onClick 
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 rounded-lg font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${variant === 'primary' 
          ? 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500' 
          : 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500'
        }
      `}
    >
      {children}
    </button>
  );
}
```

### page.tsx (Exemplo de Uso)

```tsx
import { Button } from '@/components/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100">
      <div className="container mx-auto px-4 py-12">
        
        {/* Card com sombra corrigida */}
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tailwind CSS v4
          </h1>
          
          {/* Flex com gap (não space-x) */}
          <div className="flex gap-4 mb-8">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
          </div>
          
          {/* Texto com opacidade corrigida */}
          <p className="text-gray-600/80 mb-6">
            Usando modificador de barra para opacidade
          </p>
          
          {/* Grid com gap */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-brand-500/10 p-4 rounded-lg border border-brand-500/20">
              Card 1
            </div>
            <div className="bg-brand-500/10 p-4 rounded-lg border border-brand-500/20">
              Card 2
            </div>
            <div className="bg-brand-500/10 p-4 rounded-lg border border-brand-500/20">
              Card 3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🚨 Erros Comuns e Como Evitar

### 1. Tentar Usar tailwind.config.js

❌ **Erro:**
```javascript
// tailwind.config.js
module.exports = {
  theme: { /* ... */ }
}
```

✅ **Correção:**
```css
/* globals.css */
@theme {
  /* configuração aqui */
}
```

### 2. Usar Utilitários Obsoletos

❌ **Erro:**
```html
<div class="bg-opacity-50 space-x-4">
```

✅ **Correção:**
```html
<div class="bg-black/50 gap-x-4">
```

### 3. Assumir Cor de Borda Padrão

❌ **Erro:**
```html
<div class="border"> <!-- Cor inesperada -->
```

✅ **Correção:**
```html
<div class="border border-gray-300"> <!-- Cor explícita -->
```

### 4. Plugins no Lugar Errado

❌ **Erro:**
```javascript
// tailwind.config.js
plugins: [require('@tailwindcss/forms')]
```

✅ **Correção:**
```css
/* globals.css */
@plugin "@tailwindcss/forms";
```

---

## 📚 Recursos Oficiais

- **Documentação:** [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Blog de Lançamento:** [tailwindcss.com/blog/tailwindcss-v4](https://tailwindcss.com/blog/tailwindcss-v4)
- **Upgrade Tool:** [github.com/tailwindlabs/tailwindcss-upgrade](https://github.com/tailwindlabs/tailwindcss-upgrade)
- **Playground v4:** [play.tailwindcss.com](https://play.tailwindcss.com)

---

## ✅ Resumo para Agentes (TL;DR)

**v4 Mudanças Críticas:**
1. Configuração em CSS via `@theme` (não JS)
2. `space-*` → `gap-*`
3. `*-opacity-*` → `{utility}/{opacity}`
4. `shadow` → `shadow-xs`
5. Borda padrão agora é `currentColor`
6. Plugins via `@plugin` no CSS
7. Cores OKLCH recomendadas
8. Detecção automática de conteúdo

**Comandos Úteis:**
```bash
# Migração automática
npx @tailwindcss/upgrade@next

# Instalação v4
npm install tailwindcss@next @tailwindcss/postcss@next
```

**Sempre:**
- ✅ Usar `@theme` para configuração
- ✅ Especificar cor de borda explicitamente
- ✅ Preferir `gap-*` sobre `space-*`
- ✅ Usar modificadores `/` para opacidade
- ✅ Rodar ferramenta de upgrade antes de migração manual

**Nunca:**
- ❌ Criar `tailwind.config.js` em v4
- ❌ Usar `*-opacity-*` utilitários
- ❌ Usar `space-x-*` ou `space-y-*`
- ❌ Assumir cor cinza para bordas sem classe de cor
- ❌ Configurar plugins em JavaScript

---

**Última Atualização:** Janeiro 2025
**Versão Tailwind CSS:** 4.0+

