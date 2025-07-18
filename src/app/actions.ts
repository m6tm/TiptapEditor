'use server';

import { aiContentAssistance, AIContentAssistanceInput, AIContentAssistanceOutput } from '@/ai/flows/ai-content-assistance';

export async function getAiAssistance(input: AIContentAssistanceInput): Promise<AIContentAssistanceOutput> {
  try {
    const result = await aiContentAssistance(input);
    return result;
  } catch (error) {
    console.error("AI content assistance failed:", error);
    throw new Error("Failed to get AI assistance. Please try again.");
  }
}
