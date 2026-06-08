// hooks/queries/use-task-queries.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type CreateTaskInput = {
  orgId: string;
  projectId: string;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string | null;
  position?: number;
  dueDate?: string | null;
};

export type UpdateTaskInput = {
  id: string;
  orgId: string;
  projectId: string;
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string | null;
  position?: number;
  dueDate?: string | null;
};

export function useProjectTasks(projectId?: string | null) {
  return useQuery({
    queryKey: ['tasks', projectId],
    enabled: Boolean(projectId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId!)
        .order('position', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    },
  });
}

export function useTask(taskId?: string | null) {
  return useQuery({
    queryKey: ['task', taskId],
    enabled: Boolean(taskId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(
          `
          *,
          task_comments (
            id,
            user_id,
            body,
            created_at,
            updated_at
          ),
          time_logs (
            id,
            user_id,
            started_at,
            ended_at,
            duration_minutes,
            notes,
            created_at
          )
        `
        )
        .eq('id', taskId!)
        .single();

      if (error) throw error;

      return data;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const {
        orgId,
        projectId,
        title,
        description = null,
        status = 'backlog',
        priority = 'medium',
        assignedTo = null,
        position = 0,
        dueDate = null,
      } = input;

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          org_id: orgId,
          project_id: projectId,
          title,
          description,
          status,
          priority,
          assigned_to: assignedTo,
          position,
          due_date: dueDate,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', task.project_id],
      });

      queryClient.invalidateQueries({
        queryKey: ['project', task.project_id],
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateTaskInput) => {
      const {
        id,
        title,
        description,
        status,
        priority,
        assignedTo,
        position,
        dueDate,
      } = input;

      const payload: Record<string, unknown> = {};

      if (title !== undefined) payload.title = title;
      if (description !== undefined) payload.description = description;
      if (status !== undefined) payload.status = status;
      if (priority !== undefined) payload.priority = priority;
      if (assignedTo !== undefined) payload.assigned_to = assignedTo;
      if (position !== undefined) payload.position = position;
      if (dueDate !== undefined) payload.due_date = dueDate;

      const { data, error } = await supabase
        .from('tasks')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', task.project_id],
      });

      queryClient.invalidateQueries({
        queryKey: ['task', task.id],
      });

      queryClient.invalidateQueries({
        queryKey: ['project', task.project_id],
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      projectId,
    }: {
      taskId: string;
      projectId: string;
    }) => {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);

      if (error) throw error;

      return { taskId, projectId };
    },
    onSuccess: ({ taskId, projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ['project', projectId],
      });

      queryClient.removeQueries({
        queryKey: ['task', taskId],
      });
    },
  });
}
