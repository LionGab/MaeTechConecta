# Comando: Refatorar para Performance

Refatore o código para melhorar performance seguindo as melhores práticas do React Native:

## Otimizações a Aplicar

### 1. Componentes
- [ ] Adicionar `React.memo` em componentes puros
- [ ] Remover re-renders desnecessários
- [ ] Verificar dependências de hooks (useEffect, useMemo, useCallback)
- [ ] Lazy load componentes pesados

### 2. Hooks
- [ ] Usar `useCallback` para handlers passados como props
- [ ] Usar `useMemo` para computações pesadas
- [ ] Otimizar dependências de hooks
- [ ] Evitar hooks dentro de loops ou condicionais

### 3. FlatList
- [ ] Configurar `windowSize={10}` para reduzir memória
- [ ] Configurar `maxToRenderPerBatch={10}` para renderização inicial
- [ ] Configurar `updateCellsBatchingPeriod={50}` para atualizações suaves
- [ ] Configurar `removeClippedSubviews={true}` para performance
- [ ] Configurar `initialNumToRender={10}` para renderização inicial
- [ ] Usar `getItemLayout` quando possível
- [ ] Otimizar `keyExtractor`
- [ ] Usar `ListEmptyComponent` e `ListFooterComponent` eficientemente

### 4. Navegação
- [ ] Lazy load screens no TabNavigator
- [ ] Usar `React.lazy()` ou imports dinâmicos
- [ ] Otimizar transições de navegação

### 5. Imagens
- [ ] Usar `expo-image` ou `react-native-fast-image`
- [ ] Usar tamanhos apropriados de imagens
- [ ] Usar formatos eficientes (WebP quando possível)
- [ ] Implementar lazy loading de imagens

### 6. Animações
- [ ] Usar `InteractionManager` para adiar tarefas não-críticas após animações
- [ ] Usar `Animated` API do React Native (não JavaScript animations)
- [ ] Otimizar animações com `useNativeDriver: true`

### 7. Debounce/Throttle
- [ ] Debounce handlers de scroll
- [ ] Throttle handlers de input
- [ ] Otimizar pesquisas com debounce

### 8. Memória
- [ ] Limpar subscriptions e listeners
- [ ] Remover timers quando componente desmontar
- [ ] Evitar memory leaks

## Exemplo de FlatList Otimizada

```typescript
const renderItem = useCallback(({ item }: { item: Item }) => (
  <ItemComponent item={item} />
), []);

const keyExtractor = useCallback((item: Item) => item.id, []);

const getItemLayout = useCallback(
  (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }),
  []
);

<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  getItemLayout={getItemLayout}
  windowSize={10}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  removeClippedSubviews={true}
  initialNumToRender={10}
  onEndReachedThreshold={0.5}
/>
```

## Exemplo de Componente Otimizado

```typescript
interface OptimizedComponentProps {
  data: Data[];
  onPress: (id: string) => void;
}

export const OptimizedComponent: React.FC<OptimizedComponentProps> = React.memo(({
  data,
  onPress
}) => {
  const theme = useTheme();

  const handlePress = useCallback((id: string) => {
    onPress(id);
  }, [onPress]);

  const processedData = useMemo(
    () => data.map(item => expensiveOperation(item)),
    [data]
  );

  const styles = useMemo(
    () => StyleSheet.create({
      container: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
      },
    }),
    [theme]
  );

  return (
    <View style={styles.container}>
      {processedData.map(item => (
        <Item key={item.id} data={item} onPress={handlePress} />
      ))}
    </View>
  );
});
```

## Métricas de Performance

Após refatoração, verificar:
- [ ] Redução de re-renders (usar React DevTools Profiler)
- [ ] Melhoria no tempo de renderização
- [ ] Redução no uso de memória
- [ ] Melhoria na performance de scroll (FlatList)
- [ ] Redução no tempo de carregamento inicial

## Checklist Final

- [ ] Todos os componentes otimizados
- [ ] FlatList configurada corretamente
- [ ] Hooks otimizados (useCallback, useMemo)
- [ ] Imagens otimizadas
- [ ] Navegação lazy loaded
- [ ] Sem memory leaks
- [ ] Performance testada
- [ ] Validação passou (`npm run validate`)

## Instruções para o Cursor

1. Analise o código atual
2. Identifique pontos de melhoria de performance
3. Aplique TODAS as otimizações relevantes
4. Mantenha a funcionalidade existente
5. Execute validação após refatoração
6. Documente melhorias aplicadas

## Relatório Final

Após refatoração, forneça:
```
## Refatoração de Performance

### 🔍 Análise Inicial
- Problemas identificados: X
- Componentes afetados: X
- Potencial de melhoria: X%

### ✅ Otimizações Aplicadas
1. React.memo adicionado em X componentes
2. useCallback/useMemo aplicado em X lugares
3. FlatList otimizada em X listas
4. Lazy loading aplicado em X screens
5. Imagens otimizadas: X arquivos

### 📊 Melhorias Esperadas
- Redução de re-renders: X%
- Melhoria no tempo de renderização: X%
- Redução no uso de memória: X%
- Melhoria na performance de scroll: X%

### ⚠️ Observações
- Observação 1
- Observação 2
```

## Instruções para o Cursor

Refatore o código aplicando TODAS as otimizações relevantes. Não quebre funcionalidade existente. Execute validação após refatoração.

