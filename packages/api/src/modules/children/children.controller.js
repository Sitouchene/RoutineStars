import * as childrenService from './children.service.js';
import { childSchema } from 'shared/validators';
import { z } from 'zod';

/**
 * POST /api/children
 */
export async function createChildController(req, res, next) {
  try {
    const validatedData = childSchema.parse(req.body);
    const child = await childrenService.createChild({
      familyId: req.user.familyId,
      ...validatedData,
    });
    res.status(201).json(child);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/children
 */
export async function getChildrenController(req, res, next) {
  try {
    const children = await childrenService.getChildren(req.user.familyId);
    res.json(children);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/children/:id
 */
export async function updateChildController(req, res, next) {
  try {
    const child = await childrenService.updateChild(
      req.params.id,
      req.user.familyId,
      req.body
    );
    res.json(child);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/children/:id
 */
export async function deleteChildController(req, res, next) {
  try {
    const result = await childrenService.deleteChild(
      req.params.id,
      req.user.familyId
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/children/:id/avatar
 * Permet aux enfants de mettre à jour leur propre avatar
 */
export async function updateChildAvatarController(req, res, next) {
  try {
    const avatarSchema = z.object({
      avatar: z.string().min(1, 'Avatar doit être une chaîne valide'),
    });
    
    const { avatar } = avatarSchema.parse(req.body);
    const childId = req.params.id;
    
    // Debug: afficher les IDs pour comprendre le problème
    console.log('Debug avatar update:', {
      userId: req.user.id,
      childId: childId,
      role: req.user.role,
      familyId: req.user.familyId,
      idsMatch: req.user.id === childId
    });
    
    // Vérifier que l'enfant peut mettre à jour son avatar
    if (req.user.role === 'child' && req.user.id !== childId) {
      console.log('Access denied: child trying to update different child avatar');
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    
    const child = await childrenService.updateChildAvatar(childId, req.user.familyId, avatar);
    res.json(child);
  } catch (error) {
    next(error);
  }
}


