
'use server';

import type { InventoryMovement } from '@/lib/types';
import { getDb } from '@/lib/firebase-admin';

const MOVEMENTS_COLLECTION = 'movements';
const DEFAULT_PAGE_SIZE = 20;

/**
 * A service to fetch inventory movements from Firestore with pagination, scoped to organization.
 */
export async function getMovements(organizationId: string, options: { lastVisibleId?: string | null, limit?: number } = {}): Promise<{ movements: InventoryMovement[], hasMore: boolean }> {
  const { lastVisibleId, limit: pageSize = DEFAULT_PAGE_SIZE } = options;
  
  const db = getDb();
  const movementsCol = db.collection(MOVEMENTS_COLLECTION);
  // Order by date descending to get the most recent movements first
  let q = movementsCol.where('organizationId', '==', organizationId).orderBy('occurredAt', 'desc').limit(pageSize + 1);

  if (lastVisibleId) {
    const lastVisibleDoc = await db.collection(MOVEMENTS_COLLECTION).doc(lastVisibleId).get();
    if (lastVisibleDoc.exists) {
      q = movementsCol.where('organizationId', '==', organizationId).orderBy('occurredAt', 'desc').startAfter(lastVisibleDoc).limit(pageSize + 1);
    }
  }

  const movementsSnapshot = await q.get();

  const hasMore = movementsSnapshot.docs.length > pageSize;
  const movementList = movementsSnapshot.docs.slice(0, pageSize).map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamp to JavaScript Date
      occurredAt: data.occurredAt.toDate(),
    } as InventoryMovement;
  });

  return { movements: movementList, hasMore };
}

/**
 * A service to create an inventory movement in Firestore.
 */
export async function createMovement(movementData: Omit<InventoryMovement, 'id' | 'occurredAt'>): Promise<InventoryMovement> {
    const newMovementData = {
        ...movementData,
        occurredAt: new Date(),
    };

    const db = getDb();
    const movementsCol = db.collection('movements');
    const docRef = await movementsCol.add(newMovementData);

    return {
        ...newMovementData,
        id: docRef.id,
    };
}
