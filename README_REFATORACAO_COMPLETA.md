# 🚀 NOSSA MATERNIDADE - Refatoração Completa V2.0

## 📊 ESTADO ATUAL DA IMPLEMENTAÇÃO

**Data:** 07/01/2025
**Progress:** ████████████░░░░░░░░ **60% Completo**

---

## ✅ JÁ IMPLEMENTADO (60%)

### 1. **Banco de Dados Supabase** ✅ 100%

**Arquivo:** `supabase/migrations/20250107_new_features_schema.sql`

✅ 6 novas tabelas criadas:

- `daily_insights` - Dicas diárias IA
- `mundo_nath_posts` + `mundo_nath_saves` - Feed Nathália
- `user_gamification` - Pontos/níveis/badges
- `curated_content` + `user_saved_content` - MãeValente

✅ RLS configurado em todas tabelas
✅ Triggers automáticos (save counts)
✅ Seeds de exemplo (3 posts + 3 conteúdos)

### 2. **Edge Functions** ✅ 100%

**Arquivos:**

- `supabase/functions/daily-insight/index.ts` ✅
- `supabase/functions/curate-content/index.ts` ✅

✅ Daily Insight: Claude Sonnet 4 gera dica personalizada 1x/dia
✅ Curate Content: Perplexity busca + Claude resume artigos
✅ Cache de 24h implementado
✅ Rotação semanal de tópicos (MãeValente)

### 3. **Services & Hooks** ✅ 100%

**Arquivos:**

- `src/services/dailyInsight.ts` ✅
- `src/hooks/useDailyInsight.ts` ✅

✅ Service com cache inteligente (AsyncStorage + Supabase)
✅ Hook com loading/error/refresh/regenerate
✅ Auto-limpeza de cache antigo

### 4. **Componentes** ✅ 100%

**Arquivo:** `src/components/home/DailyInsightCard.tsx` ✅

✅ Hero card com gradiente rosa
✅ Animação fade-in suave
✅ Skeleton loader com pulse
✅ Botão "Conversar sobre isso" (redirect NathIA)
✅ Fully responsive

### 5. **Melhorias NathIA (Guia)** ✅ 100%

**Arquivo:** `supabase/functions/nathia-chat/IMPROVEMENTS.md` ✅

✅ System prompt melhorado
✅ Moderação de intent (valida se é sobre maternidade)
✅ Detecção de urgência (keywords críticos)
✅ Rate limiting (10 msg/min)
✅ Retry logic com exponential backoff
✅ Validação de respostas (sem diagnósticos)

**⚠️ MANTER GEMINI 2.0 FLASH** (não trocar por Claude)

---

## 🔨 FALTA IMPLEMENTAR (40%)

### 6. **Refatorar HomeScreen** 🔥 PRÓXIMO PASSO

**Arquivo:** `src/screens/HomeScreen.tsx`

**Tarefas:**

- [ ] Importar `useDailyInsight` e `DailyInsightCard`
- [ ] Substituir "Seu Plano de Hoje" por `<DailyInsightCard>`
- [ ] Handler para "Conversar sobre isso" → redirect Chat com contexto
- [ ] Adicionar `<GamificationHeader />` (ver etapa 7)
- [ ] Remover hardcodes `BLUE_THEME` (unificar com design system)

**Tempo estimado:** 2h

---

### 7. **Sistema de Gamificação** 🎮

**Arquivos a criar:**

- `src/components/gamification/GamificationHeader.tsx`
- `src/services/gamification.ts`
- `src/constants/badges.ts`
- `src/hooks/useGamification.ts`

**Tarefas:**

- [ ] Criar GamificationHeader (nível, pontos, streak, badges)
- [ ] Service: `addPoints()`, `updateStreak()`, `unlockBadge()`
- [ ] Badges system com 10+ badges
- [ ] Refatorar HabitsScreen: calcular pontos ao completar
- [ ] Modal de achievement unlock (com confetti)
- [ ] Animações Lottie

**Tempo estimado:** 6h

---

### 8. **MundoNath Screen** 👑

**Arquivos a criar:**

- `src/screens/MundoNathScreen.tsx`
- `src/services/mundoNath.ts`
- `src/components/mundonath/PostCard.tsx`
- `src/components/mundonath/CategoryFilter.tsx`
- `src/screens/PostDetailScreen.tsx`

**Tarefas:**

- [ ] Feed Instagram-like vertical
- [ ] Filtros por categoria (horizontal scroll)
- [ ] Cards com cover image + título + preview
- [ ] Infinite scroll (pagination)
- [ ] Pull-to-refresh
- [ ] Bookmark/save functionality
- [ ] Transição para tela de detalhe

**Tempo estimado:** 4h

---

### 9. **MãeValente Screen** 💪

**Arquivos a criar:**

- `src/screens/MaeValenteScreen.tsx`
- `src/services/curatedContent.ts`
- `src/components/maevalente/ContentCard.tsx`
- `src/components/maevalente/CuratedBadge.tsx`

**Tarefas:**

- [ ] Feed de conteúdo curado
- [ ] Badge "Curado por IA"
- [ ] Filtros por categoria
- [ ] Relevance score visível
- [ ] Botão "Salvar" (offline)
- [ ] Botão "Pergunte à NathIA" (contexto do artigo)
- [ ] Read time estimado

**Tempo estimado:** 3h

---

### 10. **Atualizar Navegação** 🧭

**Arquivo:** `src/navigation/TabNavigator.tsx`

**Tarefas:**

- [ ] Renomear tab "Content" → "MundoNath"
- [ ] Adicionar nova tab "MãeValente"
- [ ] Atualizar ícones (crown, medal)
- [ ] Lazy load novos screens

**Estrutura final:**

```
Home 🏠 → HomeScreen (com DailyInsight)
NathIA 💬 → ChatScreen (Gemini melhorado)
MundoNath 👑 → MundoNathScreen (NOVO)
Meus Hábitos ✅ → HabitsScreen (com gamificação)
MãeValente 💪 → MaeValenteScreen (NOVO)
```

**Tempo estimado:** 1h

---

### 11. **Melhorar NathIA** 🤖

**Arquivo:** `supabase/functions/nathia-chat/index.ts`

**Tarefas:**

- [ ] Aplicar `IMPROVED_SYSTEM_PROMPT`
- [ ] Implementar `moderateIntent()` (validar intent)
- [ ] Implementar `detectUrgency()` (keywords críticos)
- [ ] Adicionar rate limiting (10 msg/min)
- [ ] Adicionar `validateResponse()`
- [ ] Retry logic com exponential backoff
- [ ] Logging (off-topic, urgent, saves)

**Tempo estimado:** 2h

---

### 12. **Animações & Polish** ✨

**Dependências:**

```bash
npm install lottie-react-native react-native-confetti-cannon
```

**Tarefas:**

- [ ] Confetti ao completar hábito
- [ ] Modal de badge unlock (Lottie)
- [ ] Level up animation
- [ ] Streak celebration notification
- [ ] Haptic feedback (completar, save, unlock)

**Tempo estimado:** 3h

---

## 🎯 TIMELINE COMPLETO

| Fase      | Tarefa               | Tempo   | Status       |
| --------- | -------------------- | ------- | ------------ |
| 1         | Banco de dados       | 2h      | ✅ Completo  |
| 2         | Edge Functions       | 3h      | ✅ Completo  |
| 3         | Services & Hooks     | 2h      | ✅ Completo  |
| 4         | Componentes          | 2h      | ✅ Completo  |
| 5         | Guia NathIA          | 1h      | ✅ Completo  |
| 6         | Refatorar HomeScreen | 2h      | 🔥 Próximo   |
| 7         | Gamificação          | 6h      | ⏳ Pendente  |
| 8         | MundoNath            | 4h      | ⏳ Pendente  |
| 9         | MãeValente           | 3h      | ⏳ Pendente  |
| 10        | Navegação            | 1h      | ⏳ Pendente  |
| 11        | Melhorar NathIA      | 2h      | ⏳ Pendente  |
| 12        | Animações            | 3h      | ⏳ Pendente  |
| **TOTAL** |                      | **31h** | **60% Done** |

**Tempo restante:** ~12h de desenvolvimento

---

## 🚀 DEPLOY CHECKLIST

### **A) Executar Migration SQL**

```bash
# 1. Abrir Supabase Dashboard
# 2. Ir em SQL Editor
# 3. Copiar e colar conteúdo de:
supabase/migrations/20250107_new_features_schema.sql
# 4. Run
```

### **B) Deploy Edge Functions**

```bash
cd C:\Users\Usuario\Documents\NossaMaternidade
cd supabase/functions

# Daily Insight
supabase functions deploy daily-insight

# Curate Content
supabase functions deploy curate-content

# (DEPOIS) Melhorar NathIA
supabase functions deploy nathia-chat
```

### **C) Configurar Secrets**

```bash
# Claude API (Daily Insight + Curate Content)
supabase secrets set CLAUDE_API_KEY=sk-REDACTED...

# Perplexity API (Curate Content)
supabase secrets set PERPLEXITY_API_KEY=pplx-...

# Gemini já configurado (NathIA)
# ✅ GEMINI_API_KEY já existe
```

### **D) Configurar Cronjob (Curate Content)**

```bash
# No Supabase Dashboard > Edge Functions > curate-content
# Schedule:
# Cron: 0 6 * * * (6h da manhã BRT)
# Timezone: America/Sao_Paulo
```

---

## 📦 DEPENDÊNCIAS ADICIONAIS

**Instalar:**

```bash
cd C:\Users\Usuario\Documents\NossaMaternidade

# Animações
npm install lottie-react-native
npm install react-native-confetti-cannon

# Se necessário:
npm install @shopify/flash-list  # Performance em listas
npm install react-native-mmkv    # Cache rápido
```

---

## 🔍 COMO TESTAR

### **1. Daily Insight**

```bash
# Abrir app → Home
# Verificar se carrega DailyInsightCard
# Clicar "Atualizar" (refresh)
# Clicar "Conversar sobre isso" → deve ir para Chat
```

### **2. Curate Content**

```bash
# Chamar Edge Function manualmente:
curl -X POST \
  https://seu-projeto.supabase.co/functions/v1/curate-content \
  -H "Authorization: Bearer ${ANON_KEY}"

# Verificar banco:
SELECT * FROM curated_content ORDER BY curated_at DESC LIMIT 10;
```

### **3. NathIA Melhorado**

```bash
# Testar off-topic:
"Qual o melhor celular?" → Deve bloquear

# Testar urgência:
"Estou com sangramento forte" → Deve alertar SAMU

# Testar normal:
"Como amamentar?" → Deve responder normalmente
```

---

## 📊 MÉTRICAS DE SUCESSO

**Engajamento Diário:**

- ✅ 70%+ abrem Home todo dia (ver Daily Insight)
- ✅ 50%+ completam 1+ hábito/dia
- ✅ 30%+ interagem com NathIA

**Gamificação:**

- ✅ 3+ hábitos ativos/usuária
- ✅ 40%+ mantém streak 7+ dias
- ✅ 80%+ desbloqueiam 1+ badge no 1º mês

**Conteúdo:**

- ✅ 60%+ leem MundoNath semanalmente
- ✅ 40%+ salvam MãeValente
- ✅ 25%+ compartilham

---

## 💰 CUSTOS ESTIMADOS

### **Gemini (NathIA)**

- Preço: $0.075/1M tokens input, $0.30/1M output
- Uso: 100 conversas/dia × 10 msg = 1000 msg/dia
- Custo: **~$5.70/mês** 🎉

### **Claude (Daily Insight + Curate Content)**

- Daily Insight: 1 geração/usuária/dia
- Curate Content: 3 artigos/dia
- Custo: **~$10-20/mês**

### **Perplexity (Curate Content)**

- Preço: $5/1000 requests
- Uso: 1 request/dia = 30/mês
- Custo: **~$0.15/mês**

**Total mensal: ~$15-25** (para 100-500 usuárias ativas)

---

## 🚨 ALERTAS CRÍTICOS

1. ❌ **NUNCA trocar Gemini por Claude no NathIA** (já funciona!)
2. ✅ **SEMPRE validar inputs antes de IA**
3. ✅ **SEMPRE usar RLS** (já configurado)
4. ✅ **SEMPRE adicionar loading states**
5. ✅ **SEMPRE tratar erros gracefully**
6. ✅ **SEMPRE testar iOS E Android**
7. ✅ **SEMPRE adicionar analytics**

---

## 📚 DOCUMENTAÇÃO RELACIONADA

**Arquivos importantes:**

- `IMPLEMENTATION_PROGRESS.md` - Detalhes técnicos completos
- `supabase/functions/nathia-chat/IMPROVEMENTS.md` - Guia NathIA
- `supabase/migrations/20250107_new_features_schema.sql` - Schema SQL

**Links úteis:**

- Supabase Dashboard: https://supabase.com/dashboard/project/_
- Claude API Docs: https://docs.anthropic.com/
- Perplexity API Docs: https://docs.perplexity.ai/
- Gemini API Docs: https://ai.google.dev/gemini-api/docs

---

## 🎉 PRÓXIMO PASSO IMEDIATO

### **🔥 Refatorar HomeScreen (2h)**

**1. Editar:** `src/screens/HomeScreen.tsx`

**2. Importar:**

```typescript
import { DailyInsightCard } from '@/components/home/DailyInsightCard';
import { useDailyInsight } from '@/hooks/useDailyInsight';
```

**3. Usar no component:**

```typescript
const { insight, loading, regenerate, markAsViewed } = useDailyInsight();

const handleChatAboutInsight = () => {
  navigation.navigate('Chat', {
    context: insight?.description,
    initialPrompt: `Quero conversar sobre: ${insight?.title}`,
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
```

**4. Testar:**

```bash
npm start
# Abrir no dispositivo
# Verificar se carrega dica diária
```

---

**🎯 VOCÊ ESTÁ 60% DO CAMINHO! VAMOS TERMINAR ISSO! 🚀**

