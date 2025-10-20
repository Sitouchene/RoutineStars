import express from 'express';
import * as rewardsController from './rewards.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Routes publiques pour les récompenses globales
router.get('/global', rewardsController.getAllGlobalRewardsHandler);
router.get('/global/category/:category', rewardsController.getGlobalRewardsByCategoryHandler);

// Routes protégées pour les récompenses de groupe
router.get('/group/:groupId', authenticate, rewardsController.getGroupRewardsHandler);
router.post('/group/:groupId/import', authenticate, rewardsController.importGlobalRewardHandler);
router.post('/group/:groupId/custom', authenticate, rewardsController.createCustomRewardHandler);
router.put('/group/:rewardId', authenticate, rewardsController.updateGroupRewardHandler);
router.patch('/group/:rewardId/toggle', authenticate, rewardsController.toggleGroupRewardHandler);

// Routes protégées pour les échanges utilisateur
router.get('/user/:userId/redemptions', authenticate, rewardsController.getUserRedemptionsHandler);
router.post('/user/:userId/redeem', authenticate, rewardsController.redeemRewardHandler);
router.get('/user/:userId/stats', authenticate, rewardsController.getRewardStatsHandler);

// Routes pour les parents (gestion des échanges)
router.get('/group/:groupId/pending', authenticate, rewardsController.getPendingRedemptionsHandler);
router.put('/redemption/:redemptionId/status', authenticate, rewardsController.updateRedemptionStatusHandler);

export default router;

