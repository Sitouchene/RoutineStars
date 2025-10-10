import { Router } from 'express';
import * as familiesController from './families.controller.js';

const router = Router();

// Route publique pour récupérer les enfants d'une famille (pour la connexion enfant)
router.get('/:familyId/children', familiesController.getFamilyChildrenController);

export default router;
