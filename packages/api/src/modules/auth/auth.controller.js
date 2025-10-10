import * as authService from './auth.service.js';
import {
  parentSchema,
  loginParentSchema,
  loginChildSchema,
} from 'shared/validators';

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


