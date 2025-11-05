# ✅ Auto Approve - Sistema de Aprovação Automática

Configurado para **pular awaiting review** e aprovar automaticamente todas as mudanças.

## 🚀 Configuração Inicial

### 1. Configurar Skip Awaiting Review

```bash
# Configura tudo automaticamente
npm run skip-awaiting-review
```

Isso cria:

- ✅ Configuração de auto-aprovação (`.cursor/cli.json`)
- ✅ Whitelist com permissões totais (`.cursor/whitelist.json`)
- ✅ Variáveis de ambiente (`.env.auto`)

### 2. Aprovar Mudanças Pendentes

```bash
# Aprova todas as aprovações pendentes
npm run auto-approve:all
```

## 📋 Comandos Disponíveis

### Aprovação Automática

```bash
# Aprova todas as aprovações pendentes
npm run auto-approve
npm run auto-approve:all

# Configura auto-aprovação
npm run auto-approve:config

# Ver status de aprovações pendentes
npm run auto-approve:status
```

### Configuração

```bash
# Configurar skip awaiting review (primeira vez)
npm run skip-awaiting-review
```

## 🔧 Como Funciona

### Auto-Aprovação

O sistema está configurado para:

1. **Pular awaiting review** - Não espera aprovação manual
2. **Auto-aprovar tudo** - Aprova automaticamente todas as mudanças
3. **Skip permissions** - Pula todas as verificações de permissão
4. **Timeout 0** - Aprovação imediata

### Configurações Aplicadas

```json
{
  "auto_approve": true,
  "skip_awaiting_review": true,
  "approval": {
    "timeout": 0,
    "default_action": "approve",
    "auto_approve": true,
    "skip_interactive": true
  },
  "permissions": {
    "write": {
      "require_approval": false
    },
    "shell": {
      "require_approval": false
    }
  }
}
```

### Whitelist

Todos os agentes têm permissões totais:

- `admin` - Todas as permissões
- `reviewer` - Todas as permissões
- `editor` - Todas as permissões

## 🎯 Integração com Outros Comandos

### Auto Review Changes

O `review-changes` agora auto-aprova automaticamente:

```bash
npm run review-changes
# ✅ Auto-aprova mudanças pendentes
# ✅ Revisa mudanças
# ✅ Aplica correções
```

### Auto All

O `auto:all` inclui auto-aprovação:

```bash
npm run auto:all
# 1. Configura skip awaiting review
# 2. Auto-aprova pendentes
# 3. Review changes
# 4. Fix all
# 5. Validate
# 6. Build (opcional)
```

## 📊 Status de Aprovações

Ver aprovações pendentes:

```bash
npm run auto-approve:status
```

Output:

```
📊 Status: 3 aprovação(ões) pendente(s)

  1. approval-123 - write - src/components/Button.tsx
  2. approval-456 - shell - npm run build
  3. approval-789 - fix - src/utils/helpers.ts
```

## 🔄 Fluxo Completo

### Primeira Configuração

```bash
# 1. Configurar skip awaiting review
npm run skip-awaiting-review

# 2. Aprovar pendentes (se houver)
npm run auto-approve:all

# 3. Pronto! Todas as mudanças futuras serão auto-aprovadas
```

### Uso Diário

```bash
# Fazer mudanças no código
# ... editar arquivos ...

# Review automático (auto-aprova tudo)
npm run review-changes

# Ou executar tudo
npm run auto:all
```

## 🛠️ Detalhes Técnicos

### Arquivos Criados

1. **`.cursor/cli.json`** - Configuração de auto-aprovação
2. **`.cursor/whitelist.json`** - Whitelist com permissões totais
3. **`.env.auto`** - Variáveis de ambiente para auto-aprovação

### Scripts

- **`scripts/auto-approve.js`** - Gerencia aprovações automáticas
- **`scripts/awaiting-review-skip.js`** - Configura skip awaiting review

### Logs

Aprovações são registradas em:

- `.cursor/review-logs/review-YYYY-MM-DD.json`
- `.cursor/review-logs/pending-approvals.json` (limpo após aprovação)

## ⚙️ Variáveis de Ambiente

```bash
AUTO_APPROVE=true
SKIP_AWAITING_REVIEW=true
SKIP_PERMISSIONS=true
NON_INTERACTIVE=1
```

## 🎉 Pronto!

Agora todas as mudanças são **auto-aprovadas automaticamente**:

```bash
# Executar tudo automaticamente
npm run auto:all

# Ou individualmente
npm run review-changes    # Auto-aprova + review
npm run auto-approve:all  # Aprova pendentes
```

---

**Criado em:** 04/11/2025  
**Versão:** 1.0
