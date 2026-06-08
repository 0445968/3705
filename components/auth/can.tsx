'use client';

import { ReactNode } from 'react';

import { usePermissions } from '@/hooks/use-permissions';

type Props = {
  permission?: string;
  roles?: string[];
  children: ReactNode;
};

export function Can({ permission, roles, children }: Props) {
  const { hasPermission, hasRole } = usePermissions();

  if (permission) {
    const allowed = hasPermission(permission as any);

    if (!allowed) return null;
  }

  if (roles?.length) {
    const allowed = hasRole(...roles);

    if (!allowed) return null;
  }

  return <>{children}</>;
}
