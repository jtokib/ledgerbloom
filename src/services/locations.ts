
'use server';
import type { Location } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';


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

export async function createLocation(locationData: Omit<Location, 'id'>): Promise<Location> {
    const locationsCol = collection(db, 'locations');
    const docRef = await addDoc(locationsCol, locationData);
    return {
        ...locationData,
        id: docRef.id,
    };
}

export async function updateLocation(locationData: Location): Promise<Location> {
    const locationRef = doc(db, 'locations', locationData.id);
    const dataToUpdate = { ...locationData };
    delete (dataToUpdate as any).id; // don't store the id in the document itself

    await updateDoc(locationRef, dataToUpdate);

    return locationData;
}

export async function deleteLocation(locationId: string): Promise<void> {
    const locationRef = doc(db, 'locations', locationId);
    await deleteDoc(locationRef);
}
