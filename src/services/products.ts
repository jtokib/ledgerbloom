
'use server';
import type { Product } from '@/lib/types';
import { getDb } from '@/lib/firebase-admin';

const PRODUCTS_COLLECTION = 'products';
const DEFAULT_PAGE_SIZE = 10;

/**
 * A service to fetch products from Firestore with pagination, scoped to organization.
 */
export async function getProducts(organizationId: string, options: { lastVisibleId?: string | null, limit?: number } = {}): Promise<{ products: Product[], hasMore: boolean }> {
  const { lastVisibleId, limit: pageSize = DEFAULT_PAGE_SIZE } = options;
  
  const db = getDb();
  const productsCol = db.collection(PRODUCTS_COLLECTION);
  let q = productsCol.where('organizationId', '==', organizationId).orderBy('displayName').limit(pageSize + 1);

  if (lastVisibleId) {
    const lastVisibleDoc = await db.collection(PRODUCTS_COLLECTION).doc(lastVisibleId).get();
    if (lastVisibleDoc.exists) {
        q = productsCol.where('organizationId', '==', organizationId).orderBy('displayName').startAfter(lastVisibleDoc).limit(pageSize + 1);
    }
  }

  const productsSnapshot = await q.get();
  
  const hasMore = productsSnapshot.docs.length > pageSize;
  const productList = productsSnapshot.docs.slice(0, pageSize).map(doc => ({ id: doc.id, ...doc.data() } as Product));

  return { products: productList, hasMore };
}

    