/**
 * Gemini Client - Integração com Google Gemini 2.5 Pro
 *
 * Cliente para comunicação com Gemini API para NAT-AI
 * Usa fetch diretamente para compatibilidade universal
 */

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY não configurada');
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

/**
 * Configuração de segurança permissiva para mães desabafarem livremente
 */
const SAFETY_SETTINGS = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_NONE' as const,
  },
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_NONE' as const,
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE' as const,
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_NONE' as const, // Permitir desabafos sobre pensamentos difíceis
  },
];

/**
 * Configuração de geração
 */
const GENERATION_CONFIG = {
  temperature: 0.8, // Criatividade e empatia
  maxOutputTokens: 800, // Respostas concisas mas completas
  topP: 0.95,
  topK: 40,
};

/**
 * Interface para chat Gemini
 */
export interface GeminiChat {
  history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
  systemPrompt: string;
}

/**
 * Cria uma sessão de chat NAT-AI com Gemini
 */
export async function createNatAIChat(
  systemPrompt: string,
  history: Array<{ role: 'user' | 'model'; parts: string | Array<{ text: string }> }> = []
): Promise<GeminiChat> {
  try {
    // Converter histórico para formato Gemini
    const chatHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = history.map(msg => {
      const role: 'user' | 'model' = msg.role === 'user' ? 'user' : 'model';
      if (typeof msg.parts === 'string') {
        return {
          role,
          parts: [{ text: msg.parts }],
        };
      }
      return {
        role,
        parts: msg.parts as Array<{ text: string }>,
      };
    });

    return {
      history: chatHistory,
      systemPrompt,
    };
  } catch (error: any) {
    console.error('Erro ao criar chat Gemini:', error);
    throw new Error(`Falha ao criar sessão NAT-AI: ${error.message}`);
  }
}

/**
 * Envia mensagem para o chat e retorna resposta
 */
export async function sendMessage(
  chat: GeminiChat,
  message: string,
  maxRetries = 3
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY não configurada');
      }

      // Construir histórico completo
      const allMessages = [
        ...chat.history,
        { role: 'user' as const, parts: [{ text: message }] },
      ];

      // Chamar API Gemini
      const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: allMessages.map(msg => ({
            role: msg.role,
            parts: msg.parts,
          })),
          systemInstruction: chat.systemPrompt,
          generationConfig: GENERATION_CONFIG,
          safetySettings: SAFETY_SETTINGS,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text || text.trim().length === 0) {
        throw new Error('Resposta vazia do Gemini');
      }

      return text.trim();
    } catch (error: any) {
      lastError = error;
      console.error(`Tentativa ${attempt}/${maxRetries} falhou:`, error);

      // Se não for erro recuperável, não tenta novamente
      if (error.message?.includes('SAFETY') || error.message?.includes('blocked')) {
        throw new Error('Mensagem bloqueada por segurança');
      }

      // Backoff exponencial: 1s, 2s, 4s
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Se todas as tentativas falharam, retornar resposta empática de fallback
  if (lastError) {
    console.error('Todas as tentativas falharam, usando fallback:', lastError);
    return FALLBACK_RESPONSE;
  }

  return FALLBACK_RESPONSE;
}

/**
 * Resumir mensagens antigas usando Gemini
 */
export async function summarizeOldMessages(
  messages: Array<{ role: 'user' | 'model'; content: string }>,
  systemPrompt: string
): Promise<string> {
  try {
    if (messages.length === 0) {
      return '';
    }

    // Formatar mensagens para resumo
    const messagesText = messages
      .map(msg => `${msg.role === 'user' ? 'Usuária' : 'NAT-AI'}: ${msg.content}`)
      .join('\n\n');

    const prompt = `Por favor, resuma as seguintes conversas anteriores de forma concisa (máximo 300 palavras), mantendo apenas informações emocionalmente relevantes e contexto importante sobre a usuária (nome, desafios, conquistas, contexto familiar).

Conversas:
${messagesText}

Resumo:`;

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY não configurada');
    }

    // Chamar API Gemini diretamente
    const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: systemPrompt,
        generationConfig: {
          ...GENERATION_CONFIG,
          maxOutputTokens: 400, // Resumo mais curto
          temperature: 0.5, // Mais objetivo para resumos
        },
        safetySettings: SAFETY_SETTINGS,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return summary.trim();
  } catch (error: any) {
    console.error('Erro ao resumir mensagens:', error);
    // Retornar resumo básico se falhar
    return `Resumo da conversa anterior: ${messages.length} mensagens trocadas sobre temas de maternidade e apoio emocional.`;
  }
}

/**
 * Resposta empática de fallback quando Gemini falha
 */
const FALLBACK_RESPONSE = `Oi querida! Peço desculpas, mas estou tendo dificuldades técnicas no momento.

Mas quero que você saiba: estou aqui para você, e seus sentimentos são importantes. Você não está sozinha.

Pode tentar novamente em alguns instantes? Ou, se precisar de ajuda urgente, por favor busque apoio profissional (CVV 188, SAMU 192).

Estou aqui sempre que você precisar. 💝`;
