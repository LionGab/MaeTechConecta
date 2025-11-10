# Workflow: Hotfix Crítico

## 🚨 Objetivo

Resolver bugs críticos em produção rapidamente.

---

## ⚡ Fase 1: Identificação

### 1.1. Reporte do Bug

```bash
# Usuário reporta via Sentry/Analytics
"App crashando ao enviar mensagem"
```

### 1.2. Reprodução

```bash
# Agent 5 cria teste reprodutivo
@agent-5-qa Criar teste que reproduz crash
```

---

## 🛠️ Fase 2: Correção

### 2.1. Diagnóstico (Agent 7)

```bash
@agent-7-performance Profiling do crash
```

### 2.2. Fix (Agent apropriado)

```bash
@agent-1-frontend Corrigir crash no envio de mensagem
# OU
@agent-2-backend Corrigir bug na Edge Function
```

### 2.3. Validação (Agent 5)

```bash
@agent-5-qa Testes de regressão completos
```

### 2.4. Security (Agent 8)

```bash
@agent-8-security Verificar se introduz vulnerabilidade
```

---

## 🚀 Fase 3: Deploy

### 3.1. Merge

```bash
git checkout hotfix/crash-fix
git merge main
```

### 3.2. Deploy Imediato

```bash
# EAS Update (sem rebuild)
eas update --branch production
```

### 3.3. Monitoramento

```bash
# Analytics + Sentry tracking
```

---

**Tempo estimado:** 2-5 minutos 🔥

