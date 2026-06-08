'use client';

import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';

import { getTasks, createTask } from '@/lib/queries/tasks';

import type { Task } from '@/lib/queries/tasks';

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    if (!projectId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getTasks(projectId);

      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addTask(input: Partial<Task>) {
    if (!projectId) return;

    const task = await createTask({
      ...input,
      project_id: projectId,
    });

    return task;
  }

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  // REALTIME SUBSCRIPTIONS
  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel(`tasks:${projectId}`)

      // INSERT
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          const newTask = payload.new as Task;

          setTasks((prev) => {
            const exists = prev.find((t) => t.id === newTask.id);

            if (exists) return prev;

            return [newTask, ...prev];
          });
        }
      )

      // UPDATE
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          const updatedTask = payload.new as Task;

          setTasks((prev) =>
            prev.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          );
        }
      )

      // DELETE
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          const deletedTaskId = payload.old.id;

          setTasks((prev) => prev.filter((task) => task.id !== deletedTaskId));
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  return {
    tasks,
    loading,

    refreshTasks: loadTasks,
    addTask,
  };
}
