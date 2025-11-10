/**
 * Gemini Client - Integração com Google Gemini (Legacy - Mantido para compatibilidade)
 *
 * @deprecated Use os serviços especializados de @/services/gemini:
 * - createChatService() para chat empático
 * - createContentService() para geração de conteúdo
 *
 * Este arquivo mantém compatibilidade com código existente mas
 * internamente usa o novo serviço base otimizado.
 *
 * Cliente para comunicação com Gemini API para NAT-AI
 */

import { createGeminiClient } from '@/services/gemini/base';
import { extractPrimaryText } from '@/services/gemini/utils';
import type { GeminiContent } from '@/services/gemini/types';

/**
 * Interface para chat Gemini (mantida para compatibilidade)
 */
export interface GeminiChat {
  history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
  systemPrompt: string;
}

const FALLBACK_RESPONSE = `Oi querida! Peço desculpas, mas estou tendo dificuldades técnicas no momento.

Mas quero que você saiba: estou aqui para você, e seus sentimentos são importantes. Você não está sozinha.

Pode tentar novamente em alguns instantes? Ou, se precisar de ajuda urgente, por favor busque apoio profissional (CVV 188, SAMU 192).

Estou aqui sempre que você precisar. 💝`;

/**
 * Cria uma sessão de chat NAT-AI com Gemini
 */
export async function createNatAIChat(
  systemPrompt: string,
  history: Array<{ role: 'user' | 'model'; parts: string | Array<{ text: string }> }> = []
): Promise<GeminiChat> {
  try {
    // Converter histórico para formato Gemini
    const chatHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = history.map((msg) => {
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
export async function sendMessage(chat: GeminiChat, message: string, maxRetries = 3): Promise<string> {
  try {
    const client = createGeminiClient();

    // Converter histórico para formato Gemini
    const contents: GeminiContent[] = [
      ...chat.history.map((msg) => ({
        role: msg.role,
        parts: msg.parts,
      })),
      {
        role: 'user' as const,
        parts: [{ text: message }],
      },
    ];

    const response = await client.call({
      contents,
      systemInstruction: chat.systemPrompt,
      userId: 'nat-ai-legacy',
      requestId: `nat-ai-${Date.now()}`,
    });

    const text = extractPrimaryText(response);

    if (!text) {
      throw new Error('Resposta vazia do Gemini');
    }

    return text;
  } catch (error: any) {
    console.error('Erro ao enviar mensagem:', error);

    // Se for erro de segurança, não usar fallback
    if (error.message?.includes('SAFETY') || error.message?.includes('blocked')) {
      throw new Error('Mensagem bloqueada por segurança');
    }

    // Retornar fallback empático em caso de erro
    return FALLBACK_RESPONSE;
  }
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
      .map((msg) => `${msg.role === 'user' ? 'Usuária' : 'NAT-AI'}: ${msg.content}`)
      .join('\n\n');

    const prompt = `Por favor, resuma as seguintes conversas anteriores de forma concisa (máximo 300 palavras), mantendo apenas informações emocionalmente relevantes e contexto importante sobre a usuária (nome, desafios, conquistas, contexto familiar).

Conversas:
${messagesText}

Resumo:`;

    const client = createGeminiClient();

    const response = await client.call({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 400,
      },
      userId: 'nat-ai-summary',
      requestId: `summary-${Date.now()}`,
    });

    const summary = extractPrimaryText(response);

    if (!summary) {
      throw new Error('Resumo vazio');
    }

    return summary.trim();
  } catch (error: any) {
    console.error('Erro ao resumir mensagens:', error);
    // Retornar resumo básico se falhar
    return `Resumo da conversa anterior: ${messages.length} mensagens trocadas sobre temas de maternidade e apoio emocional.`;
  }
}

