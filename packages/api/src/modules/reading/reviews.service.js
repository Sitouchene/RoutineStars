import prisma from '../../config/database.js';

/**
 * Obtenir les statistiques détaillées des reviews d'un livre
 */
export async function getBookReviewsWithStats(bookId, userId = null) {
  const reviews = await prisma.bookReview.findMany({
    where: { bookId },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Vérifier si l'utilisateur a liké ce livre
  let userLiked = false;
  if (userId) {
    const like = await prisma.bookLike.findUnique({
      where: {
        bookId_userId: {
          bookId,
          userId
        }
      }
    });
    userLiked = !!like;
  }

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      reviews: [],
      userLiked
    };
  }

  // Calculer la moyenne
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

  // Distribution des notes
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    ratingDistribution[review.rating]++;
  });

  // Total likes
  const totalLikes = await prisma.bookLike.count({ where: { bookId } });

  return {
    averageRating,
    totalReviews: reviews.length,
    ratingDistribution,
    userLiked,
    totalLikes,
    reviews: reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      isChildReview: review.isChildReview,
      createdAt: review.createdAt,
      reviewer: {
        id: review.reviewer.id,
        name: review.reviewer.name,
        avatar: review.reviewer.avatar
      }
    }))
  };
}

/**
 * Créer un avis sur un livre
 */
export async function createReview(bookId, reviewerId, rating, comment = null, isChild = false) {
  // Vérifier si l'utilisateur a déjà laissé un avis
  const existing = await prisma.bookReview.findUnique({
    where: {
      bookId_reviewerId: {
        bookId,
        reviewerId
      }
    }
  });
  
  if (existing) {
    throw new Error('Vous avez déjà laissé un avis sur ce livre');
  }
  
  return await prisma.bookReview.create({
    data: {
      bookId,
      reviewerId,
      rating,
      comment,
      isChildReview: isChild
    },
    include: {
      book: true,
      reviewer: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    }
  });
}

/**
 * Mettre à jour un avis
 */
export async function updateReview(reviewId, rating, comment = null) {
  return await prisma.bookReview.update({
    where: { id: reviewId },
    data: {
      rating,
      comment
    },
    include: {
      book: true,
      reviewer: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    }
  });
}

/**
 * Supprimer un avis
 */
export async function deleteReview(reviewId) {
  return await prisma.bookReview.delete({
    where: { id: reviewId }
  });
}

/**
 * Obtenir les avis d'un livre
 * Séparés entre enfants et adultes si demandé
 */
export async function getBookReviews(bookId, separateChildren = false) {
  const reviews = await prisma.bookReview.findMany({
    where: { bookId },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  if (!separateChildren) {
    return reviews;
  }
  
  // Séparer les avis enfants/adultes
  const childReviews = reviews.filter(r => r.isChildReview);
  const adultReviews = reviews.filter(r => !r.isChildReview);
  
  // Calculer les moyennes séparément
  const avgChildRating = childReviews.length > 0
    ? childReviews.reduce((sum, r) => sum + r.rating, 0) / childReviews.length
    : 0;
    
  const avgAdultRating = adultReviews.length > 0
    ? adultReviews.reduce((sum, r) => sum + r.rating, 0) / adultReviews.length
    : 0;
  
  return {
    all: reviews,
    children: {
      reviews: childReviews,
      average: Math.round(avgChildRating * 10) / 10,
      count: childReviews.length
    },
    adults: {
      reviews: adultReviews,
      average: Math.round(avgAdultRating * 10) / 10,
      count: adultReviews.length
    }
  };
}

/**
 * Toggle like sur un livre
 */
export async function toggleLike(bookId, userId) {
  // Vérifier si le like existe déjà
  const existing = await prisma.bookLike.findUnique({
    where: {
      bookId_userId: {
        bookId,
        userId
      }
    }
  });
  
  if (existing) {
    // Supprimer le like
    await prisma.bookLike.delete({
      where: {
        id: existing.id
      }
    });
    return { liked: false };
  } else {
    // Créer le like
    await prisma.bookLike.create({
      data: {
        bookId,
        userId
      }
    });
    return { liked: true };
  }
}

/**
 * Obtenir les likes d'un livre
 */
export async function getBookLikes(bookId) {
  return await prisma.bookLike.findMany({
    where: { bookId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    }
  });
}

/**
 * Vérifier si un utilisateur a liké un livre
 */
export async function hasUserLiked(bookId, userId) {
  const like = await prisma.bookLike.findUnique({
    where: {
      bookId_userId: {
        bookId,
        userId
      }
    }
  });
  
  return !!like;
}

