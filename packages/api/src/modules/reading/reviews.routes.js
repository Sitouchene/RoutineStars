import express from 'express';
import * as reviewsController from './reviews.controller.js';

const router = express.Router();

// Reviews
router.post('/reviews', reviewsController.createReviewHandler);
router.put('/reviews/:id', reviewsController.updateReviewHandler);
router.delete('/reviews/:id', reviewsController.deleteReviewHandler);
router.get('/books/:bookId/reviews', reviewsController.getBookReviewsHandler);
router.get('/books/:bookId/reviews/stats', reviewsController.getBookReviewsWithStatsHandler);

// Likes
router.post('/likes', reviewsController.toggleLikeHandler);

export default router;

