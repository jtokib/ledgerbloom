
'use server';

import { getInventoryOptimizationSuggestions } from '@/ai/flows/inventory-optimization-suggestions';
import type { InventoryOptimizationSuggestionsInput } from '@/ai/flows/inventory-optimization-suggestions';
import { createProduct as createProductService } from '@/services/products';
import { createLocation as createLocationService } from '@/services/locations';
import { revalidatePath } from 'next/cache';

export async function generateSuggestions(input: InventoryOptimizationSuggestionsInput) {
  try {
    const result = await getInventoryOptimizationSuggestions(input);
    return { success: true, suggestions: result.suggestions };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate suggestions. Please try again.' };
  }
}

export async function createProduct(formData: FormData) {
  try {
    const newProduct = {
      displayName: formData.get('displayName') as string,
      baseUOM: formData.get('baseUOM') as string,
      active: formData.get('active') === 'on',
    };
    // In a real app, you'd do validation here with Zod
    await createProductService(newProduct);
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to create product.' };
  }
}

export async function createLocation(formData: FormData) {
    try {
      const newLocation = {
        name: formData.get('name') as string,
        address: formData.get('address') as string,
        type: formData.get('type') as 'warehouse' | 'store' | 'supplier',
        active: formData.get('active') === 'on',
      };
      // In a real app, you'd do validation here with Zod
      await createLocationService(newLocation);
      revalidatePath('/dashboard/locations');
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Failed to create location.' };
    }
  }
