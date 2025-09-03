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
import { getInventoryLevels } from '@/services/inventory';
import { getMovements } from '@/services/movements';

const getLiveInventoryData = ai.defineTool(
  {
    name: 'getLiveInventoryData',
    description: 'Fetches current inventory levels and recent movement data from the database.',
    inputSchema: z.object({
      organizationId: z.string().describe("The organization ID to fetch data for")
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    console.log('Fetching live inventory data...');
    const [inventoryLevels, { movements }] = await Promise.all([
      getInventoryLevels(input.organizationId),
      getMovements(input.organizationId, { limit: 100 }), // Get recent movements
    ]);

    const inventorySummary = `Current Inventory Levels:\n${JSON.stringify(inventoryLevels, null, 2)}`;
    const movementSummary = `Recent Movements:\n${JSON.stringify(movements.map(m => ({...m, occurredAt: m.occurredAt.toISOString()})), null, 2)}`;
    
    const combinedData = `${inventorySummary}\n\n${movementSummary}`;
    console.log('Live data fetched successfully.');
    return combinedData;
  }
);


const InventoryOptimizationSuggestionsInputSchema = z.object({
  organizationId: z.string().describe("The organization ID to analyze inventory for")
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
  tools: [getLiveInventoryData],
  prompt: `You are an expert inventory management consultant. 
  
  Your primary task is to analyze the company's inventory data to provide specific, actionable suggestions for adjustments and optimization strategies.

  First, call the 'getLiveInventoryData' tool with the organization ID to fetch the most up-to-date inventory levels and recent movement history.

  Then, analyze the retrieved data. Consider factors such as:
  - Products with very high or very low stock levels.
  - Products that haven't moved recently (potential obsolescence).
  - High-velocity items that may need reorder point adjustments.
  - Negative stock levels, which indicate data entry errors or process issues.

  Based on your analysis, generate a concise list of clear, implementable steps the user can take to improve their inventory efficiency, reduce costs, and prevent stockouts.
  Present your suggestions in a clear, easy-to-read format.
`,
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
