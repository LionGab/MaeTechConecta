# 🚀 Plano de Migração: LionNath → NathaliaValente

**Data:** 2025-11-06  
**Objetivo:** Migrar código e features do LionNath (React Native) para NathaliaValente (PWA React + Vite)

---

## 📋 VISÃO GERAL DA MIGRAÇÃO

### **Estratégia:**
Converter LionNath (React Native Mobile App) para PWA React mantendo:
- ✅ Features de IA (NathIA)
- ✅ Edge Functions do Supabase
- ✅ Design System
- ✅ Arquitetura modular

---

## 🎯 OBJETIVOS DA MIGRAÇÃO

1. **Manter features do LionNath** (IA, moderação, detecção de crises)
2. **Adotar estrutura do NathaliaValente** (PWA React + Vite)
3. **Consolidar em um único projeto** PWA
4. **Manter escalabilidade** (monorepo se possível)

---

## 📊 ANÁLISE DE COMPATIBILIDADE

### **Compatível (Pode migrar direto):**
- ✅ **Backend Supabase** - Mesmo backend
- ✅ **Edge Functions** - Funcionam igual
- ✅ **Lógica de IA** - Pode ser adaptada
- ✅ **Design System** - Pode ser convertido para TailwindCSS
- ✅ **Schemas Zod** - Funcionam igual
- ✅ **Autenticação** - Supabase Auth funciona igual

### **Precisa Adaptar:**
- 🔄 **React Native → React** - Componentes precisam ser reescritos
- 🔄 **Expo → Vite** - Build system diferente
- 🔄 **React Navigation → React Router** - Navegação diferente
- 🔄 **AsyncStorage → localStorage** - Storage diferente
- 🔄 **Native Components → Web Components** - UI precisa adaptação

### **Não Compatível (Precisa Recriar):**
- ❌ **Push Notifications** - PWA usa Service Worker
- ❌ **Biometria** - Web APIs diferentes
- ❌ **Câmera/Galeria** - APIs diferentes
- ❌ **Deep Linking** - PWA usa URL routing

---

## 🔧 ETAPAS DA MIGRAÇÃO

### **FASE 1: Preparação (1-2 dias)**

#### 1.1. Clonar e Analisar NathaliaValente
```bash
git clone https://github.com/LionGab/NathaliaValente.git
cd NathaliaValente
npm install
npm run dev
```

#### 1.2. Criar Branch de Migração
```bash
git checkout -b feat/migrate-lionnath-features
```

#### 1.3. Mapear Features a Migrar
- [ ] Sistema NAT-IA (Edge Functions já existem)
- [ ] Design System (converter para TailwindCSS)
- [ ] Schemas Zod (copiar direto)
- [ ] Lógica de negócio (adaptar para React)

---

### **FASE 2: Migração de Código Compartilhado (2-3 dias)**

#### 2.1. Migrar Schemas Zod
```bash
# De: LionNath/packages/shared/src/schemas/
# Para: NathaliaValente/src/lib/schemas/

# Copiar:
- user-profile.ts
- chat-message.ts
- risk-analysis.ts
```

#### 2.2. Migrar Lógica de IA (Adaptar)
```bash
# De: LionNath/packages/shared/src/nat-ai/
# Para: NathaliaValente/src/lib/nat-ai/

# Adaptar para web:
- guardrails.ts (manter lógica)
- risk-analyzer.ts (manter lógica)
- context-manager.ts (adaptar AsyncStorage → localStorage)
```

#### 2.3. Migrar Edge Functions (Já funcionam)
```bash
# Edge Functions do Supabase funcionam igual
# Copiar de: LionNath/infra/supabase/functions/
# Para: NathaliaValente/supabase/functions/
```

---

### **FASE 3: Migração de Features (1-2 semanas)**

#### 3.1. Sistema de Chat (NathIA)
**Objetivo:** Implementar chat com IA no PWA

**Passos:**
1. Criar componente `ChatScreen.tsx` (React)
2. Adaptar hook `useChatOptimized` para React (remover RN)
3. Integrar com Edge Function `nathia-chat`
4. Implementar UI web (similar ao mobile)

**Arquivos a criar:**
```
src/
├── features/
│   └── chat/
│       ├── ChatScreen.tsx
│       ├── MessageItem.tsx
│       ├── useChat.ts (hook adaptado)
│       └── components/
│           └── TypingIndicator.tsx
```

#### 3.2. Sistema de Hábitos
**Objetivo:** Implementar tracking de hábitos no PWA

**Passos:**
1. Criar componente `HabitsScreen.tsx`
2. Adaptar lógica de hábitos
3. Integrar com Supabase

**Arquivos a criar:**
```
src/features/habits/
├── HabitsScreen.tsx
├── HabitCard.tsx
├── useHabits.ts
└── services/
    └── habitsService.ts
```

#### 3.3. Feed de Conteúdos
**Objetivo:** Implementar feed de conteúdos

**Passos:**
1. Criar componente `ContentFeedScreen.tsx`
2. Adaptar lógica de conteúdo
3. Implementar player de vídeo/áudio (web)

**Arquivos a criar:**
```
src/features/content/
├── ContentFeedScreen.tsx
├── ContentCard.tsx
├── ContentPlayer.tsx
└── useContent.ts
```

#### 3.4. Onboarding
**Objetivo:** Implementar onboarding web

**Passos:**
1. Criar componente `OnboardingScreen.tsx`
2. Adaptar para web (sem AsyncStorage)
3. Implementar consentimento LGPD

---

### **FASE 4: Adaptação de UI/UX (1 semana)**

#### 4.1. Converter Design System
**Objetivo:** Adaptar Bubblegum para TailwindCSS

**Passos:**
1. Criar tema TailwindCSS baseado no Bubblegum
2. Converter componentes para TailwindCSS
3. Manter dark mode

**Arquivo a criar:**
```
tailwind.config.js
# Adicionar cores do Bubblegum
```

#### 4.2. Adaptar Componentes
**Componentes a adaptar:**
- Button (RN → React + TailwindCSS)
- Card (RN → React + TailwindCSS)
- Input (RN → React + TailwindCSS)
- Badge (RN → React + TailwindCSS)

---

### **FASE 5: Integração e Testes (1 semana)**

#### 5.1. Integrar Edge Functions
- Verificar se Edge Functions funcionam
- Testar rate limiting
- Testar RLS

#### 5.2. Testes
- Adaptar testes unitários
- Criar testes E2E (Playwright)
- Testar fluxos principais

#### 5.3. Performance
- Otimizar bundle size
- Implementar code splitting
- Configurar Service Worker

---

## 📁 ESTRUTURA FINAL (NathaliaValente + LionNath)

```
nathalia-valente/
├── src/
│   ├── components/
│   │   ├── ui/              # Design System (TailwindCSS)
│   │   └── shared/          # Componentes compartilhados
│   ├── features/
│   │   ├── auth/            # ✅ Já existe
│   │   ├── chat/            # 🆕 Migrar do LionNath
│   │   ├── habits/          # 🆕 Migrar do LionNath
│   │   ├── content/         # 🆕 Migrar do LionNath
│   │   ├── groups/          # ✅ Já existe
│   │   └── posts/           # ✅ Já existe
│   ├── lib/
│   │   ├── supabase.ts      # ✅ Já existe
│   │   ├── nat-ai/          # 🆕 Migrar do LionNath
│   │   │   ├── guardrails.ts
│   │   │   ├── risk-analyzer.ts
│   │   │   └── context-manager.ts
│   │   └── schemas/         # 🆕 Migrar do LionNath
│   ├── hooks/               # 🆕 Adaptar hooks do LionNath
│   ├── services/            # 🆕 Adaptar serviços
│   └── utils/               # 🆕 Migrar utils
│
├── supabase/
│   └── functions/           # ✅ Edge Functions do LionNath
│       ├── nathia-chat/
│       ├── moderation-service/
│       ├── risk-classifier/
│       └── ...
│
└── public/                  # Assets
```

---

## 🔄 CHECKLIST DE MIGRAÇÃO

### **Preparação**
- [ ] Clonar NathaliaValente
- [ ] Criar branch de migração
- [ ] Instalar dependências
- [ ] Configurar ambiente

### **Código Compartilhado**
- [ ] Migrar schemas Zod
- [ ] Migrar lógica de IA
- [ ] Migrar Edge Functions
- [ ] Migrar utils

### **Features**
- [ ] Sistema de Chat (NathIA)
- [ ] Sistema de Hábitos
- [ ] Feed de Conteúdos
- [ ] Onboarding
- [ ] Perfil

### **UI/UX**
- [ ] Converter Design System
- [ ] Adaptar componentes
- [ ] Implementar dark mode
- [ ] Otimizar mobile

### **Integração**
- [ ] Testar Edge Functions
- [ ] Testar autenticação
- [ ] Testar fluxos
- [ ] Performance

### **Testes**
- [ ] Testes unitários
- [ ] Testes E2E
- [ ] Coverage

### **Deploy**
- [ ] Build de produção
- [ ] Deploy Netlify
- [ ] Verificar funcionamento

---

## ⚠️ DESAFIOS E SOLUÇÕES

### **Desafio 1: React Native → React**
**Problema:** Componentes RN não funcionam no web

**Solução:**
- Recrear componentes usando React + TailwindCSS
- Manter mesma API quando possível
- Adaptar comportamento específico do mobile

---

### **Desafio 2: AsyncStorage → localStorage**
**Problema:** AsyncStorage é async, localStorage é sync

**Solução:**
```typescript
// Criar wrapper compatível
const storage = {
  async getItem(key: string) {
    return localStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  },
  async removeItem(key: string) {
    localStorage.removeItem(key);
  }
};
```

---

### **Desafio 3: React Navigation → React Router**
**Problema:** Navegação diferente

**Solução:**
- Usar React Router (já padrão no NathaliaValente)
- Adaptar rotas
- Manter mesmo fluxo de navegação

---

### **Desafio 4: Push Notifications**
**Problema:** PWA usa Service Worker

**Solução:**
- Implementar notificações via Service Worker
- Usar Web Push API
- Integrar com Supabase

---

## 📅 TIMELINE ESTIMADA

```
Semana 1: Preparação + Código Compartilhado
Semana 2: Features (Chat, Hábitos, Conteúdos)
Semana 3: UI/UX + Adaptação
Semana 4: Integração + Testes + Deploy
```

**Total:** 4 semanas

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. **Clonar NathaliaValente**
2. **Analisar estrutura atual**
3. **Criar branch de migração**
4. **Começar com código compartilhado** (schemas, utils)

---

**Próximo passo:** Posso começar a migração agora? Qual parte você quer que eu comece primeiro?

