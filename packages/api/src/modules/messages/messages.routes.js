import { Router } from 'express';
import {
  listMessagesController,
  getMessageForDateController,
  createMessageController,
  updateMessageController,
  deleteMessageController,
} from './messages.controller.js';
import { authenticate, requireParent } from '../../middlewares/auth.middleware.js';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// GET accessibles aux parents et enfants (lecture)
router.get('/', listMessagesController);
router.get('/by-date', getMessageForDateController);

// Mutations réservées aux parents
router.post('/', requireParent, createMessageController);
router.put('/:id', requireParent, updateMessageController);
router.delete('/:id', requireParent, deleteMessageController);

export default router;


