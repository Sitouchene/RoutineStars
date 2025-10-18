import * as reviewsService from './reviews.service.js';

/**
 * POST /api/reading/reviews
 * Créer un avis sur un livre
 */
export async function createReviewHandler(req, res) {
  try {
    const { id: reviewerId, role } = req.user;
    const { bookId, rating, comment } = req.body;
    
    if (!bookId || !rating) {
      return res.status(400).json({ error: 'bookId et rating sont requis' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating doit être entre 1 et 5' });
    }
    
    const isChild = role === 'child' || role === 'student';
    const review = await reviewsService.createReview(bookId, reviewerId, rating, comment, isChild);
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * PUT /api/reading/reviews/:id
 * Mettre à jour un avis
 */
export async function updateReviewHandler(req, res) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    if (!rating) {
      return res.status(400).json({ error: 'Rating requis' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating doit être entre 1 et 5' });
    }
    
    const review = await reviewsService.updateReview(id, rating, comment);
    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * DELETE /api/reading/reviews/:id
 * Supprimer un avis
 */
export async function deleteReviewHandler(req, res) {
  try {
    const { id } = req.params;
    await reviewsService.deleteReview(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * GET /api/reading/books/:bookId/reviews
 * Obtenir les avis d'un livre
 */
export async function getBookReviewsHandler(req, res) {
  try {
    const { bookId } = req.params;
    const separate = req.query.separate === 'true';
    
    const reviews = await reviewsService.getBookReviews(bookId, separate);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET /api/reading/books/:bookId/reviews/stats
 * Obtenir les statistiques détaillées des avis d'un livre
 */
export async function getBookReviewsWithStatsHandler(req, res) {
  try {
    const { bookId } = req.params;
    const { id: userId } = req.user;
    const stats = await reviewsService.getBookReviewsWithStats(bookId, userId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /api/reading/likes
 * Toggle like sur un livre
 */
export async function toggleLikeHandler(req, res) {
  try {
    const { id: userId } = req.user;
    const { bookId } = req.body;
    
    if (!bookId) {
      return res.status(400).json({ error: 'bookId requis' });
    }
    
    const result = await reviewsService.toggleLike(bookId, userId);
    res.json(result);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(400).json({ error: error.message });
  }
}

