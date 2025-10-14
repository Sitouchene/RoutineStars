import * as groupsService from './groups.service.js';
import { z } from 'zod';

// Schémas de validation
const createGroupSchema = z.object({
  type: z.enum(['family', 'classroom']),
  name: z.string().min(1, 'Le nom est requis'),
  language: z.enum(['fr', 'en', 'ar']).optional(),
});

const updateGroupSchema = z.object({
  name: z.string().min(1).optional(),
  language: z.enum(['fr', 'en', 'ar']).optional(),
  country: z.string().optional(),
});

const groupCodeSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
});

/**
 * POST /api/groups
 */
export async function createGroupController(req, res, next) {
  try {
    const validatedData = createGroupSchema.parse(req.body);
    const group = await groupsService.createGroup(validatedData);
    res.status(201).json(group);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/groups/:id
 */
export async function getGroupController(req, res, next) {
  try {
    const group = await groupsService.getGroupById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Groupe non trouvé' });
    }
    res.json(group);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/groups/code/:code
 */
export async function getGroupByCodeController(req, res, next) {
  try {
    const group = await groupsService.getGroupByCode(req.params.code);
    if (!group) {
      return res.status(404).json({ error: 'Code de groupe invalide' });
    }
    res.json(group);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/groups/:id/children
 */
export async function getGroupChildrenController(req, res, next) {
  try {
    const { type } = req.query;
    const children = await groupsService.getGroupChildren(req.params.id, type);
    res.json(children);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/groups/:id
 */
export async function updateGroupController(req, res, next) {
  try {
    const validatedData = updateGroupSchema.parse(req.body);
    const group = await groupsService.updateGroup(req.params.id, validatedData);
    res.json(group);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/groups/:id
 */
export async function deleteGroupController(req, res, next) {
  try {
    const result = await groupsService.deleteGroup(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/groups/:id/regenerate-code
 */
export async function regenerateGroupCodeController(req, res, next) {
  try {
    const group = await groupsService.regenerateGroupCode(req.params.id);
    res.json(group);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/groups/check-code
 */
export async function checkGroupCodeController(req, res, next) {
  try {
    const { code } = groupCodeSchema.parse(req.body);
    const isAvailable = await groupsService.isGroupCodeAvailable(code);
    res.json({ available: isAvailable });
  } catch (error) {
    next(error);
  }
}
