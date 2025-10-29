'use server';

/**
 * @fileOverview AI flow for generating personalized daily routines based on trimester
 * 
 * This flow creates customized daily tasks and routines that are appropriate
 * for the mother's current pregnancy stage.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DailyRoutineInputSchema = z.object({
  week: z.number().describe('Current pregnancy week (1-40)'),
  trimester: z.enum(['first', 'second', 'third']).describe('Current trimester'),
  preferences: z.object({
    workingMom: z.boolean().optional().describe('Whether the mother is working'),
    exerciseLevel: z.enum(['none', 'light', 'moderate']).optional(),
    dietaryRestrictions: z.array(z.string()).optional(),
  }).optional(),
  previousCompletion: z.number().optional().describe('Previous day completion rate 0-100'),
});

export type DailyRoutineInput = z.infer<typeof DailyRoutineInputSchema>;

const DailyRoutineOutputSchema = z.object({
  morningTasks: z.array(z.object({
    title: z.string(),
    description: z.string(),
    time: z.string().optional(),
    category: z.enum(['health', 'nutrition', 'exercise', 'wellness', 'education']),
    points: z.number(),
  })),
  afternoonTasks: z.array(z.object({
    title: z.string(),
    description: z.string(),
    time: z.string().optional(),
    category: z.enum(['health', 'nutrition', 'exercise', 'wellness', 'education']),
    points: z.number(),
  })),
  eveningTasks: z.array(z.object({
    title: z.string(),
    description: z.string(),
    time: z.string().optional(),
    category: z.enum(['health', 'nutrition', 'exercise', 'wellness', 'education']),
    points: z.number(),
  })),
  dailyTip: z.string().describe('Motivational tip for the day'),
  focusArea: z.string().describe('Main focus area for this week'),
});

export type DailyRoutineOutput = z.infer<typeof DailyRoutineOutputSchema>;

export async function generateDailyRoutine(
  input: DailyRoutineInput
): Promise<DailyRoutineOutput> {
  return dailyRoutineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyRoutinePrompt',
  input: { schema: DailyRoutineInputSchema },
  output: { schema: DailyRoutineOutputSchema },
  prompt: `Você é a NathIA, especialista em criar rotinas personalizadas para gestantes.

Gestante na semana {{week}} ({{trimester}} trimestre)

{{#if preferences}}
Preferências:
{{#if preferences.workingMom}}✓ Mãe trabalhadora{{/if}}
{{#if preferences.exerciseLevel}}Nível de exercício: {{preferences.exerciseLevel}}{{/if}}
{{#if preferences.dietaryRestrictions}}Restrições alimentares: {{#each preferences.dietaryRestrictions}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}
{{/if}}

Crie uma rotina diária personalizada e REALISTA com tarefas divididas em manhã, tarde e noite.

REGRAS IMPORTANTES:
1. No PRIMEIRO TRIMESTRE: Foco em hidratação, alimentação leve, descanso, suplementação (ácido fólico), e gestão de náuseas
2. No SEGUNDO TRIMESTRE: Adicionar exercícios leves, preparação do enxoval, exames importantes, alimentação balanceada
3. No TERCEIRO TRIMESTRE: Exercícios respiratórios, preparação da bolsa maternidade, curso de gestantes, massagens perineais

As tarefas devem ser:
- Específicas e acionáveis
- Adequadas para o trimestre atual
- Realistas e não sobrecarregar a gestante
- Variadas em categorias (saúde, nutrição, exercício, bem-estar, educação)
- Cada tarefa vale pontos (5-20 pontos baseado na dificuldade)

Inclua também:
- Uma dica motivacional do dia
- Área de foco principal para esta semana gestacional

Responda em português brasileiro com tom acolhedor e motivacional.`,
});

const dailyRoutineFlow = ai.defineFlow(
  {
    name: 'dailyRoutineFlow',
    inputSchema: DailyRoutineInputSchema,
    outputSchema: DailyRoutineOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
