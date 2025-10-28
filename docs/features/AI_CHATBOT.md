# AI Chatbot (NathIA) Feature Specification

## Overview
NathIA is an AI-powered chatbot providing 24/7 support for maternity questions, emotional support, and personalized guidance throughout the motherhood journey.

## Core Capabilities

### 1. Common Questions Answering
**Topics Covered:**
- Baby care basics (bathing, dressing, diapering)
- Breastfeeding support
- Sleep training methods
- Postpartum recovery
- Baby development stages
- Nutrition and feeding
- Safety guidelines
- Emotional well-being

### 2. Emotional Support
**Support Areas:**
- Maternal guilt management
- Postpartum anxiety
- Sleep deprivation coping
- Work-life balance
- Partner communication
- Self-care encouragement

### 3. Personalized Recommendations
**Based on:**
- Baby's age
- Maternity stage
- Previous conversations
- User's interests
- Time of day
- Current challenges

## Component Structure

```
/dashboard/forum/_components/chatbot.tsx
├── chat-interface.tsx
├── message-bubble.tsx
├── typing-indicator.tsx
├── suggested-questions.tsx
└── chat-history.tsx
```

## Chat Interface

```typescript
interface Message {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  timestamp: Date;
  context?: ChatContext;
}

interface ChatContext {
  babyAge?: number; // months
  maternityStage: 'PREGNANT' | 'NEW_MOM' | 'EXPERIENCED_MOM';
  recentTopics: string[];
  emotionalState?: 'STRESSED' | 'HAPPY' | 'TIRED' | 'ANXIOUS';
}
```

## Conversation Flow

### Initial Greeting
```
NathIA: Olá! 👋 Sou a NathIA, sua assistente de maternidade. 
Como posso ajudar você hoje?

[Suggested Questions]
💤 Ajuda com sono do bebê
🤱 Dúvidas sobre amamentação
😌 Preciso de apoio emocional
📚 Dicas gerais de maternidade
```

### Context-Aware Responses
**Example 1: Baby Age-Specific**
```
User: Como fazer meu bebê dormir melhor?

NathIA: [Checks user profile: baby is 3 months old]

Para bebês de 3 meses, aqui estão algumas dicas:

1. **Rotina consistente**: Estabeleça horários regulares...
2. **Sinais de sono**: Observe bocejos e esfregar os olhos...
3. **Ambiente adequado**: Quarto escuro, temperatura 20-22°C...

Seu bebê dorme em berço ou cama compartilhada? Posso 
personalizar mais as dicas. 💙
```

**Example 2: Emotional Support**
```
User: Me sinto culpada por voltar ao trabalho

NathIA: Entendo completamente sua preocupação. A culpa materna 
é muito comum e você não está sozinha. 💕

Lembre-se:
• Trabalhar não diminui seu amor pelo seu bebê
• Você está proporcionando um exemplo importante
• Qualidade do tempo > Quantidade de tempo
• Autocuidado é essencial para ser uma boa mãe

Gostaria de algumas estratégias práticas para equilibrar 
trabalho e maternidade?
```

## Suggested Questions

**Categories:**

**Sono do Bebê:**
- Como estabelecer uma rotina de sono?
- Meu bebê acorda muito à noite, o que fazer?
- Quando tirar a soneca diurna?
- Dicas para bebê dormir no berço

**Amamentação:**
- Como aumentar a produção de leite?
- Dor ao amamentar, é normal?
- Quando introduzir mamadeira?
- Posso amamentar e trabalhar?

**Desenvolvimento:**
- Quando meu bebê vai sentar sozinho?
- Como estimular a fala?
- Marcos de desenvolvimento por idade
- Atividades para estimular o bebê

**Saúde & Cuidados:**
- Como dar banho no bebê?
- Cuidados com o umbigo
- Quando procurar o pediatra?
- Vacinas: dúvidas comuns

**Mãe & Autocuidado:**
- Como lidar com a exaustão?
- Exercícios pós-parto seguros
- Dicas para amamentar e perder peso
- Como pedir ajuda?

## AI Model Integration

### Genkit Flow Implementation

```typescript
// src/ai/flows/answer-common-questions.ts

import { genkit } from 'genkit';
import { googleGenAI } from '@genkit-ai/google-genai';

const ai = genkit({
  plugins: [googleGenAI()],
  model: 'googleai/gemini-pro',
});

export const answerMaternityQuestion = ai.defineFlow(
  {
    name: 'answerMaternityQuestion',
    inputSchema: z.object({
      question: z.string(),
      context: z.object({
        babyAge: z.number().optional(),
        maternityStage: z.enum(['PREGNANT', 'NEW_MOM', 'EXPERIENCED_MOM']),
        previousMessages: z.array(z.string()).optional(),
      }),
    }),
    outputSchema: z.object({
      answer: z.string(),
      suggestedFollowUps: z.array(z.string()),
      relatedContent: z.array(z.object({
        title: z.string(),
        url: z.string(),
      })),
    }),
  },
  async (input) => {
    const systemPrompt = `
You are NathIA, a warm and supportive AI assistant specializing in 
maternal care and baby development. You are part of the "Nossa 
Maternidade" app created by Brazilian influencer Nathalia Valente.

Guidelines:
- Respond in Portuguese (PT-BR)
- Be empathetic and non-judgmental
- Provide evidence-based advice
- Acknowledge when medical consultation is needed
- Use emoji sparingly but warmly (💙 💕 👶)
- Never claim to be a doctor
- Refer to Nathalia's content when relevant
- Consider the baby's age in your advice

User Context:
- Baby Age: ${input.context.babyAge || 'unknown'} months
- Stage: ${input.context.maternityStage}
`;

    const response = await ai.generate({
      model: 'googleai/gemini-pro',
      system: systemPrompt,
      prompt: input.question,
    });

    return {
      answer: response.text,
      suggestedFollowUps: generateFollowUps(input.question),
      relatedContent: findRelatedContent(input.question),
    };
  }
);
```

### Response Guidelines

**Medical Disclaimer:**
When medical advice is needed, NathIA should respond:
```
Essa é uma ótima pergunta, mas como envolve saúde, recomendo 
consultar seu pediatra. Cada bebê é único e um profissional 
pode avaliar melhor. 

Enquanto isso, posso compartilhar informações gerais sobre o 
tema. Gostaria?
```

**Safety-Critical Topics:**
For topics like SIDS, choking, severe illness symptoms:
```
⚠️ Esse é um assunto importante de segurança. 

[Provide immediate safety tips]

Se você está enfrentando essa situação agora, considere:
- Ligar para emergência: 192 (SAMU)
- Contatar seu pediatra imediatamente
- Visitar pronto-socorro se necessário

Não hesite em procurar ajuda médica quando em dúvida.
```

## Features

### 1. Conversation History
- Save last 50 messages
- Search conversation history
- Resume previous conversations
- Export conversation (PDF)

### 2. Voice Input (Future)
- Voice-to-text for hands-free use
- Especially useful while caring for baby
- Text-to-speech for responses

### 3. Quick Replies
- Pre-written responses for common scenarios
- "Sim, por favor"
- "Preciso de mais detalhes"
- "Obrigada, isso ajudou!"
- "Quero falar sobre outro assunto"

### 4. Resource Linking
NathIA can link to:
- Nossa Maternidade content library
- Nathalia's Instagram/TikTok posts
- Related forum discussions
- External trusted resources (Brazilian Ministry of Health, SBP)

### 5. Sentiment Analysis
Monitor user's emotional state:
- Detect stress/anxiety in messages
- Adjust tone accordingly
- Suggest mental health resources when needed
- Alert moderators for severe cases

## Privacy & Ethics

### Data Handling
- Conversations encrypted at rest
- No sharing with third parties
- User can delete history anytime
- Anonymous analytics only

### Ethical Guidelines
- Never replace medical professionals
- Acknowledge AI limitations
- Provide culturally appropriate advice (Brazilian context)
- Avoid judgment on parenting choices
- Respect diverse family structures

## Performance Metrics

**Response Quality:**
- Response time: <3 seconds
- User satisfaction: >4.5/5 stars
- Follow-up rate: >60%
- Helpfulness rating: >85%

**Usage Metrics:**
- Daily active conversations
- Average conversation length
- Most common topics
- Sentiment trends

## Testing Scenarios

### Test Cases
1. **Basic Question**: "Como dar banho no bebê?"
2. **Age-Specific**: "Meu bebê de 6 meses não senta ainda"
3. **Emotional Support**: "Estou muito cansada"
4. **Medical Boundary**: "Meu bebê está com febre alta"
5. **Controversial Topic**: "Quando tirar a fralda?"

### Expected Behaviors
- Accurate information
- Empathetic tone
- Age-appropriate advice
- Medical disclaimers when needed
- Resource suggestions

## Future Enhancements

### Phase 2
- [ ] Image analysis (upload baby photo for rash identification)
- [ ] Voice interface
- [ ] Video call booking with experts
- [ ] Community question routing

### Phase 3
- [ ] Multi-language support
- [ ] Partner mode (advice for dads/partners)
- [ ] Pregnancy tracking integration
- [ ] Pediatrician integration

---

*Feature Specification v1.0*  
*Last Updated: October 28, 2025*
