# 🎨 Instruções para Assets - Nossa Maternidade

## 📱 Ícones e Imagens Necessárias

### 1. Logo Principal (Recomendado)
Baseado nas imagens fornecidas, você pode usar qualquer uma das seguintes ilustrações como logo:

- **Opção 1**: Mulher jovem com rosto sorridente (cabelo castanho longo, blusa vermelha, tatuagem de rosa)
- **Opção 2**: Mãe segurando bebê adormecido
- **Opção 3**: Mãe com bebê e cachorrinho
- **Opção 4**: Mãe segurando bebê enrolado em pano branco

### 2. Arquivos de Imagem Necessários

#### `assets/icon.png` (1024x1024px)
- Ícone principal do app
- Deve ter fundo transparente ou circular
- Sugestão: Logo da mulher jovem ou mãe com bebê

#### `assets/splash.png` (1284x2778px)
- Tela de splash/loading inicial
- Fundo rosa suave (#FFE5F1)
- Logo centralizado
- Texto: "Nossa Maternidade"

#### `assets/adaptive-icon.png` (1024x1024px)
- Ícone adaptativo para Android
- Versão alternativa do ícone principal
- Deve funcionar bem em diferentes temas

#### `assets/favicon.png` (48x48px ou 512x512px)
- Favicon para versão web
- Versão pequena do logo

## 🖼️ Como Adicionar os Assets

### Método 1: Download das Imagens Fornecidas
1. Salve as imagens fornecidas
2. Redimensione conforme especificado acima
3. Coloque na pasta `assets/`

### Método 2: Gerar com Ferramentas Online
Use ferramentas como:
- [Expo Asset Generator](https://www.npmjs.com/package/expo-asset-generator)
- [App Icon Generator](https://www.appicon.co/)
- [Icon Generator](https://icon.kitchen/)

### Método 3: Usar DALL-E 3 (Já Configurado)
Você pode usar o app para gerar versões customizadas:

```typescript
import { generateImage } from '../services/contentGenerator';

const logoUrl = await generateImage(
  'logo circular de uma jovem mãe brasileira sorrindo, estilo cartoon, cores rosa e azul claro, fundo branco'
);
```

## 🎨 Paleta de Cores do App

Use estas cores ao criar assets:

```css
/* Cores principais */
Rosa Vibrante: #E91E63
Rosa Suave: #FFE5F1
Rosa Médio: #FFB6D4

/* Cores secundárias */
Azul Suave: #87CEEB
Branco: #FFFFFF
Cinza: #666666

/* Cores de emergência */
Vermelho: #e74c3c
```

## 📋 Checklist de Assets

- [ ] `assets/icon.png` - 1024x1024
- [ ] `assets/splash.png` - 1284x2778
- [ ] `assets/adaptive-icon.png` - 1024x1024
- [ ] `assets/favicon.png` - 48x48

## 🚀 Após Adicionar os Assets

1. Execute o comando para atualizar os assets:
```bash
npx expo start --clear
```

2. Os assets serão carregados automaticamente no app

## 💡 Dicas de Design

1. **Logo**: Use ilustração feminina, acolhedora e empática
2. **Cores**: Combine rosa suave com detalhes em rosa vibrante
3. **Estilo**: Cartoon brasileiro, moderno e acessível
4. **Emojis**: Pode usar emojis na versão texto como placeholder
5. **Simplicidade**: Designs simples ficam melhor em tamanhos pequenos

## 🎭 Versão Placeholder

Atualmente, o app usa um componente `Logo.tsx` que cria um logo placeholder em SVG/View. Quando você adicionar as imagens reais, o logo será substituído automaticamente.

## 📞 Precisa de Ajuda?

Consulte:
- [Expo Asset Docs](https://docs.expo.dev/guides/assets/)
- [React Native Image Docs](https://reactnative.dev/docs/image)

---

**Status**: Componente de logo criado ✅  
**Próximo**: Adicionar arquivos de imagem reais

