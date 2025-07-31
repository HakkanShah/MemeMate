'use server';

/**
 * @fileOverview A humor tag suggestion AI agent.
 *
 * - suggestHumorTags - A function that handles the humor tag suggestion process.
 * - SuggestHumorTagsInput - The input type for the suggestHumorTags function.
 * - SuggestHumorTagsOutput - The return type for the suggestHumorTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHumorTagsInputSchema = z.object({
  content: z
    .string()
    .describe(
      'A string containing the user\u2019s past meme posts and bio.'
    ),
});
export type SuggestHumorTagsInput = z.infer<typeof SuggestHumorTagsInputSchema>;

const SuggestHumorTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of humor tags suggested for the user.'),
});
export type SuggestHumorTagsOutput = z.infer<typeof SuggestHumorTagsOutputSchema>;

export async function suggestHumorTags(input: SuggestHumorTagsInput): Promise<SuggestHumorTagsOutput> {
  return suggestHumorTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHumorTagsPrompt',
  input: {schema: SuggestHumorTagsInputSchema},
  output: {schema: SuggestHumorTagsOutputSchema},
  prompt: `You are an AI assistant specialized in suggesting humor tags for user profiles on a meme-sharing platform.

  Given the following content from the user (past meme posts and bio), suggest up to 3 humor tags that best match the user's humor style.
  The humor tags should be chosen from the following list: Desi, Troll, Dark, Bollywood, WhatsApp Aunty, Engineer AF, Political, Roast, Cringe, Wholesome, Engineering, Sanskari.

  Content: {{{content}}}
  `,
});

const suggestHumorTagsFlow = ai.defineFlow(
  {
    name: 'suggestHumorTagsFlow',
    inputSchema: SuggestHumorTagsInputSchema,
    outputSchema: SuggestHumorTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
