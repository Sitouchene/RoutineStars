import { Router } from 'express';
import { authenticate, requireParent, requireChild } from '../../middlewares/auth.middleware.js';
import * as statsController from './stats.controller.js';

const router = Router();

// Routes pour les parents (accès à tous les enfants de la famille)
router.get('/child/:childId/daily/:date', authenticate, statsController.getChildDailyStatsController);
router.get('/child/:childId/weekly/:startDate', authenticate, statsController.getChildWeeklyStatsController);
router.get('/child/:childId/monthly/:year/:month', authenticate, statsController.getChildMonthlyStatsController);

// Route pour les statistiques familiales
router.get('/family/:startDate/:endDate', authenticate, requireParent, statsController.getFamilyStatsController);

export default router;
