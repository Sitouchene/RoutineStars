import { Router } from 'express';
import { authenticate, requireParent, requireChild } from '../../middlewares/auth.middleware.js';
import * as tasksController from './tasks.controller.js';

const router = Router();

// Routes pour les templates de tâches (parents uniquement)
router.use('/templates', authenticate, requireParent);
router.post('/templates', tasksController.createTaskTemplateController);
router.get('/templates', tasksController.getTaskTemplatesController);
router.put('/templates/:id', tasksController.updateTaskTemplateController);
router.delete('/templates/:id', tasksController.deleteTaskTemplateController);

// Routes pour la génération de tâches (parents uniquement)
router.post('/generate-daily/:childId', authenticate, requireParent, tasksController.generateDailyTasksController);

// Routes pour les tâches d'enfant (parents et enfants)
router.get('/child/:childId', authenticate, tasksController.getChildTasksController);

// Autoévaluation (enfants uniquement)
router.post('/:id/self-evaluate', authenticate, requireChild, tasksController.selfEvaluateTaskController);

// Validation (parents uniquement)
router.post('/:id/validate', authenticate, requireParent, tasksController.validateTaskController);

export default router;
