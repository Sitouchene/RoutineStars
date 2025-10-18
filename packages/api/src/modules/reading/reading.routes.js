import express from 'express';
import * as readingController from './reading.controller.js';

const router = express.Router();

// Assignment routes
router.post('/assign', readingController.assignReadingHandler);
router.get('/child/:childId', readingController.getChildReadingsHandler);
router.get('/child/:childId/stats', readingController.getReadingStatsHandler);
router.get('/:id', readingController.getReadingAssignmentHandler);
router.put('/:id/progress', readingController.updateProgressHandler);
router.put('/:id/finish', readingController.finishReadingHandler);

export default router;

