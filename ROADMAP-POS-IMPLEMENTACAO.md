# 🗺️ Roadmap Pós-Implementação - Nossa Maternidade

## 📋 Status Atual

✅ **Estrutura Monorepo Completa**
- ✅ Monorepo configurado (pnpm + turbo)
- ✅ Packages compartilhados criados
- ✅ CI/CD unificado
- ✅ Testes configurados (70% coverage)
- ✅ Observabilidade (Sentry)
- ✅ Documentação consolidada

---

## 🚀 Fase 1: Migração Física (1-2 dias)

### Objetivo
Mover arquivos físicos para a estrutura do monorepo.

### Tarefas
- [ ] **Executar migração física**
  ```powershell
  .\scripts\migrate-monorepo.ps1
  ```
  - Migrar `src/` → `apps/mobile/src/`
  - Migrar `App.tsx` → `apps/mobile/App.tsx`
  - Migrar `assets/` → `apps/mobile/assets/`
  - Migrar `supabase/` → `infra/supabase/`

- [ ] **Atualizar imports**
  ```powershell
  .\scripts\update-imports-monorepo.ps1
  ```
  - Substituir `@/lib/nat-ai` → `@shared/nat-ai`
  - Substituir `@/theme` → `@shared/theme`
  - Substituir `@/utils` → `@shared/utils`

- [ ] **Testar build**
  ```bash
  pnpm install
  pnpm build
  pnpm test
  ```

### Critérios de Sucesso
- ✅ Build passa sem erros
- ✅ Testes passam
- ✅ Imports funcionam corretamente

---

## 🎯 Fase 2: Implementações Específicas (1-2 semanas)

### 2.1 Gestão de Estado (Zustand)

**Objetivo:** Implementar stores Zustand para estado global.

**Tarefas:**
- [ ] Criar `apps/mobile/src/stores/authStore.ts`
  ```typescript
  import { create } from 'zustand';
  
  interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
  }
  
  export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: async (email, password) => {
      // Implementar login
    },
    logout: () => {
      // Implementar logout
    },
  }));
  ```

- [ ] Criar `apps/mobile/src/stores/chatStore.ts`
  - Estado de mensagens
  - Estado de loading
  - Funções de chat

- [ ] Criar `apps/mobile/src/stores/userStore.ts`
  - Perfil do usuário
  - Preferências
  - Dados do usuário

### 2.2 Paginação e Cache

**Objetivo:** Implementar paginação e cache para melhor performance.

**Tarefas:**
- [ ] Adicionar React Query
  ```bash
  pnpm add @tanstack/react-query
  ```

- [ ] Criar hooks de paginação
  ```typescript
  // apps/mobile/src/hooks/usePaginatedQuery.ts
  export const usePaginatedQuery = (key: string, fetcher: Function) => {
    // Implementar paginação
  };
  ```

- [ ] Implementar cache para:
  - Mensagens de chat
  - Conteúdo do feed
  - Dados do usuário

### 2.3 Índices SQL

**Objetivo:** Criar índices críticos para performance do banco.

**Tarefas:**
- [ ] Criar migration de índices
  ```sql
  -- infra/supabase/migrations/20250105_performance_indexes.sql
  CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created 
    ON chat_messages(user_id, created_at DESC);
  
  CREATE INDEX IF NOT EXISTS idx_rate_limit_events_user_ep_time 
    ON rate_limit_events(user_id, endpoint, created_at DESC);
  ```

---

## 🚀 Fase 3: Otimizações (1-2 semanas)

### 3.1 Performance Mobile

**Objetivo:** Otimizar FlatList e lazy loading.

**Tarefas:**
- [ ] Otimizar FlatList
  ```typescript
  <FlatList
    windowSize={10}
    maxToRenderPerBatch={10}
    removeClippedSubviews={true}
    // ...
  />
  ```

- [ ] Implementar lazy loading de screens
- [ ] Adicionar memoização de componentes pesados

### 3.2 Analytics

**Objetivo:** Adicionar analytics para tracking de eventos.

**Tarefas:**
- [ ] Adicionar Amplitude ou Mixpanel
  ```bash
  pnpm add @amplitude/analytics-react-native
  ```

- [ ] Criar hooks de analytics
  ```typescript
  // apps/mobile/src/hooks/useAnalytics.ts
  export const useAnalytics = () => {
    const trackEvent = (event: string, properties?: object) => {
      // Implementar tracking
    };
    return { trackEvent };
  };
  ```

### 3.3 Monitoramento Completo

**Objetivo:** Expandir monitoramento com métricas customizadas.

**Tarefas:**
- [ ] Adicionar métricas customizadas no Sentry
- [ ] Criar dashboards de performance
- [ ] Implementar alertas automáticos

---

## 📊 Fase 4: Melhorias Contínuas (Ongoing)

### 4.1 Design System

**Tarefas:**
- [ ] Adicionar Storybook (opcional)
- [ ] Exportar tokens em JSON
- [ ] Criar guia de componentes

### 4.2 Testes

**Tarefas:**
- [ ] Aumentar cobertura para 80%+
- [ ] Adicionar testes de integração
- [ ] Expandir E2E (fluxos completos)

### 4.3 Documentação

**Tarefas:**
- [ ] Atualizar README principal
- [ ] Criar guias de contribuição
- [ ] Documentar APIs

---

## 🎯 Prioridades

### 🔴 Alta Prioridade (Fase 1)
1. ✅ Migração física de arquivos
2. ✅ Atualização de imports
3. ✅ Testes de build

### 🟡 Média Prioridade (Fase 2)
1. ⚠️ Implementar stores Zustand
2. ⚠️ Adicionar paginação e cache
3. ⚠️ Criar índices SQL

### 🟢 Baixa Prioridade (Fase 3+)
1. ⚠️ Otimizações de performance
2. ⚠️ Analytics
3. ⚠️ Melhorias contínuas

---

## ✅ Checklist Final

### Estrutura
- [x] ✅ Monorepo configurado
- [x] ✅ Packages compartilhados criados
- [x] ✅ CI/CD unificado
- [ ] ⚠️ Migração física executada

### Implementações
- [ ] ⚠️ Stores Zustand implementadas
- [ ] ⚠️ Paginação e cache implementados
- [ ] ⚠️ Índices SQL criados

### Otimizações
- [ ] ⚠️ FlatList otimizado
- [ ] ⚠️ Analytics configurado
- [ ] ⚠️ Monitoramento expandido

---

## 📝 Notas

- ✅ **Estrutura base:** 100% completa
- ⚠️ **Migração física:** Pendente (executar scripts)
- ⚠️ **Implementações específicas:** Estrutura pronta, falta implementar
- ⚠️ **Otimizações:** Estrutura pronta, falta implementar

**Status:** ✅ **PRONTO PARA MIGRAÇÃO FÍSICA**

