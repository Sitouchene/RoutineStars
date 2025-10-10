import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine les classes Tailwind
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formater une date
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Obtenir la couleur selon le score
 */
export function getScoreColor(score) {
  if (score >= 76) return 'text-green-600';
  if (score >= 51) return 'text-yellow-600';
  if (score >= 26) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Obtenir la couleur de fond selon le score
 */
export function getScoreBgColor(score) {
  if (score >= 76) return 'bg-green-100';
  if (score >= 51) return 'bg-yellow-100';
  if (score >= 26) return 'bg-orange-100';
  return 'bg-red-100';
}


