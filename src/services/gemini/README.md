# Gemini AI Service - Nossa Maternidade

Serviço robusto e otimizado para integração com Google Gemini API, focado em **custo-benefício** e **qualidade**.

## 🎯 Estratégia de Custo-Benefício

### Modelos Disponíveis

| Modelo               | Custo Input | Custo Output | Uso Recomendado                                       |
| -------------------- | ----------- | ------------ | ----------------------------------------------------- |
| **Gemini 2.5 Flash** | $0.15/1M    | $0.60/1M     | **Padrão (90% dos casos)** - Chat, insights, desafios |
| **Gemini 2.5 Pro**   | $1.25/1M    | $10/1M       | **Casos críticos** - Triagem EPDS, análise complexa   |
| **Gemini 2.0 Flash** | $0.10/1M    | $0.40/1M     | Fallback quando Flash 2.5 não disponível              |

**Economia estimada**: $50-80/mês vs usar Pro para tudo

### Quando Usar Cada Modelo

- **Flash 2.5 (Padrão)**: Chat empático, insights diários, desafios, mensagens motivacionais
- **Pro 2.5**: Triagem pós-parto (EPDS), análise de perfis complexos, conteúdo premium Mundo Nath

## 📦 Estrutura

```
src/services/gemini/
├── base.ts          # Cliente base com retry, rate limiting
├── types.ts         # Tipos TypeScript completos
├── chat.ts          # Serviço de chat empático
├── content.ts       # Geração de conteúdo
├── analysis.ts      # Análises e triagens
├── utils.ts         # Builders de prompts e parsers
├── index.ts         # Exportações centralizadas
└── README.md        # Esta documentação
```

## 🚀 Uso Rápido

### Chat Empático (NathIA)

```typescript
import { createChatService } from '@/services/gemini/chat';

const chatService = createChatService();

const result = await chatService.sendMessage({
  message: 'Estou me sentindo ansiosa hoje',
  history: previousMessages,
  onboardingData: userOnboarding,
  userId: 'user-123',
});

if (result.success) {
  console.log(result.text); // Resposta empática
  console.log(result.model); // 'gemini-2.5-flash' ou 'gemini-2.5-pro'
}
```

### Geração de Conteúdo

```typescript
import { createContentService } from '@/services/gemini/content';

const contentService = createContentService();

// Insight diário
const insight = await contentService.generateDailyInsight({
  onboardingData: userOnboarding,
  context: {
    timeOfDay: 'manha',
    recentTopics: ['ansiedade', 'sono'],
  },
  userId: 'user-123',
});

// Desafios personalizados
const challenges = await contentService.generateDailyChallenges({
  onboardingData: userOnboarding,
  userId: 'user-123',
});
```

### Análise e Triagem

```typescript
import { createAnalysisService } from '@/services/gemini/analysis';

const analysisService = createAnalysisService();

// Triagem pós-parto (usa Pro automaticamente)
const screening = await analysisService.analyzePostpartumScreening({
  onboardingData: userOnboarding,
  epdsScore: 15,
  epdsAnswers: [...],
  sentimentHistory: [...],
  userId: 'user-123',
});

if (screening.success && screening.data?.needsProfessionalHelp) {
  // Encaminhar para profissional
}
```

## ⚙️ Configuração

### Variáveis de Ambiente

```bash
EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### Cliente Customizado

```typescript
import { createGeminiClient } from '@/services/gemini/base';

const customClient = createGeminiClient({
  defaultModel: 'gemini-2.5-pro', // Forçar Pro
  maxRetries: 5,
  rateLimit: {
    maxRequests: 100,
    intervalMs: 60000,
  },
});
```

## 🔄 Retry Logic

O serviço implementa retry automático com:

- **Máximo 3 tentativas** (configurável)
- **Backoff exponencial**: 1s, 2s, 4s
- **Fallback de modelo**: Se Flash falhar, tenta Pro (se configurado)
- **Não retry em erros**: 400, 401, bloqueios de segurança

## 🚦 Rate Limiting

- **Padrão**: 60 requests/minuto por usuário
- **Chave customizada**: Use `rateLimitKey` para agrupar requisições
- **Resposta**: Inclui `remaining` e `resetAt` em caso de limite

## 📊 Monitoramento

Todos os serviços retornam metadata de uso:

```typescript
const result = await chatService.sendMessage({...});

console.log(result.usage);
// {
//   promptTokenCount: 150,
//   candidatesTokenCount: 80,
//   totalTokenCount: 230
// }
```

## 🛡️ Segurança

### Safety Settings Padrão

- **Harassment**: BLOCK_NONE (permite desabafos)
- **Hate Speech**: BLOCK_NONE
- **Sexually Explicit**: BLOCK_MEDIUM_AND_ABOVE
- **Dangerous Content**: BLOCK_NONE (permite discussões sobre saúde mental)

### Customização

```typescript
const client = createGeminiClient({
  safetySettings: [
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE', // Mais restritivo
    },
  ],
});
```

## 🔧 Compatibilidade

### Código Legacy

Os arquivos `src/services/geminiService.ts` e `src/lib/gemini.ts` foram refatorados para usar o novo serviço base, mantendo **100% de compatibilidade** com código existente.

```typescript
// Funciona como antes
import { generateDailyInsight } from '@/services/geminiService';
import { sendMessage } from '@/lib/gemini';
```

## 📝 Exemplos Completos

### Exemplo: Chat com Contexto

```typescript
import { createChatService } from '@/services/gemini/chat';

const chatService = createChatService();

const result = await chatService.sendMessage({
  message: 'Como posso melhorar meu sono?',
  history: [
    { role: 'user', content: 'Estou grávida de 20 semanas' },
    { role: 'assistant', content: 'Parabéns! Como você está se sentindo?' },
  ],
  onboardingData: {
    name: 'Maria',
    pregnancy_stage: 'gestante',
    communication_style: 'calorosa',
  },
  extraContext: ['Última consulta: há 2 semanas', 'Medicamentos: ácido fólico'],
  userId: 'user-123',
  preferProModel: false, // Usa Flash (padrão)
});
```

### Exemplo: Conteúdo Mundo Nath

```typescript
import { createContentService } from '@/services/gemini/content';

const contentService = createContentService();

const mundoNath = await contentService.generateMundoNathContent({
  onboardingData: userOnboarding,
  theme: 'Rotina matinal com bebê',
  highlights: ['Acordar às 6h', 'Primeira mamada do dia', 'Momento de autocuidado'],
  callToAction: 'Compartilhe sua rotina nos comentários!',
  userId: 'user-123',
  preferProModel: true, // Usa Pro para conteúdo premium
});
```

## 🐛 Troubleshooting

### Erro: "Gemini API key não configurada"

Configure `EXPO_PUBLIC_GEMINI_API_KEY` no `.env` ou `app.json`.

### Erro: "Limite de requisições atingido"

Aguarde o período de reset ou ajuste `rateLimit` no cliente.

### Resposta vazia

Verifique se a mensagem não foi bloqueada por safety settings. Tente ajustar `safetySettings` se necessário.

## 📚 Referências

- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Pricing](https://ai.google.dev/pricing)
- [Safety Settings](https://ai.google.dev/gemini-api/docs/safety-settings)

