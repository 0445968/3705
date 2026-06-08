'use client';

import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';

export type Comment = {
  id: string;

  task_id: string;

  user_id?: string | null;

  body: string;

  created_at: string;
  updated_at: string;
};

export function useComments(taskId?: string) {
  const [comments, setComments] = useState<Comment[]>([]);

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

      if (error) {
        throw error;
      }

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

    if (error) {
      throw error;
    }

    return data as Comment;
  }

  async function updateComment(id: string, body: string) {
    const { data, error } = await supabase
      .from('task_comments')
      .update({
        body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    setComments((prev) =>
      prev.map((comment) => (comment.id === id ? (data as Comment) : comment))
    );

    return data as Comment;
  }

  async function deleteComment(id: string) {
    const { error } = await supabase
      .from('task_comments')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    setComments((prev) => prev.filter((comment) => comment.id !== id));
  }

  useEffect(() => {
    loadComments();
  }, [taskId]);

  // realtime
  useEffect(() => {
    if (!taskId) return;

    const channel = supabase
      .channel(`comments:${taskId}`)

      // INSERT
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'task_comments',
          filter: `task_id=eq.${taskId}`,
        },
        (payload) => {
          const comment = payload.new as Comment;

          setComments((prev) => {
            const exists = prev.find((c) => c.id === comment.id);

            if (exists) return prev;

            return [...prev, comment];
          });
        }
      )

      // UPDATE
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'task_comments',
          filter: `task_id=eq.${taskId}`,
        },
        (payload) => {
          const updatedComment = payload.new as Comment;

          setComments((prev) =>
            prev.map((comment) =>
              comment.id === updatedComment.id ? updatedComment : comment
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
          table: 'task_comments',
          filter: `task_id=eq.${taskId}`,
        },
        (payload) => {
          const deletedId = payload.old.id;

          setComments((prev) =>
            prev.filter((comment) => comment.id !== deletedId)
          );
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
    updateComment,
    deleteComment,
  };
}
