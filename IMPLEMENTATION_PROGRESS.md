# 🚀 PROGRESSO DA IMPLEMENTAÇÃO - Nossa Maternidade

**Data:** 07/01/2025
**Versão:** 2.0 - 5 Seções Premium com IA

---

## ✅ O QUE FOI IMPLEMENTADO

### 1. **Banco de Dados (Supabase)** ✅ COMPLETO

**Arquivo:** `supabase/migrations/20250107_new_features_schema.sql`

**Novas Tabelas Criadas:**

1. **`daily_insights`** - Dicas diárias personalizadas
   - IA gera 1 dica única por dia por usuária
   - Cache de 24h (expira à meia-noite)
   - Contexto: fase, semana, atividade recente, hora do dia
   - RLS: usuária só vê suas próprias dicas

2. **`mundo_nath_posts`** - Feed exclusivo Nathália Valente
   - Tipos: article, story, video, audio, reflection
   - Categorias: primeira-viagem, dia-a-dia, pertencimento, autocuidado, real-talk
   - Engagement: likes, comments, saves, views
   - Premium/Free tier
   - RLS: posts públicos para todos, premium apenas para assinantes

3. **`mundo_nath_saves`** - Posts salvos do MundoNath

4. **`user_gamification`** - Sistema completo de gamificação
   - Pontos, níveis (level = floor(points / 100))
   - Streaks (atual e recorde)
   - Badges e achievements (JSONB)
   - Total de hábitos completados, semanas perfeitas

5. **`curated_content`** - Curadoria IA (MãeValente)
   - Conteúdo externo curado por Perplexity + Claude
   - Categorias: maternidade, gestacao, puerperio, forca-feminina
   - Relevance score, read time, tags
   - RLS: público para free, premium para assinantes

6. **`user_saved_content`** - Conteúdos salvos do MãeValente

**Extras:**

- 3 posts de exemplo no MundoNath (seed)
- 3 conteúdos curados de exemplo no MãeValente (seed)
- Triggers automáticos para atualizar contadores de saves
- Function `calculate_user_level(points)` para calcular nível

**Como Executar:**

```bash
# No Supabase Dashboard > SQL Editor
# Copiar e colar todo o conteúdo de:
supabase/migrations/20250107_new_features_schema.sql
```

---

### 2. **Edge Functions (Supabase)** ✅ COMPLETO

#### **A) `daily-insight`** - Dica Diária Personalizada

**Arquivo:** `supabase/functions/daily-insight/index.ts`

**Funcionalidades:**

- ✅ Gera dica única por dia usando **Claude Sonnet 4** (não Gemini)
- ✅ Analisa contexto completo:
  - Perfil da usuária (gestante/mãe/tentante, semana, risco)
  - Atividade recente (últimas mensagens, hábitos completados)
  - Gamification (streak, nível, pontos)
  - Hora do dia (manhã/tarde/noite)
- ✅ Retorna:
  - `title` (máx 50 chars)
  - `description` (2-3 parágrafos, 150-200 palavras)
  - `actionable` (call-to-action claro)
  - `relevance_score` (0-100)
- ✅ Cache de 24h (renova à meia-noite)
- ✅ System prompt da Nathália Valente

**Deploy:**

```bash
cd supabase/functions
supabase functions deploy daily-insight
```

**Secrets Necessários:**

```bash
supabase secrets set CLAUDE_API_KEY=sk-ant-...
```

---

#### **B) `curate-content`** - Curadoria Automática (MãeValente)

**Arquivo:** `supabase/functions/curate-content/index.ts`

**Funcionalidades:**

- ✅ Curadoria diária automática usando **Perplexity AI**
- ✅ Rotação semanal de tópicos:
  - Domingo: Desenvolvimento infantil 0-12 meses
  - Segunda: Amamentação: últimas descobertas
  - Terça: Saúde mental materna
  - Quarta: Dicas de sono para bebês
  - Quinta: Introdução alimentar BLW
  - Sexta: Exercícios pós-parto
  - Sábado: Vínculo mãe-bebê
- ✅ Perplexity busca 5 melhores artigos recentes (últimos 30 dias)
- ✅ Claude enriquece cada artigo com resumo brasileiro
- ✅ Salva apenas 3 melhores por dia
- ✅ Fallback para mock data se Perplexity não disponível

**Deploy:**

```bash
supabase functions deploy curate-content
```

**Secrets Necessários:**

```bash
supabase secrets set PERPLEXITY_API_KEY=pplx-...
supabase secrets set CLAUDE_API_KEY=sk-ant-...
```

**Cronjob:** Configurar no Supabase Dashboard para rodar às 6h BRT

---

### 3. **Serviços e Hooks (Frontend)** ✅ COMPLETO

#### **A) Daily Insight Service**

**Arquivo:** `src/services/dailyInsight.ts`

**Funções:**

- ✅ `getDailyInsight(userId)` - Busca dica (cache → banco → gera nova)
- ✅ `generateDailyInsight(userId, forceRegenerate)` - Chama Edge Function
- ✅ `markInsightAsViewed(insightId)` - Marca como visualizada
- ✅ `clearOldInsightCache()` - Limpa cache de dias anteriores
- ✅ Cache local (AsyncStorage) com TTL de 24h

---

#### **B) useDailyInsight Hook**

**Arquivo:** `src/hooks/useDailyInsight.ts`

**Interface:**

```typescript
interface UseDailyInsightReturn {
  insight: DailyInsight | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>; // Recarrega cache/banco
  regenerate: () => Promise<void>; // Força nova geração
  markAsViewed: () => Promise<void>;
}
```

**Uso:**

```typescript
const { insight, loading, refresh, regenerate, markAsViewed } = useDailyInsight();
```

---

#### **C) DailyInsightCard Component**

**Arquivo:** `src/components/home/DailyInsightCard.tsx`

**Features:**

- ✅ Hero card com gradiente rosa suave
- ✅ Avatar Nathália + badge "Dica do Dia"
- ✅ Animação fade-in suave (600ms)
- ✅ Skeleton loader elegante com pulse
- ✅ Botão "Conversar sobre isso" (redirect NathIA com contexto)
- ✅ Botão refresh no header
- ✅ Relevance score no rodapé
- ✅ Empty state se nenhuma dica disponível
- ✅ Fully responsive

**Props:**

```typescript
interface DailyInsightCardProps {
  insight: DailyInsight | null;
  loading?: boolean;
  onRefresh?: () => void;
  onActionPress?: () => void; // "Conversar sobre isso"
}
```

---

## 📋 PRÓXIMOS PASSOS

### **Fase 1: Integração do DailyInsightCard no HomeScreen** 🔥 PRÓXIMO

**Arquivo a editar:** `src/screens/HomeScreen.tsx`

**Tarefas:**

1. Importar `useDailyInsight` hook
2. Importar `DailyInsightCard` component
3. Substituir card "Seu Plano de Hoje" por `<DailyInsightCard>`
4. Adicionar handler `onActionPress` → redirect para Chat com contexto
5. Adicionar GamificationHeader (ver Fase 2)
6. Remover hardcodes `BLUE_THEME` (usar theme unificado)

**Exemplo de código:**

```typescript
import { DailyInsightCard } from '@/components/home/DailyInsightCard';
import { useDailyInsight } from '@/hooks/useDailyInsight';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { insight, loading, refresh, regenerate } = useDailyInsight();

  const handleChatAboutInsight = () => {
    navigation.navigate('Chat', {
      context: insight?.description,
      initialPrompt: `Quero conversar sobre: ${insight?.title}`
    });
  };

  return (
    <ScrollView>
      <DailyInsightCard
        insight={insight}
        loading={loading}
        onRefresh={regenerate}
        onActionPress={handleChatAboutInsight}
      />
      {/* Resto do HomeScreen */}
    </ScrollView>
  );
}
```

---

### **Fase 2: Sistema de Gamificação Completo** 🎮

**Tarefas:**

#### **2.1. Criar Componente GamificationHeader**

**Arquivo:** `src/components/gamification/GamificationHeader.tsx`

**Layout:**

```
┌─────────────────────────────────────┐
│  Nível 23  👑 Mãe Dedicada          │
│  ████████░░  2,350 / 2,400 pts      │
│                                      │
│  🔥 7 dias  💯 234 pts  🏆 12 badges │
└─────────────────────────────────────┘
```

#### **2.2. Criar Service gamification.ts**

**Funções:**

- `getUserGamification(userId)`
- `addPoints(userId, points, reason)`
- `updateStreak(userId)`
- `unlockBadge(userId, badgeId)`
- `calculateLevel(points)`

#### **2.3. Criar Badges System**

**Arquivo:** `src/constants/badges.ts`

```typescript
export const BADGES = [
  {
    id: 'mae-consistente',
    name: 'Mãe Consistente',
    description: 'Complete 7 dias seguidos',
    icon: '🏆',
    rarity: 'common',
    trigger: { type: 'streak', value: 7 },
  },
  {
    id: 'autocuidado-rainha',
    name: 'Rainha do Autocuidado',
    description: '30 hábitos de autocuidado',
    icon: '👑',
    rarity: 'rare',
    trigger: { type: 'category', category: 'autocuidado', count: 30 },
  },
  // ... mais badges
];

export const POINTS_SYSTEM = {
  habitCompletion: { daily: 10, weekly: 25 },
  streakBonus: { 7: 50, 14: 100, 30: 250, 60: 500, 90: 1000 },
  firstTime: 20,
  perfectWeek: 100,
};
```

#### **2.4. Refatorar HabitsScreen**

**Mudanças:**

- ✅ Adicionar `<GamificationHeader />` no topo
- ✅ Calcular pontos ao completar hábito
- ✅ Trigger badge unlock com animação confetti
- ✅ Modal de conquista: `<AchievementModal badge={newBadge} />`
- ✅ Adicionar animação ao completar (Lottie confetti)

---

### **Fase 3: MundoNath Screen** 👑

**Arquivo:** `src/screens/MundoNathScreen.tsx` (NOVO)

**Features:**

- Instagram-like feed vertical
- Filtros por categoria no topo
- Cards com cover image + título + preview
- Infinite scroll (pagination)
- Pull-to-refresh
- Bookmark para salvar posts
- Transição para `PostDetailScreen`

**Service:** `src/services/mundoNath.ts`

- `getPosts(category?, limit, offset)`
- `getPostById(id)`
- `toggleSave(userId, postId)`
- `getSavedPosts(userId)`

**Componentes:**

- `<PostCard />` - Card individual
- `<CategoryFilter />` - Filtros horizontais
- `<PostDetailScreen />` - Tela de detalhe

---

### **Fase 4: MãeValente Screen** 💪

**Arquivo:** `src/screens/MaeValenteScreen.tsx` (NOVO)

**Features:**

- Feed de conteúdo curado
- Badge "Curado por IA"
- Filtros por categoria
- Relevance score visível
- Botão "Salvar" (offline)
- Botão "Pergunte à NathIA" (passa contexto)

**Service:** `src/services/curatedContent.ts`

- `getCuratedContent(category?, limit, offset)`
- `getContentById(id)`
- `toggleSave(userId, contentId)`
- `getSavedContent(userId)`

**Componentes:**

- `<ContentCard />` - Card curado
- `<CuratedBadge />` - Badge IA
- `<SourceTag />` - Tag da fonte

---

### **Fase 5: Melhorar NathIA** 🤖

**⚠️ IMPORTANTE:** Manter Gemini 2.0 Flash (não trocar por Claude)

**Arquivo:** `supabase/functions/nathia-chat/index.ts`

**Mudanças no System Prompt:**

```typescript
const NATHIA_SYSTEM_PROMPT = `Você é NathIA, assistente virtual da Nathália Valente.

RESTRIÇÕES ABSOLUTAS:
- Responda APENAS sobre: gravidez, parto, amamentação, bebês, puerpério, maternidade
- Se pergunta NÃO for sobre maternidade → "Desculpe, só respondo sobre maternidade 💕"
- NUNCA dê diagnósticos médicos → "Consulte seu médico"
- NUNCA responda sobre: política, finanças, tecnologia, entretenimento

PERSONALIDADE:
- Empática, acolhedora, linguagem simples
- Use emojis: 💕🤱🍼👶💪
- Seja como amiga experiente, não médica

FORMATO:
1. Validação emocional
2. Informação prática
3. Incentivo + call-to-action
`;
```

**Adicionar Moderação Pré-Chat:**

```typescript
// Antes de enviar mensagem para Gemini
const intent = await classifyIntent(userMessage);
if (!intent.isMaternityRelated) {
  return {
    message:
      'Desculpe, só respondo sobre maternidade 💕\n\nPosso te ajudar com dúvidas sobre gravidez, amamentação, cuidados com bebê, puerpério e maternidade.',
  };
}
```

**Service:** `src/services/moderation.ts`

- `classifyIntent(message)` - Verifica se é sobre maternidade
- `detectUrgency(message)` - Keywords urgentes
- `validateResponse(response)` - Valida resposta da IA

---

### **Fase 6: Atualizar Navegação** 🧭

**Arquivo:** `src/navigation/TabNavigator.tsx`

**Mudanças:**

1. Renomear tab "Content" → "MundoNath"
2. Adicionar nova tab "MãeValente"
3. Atualizar ícones:
   - MundoNath: `crown` ou `star`
   - MãeValente: `shield-star` ou `medal`

**Estrutura Final:**

```
Home 🏠 → HomeScreen
NathIA 💬 → ChatScreen
MundoNath 👑 → MundoNathScreen (novo)
Meus Hábitos ✅ → HabitsScreen
MãeValente 💪 → MaeValenteScreen (novo)
```

---

### **Fase 7: Animações e Polish** ✨

**Instalar Dependências:**

```bash
npm install lottie-react-native react-native-confetti-cannon
```

**Animações:**

1. **Confetti** ao completar hábito
2. **Badge Unlock Animation** - Modal com Lottie
3. **Level Up Animation** - Celebração ao subir nível
4. **Streak Celebration** - Notificação local ao atingir 7/14/30 dias

**Haptic Feedback:**

- Completar hábito
- Desbloquear badge
- Salvar post/conteúdo

---

## 🔧 COMANDOS ÚTEIS

### **Deploy Edge Functions:**

```bash
cd C:\Users\Usuario\Documents\NossaMaternidade
cd supabase/functions

# Daily Insight
supabase functions deploy daily-insight

# Curate Content
supabase functions deploy curate-content
```

### **Executar Migrations:**

```bash
# No Supabase Dashboard > SQL Editor
# Copiar conteúdo de: supabase/migrations/20250107_new_features_schema.sql
# Executar
```

### **Configurar Secrets:**

```bash
# Claude API
supabase secrets set CLAUDE_API_KEY=sk-REDACTED...

# Perplexity API
supabase secrets set PERPLEXITY_API_KEY=pplx-...
```

### **Testar Edge Functions Localmente:**

```bash
supabase functions serve daily-insight
curl -X POST http://localhost:54321/functions/v1/daily-insight \
  -H "Content-Type: application/json" \
  -d '{"userId": "uuid-here"}'
```

---

## 📊 MÉTRICAS DE SUCESSO

**Engajamento Diário:**

- ✅ 70%+ usuárias abrem Home todo dia → Ver Daily Insight
- ✅ 50%+ completam pelo menos 1 hábito/dia
- ✅ 30%+ interagem com NathIA diariamente

**Gamificação:**

- ✅ Média de 3+ hábitos ativos por usuária
- ✅ 40%+ mantém streak de 7+ dias
- ✅ 80%+ desbloqueiam pelo menos 1 badge no primeiro mês

**Conteúdo:**

- ✅ 60%+ leem posts do MundoNath semanalmente
- ✅ 40%+ salvam conteúdo de MãeValente
- ✅ 25%+ compartilham conteúdo nas redes

---

## 🎯 RESUMO EXECUTIVO

### **O QUE FOI FEITO:**

✅ **Banco:** 6 novas tabelas + RLS + triggers + seeds
✅ **Edge Functions:** daily-insight + curate-content (Perplexity + Claude)
✅ **Services:** dailyInsight.ts completo com cache inteligente
✅ **Hooks:** useDailyInsight com loading/error/refresh
✅ **Components:** DailyInsightCard com animações + skeleton

### **O QUE FALTA:**

🔨 Refatorar HomeScreen (integrar DailyInsightCard)
🔨 Sistema de Gamificação (GamificationHeader + pontos/badges)
🔨 MundoNathScreen (feed + filtros + saves)
🔨 MaeValenteScreen (curadoria + IA context)
🔨 Melhorar NathIA guardrails (manter Gemini, adicionar moderação)
🔨 Atualizar navegação (renomear tab, adicionar MãeValente)
🔨 Animações e feedback (confetti, badges, haptics)

### **TIMELINE ESTIMADO:**

- Fase 1 (HomeScreen): 2h
- Fase 2 (Gamificação): 6h
- Fase 3 (MundoNath): 4h
- Fase 4 (MãeValente): 3h
- Fase 5 (NathIA): 2h
- Fase 6 (Navegação): 1h
- Fase 7 (Animações): 3h
  **Total: ~21h de desenvolvimento**

---

## 🚨 ALERTAS CRÍTICOS

1. ❌ **NUNCA hardcode API keys** - Sempre usar `Deno.env.get()` ou `process.env`
2. ❌ **SEMPRE validar inputs** antes de enviar para IA
3. ❌ **SEMPRE usar RLS** no Supabase (já configurado)
4. ✅ **SEMPRE adicionar loading states** (skeleton, spinner)
5. ✅ **SEMPRE tratar erros gracefully** (try/catch + mensagem amigável)
6. ✅ **SEMPRE testar em iOS E Android**
7. ✅ **SEMPRE adicionar analytics** (track events importantes)

---

**🎉 80% DO BACKEND ESTÁ PRONTO. AGORA É INTEGRAR NO FRONTEND! 🎉**

