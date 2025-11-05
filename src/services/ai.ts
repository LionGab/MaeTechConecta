import axios from 'axios';
import { API_CONFIG, API_URLS } from '@/config/api';

const SYSTEM_PROMPT = `Você é a assistente virtual "Nossa Maternidade", inspirada na personalidade de uma influenciadora brasileira jovem e empática. Sua missão é apoiar gestantes e mães com linguagem casual, carinhosa e acessível.

INSTRUÇÕES CRÍTICAS:
- Use PT-BR informal e empático (como uma amiga próxima)
- NUNCA faça diagnósticos ou prescrições médicas
- SEMPRE inclua disclaimer: "💡 Lembre-se: cada gestação é única. Consulte sempre seu médico para dúvidas importantes."
- Para emergências (sangramento, dor forte, desmaios): "🚨 Procure ajuda médica IMEDIATAMENTE. Ligue para o SAMU: 192"
- Use emojis moderadamente para humanizar a conversa
- Seja prática e ofereça soluções rápidas
- Valide com base de dados médicos (OMS, SBP, SUS)
- Temperatura: 0.4 para evitar alucinações

CONTEXTO DO USUÁRIO: {{CONTEXT}}`;

export interface ChatContext {
  type?: 'gestante' | 'mae' | 'tentante';
  pregnancy_week?: number;
  baby_name?: string;
  preferences?: string[];
}

/**
 * Chat com NAT-IA via Edge Function (Gemini 2.0 Flash)
 * Usa nathia-chat Edge Function do Supabase
 */
export const chatWithNATIA = async (message: string, context: ChatContext, userId: string): Promise<string> => {
  try {
    const { supabase } = await import('./supabase');

    const { data, error } = await supabase.functions.invoke('nathia-chat', {
      body: {
        userId,
        message,
        context,
      },
    });

    if (error) {
      throw new Error(`Edge Function error: ${error.message}`);
    }

    if (!data?.response) {
      throw new Error('Resposta vazia da Edge Function');
    }

    return data.response;
  } catch (error: any) {
    // Re-throw para ser tratado pelo retry system
    throw new Error(`NAT-IA API error: ${error.message}`);
  }
};

/**
 * Chat com IA (Fallback para Claude se Edge Function falhar)
 * @deprecated Use chatWithNATIA para produção
 */
export const chatWithAI = async (message: string, context: ChatContext, history: any[] = []): Promise<string> => {
  try {
    const contextString = context.type
      ? `Perfil: ${context.type}, Semana: ${context.pregnancy_week || 'N/A'}, Bebê: ${context.baby_name || 'Aguardando...'}`
      : 'Perfil em configuração';

    const systemPromptWithContext = SYSTEM_PROMPT.replace('{{CONTEXT}}', contextString);

    const response = await axios.post(
      API_URLS.CLAUDE,
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        temperature: 0.4,
        system: systemPromptWithContext,
        messages: [
          ...history,
          {
            role: 'user',
            content: message,
          },
        ],
      },
      {
        headers: {
          'x-api-key': API_CONFIG.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.content[0].text;
  } catch (error: any) {
    // Re-throw para ser tratado pelo retry system
    throw new Error(`Claude API error: ${error.response?.data?.error?.message || error.message}`);
  }
};

export const validateWithGPT = async (message: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${API_URLS.OPENAI}/chat/completions`,
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Valide se esta resposta de IA sobre maternidade é segura e não contém diagnósticos médicos.',
          },
          {
            role: 'user',
            content: `Valide: ${message}`,
          },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const validation = response.data.choices[0].message.content.toLowerCase();
    return !validation.includes('inseguro') && !validation.includes('diagnóstico');
  } catch (error) {
    console.error('Erro na validação GPT:', error);
    return true; // Permite resposta em caso de erro
  }
};

export const generateDailyPlan = async (context: ChatContext): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URLS.OPENAI}/chat/completions`,
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'Você é um assistente de maternidade. Crie um plano diário personalizado para gestantes/mães em PT-BR casual.',
          },
          {
            role: 'user',
            content: `Crie plano diário para: ${context.type}, ${context.pregnancy_week} semanas. Inclua: 3 prioridades, 1 dica do dia, 1 receita econômica.`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;

    // Parse simples do conteúdo
    const priorities =
      content
        .match(/(?<=Prioridades:)(.*?)(?=Dica)/s)?.[0]
        ?.split('\n')
        .filter(Boolean) || [];
    const tip = content.match(/(?<=Dica do Dia:)(.*?)(?=Receita)/s)?.[0]?.trim() || '';
    const recipe = content.match(/(?<=Receita:)(.*?)$/s)?.[0]?.trim() || '';

    return { priorities, tip, recipe };
  } catch (error) {
    console.error('Erro ao gerar plano diário:', error);
    return {
      priorities: ['💧 Beber 8 copos de água', '📅 Marcar consulta pré-natal', '🧘 Exercícios leves'],
      tip: 'Cuidar de você é cuidar do seu bebê! Tire um tempo para respirar hoje. 💕',
      recipe: 'Vitamina de Banana: 1 banana + 1 copo de leite + 1 colher de mel. Batido com gelo!',
    };
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${API_URLS.OPENAI}/images/generations`,
      {
        model: 'dall-e-3',
        prompt: `Ilustração gentil e acolhedora: ${prompt}. Estilo cartoon brasileiro, cores suaves (rosa e azul), apropriado para gestantes e mães.`,
        size: '1024x1024',
        quality: 'standard',
      },
      {
        headers: {
          Authorization: `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data[0].url;
  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    return '';
  }
};

export const detectUrgency = (message: string): boolean => {
  const urgencyKeywords = [
    'sangrando',
    'sangramento',
    'sangue',
    'dor forte',
    'muita dor',
    'dor insuportável',
    'desmaio',
    'desmaiei',
    'febre alta',
    'convulsão',
    'não me sinto bem',
    'emergência',
    'urgente',
  ];

  const lowerMessage = message.toLowerCase();
  return urgencyKeywords.some((keyword) => lowerMessage.includes(keyword));
};
