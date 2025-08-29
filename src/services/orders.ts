
'use server';
import type { Order } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, Timestamp } from 'firebase/firestore';


/**
 * A service to fetch all orders from Firestore.
 */
export async function getOrders(): Promise<Order[]> {
  const ordersCol = collection(db, 'orders');
  const q = query(ordersCol, orderBy('createdAt', 'desc'));
  const ordersSnapshot = await getDocs(q);
  
  const orderList = ordersSnapshot.docs.map(doc => {
    const data = doc.data();
    return { 
        id: doc.id, 
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
    } as Order
  });

  return orderList;
}

/**
 * A service to fetch a single order from Firestore.
 */
export async function getOrder(id: string): Promise<Order | null> {
    const orderRef = doc(db, 'orders', id);
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
        const data = orderSnap.data();
        return { 
            id: orderSnap.id, 
            ...data,
            createdAt: (data.createdAt as Timestamp).toDate(),
        } as Order;
    } else {
        return null;
    }
}
