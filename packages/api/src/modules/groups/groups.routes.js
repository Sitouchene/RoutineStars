import express from 'express';
import {
  createGroupController,
  getGroupController,
  getGroupByCodeController,
  getGroupChildrenController,
  updateGroupController,
  deleteGroupController,
  regenerateGroupCodeController,
  checkGroupCodeController,
} from './groups.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Routes protégées (nécessitent une authentification)
router.post('/', authenticate, createGroupController);
router.get('/:id', authenticate, getGroupController);
router.put('/:id', authenticate, updateGroupController);
router.delete('/:id', authenticate, deleteGroupController);
router.post('/:id/regenerate-code', authenticate, regenerateGroupCodeController);

// Routes publiques (pour la connexion enfant/élève)
router.get('/code/:code', getGroupByCodeController);
router.get('/:id/children', getGroupChildrenController);

// Route pour vérifier la disponibilité d'un code
router.post('/check-code', checkGroupCodeController);

export default router;
