'use server';

import { getInventoryOptimizationSuggestions } from '@/ai/flows/inventory-optimization-suggestions';
import type { InventoryOptimizationSuggestionsInput } from '@/ai/flows/inventory-optimization-suggestions';

export async function generateSuggestions(input: InventoryOptimizationSuggestionsInput) {
  try {
    const result = await getInventoryOptimizationSuggestions(input);
    return { success: true, suggestions: result.suggestions };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate suggestions. Please try again.' };
  }
}
