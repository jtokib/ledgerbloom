
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

export async function updateProduct(productData: Omit<Product, 'variants'>): Promise<Product> {
    const productRef = doc(db, 'products', productData.id);
    const dataToUpdate = { ...productData };
    delete (dataToUpdate as any).id; // don't store the id in the document itself

    await updateDoc(productRef, dataToUpdate);

    return {
        ...productData,
        variants: [] // variants are not updated here
    };
}

export async function deleteProduct(productId: string): Promise<void> {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
}
