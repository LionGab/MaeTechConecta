# 🚀 Prompts Prontos para Cursor 2.0 Composer
## Copy & Paste direto no Cursor

**Data:** 30/10/2025 (Hoje)
**Comece AGORA!** ⚡

---

## 📋 PROMPT 1: Setup Inicial Completo (Dia 1)

**Copie este prompt no Cursor Composer:**

```
Você é um senior mobile architect especializado em React Native + Expo + Supabase.

OBJETIVO: Criar MVP do 'Club Valente' - app de acolhimento materno para Natália Valente.

FASE 1: Setup Completo do Projeto

Crie projeto React Native + Expo seguindo:

1. TECNOLOGIAS:
   - React Native 0.74.5+
   - Expo SDK 52
   - TypeScript (strict mode)
   - Zustand para state management
   - React Navigation 6
   - Supabase Client

2. ESTRUTURA DE PASTAS:
   src/
   ├── features/
   │   ├── onboarding/
   │   ├── chat/
   │   ├── habits/
   │   └── content/
   ├── shared/
   │   ├── components/
   │   ├── hooks/
   │   ├── services/
   │   └── utils/
   ├── navigation/
   └── theme/

3. CONFIGURAÇÕES:
   - ESLint + Prettier configurados
   - Husky pre-commit hooks
   - TypeScript strict
   - Expo config completo
   - Package.json com todas dependências

4. DESIGN SYSTEM BASE:
   - Paleta de cores acolhedora (maternal)
   - Tipografia legível (min 16px)
   - Espaçamento padronizado (4/8/12/16/24/32)
   - Componentes base: Button, Input, Card

5. SUPABASE SETUP:
   - Configuração do cliente
   - Auth configurado
   - Services para API calls

Crie a estrutura COMPLETA do projeto, funcionando e rodando localmente.
Todas as dependências instaladas e configuradas.
Pronto para começar desenvolvimento de features.
```

---

## 📋 PROMPT 2: Setup Supabase Database (Dia 2 - Manhã)

**Para Agent Backend:**

```
Você é um backend engineer especializado em Supabase + PostgreSQL.

OBJETIVO: Criar schema completo do database Club Valente.

TABELAS NECESSÁRIAS:

1. user_profiles
   - id (uuid, PK)
   - email (text, unique)
   - name (text)
   - type (text: 'gestante' | 'mae' | 'tentante')
   - pregnancy_week (integer, nullable)
   - baby_name (text, nullable)
   - preferences (jsonb)
   - subscription_tier (text: 'free' | 'premium')
   - onboarding_data (jsonb)
   - behavior_analysis (jsonb, nullable)
   - risk_level (integer, default 0)
   - created_at (timestamp)
   - updated_at (timestamp)

2. conversation_history
   - id (uuid, PK)
   - user_id (uuid, FK -> user_profiles.id)
   - messages (jsonb) - array de mensagens
   - summary_daily (text, nullable)
   - summary_weekly (text, nullable)
   - key_memories (jsonb, nullable)
   - created_at (timestamp)
   - updated_at (timestamp)

3. chat_messages
   - id (uuid, PK)
   - user_id (uuid, FK -> user_profiles.id)
   - message (text)
   - response (text)
   - role (text: 'user' | 'assistant')
   - context_data (jsonb, nullable)
   - is_urgent (boolean, default false)
   - risk_flag (integer, nullable)
   - created_at (timestamp)

4. habits
   - id (uuid, PK)
   - user_id (uuid, FK -> user_profiles.id)
   - name (text)
   - description (text, nullable)
   - category (text)
   - is_custom (boolean, default false)
   - is_active (boolean, default true)
   - created_at (timestamp)

5. habit_completions
   - id (uuid, PK)
   - habit_id (uuid, FK -> habits.id)
   - user_id (uuid, FK -> user_profiles.id)
   - completed_at (timestamp)
   - date (date)

6. content_items
   - id (uuid, PK)
   - title (text)
   - description (text, nullable)
   - type (text: 'article' | 'video' | 'audio' | 'post')
   - content_url (text)
   - thumbnail_url (text, nullable)
   - category (text)
   - tags (text[], nullable)
   - author (text, default 'Natália Valente')
   - is_featured (boolean, default false)
   - created_at (timestamp)

7. content_favorites
   - id (uuid, PK)
   - user_id (uuid, FK -> user_profiles.id)
   - content_id (uuid, FK -> content_items.id)
   - created_at (timestamp)

8. moderation_queue
   - id (uuid, PK)
   - user_id (uuid, FK -> user_profiles.id)
   - message (text)
   - category (text)
   - severity (integer, 1-5)
   - action (text: 'allow' | 'block' | 'flag')
   - reviewed (boolean, default false)
   - reviewed_by (uuid, nullable)
   - reviewed_at (timestamp, nullable)
   - created_at (timestamp)

9. risk_alerts
   - id (uuid, PK)
   - user_id (uuid, FK -> user_profiles.id)
   - risk_type (text: 'medical' | 'psychological')
   - severity (integer, 1-10)
   - message_context (text)
   - action_taken (text)
   - resolved (boolean, default false)
   - resolved_at (timestamp, nullable)
   - created_at (timestamp)

10. vector_embeddings
    - id (uuid, PK)
    - user_id (uuid, FK -> user_profiles.id)
    - content (text)
    - embedding (vector(768)) - pgvector
    - metadata (jsonb)
    - created_at (timestamp)

CONFIGURAÇÕES:
- Row Level Security (RLS) ativado em todas tabelas
- Políticas de acesso básicas (usuário só vê seus próprios dados)
- Índices otimizados:
  - user_id em todas tabelas FK
  - created_at para ordenação temporal
  - embedding para busca vetorial (cosine distance)
- Foreign keys com CASCADE onde apropriado

Crie migrations SQL para todas as tabelas.
Configure RLS e políticas de segurança.
Documente schema completo.
```

---

## 📋 PROMPT 3: Setup Gemini 2.0 Flash (Dia 2 - Tarde)

**Para Agent IA:**

```
Você é um especialista em LLMs e prompt engineering, especializado em Gemini 2.0 Flash.

OBJETIVO: Configurar integração Gemini 2.0 Flash para NAT-IA (assistente virtual).

CONFIGURAÇÃO:

1. EDGE FUNCTION BASE:
   - Arquivo: supabase/functions/nathia-chat/index.ts
   - Deno runtime
   - Integração Gemini 2.0 Flash API
   - Rate limiting por usuário
   - Auth check (Supabase)

2. PROMPT SYSTEM:
   - System prompt: NAT-IA é assistente de acolhimento emocional
   - Restrições: NUNCA sugerir medicamentos, diagnósticos, tratamentos
   - Tom: Empático, caloroso, brasileiro (PT-BR coloquial)
   - Contexto: Últimas 20 mensagens + perfil da usuária

3. CONFIGURAÇÃO GEMINI:
   {
     model: "gemini-2.0-flash-exp",
     temperature: 0.7,
     maxOutputTokens: 300,
     safetySettings: [
       { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
       { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
       { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
       { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
     ]
   }

4. VARIÁVEIS DE AMBIENTE:
   - GEMINI_API_KEY (configurar no Supabase Dashboard)

5. FUNCIONALIDADES:
   - Receber mensagem do usuário
   - Buscar contexto (últimas 20 mensagens do Supabase)
   - Chamar Gemini 2.0 Flash
   - Salvar mensagem e resposta no Supabase
   - Retornar resposta para app

Crie Edge Function completa e funcional.
Configure variáveis de ambiente.
Documente prompt system.
```

---

## 📋 PROMPT 4: Design System Base (Dia 3 - Tarde)

**Para Agent Design:**

```
Você é um design system engineer especializado em React Native.

OBJETIVO: Criar Design System "Bubblegum" para Club Valente.

COMPONENTES OBRIGATÓRIOS:

1. Button
   - Variantes: primary, secondary, outline, ghost, destructive
   - Tamanhos: sm, md, lg
   - Estados: default, loading, disabled
   - Acessibilidade completa (44x44px mínimo)
   - Ícones suportados (left/right)

2. Input
   - Label, placeholder, helper text, error
   - Ícone opcional (left)
   - Estados: default, focused, error, disabled
   - Acessibilidade completa

3. Card
   - Variantes: elevated, outlined, flat
   - Título, subtítulo, ícone opcional
   - Clicável (opcional)
   - Shadow/elevation configurável

4. Badge
   - Variantes: default, primary, secondary, success, warning, error
   - Tamanhos: sm, md

5. Loading
   - Skeleton screens
   - Spinner/ActivityIndicator
   - Estados de loading

6. ErrorBoundary
   - Captura de erros React
   - UI de fallback acolhedora

PALETA DE CORES (Tema Maternal):
- Primary: Rosa suave (#DD5B9A)
- Secondary: Azul pastel (#B8D8E8)
- Background: Branco/rosa muito claro (#F0E7F0)
- Text: Cinza escuro (#121212)
- Muted: Cinza neutro (#696969)
- Destructive: Vermelho suave (#D65152)

TIPOGRAFIA:
- Fontes: System default (iOS: SF Pro, Android: Roboto)
- Tamanhos: 12, 14, 16, 18, 20, 24, 28, 32
- Pesos: 400, 500, 600, 700

ESPACAMENTO:
- xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 20px, 2xl: 24px, 3xl: 32px

ACESSIBILIDADE:
- WCAG 2.1 AA compliant
- Contraste mínimo 4.5:1
- Área de toque mínima 44x44px
- Screen reader support completo

Crie todos componentes em TypeScript.
Exporte do src/shared/components/index.ts
Documente props e usage com JSDoc.
Inclua testes básicos.
```

---

## 📋 PROMPT 5: Onboarding Completo (Semana 2 - Dia 8)

**Para Agent Frontend + Backend:**

```
Você é um mobile developer especializado em React Native + Expo.

OBJETIVO: Criar onboarding completo do Club Valente.

ONBOARDING FLOW:

1. TELA 1: Boas-vindas
   - Logo Natália Valente
   - Mensagem acolhedora
   - Botão "Começar"

2. TELA 2: Nome
   - Input: "Qual é o seu nome?"
   - Validação: obrigatório, mínimo 2 caracteres
   - Botão "Próximo"

3. TELA 3: Como você se identifica?
   - Opções múltipla escolha:
     - Gestante
     - Mãe
     - Tentante
   - Cards visuais grandes (área toque 60x60px mínimo)
   - Botão "Próximo"

4. TELA 4: Informações adicionais (se Gestante)
   - Input numérico: "Em que semana de gestação você está?"
   - Validação: 1-42 semanas
   - Botão "Próximo"

5. TELA 5: Interesses
   - Multi-select checkboxes:
     - Alimentação saudável
     - Exercícios físicos
     - Bem-estar mental
     - Preparação para o parto
     - Amamentação
     - Sono do bebê
     - Relacionamento
   - Mínimo 1 selecionado
   - Botão "Próximo"

6. TELA 6: Conte-me sobre você (aberta)
   - TextArea: "Quer compartilhar algo sobre você?"
   - Opcional
   - Placeholder acolhedor
   - Botão "Finalizar"

7. TELA 7: Finalização
   - Mensagem de boas-vindas personalizada
   - Botão "Começar a usar"

FUNCIONALIDADES:
- Animações suaves entre telas (React Native Reanimated)
- Progresso visual (barra ou steps)
- Botão "Voltar" (exceto primeira tela)
- Validação em cada tela
- Salvamento no Supabase após cada tela
- Loading states
- Error handling
- Acessibilidade completa (WCAG 2.1 AA)

INTEGRAÇÃO:
- Salvar respostas em user_profiles.onboarding_data (JSONB)
- Criar/atualizar perfil no Supabase
- Após finalizar, navegar para HomeScreen

Crie todas as telas e navegação.
Integre com Supabase.
Teste fluxo completo.
```

---

## 📋 PROMPT 6: NAT-IA Chat Screen (Semana 2 - Dia 10)

**Para Agent Frontend + IA:**

```
Você é um mobile developer especializado em React Native + Chat UIs.

OBJETIVO: Criar tela de chat completa com NAT-IA.

CHAT SCREEN:

1. INTERFACE:
   - Header fixo: "Conversar com NAT-IA" + botão voltar
   - Lista de mensagens (FlatList invertida)
   - Input de mensagem fixo no bottom
   - Botão enviar

2. MENSAGENS:
   - Usuário: à direita, rosa (#DD5B9A), texto branco
   - NAT-IA: à esquerda, card branco, texto cinza
   - Timestamp opcional
   - Animações de entrada

3. INPUT:
   - TextArea multiline (cresce até 4 linhas)
   - Placeholder acolhedor
   - Botão enviar (desabilitado se vazio)
   - Máximo 500 caracteres
   - Indicador de digitação da IA (quando processando)

4. FUNCIONALIDADES:
   - Enviar mensagem para Edge Function NAT-IA
   - Receber resposta e adicionar à lista
   - Loading state (skeleton ou spinner)
   - Error handling (mensagem amigável)
   - Pull-to-refresh (recarregar histórico)
   - Scroll automático para última mensagem

5. INTEGRAÇÃO:
   - Buscar histórico do Supabase ao montar
   - Chamar supabase/functions/nathia-chat
   - Salvar mensagens localmente (offline support)

6. ACESSIBILIDADE:
   - Screen reader support
   - Keyboard handling (iOS/Android)
   - Área de toque adequada

7. PERFORMANCE:
   - FlatList otimizada (getItemLayout)
   - Memoização de componentes
   - Lazy loading de mensagens antigas

Crie tela completa e funcional.
Integre com Edge Function NAT-IA.
Teste com casos reais.
```

---

## 📋 PROMPT 7: Checklist de Hábitos (Semana 4)

**Para Agent Frontend + Backend:**

```
Você é um mobile developer especializado em React Native.

OBJETIVO: Criar sistema completo de checklist de hábitos.

HÁBITOS PRÉ-DEFINIDOS (5):
1. Respiração/pausa de 2 min
2. Check-in emocional 1x/dia
3. 10 min de descanso/alongamento
4. 1 pedido de ajuda por dia (rede de apoio)
5. 1 conteúdo curto "que me ajudou hoje"

TELA DE HÁBITOS:

1. LISTA DE HÁBITOS:
   - Cards grandes para cada hábito
   - Checkbox circular (grande, fácil de tocar)
   - Nome do hábito
   - Descrição breve
   - Status: feito/nao-feito hoje
   - Streak: "X dias seguidos" (se aplicável)

2. VISUALIZAÇÃO DE PROGRESSO:
   - Calendário mensal (dias marcados)
   - Estatísticas:
     - Total de hábitos completados hoje
     - Streak atual
     - Melhor streak
     - Taxa de conclusão semanal

3. FUNCIONALIDADES:
   - Marcar/desmarcar hábito para hoje
   - Visualizar histórico (últimos 7 dias)
   - Notificações push (opt-in):
     - Lembrete diário (horário personalizado)
     - Celebração de streak

4. INTEGRAÇÃO:
   - Salvar completions no Supabase
   - Calcular streaks no backend
   - Sincronização offline (Zustand Persist)

5. UX:
   - Animações ao marcar (confetti sutil)
   - Feedback visual imediato
   - Micro-interações que transmitem cuidado
   - NUNCA gamificar sofrimento

Crie sistema completo.
Integre com Supabase.
Configure notificações.
```

---

## 📋 PROMPT 8: Feed de Conteúdos (Semana 5)

**Para Agent Frontend + Backend:**

```
Você é um mobile developer especializado em React Native.

OBJETIVO: Criar feed de conteúdos exclusivos da Natália Valente.

CMS BÁSICO (Supabase):

1. TABELA content_items (já criada, usar)
2. ADMIN: Inserir conteúdos manualmente no Supabase Dashboard
3. CAMPOS:
   - title, description, type, content_url, thumbnail_url
   - category, tags, author, is_featured

FEED SCREEN:

1. LISTA DE CONTEÚDOS:
   - Cards visuais grandes
   - Thumbnail (se vídeo/áudio)
   - Título, descrição, categoria
   - Badge de tipo (artigo, vídeo, áudio, post)
   - Botão favoritar (ícone coração)

2. FILTROS:
   - Por categoria
   - Por tipo (artigo, vídeo, áudio, post)
   - Favoritos apenas
   - Busca por texto

3. DETALHE DO CONTEÚDO:
   - Título grande
   - Thumbnail/vídeo player
   - Descrição completa
   - Player de áudio (se aplicável)
   - Botão favoritar
   - Botão compartilhar

4. PLAYER:
   - Vídeo: Expo AV (VideoPlayer)
   - Áudio: Expo AV (AudioPlayer)
   - Controles padrão (play, pause, seek)
   - Download offline (opcional, Expo FileSystem)

5. FAVORITOS:
   - Salvar em content_favorites
   - Indicador visual nos cards
   - Filtro de favoritos

6. CATEGORIAS SUGERIDAS:
   - Bem-estar
   - Alimentação
   - Exercícios
   - Relacionamento
   - Preparação para o parto

Crie feed completo.
Integre com Supabase.
Configure players.
```

---

## 🎯 Como Usar

1. **Abra Cursor 2.0**
2. **Crie novo projeto:** `club-valente`
3. **Abra Composer** (Cmd+I ou Ctrl+I)
4. **Cole o prompt correspondente**
5. **Aguarde execução** (<30s com Composer)
6. **Revise e ajuste** se necessário
7. **Commit e continue!**

---

## 🚀 Próximos Passos

Depois de usar os prompts, você terá:
- ✅ Projeto completo configurado
- ✅ Database schema pronto
- ✅ NAT-IA básico funcionando
- ✅ Design system criado
- ✅ Features core implementadas

**Bora começar?** 🎉
