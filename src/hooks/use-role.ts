
'use client';
import { useState, useEffect } from 'react';
import { useUser } from 'reactfire';
import { getUser } from '@/services/users';
import type { User as AppUser } from '@/lib/types';

export function useRole() {
  const { data: firebaseUser } = useUser();
  const [role, setRole] = useState<AppUser['role'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (firebaseUser) {
        try {
          const appUser = await getUser(firebaseUser.uid);
          setRole(appUser?.role ?? null);
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setRole(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setRole(null);
      }
    }

    fetchUserRole();
  }, [firebaseUser]);

  return { role, isLoading };
}
