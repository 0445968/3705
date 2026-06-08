'use client';

import { useOrgStore } from '@/store/org-store';

export function usePermissions() {
  const role = useOrgStore((s) => s.role);

  const permissions = useOrgStore((s) => s.permissions);

  function hasPermission(permission: keyof typeof permissions) {
    return permissions[permission];
  }

  function hasRole(...roles: string[]) {
    if (!role) return false;

    return roles.includes(role);
  }

  return {
    role,

    permissions,

    hasPermission,
    hasRole,

    // convenience flags
    isOwner: role === 'owner',
    isAdmin: role === 'admin',
    isMember: role === 'member',
    isClient: role === 'client',
  };
}
