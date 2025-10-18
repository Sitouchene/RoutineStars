import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, isRealtimeConfigured, REALTIME_TABLES, REALTIME_EVENTS } from '../lib/supabase-realtime';
import { useAuthStore } from '../stores/authStore';

/**
 * Hook pour écouter les changements realtime des tâches
 * @param {string} childId - ID de l'enfant
 * @param {string} date - Date des tâches (YYYY-MM-DD)
 */
export function useTasksRealtime(childId, date) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const subscriptionRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isRealtimeConfigured || !supabase) return;
    if (!childId || !date || !user?.groupId) return;

    console.log('🔴 Starting tasks realtime subscription for:', { childId, date });

    // Créer la subscription
    subscriptionRef.current = supabase
      .channel(`tasks-${childId}-${date}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: REALTIME_TABLES.TASKS,
          filter: `userId=eq.${childId}`,
        },
        (payload) => {
          console.log('📡 Tasks realtime event:', payload);
          
          // Invalider et refetch les tâches de l'enfant
          queryClient.invalidateQueries({ 
            queryKey: ['childTasks', childId, date] 
          });
          
          // Invalider aussi les statistiques si nécessaire
          queryClient.invalidateQueries({ 
            queryKey: ['dailyStats', childId, date] 
          });

          // Notification optionnelle
          if (payload.eventType === 'UPDATE' && payload.new.selfScore !== payload.old.selfScore) {
            console.log('🎯 Task score updated:', {
              taskId: payload.new.id,
              oldScore: payload.old.selfScore,
              newScore: payload.new.selfScore
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Tasks subscription status:', status);
        setConnected(status === 'SUBSCRIBED');
      });

    // Cleanup
    return () => {
      if (subscriptionRef.current && supabase) {
        console.log('🔴 Stopping tasks realtime subscription');
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
        setConnected(false);
      }
    };
  }, [childId, date, user?.groupId, queryClient]);

  return {
    isConnected: connected,
  };
}

/**
 * Hook pour écouter les changements realtime des soumissions
 * @param {string} childId - ID de l'enfant
 */
export function useSubmissionsRealtime(childId) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const subscriptionRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isRealtimeConfigured || !supabase) return;
    if (!childId || !user?.groupId) return;

    console.log('🔴 Starting submissions realtime subscription for:', { childId });

    // Créer la subscription
    subscriptionRef.current = supabase
      .channel(`submissions-${childId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: REALTIME_TABLES.DAY_SUBMISSIONS,
          filter: `childId=eq.${childId}`,
        },
        (payload) => {
          console.log('📡 Submissions realtime event:', payload);
          
          // Invalider les soumissions de l'enfant
          queryClient.invalidateQueries({ 
            queryKey: ['childSubmissions', childId] 
          });
          
          // Invalider les soumissions du groupe (pour les parents)
          queryClient.invalidateQueries({ 
            queryKey: ['familySubmissions', user.groupId] 
          });

          // Notification pour les parents
          if (payload.eventType === 'INSERT') {
            console.log('📝 New submission created:', payload.new);
            // Ici on pourrait ajouter une notification toast
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Submissions subscription status:', status);
        setConnected(status === 'SUBSCRIBED');
      });

    // Cleanup
    return () => {
      if (subscriptionRef.current && supabase) {
        console.log('🔴 Stopping submissions realtime subscription');
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
        setConnected(false);
      }
    };
  }, [childId, user?.groupId, queryClient]);

  return {
    isConnected: connected,
  };
}
