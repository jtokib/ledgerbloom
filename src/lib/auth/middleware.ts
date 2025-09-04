'use server';

import { getAuth } from '@/lib/firebase-admin';
import { CustomClaims } from './claims';
import { headers } from 'next/headers';
import type { DecodedIdToken } from 'firebase-admin/auth';

/**
 * Extract Firebase ID token from request headers.
 * This is the primary method for authenticating server-side requests.
 * The token is expected to be set by the Next.js middleware.
 */
async function getIdTokenFromHeaders(): Promise<string | null> {
  const headersList = await headers();
  const authorization = headersList.get('Authorization');
  
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }
  
  return authorization.split('Bearer ')[1];
}

/**
 * Verify Firebase ID token and return decoded token with claims.
 */
export async function verifyToken(idToken: string): Promise<(DecodedIdToken & CustomClaims) | null> {
  const auth = getAuth();
  
  try {
    const decodedToken = await auth.verifyIdToken(idToken, true);
    return decodedToken as DecodedIdToken & CustomClaims;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Get authenticated user from a server-side context (Server Component, Route Handler, or Server Action).
 * This relies on the token being passed in the request headers by the middleware.
 */
export async function getAuthenticatedUser() {
  const idToken = await getIdTokenFromHeaders();
  
  if (!idToken) {
    return null;
  }
  
  const decodedToken = await verifyToken(idToken);
  
  if (!decodedToken) {
    return null;
  }

  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
    claims: decodedToken,
  };
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
