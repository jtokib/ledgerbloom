
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
import { createExportLog } from '@/services/exports';
import { createAuditLog } from '@/services/audit';
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
    const newProductData = {
      displayName: formData.get('displayName') as string,
      baseUOM: formData.get('baseUOM') as string,
      active: formData.get('active') === 'on',
    };
    // In a real app, you'd do validation here with Zod
    const newProduct = await createProductService(newProductData);

    await createAuditLog({
        user: 'user@example.com', // In a real app, get this from session
        action: 'product.create',
        details: {
            entityType: 'product',
            entityId: newProduct.id,
            message: `Created new product: ${newProduct.displayName}`
        }
    });

    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/audit-log');
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

      await createAuditLog({
        user: 'user@example.com', // In a real app, get this from session
        action: 'product.update',
        details: {
            entityType: 'product',
            entityId: product.id,
            message: `Updated product: ${product.displayName}`
        }
      });

      revalidatePath('/dashboard/products');
      revalidatePath('/dashboard/audit-log');
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Failed to update product.' };
    }
  }
  
  export async function deleteProduct(productId: string) {
    try {
      await deleteProductService(productId);

      await createAuditLog({
        user: 'user@example.com', // In a real app, get this from session
        action: 'product.delete',
        details: {
            entityType: 'product',
            entityId: productId,
            message: `Deleted product with ID: ${productId}`
        }
      });

      revalidatePath('/dashboard/products');
      revalidatePath('/dashboard/audit-log');
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Failed to delete product.' };
    }
  }
  

export async function createLocation(formData: FormData) {
    try {
      const newLocationData = {
        name: formData.get('name') as string,
        address: formData.get('address') as string,
        type: formData.get('type') as 'warehouse' | 'store' | 'supplier',
        active: formData.get('active') === 'on',
      };
      // In a real app, you'd do validation here with Zod
      const newLocation = await createLocationService(newLocationData);

      await createAuditLog({
        user: 'user@example.com', // In a real app, get this from session
        action: 'location.create',
        details: {
            entityType: 'location',
            entityId: newLocation.id,
            message: `Created new location: ${newLocation.name}`
        }
      });

      revalidatePath('/dashboard/locations');
      revalidatePath('/dashboard/audit-log');
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

        await createAuditLog({
            user: 'user@example.com', // In a real app, get this from session
            action: 'location.update',
            details: {
                entityType: 'location',
                entityId: location.id,
                message: `Updated location: ${location.name}`
            }
        });


        revalidatePath('/dashboard/locations');
        revalidatePath('/dashboard/audit-log');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to update location.' };
    }
}

export async function deleteLocation(locationId: string) {
    try {
        await deleteLocationService(locationId);

        await createAuditLog({
            user: 'user@example.com', // In a real app, get this from session
            action: 'location.delete',
            details: {
                entityType: 'location',
                entityId: locationId,
                message: `Deleted location with ID: ${locationId}`
            }
        });

        revalidatePath('/dashboard/locations');
        revalidatePath('/dashboard/audit-log');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to delete location.' };
    }
}

export async function exportToBigQuery(input: ExportToBigQueryInput) {
    try {
      const result = await exportToBigQueryFlow(input);
      
      // Create an audit log entry
      await createExportLog({
          destination: 'BigQuery',
          status: result.success ? 'Completed' : 'Failed',
          triggeredBy: 'user@example.com', // In a real app, get this from the session
          message: result.message,
      });

      await createAuditLog({
        user: 'user@example.com',
        action: 'export.run',
        details: {
            entityType: 'export',
            entityId: `bq_export_${Date.now()}`,
            message: result.message
        }
      });

      revalidatePath('/dashboard/reports');
      revalidatePath('/dashboard/audit-log');
      return { success: result.success, message: result.message };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Export to BigQuery failed:', message);
      // Also log the failure to the audit log
       await createAuditLog({
        user: 'user@example.com',
        action: 'export.run.failed',
        details: {
            entityType: 'export',
            entityId: `bq_export_${Date.now()}`,
            message
        }
      });
      return { success: false, message: `Export to BigQuery failed: ${message}` };
    }
}
