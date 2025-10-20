import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import childrenRoutes from '../modules/children/children.routes.js';
import tasksRoutes from '../modules/tasks/tasks.routes.js';
import groupsRoutes from '../modules/groups/groups.routes.js';
import assignmentsRoutes from '../modules/assignments/assignments.routes.js';
import submissionsRoutes from '../modules/submissions/submissions.routes.js';
import statsRoutes from '../modules/stats/stats.routes.js';
import messagesRoutes from '../modules/messages/messages.routes.js';
import evalWindowRoutes from '../modules/evalWindow/evalWindow.routes.js';
import categoriesRoutes from '../modules/categories/categories.routes.js';
import booksRoutes from '../modules/books/books.routes.js';
import publicBooksRoutes from '../modules/books/public-books.routes.js';
import bookTemplatesRoutes from '../modules/books/book-templates.routes.js';
import readingRoutes from '../modules/reading/reading.routes.js';
import reviewsRoutes from '../modules/reading/reviews.routes.js';
import badgesRoutes from '../modules/awards/badges.routes.js';
import rewardsRoutes from '../modules/awards/rewards.routes.js';
import pointsRoutes from '../modules/awards/points.routes.js';
import quizRoutes from '../modules/quiz/quiz.routes.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Routes principales
router.use('/auth', authRoutes);
router.use('/children', childrenRoutes);
router.use('/tasks', tasksRoutes);
router.use('/groups', groupsRoutes);
router.use('/assignments', assignmentsRoutes);
router.use('/submissions', submissionsRoutes);
router.use('/stats', statsRoutes);
router.use('/messages', messagesRoutes);
router.use('/eval-window', evalWindowRoutes);
router.use('/categories', categoriesRoutes);
router.use('/books', publicBooksRoutes);
router.use('/books', authenticate, booksRoutes);
router.use('/books', bookTemplatesRoutes);
router.use('/reading', authenticate, readingRoutes);
router.use('/reading', authenticate, reviewsRoutes);
router.use('/badges', badgesRoutes);
router.use('/rewards', rewardsRoutes);
router.use('/points', pointsRoutes);
router.use('/quiz', quizRoutes);

// Route de test
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'RoutineStars API is running!' });
});

export default router;


