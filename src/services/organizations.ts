'use server';
import type { Organization } from '@/lib/types';
import { db } from '@/lib/firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  updateDoc, 
  deleteDoc,
  where 
} from 'firebase/firestore';

/**
 * Create a new organization
 */
export async function createOrganization(orgData: Omit<Organization, 'id'>): Promise<Organization> {
  const orgRef = doc(collection(db, 'organizations'));
  const organization: Organization = {
    id: orgRef.id,
    ...orgData
  };
  
  await setDoc(orgRef, organization);
  return organization;
}

/**
 * Get an organization by ID
 */
export async function getOrganization(orgId: string): Promise<Organization | null> {
  const orgRef = doc(db, 'organizations', orgId);
  const orgSnap = await getDoc(orgRef);
  
  if (orgSnap.exists()) {
    return orgSnap.data() as Organization;
  }
  return null;
}

/**
 * Update an organization
 */
export async function updateOrganization(orgId: string, data: Partial<Organization>): Promise<void> {
  const orgRef = doc(db, 'organizations', orgId);
  await updateDoc(orgRef, data);
}

/**
 * Delete an organization (admin only)
 */
export async function deleteOrganization(orgId: string): Promise<void> {
  const orgRef = doc(db, 'organizations', orgId);
  await deleteDoc(orgRef);
}

/**
 * Get all organizations (typically for super admin use)
 */
export async function getAllOrganizations(): Promise<Organization[]> {
  const orgsQuery = query(collection(db, 'organizations'));
  const querySnapshot = await getDocs(orgsQuery);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }) as Organization);
}