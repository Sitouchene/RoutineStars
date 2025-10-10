import * as familiesService from './families.service.js';

/**
 * GET /api/families/:familyId/children
 * Endpoint public pour récupérer les enfants d'une famille
 */
export async function getFamilyChildrenController(req, res, next) {
  try {
    const children = await familiesService.getFamilyChildren(req.params.familyId);
    res.json(children);
  } catch (error) {
    next(error);
  }
}
