'use client';

import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';

import { useCurrentOrg } from '@/store/org-store';

export type OrgMember = {
  id: string;

  org_id: string;

  user_id: string;

  role: string;

  email?: string | null;

  created_at: string;
};

export function useOrgMembers() {
  const currentOrg = useCurrentOrg();

  const [members, setMembers] = useState<OrgMember[]>([]);

  const [loading, setLoading] = useState(true);

  async function loadMembers() {
    if (!currentOrg?.id) {
      setMembers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('org_members_with_users')
        .select('*')
        .eq('org_id', currentOrg.id)
        .order('created_at', {
          ascending: true,
        });

      if (error) throw error;

      setMembers(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, [currentOrg?.id]);

  return {
    members,
    loading,

    refreshMembers: loadMembers,
  };
}
