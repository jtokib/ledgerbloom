
'use server';

import { getInventoryOptimizationSuggestions } from '@/ai/flows/inventory-optimization-suggestions';
import type { InventoryOptimizationSuggestionsInput } from '@/ai/flows/inventory-optimization-suggestions';
import { exportToBigQuery as exportToBigQueryFlow } from '@/ai/flows/export-to-bigquery';
import type { ExportToBigQueryInput } from '@/ai/flows/export-to-bigquery';
import { createExportLog } from '@/services/exports';
import { createAuditLog } from '@/services/audit';
import { createUser as createUserInDb } from '@/services/users';
import { revalidatePath } from 'next/cache';
import { getAuth } from 'firebase/auth';
import { app, db, storage } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { collection, addDoc, doc, updateDoc, deleteDoc, Timestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Product, Location, InventoryMovement, Order } from '@/lib/types';
import { getOrder } from '@/services/orders';
import { getLocations as getLocationsFromDb } from '@/services/locations';
import { getProducts as getProductsFromDb } from '@/services/products';


export async function getMoreProducts(lastVisibleId: string | null) {
    try {
        const { products, hasMore } = await getProductsFromDb({ lastVisibleId });
        return { success: true, products, hasMore };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to fetch more products.' };
    }
}

export async function getMoreLocations(lastVisibleId: string | null) {
    try {
        const { locations, hasMore } = await getLocationsFromDb({ lastVisibleId });
        return { success: true, locations, hasMore };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to fetch more locations.' };
    }
}


export async function generateSuggestions(input: InventoryOptimizationSuggestionsInput) {
  try {
    const result = await getInventoryOptimizationSuggestions(input);
    return { success: true, suggestions: result.suggestions };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate suggestions. Please try again.' };
  }
}

export async function createUser(userId: string, name: string, email: string) {
  try {
    await createUserInDb({
      id: userId,
      displayName: name,
      email: email,
      role: 'viewer', // Default role for new users
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to create user record in database.' };
  }
}

export async function createProduct(formData: FormData) {
  try {
    const newProductData: Omit<Product, 'id' | 'variants' | 'imageUrl'> = {
      displayName: formData.get('displayName') as string,
      baseUOM: formData.get('baseUOM') as string,
      active: formData.get('active') === 'on',
    };
    
    let imageUrl;
    const imageFile = formData.get('image') as File;

    if (imageFile && imageFile.size > 0) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
    }

    const productsCol = collection(db, 'products');
    const docRef = await addDoc(productsCol, { ...newProductData, variants: [], imageUrl });


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
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, error: `Failed to update profile: ${message}` };
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
      
      const dataToUpdate: Partial<Omit<Product, 'id' | 'variants'>> = {
        displayName: product.displayName,
        baseUOM: product.baseUOM,
        active: product.active,
      };

      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        dataToUpdate.imageUrl = await getDownloadURL(storageRef);
      }


      await updateDoc(productRef, dataToUpdate);

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
        const dataToUpdate: Partial<Omit<Location, 'id'>> = {
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

export async function createOrder(formData: FormData) {
  try {
    const newOrderData = {
      customerName: formData.get('customerName') as string,
      status: 'pending' as Order['status'],
      createdAt: new Date(),
      // In a real app, you'd process items from the form
      items: [], 
      totalValue: 0,
      orderNumber: `ORD-${Date.now()}`
    };

    const ordersCol = collection(db, 'orders');
    const docRef = await addDoc(ordersCol, newOrderData);

    await createAuditLog({
        user: 'user@example.com',
        action: 'order.create',
        details: {
            entityType: 'order',
            entityId: docRef.id,
            message: `Created new order ${newOrderData.orderNumber} for ${newOrderData.customerName}`
        }
    });

    revalidatePath('/dashboard/orders');
    revalidatePath('/dashboard/audit-log');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to create order.' };
  }
}

export async function updateOrder(formData: FormData) {
    try {
      const orderId = formData.get('id') as string;
      const status = formData.get('status') as Order['status'];
      
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status });

      // If order is shipped, create inventory movements
      if (status === 'shipped') {
        const order = await getOrder(orderId);
        const locations = await getLocationsFromDb(); // Use paginated version just to get some locations
        const warehouse = locations.locations.find(l => l.type === 'warehouse');
        
        if (order && warehouse) {
            for (const item of order.items) {
                const movementData: Omit<InventoryMovement, 'id' | 'occurredAt' | 'uom'> = {
                    sku: item.sku,
                    locationId: warehouse.id, // Assume shipping from the first warehouse
                    qty: item.quantity,
                    direction: 'out',
                    cause: 'sale',
                    actor: 'system',
                };
                
                const movementsCol = collection(db, 'movements');
                // We need to figure out the UOM for the product
                // For now, let's assume 'each'
                await addDoc(movementsCol, {...movementData, uom: 'each', occurredAt: new Date()});
            }
             await createAuditLog({
                user: 'system',
                action: 'inventory.adjust.sale',
                details: {
                    entityType: 'order',
                    entityId: orderId,
                    message: `Inventory adjusted for shipped order ${order.orderNumber}`
                }
            });
        }
      }

      await createAuditLog({
        user: 'user@example.com',
        action: 'order.update',
        details: {
            entityType: 'order',
            entityId: orderId,
            message: `Updated order status to ${status}`
        }
      });

      revalidatePath('/dashboard/orders');
      revalidatePath('/dashboard/inventory');
      revalidatePath('/dashboard/movements');
      revalidatePath('/dashboard/audit-log');
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Failed to update order.' };
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
