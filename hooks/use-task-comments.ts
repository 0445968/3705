'use client';

import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';

export type TaskComment = {
  id: string;
  task_id: string;

  user_id?: string | null;

  body: string;

  created_at: string;
  updated_at: string;
};

export function useTaskComments(taskId?: string) {
  const [comments, setComments] = useState<TaskComment[]>([]);

  const [loading, setLoading] = useState(true);

  async function loadComments() {
    if (!taskId) {
      setComments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('task_comments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', {
          ascending: true,
        });

      if (error) throw error;

      setComments(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addComment(body: string) {
    if (!taskId) return;

    const { data, error } = await supabase
      .from('task_comments')
      .insert({
        task_id: taskId,
        body,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  useEffect(() => {
    loadComments();
  }, [taskId]);

  // realtime
  useEffect(() => {
    if (!taskId) return;

    const channel = supabase
      .channel(`task-comments:${taskId}`)

      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'task_comments',
          filter: `task_id=eq.${taskId}`,
        },
        (payload) => {
          const comment = payload.new as TaskComment;

          setComments((prev) => [...prev, comment]);
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId]);

  return {
    comments,
    loading,

    refreshComments: loadComments,
    addComment,
  };
}
