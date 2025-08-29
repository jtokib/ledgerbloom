
'use server';

import type { InventoryMovement } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp, addDoc, limit, startAfter, getDoc } from 'firebase/firestore';

const MOVEMENTS_COLLECTION = 'movements';
const DEFAULT_PAGE_SIZE = 20;

/**
 * A service to fetch inventory movements from Firestore with pagination.
 */
export async function getMovements(options: { lastVisibleId?: string | null, limit?: number } = {}): Promise<{ movements: InventoryMovement[], hasMore: boolean }> {
  const { lastVisibleId, limit: pageSize = DEFAULT_PAGE_SIZE } = options;
  
  const movementsCol = collection(db, MOVEMENTS_COLLECTION);
  // Order by date descending to get the most recent movements first
  let q = query(movementsCol, orderBy('occurredAt', 'desc'), limit(pageSize + 1));

  if (lastVisibleId) {
    const lastVisibleDoc = await getDoc(doc(db, MOVEMENTS_COLLECTION, lastVisibleId));
    if (lastVisibleDoc.exists()) {
      q = query(movementsCol, orderBy('occurredAt', 'desc'), startAfter(lastVisibleDoc), limit(pageSize + 1));
    }
  }

  const movementsSnapshot = await getDocs(q);

  const hasMore = movementsSnapshot.docs.length > pageSize;
  const movementList = movementsSnapshot.docs.slice(0, pageSize).map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamp to JavaScript Date
      occurredAt: (data.occurredAt as Timestamp).toDate(),
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

    const movementsCol = collection(db, 'movements');
    const docRef = await addDoc(movementsCol, newMovementData);

    return {
        ...newMovementData,
        id: docRef.id,
    };
}
