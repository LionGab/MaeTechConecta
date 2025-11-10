# Prompt: Implementação Incremental de Melhorias – App Nossa Maternidade

## Contexto

Projeto React Native/Expo com Chat IA, telas monolíticas e ausência de testes. Urgência em otimizar performance, organização e cobertura de testes.

## Objetivo

Refatorar o Chat para:

- Reduzir re-renders e melhorar fluidez em listas grandes.
- Separar responsabilidades em componentes/hook.
- Fortalecer testabilidade, documentação e acessibilidade.

---

## **Tarefa (1.1) – Otimizar ChatScreen.tsx (Quick Wins)**

### Problemas:

- Muitos acessos repetidos ao AsyncStorage no mesmo componente.
- Re-renders desnecessários.
- Estado do chat fragmentado.
- Tudo em um único arquivo, sem isolamento.

### Plano de Ação:

1. **Componentizar mensagem**
   - Criar `src/components/chat/MessageItem.tsx` usando `React.memo()`.
   - Props: `message` e `onPress`.

2. **Event Handlers Memoizados**
   - Todos os handlers expostos para filhos com `useCallback`.

3. **Consolidar estado global do chat**
   - Trocar múltiplos estados isolados por `useReducer` em um hook: `hooks/useChatOptimized.ts`.
   - Actions: adicionar mensagem, início/fim carregamento, erro IA etc.

4. **Otimizar renderização da lista**
   - Trocar por `<FlatList />` configurada (`keyExtractor`, `windowSize`, etc.)
   - Scroll liso mesmo para 100+ mensagens.

5. **Memoizar histórico da IA**
   - Usar `useMemo` para o array de mensagens a serem enviadas, recalculando só se necessário.

### Exemplo Base:

```typescript
// components/chat/MessageItem.tsx
export const MessageItem = React.memo<MessageItemProps>(({ message, onPress }) => (
  <TouchableOpacity onPress={() => onPress?.(message)} accessibilityLabel={`Mensagem de ${message.role}`}>
    <Text>{message.content}</Text>
  </TouchableOpacity>
));

// hooks/useChatOptimized.ts
export function useChatOptimized() {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const sendMessage = useCallback(async (content: string) => {
    dispatch({ type: 'ADD_MESSAGE', payload: { content, role: 'user' } });
    // lógica de IA...
  }, []);
  const aiHistory = useMemo(() => /* extrai ultimas mensagens */, [state.messages]);
  return { messages: state.messages, sendMessage, aiHistory };
}
```

### Critérios de sucesso:

- [ ] Redução comprovada de 50%+ nos re-renders (React DevTools Profiler).
- [ ] Scroll suave na lista com 100+ mensagens.
- [ ] Testes unitários para hook `useChatOptimized`.

---

> Pronto para ser executado via Composer ou passo-a-passo, garantindo melhoria real no código!

Se quiser, posso também salvar este prompt como arquivo `.cursor/prompts/refactor-chat-quickwin.md` para consulta e uso recorrente no time, ou já criar a arquitetura inicial dos arquivos!

