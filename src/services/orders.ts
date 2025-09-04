
'use server';
import type { Order } from '@/lib/types';
import { getDb } from '@/lib/firebase-admin';

const ORDERS_COLLECTION = 'orders';
const DEFAULT_PAGE_SIZE = 10;

/**
 * A service to fetch all orders from Firestore with pagination, scoped to organization.
 */
export async function getOrders(organizationId: string, options: { lastVisibleId?: string | null, limit?: number } = {}): Promise<{ orders: Order[], hasMore: boolean }> {
  const { lastVisibleId, limit: pageSize = DEFAULT_PAGE_SIZE } = options;
  
  const db = getDb();
  const ordersCol = db.collection(ORDERS_COLLECTION);
  let q = ordersCol.where('organizationId', '==', organizationId).orderBy('createdAt', 'desc').limit(pageSize + 1);

  if (lastVisibleId) {
    const lastVisibleDoc = await db.collection(ORDERS_COLLECTION).doc(lastVisibleId).get();
    if (lastVisibleDoc.exists) {
        q = ordersCol.where('organizationId', '==', organizationId).orderBy('createdAt', 'desc').startAfter(lastVisibleDoc).limit(pageSize + 1);
    }
  }
  
  const ordersSnapshot = await q.get();
  
  const hasMore = ordersSnapshot.docs.length > pageSize;
  const orderList = ordersSnapshot.docs.slice(0, pageSize).map(doc => {
    const data = doc.data();
    return { 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt.toDate(),
    } as Order
  });

  return { orders: orderList, hasMore };
}

/**
 * A service to fetch a single order from Firestore.
 */
export async function getOrder(id: string): Promise<Order | null> {
    const db = getDb();
    const orderRef = db.collection('orders').doc(id);
    const orderSnap = await orderRef.get();

    if (orderSnap.exists) {
        const data = orderSnap.data();
        if (!data) return null;
        return { 
            id: orderSnap.id, 
            ...data,
            createdAt: data.createdAt.toDate(),
        } as Order;
    } else {
        return null;
    }
}
