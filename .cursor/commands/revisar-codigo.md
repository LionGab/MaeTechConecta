# Comando: Revisar Código

Revise o código seguindo todos os padrões do projeto e .cursorrules:

## Checklist de Revisão

### 1. TypeScript

- [ ] Sem tipos `any` desnecessários
- [ ] Interfaces usadas ao invés de `type` quando apropriado
- [ ] Sem type assertions desnecessárias (`as`, `!`)
- [ ] Tipos explícitos em funções e variáveis
- [ ] Props tipadas corretamente

### 2. Performance

- [ ] `React.memo` usado em componentes puros
- [ ] `useCallback` usado para handlers passados como props
- [ ] `useMemo` usado para computações pesadas
- [ ] FlatList otimizada (windowSize={10}, maxToRenderPerBatch={10})
- [ ] Lazy loading de screens no TabNavigator
- [ ] Sem re-renders desnecessários
- [ ] Imagens otimizadas (expo-image)

### 3. Acessibilidade (WCAG 2.1 AA)

- [ ] `accessibilityLabel` descritivo presente
- [ ] `accessibilityRole` correto
- [ ] `accessibilityHint` quando necessário
- [ ] Área de toque mínima: 44x44px (iOS) / 48dp (Android)
- [ ] Contraste adequado (4.5:1+ texto normal, 3:1+ texto grande)
- [ ] `accessibilityLiveRegion` para mudanças dinâmicas

### 4. Estilização

- [ ] `StyleSheet.create()` usado (não objetos inline desnecessários)
- [ ] Tema usado (colors, spacing, typography) - sem cores hardcoded
- [ ] Dark mode suportado automaticamente
- [ ] SafeAreaView usado quando necessário
- [ ] Mobile-first design

### 5. Estrutura e Organização

- [ ] Estrutura correta: componente → helpers → tipos
- [ ] Imports organizados (React → RN → Expo → Externos → Internos)
- [ ] JSDoc presente em componentes públicos
- [ ] Código limpo e legível
- [ ] Sem código duplicado

### 6. Tratamento de Erros

- [ ] Try-catch em operações assíncronas
- [ ] Logs descritivos para debug
- [ ] Feedback visual para o usuário
- [ ] ErrorBoundary quando apropriado

### 7. Padrões do Projeto

- [ ] Segue .cursorrules
- [ ] Nomenclatura correta (PascalCase componentes, camelCase funções)
- [ ] Named exports quando apropriado
- [ ] Programação funcional (evitar classes)

### 8. Testes

- [ ] Testes criados para componentes críticos
- [ ] Coverage adequado (objetivo: 70%+)

## Sugestões de Melhoria

Após a revisão, forneça:

1. **Bugs encontrados** (com severidade: Crítico, Alto, Médio, Baixo)
2. **Code smells** (complexidade, acoplamento, etc.)
3. **Violações de estilo** (pontos específicos)
4. **Problemas de performance** (sugestões de otimização)
5. **Problemas de acessibilidade** (itens faltantes ou incorretos)
6. **Melhorias sugeridas** (refatorações, otimizações)

## Formato de Resposta

```
## Revisão de Código

### ✅ Pontos Positivos
- Item 1
- Item 2

### ⚠️ Problemas Encontrados

#### Crítico
- [Severidade: Crítico] Descrição do problema
  - Arquivo: caminho/do/arquivo.tsx
  - Linha: X
  - Correção sugerida: ...

#### Alto
- [Severidade: Alto] Descrição do problema
  - ...

#### Médio
- [Severidade: Médio] Descrição do problema
  - ...

#### Baixo
- [Severidade: Baixo] Descrição do problema
  - ...

### 💡 Sugestões de Melhoria
- Sugestão 1
- Sugestão 2

### 📊 Score Geral
- TypeScript: X/10
- Performance: X/10
- Acessibilidade: X/10
- Estilização: X/10
- Estrutura: X/10
- **Total: X/50**
```

## Instruções para o Cursor

Revise o código seguindo TODOS os itens do checklist. Seja específico e forneça correções concretas. Não seja genérico - forneça exemplos de código quando apropriado.

