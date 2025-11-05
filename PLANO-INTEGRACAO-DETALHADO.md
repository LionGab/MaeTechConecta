# 🎯 Plano de Integração Detalhado - Club Valente

## Migração do Projeto Atual para Sistema Multi-Agent

**Data de início:** 30/10/2025
**Prazo:** 4 semanas (MVP completo)
**Status:** 🟡 Em progresso

---

## 📅 CRONOGRAMA DETALHADO

### **SEMANA 1: Integrações Críticas (30/10 - 05/11)**

#### **Dia 1 - Hoje (30/10/2025) 🎯**

**Manhã:**

- [x] Auditoria completa ✅
- [ ] **Migrar ChatScreen para Edge Function `nathia-chat`** 🔥 CRÍTICO
  - Modificar `useChatOptimized.ts` para chamar Edge Function
  - Remover dependência de `ai.ts` no ChatScreen
  - Testar integração completa

- [ ] **Corrigir OnboardingScreen** 🔥 CRÍTICO
  - Usar `signInAnonymously()` ao invés de `signUp` temporário
  - Salvar `userId` no AsyncStorage
  - Criar perfil corretamente no Supabase

**Tarde:**

- [ ] **Adicionar Zustand** 📦 IMPORTANTE
  - Instalar dependência
  - Criar stores básicos:
    - `userStore.ts` (perfil do usuário)
    - `chatStore.ts` (estado do chat)
    - `habitsStore.ts` (hábitos)
  - Migrar `useChatOptimized` para usar Zustand

- [ ] **Configurar Sistema de Agentes** 🤖
  - Criar `.cursor/agents/` completo
  - Configurar Composer
  - Documentar workflow

**Entregável Dia 1:** Chat integrado + Onboarding corrigido + Zustand configurado ✅

---

#### **Dia 2 (31/10/2025)**

**Manhã:**

- [ ] **Migrar `ai.ts` para Edge Functions**
  - Refatorar `chatWithAI()` para chamar `nathia-chat`
  - Remover código duplicado
  - Manter fallback para desenvolvimento local

- [ ] **Integrar RAG/Vector Store** 🧠
  - Configurar pgvector no Supabase
  - Criar Edge Function `generate-embeddings`
  - Criar Edge Function `retrieve-memory`
  - Integrar no `nathia-chat`

**Tarde:**

- [ ] **Implementar Memória Longa**
  - Sistema de resumos hierárquicos (diário/semanal)
  - Memórias-chave marcadas
  - Recuperação semântica via RAG

**Entregável Dia 2:** IA integrada + RAG funcionando ✅

---

#### **Dia 3 (01/11/2025)**

**Manhã:**

- [ ] **Sistema de Hábitos - Backend** 💪
  - Criar services `habitsService.ts`
  - APIs para CRUD de hábitos
  - APIs para completions
  - Calcular streaks

**Tarde:**

- [ ] **Sistema de Hábitos - Frontend**
  - Tela `HabitsScreen.tsx`
  - Componentes: `HabitCard`, `HabitCheckbox`
  - Hook `useHabits.ts`
  - Integração com Zustand store

**Entregável Dia 3:** Sistema de Hábitos funcional ✅

---

#### **Dia 4 (02/11/2025)**

**Manhã:**

- [ ] **Feed de Conteúdos - Backend** 📰
  - Criar services `contentService.ts`
  - APIs para buscar conteúdos
  - APIs para favoritos
  - Player service (vídeo/áudio)

**Tarde:**

- [ ] **Feed de Conteúdos - Frontend**
  - Tela `ContentScreen.tsx`
  - Componentes: `ContentCard`, `ContentPlayer`
  - Hook `useContent.ts`
  - Integração Expo AV

**Entregável Dia 4:** Feed de Conteúdos funcional ✅

---

#### **Dia 5 (03/11/2025)**

**Manhã:**

- [ ] **Melhorias de UX**
  - Loading states consistentes
  - Error boundaries
  - Skeleton screens onde falta
  - Animações polidas

**Tarde:**

- [ ] **Testes de Integração**
  - Testar fluxo completo: Onboarding → Chat → Hábitos → Conteúdos
  - Testar Edge Functions
  - Testar RAG/Vector Store
  - Correções de bugs

**Entregável Dia 5:** MVP funcional integrado ✅

---

### **SEMANA 2: Melhorias Avançadas (06/11 - 12/11)**

#### **Dia 6-7 (06-07/11):**

- [ ] Onboarding com áudio (Expo AV)
- [ ] Gravação de áudio funcional
- [ ] Transcrição via Edge Function

#### **Dia 8-9 (08-09/11):**

- [ ] Memória longa avançada (resumos automáticos)
- [ ] Análise comportamental ativa (1x/dia)
- [ ] Sugestões personalizadas de conteúdo

#### **Dia 10 (10/11):**

- [ ] Notificações inteligentes
- [ ] Lembretes de hábitos
- [ ] Notificações push configuradas

---

### **SEMANA 3: LGPD & Segurança (13/11 - 19/11)**

#### **Dia 11-12 (13-14/11):**

- [ ] UI LGPD completa:
  - Tela de exportar dados
  - Tela de deletar conta
  - Política de privacidade
  - Termos de uso

#### **Dia 13-14 (15-16/11):**

- [ ] Security audit completo
- [ ] RLS policies revisadas
- [ ] Compliance LGPD finalizado

---

### **SEMANA 4: Polish & Deploy (20/11 - 26/11)**

#### **Dia 15-17 (20-22/11):**

- [ ] Testes E2E completos
- [ ] Performance optimization
- [ ] Acessibilidade final (WCAG 2.1 AA)

#### **Dia 18-19 (23-24/11):**

- [ ] Documentação completa
- [ ] Guias de usuário
- [ ] Preparação para deploy

#### **Dia 20 (25/11):**

- [ ] Deploy TestFlight (iOS)
- [ ] Deploy Internal Testing (Android)
- [ ] Beta testing interno

---

## 🔧 INTEGRAÇÕES TÉCNICAS DETALHADAS

### **1. Migração ChatScreen → Edge Function**

**Problema Atual:**

```typescript
// src/services/ai.ts
chatWithAI() → Claude API direto ❌

// src/hooks/useChatOptimized.ts
Usa ai.ts → Claude direto ❌
```

**Solução:**

```typescript
// src/services/ai.ts (REFATORAR)
chatWithAI() →
  supabase.functions.invoke('nathia-chat') →
  Gemini 2.0 Flash ✅

// src/hooks/useChatOptimized.ts
Usa ai.ts → Edge Function ✅
```

**Passos:**

1. Modificar `src/services/ai.ts`:
   - Criar função `chatWithNATIA()` que chama Edge Function
   - Manter `chatWithAI()` como fallback (dev)
   - Remover código Claude direto

2. Modificar `src/hooks/useChatOptimized.ts`:
   - Chamar `chatWithNATIA()` ao invés de `chatWithAI()`
   - Adicionar tratamento de erro específico
   - Integrar com Zustand store

3. Testar integração:
   - Mensagem simples
   - Mensagem com risco
   - Mensagem bloqueada
   - Moderação funcionando

---

### **2. Correção OnboardingScreen**

**Problema Atual:**

```typescript
// src/screens/OnboardingScreen.tsx
supabase.auth.signUp({
  email: `${Date.now()}@temp.com`, // ❌ Email temporário
  password: `${Date.now()}-${Math.random()}`, // ❌ Senha temporária
});
// Não salva userId no AsyncStorage ❌
```

**Solução:**

```typescript
// Usar signInAnonymously() ✅
const {
  data: { user },
} = await supabase.auth.signInAnonymously();
// Salvar userId no AsyncStorage ✅
await AsyncStorage.setItem('userId', user.id);
// Criar perfil corretamente ✅
```

---

### **3. Adicionar Zustand**

**Instalação:**

```bash
npm install zustand
```

**Stores a Criar:**

- `src/stores/userStore.ts` - Perfil do usuário
- `src/stores/chatStore.ts` - Estado do chat
- `src/stores/habitsStore.ts` - Hábitos
- `src/stores/contentStore.ts` - Conteúdos

**Exemplo UserStore:**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userId: string | null;
  profile: UserProfile | null;
  setUserId: (id: string) => void;
  setProfile: (profile: UserProfile) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      profile: null,
      setUserId: (id) => set({ userId: id }),
      setProfile: (profile) => set({ profile }),
    }),
    { name: 'user-storage' }
  )
);
```

---

### **4. Sistema de Hábitos**

**Estrutura:**

```
src/
├── features/
│   └── habits/
│       ├── HabitsScreen.tsx
│       ├── components/
│       │   ├── HabitCard.tsx
│       │   ├── HabitCheckbox.tsx
│       │   └── HabitProgress.tsx
│       ├── hooks/
│       │   └── useHabits.ts
│       └── services/
│           └── habitsService.ts
```

**Hábitos Pré-definidos (5):**

1. Respiração/pausa de 2 min
2. Check-in emocional 1x/dia
3. 10 min de descanso/alongamento
4. 1 pedido de ajuda por dia
5. 1 conteúdo que ajudou hoje

---

### **5. Feed de Conteúdos**

**Estrutura:**

```
src/
├── features/
│   └── content/
│       ├── ContentScreen.tsx
│       ├── components/
│       │   ├── ContentCard.tsx
│       │   ├── ContentPlayer.tsx
│       │   └── ContentFilters.tsx
│       ├── hooks/
│       │   └── useContent.ts
│       └── services/
│           └── contentService.ts
```

**Funcionalidades:**

- Lista de conteúdos (artigo, vídeo, áudio, post)
- Filtros por categoria/tipo
- Busca por texto
- Favoritos
- Player nativo (Expo AV)
- Download offline (opcional)

---

## 📊 CHECKLIST DE PROGRESSO

### **Integrações Críticas:**

- [ ] ChatScreen → Edge Function ✅
- [ ] Onboarding corrigido ⬜
- [ ] Zustand adicionado ⬜
- [ ] RAG/Vector Store ⬜

### **Features Core:**

- [ ] Hábitos implementado ⬜
- [ ] Conteúdos implementado ⬜
- [ ] Favoritos ⬜
- [ ] Busca ⬜

### **Melhorias:**

- [ ] Onboarding com áudio ⬜
- [ ] Memória longa avançada ⬜
- [ ] Notificações inteligentes ⬜
- [ ] LGPD UI ⬜

---

## 🚀 PRÓXIMO PASSO IMEDIATO

**AGORA:** Começar migração do ChatScreen para Edge Function!
