
'use client';
import { useCustomClaims } from './use-custom-claims';
import type { User as AppUser } from '@/lib/types';

export function useRole() {
  const { claims, loading } = useCustomClaims();

  const isAdmin = claims?.role === 'admin';
  const isManager = claims?.role === 'manager' || isAdmin;
  const isViewer = claims?.role === 'viewer' || isManager;

  return {
    role: claims?.role || null,
    isLoading: loading,
    isAdmin,
    isManager,
    isViewer
  };
}
