
'use server';
import type { Invitation } from '@/lib/types';
import { getDb } from '@/lib/firebase-admin';

const INVITATIONS_COLLECTION = 'invitations';

/**
 * A service to create an invitation document in Firestore.
 */
export async function createInvitation(invitationData: Omit<Invitation, 'id' | 'createdAt'>): Promise<Invitation> {
    const db = getDb();
    const existingInvitationQuery = db.collection(INVITATIONS_COLLECTION).where('email', '==', invitationData.email);
    const existingInvitationSnapshot = await existingInvitationQuery.get();

    if (!existingInvitationSnapshot.empty) {
        throw new Error(`An invitation for ${invitationData.email} already exists.`);
    }

    const newInvitationData = {
        ...invitationData,
        createdAt: new Date(),
    };

    const invitationsCol = db.collection(INVITATIONS_COLLECTION);
    const docRef = await invitationsCol.add(newInvitationData);
    
    return {
        ...newInvitationData,
        id: docRef.id,
    };
}

/**
 * A service to get an invitation by email from Firestore.
 */
export async function getInvitationByEmail(email: string): Promise<Invitation | null> {
    const db = getDb();
    const q = db.collection(INVITATIONS_COLLECTION).where('email', '==', email).limit(1);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
        return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Invitation;
}

/**
 * A service to delete an invitation document from Firestore.
 */
export async function deleteInvitation(id: string): Promise<void> {
    const db = getDb();
    const invitationRef = db.collection(INVITATIONS_COLLECTION).doc(id);
    await invitationRef.delete();
}
    

    