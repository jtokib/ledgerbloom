
'use server';

import { getAuth } from '@/lib/firebase-admin';
import { CustomClaims } from './claims';
import { cookies, headers } from 'next/headers';

/**
 * Extract Firebase ID token from request headers
 */
async function getIdTokenFromHeaders(): Promise<string | null> {
  const headersList = await headers();
  const authorization = headersList.get('authorization');
  
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }
  
  return authorization.slice(7);
}

/**
 * Extract Firebase ID token from cookies (alternative method)
 */
async function getIdTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('firebase-token')?.value || null;
}

/**
 * Verify Firebase ID token and return decoded token with claims
 */
export async function verifyToken(idToken: string) {
  const auth = getAuth();
  
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      claims: decodedToken as unknown as CustomClaims
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Get authenticated user from request
 */
export async function getAuthenticatedUser() {
  // Try to get token from headers first, then cookies
  const idToken = await getIdTokenFromHeaders() || await getIdTokenFromCookies();
  
  if (!idToken) {
    return null;
  }
  
  return await verifyToken(idToken);
}

/**
 * Middleware to check if user has required role
 */
export async function requireRole(requiredRole: 'admin' | 'manager' | 'viewer') {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  if (!user.claims.role) {
    throw new Error('User has no role assigned');
  }
  
  const rolePriority = { admin: 3, manager: 2, viewer: 1 };
  const userPriority = rolePriority[user.claims.role];
  const requiredPriority = rolePriority[requiredRole];
  
  if (userPriority < requiredPriority) {
    throw new Error(`Insufficient permissions. Required: ${requiredRole}, User has: ${user.claims.role}`);
  }
  
  return user;
}

/**
 * Middleware to check if user belongs to organization
 */
export async function requireOrganization(organizationId: string) {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  if (user.claims.organizationId !== organizationId) {
    throw new Error('Access denied: User does not belong to this organization');
  }
  
  return user;
}

/**
 * Get the current authenticated user's organizationId
 */
export async function getCurrentOrganizationId(): Promise<string> {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  if (!user.claims.organizationId) {
    throw new Error('User has no organization assigned');
  }
  
  return user.claims.organizationId;
}
