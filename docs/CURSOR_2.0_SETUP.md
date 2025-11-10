# ⚙️ Cursor 2.0 - Setup Prático para Nossa Maternidade

**Guia de configuração rápida para usar todos os recursos do Cursor 2.0 no projeto**

---

## 🚀 Setup Rápido (5 minutos)

### 1. Ativar Recursos no Cursor

**Settings → Features:**

- ✅ Composer (ativado por padrão)
- ✅ Multi-Agent (ativado por padrão)
- ✅ Browser Integrado (ativar)
- ✅ Voice Mode (ativar)
- ✅ Sandbox Terminals (macOS - ativar)

### 2. Configurar Atalhos

**Cmd+Shift+P → "Preferences: Open Keyboard Shortcuts"**

Adicione:

```json
[
  {
    "key": "cmd+shift+c",
    "command": "cursor.composer.open",
    "when": "editorTextFocus"
  },
  {
    "key": "cmd+shift+v",
    "command": "cursor.voice.toggle"
  },
  {
    "key": "cmd+shift+b",
    "command": "cursor.browser.open"
  },
  {
    "key": "cmd+shift+m",
    "command": "cursor.multiAgent.open"
  }
]
```

### 3. Configurar Modelos

**Settings → Models:**

**Para Planejamento:**

- GPT-4 / Claude Sonnet (raciocínio complexo)

**Para Execução:**

- Composer (rápido, < 30s)

**Para Revisão:**

- GPT-4 Codex (qualidade)

---

## 📝 Comandos Prontos para Usar

### Comando: "Criar Componente React Native"

```
Crie um componente React Native seguindo as regras do .cursorrules:
1. TypeScript com tipos explícitos (sem any)
2. React.memo para otimização
3. useCallback para handlers
4. useMemo para computações pesadas
5. Acessibilidade completa (accessibilityLabel, accessibilityRole)
6. Usar tema (colors, spacing, typography do useTheme)
7. JSDoc para documentação
8. Estrutura: componente → helpers → tipos
9. Mobile-first design
10. Suporte a dark mode
```

### Comando: "Revisar Código"

```
Revise o código seguindo:
1. Verificar tipos TypeScript (sem any, sem type assertions desnecessárias)
2. Verificar performance (memo, useCallback, useMemo onde necessário)
3. Verificar acessibilidade (WCAG 2.1 AA - accessibilityLabel, accessibilityRole)
4. Verificar padrões do projeto (.cursorrules)
5. Verificar uso do tema (não cores hardcoded)
6. Verificar otimizações FlatList (windowSize, maxToRenderPerBatch)
7. Sugerir melhorias específicas
```

### Comando: "Refatorar para Performance"

```
Refatore para melhorar performance:
1. Adicionar React.memo em componentes puros
2. Usar useCallback para handlers passados como props
3. Usar useMemo para computações pesadas
4. Otimizar FlatList com windowSize={10}, maxToRenderPerBatch={10}
5. Lazy load screens no TabNavigator
6. Verificar re-renders desnecessários
7. Otimizar imagens (expo-image)
```

### Comando: "Criar Screen Mobile-First"

```
Crie uma screen React Native seguindo:
1. Mobile-first design (depois tablet)
2. SafeAreaView para áreas seguras
3. Usar tema (colors, spacing, typography)
4. Suporte a dark mode
5. Acessibilidade completa
6. FlatList otimizada (windowSize={10}, maxToRenderPerBatch={10})
7. Loading states
8. Error handling
9. TypeScript com tipos explícitos
10. JSDoc
```

### Comando: "Validar Antes de Finalizar"

```
Antes de finalizar, execute:
1. npm run type-check (verificar tipos)
2. npm run lint (verificar lint)
3. npm run test (executar testes)
4. Verificar acessibilidade
5. Verificar performance
6. Verificar uso do tema
7. Verificar padrões do .cursorrules
```

---

## 🔄 Workflows Práticos

### Workflow 1: Criar Feature Completa

**1. Planejar (Background):**

```
Use modelo de raciocínio para criar plano detalhado:
- Análise de requisitos
- Estrutura de arquivos
- Componentes necessários
- Integrações necessárias
- Testes necessários
```

**2. Executar (Composer):**

```
Use Composer para implementar cada parte:
- Criar componentes
- Criar screens
- Integrar serviços
- Adicionar testes
```

**3. Revisar:**

```
Use comando "Revisar Código" para validar
```

### Workflow 2: Refatoração Grande

**1. Dividir em Tarefas:**

```
- Tarefa 1: Refatorar componentes
- Tarefa 2: Refatorar screens
- Tarefa 3: Refatorar serviços
- Tarefa 4: Refatorar hooks
```

**2. Multi-Agente Paralelo:**

```
- Agente 1: Refatora componentes
- Agente 2: Refatora screens
- Agente 3: Refatora serviços
- Agente 4: Refatora hooks
```

**3. Revisar e Integrar:**

```
- Revisar mudanças de cada agente
- Integrar melhores soluções
- Validar tudo junto
```

### Workflow 3: Debug Visual

**1. Abrir Browser Integrado:**

```
Cmd+Shift+B
```

**2. Carregar App:**

```
Carregue sua aplicação no browser integrado
```

**3. Selecionar e Comandar:**

```
- Selecione elemento visualmente
- "Cursor, corrija este elemento"
- Teste mudanças em tempo real
```

---

## 🤖 Scripts de Automação

### package.json - Scripts Recomendados

```json
{
  "scripts": {
    "check": "npm run type-check && npm run lint && npm run test",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx --max-warnings 0",
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "validate": "npm run check && npm run format:check",
    "validate:full": "npm run validate && npm run test:coverage"
  }
}
```

### Usar no Cursor

**Antes de finalizar:**

```
"Execute npm run validate antes de finalizar"
```

**Para cobertura completa:**

```
"Execute npm run validate:full antes de finalizar"
```

---

## 👥 Comandos de Equipe

### Criar no Painel do Cursor

1. Acesse [cursor.com/settings](https://cursor.com/settings)
2. Vá em **Team → Commands**
3. Crie comandos personalizados
4. Compartilhe via deeplink

### Exemplo de Comando de Equipe

**Nome:** `criar-componente-rn`

**Prompt:**

```
Crie um componente React Native seguindo as regras do .cursorrules:
1. TypeScript com tipos explícitos
2. React.memo + useCallback + useMemo
3. Acessibilidade completa (WCAG 2.1 AA)
4. Usar tema (useTheme hook)
5. Mobile-first design
6. Suporte a dark mode
7. JSDoc completo
8. Estrutura: componente → helpers → tipos
```

**Compartilhar:**

```
cursor://command?name=criar-componente-rn&team=nossa-maternidade
```

---

## 🔒 Segurança

### Revisar Sempre

**Checklist de Revisão:**

- [ ] Revise todas as mudanças antes de aprovar
- [ ] Execute `npm run validate` localmente
- [ ] Teste funcionalidade manualmente
- [ ] Verifique tipos e lint
- [ ] Verifique acessibilidade
- [ ] Verifique performance

### CI Gates

**GitHub Actions:**

```yaml
name: CI

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

**Bloquear merge sem CI:**

- Settings → Branches → Branch protection rules
- Require status checks to pass before merging
- Select `validate` check

---

## 💡 Dicas Específicas do Projeto

### 1. Usar Composer para Tarefas Rápidas

**Exemplos:**

- Adicionar validação em formulário
- Corrigir bug simples
- Adicionar prop em componente
- Ajustar estilo

**Tempo esperado:** < 30 segundos

### 2. Usar Planejamento para Tarefas Complexas

**Exemplos:**

- Refatorar sistema de autenticação
- Migrar para nova versão do Expo
- Implementar nova feature grande
- Otimizar performance global

**Tempo esperado:** 5-30 minutos (planejamento) + execução

### 3. Usar Multi-Agente para Features Paralelas

**Exemplos:**

- Implementar múltiplas screens simultaneamente
- Criar múltiplos componentes relacionados
- Refatorar múltiplas partes do código
- Testar diferentes abordagens

**Benefício:** 4-8× mais rápido

### 4. Usar Browser para Debug Visual

**Exemplos:**

- Ajustar layout visualmente
- Testar responsividade
- Debug de estilos
- Validar acessibilidade visual

**Benefício:** Feedback visual imediato

---

## 📊 Métricas Recomendadas

### Acompanhar

- **Tempo médio de execução:** < 30s (Composer)
- **Taxa de aprovação:** > 80%
- **Qualidade de código:** Sem erros de tipo/lint
- **Cobertura de testes:** > 70%

### Otimizar

- Ajuste comandos que não funcionam bem
- Refine prompts baseado em resultados
- Documente padrões que funcionam
- Compartilhe melhorias com equipe

---

## ✅ Checklist de Setup

### Configuração Inicial

- [ ] Ativar Composer
- [ ] Ativar Multi-Agent
- [ ] Ativar Browser Integrado
- [ ] Ativar Voice Mode
- [ ] Configurar atalhos
- [ ] Configurar modelos

### Comandos

- [ ] Criar comandos personalizados
- [ ] Compartilhar via deeplinks
- [ ] Documentar comandos úteis
- [ ] Atualizar .cursorrules

### Automações

- [ ] Configurar scripts npm
- [ ] Integrar com CI/CD
- [ ] Configurar gates de validação
- [ ] Testar automações

### Segurança

- [ ] Configurar revisão obrigatória
- [ ] Configurar CI gates
- [ ] Documentar processos
- [ ] Treinar equipe

---

## 🎯 Próximos Passos

1. **Testar Composer:** Use para tarefa simples
2. **Testar Multi-Agent:** Use para múltiplas features
3. **Testar Browser:** Use para debug visual
4. **Criar Comandos:** Personalize para seu projeto
5. **Compartilhar:** Compartilhe comandos com equipe

---

**Última atualização:** Novembro 2025
**Versão do Cursor:** 2.0+
