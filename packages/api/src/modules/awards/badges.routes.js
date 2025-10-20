import express from 'express';
import * as badgesController from './badges.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Routes publiques pour les badges globaux
router.get('/global', badgesController.getAllGlobalBadgesHandler);

// Routes protégées pour les badges de groupe
router.get('/group/:groupId', authenticate, badgesController.getGroupBadgesHandler);
router.post('/group/:groupId/import', authenticate, badgesController.importGlobalBadgeHandler);
router.post('/group/:groupId/custom', authenticate, badgesController.createCustomBadgeHandler);
router.put('/group/:badgeId', authenticate, badgesController.updateGroupBadgeHandler);
router.patch('/group/:badgeId/toggle', authenticate, badgesController.toggleGroupBadgeHandler);

// Routes protégées pour les badges utilisateur
router.get('/user/:userId', authenticate, badgesController.getUserBadgesHandler);
router.post('/user/:userId/unlock/:badgeId', authenticate, badgesController.unlockBadgeManuallyHandler);
router.post('/user/:userId/check-unlock', authenticate, badgesController.checkAndUnlockBadgesHandler);
router.get('/user/:userId/stats', authenticate, badgesController.getBadgeStatsHandler);

export default router;

