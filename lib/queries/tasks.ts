import { del, get, patch, post } from '@/lib/api';

export type TaskStatus =
  | 'backlog'
  | 'todo'
  | 'in_progress'
  | 'review'
  | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  org_id: string;

  project_id: string;
  subject_id?: string | null;

  title: string;
  description?: string | null;

  status: TaskStatus | string;
  priority: TaskPriority | string;

  assigned_to?: string | null;
  position?: number | null;

  due_date?: string | null;

  created_by?: string | null;
  created_at: string;
  updated_at?: string | null;

  project?: {
    id: string;
    name: string;
    subject_id?: string | null;
  } | null;

  subject?: {
    id: string;
    name: string;
    slug?: string | null;
  } | null;
};

export type GetTasksFilters = {
  projectId?: string | null;
  subjectId?: string | null;
  status?: TaskStatus | string | null;
};

export type CreateTaskInput = {
  org_id: string;

  project_id: string;
  subject_id?: string | null;

  title: string;
  description?: string | null;

  status?: TaskStatus | string;
  priority?: TaskPriority | string;

  assigned_to?: string | null;
  position?: number | null;

  due_date?: string | null;
  created_by?: string | null;
};

export type UpdateTaskInput = {
  org_id: string;

  title?: string;
  description?: string | null;

  status?: TaskStatus | string;
  priority?: TaskPriority | string;

  assigned_to?: string | null;
  position?: number | null;

  due_date?: string | null;
};

export async function getTasks(
  orgId: string,
  filters: GetTasksFilters = {}
) {
  const params = new URLSearchParams({
    orgId,
  });

  if (filters.projectId) {
    params.set('projectId', filters.projectId);
  }

  if (filters.subjectId) {
    params.set('subjectId', filters.subjectId);
  }

  if (filters.status) {
    params.set('status', filters.status);
  }

  return get<Task[]>(`/tasks?${params.toString()}`);
}

export async function createTask(input: CreateTaskInput) {
  return post<Task, CreateTaskInput>('/tasks', input);
}

export async function updateTask(id: string, input: UpdateTaskInput) {
  return patch<Task, UpdateTaskInput>(`/tasks/${id}`, input);
}

export async function deleteTask(id: string, orgId: string) {
  const params = new URLSearchParams({
    orgId,
  });

  return del<{ success: true }>(`/tasks/${id}?${params.toString()}`);
}