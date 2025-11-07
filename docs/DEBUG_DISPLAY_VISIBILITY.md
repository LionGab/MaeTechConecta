# 🔍 Guia de Diagnóstico: Display e Visibilidade

## 📋 Checklist de Verificação

Quando você não encontra erros óbvios, mas algo não está funcionando como esperado, use este checklist:

### 1. Verificar Display e Visibilidade

```typescript
// ✅ Verificar se o componente está renderizando
console.log('Componente renderizado:', componentName);

// ✅ Verificar estilos aplicados
console.log('Estilos:', StyleSheet.flatten(style));

// ✅ Verificar se está dentro do viewport
console.log('Dimensões:', { width, height });
```

### 2. Verificar Console do Navegador

#### No Chrome DevTools:

1. Abra DevTools (F12)
2. Vá para a aba **Console**
3. Procure por:
   - ❌ Erros (vermelho)
   - ⚠️ Warnings (amarelo)
   - ℹ️ Info (azul)

#### Erros Comuns:

- `Cannot read property 'X' of undefined`
- `TypeError: ...`
- `Warning: Cannot update during render`
- `Warning: Each child in a list should have a unique key`

### 3. Verificar Network Tab

1. Abra DevTools (F12)
2. Vá para a aba **Network**
3. Verifique:
   - ❌ Requisições falhadas (vermelho)
   - ⚠️ Requisições lentas (>1s)
   - ❌ Assets não carregados (404)

### 4. Verificar React DevTools

Se estiver usando React Native Web:

1. Instale React DevTools
2. Verifique:
   - Componentes renderizando
   - Props sendo passadas corretamente
   - Estado atualizado

### 5. Verificar Elementos Sobrepostos

```typescript
// Verificar z-index
const styles = StyleSheet.create({
  overlay: {
    zIndex: 9999, // Alto para ficar acima
  },
  content: {
    zIndex: 1, // Baixo para ficar abaixo
  },
});
```

### 6. Verificar Overflow

```typescript
// Verificar se conteúdo está sendo cortado
const styles = StyleSheet.create({
  container: {
    overflow: 'visible', // ou 'hidden', 'scroll'
  },
});
```

### 7. Verificar Position

```typescript
// Verificar se elemento está fora da tela
const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: -1000, // ❌ Fora da tela
    left: -1000, // ❌ Fora da tela
  },
});
```

---

## 🐛 Problemas Comuns e Soluções

### Problema 1: Elemento Não Aparece

**Possíveis Causas:**

- `display: none` ou `visibility: hidden`
- `opacity: 0`
- `position: absolute` fora da tela
- `z-index` muito baixo
- `overflow: hidden` cortando conteúdo

**Solução:**

```typescript
// Verificar estilos
const styles = StyleSheet.create({
  visible: {
    display: 'flex', // ✅
    visibility: 'visible', // ✅
    opacity: 1, // ✅
    position: 'relative', // ✅
    zIndex: 1, // ✅
    overflow: 'visible', // ✅
  },
});
```

### Problema 2: Elemento Sobreposto

**Possíveis Causas:**

- `z-index` muito baixo
- Elemento renderizado depois no DOM
- `position: absolute` sem z-index

**Solução:**

```typescript
const styles = StyleSheet.create({
  onTop: {
    zIndex: 9999, // ✅ Alto
    position: 'relative', // ou 'absolute'
  },
});
```

### Problema 3: Layout Quebrado

**Possíveis Causas:**

- `flex: 1` faltando em container
- Dimensões fixas muito pequenas
- `flexDirection` incorreto

**Solução:**

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1, // ✅ Ocupa espaço disponível
    flexDirection: 'column', // ✅ ou 'row'
  },
  item: {
    flex: 1, // ✅ Distribui espaço igualmente
  },
});
```

### Problema 4: Texto Cortado

**Possíveis Causas:**

- `numberOfLines` muito baixo
- `overflow: hidden` sem `ellipsizeMode`
- Altura fixa muito pequena

**Solução:**

```typescript
<Text
  numberOfLines={2} // ✅ Limita linhas
  ellipsizeMode="tail" // ✅ Adiciona "..."
  style={{ flexShrink: 1 }} // ✅ Permite encolher
>
  {text}
</Text>
```

### Problema 5: Imagens Não Carregam

**Possíveis Causas:**

- Caminho incorreto
- Formato não suportado
- Tamanho muito grande

**Solução:**

```typescript
// Verificar caminho
<Image
  source={require('@/assets/image.png')} // ✅ Caminho correto
  style={{ width: 100, height: 100 }} // ✅ Dimensões definidas
  resizeMode="contain" // ✅ Ajusta ao container
/>
```

---

## 🔧 Ferramentas de Debug

### 1. React Native Debugger

```bash
# Instalar
npm install -g react-native-debugger

# Usar
react-native-debugger
```

### 2. Flipper

```bash
# Instalar
npm install -g flipper

# Usar
flipper
```

### 3. Console Logs

```typescript
// Adicionar logs estratégicos
console.log('🔍 Debug:', {
  component: 'ComponentName',
  props: props,
  state: state,
  styles: styles,
});
```

### 4. Breakpoints

```typescript
// Adicionar breakpoints no código
debugger; // Pausa execução aqui

// Ou usar console.log
console.log('📍 Breakpoint:', variable);
```

---

## 📊 Verificação de Performance

### 1. Verificar Re-renders

```typescript
// Adicionar log para ver re-renders
useEffect(() => {
  console.log('🔄 Component re-rendered');
});
```

### 2. Verificar Memória

```typescript
// Verificar uso de memória
console.log('💾 Memory:', performance.memory);
```

### 3. Verificar FPS

```typescript
// Verificar FPS (React Native)
import { InteractionManager } from 'react-native';

InteractionManager.runAfterInteractions(() => {
  console.log('⚡ Interactions complete');
});
```

---

## ✅ Checklist Rápido

Antes de reportar um problema, verifique:

- [ ] Console do navegador (F12)
- [ ] Network tab (requisições falhadas)
- [ ] React DevTools (componentes renderizando)
- [ ] Estilos aplicados (DevTools → Elements → Styles)
- [ ] Dimensões do elemento (width, height)
- [ ] Position e z-index
- [ ] Overflow e clipping
- [ ] Opacity e visibility
- [ ] Display (flex, none, block)

---

## 🎯 Próximos Passos

Se ainda não encontrar o problema:

1. **Descreva o comportamento esperado vs. atual**
2. **Forneça screenshots ou vídeo**
3. **Compartilhe logs do console**
4. **Informe passos para reproduzir**
5. **Mencione navegador e versão**

---

**💡 Dica:** Use o modo de desenvolvimento (`__DEV__`) para logs detalhados e ferramentas de debug.
