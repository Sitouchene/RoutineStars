import { Router } from 'express';
import { authenticate, requireParent } from '../../middlewares/auth.middleware.js';
import * as childrenController from './children.controller.js';

const router = Router();

// Toutes les routes nécessitent authentification parent
router.use(authenticate, requireParent);

router.post('/', childrenController.createChildController);
router.get('/', childrenController.getChildrenController);
router.put('/:id', childrenController.updateChildController);
router.delete('/:id', childrenController.deleteChildController);

export default router;


