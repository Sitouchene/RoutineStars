// [DEPRECATED] Anciennes constantes de catégories conservées pour compatibilité UI
// Préférez utiliser l'objet Category (DB) et `categoryId` sur les templates
export const TASK_CATEGORIES = {
  ROUTINE: 'routine',
  MAISON: 'maison',
  ETUDES: 'etudes',
};

export const TASK_ICONS = {
  [TASK_CATEGORIES.ROUTINE]: '🌅',
  [TASK_CATEGORIES.MAISON]: '🏠',
  [TASK_CATEGORIES.ETUDES]: '📚',
};

/**
 * Rôles utilisateurs
 */
export const USER_ROLES = {
  PARENT: 'parent',
  CHILD: 'child',
};

/**
 * Statuts des tâches
 */
export const TASK_STATUS = {
  ASSIGNED: 'assigned', // 🟨 Attribuée
  SELF_EVALUATED: 'self_evaluated', // 🟦 Autoévaluée
  SUBMITTED: 'submitted', // 🟪 Journée soumise (verrou côté enfant)
  VALIDATED: 'validated', // 🟩 Validée par parent
};

/**
 * Récurrence des tâches
 */
export const TASK_RECURRENCE = {
  DAILY: 'daily',
  WEEKDAY: 'weekday',
  WEEKEND: 'weekend',
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
  // Nouvelles récurrences avancées
  WEEKLY_DAYS: 'weekly_days', // ex: [1,3] pour lundi+mercredi
  EVERY_N_DAYS: 'every_n_days', // ex: startDate+interval N
};

// Jours de la semaine (0=dimanche ... 6=samedi) pour aider l'UI à construire WEEKLY_DAYS
export const WEEK_DAYS = [
  { value: 0, key: 'sunday', label: 'Dimanche' },
  { value: 1, key: 'monday', label: 'Lundi' },
  { value: 2, key: 'tuesday', label: 'Mardi' },
  { value: 3, key: 'wednesday', label: 'Mercredi' },
  { value: 4, key: 'thursday', label: 'Jeudi' },
  { value: 5, key: 'friday', label: 'Vendredi' },
  { value: 6, key: 'saturday', label: 'Samedi' },
];

/**
 * Niveaux d'évaluation (0-100%)
 */
export const EVALUATION_LEVELS = {
  NOT_DONE: 0,
  PARTIALLY_DONE: 50,
  FULLY_DONE: 100,
};

/**
 * Couleurs pour le code couleur visuel
 */
export const PROGRESS_COLORS = {
  RED: { min: 0, max: 25, color: '#ef4444' },
  ORANGE: { min: 26, max: 50, color: '#f97316' },
  YELLOW: { min: 51, max: 75, color: '#eab308' },
  GREEN: { min: 76, max: 100, color: '#22c55e' },
};


