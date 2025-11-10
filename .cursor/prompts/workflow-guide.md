# Guia Completo de Produtividade com Cursor.AI

---

## 1. Templates por Tipo de Tarefa

### Criar Novo Componente

````typescript
Create [ComponentName] in src/components/:

**Purpose:** [Breve descrição do componente]

**Props Interface:**
interface [ComponentName]Props {
  [prop1]: [type]; // [descrição]
  [prop2]: [type]; // [descrição]
}

**Functionality:**
- [Feature 1]
- [Feature 2]

**Styling:**
- Usar Design System de @theme/colors.ts
- Seguir padrões de @components/Button.tsx
- Suportar [variants]: [lista]

**Accessibility:**
- accessibilityRole: [role]
- accessibilityLabel nos elementos interativos
- Área mínima de toque: 44x44px

**Tests:** Criar [ComponentName].test.tsx com:
- Teste de renderização
- Testes de interação
- Teste de validação de props

**Example Usage:**
```tsx
<[ComponentName] prop1={value1} prop2={value2} />
````

````

### Refatoração
```typescript
Refactor @[file.ts] to improve [aspect]:

**Current Problems:**
1. [Problema 1]
2. [Problema 2]

**Proposed Solution:**
- [Abordagem/Solução]

**Breaking Changes:**
- [ ] None - manter compatibilidade
- [ ] Yes - [descrever + migration guide]

**Steps:**
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

**Validation:**
- [ ] TypeScript compila
- [ ] Tests rodam
- [ ] Sem novos warnings do ESLint

**Rollback Plan:**  Se der problema: [como reverter?]
````

### Bug Fix

```typescript
Fix bug in @[file.ts]:

**Bug Description:**
[O que está quebrado]

**Reproduction:**
1. [Etapa 1]
2. [Etapa 2]
Expected: [X]
Actual: [Y]

**Root Cause:**
[Por que acontece?]

**Solution:**
[Como consertar]

**Edge Cases to Handle:**
- [Caso 1]
- [Caso 2]

**Testing:**
- Teste que reproduz o bug
- Verifique se a correção resolve
- Checar impactos colaterais

**Related Code:**
@[outro-arquivo.ts] pode ser impactado
```

### Otimização de Performance

```typescript
Optimize performance of @[component.tsx]:

**Current Metrics:**
- Render time: [X]ms
- Re-renders per interaction: [N]
- Memory usage: [X]MB

**Target Metrics:**
- Render time: <[Y]ms
- Re-renders per interaction: <[M]
- Memory usage: <[Y]MB

**Profiling Data:**  [React DevTools Profiler: dados atuais]

**Optimization Strategy:**
1. [Técnica] - Esperado: [ganho]
2. [Técnica] - Esperado: [ganho]

**Implementation:**
- React.memo em: [componentes]
- useCallback em: [funções]
- useMemo em: [computações]
- Virtualização: [listas]

**Validation:**
- Profiling antes e depois
- Teste com grande volume (100+ itens)
- Não pode quebrar nenhuma funcionalidade
```

---

## 2. Uso de @mentions

- `@file.ts` – arquivo específico
- `@Codebase` – todo o projeto
- `@Folder` – pasta inteira
- `@Docs` – documentação
- `@Git` – diff de commit
- `@Web` – pesquisa externa

### Exemplos de Estratégias:

- **Contextualização Progressiva**
  ```typescript
  @Codebase Where is user profile data stored?
  @src/hooks/useUserProfile.ts Explain how this hook works
  @useUserProfile.ts @UserRepository.ts Refactor hook to use repository pattern
  ```
- **Comparação de Padrões**
  ```typescript
  @Button.tsx @Input.tsx @Card.tsx
  Analyze common patterns in these components.
  Create a base component that extracts shared logic.
  ```
- **Validação de Consistência**
  ```typescript
  @src/theme/colors.ts @HomeScreen.tsx @ChatScreen.tsx
  Find all hardcoded colors not using theme system.
  Generate list of files to fix.
  ```

---

## 3. Workflows Otimizados

### 3.1 Feature Completa

Planeje no chat, implemente com Composer, refine com Inline Edit, gere e ajuste testes, documente, valide.

### 3.2 Bug Fix Rápido

Identifique (chat) → Confirme (chat) → Corrija (inline) → Teste (chat) → Previna (inline).

### 3.3 Refatoração Massiva

Avalie padrões com chat, planeje abordagem, execulte multi-arquivo com Composer, valide impactos.

### 3.4 Code Review

Peça para o chat revisar commits focando em: qualidade, bugs, performance e segurança.

---

## 4. Atalhos Essenciais

| Ação              | Mac             | Windows          | Uso               |
| ----------------- | --------------- | ---------------- | ----------------- |
| Inline Edit       | Cmd+K           | Ctrl+K           | Editar seleção    |
| Chat              | Cmd+L           | Ctrl+L           | Abrir chat        |
| Composer          | Cmd+I           | Ctrl+I           | Multi-file edit   |
| Accept Suggestion | Tab             | Tab              | Autocomplete      |
| Reject Suggestion | Esc             | Esc              | Rejeitar sugestão |
| Próxima Sugestão  | Cmd+→           | Ctrl+→           | Sugerir próxima   |
| Apply All         | Cmd+Shift+Enter | Ctrl+Shift+Enter | Aplicar todas     |
| Terminal          | Cmd+J           | Ctrl+J           | Toggle terminal   |

---

## 5. Troubleshooting e Boas Práticas

- Use prompts sempre específicos (nível 3 ou 4)
- Combine IA's para pesquisa, arquitetura e criatividade
- Checklist: código compila, testes passam, padrões seguidos, documentação atualizada
- Use e mantenha `.cursor/rules/` e `.cursor/prompts/`

---

## 6. Dominei Cursor.AI?

```typescript
✅ Conheço modos (Edit, Chat, Composer, Autocomplete)
✅ Uso @mentions sempre que possível
✅ Prompts sempre claros e iterativos
✅ Workflow: planejo (Chat), implemento (Composer), refino (Inline Edit), valido (Test e Chat)
✅ Sempre reviso código e testo antes de commit
```

---

**Para dúvidas ou otimização do seu workflow, consulte este arquivo!**

