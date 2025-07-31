'use server';

/**
 * @fileOverview An AI agent for suggesting meme captions.
 *
 * - suggestMemeCaption - A function that suggests a caption for a given meme image.
 * - SuggestMemeCaptionInput - The input type for the suggestMemeCaption function.
 * - SuggestMemeCaptionOutput - The return type for the suggestMemeCaption function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestMemeCaptionInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A meme image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestMemeCaptionInput = z.infer<typeof SuggestMemeCaptionInputSchema>;

const SuggestMemeCaptionOutputSchema = z.object({
  caption: z.string().describe('A witty, short, and funny caption for the meme in a desi context.'),
});
export type SuggestMemeCaptionOutput = z.infer<typeof SuggestMemeCaptionOutputSchema>;

export async function suggestMemeCaption(input: SuggestMemeCaptionInput): Promise<SuggestMemeCaptionOutput> {
  return suggestMemeCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMemeCaptionPrompt',
  input: { schema: SuggestMemeCaptionInputSchema },
  output: { schema: SuggestMemeCaptionOutputSchema },
  prompt: `You are an expert meme creator with a knack for viral desi (Indian subcontinent) humor.
  
  Analyze the provided meme image and generate a short, witty, and hilarious caption for it. The caption should be relatable to a young, urban Indian audience. Think in Hinglish, but keep it clever.

  Image: {{media url=imageDataUri}}
  `,
});

const suggestMemeCaptionFlow = ai.defineFlow(
  {
    name: 'suggestMemeCaptionFlow',
    inputSchema: SuggestMemeCaptionInputSchema,
    outputSchema: SuggestMemeCaptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
