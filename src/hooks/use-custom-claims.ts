'use client';

import { useState, useEffect } from 'react';
import { useUser } from 'reactfire';
import { User } from 'firebase/auth';

export interface CustomClaims {
  role: 'admin' | 'manager' | 'viewer';
  organizationId: string;
  permissions?: string[];
}

interface UseCustomClaimsReturn {
  claims: CustomClaims | null;
  loading: boolean;
  error: string | null;
  refreshClaims: () => Promise<void>;
}

export function useCustomClaims(): UseCustomClaimsReturn {
  const { data: user, status } = useUser();
  const [claims, setClaims] = useState<CustomClaims | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractClaims = async (firebaseUser: User): Promise<CustomClaims | null> => {
    try {
      // Force token refresh to get latest claims
      const idTokenResult = await firebaseUser.getIdTokenResult(true);
      
      const customClaims = idTokenResult.claims as CustomClaims;
      
      // Validate that required claims exist
      if (!customClaims.role || !customClaims.organizationId) {
        return null;
      }
      
      return {
        role: customClaims.role,
        organizationId: customClaims.organizationId,
        permissions: customClaims.permissions
      };
    } catch (err) {
      console.error('Error extracting claims:', err);
      throw err;
    }
  };

  const refreshClaims = async (): Promise<void> => {
    if (!user) {
      setClaims(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const newClaims = await extractClaims(user);
      setClaims(newClaims);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user claims';
      setError(errorMessage);
      setClaims(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status === 'error') {
      setError('Authentication error');
      setLoading(false);
      return;
    }

    if (!user) {
      setClaims(null);
      setLoading(false);
      return;
    }

    refreshClaims();
  }, [user, status]);

  return {
    claims,
    loading,
    error,
    refreshClaims
  };
}