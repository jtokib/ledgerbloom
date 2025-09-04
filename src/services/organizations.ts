
'use server';
import type { Organization } from '@/lib/types';
import { getDb } from '@/lib/firebase-admin';
/**
 * Create a new organization
 */
export async function createOrganization(orgData: Omit<Organization, 'id'>): Promise<Organization> {
  const db = getDb();
  const orgRef = db.collection('organizations').doc();
  const organization: Organization = {
    id: orgRef.id,
    ...orgData
  };
  
  await orgRef.set(organization);
  return organization;
}

/**
 * Get an organization by ID
 */
export async function getOrganization(orgId: string): Promise<Organization | null> {
  const db = getDb();
  const orgRef = db.collection('organizations').doc(orgId);
  const orgSnap = await orgRef.get();
  
  if (orgSnap.exists) {
    return { id: orgSnap.id, ...orgSnap.data() } as Organization;
  }
  return null;
}

/**
 * Update an organization
 */
export async function updateOrganization(orgId: string, data: Partial<Organization>): Promise<void> {
  const db = getDb();
  const orgRef = db.collection('organizations').doc(orgId);
  await orgRef.update(data);
}

/**
 * Delete an organization (admin only)
 */
export async function deleteOrganization(orgId: string): Promise<void> {
  const db = getDb();
  const orgRef = db.collection('organizations').doc(orgId);
  await orgRef.delete();
}

/**
 * Get all organizations (typically for super admin use)
 */
export async function getAllOrganizations(): Promise<Organization[]> {
  const db = getDb();
  const querySnapshot = await db.collection('organizations').get();
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }) as Organization);
}
