import { Router } from 'express';
import { authenticate, requireParentOrTeacher, requireChildOrStudent } from '../../middlewares/auth.middleware.js';
import * as submissionsController from './submissions.controller.js';

const router = Router();

// Routes pour les enfants et élèves
router.post('/submit', authenticate, requireChildOrStudent, submissionsController.submitDayController);
router.get('/child', authenticate, requireChildOrStudent, submissionsController.getChildSubmissionsController);

// Routes pour les parents et enseignants
router.get('/group', authenticate, requireParentOrTeacher, submissionsController.getGroupSubmissionsController);
router.post('/:id/validate', authenticate, requireParentOrTeacher, submissionsController.validateSubmissionController);
router.get('/:id/details', authenticate, requireParentOrTeacher, submissionsController.getSubmissionDetailsController);

export default router;
