import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export type WorkspaceVisibility = 'private' | 'organization' | 'client';

export type CreateWorkspaceInput = {
  orgId: string;
  name: string;
  description?: string | null;
  visibility?: WorkspaceVisibility;
};

export type UpdateWorkspaceInput = {
  id: string;
  orgId: string;
  name?: string;
  description?: string | null;
  visibility?: WorkspaceVisibility;
};

export function useWorkspaces(orgId?: string | null) {
  return useQuery({
    queryKey: ['workspaces', orgId],
    enabled: Boolean(orgId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('org_id', orgId!)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    },
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateWorkspaceInput) => {
      const { orgId, name, description = null, visibility = 'private' } = input;

      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          org_id: orgId,
          name,
          description,
          visibility,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({
        queryKey: ['workspaces', workspace.org_id],
      });
    },
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateWorkspaceInput) => {
      const { id, name, description, visibility } = input;

      const payload: Record<string, unknown> = {};

      if (name !== undefined) payload.name = name;
      if (description !== undefined) payload.description = description;
      if (visibility !== undefined) payload.visibility = visibility;

      const { data, error } = await supabase
        .from('workspaces')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({
        queryKey: ['workspaces', workspace.org_id],
      });
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      orgId,
    }: {
      workspaceId: string;
      orgId: string;
    }) => {
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', workspaceId);

      if (error) throw error;

      return { workspaceId, orgId };
    },
    onSuccess: ({ orgId }) => {
      queryClient.invalidateQueries({
        queryKey: ['workspaces', orgId],
      });

      queryClient.invalidateQueries({
        queryKey: ['projects', orgId],
      });
    },
  });
}
