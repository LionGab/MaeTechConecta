'use server';

/**
 * @fileOverview An AI agent that suggests relevant matches for mothers based on baby's age, location, and interests.
 *
 * - suggestRelevantMatches - A function that suggests relevant matches.
 * - RelevantMatchesInput - The input type for the suggestRelevantMatches function.
 * - RelevantMatchesOutput - The return type for the suggestRelevantMatches function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RelevantMatchesInputSchema = z.object({
  babyAgeMonths: z
    .number()
    .describe('The age of the user\u2019s baby in months.'),
  location: z.string().describe('The location of the user (city, state).'),
  interests: z
    .array(z.string())
    .describe('A list of the user\u2019s interests.'),
});
export type RelevantMatchesInput = z.infer<typeof RelevantMatchesInputSchema>;

const RelevantMatchesOutputSchema = z.object({
  suggestedMatches: z
    .array(z.string())
    .describe(
      'A list of user nicknames that are suggested as relevant matches.'
    ),
});
export type RelevantMatchesOutput = z.infer<typeof RelevantMatchesOutputSchema>;

export async function suggestRelevantMatches(
  input: RelevantMatchesInput
): Promise<RelevantMatchesOutput> {
  // Validate input with Zod schema
  const validatedInput = RelevantMatchesInputSchema.parse(input);
  
  return suggestRelevantMatchesFlow(validatedInput);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantMatchesPrompt',
  input: {schema: RelevantMatchesInputSchema},
  output: {schema: RelevantMatchesOutputSchema},
  prompt: `You are a matchmaking expert for new mothers. Given a mother's baby's age, location, and interests, suggest other mothers who would be a good match for her.

Baby's Age: {{{babyAgeMonths}}} months
Location: {{{location}}}
Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Suggest a list of user nicknames for potential matches:`,
});

const suggestRelevantMatchesFlow = ai.defineFlow(
  {
    name: 'suggestRelevantMatchesFlow',
    inputSchema: RelevantMatchesInputSchema,
    outputSchema: RelevantMatchesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
