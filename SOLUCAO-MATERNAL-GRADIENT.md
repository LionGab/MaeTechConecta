# Solução: Classe .maternal-gradient não estava definida

## 🔴 Problema Identificado

A classe `.maternal-gradient` estava sendo usada no HTML, mas **não estava definida** no CSS, resultando em:
- `background-image: none`
- `background-color: rgba(0, 0, 0, 0)` (transparente)
- Elemento sem gradiente visível

## ✅ Solução Implementada

### 1. Adicionado ao `globals.css` (Tailwind CSS)

A classe foi adicionada na camada `@layer utilities`:

```css
.maternal-gradient {
  background-image: linear-gradient(
    135deg,
    hsl(var(--background)) 0%,
    hsl(30 15% 96%) 25%,
    hsl(346 45% 95%) 50%,
    hsl(200 35% 93%) 75%,
    hsl(var(--secondary)) 100%
  );
  background-size: 200% 200%;
  background-position: 0% 50%;
  background-attachment: fixed;
}
```

### 2. Criado `maternal-gradient.css` (CSS Puro)

Arquivo separado para projetos que não usam Tailwind CSS.

## 📋 Classes Disponíveis

### `.maternal-gradient` (Principal)
- Gradiente diagonal 135deg
- Cores do tema Bubblegum (rosa → azul)
- `background-attachment: fixed` (fixo no scroll)

### `.maternal-gradient-vertical`
- Gradiente vertical (topo → baixo)
- Mais sutil

### `.maternal-gradient-radial`
- Gradiente radial (circular do centro)
- Efeito suave com opacidade

### `.maternal-gradient-soft`
- Gradiente muito sutil
- Quase imperceptível, apenas nuance

### `.maternal-gradient-animated`
- Gradiente com animação suave
- Movimento contínuo de 15s

### `.maternal-gradient-hsl`
- Versão usando HSL puro
- Compatível com variáveis CSS

## 🎯 Como Usar

### Com Tailwind CSS:

```html
<!-- Importar globals.css -->
<link rel="stylesheet" href="globals.css">

<!-- Usar a classe -->
<div class="min-h-screen maternal-gradient">
  <!-- Conteúdo -->
</div>
```

### Sem Tailwind CSS (CSS Puro):

```html
<!-- Importar maternal-gradient.css -->
<link rel="stylesheet" href="maternal-gradient.css">

<!-- Usar a classe -->
<div class="min-h-screen maternal-gradient">
  <!-- Conteúdo -->
</div>
```

### Com React/Next.js:

```jsx
// Importar CSS global
import './globals.css';

// Ou importar específico
import './maternal-gradient.css';

// Usar no componente
<div className="min-h-screen maternal-gradient">
  {/* Conteúdo */}
</div>
```

## 🔍 Verificação

Após aplicar a solução, verifique no DevTools:

1. **Computed Styles:**
   - ✅ `background-image` deve mostrar `linear-gradient(...)`
   - ✅ `background-color` deve ter um fallback (não transparente)

2. **Console:**
   ```javascript
   // Verificar se a classe existe
   const el = document.querySelector('.maternal-gradient');
   const styles = window.getComputedStyle(el);
   console.log('background-image:', styles.backgroundImage);
   // Deve mostrar: "linear-gradient(135deg, ...)"
   ```

3. **Visual:**
   - ✅ Deve ver um gradiente suave de rosa para azul
   - ✅ Gradiente deve cobrir toda a área do elemento

## 🎨 Cores do Gradiente

O gradiente usa as cores do tema Bubblegum:

- **Início:** `#F0E7F0` (Rosa muito claro - background)
- **Meio:** Tons intermediários de rosa e azul pastel
- **Fim:** `#B8D8E8` (Azul calma - secondary)

## 📱 Responsividade

- Em mobile: `background-attachment: scroll` (melhor performance)
- Em print: Gradiente removido (background branco)

## 🐛 Troubleshooting

### Problema: Gradiente ainda não aparece

1. **Verificar se o CSS está carregado:**
   ```javascript
   // No console
   Array.from(document.styleSheets).forEach(sheet => {
     try {
       Array.from(sheet.cssRules).forEach(rule => {
         if (rule.selectorText && rule.selectorText.includes('.maternal-gradient')) {
           console.log('✅ Encontrado:', rule.cssText);
         }
       });
     } catch(e) {}
   });
   ```

2. **Verificar se não há override:**
   ```javascript
   const el = document.querySelector('.maternal-gradient');
   const styles = window.getComputedStyle(el);
   console.log('Computed styles:', {
     backgroundImage: styles.backgroundImage,
     backgroundColor: styles.backgroundColor,
   });
   ```

3. **Verificar ordem de importação:**
   - O CSS deve ser importado **antes** de qualquer CSS que possa sobrescrever
   - Se usando Tailwind, garantir que está no `@layer utilities`

### Problema: Gradiente muito sutil

Use uma variação mais marcada:
- `.maternal-gradient` (padrão)
- `.maternal-gradient-animated` (mais dinâmico)
- Ajustar manualmente as cores no CSS

### Problema: Performance em mobile

O `background-attachment: fixed` pode causar problemas em mobile. A solução já remove isso em `@media (max-width: 768px)`.

## 📚 Referências

- [MDN: linear-gradient()](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient)
- [Tailwind CSS: Custom Utilities](https://tailwindcss.com/docs/adding-custom-styles#using-css-and-layer)
- [CSS Background Attachment](https://developer.mozilla.org/en-US/docs/Web/CSS/background-attachment)

