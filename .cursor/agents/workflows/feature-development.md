# Workflow: Feature Development

## 🎯 Objetivo

Desenvolver features completas usando múltiplos agentes em paralelo.

---

## 📋 Fase 1: Planejamento (Cursor Plan Mode)

### 1.1. Definir Feature

```bash
# No Cursor Composer
"Criar sistema de notificações push para lembretes de hábitos"
```

### 1.2. Decompor em Sub-tarefas

O Cursor Plan Mode automaticamente cria:

- [ ] Configurar Expo Notifications
- [ ] Backend: Edge Function de agendamento
- [ ] UI: Tela de configurações de notificações
- [ ] Permissões iOS/Android
- [ ] Deep linking routes
- [ ] Testes E2E do fluxo
- [ ] Documentação
- [ ] Performance check
- [ ] LGPD audit

---

## 🚀 Fase 2: Execução Paralela

### 2.1. Spawn Agent 1 (Frontend)

```bash
# Cursor vai automaticamente para: .cursor/agents/prompts/agent-1-frontend.md
"@agent-1-frontend Implementar UI de configurações de notificações"
```

**Saída esperada:**

- Componente `NotificationSettingsScreen.tsx`
- Estados de permissão
- Toggle switches estilizados
- Validações

### 2.2. Spawn Agent 2 (Backend)

```bash
# Paralelamente
"@agent-2-backend Criar Edge Function de agendamento de notificações"
```

**Saída esperada:**

- `functions/schedule-notification/index.ts`
- Integração com Expo Push Notifications
- Queue system para agendamentos
- API routes

### 2.3. Spawn Agent 3 (Integration)

```bash
# Paralelamente
"@agent-3-ai Integrar alertas inteligentes com IA"
```

**Saída esperada:**

- Lógica de personalização de mensagens
- Context-aware notifications
- Escalonamento baseado em padrões

### 2.4. Spawn Agent 4 (Design)

```bash
# Paralelamente
"@agent-4-design-system Adaptar design system para notificações"
```

**Saída esperada:**

- Componentes visuais padronizados
- Ícones de notificação
- Paleta de cores adequada

### 2.5. Spawn Agent 5 (Testing)

```bash
# Paralelamente
"@agent-5-qa Criar testes E2E do fluxo de notificações"
```

**Saída esperada:**

- Testes unitários dos componentes
- Testes E2E com Detox
- Mocks de push notifications

### 2.6. Spawn Agent 6 (Docs)

```bash
# Paralelamente
"@agent-6-docs Documentar sistema de notificações"
```

**Saída esperada:**

- README da feature
- Guia de configuração
- Troubleshooting

### 2.7. Spawn Agent 7 (Performance)

```bash
# Paralelamente
"@agent-7-performance Verificar impacto de bateria"
```

**Saída esperada:**

- Análise de battery drain
- Recomendações de otimização
- Métricas coletadas

### 2.8. Spawn Agent 8 (Security)

```bash
# Paralelamente
"@agent-8-security Auditar compliance LGPD de notificações"
```

**Saída esperada:**

- Análise de consentimentos
- Logs de auditoria
- Checklist de compliance

---

## ✅ Fase 3: Review & Merge

### 3.1. Review Individual

```bash
git worktree list
git diff feature/notifications
```

### 3.2. Testes Integrados

```bash
# Agent 5 executa automaticamente
npm test
npm run e2e
```

### 3.3. Merge Sequencial

```bash
# Orquestrador central faz merge
git checkout main
git merge feature/notifications --no-ff
```

### 3.4. CI/CD

```bash
# GitHub Actions executa
- Build
- Testes
- Lint
- Deploy staging
```

---

## 📊 Métricas de Sucesso

- ✅ **Tempo total:** 5-10 minutos
- ✅ **Cobertura:** 80%+ testes
- ✅ **Performance:** Sem regressões
- ✅ **Compliance:** LGPD aprovado
- ✅ **Documentação:** Completa

---

## 🔄 Exemplo Real

**Input do usuário:**

```
"Implemente sistema de notificações push para lembretes de hábitos"
```

**Cursor 2.0 automaticamente:**

1. Cria plano no Plan Mode
2. Spawna 8 agentes em paralelo
3. Cada agente trabalha isolado
4. Merge automático
5. CI/CD triggera
6. Deploy automático

**Resultado:**
Feature completa, testada, documentada e em produção em **10 minutos** 🚀

