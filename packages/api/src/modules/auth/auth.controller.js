import * as authService from './auth.service.js';
import {
  parentSchema,
  loginParentSchema,
  loginChildSchema,
} from 'shared/validators';
import { z } from 'zod';

// Schémas pour les nouvelles routes
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  groupId: z.string().uuid().nullable().optional(),
  role: z.enum(['parent', 'teacher']),
  language: z.enum(['fr', 'en', 'ar']).optional().default('fr'),
  country: z.enum(['CA', 'DZ', 'FR', 'BE', 'CH']).optional().default('CA'),
  grade: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * POST /api/auth/parent/register
 */
export async function registerParentController(req, res, next) {
  try {
    const validatedData = parentSchema.parse(req.body);
    const result = await authService.registerParent(validatedData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/parent/login
 */
export async function loginParentController(req, res, next) {
  try {
    const validatedData = loginParentSchema.parse(req.body);
    const result = await authService.loginParent(validatedData);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/child/login
 */
export async function loginChildController(req, res, next) {
  try {
    const validatedData = loginChildSchema.parse(req.body);
    const result = await authService.loginChild(validatedData);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/register
 */
export async function registerController(req, res, next) {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.registerUser(validatedData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 */
export async function loginController(req, res, next) {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.loginUser(validatedData);
    res.json(result);
  } catch (error) {
    next(error);
  }
}


