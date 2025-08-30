
'use server';

import { getInventoryOptimizationSuggestions } from '@/ai/flows/inventory-optimization-suggestions';
import type { InventoryOptimizationSuggestionsInput } from '@/ai/flows/inventory-optimization-suggestions';
import { exportToBigQuery as exportToBigQueryFlow } from '@/ai/flows/export-to-bigquery';
import type { ExportToBigQueryInput } from '@/ai/flows/export-to-bigquery';
import { createExportLog } from '@/services/exports';
import { createAuditLog } from '@/services/audit';
import { createUser as createUserInDb, updateUser as updateUserInDb, deleteUser as deleteUserInDb } from '@/services/users';
import { createInvitation as createInvitationInDb, getInvitationByEmail, deleteInvitation as deleteInvitationInDb } from '@/services/invitations';
import { revalidatePath } from 'next/cache';
import { getAuth } from 'firebase-admin/auth';
import { app as adminApp } from '@/lib/firebase-admin';
import { app, db, storage } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { collection, addDoc, doc, updateDoc, deleteDoc, Timestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Product, Location, InventoryMovement, Order, Variant, User, FulfillmentData, OrderItem } from '@/lib/types';
import { getOrder as getOrderFromDb } from '@/services/orders';
import { getLocations as getLocationsFromDb } from '@/services/locations';
import { getProducts as getProductsFromDb } from '@/services/products';
import { getMovements as getMovementsFromDb } from '@/services/movements';
import { getOrders as getOrdersFromDb } from '@/services/orders';


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

export async function getMoreMovements(lastVisibleId: string | null) {
    try {
        const { movements, hasMore } = await getMovementsFromDb({ lastVisibleId });
        return { success: true, movements, hasMore };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to fetch more movements.' };
    }
}

export async function getMoreOrders(lastVisibleId: string | null) {
    try {
        const { orders, hasMore } = await getOrdersFromDb({ lastVisibleId });
        return { success: true, orders, hasMore };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to fetch more orders.' };
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

async function getCurrentUserEmail() {
    // This is a placeholder for getting the current user.
    // In a real app with server-side auth, you'd get this from the session.
    // For now, we'll simulate it. In a client component, you'd use `useUser`.
    // On the server, you might need to handle auth differently (e.g., with cookies).
    // This is a simplified example.
    return 'admin@ledgerbloom.com';
}

export async function createUser(userId: string, name: string, email: string) {
  try {
    const invitation = await getInvitationByEmail(email);
    const role = invitation ? invitation.role : 'viewer';

    await createUserInDb({
      id: userId,
      displayName: name,
      email: email,
      role: role,
    });

    if (invitation) {
        await deleteInvitationInDb(invitation.id);
    }
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to create user record in database.' };
  }
}

export async function createProduct(userEmail: string, formData: FormData) {
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
    
    const sku = formData.get('sku') as string;
    const price = parseFloat(formData.get('price') as string);
    const variants: Variant[] = [];
    if(sku) {
        variants.push({
            id: `var_${Date.now()}`,
            sku: sku,
            packageSize: 'Default',
            uom: newProductData.baseUOM,
            active: true,
            price: isNaN(price) ? 0 : price
        });
    }

    const productsCol = collection(db, 'products');
    const docRef = await addDoc(productsCol, { ...newProductData, variants, imageUrl });


    await createAuditLog({
        user: userEmail,
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

export async function updateUserProfile(userEmail: string, formData: FormData) {
    try {
        const displayName = formData.get('name') as string;
        const auth = getAuth(app);
        const currentUser = auth.currentUser;

        if (currentUser) {
            await updateProfile(currentUser, { displayName });
            
            await createAuditLog({
                user: userEmail,
                action: 'user.update_profile',
                details: {
                    entityType: 'user',
                    entityId: currentUser.uid,
                    message: `User updated their display name to: ${displayName}`
                }
            });
            
            revalidatePath('/dashboard/settings');
            revalidatePath('/dashboard/audit-log');
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

export async function updateProduct(userEmail: string, formData: FormData) {
    try {
      const productId = formData.get('id') as string;
      
      const variantsData = JSON.parse(formData.get('variants') as string);
      
      const variants: Variant[] = variantsData.map((v: any) => ({
        id: v.id || `var_${Date.now()}_${Math.random()}`,
        sku: v.sku,
        packageSize: v.packageSize,
        uom: v.uom,
        active: v.active,
        barcode: v.barcode || '',
        price: typeof v.price === 'number' ? v.price : parseFloat(v.price || '0'),
      }));

      const dataToUpdate: Partial<Omit<Product, 'id'>> = {
        displayName: formData.get('displayName') as string,
        baseUOM: formData.get('baseUOM') as string,
        active: formData.get('active') === 'on',
        variants,
      };

      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        dataToUpdate.imageUrl = await getDownloadURL(storageRef);
      }

      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, dataToUpdate);

      await createAuditLog({
        user: userEmail,
        action: 'product.update',
        details: {
            entityType: 'product',
            entityId: productId,
            message: `Updated product: ${dataToUpdate.displayName}`
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
  
  export async function deleteProduct(userEmail: string, productId: string) {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);

      await createAuditLog({
        user: userEmail,
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
  

export async function createLocation(data: Omit<Location, 'id' | 'active'> & { active: boolean | 'on' }) {
    try {
        const userEmail = await getCurrentUserEmail();
        const newLocationData: Omit<Location, 'id'> = {
            name: data.name,
            address: data.address,
            type: data.type,
            active: data.active === 'on' || data.active === true,
        };
        const locationsCol = collection(db, 'locations');
        const docRef = await addDoc(locationsCol, newLocationData);

        await createAuditLog({
            user: userEmail,
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


export async function updateLocation(userEmail: string, formData: FormData) {
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
            user: userEmail,
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

export async function deleteLocation(userEmail: string, locationId: string) {
    try {
        const locationRef = doc(db, 'locations', locationId);
        await deleteDoc(locationRef);

        await createAuditLog({
            user: userEmail,
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

export async function createMovement(userEmail: string, formData: FormData) {
    try {
        const [sku, uom] = (formData.get('sku') as string).split('|');
        const movementData: Omit<InventoryMovement, 'id' | 'occurredAt'> = {
            sku,
            uom,
            locationId: formData.get('locationId') as string,
            qty: parseInt(formData.get('qty') as string, 10),
            direction: formData.get('direction') as 'in' | 'out',
            cause: formData.get('cause') as 'purchase' | 'sale' | 'adjustment' | 'transfer' | 'production',
            actor: userEmail,
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
            user: userEmail,
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

export async function createOrder(userEmail: string, formData: FormData) {
  try {
    const items = JSON.parse(formData.get('items') as string) as OrderItem[];
    const totalValue = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const newOrderData: Omit<Order, 'id'> = {
      customerName: formData.get('customerName') as string,
      status: 'pending' as Order['status'],
      createdAt: new Date(),
      items: items, 
      totalValue: totalValue,
      orderNumber: `ORD-${Date.now()}`
    };

    const ordersCol = collection(db, 'orders');
    const docRef = await addDoc(ordersCol, newOrderData);

    await createAuditLog({
        user: userEmail,
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

export async function updateOrder(userEmail: string, formData: FormData) {
    try {
      const orderId = formData.get('id') as string;
      const status = formData.get('status') as Order['status'];
      const items = JSON.parse(formData.get('items') as string) as OrderItem[];
      const customerName = formData.get('customerName') as string;

      const totalValue = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
          status,
          items,
          customerName,
          totalValue
      });

      // If order is shipped, create inventory movements
      if (status === 'shipped') {
        const order = await getOrderFromDb(orderId);
        const { locations } = await getLocationsFromDb(); 
        const warehouse = locations.find(l => l.type === 'warehouse');
        
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
                const { products } = await getProductsFromDb();
                const product = products.find(p => p.variants.some(v => v.sku === item.sku));
                const uom = product?.baseUOM || 'each';

                await addDoc(movementsCol, {...movementData, uom: uom, occurredAt: new Date()});
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
        user: userEmail,
        action: 'order.update',
        details: {
            entityType: 'order',
            entityId: orderId,
            message: `Updated order ${orderId}. Status: ${status}, Items: ${items.length}`
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

export async function fulfillOrder(fulfillmentData: FulfillmentData) {
    const { orderId, items } = fulfillmentData;
    const actor = fulfillmentData.actor || 'system.webhook';

    try {
        const order = await getOrderFromDb(orderId);
        if (!order) {
            return { success: false, error: `Order with ID ${orderId} not found.` };
        }

        const { locations } = await getLocationsFromDb();
        const warehouse = locations.find(l => l.type === 'warehouse');
        if (!warehouse) {
            return { success: false, error: 'No warehouse location found to fulfill from.' };
        }

        for (const item of items) {
            const movementData: Omit<InventoryMovement, 'id' | 'occurredAt' | 'uom'> = {
                sku: item.sku,
                locationId: warehouse.id,
                qty: item.quantity,
                direction: 'out',
                cause: 'sale',
                actor,
            };
            
            const movementsCol = collection(db, 'movements');
            await addDoc(movementsCol, {...movementData, uom: 'each', occurredAt: new Date()});
        }
        
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status: 'shipped' });

        await createAuditLog({
            user: actor,
            action: 'inventory.adjust.sale',
            details: {
                entityType: 'order',
                entityId: orderId,
                message: `Inventory adjusted for shipped order ${order.orderNumber} via webhook.`
            }
        });

        revalidatePath('/dashboard/orders');
        revalidatePath('/dashboard/inventory');
        revalidatePath('/dashboard/movements');
        revalidatePath('/dashboard/audit-log');

        return { success: true };

    } catch (error) {
        console.error('Error during order fulfillment:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, error: `Failed to fulfill order: ${message}` };
    }
}


export async function exportToBigQuery(userEmail: string, input: ExportToBigQueryInput) {
    try {
      const result = await exportToBigQueryFlow(input);
      
      await createExportLog({
          destination: 'BigQuery',
          status: result.success ? 'Completed' : 'Failed',
          triggeredBy: userEmail,
          message: result.message,
      });

      await createAuditLog({
        user: userEmail,
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
        user: userEmail,
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

export async function createInvitation(userEmail: string, invitedEmail: string, role: User['role']) {
    try {
        await createInvitationInDb({
            email: invitedEmail,
            role: role,
            invitedBy: userEmail,
            // In a real app, you would generate a secure, unique token
            token: `inv_${Date.now()}`, 
        });

        await createAuditLog({
            user: userEmail,
            action: 'user.invite',
            details: {
                entityType: 'invitation',
                entityId: invitedEmail,
                message: `Invited ${invitedEmail} to the organization with the role: ${role}.`
            }
        });
        
        revalidatePath('/dashboard/settings');
        revalidatePath('/dashboard/audit-log');
        // In a real app, you would also trigger an email to be sent here.
        return { success: true, message: `Invitation sent to ${invitedEmail}.` };

    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, error: `Failed to create invitation: ${message}` };
    }
}

export async function updateUserRole(userEmail: string, targetUserId: string, targetUserEmail: string, newRole: User['role']) {
    try {
        await updateUserInDb(targetUserId, { role: newRole });

        await createAuditLog({
            user: userEmail,
            action: 'user.role.update',
            details: {
                entityType: 'user',
                entityId: targetUserId,
                message: `Changed role for ${targetUserEmail} to ${newRole}.`
            }
        });
        
        revalidatePath('/dashboard/settings');
        revalidatePath('/dashboard/audit-log');
        return { success: true, message: `User role updated successfully.` };

    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, error: `Failed to update user role: ${message}` };
    }
}

export async function deleteUser(userEmail: string, targetUserId: string, targetUserEmail: string) {
    try {
        await deleteUserInDb(targetUserId);

        await createAuditLog({
            user: userEmail,
            action: 'user.delete',
            details: {
                entityType: 'user',
                entityId: targetUserId,
                message: `Deleted user ${targetUserEmail} from the organization.`
            }
        });
        
        revalidatePath('/dashboard/settings');
        revalidatePath('/dashboard/audit-log');
        return { success: true, message: `User deleted successfully.` };

    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, error: `Failed to delete user: ${message}` };
    }
}
