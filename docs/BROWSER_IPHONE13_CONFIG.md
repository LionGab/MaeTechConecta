# 📱 Configuração do Browser Integrado - iPhone 13

**Browser integrado do Cursor configurado para iPhone 13 (390x844) com formato mobile garantido**

---

## ✅ Configurações Aplicadas

### 1. Browser Integrado do Cursor

#### `.cursor/settings.json`

```json
{
  "cursor.browser.enabled": true,
  "cursor.browser.headless": false,
  "cursor.browser.viewport": {
    "width": 390,
    "height": 844,
    "deviceScaleFactor": 3,
    "isMobile": true,
    "hasTouch": true
  },
  "cursor.browser.userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
}
```

#### `.cursor/composer-config.json`

```json
{
  "browser": {
    "viewport": {
      "width": 390,
      "height": 844,
      "isMobile": true,
      "deviceScaleFactor": 3,
      "hasTouch": true,
      "isLandscape": false
    },
    "devices": {
      "iphone13": {
        "width": 390,
        "height": 844,
        "deviceScaleFactor": 3,
        "isMobile": true,
        "hasTouch": true
      }
    }
  }
}
```

### 2. Configuração do App Expo

#### `apps/mobile/app.config.js`

```javascript
web: {
  favicon: './assets/favicon.png',
  bundler: 'metro',
  meta: {
    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'theme-color': '#FFE5F1',
  },
}
```

---

## 📐 Especificações do iPhone 13

- **Resolução**: 390 × 844 pixels
- **Device Scale Factor**: 3x (Retina)
- **Orientação**: Portrait (padrão)
- **Touch**: Habilitado
- **User Agent**: iPhone iOS 17 Safari
- **isMobile**: true
- **hasTouch**: true

---

## 🚀 Como Usar

### Abrir Browser Integrado

**Opção 1: Atalho de Teclado**

```
Ctrl+Shift+B
```

**Opção 2: Command Palette**

```
Ctrl+Shift+P → cursor.browser.open
```

**Opção 3: Via Composer**

```
Ctrl+I → "Abra o browser e teste o app em formato mobile"
```

### Verificar Viewport

O browser abrirá automaticamente com:

- Viewport de 390x844 (iPhone 13)
- User Agent do iPhone iOS 17
- Touch habilitado
- Formato mobile garantido

---

## ✅ Garantias de Formato Mobile

### 1. Viewport do Browser

- ✅ Configurado para 390x844 (iPhone 13)
- ✅ Device Scale Factor: 3x
- ✅ isMobile: true
- ✅ hasTouch: true

### 2. Meta Tags do App

- ✅ `width=device-width` - Usa largura do dispositivo
- ✅ `initial-scale=1.0` - Zoom inicial 100%
- ✅ `maximum-scale=1.0` - Previne zoom
- ✅ `user-scalable=no` - Desabilita zoom manual
- ✅ `viewport-fit=cover` - Cobre toda a tela (notch safe)

### 3. PWA Mobile

- ✅ `mobile-web-app-capable: yes` - App web mobile
- ✅ `apple-mobile-web-app-capable: yes` - iOS PWA
- ✅ `theme-color: #FFE5F1` - Cor do tema

### 4. Orientação

- ✅ `orientation: 'portrait'` - Apenas retrato
- ✅ `isLandscape: false` - Sem landscape

---

## 📝 Arquivos Modificados

1. **`.cursor/settings.json`** - Configurações do browser integrado
2. **`.cursor/composer-config.json`** - Configurações do composer com dispositivo iPhone 13
3. **`apps/mobile/app.config.js`** - Meta tags de viewport mobile
4. **`docs/CURSOR_CONFIGURACOES_OTIMIZADAS.md`** - Documentação atualizada

---

## 🔍 Verificação

Para verificar se está funcionando:

1. Abra o browser integrado (`Ctrl+Shift+B`)
2. Navegue para o app (geralmente `http://localhost:8081` ou porta do Expo)
3. Verifique:
   - Viewport de 390x844
   - Formato mobile (não desktop)
   - Touch habilitado
   - User Agent do iPhone

---

## 📚 Documentação Relacionada

- **Configurações Otimizadas**: `docs/CURSOR_CONFIGURACOES_OTIMIZADAS.md`
- **Melhores Práticas**: `docs/CURSOR_2.0_BEST_PRACTICES.md`
- **Setup Prático**: `docs/CURSOR_2.0_SETUP.md`

---

**Última atualização**: Janeiro 2025  
**Versão**: 1.0.0  
**Dispositivo**: iPhone 13 (390×844)

