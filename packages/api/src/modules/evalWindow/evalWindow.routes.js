import { Router } from 'express';
import { getWindowController, upsertWindowController } from './evalWindow.controller.js';
import { authenticate, requireParent } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

// GET pour lecture (parent ou enfant)
router.get('/', getWindowController);
// Modification réservée au parent
router.put('/', requireParent, upsertWindowController);

export default router;


