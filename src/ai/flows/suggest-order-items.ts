'use server';

/**
 * @fileOverview An AI agent to suggest order items based on natural language.
 *
 * - suggestOrderItems - A function that suggests a list of order items based on a text description.
 * - SuggestOrderItemsInput - The input type for the suggestOrderItems function.
 * - SuggestOrderItemsOutput - The return type for the suggestOrderItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getProducts } from '@/services/products';

const getAvailableProducts = ai.defineTool(
  {
    name: 'getAvailableProducts',
    description: 'Fetches the list of all available products and their variants from the database to see what can be ordered.',
    inputSchema: z.object({
      organizationId: z.string().describe("The organization ID to fetch products for")
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    console.log('Fetching available products for AI...');
    const { products } = await getProducts(input.organizationId, { limit: 1000 }); // Get all products

    const productSummary = products.map(p => ({
        name: p.displayName,
        variants: p.variants.map(v => ({
            sku: v.sku,
            packageSize: v.packageSize,
            price: v.price,
        }))
    }));
    
    const summaryString = `Available Products:\n${JSON.stringify(productSummary, null, 2)}`;
    console.log('Product summary provided to AI.');
    return summaryString;
  }
);


const SuggestOrderItemsInputSchema = z.object({
  organizationId: z.string().describe("The organization ID to suggest items for"),
  description: z.string().describe("A natural language description of the items a customer wants to order.")
});
export type SuggestOrderItemsInput = z.infer<typeof SuggestOrderItemsInputSchema>;

const OrderItemSuggestionSchema = z.object({
    sku: z.string().describe("The SKU of the suggested product variant."),
    quantity: z.number().describe("The suggested quantity for this item."),
});

const SuggestOrderItemsOutputSchema = z.object({
  items: z.array(OrderItemSuggestionSchema).describe("A list of suggested order items with SKUs and quantities."),
});
export type SuggestOrderItemsOutput = z.infer<typeof SuggestOrderItemsOutputSchema>;

export async function suggestOrderItems(input: SuggestOrderItemsInput): Promise<SuggestOrderItemsOutput> {
  return suggestOrderItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOrderItemsPrompt',
  input: {schema: SuggestOrderItemsInputSchema},
  output: {schema: SuggestOrderItemsOutputSchema},
  tools: [getAvailableProducts],
  prompt: `You are an expert order entry assistant for a company that sells plants and seeds.

Your goal is to parse the user's request and convert it into a structured list of order items.

First, you MUST call the 'getAvailableProducts' tool with the organization ID to get the full, up-to-date catalog of products and their variants.

Then, carefully analyze the user's request: {{{description}}}. Match the user's request to the available products. Pay close attention to quantities, sizes, and specific product names.

If a user's request is ambiguous, make a reasonable assumption (e.g., if they ask for "a bag", assume the default or smallest size).

Return the result as a structured list of items, including the correct SKU for each chosen variant and the quantity. If you cannot find a match for an item, do not include it in your response.
`,
});

const suggestOrderItemsFlow = ai.defineFlow(
  {
    name: 'suggestOrderItemsFlow',
    inputSchema: SuggestOrderItemsInputSchema,
    outputSchema: SuggestOrderItemsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
