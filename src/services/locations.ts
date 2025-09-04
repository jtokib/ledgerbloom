
'use server';
import type { Location } from '@/lib/types';
import { getDb } from '@/lib/firebase-admin';

const LOCATIONS_COLLECTION = 'locations';
const DEFAULT_PAGE_SIZE = 10;

/**
 * A service to fetch locations from Firestore with pagination, scoped to organization.
 */
export async function getLocations(organizationId: string, options: { lastVisibleId?: string | null, limit?: number } = {}): Promise<{ locations: Location[], hasMore: boolean }> {
  const { lastVisibleId, limit: pageSize = DEFAULT_PAGE_SIZE } = options;
  
  const db = getDb();
  const locationsCol = db.collection(LOCATIONS_COLLECTION);
  let q = locationsCol.where('organizationId', '==', organizationId).orderBy('name').limit(pageSize + 1);

  if (lastVisibleId) {
    const lastVisibleDoc = await db.collection(LOCATIONS_COLLECTION).doc(lastVisibleId).get();
    if (lastVisibleDoc.exists) {
        q = locationsCol.where('organizationId', '==', organizationId).orderBy('name').startAfter(lastVisibleDoc).limit(pageSize + 1);
    }
  }

  const locationsSnapshot = await q.get();
  
  const hasMore = locationsSnapshot.docs.length > pageSize;
  const locationList = locationsSnapshot.docs.slice(0, pageSize).map(doc => ({ id: doc.id, ...doc.data() } as Location));
  
  return { locations: locationList, hasMore };
}
