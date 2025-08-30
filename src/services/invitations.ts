
'use server';
import type { Invitation } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

/**
 * A service to create an invitation document in Firestore.
 */
export async function createInvitation(invitationData: Omit<Invitation, 'id' | 'createdAt'>): Promise<Invitation> {
    const existingInvitationQuery = query(collection(db, 'invitations'), where('email', '==', invitationData.email));
    const existingInvitationSnapshot = await getDocs(existingInvitationQuery);

    if (!existingInvitationSnapshot.empty) {
        throw new Error(`An invitation for ${invitationData.email} already exists.`);
    }

    const newInvitationData = {
        ...invitationData,
        createdAt: new Date(),
    };

    const invitationsCol = collection(db, 'invitations');
    const docRef = await addDoc(invitationsCol, newInvitationData);
    
    return {
        ...newInvitationData,
        id: docRef.id,
    };
}

    