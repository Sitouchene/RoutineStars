import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import {
  getBookQuizzes,
  getTriggeredQuiz,
  submitQuiz,
  getUserAttempts,
  getUserStats,
  getAvailableQuizzes
} from './quiz.controller.js';

const router = Router();

// Routes publiques
router.get('/book/:bookId', getBookQuizzes);
router.get('/book/:bookId/trigger/:currentPage', getTriggeredQuiz);

// Routes authentifiées
router.post('/attempt', authenticate, submitQuiz);
router.get('/user/:userId/attempts/:quizId?', authenticate, getUserAttempts);
router.get('/user/:userId/stats', authenticate, getUserStats);
router.get('/user/:userId/available', authenticate, getAvailableQuizzes);

export default router;

