import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import {
  getCategoriesController,
  getCommonCategoriesController,
  getGroupCategoriesController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  toggleCategoryStatusController
} from './categories.controller.js';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// GET /api/categories - Récupérer toutes les catégories disponibles (communes + famille)
router.get('/', getCategoriesController);

// GET /api/categories/common - Récupérer uniquement les catégories communes
router.get('/common', getCommonCategoriesController);

// GET /api/categories/group - Récupérer uniquement les catégories du groupe
router.get('/group', getGroupCategoriesController);

// POST /api/categories - Créer une nouvelle catégorie
router.post('/', createCategoryController);

// PUT /api/categories/:id - Mettre à jour une catégorie
router.put('/:id', updateCategoryController);

// DELETE /api/categories/:id - Supprimer une catégorie
router.delete('/:id', deleteCategoryController);

// PATCH /api/categories/:id/toggle - Activer/Désactiver une catégorie
router.patch('/:id/toggle', toggleCategoryStatusController);

export default router;
