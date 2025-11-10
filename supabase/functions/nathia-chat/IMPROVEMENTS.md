# 🤖 MELHORIAS NATHIA CHAT (Gemini 2.0 Flash)

**⚠️ IMPORTANTE:** Manter Gemini 2.0 Flash. NÃO trocar por Claude.

---

## 1. SYSTEM PROMPT MELHORADO

**Arquivo:** `supabase/functions/nathia-chat/index.ts`

```typescript
const IMPROVED_SYSTEM_PROMPT = `
Você é NathIA, assistente virtual da Nathália Valente (35M seguidores).

DOMÍNIO EXCLUSIVO:
- ✅ Gravidez, parto, amamentação, bebês 0-3 anos
- ✅ Puerpério, saúde mental materna
- ✅ Relacionamento mãe-bebê, desenvolvimento infantil
- ✅ Autocuidado materno, rede de apoio

BLOQUEIOS ABSOLUTOS:
- ❌ Perguntas fora de maternidade → "Oi, meu amor! Só consigo te ajudar com dúvidas sobre maternidade 💕"
- ❌ Diagnósticos médicos → "Essa dúvida é importante! Converse com seu obstetra/pediatra 👩‍⚕️"
- ❌ Prescrições/medicamentos → "Só um médico pode te indicar isso com segurança ❤️"
- ❌ Política, finanças, tecnologia, entretenimento

TOM DE VOZ:
- Acolhedora, empática, jamais professoral
- Linguagem simples (classe C-D)
- Emojis moderados (1-2 por resposta): 💕🤱🍼👶💪
- Parágrafos curtos (WhatsApp style)
- Foco em validação emocional + informação prática

ESTRUTURA DE RESPOSTA:
1. Validação empática (1 linha)
   Ex: "Entendo sua preocupação, isso é super comum! 💕"
2. Resposta objetiva (2-3 parágrafos curtos)
   - Use listas quando possível
   - Evite jargões médicos complexos
3. Call-to-action ou pergunta follow-up
   Ex: "Quer conversar mais sobre algum desses pontos?"

EXEMPLOS:

❌ ERRADO (técnico demais):
"A lactação está relacionada com o processo de prolactina e ocitocina..."

✅ CORRETO (acessível):
"A amamentação funciona assim: quanto mais você amamenta, mais leite produz! É como oferta e demanda 💕"

❌ ERRADO (diagnóstico):
"Você pode estar com mastite. Precisa de antibióticos."

✅ CORRETO (orientação):
"Esses sintomas podem ser sinais de algo que precisa de atenção médica. Consulte seu obstetra hoje, tá? 👩‍⚕️"
`;
```

---

## 2. MODERAÇÃO DE INTENT (PRÉ-ENVIO)

**Adicionar antes de processar com Gemini:**

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Classifica se a mensagem é sobre maternidade
 */
async function moderateIntent(userMessage: string): Promise<boolean> {
  const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  try {
    const result = await model.generateContent(`
      Classifique se a pergunta é sobre MATERNIDADE/GESTAÇÃO/BEBÊS:

      TÓPICOS VÁLIDOS:
      - Gravidez, parto, amamentação
      - Bebês (0-3 anos), desenvolvimento infantil
      - Puerpério, saúde mental materna
      - Relacionamento mãe-bebê
      - Autocuidado materno

      TÓPICOS INVÁLIDOS:
      - Política, finanças, entretenimento
      - Tecnologia, culinária geral, viagens
      - Relacionamentos não relacionados a maternidade
      - Qualquer assunto não relacionado a mães/bebês

      Pergunta: "${userMessage}"

      Responda APENAS: SIM ou NÃO
    `);

    const answer = result.response.text().trim().toUpperCase();
    return answer.includes('SIM');
  } catch (error) {
    console.error('[Intent Moderation] Error:', error);
    // Em caso de erro, permitir (para não bloquear usuárias legítimas)
    return true;
  }
}

/**
 * Detecta urgência médica (keywords críticos)
 */
function detectUrgency(message: string): { isUrgent: boolean; keywords: string[] } {
  const urgentKeywords = [
    'sangramento',
    'sangue',
    'dor forte',
    'dor intensa',
    'desmaio',
    'desmaiando',
    'febre alta',
    'convulsão',
    'não mexe',
    'não respira',
    'bebê roxo',
    'inconsciente',
  ];

  const foundKeywords = urgentKeywords.filter((keyword) => message.toLowerCase().includes(keyword));

  return {
    isUrgent: foundKeywords.length > 0,
    keywords: foundKeywords,
  };
}
```

---

## 3. EDGE FUNCTION ATUALIZADA

**Arquivo:** `supabase/functions/nathia-chat/index.ts`

**Fluxo completo:**

```typescript
serve(async (req) => {
  try {
    const { message, userId, conversationHistory } = await req.json();

    // 1. VALIDAR INTENT (é sobre maternidade?)
    const isMaternityTopic = await moderateIntent(message);

    if (!isMaternityTopic) {
      // Log para análise
      await logOffTopicMessage(userId, message);

      return new Response(
        JSON.stringify({
          response:
            'Oi, meu amor! Adoro conversar, mas só consigo te ajudar com dúvidas sobre maternidade, gestação e cuidados com bebê 💕\n\nQuer me perguntar algo sobre esses assuntos?',
          blocked: true,
          reason: 'off_topic',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. DETECTAR URGÊNCIA
    const urgency = detectUrgency(message);

    if (urgency.isUrgent) {
      // Log urgência
      await logUrgentMessage(userId, message, urgency.keywords);

      return new Response(
        JSON.stringify({
          response: `🚨 ATENÇÃO: Detectei sintomas que podem ser urgentes (${urgency.keywords.join(', ')}).\n\nPor favor, ligue AGORA para:\n- SAMU: 192\n- Seu hospital de referência\n- Seu médico obstetra/pediatra\n\nEm caso de emergência, não espere! 🏥`,
          urgent: true,
          keywords: urgency.keywords,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. VERIFICAR RATE LIMIT
    const rateLimitOk = await checkRateLimit(userId, 10); // 10 msg/min
    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({
          error: 'Calma, querida! Vamos com calma nas perguntas. Aguarde um minutinho e voltamos a conversar 💕',
          rateLimit: true,
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 4. PROCESSAR COM GEMINI (fluxo normal)
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: IMPROVED_SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: conversationHistory || [],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    // 5. VALIDAR RESPOSTA (não deve conter diagnósticos)
    const validated = validateResponse(response);
    if (!validated.safe) {
      console.warn('[Response Validation] Unsafe response:', validated.reason);
      // Adicionar disclaimer
      response += '\n\n⚠️ Lembre-se: qualquer dúvida médica deve ser confirmada com seu obstetra/pediatra.';
    }

    // 6. SALVAR NO BANCO
    await saveMessage(userId, message, response);

    return new Response(
      JSON.stringify({
        response,
        safe: validated.safe,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[NathIA Chat] Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Ops! Tive um probleminha. Tenta de novo em alguns segundos? 💕',
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * Valida resposta da IA (não deve conter diagnósticos)
 */
function validateResponse(response: string): { safe: boolean; reason?: string } {
  const forbiddenPhrases = [
    'você tem',
    'você está com',
    'diagnóstico',
    'pode ser que você tenha',
    'sintoma de',
    'tome esse remédio',
    'use esse medicamento',
  ];

  for (const phrase of forbiddenPhrases) {
    if (response.toLowerCase().includes(phrase)) {
      return { safe: false, reason: `Contains forbidden phrase: ${phrase}` };
    }
  }

  return { safe: true };
}

/**
 * Rate Limiting (10 msg/min por usuário)
 */
async function checkRateLimit(userId: string, maxPerMinute: number): Promise<boolean> {
  // Implementar com Redis ou Supabase
  // Exemplo simplificado:
  const key = `ratelimit:${userId}:${Math.floor(Date.now() / 60000)}`;

  // Buscar do cache/banco
  const count = await getRateLimitCount(key);

  if (count >= maxPerMinute) {
    return false;
  }

  // Incrementar
  await incrementRateLimitCount(key);
  return true;
}
```

---

## 4. ERROR HANDLING & RETRY LOGIC

```typescript
/**
 * Wrapper com retry automático
 */
async function callGeminiWithRetry(chat: any, message: string, maxRetries = 3): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error: any) {
      console.error(`[Gemini] Attempt ${attempt} failed:`, error);
      lastError = error;

      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  // Fallback após todas as tentativas
  throw lastError || new Error('Max retries exceeded');
}
```

---

## 5. ANALYTICS & LOGGING

```typescript
/**
 * Log de mensagens bloqueadas (off-topic)
 */
async function logOffTopicMessage(userId: string, message: string) {
  await supabase.from('moderation_queue').insert({
    user_id: userId,
    message,
    category: 'off_topic',
    severity: 1,
    action: 'block',
    reviewed: false,
  });
}

/**
 * Log de mensagens urgentes
 */
async function logUrgentMessage(userId: string, message: string, keywords: string[]) {
  await supabase.from('risk_alerts').insert({
    user_id: userId,
    risk_type: 'medical',
    severity: 10,
    message_context: message,
    action_taken: `Redirected to emergency services. Keywords: ${keywords.join(', ')}`,
    resolved: false,
  });
}

/**
 * Salvar conversa
 */
async function saveMessage(userId: string, userMessage: string, aiResponse: string) {
  await supabase.from('chat_messages').insert({
    user_id: userId,
    message: userMessage,
    response: aiResponse,
    role: 'assistant',
    created_at: new Date().toISOString(),
  });
}
```

---

## 6. TESTES RECOMENDADOS

**Casos de teste:**

1. **Teste de Intent:**
   - ✅ "Como amamentar?" → PERMITIR
   - ❌ "Qual o melhor celular?" → BLOQUEAR
   - ❌ "O que você acha do presidente?" → BLOQUEAR

2. **Teste de Urgência:**
   - 🚨 "Estou com sangramento forte" → URGENTE
   - 🚨 "Meu bebê não respira" → URGENTE
   - ✅ "Meu bebê está chorando muito" → Normal

3. **Teste de Diagnóstico:**
   - ❌ Resposta: "Você tem mastite" → BLOQUEAR
   - ✅ Resposta: "Esses sintomas podem indicar algo. Consulte seu médico" → OK

4. **Teste de Rate Limit:**
   - Enviar 11 mensagens em 1 minuto → 11ª deve ser bloqueada

---

## 7. DEPLOY

```bash
# 1. Atualizar Edge Function
cd supabase/functions/nathia-chat
# Fazer as alterações no index.ts

# 2. Deploy
supabase functions deploy nathia-chat

# 3. Verificar logs
supabase functions logs nathia-chat --tail
```

---

## 8. CUSTOS ESTIMADOS

**Gemini 2.0 Flash:**

- Preço: $0.075 por 1M tokens de input
- Preço: $0.30 por 1M tokens de output

**Exemplo de uso:**

- 100 conversas/dia
- 10 mensagens/conversa = 1000 mensagens/dia
- ~500 tokens/mensagem = 500k tokens/dia
- Custo diário: $0.0375 (input) + $0.15 (output) = ~$0.19/dia
- **Custo mensal: ~$5.70** (muito acessível!)

**Comparação com Claude:**

- Claude Sonnet: $3 por 1M tokens input
- Custo mensal seria: ~$90

**Conclusão:** Gemini é 15x mais barato para chat contínuo! 🎉

---

## 9. CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Atualizar `IMPROVED_SYSTEM_PROMPT`
- [ ] Adicionar `moderateIntent()` function
- [ ] Adicionar `detectUrgency()` function
- [ ] Implementar rate limiting
- [ ] Adicionar `validateResponse()`
- [ ] Implementar retry logic
- [ ] Adicionar logging (off-topic, urgent, saves)
- [ ] Testar casos de borda
- [ ] Deploy para produção
- [ ] Monitorar logs por 24h

---

**✅ MANTÉM GEMINI 2.0 FLASH - APENAS MELHORA GUARDRAILS E MODERAÇÃO**
