
'use server';

import { getAuth } from '@/lib/firebase-admin';

// Custom claims structure
export interface CustomClaims {
  role: 'admin' | 'manager' | 'viewer';
  organizationId: string;
  permissions?: string[];
}

/**
 * Set custom claims for a user
 */
export async function setUserClaims(uid: string, claims: CustomClaims): Promise<void> {
  const auth = getAuth();
  await auth.setCustomUserClaims(uid, claims);
}

/**
 * Get custom claims for a user
 */
export async function getUserClaims(uid: string): Promise<CustomClaims | null> {
  const auth = getAuth();
  const userRecord = await auth.getUser(uid);
  return (userRecord.customClaims as CustomClaims) || null;
}

/**
 * Remove all custom claims for a user
 */
export async function clearUserClaims(uid: string): Promise<void> {
  const auth = getAuth();
  await auth.setCustomUserClaims(uid, null);
}

/**
 * Update user role while preserving other claims
 */
export async function updateUserRole(uid: string, role: 'admin' | 'manager' | 'viewer'): Promise<void> {
  const currentClaims = await getUserClaims(uid);
  if (!currentClaims) {
    throw new Error('User has no custom claims set');
  }
  
  await setUserClaims(uid, {
    ...currentClaims,
    role
  });
}

/**
 * Check if user has required role
 */
export async function checkUserRole(uid: string, requiredRole: 'admin' | 'manager' | 'viewer'): Promise<boolean> {
  const claims = await getUserClaims(uid);
  if (!claims) return false;
  
  const rolePriority = { admin: 3, manager: 2, viewer: 1 };
  const userPriority = rolePriority[claims.role];
  const requiredPriority = rolePriority[requiredRole];
  
  return userPriority >= requiredPriority;
}

/**
 * Check if user belongs to organization
 */
export async function checkUserOrganization(uid: string, organizationId: string): Promise<boolean> {
  const claims = await getUserClaims(uid);
  return claims?.organizationId === organizationId;
}
