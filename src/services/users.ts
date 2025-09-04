
'use server';
import type { User } from '@/lib/types';
import { getDb } from '@/lib/firebase-admin';

/**
 * A service to create a user document in Firestore.
 */
export async function createUser(userData: User): Promise<User> {
    const db = getDb();
    const userRef = db.collection('users').doc(userData.id);
    // Use set with merge: true to avoid overwriting existing data if any
    await userRef.set({
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
    const userRef = db.collection('users').doc(uid);
    await userRef.update(data);
}

/**
 * A service to delete a user document from Firestore.
 * NOTE: This does NOT delete the user from Firebase Authentication.
 */
export async function deleteUser(uid: string): Promise<void> {
    const db = getDb();
    const userRef = db.collection('users').doc(uid);
    await userRef.delete();
}


/**
 * A service to fetch a user document from Firestore.
 */
export async function getUser(uid: string): Promise<User | null> {
    const db = getDb();
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
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
    const usersCol = db.collection('users');
    const usersSnapshot = await usersCol.get();

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
