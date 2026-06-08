import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export type ProjectStatus =
  | 'active'
  | 'planning'
  | 'on_hold'
  | 'completed'
  | 'archived';

export type CreateProjectInput = {
  orgId: string;
  workspaceId?: string | null;
  name: string;
  description?: string | null;
  status?: ProjectStatus;
  dueDate?: string | null;
};

export type UpdateProjectInput = {
  id: string;
  orgId: string;
  workspaceId?: string | null;
  name?: string;
  description?: string | null;
  status?: ProjectStatus;
  dueDate?: string | null;
};

export function useProjects(orgId?: string | null) {
  return useQuery({
    queryKey: ['projects', orgId],
    enabled: Boolean(orgId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(
          `
          *,
          workspace:workspaces (
            id,
            name
          )
        `
        )
        .eq('org_id', orgId!)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    },
  });
}

export function useProject(projectId?: string | null) {
  return useQuery({
    queryKey: ['project', projectId],
    enabled: Boolean(projectId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(
          `
          *,
          workspace:workspaces (
            id,
            name
          ),
          project_members (
            id,
            user_id,
            role,
            created_at
          ),
          tasks (
            id,
            title,
            description,
            status,
            priority,
            assigned_to,
            position,
            due_date,
            created_at,
            updated_at
          )
        `
        )
        .eq('id', projectId!)
        .single();

      if (error) throw error;

      return data;
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const {
        orgId,
        workspaceId = null,
        name,
        description = null,
        status = 'active',
        dueDate = null,
      } = input;

      const { data, error } = await supabase
        .from('projects')
        .insert({
          org_id: orgId,
          workspace_id: workspaceId,
          name,
          description,
          status,
          due_date: dueDate,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', project.org_id],
      });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProjectInput) => {
      const { id, workspaceId, name, description, status, dueDate } = input;

      const payload: Record<string, unknown> = {};

      if (workspaceId !== undefined) payload.workspace_id = workspaceId;
      if (name !== undefined) payload.name = name;
      if (description !== undefined) payload.description = description;
      if (status !== undefined) payload.status = status;
      if (dueDate !== undefined) payload.due_date = dueDate;

      const { data, error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', project.org_id],
      });

      queryClient.invalidateQueries({
        queryKey: ['project', project.id],
      });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      orgId,
    }: {
      projectId: string;
      orgId: string;
    }) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      return { projectId, orgId };
    },
    onSuccess: ({ projectId, orgId }) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', orgId],
      });

      queryClient.removeQueries({
        queryKey: ['project', projectId],
      });
    },
  });
}
