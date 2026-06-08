'use client';

import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';

import { useCurrentOrg } from '@/store/org-store';

export type ActivityLog = {
  id: string;

  org_id: string;

  user_id?: string | null;

  action: string;

  entity_type?: string | null;
  entity_id?: string | null;

  metadata?: any;

  created_at: string;
};

export function useActivity() {
  const currentOrg = useCurrentOrg();

  const [activities, setActivities] = useState<ActivityLog[]>([]);

  const [loading, setLoading] = useState(true);

  async function loadActivities() {
    if (!currentOrg?.id) {
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('org_id', currentOrg.id)
        .order('created_at', {
          ascending: false,
        })
        .limit(100);

      if (error) throw error;

      setActivities(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivities();
  }, [currentOrg?.id]);

  // realtime
  useEffect(() => {
    if (!currentOrg?.id) return;

    const channel = supabase
      .channel(`activity:${currentOrg.id}`)

      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_logs',
          filter: `org_id=eq.${currentOrg.id}`,
        },
        (payload) => {
          const activity = payload.new as ActivityLog;

          setActivities((prev) => [activity, ...prev]);
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentOrg?.id]);

  return {
    activities,
    loading,

    refreshActivities: loadActivities,
  };
}
