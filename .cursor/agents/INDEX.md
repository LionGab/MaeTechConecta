# 📑 Índice - Sistema Multi-Agent

## 📚 Documentação Principal

- **[README.md](./README.md)** - Visão geral completa do sistema
- **[QUICK_START.md](./QUICK_START.md)** - Começar em 3 minutos
- **[INDEX.md](./INDEX.md)** - Este arquivo (índice de referência)

---

## 🤖 Prompts Especializados

### Agentes Especializados

| #   | Agente                | Arquivo                                                        | Foco                  |
| --- | --------------------- | -------------------------------------------------------------- | --------------------- |
| 1️⃣  | **Frontend Master**   | [agent-1-frontend.md](./prompts/agent-1-frontend.md)           | UI/UX React Native    |
| 2️⃣  | **Backend Architect** | [agent-2-backend.md](./prompts/agent-2-backend.md)             | Supabase + PostgreSQL |
| 3️⃣  | **AI Integration**    | [agent-3-ai.md](./prompts/agent-3-ai.md)                       | LLM + Prompts         |
| 4️⃣  | **Design System**     | [agent-4-design-system.md](./prompts/agent-4-design-system.md) | Componentes + Tokens  |
| 5️⃣  | **QA & Testing**      | [agent-5-qa.md](./prompts/agent-5-qa.md)                       | Testes Automatizados  |
| 6️⃣  | **Documentation**     | [agent-6-docs.md](./prompts/agent-6-docs.md)                   | Guias + Docs          |
| 7️⃣  | **Performance**       | [agent-7-performance.md](./prompts/agent-7-performance.md)     | Otimização            |
| 8️⃣  | **Security & LGPD**   | [agent-8-security.md](./prompts/agent-8-security.md)           | Compliance            |

---

## 🔄 Workflows de Execução

| Workflow                | Arquivo                                                      | Quando Usar             |
| ----------------------- | ------------------------------------------------------------ | ----------------------- |
| **Feature Development** | [feature-development.md](./workflows/feature-development.md) | Nova feature completa   |
| **Hotfix**              | [hotfix.md](./workflows/hotfix.md)                           | Bug crítico em produção |
| **Release**             | [release.md](./workflows/release.md)                         | Publicar versão         |

---

## 🚀 Fluxo Rápido

### Para Criar Feature

```bash
# 1. Leia o workflow
cat .cursor/agents/workflows/feature-development.md

# 2. Execute no Cursor Composer
@agent-1-frontend @agent-2-backend Criar [feature]

# 3. Deixe os agentes trabalharem!
```

### Para Bug Crítico

```bash
# 1. Identifique o agente responsável
# 2. Execute hotfix workflow
cat .cursor/agents/workflows/hotfix.md
```

### Para Release

```bash
# 1. Ative todos agentes
@agent-5-qa @agent-7-performance @agent-8-security Release checklist

# 2. Siga workflow de release
cat .cursor/agents/workflows/release.md
```

---

## 💡 Comandos Mais Usados

### Criação Rápida

```bash
# Componente simples
@agent-1-frontend Criar [componente]

# Tabela no banco
@agent-2-backend Criar tabela [nome]

# Integração IA
@agent-3-ai Integrar [modelo] para [feature]

# Documentação
@agent-6-docs Documentar [feature]
```

### Multi-Agent Paralelo

```bash
# Feature completa
@agent-1-frontend @agent-2-backend @agent-4-design-system Criar [feature]

# Release completo
@agent-5-qa @agent-7-performance @agent-8-security Pre-release check
```

---

## 📊 Navegação Visual

```
.cursor/agents/
│
├── 📄 README.md                    ← COMEÇE AQUI
├── 🚀 QUICK_START.md              ← Guia rápido
├── 📑 INDEX.md                    ← Você está aqui
│
├── 🤖 prompts/                    ← Prompts especializados
│   ├── agent-1-frontend.md
│   ├── agent-2-backend.md
│   ├── agent-3-ai.md
│   ├── agent-4-design-system.md
│   ├── agent-5-qa.md
│   ├── agent-6-docs.md
│   ├── agent-7-performance.md
│   └── agent-8-security.md
│
└── 🔄 workflows/                   ← Execuções pré-definidas
    ├── feature-development.md
    ├── hotfix.md
    └── release.md
```

---

## 🎯 Casos de Uso Comuns

| Caso                 | Agentes           | Tempo     |
| -------------------- | ----------------- | --------- |
| Novo componente UI   | Agent 1 + Agent 4 | 2-3 min   |
| Nova tabela no banco | Agent 2           | 1-2 min   |
| Integração com IA    | Agent 3           | 3-5 min   |
| Feature completa     | Todos os 8        | 5-10 min  |
| Bug fix              | Agent relevante   | 1-2 min   |
| Release              | Todos os 8        | 15-30 min |

---

**Última atualização:** 2025-01-XX
**Versão:** 1.0.0

