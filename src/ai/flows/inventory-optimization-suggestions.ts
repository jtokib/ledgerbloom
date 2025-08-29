'use server';

/**
 * @fileOverview An AI agent to provide inventory optimization suggestions.
 *
 * - getInventoryOptimizationSuggestions - A function that returns suggestions for inventory adjustments and optimization strategies.
 * - InventoryOptimizationSuggestionsInput - The input type for the getInventoryOptimizationSuggestions function.
 * - InventoryOptimizationSuggestionsOutput - The return type for the getInventoryOptimizationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InventoryOptimizationSuggestionsInputSchema = z.object({
  inventoryData: z
    .string()
    .describe("A string containing inventory data, including product SKUs, locations, quantities, and recent movement history."),
});
export type InventoryOptimizationSuggestionsInput = z.infer<typeof InventoryOptimizationSuggestionsInputSchema>;

const InventoryOptimizationSuggestionsOutputSchema = z.object({
  suggestions: z.string().describe("A list of suggestions for inventory adjustments and optimization strategies, based on the provided inventory data."),
});
export type InventoryOptimizationSuggestionsOutput = z.infer<typeof InventoryOptimizationSuggestionsOutputSchema>;

export async function getInventoryOptimizationSuggestions(input: InventoryOptimizationSuggestionsInput): Promise<InventoryOptimizationSuggestionsOutput> {
  return inventoryOptimizationSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'inventoryOptimizationSuggestionsPrompt',
  input: {schema: InventoryOptimizationSuggestionsInputSchema},
  output: {schema: InventoryOptimizationSuggestionsOutputSchema},
  prompt: `You are an expert inventory management consultant. Analyze the following inventory data and provide specific, actionable suggestions for adjustments and optimization strategies.

Inventory Data:
{{{inventoryData}}}

Consider factors such as product demand, storage costs, lead times, and potential obsolescence.
Focus on clear, implementable steps that the user can take to improve their inventory efficiency and reduce waste.`,
});

const inventoryOptimizationSuggestionsFlow = ai.defineFlow(
  {
    name: 'inventoryOptimizationSuggestionsFlow',
    inputSchema: InventoryOptimizationSuggestionsInputSchema,
    outputSchema: InventoryOptimizationSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
