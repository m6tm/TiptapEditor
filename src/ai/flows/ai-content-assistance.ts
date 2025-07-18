'use server';

/**
 * @fileOverview A content enhancement AI agent.
 *
 * - aiContentAssistance - A function that handles the content enhancement process.
 * - AIContentAssistanceInput - The input type for the aiContentAssistance function.
 * - AIContentAssistanceOutput - The return type for the aiContentAssistance function.
 */

import {ai, geminiPro} from '@/ai/genkit';
import {z} from 'genkit';

const AIContentAssistanceInputSchema = z.object({
  content: z.string().describe('The content to be enhanced.'),
});
export type AIContentAssistanceInput = z.infer<typeof AIContentAssistanceInputSchema>;

const AIContentAssistanceOutputSchema = z.object({
  enhancedContent: z.string().describe('The enhanced content with formatting and language improvements.'),
  suggestions: z.array(z.string()).describe('Specific suggestions for improving the content.'),
});
export type AIContentAssistanceOutput = z.infer<typeof AIContentAssistanceOutputSchema>;

export async function aiContentAssistance(input: AIContentAssistanceInput): Promise<AIContentAssistanceOutput> {
  return aiContentAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiContentAssistancePrompt',
  input: {schema: AIContentAssistanceInputSchema},
  output: {schema: AIContentAssistanceOutputSchema},
  model: geminiPro,
  prompt: `You are an AI assistant designed to enhance the quality of text content.

You will receive content and will return the enhanced content with formatting and language improvements.
You will also return specific suggestions for improving the content.

Content: {{{content}}}`,
});

const aiContentAssistanceFlow = ai.defineFlow(
  {
    name: 'aiContentAssistanceFlow',
    inputSchema: AIContentAssistanceInputSchema,
    outputSchema: AIContentAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
