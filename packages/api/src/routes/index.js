import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import childrenRoutes from '../modules/children/children.routes.js';
import tasksRoutes from '../modules/tasks/tasks.routes.js';
import familiesRoutes from '../modules/families/families.routes.js';
import assignmentsRoutes from '../modules/assignments/assignments.routes.js';
import submissionsRoutes from '../modules/submissions/submissions.routes.js';
import statsRoutes from '../modules/stats/stats.routes.js';
import messagesRoutes from '../modules/messages/messages.routes.js';
import evalWindowRoutes from '../modules/evalWindow/evalWindow.routes.js';
import categoriesRoutes from '../modules/categories/categories.routes.js';

const router = Router();

// Routes principales
router.use('/auth', authRoutes);
router.use('/children', childrenRoutes);
router.use('/tasks', tasksRoutes);
router.use('/families', familiesRoutes);
router.use('/assignments', assignmentsRoutes);
router.use('/submissions', submissionsRoutes);
router.use('/stats', statsRoutes);
router.use('/messages', messagesRoutes);
router.use('/eval-window', evalWindowRoutes);
router.use('/categories', categoriesRoutes);

// Route de test
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'RoutineStars API is running!' });
});

export default router;


