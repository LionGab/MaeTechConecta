# Review Logs - Sistema de Auditoria

Este diretório contém logs automáticos de todas as ações de revisão realizadas pelos agentes.

## Estrutura

- `review-YYYY-MM-DD.json` - Logs diários de revisões
- `audit-YYYY-MM-DD.json` - Logs de auditoria (ações que requerem aprovação)
- `pending-approvals.json` - Aprovações pendentes

## Formato de Log

```json
{
  "timestamp": "2025-01-30T10:30:00.000Z",
  "agent_id": "code-reviewer",
  "action": "review",
  "file": "src/components/Button.tsx",
  "severity": 3,
  "result": "success",
  "requires_approval": false,
  "metadata": {
    "bugs_found": 2,
    "suggestions_generated": 5
  }
}
```

## Retenção

Logs são mantidos por **90 dias** conforme configuração em `.cursor/cli.json`.

Após 90 dias, logs antigos podem ser arquivados ou removidos.

## Privacidade

- Logs não contêm dados sensíveis do código
- Apenas metadados de ações são registrados
- Aprovações são rastreadas para auditoria

## Gerar Relatório

```bash
node scripts/review-manager.js report 2025-01-01 2025-01-30
```
