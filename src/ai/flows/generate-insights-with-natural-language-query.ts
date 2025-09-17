'use server';
/**
 * @fileOverview An AI agent that generates inventory insights using natural language queries.
 *
 * - generateInsightsWithNaturalLanguageQuery - A function that handles the generation of inventory insights based on a natural language query.
 * - GenerateInsightsInput - The input type for the generateInsightsWithNaturalLanguageQuery function.
 * - GenerateInsightsOutput - The return type for the generateInsightsWithNaturalLanguageQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightsInputSchema = z.object({
  organizationId: z.string().describe('The ID of the organization.'),
  query: z.string().describe('The natural language query to use to retrieve inventory insights.'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  insights: z.string().describe('The insights generated based on the natural language query.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

export async function generateInsightsWithNaturalLanguageQuery(
  input: GenerateInsightsInput
): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  prompt: `You are an AI assistant that helps managers retrieve insights and recommendations about their inventory using natural language queries.

  You have access to the inventory data for the organization with ID {{{organizationId}}}.

  Based on the following query, generate insights and recommendations:
  {{query}}
  `,
});

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
