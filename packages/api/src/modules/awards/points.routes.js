import express from 'express';
import * as pointsController from './points.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Routes protégées pour les points
router.get('/user/:userId/transactions', authenticate, pointsController.getUserPointTransactionsHandler);
router.get('/user/:userId/balance', authenticate, pointsController.getUserBalanceHandler);
router.get('/user/:userId/stats', authenticate, pointsController.getPointStatsHandler);

// Routes pour ajouter/dépenser des points (généralement utilisées par d'autres services)
router.post('/user/:userId/add', authenticate, pointsController.addPointsHandler);
router.post('/user/:userId/spend', authenticate, pointsController.spendPointsHandler);
router.post('/user/:userId/bonus', authenticate, pointsController.addBonusPointsHandler);

export default router;

