'use client';

import { useEffect, useState } from 'react';

import { getProjects, createProject } from '@/lib/queries/projects';

import { useCurrentOrg } from '@/store/org-store';

import type { Project } from '@/lib/queries/projects';

export function useProjects() {
  const currentOrg = useCurrentOrg();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    if (!currentOrg?.id) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getProjects(currentOrg.id);

      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addProject(input: Partial<Project>) {
    if (!currentOrg?.id) return;

    const project = await createProject({
      ...input,
      org_id: currentOrg.id,
    });

    setProjects((prev) => [project, ...prev]);

    return project;
  }

  useEffect(() => {
    loadProjects();
  }, [currentOrg?.id]);

  return {
    projects,
    loading,

    refreshProjects: loadProjects,
    addProject,
  };
}