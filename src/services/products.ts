
'use server';
import type { Product } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';


/**
 * A service to fetch products from Firestore.
 */
export async function getProducts(): Promise<Product[]> {
  const productsCol = collection(db, 'products');
  const q = query(productsCol, orderBy('displayName'));
  const productsSnapshot = await getDocs(q);
  const productList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return productList;
}
