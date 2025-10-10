import { Router } from 'express';
import { authenticate, requireParent, requireChild } from '../../middlewares/auth.middleware.js';
import * as assignmentsController from './assignments.controller.js';

const router = Router();

// Routes pour les assignations (parents uniquement)
router.use(authenticate, requireParent);

router.post('/', assignmentsController.createAssignmentController);
router.get('/', assignmentsController.getFamilyAssignmentsController);
router.get('/child/:childId', assignmentsController.getChildAssignmentsController);
router.put('/:id', assignmentsController.updateAssignmentController);
router.delete('/:id', assignmentsController.deleteAssignmentController);

// Génération de tâches quotidiennes (parents et enfants)
router.post('/generate-daily/:childId', authenticate, assignmentsController.generateDailyTasksController);

export default router;
