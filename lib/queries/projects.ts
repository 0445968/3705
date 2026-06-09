import { get, patch, post } from '@/lib/api';

export type ProjectStatus =
  | 'active'
  | 'draft'
  | 'paused'
  | 'completed'
  | 'archived';

export type Project = {
  id: string;
  org_id: string;

  subject_id?: string | null;
  company_id?: string | null;
  workspace_id?: string | null;

  name: string;
  description?: string | null;

  industry?: string | null;
  sector?: string | null;

  status: ProjectStatus | string | null;
  due_date?: string | null;

  created_by?: string | null;
  created_at: string;
  updated_at?: string | null;

  subject?: {
    id: string;
    name: string;
    slug?: string | null;
    industry?: string | null;
    sector?: string | null;
  } | null;

  workspaces?: {
    id: string;
    name: string;
  } | null;
};

export type CreateProjectInput = {
  org_id: string;

  subject_id?: string | null;
  company_id?: string | null;
  workspace_id?: string | null;

  name: string;
  description?: string | null;

  industry?: string | null;
  sector?: string | null;

  status?: ProjectStatus | string;
  due_date?: string | null;
};

export type UpdateProjectInput = {
  org_id: string;

  subject_id?: string | null;
  company_id?: string | null;
  workspace_id?: string | null;

  name?: string;
  description?: string | null;

  industry?: string | null;
  sector?: string | null;

  status?: ProjectStatus | string;
  due_date?: string | null;
};

export async function getProjects(orgId: string, subjectId?: string | null) {
  const params = new URLSearchParams({
    orgId,
  });

  if (subjectId) {
    params.set('subjectId', subjectId);
  }

  return get<Project[]>(`/projects?${params.toString()}`);
}

export async function createProject(input: CreateProjectInput) {
  return post<Project, CreateProjectInput>('/projects', input);
}

export async function updateProject(id: string, input: UpdateProjectInput) {
  return patch<Project, UpdateProjectInput>(`/projects/${id}`, input);
}