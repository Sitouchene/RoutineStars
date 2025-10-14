import { Router } from 'express';
import { authenticate, requireParentOrTeacher } from '../../middlewares/auth.middleware.js';
import * as statsController from './stats.controller.js';

const router = Router();

// Routes pour les parents et enseignants (accès à tous les enfants/élèves du groupe)
router.get('/child/:childId/daily/:date', authenticate, statsController.getChildDailyStatsController);
router.get('/child/:childId/weekly/:startDate', authenticate, statsController.getChildWeeklyStatsController);
router.get('/child/:childId/monthly/:year/:month', authenticate, statsController.getChildMonthlyStatsController);

// Route pour les statistiques du groupe (famille ou classe)
router.get('/group/:startDate/:endDate', authenticate, requireParentOrTeacher, statsController.getGroupStatsController);

export default router;
