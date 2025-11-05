# 📖 Guia Completo de Revisão de Código - Nossa Maternidade

**Como usar o Agente de Revisão de Código no Cursor 2.0**

---

## 🚀 Início Rápido

### Ativação no Cursor 2.0

1. **Abrir Composer**
   - Pressione `Cmd+L` (Mac) ou `Ctrl+L` (Windows/Linux)
   - Ou clique no ícone do Composer na barra lateral

2. **Ativar Modo Agente**
   - Digite `@code-reviewer` ou mencione o agente
   - Ou use comandos diretos de revisão

3. **Executar Revisão**
   - Digite: `Revisar código: {caminho-do-arquivo}`
   - Aguarde análise completa multi-stage

---

## 📋 Exemplos de Uso

### Exemplo 1: Revisão Completa de Arquivo

**Comando:**

```
Revisar código: src/components/Button.tsx
```

**O que acontece:**

1. ✅ Code Inspector analisa bugs, code smells, violações
2. ✅ Test Runner verifica cobertura de testes
3. ✅ Performance Analyzer identifica problemas de performance
4. ✅ Accessibility Checker verifica WCAG 2.1 AA
5. ✅ Fix Suggester gera correções prontas
6. ✅ Explain Diff explica cada mudança

**Resultado:** JSON completo com análise detalhada

---

### Exemplo 2: Revisão Rápida

**Comando:**

```
Revisão rápida: src/screens/ChatScreen.tsx (apenas bugs críticos e alta severidade)
```

**O que acontece:**

- ✅ Foca em bugs severidade 4-5
- ✅ Ignora melhorias de baixa prioridade
- ✅ Retorno mais rápido

**Resultado:** Lista focada de problemas críticos

---

### Exemplo 3: Revisão de Performance

**Comando:**

```
Analisar performance: src/features/content/ContentFeedScreen.tsx
Identificar: re-renders desnecessários, FlatList não otimizada, problemas de memoização
```

**O que acontece:**

- ✅ Analisa re-renders
- ✅ Verifica otimizações de FlatList
- ✅ Sugere uso de memoização
- ✅ Identifica problemas de bundle size

**Resultado:** Relatório de performance com correções sugeridas

---

### Exemplo 4: Revisão de Acessibilidade

**Comando:**

```
Verificar acessibilidade WCAG 2.1 AA: src/components/Button.tsx
```

**O que acontece:**

- ✅ Verifica `accessibilityLabel`
- ✅ Verifica `accessibilityRole`
- ✅ Verifica contraste de cores
- ✅ Verifica área de toque
- ✅ Verifica font scaling

**Resultado:** Relatório de acessibilidade com sugestões

---

### Exemplo 5: Sugestão de Testes

**Comando:**

```
Sugerir testes para: src/hooks/useChatOptimized.ts
Casos: unitários e de integração necessários
```

**O que acontece:**

- ✅ Analisa funções/hooks
- ✅ Identifica casos de teste necessários
- ✅ Sugere estrutura de testes
- ✅ Prioriza testes críticos

**Resultado:** Lista de testes sugeridos com prioridades

---

### Exemplo 6: Aplicar Correções Automáticas

**Comando:**

```
Revisar e aplicar correções automáticas: src/components/Button.tsx
Aplicar apenas: severidade >= 3
```

**O que acontece:**

- ✅ Revisão completa
- ✅ Aplica correções aprovadas
- ✅ Mantém histórico de mudanças
- ✅ Gera diff explicado

**Resultado:** Arquivo corrigido com explicação das mudanças

---

### Exemplo 7: Revisão de Feature Completa

**Comando:**

```
Revisar feature de chat completa:
- src/screens/ChatScreen.tsx
- src/hooks/useChatOptimized.ts
- src/components/chat/MessageItem.tsx
Analisar: bugs, performance, testes, acessibilidade
```

**O que acontece:**

- ✅ Revisão multi-arquivo
- ✅ Análise de dependências
- ✅ Relatório consolidado
- ✅ Priorização de correções

**Resultado:** Relatório completo da feature

---

## 🎯 Pipeline Multi-Stage Detalhado

### STAGE 1: Code Inspector 🔍

**Analisa:**

- Bugs de lógica
- Práticas inseguras
- Code smells
- Violações de estilo

**Retorna:**

```json
{
  "bugs": [...],
  "code_smells": [...],
  "violacoes_estilo": [...]
}
```

---

### STAGE 2: Test Runner 🧪

**Analisa:**

- Cobertura de testes
- Testes faltantes
- Casos de teste necessários

**Retorna:**

```json
{
  "test_coverage": {
    "atual": 45,
    "objetivo": 70
  },
  "testes_faltantes": [...]
}
```

---

### STAGE 3: Performance Analyzer ⚡

**Analisa:**

- Re-renders
- FlatList otimização
- Memoização
- Bundle size

**Retorna:**

```json
{
  "problemas_performance": [...],
  "otimizacoes_sugeridas": [...]
}
```

---

### STAGE 4: Accessibility Checker ♿

**Analisa:**

- WCAG 2.1 AA compliance
- Labels e roles
- Contraste
- Área de toque

**Retorna:**

```json
{
  "problemas_acessibilidade": [...],
  "melhorias_sugeridas": [...]
}
```

---

### STAGE 5: Fix Suggester 🔧

**Gera:**

- Código antes/depois
- Explicação
- Impacto
- Severidade

**Retorna:**

```json
{
  "bugs": [
    {
      "correcao": "código...",
      "explicacao": "..."
    }
  ]
}
```

---

### STAGE 6: Explain Diff 📖

**Explica:**

- O que mudou
- Por que mudou
- Impacto
- Benefícios

**Retorna:** Explicação detalhada em linguagem simples

---

## 📊 Interpretando Resultados

### Severidade de Bugs

1. **Crítico (5)**: Quebra aplicação, segurança crítica
   - ⚠️ **Ação:** Corrigir IMEDIATAMENTE
   - ❌ **Merge:** Bloqueado até correção

2. **Alto (4)**: Funcionalidade quebrada, performance grave
   - ⚠️ **Ação:** Corrigir antes do merge
   - ⚠️ **Merge:** Requer aprovação

3. **Médio (3)**: Bug não crítico, code smell
   - 📝 **Ação:** Corrigir na próxima sprint
   - ✅ **Merge:** Permitido com nota

4. **Baixo (2)**: Melhoria sugerida, otimização
   - 💡 **Ação:** Considerar para backlog
   - ✅ **Merge:** Permitido

5. **Info (1)**: Sugestão de estilo, documentação
   - 📚 **Ação:** Opcional
   - ✅ **Merge:** Permitido

---

### Veredito Final

**Status Possíveis:**

- ✅ `aprovado` - Sem problemas críticos
- ⚠️ `aprovado_com_sugestoes` - Melhorias sugeridas
- ❌ `reprovado` - Problemas críticos que impedem merge

**Score:**

- 90-100: Excelente
- 75-89: Bom
- 60-74: Aceitável
- <60: Requer correções

---

## 🔧 Workflow Recomendado

### 1. Antes do Commit

```bash
# Revisar arquivos modificados
Revisar código: src/components/Button.tsx
```

### 2. Antes do PR

```bash
# Revisão completa da feature
Revisar feature: src/screens/ChatScreen.tsx src/hooks/useChatOptimized.ts
```

### 3. Aplicar Correções

```bash
# Aplicar correções automáticas
Aplicar correções: src/components/Button.tsx (severidade >= 3)
```

### 4. Verificar Resultado

```bash
# Revisar novamente após correções
Revisão rápida: src/components/Button.tsx
```

---

## ✅ Checklist de Revisão Manual

Antes de considerar código "pronto", verificar:

- [ ] Agente de revisão executado
- [ ] Todos os bugs críticos (severidade 5) corrigidos
- [ ] Bugs de alta severidade (4) corrigidos ou documentados
- [ ] Performance verificada (60fps, sem re-renders)
- [ ] Acessibilidade completa (WCAG 2.1 AA)
- [ ] Testes para componentes críticos
- [ ] Documentação atualizada
- [ ] Imports organizados
- [ ] Tipos TypeScript corretos
- [ ] Memoização adequada

---

## 🎓 Dicas Avançadas

### 1. Revisão Incremental

Revisar apenas arquivos modificados:

```
Revisar arquivos modificados no último commit
```

### 2. Revisão de Dependências

Analisar impacto de mudanças:

```
Revisar: src/components/Button.tsx
Verificar impacto em: src/screens/ChatScreen.tsx src/features/habits/HabitsScreen.tsx
```

### 3. Comparação de Versões

Revisar mudanças entre commits:

```
Comparar: commit-abc vs commit-xyz
Analisar: bugs introduzidos, regressões
```

### 4. Revisão de Performance Específica

Focar em métricas específicas:

```
Analisar: re-renders do componente Button
Identificar: causas e soluções
```

---

## 📚 Referências

- `.cursorrules` - Regras do projeto
- `.cursor/agents/code-reviewer.md` - Instruções do agente
- `REVISAO-CODIGO-FINAL.md` - Status atual
- `OTIMIZACOES-FINAIS.md` - Otimizações aplicadas

---

## 🆘 Troubleshooting

### Agente não responde

1. Verificar se Cursor 2.0 está atualizado
2. Verificar se modo Agente está ativado
3. Tentar comando direto: `Revisar código: {arquivo}`

### Resultados incompletos

1. Especificar melhor o comando
2. Mencionar @code-reviewer explicitamente
3. Usar comandos mais específicos

### Correções não aplicadas

1. Verificar permissões do arquivo
2. Tentar aplicar manualmente
3. Verificar conflitos de merge

---

**Agente de revisão configurado e pronto para uso!** 🔍✨

Para começar, abra o Composer (`Cmd+L`) e digite:

```
Revisar código: src/components/Button.tsx
```
