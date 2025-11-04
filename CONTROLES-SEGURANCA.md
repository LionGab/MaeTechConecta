# 🔒 Controles de Segurança - Agente de Revisão

**Sistema completo de permissões, aprovação e auditoria**

---

## ✅ Implementação Completa

### Arquivos Criados

1. **`.cursor/cli.json`** ✅
   - Configuração completa de permissões
   - Controles de read, write, shell, github
   - Sistema de aprovação
   - Configuração de logs

2. **`.cursor/whitelist.json`** ✅
   - Whitelist de usuários e agentes
   - Trust levels (admin, reviewer, developer, readonly)
   - Permissões por trust level
   - Restrições específicas

3. **`scripts/review-manager.js`** ✅
   - Gerenciador de revisões e permissões
   - Sistema de logs
   - Verificação de whitelist
   - Geração de relatórios

4. **`scripts/approval-prompt.js`** ✅
   - Sistema de aprovação interativa
   - Timeout automático
   - Integração com review-manager

5. **`.cursor/review-logs/`** ✅
   - Diretório de logs
   - Retenção de 90 dias
   - Logs de auditoria separados

6. **`.cursor/agents/code-reviewer-security.md`** ✅
   - Documentação de segurança
   - Workflow de aprovação
   - Regras de segurança

---

## 🎯 Permissões Configuradas

### READ (Leitura)

- ✅ **Status:** Habilitado para todos
- ✅ **Aprovação:** Não requerida
- ✅ **Scope:** Todos os arquivos do projeto (exceto node_modules, .git)

### WRITE (Escrita)

- ⚠️ **Status:** Habilitado com restrições
- ⚠️ **Aprovação:** Sempre requerida
- ⚠️ **Restrições:**
  - ❌ `package.json`
  - ❌ `.env*`
  - ❌ `supabase/.env*`
- ✅ **Ações permitidas:** Fix suggestions, linter fixes, format, docs, refactor

### SHELL (Terminal)

- ⚠️ **Status:** Habilitado com restrições
- ⚠️ **Aprovação:** Sempre requerida
- ✅ **Comandos permitidos:**
  - `npm install`
  - `npm run lint`
  - `npm run format`
  - `npm run test`
  - `git status`
  - `git diff`
  - `expo start`
- ❌ **Comandos bloqueados:**
  - `git push`
  - `git push --force`
  - `gh pr create`
  - `gh pr merge`
  - `npm publish`
  - `rm -rf`
  - `sudo *`

### REVIEW (Revisão)

- ✅ **Status:** Habilitado sem aprovação
- ✅ **Ações:** Ler, analisar, sugerir, gerar relatórios
- ❌ **Restrições:** Não pode aplicar correções automaticamente

---

## 🔐 Trust Levels

### Admin

- ✅ Read, Write, Shell, Review, Approve
- ✅ Gerenciar whitelist
- ✅ Configurar sistema

### Reviewer

- ✅ Read, Review, Suggest fixes
- ✅ Gerar relatórios
- ❌ Não pode aplicar correções automaticamente
- ❌ Não pode fazer push

### Developer

- ✅ Read, Write (scope específico)
- ✅ Suggest fixes
- ⚠️ Requer aprovação para write
- ❌ Não pode fazer push
- ❌ Não pode modificar arquivos restritos

### Readonly

- ✅ Read apenas
- ✅ Logs de leitura
- ❌ Nenhuma modificação

---

## 🚀 Como Usar

### 1. Verificar Permissão

```bash
node scripts/review-manager.js check code-reviewer write src/components/Button.tsx
```

### 2. Registrar Log

```bash
node scripts/review-manager.js log code-reviewer review src/components/Button.tsx 3 success
```

### 3. Gerar Relatório

```bash
node scripts/review-manager.js report 2025-01-01 2025-01-30
```

### 4. Aprovar Ação

```bash
node scripts/review-manager.js approve <approval_id>
```

### 5. Solicitar Aprovação Interativa

```bash
node scripts/approval-prompt.js <approval_id>
```

---

## 📊 Sistema de Logs

### Estrutura de Logs

```
.cursor/review-logs/
├── review-2025-01-30.json      # Logs diários
├── audit-2025-01-30.json        # Auditoria (apenas aprovações)
└── pending-approvals.json       # Aprovações pendentes
```

### Formato de Log

```json
{
  "timestamp": "2025-01-30T10:30:00.000Z",
  "agent_id": "code-reviewer",
  "action": "write",
  "file": "src/components/Button.tsx",
  "severity": 3,
  "result": "approved",
  "requires_approval": true,
  "approved_by": "manual",
  "metadata": {}
}
```

### Retenção

- **Período:** 90 dias (configurável em `.cursor/cli.json`)
- **Formato:** JSON
- **Limite:** 1000 logs por arquivo (rotação automática)

---

## 🔒 Regras de Segurança

### ✅ Sempre

1. Verificar whitelist antes de qualquer ação
2. Registrar logs de todas as ações
3. Requerer aprovação para write/shell
4. Negar push automático
5. Timeout de aprovação (300s padrão)

### ❌ Nunca

1. Auto-aplicar correções críticas (severidade 4-5)
2. Modificar arquivos restritos sem aprovação
3. Executar comandos shell destrutivos
4. Fazer git push automaticamente
5. Aplicar mudanças sem registrar log

---

## 📋 Whitelist Atual

### Agentes Autorizados

1. **code-reviewer** (trust_level: reviewer)
   - Permissões: read, review, suggest_fixes, generate_reports
   - Restrições: no_auto_apply, no_git_push

2. **frontend-agent** (trust_level: developer)
   - Permissões: read, write_components, suggest_fixes
   - Restrições: no_restricted_files, require_approval_write

3. **backend-agent** (trust_level: developer)
   - Permissões: read, write_services, suggest_fixes
   - Restrições: no_env_files, require_approval_write

4. **ia-agent** (trust_level: developer)
   - Permissões: read, write_ai_services, suggest_fixes
   - Restrições: no_api_keys, require_approval_write

5. **design-agent** (trust_level: developer)
   - Permissões: read, write_components, write_styles
   - Restrições: no_core_logic, require_approval_write

---

## 🎯 Workflow de Revisão Segura

### Passo 1: Agente Identifica Problema

```
code-reviewer: "Encontrei bug em Button.tsx, severidade 3"
```

### Passo 2: Sistema Verifica Permissões

```bash
node scripts/review-manager.js check code-reviewer suggest_fix src/components/Button.tsx
# ✅ Permissão concedida (reviewer pode sugerir)
```

### Passo 3: Gerar Sugestão

```
code-reviewer: "Sugestão de correção gerada..."
```

### Passo 4: Se Aplicar Correção (requer aprovação)

```bash
node scripts/review-manager.js check code-reviewer write src/components/Button.tsx
# ⚠️ Requer aprovação
# Salvar em pending-approvals.json
# Solicitar aprovação via prompt
```

### Passo 5: Usuário Aprova/Nega

```bash
node scripts/approval-prompt.js <approval_id>
# ⚠️ APROVAÇÃO REQUERIDA
# Aprovar esta ação? (s/N): s
# ✅ Ação aprovada e registrada
```

### Passo 6: Aplicar Correção

```
Aplicar correção...
Registrar log...
✅ Concluído
```

---

## 📊 Relatórios Disponíveis

### Relatório Diário

```bash
node scripts/review-manager.js report 2025-01-30 2025-01-30
```

### Relatório Semanal

```bash
node scripts/review-manager.js report 2025-01-23 2025-01-30
```

### Relatório Mensal

```bash
node scripts/review-manager.js report 2025-01-01 2025-01-30
```

**Saída:**

```json
{
  "period": { "start": "2025-01-01", "end": "2025-01-30" },
  "stats": {
    "total_actions": 150,
    "by_agent": { "code-reviewer": 80, "frontend-agent": 70 },
    "by_action": { "review": 100, "write": 50 },
    "approvals": {
      "required": 50,
      "approved": 45,
      "denied": 5,
      "pending": 0
    },
    "files_modified": ["src/components/Button.tsx", ...]
  }
}
```

---

## 🔧 Configuração

### Personalizar Permissões

Editar `.cursor/cli.json`:

```json
{
  "permissions": {
    "write": {
      "require_approval": true,
      "allowed_actions": [...],
      "deny": [...]
    }
  }
}
```

### Adicionar Agente à Whitelist

Editar `.cursor/whitelist.json`:

```json
{
  "agents": [
    {
      "id": "novo-agent",
      "name": "Novo Agent",
      "trust_level": "developer",
      "permissions": [...],
      "restrictions": [...],
      "enabled": true
    }
  ]
}
```

### Ajustar Retenção de Logs

Editar `.cursor/cli.json`:

```json
{
  "logging": {
    "retention_days": 90 // Alterar para 30, 60, etc.
  }
}
```

---

## ✅ Status

- ✅ Sistema de permissões configurado
- ✅ Whitelist implementada
- ✅ Sistema de aprovação funcional
- ✅ Logs e auditoria ativos
- ✅ Scripts de gerenciamento criados
- ✅ Documentação completa

---

**Sistema de segurança pronto para uso!** 🔒✨

Para começar, verifique permissões:

```bash
node scripts/review-manager.js check code-reviewer read
```
