# 🤖 Agentes Cursor 2.0 - Nossa Maternidade

**Guia Completo de Agentes Personalizados**

---

## 📋 Agentes Disponíveis

### 1. 🔍 Code Reviewer

**Arquivo:** `.cursor/agents/code-reviewer.md`

Revisão automatizada multi-stage de código com análise completa.

**Uso:**

```
Revisar código: src/components/Button.tsx
```

### 2. 🎨 UI/UX Designer

**Arquivo:** `.cursor/agents/ui-ux-designer.md`

Criação e melhoria de interfaces acolhedoras.

**Uso:**

```
Criar tela de perfil com design system Bubblegum
```

### 3. 🧪 Test Generator

**Arquivo:** `.cursor/agents/test-generator.md`

Geração automática de testes unitários e de integração.

**Uso:**

```
Gerar testes para src/components/Button.tsx
```

---

## 🚀 Como Ativar Agentes

### Método 1: Via Composer (Cmd/Ctrl+L)

1. Abra o Composer (`Cmd+L` ou `Ctrl+L`)
2. Digite: `@code-reviewer Revisar código: {arquivo}`
3. O agente executará a revisão completa

### Método 2: Via Chat

1. Abra o Chat do Cursor
2. Mencione o agente: `@code-reviewer` ou `@ui-ux-designer`
3. Faça sua pergunta/comando

### Método 3: Via Comandos Diretos

No Composer, digite diretamente:

```
Revisar código: src/components/Button.tsx
Criar componente: Card com variantes
Gerar testes: src/hooks/useChatOptimized.ts
```

---

## 📝 Criar Novo Agente

1. Crie arquivo `.cursor/agents/{nome-agente}.md`
2. Defina instruções detalhadas
3. Inclua exemplos de uso
4. Configure pipeline multi-stage se necessário
5. Teste no Composer

### Template Básico

```markdown
# Nome do Agente

## Identidade

Você é um [papel] para o projeto Nossa Maternidade.

## Pipeline

### STAGE 1: [Nome]

[Descrição da etapa]

### STAGE 2: [Nome]

[Descrição da etapa]

## Formato de Resposta

[JSON ou formato esperado]

## Comandos

- Comando 1: [descrição]
- Comando 2: [descrição]
```

---

## 🎯 Melhores Práticas

### 1. Instruções Claras

- Defina identidade do agente
- Especifique pipeline de execução
- Inclua exemplos práticos

### 2. Formato Consistente

- Use JSON estruturado
- Inclua severidade/prioridade
- Sugira correções com código

### 3. Contexto Adequado

- Referencie `.cursorrules`
- Use padrões do projeto
- Considere arquitetura existente

### 4. Iteração

- Teste comandos
- Refine instruções
- Melhore baseado em resultados

---

## 📚 Documentação Adicional

- `.cursorrules` - Regras do projeto
- `REVISAO-CODIGO-FINAL.md` - Status da revisão
- `OTIMIZACOES-FINAIS.md` - Otimizações aplicadas

---

**Agentes configurados e prontos para uso!** 🤖✨

