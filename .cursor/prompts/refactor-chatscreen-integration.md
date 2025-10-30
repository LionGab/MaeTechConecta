# Refatoração e Integração Completa: ChatScreen - App Nossa Maternidade

## Contexto

O `ChatScreen.tsx` atual está parcialmente implementado com hook otimizado (`useChatOptimized`), mas falta:
1. Integração com serviços reais (API de IA, Supabase)
2. Input de mensagem funcional
3. Ações rápidas (emojis, voz, etc.)
4. Salvamento automático de mensagens no banco
5. Carregamento de histórico ao abrir a tela
6. Tratamento de erros robusto
7. Indicadores de digitação e conexão

## Objetivos

- **Integração 100% funcional** com serviços existentes
- **UI completa** com input e ações rápidas
- **Performance** mantida (hoje já tem FlatList + useReducer)
- **Acessibilidade** completa
- **Testabilidade** facilitada

---

## Passo 1: Integrar Hook useChatOptimized com Serviços Reais

### Estado Atual
```typescript
// hooks/useChatOptimized.ts - linha 46-51
const sendMessage = useCallback(async (content: string) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now(), content, role: 'user' }});
  // TODO: lógica de comunicação com IA...
  dispatch({ type: 'SET_LOADING', payload: false });
}, []);
```

### Ação Necessária
1. Importar funções de `services/ai.ts` e `services/supabase.ts`
2. Carregar perfil do usuário via `useUserProfile` ou `AsyncStorage`
3. Implementar chamada real para `chatWithAI`
4. Salvar mensagens no Supabase após resposta
5. Adicionar tratamento de erros robusto
6. Carregar histórico ao montar componente

### Critérios de Sucesso
- [ ] Mensagens são enviadas para Claude API
- [ ] Respostas aparecem na UI
- [ ] Mensagens são salvas no Supabase automaticamente
- [ ] Histórico carrega ao abrir a tela
- [ ] Erros são tratados graciosamente

---

## Passo 2: Adicionar Input de Mensagem Completo

### Estado Atual
```typescript
// ChatScreen.tsx - linha 67
{/* Campo de input e ações rápidas podem ser reimplementados abaixo ao integrar 100% do fluxo */}
```

### Ação Necessária
1. Criar componente `ChatInput` ou adicionar diretamente no `ChatScreen`
2. Incluir:
   - TextInput multi-linha com placeholder
   - Botão de enviar
   - Botões de ações rápidas (emojis, voz, anexos)
   - Indicador de digitação quando IA responde
3. Integrar com `handleSend` já existente
4. Adicionar validação de mensagem vazia

### Critérios de Sucesso
- [ ] Input aparece na parte inferior da tela
- [ ] Usuário pode digitar e enviar mensagens
- [ ] Botão de enviar desabilita quando mensagem vazia
- [ ] Ações rápidas funcionam (emojis pré-populam, voz abre modal)
- [ ] UI é acessível (labels, hints)

---

## Passo 3: Adicionar Ações Rápidas (Quick Actions)

### Ação Necessária
1. Criar lista de ações rápidas contextuais
2. Exemplos:
   - 🦷 "Enjoo está me incomodando"
   - 💤 "Não consigo dormir"
   - 🍽️ "Receitas para gestantes"
   - 📅 "Próxima consulta"
   - 🚨 "Sintomas preocupantes"
3. Adicionar chips clicáveis acima do input
4. Ao clicar, preencher input e enviar automaticamente
5. Usar `detectUrgency` de `services/ai.ts` para alertas

### Critérios de Sucesso
- [ ] 5+ ações rápidas configuráveis
- [ ] Clicar em ação envia mensagem automaticamente
- [ ] Chips variam conforme contexto (semana de gestação, tipo de usuário)
- [ ] Emergências detectadas mostram alerta

---

## Passo 4: Melhorar UX com Indicadores Visuais

### Ação Necessária
1. Adicionar indicador de "IA está digitando..." quando `loading === true`
2. Botão SOS no header (linha 47) funcional (Alert + link para SAMU)
3. Scroll automático para mensagem mais recente ao enviar
4. Animação de entrada para novas mensagens
5. Pull-to-refresh para recarregar histórico

### Critérios de Sucesso
- [ ] "IA está digitando..." aparece durante loading
- [ ] Botão SOS abre alerta + ligação SAMU
- [ ] Scroll automático funciona
- [ ] Animações são suaves (sem lag)

---

## Passo 5: Otimização Final e Acessibilidade

### Ação Necessária
1. Adicionar `accessibilityLabel` e `accessibilityHint` em todos elementos
2. Suporte a navegação por teclado (web)
3. Feedback de voz ao tocar em ações
4. Dark mode (se não existir)
5. Loading skeletons ao carregar histórico

### Critérios de Sucesso
- [ ] Todos elementos são acessíveis (testar com screen reader)
- [ ] Navegação por teclado funciona
- [ ] Dark mode aplicado corretamente
- [ ] Skeletons aparecem durante carregamento inicial

---

## Passo 6: Adicionar Tratamento de Erros Robusto

### Ação Necessária
1. Try-catch em todas chamadas de API
2. Mostrar mensagens amigáveis ao usuário em caso de erro
3. Retry automático em falhas de rede
4. Logger de erros para debug
5. Fallback para modo offline (mensagens salvas localmente)

### Critérios de Sucesso
- [ ] Erros de API mostram mensagem amigável
- [ ] Retry funciona após falha de rede
- [ ] Mensagens são salvas localmente como backup
- [ ] Logs úteis no console para debug

---

## Checklist de Arquivos para Modificar/Criar

### Modificar:
- [ ] `src/hooks/useChatOptimized.ts` - Integrar com serviços reais
- [ ] `src/screens/ChatScreen.tsx` - Adicionar input e ações
- [ ] `src/components/chat/MessageItem.tsx` - Melhorar estilos e acessibilidade

### Criar (se necessário):
- [ ] `src/components/chat/ChatInput.tsx` - Componente de input
- [ ] `src/components/chat/QuickActions.tsx` - Chips de ações rápidas
- [ ] `src/components/chat/TypingIndicator.tsx` - Indicador de digitação
- [ ] `src/hooks/useChatHistory.ts` - Hook para gerenciar histórico

---

## Notas Técnicas Importantes

- **Não quebrar** a estrutura atual (FlatList + useReducer já estão otimizados)
- **Manter** os imports existentes e seguir padrão do projeto
- **Usar** funções já existentes em `services/ai.ts` e `services/supabase.ts`
- **Seguir** padrão de acessibilidade visto em `HomeScreen.tsx` (accessibilityLabel, accessibilityHint, etc.)
- **Manter** TypeScript strict mode
- **Não adicionar** bibliotecas novas sem necessidade

---

> Pronto para execução via Composer ou manual. Seguir ordem: Passo 1 → 2 → 3 → 4 → 5 → 6, validando cada um antes de avançar.
