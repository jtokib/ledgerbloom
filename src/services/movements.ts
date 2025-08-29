
'use server';

import type { InventoryMovement } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp, addDoc } from 'firebase/firestore';


/**
 * A service to fetch inventory movements from Firestore.
 */
export async function getMovements(): Promise<InventoryMovement[]> {
  const movementsCol = collection(db, 'movements');
  // Order by date descending to get the most recent movements first
  const q = query(movementsCol, orderBy('occurredAt', 'desc'));
  const movementsSnapshot = await getDocs(q);

  const movementList = movementsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamp to JavaScript Date
      occurredAt: (data.occurredAt as Timestamp).toDate(),
    } as InventoryMovement;
  });

  return movementList;
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
