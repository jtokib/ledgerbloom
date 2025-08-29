
'use server';
import type { User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * A service to create a user document in Firestore.
 */
export async function createUser(userData: User): Promise<User> {
    const userRef = doc(db, 'users', userData.id);
    // Use setDoc with merge: true to avoid overwriting existing data if any
    await setDoc(userRef, {
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
    }, { merge: true });
    
    return userData;
}

/**
 * A service to fetch a user document from Firestore.
 */
export async function getUser(uid: string): Promise<User | null> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return { id: uid, ...userSnap.data() } as User;
    } else {
        console.warn(`No user document found for UID: ${uid}`);
        return null;
    }
}
