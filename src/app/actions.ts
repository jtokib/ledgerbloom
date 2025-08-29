
'use server';

import { getInventoryOptimizationSuggestions } from '@/ai/flows/inventory-optimization-suggestions';
import type { InventoryOptimizationSuggestionsInput } from '@/ai/flows/inventory-optimization-suggestions';
import { exportToBigQuery as exportToBigQueryFlow } from '@/ai/flows/export-to-bigquery';
import type { ExportToBigQueryInput } from '@/ai/flows/export-to-bigquery';
import { createExportLog } from '@/services/exports';
import { createAuditLog } from '@/services/audit';
import { revalidatePath } from 'next/cache';
import { getAuth } from 'firebase/auth';
import { app, db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { collection, addDoc, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import type { Product, Location, InventoryMovement } from '@/lib/types';


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
    const newProductData: Omit<Product, 'id' | 'variants'> = {
      displayName: formData.get('displayName') as string,
      baseUOM: formData.get('baseUOM') as string,
      active: formData.get('active') === 'on',
    };

    const productsCol = collection(db, 'products');
    const docRef = await addDoc(productsCol, { ...newProductData, variants: [] });


    await createAuditLog({
        user: 'user@example.com', // In a real app, get this from session
        action: 'product.create',
        details: {
            entityType: 'product',
            entityId: docRef.id,
            message: `Created new product: ${newProductData.displayName}`
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

export async function updateUserProfile(formData: FormData) {
    try {
        const displayName = formData.get('name') as string;
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        if (currentUser) {
            await updateProfile(currentUser, { displayName });
            revalidatePath('/dashboard/settings');
            return { success: true, message: 'Profile updated successfully.' };
        } else {
            throw new Error('No user is signed in.');
        }

    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to update profile.' };
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
      
      const productRef = doc(db, 'products', product.id);
      await updateDoc(productRef, {
        displayName: product.displayName,
        baseUOM: product.baseUOM,
        active: product.active,
      });

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
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);

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
      const newLocationData: Omit<Location, 'id'> = {
        name: formData.get('name') as string,
        address: formData.get('address') as string,
        type: formData.get('type') as 'warehouse' | 'store' | 'supplier',
        active: formData.get('active') === 'on',
      };
      const locationsCol = collection(db, 'locations');
      const docRef = await addDoc(locationsCol, newLocationData);

      await createAuditLog({
        user: 'user@example.com', // In a real app, get this from session
        action: 'location.create',
        details: {
            entityType: 'location',
            entityId: docRef.id,
            message: `Created new location: ${newLocationData.name}`
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
        const locationData = {
            id: formData.get('id') as string,
            name: formData.get('name') as string,
            address: formData.get('address') as string,
            type: formData.get('type') as 'warehouse' | 'store' | 'supplier',
            active: formData.get('active') === 'on',
        };
        const locationRef = doc(db, 'locations', locationData.id);
        const dataToUpdate: Omit<Location, 'id'> = {
            name: locationData.name,
            address: locationData.address,
            type: locationData.type,
            active: locationData.active,
        };
        await updateDoc(locationRef, dataToUpdate);

        await createAuditLog({
            user: 'user@example.com', // In a real app, get this from session
            action: 'location.update',
            details: {
                entityType: 'location',
                entityId: locationData.id,
                message: `Updated location: ${locationData.name}`
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
        const locationRef = doc(db, 'locations', locationId);
        await deleteDoc(locationRef);

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

export async function createMovement(formData: FormData) {
    try {
        const [sku, uom] = (formData.get('sku') as string).split('|');
        const movementData: Omit<InventoryMovement, 'id' | 'occurredAt'> = {
            sku,
            uom,
            locationId: formData.get('locationId') as string,
            qty: parseInt(formData.get('qty') as string, 10),
            direction: formData.get('direction') as 'in' | 'out',
            cause: formData.get('cause') as 'purchase' | 'sale' | 'adjustment' | 'transfer' | 'production',
            actor: 'user@example.com', // Get from session
        };
        
        const newMovementData = {
            ...movementData,
            occurredAt: new Date(),
        };
    
        const movementsCol = collection(db, 'movements');
        const docRef = await addDoc(movementsCol, newMovementData);

        const newMovement = {
            ...newMovementData,
            id: docRef.id
        }

        await createAuditLog({
            user: 'user@example.com',
            action: `movement.create.${newMovement.cause}`,
            details: {
                entityType: 'movement',
                entityId: newMovement.id,
                message: `Created ${newMovement.direction} movement for ${newMovement.qty} ${newMovement.uom} of ${newMovement.sku}`
            }
        });

        revalidatePath('/dashboard/movements');
        revalidatePath('/dashboard/inventory');
        revalidatePath('/dashboard/audit-log');
        return { success: true };

    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to create movement.' };
    }
}

export async function exportToBigQuery(input: ExportToBigQueryInput) {
    try {
      const result = await exportToBigQueryFlow(input);
      
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
