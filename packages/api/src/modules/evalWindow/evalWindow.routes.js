import { Router } from 'express';
import { getWindowController, upsertWindowController } from './evalWindow.controller.js';
import { authenticate, requireParentOrTeacher } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

// GET pour lecture (tous les utilisateurs authentifiés)
router.get('/', getWindowController);
// Modification réservée aux parents et enseignants
router.put('/', requireParentOrTeacher, upsertWindowController);

export default router;


