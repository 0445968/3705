'use client';

import { useEffect, useState } from 'react';

import { get } from '@/lib/api';
import { useActiveOrg } from '@/hooks/use-active-org';
import { useOrgStore } from '@/store/org.store';

import {
  getTasks,
  createTask,
  updateTask as updateTaskRequest,
  deleteTask as deleteTaskRequest,
  type Task,
  type CreateTaskInput,
  type UpdateTaskInput,
  type GetTasksFilters,
} from '@/lib/queries/tasks';

import type { Organization } from '@/types';

type SandboxOrgRow = {
  id: string;
  name: string;
  slug: string;
  status?: string | null;
  created_at?: string | null;
};

function mapSandboxOrg(row: SandboxOrgRow): Organization {
  const createdAt = row.created_at ?? new Date().toISOString();

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoUrl: null,
    plan: 'free',

    industryKey: 'creative_design',
    industryLabel: 'Creative & Design',
    subjectLabelKey: 'client',
    subjectSingular: 'Client',
    subjectPlural: 'Clients',

    createdAt,
    updatedAt: createdAt,
  };
}

export function useTasks(filters: GetTasksFilters = {}) {
  const { projectId = null, subjectId = null, status = null } = filters;

  const {
    currentOrg,
    loading: orgLoading,
    error: orgError,
  } = useActiveOrg();

  const setCurrentOrg = useOrgStore((state) => state.setCurrentOrg);
  const setOrgs = useOrgStore((state) => state.setOrgs);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function getResolvedOrg() {
    if (currentOrg?.id) {
      return currentOrg;
    }

    if (process.env.NODE_ENV !== 'production') {
      const sandboxRow = await get<SandboxOrgRow>('/dev/sandbox-org');
      const sandboxOrg = mapSandboxOrg(sandboxRow);

      setOrgs([sandboxOrg]);
      setCurrentOrg(sandboxOrg);

      return sandboxOrg;
    }

    throw new Error('No active organization found.');
  }

  async function loadTasks() {
    if (orgLoading) return;

    try {
      setLoading(true);

      const org = await getResolvedOrg();

      const data = await getTasks(org.id, {
        projectId,
        subjectId,
        status,
      });

      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  async function addTask(input: Omit<CreateTaskInput, 'org_id'>) {
    const org = await getResolvedOrg();

    const task = await createTask({
      ...input,
      org_id: org.id,
    });

    setTasks((prev) => [task, ...prev]);

    return task;
  }

  async function updateTask(id: string, input: Omit<UpdateTaskInput, 'org_id'>) {
    const org = await getResolvedOrg();

    const updatedTask = await updateTaskRequest(id, {
      ...input,
      org_id: org.id,
    });

    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task))
    );

    return updatedTask;
  }

  async function deleteTask(id: string) {
    const org = await getResolvedOrg();

    await deleteTaskRequest(id, org.id);

    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrg?.id, orgLoading, projectId, subjectId, status]);

  return {
    tasks,
    loading: loading || orgLoading,
    orgLoading,
    orgError,
    currentOrg,

    refreshTasks: loadTasks,
    addTask,
    updateTask,
    deleteTask,
  };
}