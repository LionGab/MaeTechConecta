'use server';

/**
 * @fileOverview AI flow for analyzing pregnancy symptoms and providing insights
 * 
 * This flow takes symptom data and provides personalized analysis,
 * recommendations, and warnings when necessary.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SymptomAnalysisInputSchema = z.object({
  week: z.number().describe('Current pregnancy week (1-40)'),
  symptoms: z.object({
    nausea: z.number().optional().describe('Nausea level 1-5'),
    fatigue: z.number().optional().describe('Fatigue level 1-5'),
    headache: z.number().optional().describe('Headache severity 1-5'),
    backPain: z.number().optional().describe('Back pain level 1-5'),
    moodSwings: z.number().optional().describe('Mood swings intensity 1-5'),
    cramping: z.number().optional().describe('Cramping severity 1-5'),
    swelling: z.number().optional().describe('Swelling level 1-5'),
    other: z.string().optional().describe('Other symptoms described'),
  }),
  notes: z.string().optional().describe('Additional notes from the user'),
});

export type SymptomAnalysisInput = z.infer<typeof SymptomAnalysisInputSchema>;

const SymptomAnalysisOutputSchema = z.object({
  analysis: z.string().describe('Detailed analysis of the symptoms'),
  recommendations: z.array(z.string()).describe('Practical recommendations'),
  urgencyLevel: z.enum(['normal', 'monitor', 'consult-doctor', 'urgent']).describe('Level of medical attention needed'),
  reassurance: z.string().describe('Reassuring message for the mother'),
  relatedTips: z.array(z.string()).describe('Related tips for managing symptoms'),
});

export type SymptomAnalysisOutput = z.infer<typeof SymptomAnalysisOutputSchema>;

export async function analyzePregnancySymptoms(
  input: SymptomAnalysisInput
): Promise<SymptomAnalysisOutput> {
  return symptomAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomAnalysisPrompt',
  input: { schema: SymptomAnalysisInputSchema },
  output: { schema: SymptomAnalysisOutputSchema },
  prompt: `Você é a NathIA, uma assistente virtual especializada em maternidade e saúde gestacional. 

Você está analisando sintomas de uma gestante na semana {{week}} de gravidez.

Sintomas relatados:
{{#if symptoms.nausea}}Náusea: nível {{symptoms.nausea}}/5{{/if}}
{{#if symptoms.fatigue}}Fadiga: nível {{symptoms.fatigue}}/5{{/if}}
{{#if symptoms.headache}}Dor de cabeça: nível {{symptoms.headache}}/5{{/if}}
{{#if symptoms.backPain}}Dor nas costas: nível {{symptoms.backPain}}/5{{/if}}
{{#if symptoms.moodSwings}}Oscilações de humor: nível {{symptoms.moodSwings}}/5{{/if}}
{{#if symptoms.cramping}}Cólicas: nível {{symptoms.cramping}}/5{{/if}}
{{#if symptoms.swelling}}Inchaço: nível {{symptoms.swelling}}/5{{/if}}
{{#if symptoms.other}}Outros: {{symptoms.other}}{{/if}}

{{#if notes}}Notas adicionais: {{notes}}{{/if}}

Por favor, forneça:
1. Uma análise detalhada e empática dos sintomas no contexto desta semana gestacional
2. Recomendações práticas e acionáveis
3. Nível de urgência médica (normal, monitor, consult-doctor, urgent)
4. Uma mensagem reconfortante e acolhedora
5. Dicas relacionadas para gerenciar esses sintomas

IMPORTANTE: Sempre lembre que você não substitui um médico. Para sintomas graves ou preocupantes, sempre recomende consultar um profissional de saúde.

Responda em português brasileiro, com tom acolhedor, empático e informativo.`,
});

const symptomAnalysisFlow = ai.defineFlow(
  {
    name: 'symptomAnalysisFlow',
    inputSchema: SymptomAnalysisInputSchema,
    outputSchema: SymptomAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
