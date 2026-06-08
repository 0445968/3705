'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Organization } from '@/types';

export type OrgRole = 'owner' | 'admin' | 'member' | 'client';

export interface Membership {
  orgId: string;
  role: OrgRole;
}

interface OrgState {
  currentOrg: Organization | null;
  orgs: Organization[];

  memberships: Membership[];
  role: OrgRole | null;

  permissions: {
    canManageOrg: boolean;
    canManageProjects: boolean;
    canManageTasks: boolean;
    canInviteUsers: boolean;
  };
}

interface OrgActions {
  setCurrentOrg: (org: Organization) => void;
  setOrgs: (orgs: Organization[]) => void;

  setMemberships: (memberships: Membership[]) => void;

  addOrg: (org: Organization) => void;
  clearOrgs: () => void;

  computeRoleAndPermissions: () => void;
}

type OrgStore = OrgState & OrgActions;

const initialPermissions = {
  canManageOrg: false,
  canManageProjects: false,
  canManageTasks: false,
  canInviteUsers: false,
};

function getPermissions(role: OrgRole | null) {
  switch (role) {
    case 'owner':
      return {
        canManageOrg: true,
        canManageProjects: true,
        canManageTasks: true,
        canInviteUsers: true,
      };

    case 'admin':
      return {
        canManageOrg: false,
        canManageProjects: true,
        canManageTasks: true,
        canInviteUsers: true,
      };

    case 'member':
      return {
        canManageOrg: false,
        canManageProjects: false,
        canManageTasks: true,
        canInviteUsers: false,
      };

    case 'client':
      return {
        canManageOrg: false,
        canManageProjects: false,
        canManageTasks: false,
        canInviteUsers: false,
      };

    default:
      return initialPermissions;
  }
}

const initialState: OrgState = {
  currentOrg: null,
  orgs: [],
  memberships: [],
  role: null,
  permissions: initialPermissions,
};

export const useOrgStore = create<OrgStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentOrg: (org) => {
        const membership = get().memberships.find(
          (m) => m.orgId === org.id
        );

        const role = membership?.role ?? null;

        set({
          currentOrg: org,
          role,
          permissions: getPermissions(role),
        });
      },

      setOrgs: (orgs) => {
        const { currentOrg } = get();

        const newCurrentOrg =
          currentOrg && orgs.find((o) => o.id === currentOrg.id)
            ? currentOrg
            : orgs[0] ?? null;

        const membership = get().memberships.find(
          (m) => m.orgId === newCurrentOrg?.id
        );

        const role = membership?.role ?? null;

        set({
          orgs,
          currentOrg: newCurrentOrg,
          role,
          permissions: getPermissions(role),
        });
      },

      setMemberships: (memberships) => {
        const { currentOrg } = get();

        const role =
          memberships.find((m) => m.orgId === currentOrg?.id)?.role ?? null;

        set({
          memberships,
          role,
          permissions: getPermissions(role),
        });
      },

      addOrg: (org) => {
        set((state) => ({
          orgs: [...state.orgs, org],
          currentOrg: state.currentOrg ?? org,
        }));
      },

      clearOrgs: () => {
        set({
          currentOrg: null,
          orgs: [],
          memberships: [],
          role: null,
          permissions: initialPermissions,
        });
      },

      computeRoleAndPermissions: () => {
        const { memberships, currentOrg } = get();

        const role =
          memberships.find((m) => m.orgId === currentOrg?.id)?.role ?? null;

        set({
          role,
          permissions: getPermissions(role),
        });
      },
    }),
    {
      name: 'crafterkite-org',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentOrg: state.currentOrg,
        orgs: state.orgs,
        memberships: state.memberships,
      }),
    }
  )
);

// Selectors
export const useCurrentOrg = () => useOrgStore((s) => s.currentOrg);
export const useOrgs = () => useOrgStore((s) => s.orgs);
export const useOrgPermissions = () => useOrgStore((s) => s.permissions);