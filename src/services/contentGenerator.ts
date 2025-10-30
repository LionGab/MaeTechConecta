import axios from 'axios';
import { API_CONFIG, API_URLS } from '../config/api';

// Gerar vídeo com avatar usando HeyGen
export const generateVideoWithAvatar = async (script: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${API_URLS.HEYGEN}/video/generate`,
      {
        character_id: 'default_character', // Substitua pelo ID do seu avatar
        text: script,
        voice_id: 'cloned_voice_id', // Substitua pelo ID da voz clonada
      },
      {
        headers: {
          'X-API-KEY': API_CONFIG.HEYGEN_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data.video_url;
  } catch (error) {
    console.error('Erro ao gerar vídeo:', error);
    return '';
  }
};

// Gerar imagem com DALL-E
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${API_URLS.OPENAI}/images/generations`,
      {
        model: 'dall-e-3',
        prompt: `Ilustração gentil e acolhedora sobre ${prompt}. Estilo cartoon brasileiro, cores suaves (rosa e azul), apropriado para gestantes e mães.`,
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

// Gerar conteúdo de lista (enxoval, exercícios, etc.)
export const generateListContent = async (topic: string, context: string): Promise<string[]> => {
  try {
    const response = await axios.post(
      `${API_URLS.OPENAI}/chat/completions`,
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente de maternidade. Gere listas práticas e econômicas em PT-BR.',
          },
          {
            role: 'user',
            content: `Gere uma lista de ${topic} ${context}. Seja prática e econômica. Retorne apenas os itens em formato de array.`,
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
    // Parse simples da lista
    return content.split('\n').filter(item => item.trim() && item.match(/^[-•\d]/));
  } catch (error) {
    console.error('Erro ao gerar lista:', error);
    return [];
  }
};

// Gerar exercícios personalizados
export const generateExercises = async (
  pregnancyWeek: number,
  preferences: string[] = []
): Promise<any[]> => {
  try {
    const stage =
      pregnancyWeek <= 12 ? 'primeiro trimestre' :
      pregnancyWeek <= 27 ? 'segundo trimestre' :
      'terceiro trimestre';

    const response = await axios.post(
      `${API_URLS.OPENAI}/chat/completions`,
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um instrutor de exercícios para gestantes. Seja seguro e prático.',
          },
          {
            role: 'user',
            content: `Gere exercícios seguros para ${stage}, semana ${pregnancyWeek}. Inclua nome, duração, instruções.`,
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
    // Parse e retornar exercícios
    return parseExercises(content);
  } catch (error) {
    console.error('Erro ao gerar exercícios:', error);
    return [];
  }
};

// Parse de exercícios do texto
const parseExercises = (text: string): any[] => {
  const exercises: any[] = [];
  const lines = text.split('\n');
  let currentExercise: any = null;

  for (const line of lines) {
    if (line.match(/^\d+\./)) {
      if (currentExercise) exercises.push(currentExercise);
      currentExercise = {
        name: line.replace(/^\d+\.\s*/, ''),
        duration: '',
        instructions: [],
      };
    } else if (line.match(/Duração:/i) && currentExercise) {
      currentExercise.duration = line.replace(/Duração:\s*/i, '');
    } else if (line.trim() && currentExercise) {
      currentExercise.instructions.push(line.trim());
    }
  }

  if (currentExercise) exercises.push(currentExercise);
  return exercises;
};

