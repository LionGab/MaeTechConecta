# 🎯 Sistema de Agentes Multi-Agent - Club Valente

## Configuração para Cursor 2.0 Multi-Agent Interface

**Data de criação:** 30/10/2025
**Versão:** 1.0.0
**Objetivo:** MVP funcional em 6-8 semanas

---

## 🏗️ Arquitetura de Agentes

### **Agent 1: Frontend Architect**

**Workspace:** `agent-frontend/`
**Responsabilidade:** React Native + Expo + UI Components
**Skills:** TypeScript, React Native, Expo SDK 52, Zustand, Design Systems

### **Agent 2: Backend Engineer**

**Workspace:** `agent-backend/`
**Responsabilidade:** Supabase + Edge Functions + Database
**Skills:** Supabase, PostgreSQL, Deno, Edge Functions, RLS

### **Agent 3: IA Integration Specialist**

**Workspace:** `agent-ia/`
**Responsabilidade:** Gemini 2.0 Flash + Prompt System + Moderation
**Skills:** Gemini API, Prompt Engineering, LLM Safety, Vector DB

### **Agent 4: Design System Engineer**

**Workspace:** `agent-design/`
**Responsabilidade:** Component Library + Acessibilidade + UX
**Skills:** Design Tokens, WCAG 2.1, React Native Components, Animations

### **Agent 5: QA & Testing**

**Workspace:** `agent-qa/`
**Responsabilidade:** E2E Tests + Unit Tests + Accessibility
**Skills:** Playwright, Jest, React Native Testing Library, Browser E2E

### **Agent 6: Security & Compliance**

**Workspace:** `agent-security/`
**Responsabilidade:** LGPD + Security + Privacy
**Skills:** LGPD Compliance, Security Audits, Privacy by Design, RIPD

### **Agent 7: DevOps & Performance**

**Workspace:** `agent-devops/`
**Responsabilidade:** Build + Deploy + Monitoring + Optimization
**Skills:** Expo EAS, GitHub Actions, Performance Optimization, Monitoring

### **Agent 8: Documentation & UX Writer**

**Workspace:** `agent-docs/`
**Responsabilidade:** Docs + UX Copy + User Guides
**Skills:** Technical Writing, UX Copy, User Guides, API Documentation

---

## 🔧 Configuração do Workspace

### Estrutura de Pastas Multi-Agent:

```
club-valente/
├── agent-frontend/     # Git worktree 1
├── agent-backend/      # Git worktree 2
├── agent-ia/          # Git worktree 3
├── agent-design/      # Git worktree 4
├── agent-qa/          # Git worktree 5
├── agent-security/    # Git worktree 6
├── agent-devops/      # Git worktree 7
├── agent-docs/        # Git worktree 8
├── shared/            # Código compartilhado
│   ├── types/
│   ├── utils/
│   └── config/
└── .cursor/
    ├── agents/
    │   ├── system-config.md (este arquivo)
    │   ├── prompts/
    │   └── workflows/
    └── composer-config.json
```

---

## 📋 Configuração do Cursor 2.0

### `.cursor/composer-config.json`

```json
{
  "multiAgent": {
    "enabled": true,
    "maxAgents": 8,
    "isolateWorkspaces": true,
    "gitWorktrees": true
  },
  "agents": {
    "frontend": {
      "workspace": "agent-frontend",
      "model": "composer",
      "instructions": "Você é um senior mobile architect especializado em React Native + Expo. Foco em performance, acessibilidade e UX."
    },
    "backend": {
      "workspace": "agent-backend",
      "model": "composer",
      "instructions": "Você é um backend engineer especializado em Supabase, Edge Functions e PostgreSQL. Foco em segurança, escalabilidade e LGPD."
    },
    "ia": {
      "workspace": "agent-ia",
      "model": "composer",
      "instructions": "Você é um especialista em LLMs e prompt engineering. Especializado em Gemini 2.0 Flash, segurança de IA e sistemas conversacionais."
    },
    "design": {
      "workspace": "agent-design",
      "model": "composer",
      "instructions": "Você é um design system engineer. Foco em componentes reutilizáveis, acessibilidade WCAG 2.1 e UX acolhedor."
    },
    "qa": {
      "workspace": "agent-qa",
      "model": "composer",
      "instructions": "Você é um QA engineer especializado em testes E2E, unit tests e acessibilidade. Foco em automação e coverage."
    },
    "security": {
      "workspace": "agent-security",
      "model": "composer",
      "instructions": "Você é um security engineer especializado em LGPD, privacy by design e compliance. Foco em proteção de dados sensíveis."
    },
    "devops": {
      "workspace": "agent-devops",
      "model": "composer",
      "instructions": "Você é um DevOps engineer especializado em CI/CD, monitoring e performance. Foco em Expo EAS e otimização."
    },
    "docs": {
      "workspace": "agent-docs",
      "model": "composer",
      "instructions": "Você é um technical writer e UX writer. Foco em documentação clara, UX copy acolhedor e guias de usuário."
    }
  },
  "browser": {
    "enabled": true,
    "e2eTests": true,
    "automated": true
  },
  "sandbox": {
    "enabled": true,
    "restrictNetwork": true,
    "auditLogs": true
  }
}
```

---

## 🚀 Workflows de Execução

### Workflow 1: Setup Inicial (Dia 1-2)

**Comando para Cursor Composer:**

```
"Configure projeto Club Valente completo:

1. Agent Frontend: Crie estrutura React Native + Expo SDK 52
2. Agent Backend: Configure Supabase com schema completo
3. Agent IA: Configure Gemini 2.0 Flash + Edge Functions
4. Agent Design: Crie design system base
5. Agent Security: Configure LGPD compliance básico
6. Agent DevOps: Setup EAS Build + CI/CD

Todos os agentes trabalham em paralelo. Use git worktrees para isolamento."
```

---

### Workflow 2: Feature Development

**Template padrão:**

```
"Desenvolva feature [NOME]:

Agent Frontend: UI/UX da feature
Agent Backend: APIs/Edge Functions necessárias
Agent IA: Integração com Gemini se necessário
Agent Design: Componentes do design system
Agent QA: Testes E2E + unit tests
Agent Security: Revisão de segurança e LGPD
Agent Docs: Documentação da feature

Tempo máximo: 2 horas. Todos em paralelo."
```

---

## 📊 Métricas de Sucesso

### Por Agente:

- **Agent Frontend:** Componentes acessíveis (WCAG 2.1 AA), <60fps, TypeScript strict
- **Agent Backend:** Edge Functions <500ms, RLS ativo, 99.9% uptime
- **Agent IA:** Latência <2s, 99% recusa médica correta, zero false positives críticos
- **Agent Design:** 100% componentes documentados, 0 contrast errors
- **Agent QA:** Coverage >80%, todos testes E2E passando
- **Agent Security:** LGPD compliant, zero vulnerabilidades críticas
- **Agent DevOps:** Build <10min, deploy <5min
- **Agent Docs:** 100% features documentadas, UX copy revisado

---

## 🎯 Plano de Execução Detalhado

Ver arquivo: `plano-execucao-semanal.md`

