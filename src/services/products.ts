
'use server';
import type { Product } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, getDoc } from 'firebase/firestore';

const PRODUCTS_COLLECTION = 'products';
const DEFAULT_PAGE_SIZE = 10;

/**
 * A service to fetch products from Firestore with pagination.
 */
export async function getProducts(options: { lastVisibleId?: string | null, limit?: number } = {}): Promise<{ products: Product[], hasMore: boolean }> {
  const { lastVisibleId, limit: pageSize = DEFAULT_PAGE_SIZE } = options;
  
  const productsCol = collection(db, PRODUCTS_COLLECTION);
  let q = query(productsCol, orderBy('displayName'), limit(pageSize + 1));

  if (lastVisibleId) {
    const lastVisibleDoc = await getDoc(doc(db, PRODUCTS_COLLECTION, lastVisibleId));
    if (lastVisibleDoc.exists()) {
        q = query(productsCol, orderBy('displayName'), startAfter(lastVisibleDoc), limit(pageSize + 1));
    }
  }

  const productsSnapshot = await getDocs(q);
  
  const hasMore = productsSnapshot.docs.length > pageSize;
  const productList = productsSnapshot.docs.slice(0, pageSize).map(doc => ({ id: doc.id, ...doc.data() } as Product));

  return { products: productList, hasMore };
}

    