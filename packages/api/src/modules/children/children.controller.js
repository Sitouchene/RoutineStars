import * as childrenService from './children.service.js';
import { childSchema } from 'shared/validators';

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


