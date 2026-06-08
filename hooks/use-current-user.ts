'use client';

import { useAuth } from '@/hooks/use-auth';

export function useCurrentUser() {
  const { user } = useAuth();

  return user;
}
