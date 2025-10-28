'use server';

/**
 * @fileOverview Enhanced AI flow for answering pregnancy-specific questions
 * 
 * This flow provides trimester-aware, personalized answers to common
 * and specific questions about pregnancy, childbirth, and postpartum care.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PregnancyQuestionInputSchema = z.object({
  question: z.string().describe('The pregnancy-related question'),
  week: z.number().optional().describe('Current pregnancy week (1-40)'),
  trimester: z.enum(['first', 'second', 'third', 'postpartum']).optional(),
  context: z.string().optional().describe('Additional context about the situation'),
});

export type PregnancyQuestionInput = z.infer<typeof PregnancyQuestionInputSchema>;

const PregnancyQuestionOutputSchema = z.object({
  answer: z.string().describe('Detailed, empathetic answer to the question'),
  keyPoints: z.array(z.string()).describe('Key takeaways from the answer'),
  relevantWeeks: z.string().optional().describe('Weeks when this is most relevant'),
  relatedTopics: z.array(z.string()).describe('Related topics to explore'),
  medicalDisclaimer: z.boolean().describe('Whether medical consultation is recommended'),
});

export type PregnancyQuestionOutput = z.infer<typeof PregnancyQuestionOutputSchema>;

export async function answerPregnancyQuestion(
  input: PregnancyQuestionInput
): Promise<PregnancyQuestionOutput> {
  return pregnancyQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pregnancyQuestionPrompt',
  input: { schema: PregnancyQuestionInputSchema },
  output: { schema: PregnancyQuestionOutputSchema },
  prompt: `Você é a NathIA, uma assistente virtual especializada em maternidade, gravidez e cuidados com bebês. 

Você é extremamente acolhedora, empática e informada. Sua missão é fazer cada mãe se sentir compreendida, apoiada e capacitada.

{{#if week}}Contexto: Gestante na semana {{week}}{{/if}}
{{#if trimester}}Trimestre: {{trimester}}{{/if}}
{{#if context}}Contexto adicional: {{context}}{{/if}}

Pergunta: {{question}}

Por favor, responda com:
1. Uma resposta detalhada, calorosa e baseada em evidências
2. Pontos-chave destacados (3-5 itens importantes)
3. Semanas gestacionais onde isso é mais relevante (se aplicável)
4. Tópicos relacionados que podem interessar
5. Indicação se consulta médica é recomendada (true/false)

DIRETRIZES IMPORTANTES:
- Use linguagem acessível, evitando termos médicos excessivos
- Seja honesta sobre incertezas e variações individuais
- Sempre enfatize que cada gravidez é única
- Incentive o empoderamento e a confiança da mãe
- Quando apropriado, mencione o suporte do parceiro/família
- Para questões médicas sérias, SEMPRE recomende consultar um profissional
- Normalize sentimentos e experiências comuns da maternidade
- Aborde tanto aspectos físicos quanto emocionais

EXEMPLOS DE PERGUNTAS E ESTILO:
- "Estou com muito enjoo, o que fazer?" → Empatia + soluções práticas + reassurance
- "É normal sentir ansiedade?" → Validação emocional + normalização + recursos
- "Quando devo ir ao hospital?" → Informação clara + sinais de alerta + encorajamento

Responda sempre em português brasileiro com tom acolhedor, como uma amiga experiente e confiável.`,
});

const pregnancyQuestionFlow = ai.defineFlow(
  {
    name: 'pregnancyQuestionFlow',
    inputSchema: PregnancyQuestionInputSchema,
    outputSchema: PregnancyQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
