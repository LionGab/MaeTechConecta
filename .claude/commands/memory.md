# Comando: /memory

**Descrição**: Gerenciar e consultar o sistema de Memória Universal

---

## Uso

```bash
/memory [comando] [opções]
```

---

## Comandos Disponíveis

### **/memory** (sem argumentos)
Mostra resumo completo do estado atual:
- Status do projeto
- Últimas decisões
- TODOs pendentes críticos
- Resumo da última sessão

### **/memory status**
Exibe status detalhado:
- Progresso geral do projeto (%)
- Componentes criados/pendentes
- Telas migradas/pendentes
- Sprint atual
- Bloqueadores

### **/memory decisions**
Lista todas as decisões estratégicas tomadas:
- ID, data, categoria
- Decisão e rationale
- Status (approved/implemented)
- Impacto (critical/high/medium/low)

### **/memory decisions --recent 3**
Mostra apenas as 3 decisões mais recentes

### **/memory todos**
Lista todas as tarefas pendentes:
- Prioridade (critical → low)
- Sprint planejado
- Estimativa de horas
- Dependências

### **/memory todos --critical**
Mostra apenas TODOs críticos

### **/memory log**
Exibe histórico completo de conversas:
- Todas as fases da sessão
- Frases marcantes
- Estatísticas
- Próximos passos

### **/memory log --session 001**
Mostra log de uma sessão específica

### **/memory context**
Exibe contexto completo do projeto:
- Visão geral
- Stack tecnológica
- Design System
- Estado de componentes e telas
- Navegação atual/planejada

### **/memory preferences**
Mostra preferências do usuário e stakeholder:
- Estilo de comunicação
- Prioridades do projeto
- Preferências técnicas e de design

### **/memory search <keyword>**
Busca keyword em todos os arquivos de memória:
- context.json
- decisions.json
- conversation_log.md
- todo_history.json

Exemplo: `/memory search gemini`

### **/memory update**
Atualiza manualmente os arquivos de memória com informações da sessão atual

### **/memory export**
Cria backup comprimido de toda a memória:
- Salva em `.claude/memory/backups/`
- Formato: `memory-backup-YYYYMMDD-HHMMSS.tar.gz`

### **/memory stats**
Exibe estatísticas da memória:
- Tamanho total dos arquivos
- Número de decisões
- Número de TODOs (pendentes/completos)
- Número de sessões registradas
- Última atualização

---

## Exemplos de Uso

```bash
# Ver resumo geral
/memory

# Ver decisões recentes
/memory decisions --recent 5

# Ver apenas TODOs críticos
/memory todos --critical

# Buscar por "gemini" em toda a memória
/memory search gemini

# Criar backup
/memory export

# Ver estatísticas
/memory stats
```

---

## Implementação

O comando `/memory` lê e processa os seguintes arquivos:

- `.claude/memory/context.json`
- `.claude/memory/decisions.json`
- `.claude/memory/preferences.json`
- `.claude/memory/conversation_log.md`
- `.claude/memory/todo_history.json`

---

## Sincronização

Para transferir memória entre computadores:

**Método 1 (Git - Recomendado)**:
```bash
git add .claude/memory/
git commit -m "chore: Update memory"
git push
```

No outro computador:
```bash
git pull
/memory status  # Verificar que memória foi restaurada
```

**Método 2 (Backup Manual)**:
```bash
/memory export
# Transferir arquivo .tar.gz para outro computador
cd .claude/memory/scripts
./import.sh /path/to/backup.tar.gz
```

---

## Privacidade

✅ Todos os dados ficam localmente no seu computador
✅ Sincronização via Git = você controla o repositório
✅ Nenhum dado é compartilhado automaticamente com terceiros

---

**Criado**: 2025-10-29
**Versão**: 1.0.0
**Status**: Ativo ✅
