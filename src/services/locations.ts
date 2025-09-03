
'use server';
import type { Location } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, query, orderBy, limit, startAfter, getDoc, where } from 'firebase/firestore';

const LOCATIONS_COLLECTION = 'locations';
const DEFAULT_PAGE_SIZE = 10;

/**
 * A service to fetch locations from Firestore with pagination, scoped to organization.
 */
export async function getLocations(organizationId: string, options: { lastVisibleId?: string | null, limit?: number } = {}): Promise<{ locations: Location[], hasMore: boolean }> {
  const { lastVisibleId, limit: pageSize = DEFAULT_PAGE_SIZE } = options;
  
  const locationsCol = collection(db, LOCATIONS_COLLECTION);
  let q = query(locationsCol, where('organizationId', '==', organizationId), orderBy('name'), limit(pageSize + 1));

  if (lastVisibleId) {
    const lastVisibleDoc = await getDoc(doc(db, LOCATIONS_COLLECTION, lastVisibleId));
    if (lastVisibleDoc.exists()) {
        q = query(locationsCol, where('organizationId', '==', organizationId), orderBy('name'), startAfter(lastVisibleDoc), limit(pageSize + 1));
    }
  }

  const locationsSnapshot = await getDocs(q);
  
  const hasMore = locationsSnapshot.docs.length > pageSize;
  const locationList = locationsSnapshot.docs.slice(0, pageSize).map(doc => ({ id: doc.id, ...doc.data() } as Location));
  
  return { locations: locationList, hasMore };
}
