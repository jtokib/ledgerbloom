
'use server';
import type { Invitation } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, limit, deleteDoc, doc } from 'firebase/firestore';

const INVITATIONS_COLLECTION = 'invitations';

/**
 * A service to create an invitation document in Firestore.
 */
export async function createInvitation(invitationData: Omit<Invitation, 'id' | 'createdAt'>): Promise<Invitation> {
    const existingInvitationQuery = query(collection(db, INVITATIONS_COLLECTION), where('email', '==', invitationData.email));
    const existingInvitationSnapshot = await getDocs(existingInvitationQuery);

    if (!existingInvitationSnapshot.empty) {
        throw new Error(`An invitation for ${invitationData.email} already exists.`);
    }

    const newInvitationData = {
        ...invitationData,
        createdAt: new Date(),
    };

    const invitationsCol = collection(db, INVITATIONS_COLLECTION);
    const docRef = await addDoc(invitationsCol, newInvitationData);
    
    return {
        ...newInvitationData,
        id: docRef.id,
    };
}

/**
 * A service to get an invitation by email from Firestore.
 */
export async function getInvitationByEmail(email: string): Promise<Invitation | null> {
    const q = query(collection(db, INVITATIONS_COLLECTION), where('email', '==', email), limit(1));
    const querySnapshot = await getDocs(q);

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
    const invitationRef = doc(db, INVITATIONS_COLLECTION, id);
    await deleteDoc(invitationRef);
}
    

    