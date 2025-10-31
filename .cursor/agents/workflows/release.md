# Workflow: Release Completo

## 🎯 Objetivo
Preparar e publicar release de versão completa.

---

## 📋 Fase 1: Pré-Release

### 1.1. Check de Qualidade (Todos Agentes)
```bash
@agent-5-qa Test suite completo
@agent-7-performance Benchmark de performance
@agent-8-security Security audit completo
@agent-6-docs Atualizar CHANGELOG
```

### 1.2. Versionamento
```bash
npm version minor  # ou major, patch
```

### 1.3. Build de Produção
```bash
eas build --platform all --profile production
```

---

## 🚀 Fase 2: Release

### 2.1. Deploy Apps (Expo)
```bash
eas update --branch production
eas submit --platform all
```

### 2.2. Deploy Backend (Supabase)
```bash
supabase db push
```

### 2.3. Monitoramento
```bash
# Analytics, Sentry, logs
```

---

## ✅ Fase 3: Pós-Release

### 3.1. Observabilidade
```bash
# Agent 7 + Agent 8 monitoram
```

### 3.2. Documentação
```bash
@agent-6-docs Documentar release notes
```

---

**Tempo estimado:** 15-30 minutos (com validações)
