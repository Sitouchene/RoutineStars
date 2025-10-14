import { Router } from 'express';
import { authenticate, requireParentOrTeacher, requireChildOrStudent } from '../../middlewares/auth.middleware.js';
import * as tasksController from './tasks.controller.js';

const router = Router();

// Routes pour les templates de tâches (parents et enseignants uniquement)
router.use('/templates', authenticate, requireParentOrTeacher);
router.post('/templates', tasksController.createTaskTemplateController);
router.get('/templates', tasksController.getTaskTemplatesController);
router.put('/templates/:id', tasksController.updateTaskTemplateController);
router.delete('/templates/:id', tasksController.deleteTaskTemplateController);

// Routes pour la génération de tâches (parents et enseignants uniquement)
router.post('/generate-daily/:childId', authenticate, requireParentOrTeacher, tasksController.generateDailyTasksController);

// Routes pour les tâches d'enfant (parents, enseignants, enfants et élèves)
router.get('/child/:childId', authenticate, tasksController.getChildTasksController);

// Autoévaluation (enfants et élèves uniquement)
router.post('/:id/self-evaluate', authenticate, requireChildOrStudent, tasksController.selfEvaluateTaskController);

// Validation (parents et enseignants uniquement)
router.post('/:id/validate', authenticate, requireParentOrTeacher, tasksController.validateTaskController);

export default router;
