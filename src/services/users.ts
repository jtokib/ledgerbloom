
'use server';
import type { User } from '@/lib/types';
import { getDb } from '@/lib/firebase-admin';
import { doc, setDoc, getDoc, collection, getDocs, query, updateDoc, deleteDoc } from 'firebase/firestore';

/**
 * A service to create a user document in Firestore.
 */
export async function createUser(userData: User): Promise<User> {
    const db = getDb();
    const userRef = doc(db, 'users', userData.id);
    // Use setDoc with merge: true to avoid overwriting existing data if any
    await setDoc(userRef, {
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        organizationId: userData.organizationId,
    }, { merge: true });
    
    return userData;
}

/**
 * A service to update a user document in Firestore.
 */
export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
    const db = getDb();
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
}

/**
 * A service to delete a user document from Firestore.
 * NOTE: This does NOT delete the user from Firebase Authentication.
 */
export async function deleteUser(uid: string): Promise<void> {
    const db = getDb();
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
}


/**
 * A service to fetch a user document from Firestore.
 */
export async function getUser(uid: string): Promise<User | null> {
    const db = getDb();
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return { id: uid, ...userSnap.data() } as User;
    } else {
        console.warn(`No user document found for UID: ${uid}`);
        return null;
    }
}

/**
 * A service to fetch all user documents from Firestore.
 */
export async function getUsers(): Promise<User[]> {
    const db = getDb();
    const usersCol = collection(db, 'users');
    const q = query(usersCol);
    const usersSnapshot = await getDocs(q);

    const userList = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            email: data.email,
            displayName: data.displayName,
            role: data.role,
        } as User;
    });

    return userList;
}
