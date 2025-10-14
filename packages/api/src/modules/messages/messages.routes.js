import { Router } from 'express';
import {
  listMessagesController,
  getMessageForDateController,
  createMessageController,
  updateMessageController,
  deleteMessageController,
} from './messages.controller.js';
import { authenticate, requireParentOrTeacher } from '../../middlewares/auth.middleware.js';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// GET accessibles à tous (lecture)
router.get('/', listMessagesController);
router.get('/by-date', getMessageForDateController);

// Mutations réservées aux parents et enseignants
router.post('/', requireParentOrTeacher, createMessageController);
router.put('/:id', requireParentOrTeacher, updateMessageController);
router.delete('/:id', requireParentOrTeacher, deleteMessageController);

export default router;


