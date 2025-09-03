
'use server';
import type { Order } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, Timestamp, limit, startAfter, where } from 'firebase/firestore';

const ORDERS_COLLECTION = 'orders';
const DEFAULT_PAGE_SIZE = 10;

/**
 * A service to fetch all orders from Firestore with pagination, scoped to organization.
 */
export async function getOrders(organizationId: string, options: { lastVisibleId?: string | null, limit?: number } = {}): Promise<{ orders: Order[], hasMore: boolean }> {
  const { lastVisibleId, limit: pageSize = DEFAULT_PAGE_SIZE } = options;
  
  const ordersCol = collection(db, ORDERS_COLLECTION);
  let q = query(ordersCol, where('organizationId', '==', organizationId), orderBy('createdAt', 'desc'), limit(pageSize + 1));

  if (lastVisibleId) {
    const lastVisibleDoc = await getDoc(doc(db, ORDERS_COLLECTION, lastVisibleId));
    if (lastVisibleDoc.exists()) {
        q = query(ordersCol, where('organizationId', '==', organizationId), orderBy('createdAt', 'desc'), startAfter(lastVisibleDoc), limit(pageSize + 1));
    }
  }
  
  const ordersSnapshot = await getDocs(q);
  
  const hasMore = ordersSnapshot.docs.length > pageSize;
  const orderList = ordersSnapshot.docs.slice(0, pageSize).map(doc => {
    const data = doc.data();
    return { 
        id: doc.id, 
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
    } as Order
  });

  return { orders: orderList, hasMore };
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
