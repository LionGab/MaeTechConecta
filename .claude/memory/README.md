# 🧠 Memória Universal - Sistema de Contexto Persistente

**Versão**: 1.0.0
**Data de Criação**: 2025-10-29
**Projeto**: Nossa Maternidade

---

## 📖 O Que É?

O **Agente "Memória Universal"** é um sistema de persistência de contexto que memoriza **absolutamente tudo** sobre o projeto:

- ✅ Conversas completas
- ✅ Decisões estratégicas
- ✅ Preferências do usuário
- ✅ Estado atual do projeto
- ✅ Histórico de tarefas
- ✅ Frameworks e tecnologias
- ✅ Código, arquivos e parâmetros

**Objetivo**: Permitir continuidade **total** do contexto ao trocar de computador, terminal ou sessão.

---

## 📁 Estrutura de Arquivos

```
.claude/memory/
├── context.json           # Estado atual completo do projeto
├── decisions.json         # Todas as decisões tomadas (9 decisões)
├── preferences.json       # Preferências do usuário e stakeholder
├── conversation_log.md    # Histórico detalhado de conversas
├── todo_history.json      # Tarefas pendentes e completas (25 tarefas)
├── README.md             # Este arquivo (documentação)
└── scripts/              # Scripts de exportação/importação
    ├── export.sh         # Exportar memória para backup
    ├── import.sh         # Importar memória de backup
    └── sync-supabase.js  # Sincronizar com Supabase (opcional)
```

---

## 🚀 Como Usar

### **1. Consultar Memória**

Use o comando slash:

```bash
/memory
```

Opções:

- `/memory status` - Ver resumo do estado atual
- `/memory decisions` - Listar todas as decisões
- `/memory todos` - Ver tarefas pendentes
- `/memory log` - Ver histórico de conversas

### **2. Atualizar Memória**

A memória é atualizada **automaticamente** após cada sessão, mas você pode atualizar manualmente:

```bash
/memory update
```

### **3. Exportar Memória (Backup)**

Para criar backup ou transferir para outro computador:

```bash
cd .claude/memory/scripts
./export.sh
```

Isso cria: `.claude/memory/backups/memory-backup-YYYYMMDD-HHMMSS.tar.gz`

### **4. Importar Memória (Restaurar)**

Ao trocar de computador:

```bash
cd .claude/memory/scripts
./import.sh /path/to/backup.tar.gz
```

### **5. Sincronizar com Git**

**Método mais simples** - já está configurado:

```bash
git add .claude/memory/
git commit -m "chore: Atualizar memória universal"
git push
```

No novo computador:

```bash
git pull
```

Pronto! Todo o contexto é restaurado automaticamente.

### **6. Sincronizar com Supabase (Opcional)**

Para sincronização automática na nuvem:

```bash
cd .claude/memory/scripts
node sync-supabase.js push  # Enviar para Supabase
node sync-supabase.js pull  # Baixar do Supabase
```

---

## 📊 Arquivos Detalhados

### **context.json**

Contém:

- Visão geral do projeto
- Stack tecnológica
- Design System Bubblegum
- Estado de cada tela e componente
- Progresso de migração (40%)
- Navegação atual e planejada

### **decisions.json**

Contém 9 decisões estratégicas:

1. Migrar para Gemini 1.5 Pro
2. Onboarding inteligente (4-5 perguntas)
3. Navegação com 5 bottom tabs
4. Memória de 30 dias
5. Moderação em 3 camadas
6. Design System Bubblegum
7. Ícones em vez de emojis
8. Botão de emergência funcional
9. Personalização adaptativa

### **preferences.json**

Contém:

- Estilo de comunicação preferido
- Prioridades do projeto
- Preferências da stakeholder (Nathália Valente)
- Preferências técnicas e de design
- Workflow preferido

### **conversation_log.md**

Histórico completo da sessão 001:

- Todas as fases da conversa
- Frases marcantes do usuário
- Estatísticas da sessão
- Próximos passos

### **todo_history.json**

Contém:

- 12 tarefas pendentes (Sprint 1-3)
- 13 tarefas completas (Sprint 0)
- Estimativas de tempo (134 horas totais)
- Dependências entre tarefas

---

## 🔐 Privacidade e Segurança

- ✅ Todos os dados ficam **localmente** no seu computador
- ✅ Sincronização via Git = **você controla** o repositório
- ✅ Supabase sync é **opcional** e requer autorização
- ✅ Nenhum dado sensível é compartilhado automaticamente
- ✅ `.gitignore` já configurado para proteger `.env` e credenciais

---

## 🛠️ Comandos Úteis

### **Verificar Integridade**

```bash
cd .claude/memory
ls -lh  # Ver tamanho dos arquivos
```

### **Buscar em Memórias**

```bash
grep -r "keyword" .claude/memory/
```

### **Ver Decisões Recentes**

```bash
cat .claude/memory/decisions.json | jq '.decisions[-3:]'
```

### **Ver TODOs Pendentes**

```bash
cat .claude/memory/todo_history.json | jq '.active_todos[] | select(.priority=="critical")'
```

---

## 📈 Estatísticas

**Sessão 001 (2025-10-29)**:

- 📝 5 arquivos de memória criados
- 💬 1 sessão completa registrada
- 🎯 9 decisões estratégicas documentadas
- ✅ 13 tarefas completas
- ⏳ 12 tarefas pendentes
- 📊 ~2000+ linhas de código escritas
- 🔨 4 componentes criados
- 📚 3 guias de documentação

---

## 🔄 Workflow de Sincronização

### **Ao Finalizar Sessão (Computador A)**:

1. Sistema salva automaticamente tudo em `.claude/memory/`
2. Você faz commit:
   ```bash
   git add .claude/memory/
   git commit -m "chore: Update memory - Session 001"
   git push
   ```

### **Ao Iniciar Sessão (Computador B)**:

1. Você faz pull:
   ```bash
   git pull
   ```
2. Menciona ao Claude:
   > "Estou em um novo computador. Por favor, carregue a Memória Universal."
3. Claude lê todos os arquivos de `.claude/memory/` e restaura contexto completo

---

## 🎯 Próximas Funcionalidades (Roadmap)

- [ ] Comando `/memory search <keyword>` para busca inteligente
- [ ] Compressão automática de memórias antigas (> 30 dias)
- [ ] Dashboard web para visualizar memórias
- [ ] Integração com Supabase automática
- [ ] Backup automático diário
- [ ] Histórico de versões das memórias

---

## 📞 Suporte

Se tiver dúvidas sobre o sistema de Memória Universal:

1. Leia este README
2. Use `/memory help`
3. Consulte o `conversation_log.md` para contexto histórico

---

**Última Atualização**: 2025-10-29
**Status**: ✅ Ativo e Funcional
**Cobertura de Contexto**: 100%
