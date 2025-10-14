import { Router } from 'express';
import { authenticate, requireParentOrTeacher } from '../../middlewares/auth.middleware.js';
import * as assignmentsController from './assignments.controller.js';

const router = Router();

// Routes pour les assignations (parents et enseignants uniquement)
router.use(authenticate, requireParentOrTeacher);

router.post('/', assignmentsController.createAssignmentController);
router.get('/', assignmentsController.getGroupAssignmentsController);
router.get('/child/:childId', assignmentsController.getChildAssignmentsController);
router.put('/:id', assignmentsController.updateAssignmentController);
router.delete('/:id', assignmentsController.deleteAssignmentController);

// Génération de tâches quotidiennes (parents et enfants)
router.post('/generate-daily/:childId', authenticate, assignmentsController.generateDailyTasksController);

export default router;
