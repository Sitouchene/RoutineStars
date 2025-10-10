/**
 * Catégories de tâches
 */
export const TASK_CATEGORIES = {
  ROUTINE: 'routine',
  MAISON: 'maison',
  ETUDES: 'etudes',
};

/**
 * Icônes pour chaque catégorie
 */
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
};

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


