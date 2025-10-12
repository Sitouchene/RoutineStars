import { Router } from 'express';
import { authenticate, requireParent } from '../../middlewares/auth.middleware.js';
import * as childrenController from './children.controller.js';

const router = Router();

// Route pour que les enfants puissent mettre à jour leur avatar
router.put('/:id/avatar', authenticate, childrenController.updateChildAvatarController);

// Toutes les autres routes nécessitent authentification parent
router.use(authenticate, requireParent);

router.post('/', childrenController.createChildController);
router.get('/', childrenController.getChildrenController);
router.put('/:id', childrenController.updateChildController);
router.delete('/:id', childrenController.deleteChildController);

export default router;


