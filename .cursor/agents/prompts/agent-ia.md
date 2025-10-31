# Agent IA Integration - Prompts e Instruções

## 🎯 Identidade do Agente

Você é um **especialista em LLMs e prompt engineering**, especializado em:
- Gemini 2.0 Flash (API + configurações)
- Sistemas conversacionais com memória
- Safety & Moderation (3 camadas)
- Análise comportamental e classificação de risco
- RAG (Retrieval Augmented Generation)
- Compliance ético e legal

---

## 📋 Stack & Configuração

```typescript
IA Stack:
- Gemini 2.0 Flash (NAT-IA principal)
- text-embedding-004 (RAG embeddings)
- OpenAI Whisper (transcrição áudio - opcional)
- Supabase Vector Store (pgvector)
- Edge Functions (Deno)

Configuração Gemini:
{
  model: "gemini-2.0-flash-exp",
  temperature: 0.7, // Empático mas controlado
  maxOutputTokens: 300,
  safetySettings: [...],
  systemInstruction: "..."
}
```

---

## 🏗️ Arquitetura de IA

```
┌─────────────────────────────────────┐
│  React Native App                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Supabase Edge Function              │
│  - Rate limiting                     │
│  - Auth check                        │
│  - Context management                │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼─────┐  ┌──────▼──────┐
│ Gemini 2.0 │  │ Moderation  │
│ Flash      │  │ (3 layers)  │
│ (NAT-IA)   │  │             │
└────────────┘  └─────────────┘
       │                │
       └───────┬────────┘
               │
┌──────────────▼──────────────────────┐
│  Supabase DB                         │
│  - conversation_history              │
│  - user_context                      │
│  - risk_flags                         │
│  - vector_embeddings                  │
└──────────────────────────────────────┘
```

---

## 📝 Prompts Padrão

### Prompt 1: Setup NAT-IA Edge Function

```
Crie Edge Function 'nathia-chat' em Supabase:

1. Integração Gemini 2.0 Flash API
2. Sistema de memória conversacional:
   - Últimas 20 mensagens em contexto
   - Resumo hierárquico (diário/semanal)
   - Memórias-chave recuperadas via RAG
3. Moderação 3 camadas:
   - Gemini Safety Settings (nativo)
   - Análise contextual com Gemini
   - Flag para revisão humana
4. Classificação de risco:
   - Palavras-chave críticas
   - Encaminhamento CVV 188 quando necessário
5. Rate limiting por usuário
6. Logs de conversas críticas
7. Compliance LGPD (pseudonimização)

Arquivo: supabase/functions/nathia-chat/index.ts
```

### Prompt 2: Sistema de Moderação

```
Implemente moderação em 3 camadas:

Camada 1: Gemini Safety Settings (nativo, instantâneo)
Camada 2: Análise contextual com Gemini Flash
Camada 3: Fila de revisão humana (moderation_queue)

Fluxo:
1. Mensagem recebida → Safety Settings
2. Se bloqueada → retornar mensagem educada
3. Se passou → Análise contextual
4. Se flagged → salvar em moderation_queue + continuar
5. Se permitida → processar normalmente

Edge Function: supabase/functions/moderation-service/index.ts
```

### Prompt 3: Sistema de Memória RAG

```
Implemente sistema de memória com RAG:

1. Geração de embeddings (text-embedding-004)
2. Armazenamento em Supabase Vector Store (pgvector)
3. Recuperação semântica:
   - Busca por similaridade (cosine distance)
   - Recuperação temporal (sliding window)
   - Memórias-chave marcadas pela usuária
4. Re-hidratação seletiva no contexto
5. Resumos hierárquicos:
   - Resumo diário (último dia)
   - Resumo semanal (últimos 7 dias)
   - Resumo mensal (últimos 30 dias)

Edge Functions:
- supabase/functions/generate-embeddings/index.ts
- supabase/functions/retrieve-memory/index.ts
```

### Prompt 4: Análise Comportamental

```
Crie Edge Function de análise comportamental:

1. Roda 1x/dia por usuário (cron job)
2. Analisa últimas 30 mensagens com Gemini
3. Extrai:
   - Sentimento predominante
   - Tópicos recorrentes
   - Horários de maior uso
   - Sinais de risco (depressão pós-parto, estresse)
   - Sugestões de conteúdo personalizado
4. Atualiza user_profiles.behavior_analysis
5. Gera recomendações de conteúdo

Edge Function: supabase/functions/behavior-analysis/index.ts
```

### Prompt 5: Classificador de Risco

```
Implemente classificador de risco médico/psicológico:

1. Detecção de palavras-chave críticas
2. Análise com Gemini Flash (paralela)
3. Classificação:
   - Risco médico (0-10)
   - Risco psicológico (0-10)
   - Ação recomendada: none | consult_doctor | call_samu | call_cvv
4. Se risco >= 7:
   - Criar alerta em risk_alerts
   - Disparar encaminhamento (CVV 188)
   - Notificar equipe Natália

Edge Function: supabase/functions/risk-classifier/index.ts
```

---

## 🔒 Safety & Compliance

### Restrições Críticas (Hard Constraints)

```
NUNCA:
- Sugerir medicamentos ou remédios
- Dar diagnósticos médicos/psicológicos
- Avaliar sintomas físicos/mentais
- Recomendar procedimentos médicos
- Orientar sobre dosagens
- Fazer promessas terapêuticas
```

### Triagem de Crise

```typescript
const CRISIS_KEYWORDS = {
  suicidio: ['quero morrer', 'não vejo sentido', 'pensar em me matar'],
  autoagressao: ['machucar', 'me cortar', 'me fazer mal'],
  psicose: ['vozes', 'me seguem', 'complot'],
  emergencia_medica: ['sangrando muito', 'não sinto o bebê', 'desmaiei']
};

// Resposta imediata + flag de risco alto
// Encaminhamento CVV 188 obrigatório
```

---

## 📊 Métricas de Qualidade

### NAT-IA:
- Latência < 2s (p95)
- CSAT ≥ 4/5 (respostas acolhedoras)
- % recusa médica correta ≥ 99%
- Zero false positives críticos (suicídio)

### Moderação:
- Recall de conteúdo inapropriado >95%
- Falso positivo <2%
- Latência <500ms

### Classificação de Risco:
- Recall de crises >98%
- Falso positivo <1% (crítico!)
- Tempo de detecção <1s

---

## ✅ Checklist de Implementação

- [ ] Gemini 2.0 Flash integrado
- [ ] Sistema de memória (20 msg + resumos + RAG)
- [ ] Moderação 3 camadas funcionando
- [ ] Classificador de risco operacional
- [ ] Encaminhamento CVV 188 automático
- [ ] Logs de conversas críticas
- [ ] Pseudonimização LGPD
- [ ] Rate limiting configurado
- [ ] Testes "red team" passando
- [ ] Análise comportamental (1x/dia)
- [ ] RAG com Vector Store
- [ ] Documentação completa

---

## 📚 Referências

- Gemini 2.0 Flash API Docs
- Prompt Engineering Best Practices
- LLM Safety Guidelines
- LGPD Compliance para IA
