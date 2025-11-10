# 🔒 Agente de Revisão - Controles de Segurança

**Extensão do Agente de Revisão com Sistema de Permissões e Aprovação**

---

## 🔐 Sistema de Permissões

### Verificação de Permissões ANTES de Qualquer Ação

**IMPORTANTE:** O agente DEVE verificar permissões antes de executar qualquer ação.

```typescript
// Pseudocódigo - Verificação Obrigatória
1. Identificar agente/usuário atual
2. Verificar whitelist (.cursor/whitelist.json)
3. Verificar permissões do trust level
4. Verificar restrições específicas do agente
5. Verificar se ação requer aprovação
6. SE requer aprovação:
   - Registrar ação pendente
   - Solicitar aprovação via prompt
   - Aguardar confirmação
7. SE aprovado OU não requer aprovação:
   - Executar ação
   - Registrar log
8. SENÃO:
   - Negar ação
   - Registrar log de negação
```

---

## 📋 Permissões por Ação

### ✅ READ (Leitura)

- **Permitido para:** Todos os agentes
- **Aprovação:** Não requerida
- **Log:** Sim (info)

**Exemplo:**

```
✅ code-reviewer pode ler qualquer arquivo
✅ frontend-agent pode ler componentes
✅ Qualquer agente pode ler documentação
```

---

### ⚠️ WRITE (Escrita)

- **Permitido para:** Developer+, com aprovação
- **Aprovação:** Sempre requerida (exceto ações menores)
- **Log:** Sim (audit)

**Restrições:**

- ❌ NUNCA modificar arquivos restritos:
  - `package.json`
  - `.env*`
  - `supabase/.env*`
  - Arquivos de configuração críticos

**Exemplo:**

```
⚠️ code-reviewer pode SUGERIR correções, mas requer aprovação para aplicar
⚠️ frontend-agent pode modificar componentes, mas requer aprovação
❌ NENHUM agente pode modificar package.json sem aprovação explícita
```

---

### 🛡️ SHELL (Terminal)

- **Permitido para:** Admin, com aprovação
- **Aprovação:** Sempre requerida
- **Log:** Sim (audit)

**Comandos Permitidos:**

- ✅ `npm install`
- ✅ `npm run lint`
- ✅ `npm run format`
- ✅ `git status`
- ✅ `git diff`
- ✅ `expo start`

**Comandos BLOQUEADOS:**

- ❌ `git push`
- ❌ `git push --force`
- ❌ `gh pr create`
- ❌ `gh pr merge`
- ❌ `npm publish`
- ❌ `rm -rf`
- ❌ `sudo *`

**Exemplo:**

```
✅ code-reviewer pode executar npm run lint (após aprovação)
❌ code-reviewer NUNCA pode fazer git push
⚠️ Qualquer shell command requer aprovação explícita
```

---

### 📊 REVIEW (Revisão)

- **Permitido para:** Reviewer+, sem aprovação
- **Aprovação:** Não requerida (apenas sugestões)
- **Log:** Sim (info)

**Ações:**

- ✅ Ler código
- ✅ Gerar relatórios
- ✅ Sugerir correções
- ✅ Criar diffs
- ❌ Aplicar correções automaticamente (requer aprovação)

---

## 🔒 Workflow de Aprovação

### Passo 1: Verificação de Whitelist

```javascript
// Executar: node scripts/review-manager.js check <agent_id> <action> [file]
const whitelistCheck = checkWhitelist(agentId, action);

if (!whitelistCheck.allowed) {
  // Negar ação e registrar log
  logAction(agentId, action, file, null, 'denied', {
    reason: whitelistCheck.reason,
  });
  return { error: 'Not authorized', reason: whitelistCheck.reason };
}
```

### Passo 2: Verificação de Aprovação

```javascript
const approvalCheck = requiresApproval(action, file, agentId);

if (approvalCheck.requires) {
  // Salvar aprovação pendente
  const approvalId = generateApprovalId();
  savePendingApproval({
    id: approvalId,
    agent_id: agentId,
    action,
    file,
    severity,
    description,
    diff,
    timestamp: new Date().toISOString(),
  });

  // Solicitar aprovação via prompt
  const approved = await requestApproval(approvalId);

  if (!approved) {
    logAction(agentId, action, file, severity, 'denied', {
      approval_id: approvalId,
      reason: 'User denied',
    });
    return { error: 'Action denied by user' };
  }
}
```

### Passo 3: Executar Ação (se aprovado)

```javascript
// Executar ação
const result = await executeAction(action, file, ...args);

// Registrar log
logAction(agentId, action, file, severity, 'success', {
  result,
  approved: approvalCheck.requires,
});
```

---

## 📝 Comandos de Verificação

### Verificar Permissão

```bash
node scripts/review-manager.js check code-reviewer write src/components/Button.tsx
```

**Resposta:**

```json
{
  "agent_id": "code-reviewer",
  "action": "write",
  "file": "src/components/Button.tsx",
  "whitelist": {
    "allowed": true,
    "trustLevel": "reviewer"
  },
  "approval": {
    "requires": true,
    "reason": "Write actions require approval"
  },
  "allowed": false
}
```

### Registrar Log

```bash
node scripts/review-manager.js log code-reviewer review src/components/Button.tsx 3 success '{"bugs_found":2}'
```

### Gerar Relatório

```bash
node scripts/review-manager.js report 2025-01-01 2025-01-30
```

### Aprovar Ação Pendente

```bash
node scripts/review-manager.js approve <approval_id>
```

---

## 🔐 Regras de Segurança

### 1. NUNCA Auto-Aplicar Correções Críticas

- Severidade 4-5: Sempre requer aprovação
- Arquivos restritos: Sempre requer aprovação
- Mudanças de configuração: Sempre requer aprovação

### 2. SEMPRE Registrar Logs

- Todas as ações: Registrar
- Aprovações/negações: Registrar
- Erros: Registrar

### 3. NUNCA Fazer Push Automático

- `git push`: Bloqueado para TODOS os agentes
- `git push --force`: Bloqueado permanentemente
- PRs automáticos: Desabilitado por padrão

### 4. SEMPRE Verificar Whitelist

- Antes de qualquer ação: Verificar whitelist
- Agentes não listados: Negar automaticamente
- Trust level insuficiente: Negar automaticamente

### 5. Timeout de Aprovação

- Timeout padrão: 300s (5 minutos)
- Após timeout: Negar por padrão (configurável)
- Ações críticas: Timeout menor (60s)

---

## 📊 Logs e Auditoria

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
  "approved_at": "2025-01-30T10:32:15.000Z",
  "metadata": {
    "bugs_fixed": 2,
    "lines_changed": 15,
    "diff_preview": "..."
  }
}
```

### Arquivos de Log

- `review-YYYY-MM-DD.json` - Logs diários
- `audit-YYYY-MM-DD.json` - Auditoria (apenas ações que requerem aprovação)
- `pending-approvals.json` - Aprovações pendentes

### Retenção

- Período: 90 dias (configurável)
- Formato: JSON
- Backup: Recomendado backup antes de limpar

---

## ✅ Checklist de Segurança

Antes de executar qualquer ação, verificar:

- [ ] Agente está na whitelist?
- [ ] Trust level tem permissão?
- [ ] Ação requer aprovação?
- [ ] Arquivo é restrito?
- [ ] Comando shell é seguro?
- [ ] Não está tentando fazer push?
- [ ] Log será registrado?

**Se qualquer item falhar, NEGAR ação e registrar log.**

---

**Sistema de segurança configurado e ativo!** 🔒✨
