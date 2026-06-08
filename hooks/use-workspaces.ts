'use client';

import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';

import { useCurrentOrg } from '@/store/org-store';

export type Workspace = {
  id: string;

  org_id: string;

  name: string;
  description?: string | null;

  visibility: string;

  created_by?: string | null;

  created_at: string;
};

export function useWorkspaces() {
  const currentOrg = useCurrentOrg();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const [loading, setLoading] = useState(true);

  async function loadWorkspaces() {
    if (!currentOrg?.id) {
      setWorkspaces([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('org_id', currentOrg.id)
        .order('created_at', {
          ascending: false,
        });

      if (error) throw error;

      setWorkspaces(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function createWorkspace(input: Partial<Workspace>) {
    if (!currentOrg?.id) return;

    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        ...input,
        org_id: currentOrg.id,
      })
      .select()
      .single();

    if (error) throw error;

    setWorkspaces((prev) => [data, ...prev]);

    return data;
  }

  async function deleteWorkspace(id: string) {
    const { error } = await supabase.from('workspaces').delete().eq('id', id);

    if (error) throw error;

    setWorkspaces((prev) => prev.filter((workspace) => workspace.id !== id));
  }

  useEffect(() => {
    loadWorkspaces();
  }, [currentOrg?.id]);

  return {
    workspaces,
    loading,

    refreshWorkspaces: loadWorkspaces,

    createWorkspace,
    deleteWorkspace,
  };
}
