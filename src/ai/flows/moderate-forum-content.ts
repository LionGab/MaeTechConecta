'use server';

/**
 * @fileOverview This file defines a Genkit flow for moderating forum content.
 *
 * The flow uses AI to detect inappropriate language in forum posts and flags them for review.
 *
 * @exports moderateForumContent - A function to moderate forum content.
 * @exports ModerateForumContentInput - The input type for the moderateForumContent function.
 * @exports ModerateForumContentOutput - The output type for the moderateForumContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateForumContentInputSchema = z.object({
  text: z.string().describe('The forum post content to be moderated.'),
});
export type ModerateForumContentInput = z.infer<typeof ModerateForumContentInputSchema>;

const ModerateForumContentOutputSchema = z.object({
  isFlagged: z.boolean().describe('Whether the content is flagged as inappropriate.'),
  reason: z.string().describe('The reason for flagging the content, if applicable.'),
});
export type ModerateForumContentOutput = z.infer<typeof ModerateForumContentOutputSchema>;

export async function moderateForumContent(input: ModerateForumContentInput): Promise<ModerateForumContentOutput> {
  // Validate input with Zod schema
  const validatedInput = ModerateForumContentInputSchema.parse(input);
  
  return moderateForumContentFlow(validatedInput);
}

const moderateForumContentPrompt = ai.definePrompt({
  name: 'moderateForumContentPrompt',
  input: {schema: ModerateForumContentInputSchema},
  output: {schema: ModerateForumContentOutputSchema},
  prompt: `You are a forum content moderator. Your task is to determine if the given text contains inappropriate language, such as hate speech, harassment, or sexually explicit content.

  Text: {{{text}}}

  Respond with a JSON object indicating whether the content should be flagged and the reason for flagging it.`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  }
});

const moderateForumContentFlow = ai.defineFlow(
  {
    name: 'moderateForumContentFlow',
    inputSchema: ModerateForumContentInputSchema,
    outputSchema: ModerateForumContentOutputSchema,
  },
  async input => {
    const {output} = await moderateForumContentPrompt(input);
    return output!;
  }
);
