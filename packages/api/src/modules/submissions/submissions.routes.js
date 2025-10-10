import { Router } from 'express';
import { authenticate, requireParent, requireChild } from '../../middlewares/auth.middleware.js';
import * as submissionsController from './submissions.controller.js';

const router = Router();

// Routes pour les enfants
router.post('/submit', authenticate, requireChild, submissionsController.submitDayController);
router.get('/child', authenticate, requireChild, submissionsController.getChildSubmissionsController);

// Routes pour les parents
router.get('/family', authenticate, requireParent, submissionsController.getFamilySubmissionsController);
router.post('/:id/validate', authenticate, requireParent, submissionsController.validateSubmissionController);
router.get('/:id/details', authenticate, requireParent, submissionsController.getSubmissionDetailsController);

export default router;
