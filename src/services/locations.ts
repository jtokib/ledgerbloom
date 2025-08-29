
'use server';
import type { Location } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';


/**
 * A service to fetch locations from Firestore.
 */
export async function getLocations(): Promise<Location[]> {
  const locationsCol = collection(db, 'locations');
  const q = query(locationsCol, orderBy('name'));
  const locationsSnapshot = await getDocs(q);
  const locationList = locationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Location));
  return locationList;
}
