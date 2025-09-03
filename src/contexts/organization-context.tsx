'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from 'reactfire';
import { Organization, User } from '@/lib/types';
import { getOrganization } from '@/services/organizations';
import { useCustomClaims } from '@/hooks/use-custom-claims';

interface OrganizationContextType {
  organization: Organization | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshOrganization: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | null>(null);

interface OrganizationProviderProps {
  children: ReactNode;
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const { data: authUser, status: authStatus } = useUser();
  const { claims, loading: claimsLoading, error: claimsError } = useCustomClaims();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserAndOrganization = async () => {
    if (!authUser || !claims) {
      setOrganization(null);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create user object from auth user and claims
      const userData: User = {
        id: authUser.uid,
        email: authUser.email!,
        displayName: authUser.displayName || undefined,
        role: claims.role,
        organizationId: claims.organizationId
      };

      setUser(userData);

      // Get organization
      const orgData = await getOrganization(claims.organizationId);
      if (!orgData) {
        setError('Organization not found');
        return;
      }

      setOrganization(orgData);
    } catch (err) {
      console.error('Error loading organization context:', err);
      setError('Failed to load organization data');
    } finally {
      setLoading(false);
    }
  };

  const refreshOrganization = async () => {
    await loadUserAndOrganization();
  };

  useEffect(() => {
    if (claimsError) {
      setError(claimsError);
      setLoading(false);
      return;
    }

    if (authStatus === 'loading' || claimsLoading) {
      setLoading(true);
      return;
    }

    if (authStatus === 'error') {
      setError('Authentication error');
      setLoading(false);
      return;
    }

    if (!authUser) {
      setOrganization(null);
      setUser(null);
      setLoading(false);
      return;
    }

    loadUserAndOrganization();
  }, [authUser, authStatus, claims, claimsLoading, claimsError]);

  const value: OrganizationContextType = {
    organization,
    user,
    loading,
    error,
    refreshOrganization
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}