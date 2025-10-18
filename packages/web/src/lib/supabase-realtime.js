import { createClient } from '@supabase/supabase-js';

// Configuration Supabase avec realtime activé
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasRealtimeConfig = Boolean(supabaseUrl && supabaseKey);

export const supabase = hasRealtimeConfig
  ? createClient(supabaseUrl, supabaseKey, {
      realtime: {
        params: {
          eventsPerSecond: 10, // Limiter le nombre d'événements par seconde
        },
      },
    })
  : null;

if (!hasRealtimeConfig) {
  // Affiche un warning une seule fois en dev si la config manque
  // Évite de casser l'app: les hooks vérifieront la présence du client
  console.warn('[Realtime] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY non configurés. Le temps réel est désactivé.');
}

export const isRealtimeConfigured = hasRealtimeConfig;

// Types pour les événements realtime
export const REALTIME_EVENTS = {
  TASK_UPDATED: 'task_updated',
  TASK_INSERTED: 'task_inserted',
  SUBMISSION_UPDATED: 'submission_updated',
  SUBMISSION_INSERTED: 'submission_inserted',
};

// Types pour les tables
export const REALTIME_TABLES = {
  TASKS: 'tasks',
  DAY_SUBMISSIONS: 'day_submissions',
};
