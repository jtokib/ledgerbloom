
'use server';
import type { Location } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, query, orderBy, limit, startAfter, getDoc } from 'firebase/firestore';

const LOCATIONS_COLLECTION = 'locations';
const DEFAULT_PAGE_SIZE = 10;

/**
 * A service to fetch locations from Firestore with pagination.
 */
export async function getLocations(options: { lastVisibleId?: string | null, limit?: number } = {}): Promise<{ locations: Location[], hasMore: boolean }> {
  const { lastVisibleId, limit: pageSize = DEFAULT_PAGE_SIZE } = options;
  
  const locationsCol = collection(db, LOCATIONS_COLLECTION);
  let q = query(locationsCol, orderBy('name'), limit(pageSize + 1));

  if (lastVisibleId) {
    const lastVisibleDoc = await getDoc(doc(db, LOCATIONS_COLLECTION, lastVisibleId));
    if (lastVisibleDoc.exists()) {
        q = query(locationsCol, orderBy('name'), startAfter(lastVisibleDoc), limit(pageSize + 1));
    }
  }

  const locationsSnapshot = await getDocs(q);
  
  const hasMore = locationsSnapshot.docs.length > pageSize;
  const locationList = locationsSnapshot.docs.slice(0, pageSize).map(doc => ({ id: doc.id, ...doc.data() } as Location));
  
  return { locations: locationList, hasMore };
}
