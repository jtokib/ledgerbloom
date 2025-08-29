
'use server';
import type { User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

/**
 * A service to create a user document in Firestore.
 */
export async function createUser(userData: User): Promise<User> {
    const userRef = doc(db, 'users', userData.id);
    await setDoc(userRef, {
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
    });
    
    return userData;
}
