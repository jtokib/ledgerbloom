
'use server';

import { getInventoryOptimizationSuggestions } from '@/ai/flows/inventory-optimization-suggestions';
import type { InventoryOptimizationSuggestionsInput } from '@/ai/flows/inventory-optimization-suggestions';
import { exportToBigQuery as exportToBigQueryFlow } from '@/ai/flows/export-to-bigquery';
import type { ExportToBigQueryInput } from '@/ai/flows/export-to-bigquery';
import {
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from '@/services/products';
import {
  createLocation as createLocationService,
  updateLocation as updateLocationService,
  deleteLocation as deleteLocationService,
} from '@/services/locations';
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

export async function updateProduct(formData: FormData) {
    try {
      const product = {
        id: formData.get('id') as string,
        displayName: formData.get('displayName') as string,
        baseUOM: formData.get('baseUOM') as string,
        active: formData.get('active') === 'on',
      };
      // In a real app, you'd do validation here with Zod
      await updateProductService(product);
      revalidatePath('/dashboard/products');
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Failed to update product.' };
    }
  }
  
  export async function deleteProduct(productId: string) {
    try {
      await deleteProductService(productId);
      revalidatePath('/dashboard/products');
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Failed to delete product.' };
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

export async function updateLocation(formData: FormData) {
    try {
        const location = {
            id: formData.get('id') as string,
            name: formData.get('name') as string,
            address: formData.get('address') as string,
            type: formData.get('type') as 'warehouse' | 'store' | 'supplier',
            active: formData.get('active') === 'on',
        };
        // In a real app, you'd do validation here with Zod
        await updateLocationService(location);
        revalidatePath('/dashboard/locations');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to update location.' };
    }
}

export async function deleteLocation(locationId: string) {
    try {
        await deleteLocationService(locationId);
        revalidatePath('/dashboard/locations');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to delete location.' };
    }
}

export async function exportToBigQuery(input: ExportToBigQueryInput) {
    try {
      const result = await exportToBigQueryFlow(input);
      // In a real app, you would revalidate a path to show the new export log
      // revalidatePath('/dashboard/reports');
      return { success: result.success, message: result.message };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Export to BigQuery failed:', message);
      return { success: false, message: `Export to BigQuery failed: ${message}` };
    }
}
