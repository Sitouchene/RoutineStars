import { z } from 'zod';
import {
  TASK_RECURRENCE,
  USER_ROLES,
} from '../constants/index.js';

/**
 * Validation de création d'une tâche template
 */
export const taskTemplateSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(100),
  categoryId: z.string().uuid('Catégorie invalide'),
  icon: z.string().optional(),
  points: z.number().int().min(1).max(100).default(5),
  // Laisser libre pour permettre des valeurs évolutives côté backend.
  // Les paramètres de récurrence détaillés sont désormais au niveau des assignations.
  recurrence: z.string().min(1, 'La récurrence est requise'),
  description: z.string().max(500).optional(),
});

/**
 * Validation d'autoévaluation
 */
export const selfEvaluationSchema = z.object({
  taskId: z.string().uuid(),
  score: z.number().int().min(0).max(100),
});

/**
 * Validation de validation parent
 */
export const parentValidationSchema = z.object({
  taskId: z.string().uuid(),
  score: z.number().int().min(0).max(100),
  comment: z.string().max(500).optional(),
});

/**
 * Validation de création d'enfant
 */
export const childSchema = z.object({
  name: z.string().min(1, 'Le prénom est requis').max(50),
  age: z.number().int().min(3).max(18),
  avatar: z.string().url().optional(),
  pin: z.string().length(4).regex(/^\d{4}$/, 'Le PIN doit être 4 chiffres'),
});

/**
 * Validation de création de parent
 */
export const parentSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  name: z.string().min(1).max(50),
});

/**
 * Validation de login parent
 */
export const loginParentSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

/**
 * Validation de login enfant
 */
export const loginChildSchema = z.object({
  childId: z.string().uuid(),
  pin: z.string().length(4).regex(/^\d{4}$/),
});

/**
 * Validation d'assignation de tâche
 */
export const taskAssignmentSchema = z.object({
  taskTemplateId: z.string().uuid(),
  childId: z.string().uuid(),
  startDate: z.string().datetime('Format de date invalide'),
  endDate: z.string().datetime('Format de date invalide').optional(),
  isActive: z.boolean().default(true),
  // Options de récurrence spécifiques à l'assignation (facultatives)
  recurrence: z.string().optional(),
  recurrenceDays: z.array(z.number().min(0).max(6)).optional(),
  recurrenceStartDate: z.string().datetime('Date de départ invalide').optional(),
  recurrenceInterval: z.number().int().min(1).optional(),
}).superRefine((data, ctx) => {
  if (data.recurrence === 'weekly_days') {
    if (!data.recurrenceDays || data.recurrenceDays.length === 0) {
      ctx.addIssue({
        path: ['recurrenceDays'],
        code: z.ZodIssueCode.custom,
        message: 'Sélectionnez au moins un jour (weekly_days)',
      });
    }
  }
  if (data.recurrence === 'every_n_days') {
    if (!data.recurrenceStartDate) {
      ctx.addIssue({
        path: ['recurrenceStartDate'],
        code: z.ZodIssueCode.custom,
        message: 'La date de départ est requise (every_n_days)',
      });
    }
    if (!data.recurrenceInterval || data.recurrenceInterval < 1) {
      ctx.addIssue({
        path: ['recurrenceInterval'],
        code: z.ZodIssueCode.custom,
        message: "Intervalle (jours) ≥ 1 requis (every_n_days)",
      });
    }
  }
});

/**
 * Validation d'inscription parent
 */
export const registerSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(50),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

/**
 * Validation de login
 */
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

/**
 * Validation d'autoévaluation
 */
export const selfEvaluateSchema = z.object({
  score: z.number().int().min(0).max(100),
});

/**
 * Validation de tâche
 */
export const validateTaskSchema = z.object({
  score: z.number().int().min(0).max(100),
  comment: z.string().max(500).optional(),
});

