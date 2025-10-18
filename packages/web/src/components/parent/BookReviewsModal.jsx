import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { X, Star, MessageCircle, User, Heart, Edit3, Send } from 'lucide-react';
import { reviewsApi } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';

export default function BookReviewsModal({ isOpen, onClose, bookId, bookTitle }) {
  const { t } = useTranslation();
  const { getAuthHeader, user } = useAuthStore();
  const queryClient = useQueryClient();
  
  // États pour le formulaire d'avis
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [editingReview, setEditingReview] = useState(null);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['bookReviewsStats', bookId],
    queryFn: () => reviewsApi.getBookReviewsWithStats(bookId, getAuthHeader()),
    enabled: isOpen && !!bookId
  });

  // Vérifier si l'utilisateur a déjà un avis
  const userReview = stats?.reviews?.find(review => review.reviewer.id === user?.id) || null;
  const isUserReview = !!userReview;

  // Mutation pour liker/déliker
  const likeMutation = useMutation({
    mutationFn: () => reviewsApi.toggleLike(bookId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookReviewsStats', bookId]);
    }
  });

  // Mutation pour créer/modifier un avis
  const reviewMutation = useMutation({
    mutationFn: (data) => {
      if (editingReview) {
        return reviewsApi.update(editingReview.id, data, getAuthHeader());
      } else {
        return reviewsApi.create({ bookId, ...data }, getAuthHeader());
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['bookReviewsStats', bookId]);
      setIsWritingReview(false);
      setEditingReview(null);
      setReviewRating(0);
      setReviewComment('');
    }
  });

  // Mutation pour supprimer un avis
  const deleteReviewMutation = useMutation({
    mutationFn: () => reviewsApi.delete(userReview.id, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookReviewsStats', bookId]);
    }
  });

  // Fonctions de gestion
  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleStartReview = () => {
    if (userReview) {
      setEditingReview(userReview);
      setReviewRating(userReview.rating);
      setReviewComment(userReview.comment || '');
    }
    setIsWritingReview(true);
  };

  const handleCancelReview = () => {
    setIsWritingReview(false);
    setEditingReview(null);
    setReviewRating(0);
    setReviewComment('');
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0) return;
    
    reviewMutation.mutate({
      rating: reviewRating,
      comment: reviewComment.trim() || null,
      isChildReview: user?.role === 'child'
    });
  };

  const handleDeleteReview = () => {
    if (confirm(t('books.reviews.deleteConfirm'))) {
      deleteReviewMutation.mutate();
    }
  };

  const getRatingQuality = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Très bien';
    if (rating >= 2.5) return 'Bien';
    if (rating >= 1.5) return 'Moyen';
    return 'Faible';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderRatingBar = (rating, count, total) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 w-16">
          <span className="text-sm font-medium">{rating}</span>
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
          {count}
        </span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100">
                {t('books.reviews.title')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {bookTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Chargement...</div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Global Rating */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {getRatingQuality(stats.averageRating)} ({stats.totalReviews} avis)
                </p>
              </div>
            </div>

            {/* Actions utilisateur */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleLike}
                disabled={likeMutation.isPending}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors border ${
                  stats.userLiked 
                    ? 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900'
                    : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                }`}
                title="Like"
              >
                <span className={`inline-flex items-center gap-1 ${stats.userLiked ? '' : ''}`}>
                  <span className="font-semibold">{stats.totalLikes ?? 0}</span>
                  <Heart className={`w-4 h-4 ${stats.userLiked ? 'fill-current text-red-600' : 'text-gray-400'}`} />
                </span>
              </button>
              
              <button
                onClick={handleStartReview}
                className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl hover:bg-brand/90 font-medium transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                {isUserReview ? t('books.reviews.editReview') : t('books.reviews.giveReview')}
              </button>
            </div>

            {/* Formulaire d'avis */}
            {isWritingReview && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {editingReview ? t('books.reviews.editReview') : t('books.reviews.giveReview')}
                </h3>
                
                {/* Note */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('books.reviews.rating')} *
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setReviewRating(rating)}
                        className={`p-2 rounded-lg transition-colors ${
                          rating <= reviewRating
                            ? 'text-yellow-400 hover:text-yellow-500'
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                  {reviewRating > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {getRatingQuality(reviewRating)}
                    </p>
                  )}
                </div>

                {/* Commentaire */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('books.reviews.comment')}
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={t('books.reviews.commentPlaceholder')}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancelReview}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                  >
                    {t('books.reviews.cancel')}
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={reviewRating === 0 || reviewMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <Send className="w-4 h-4" />
                    {reviewMutation.isPending ? t('books.reviews.publishing') : (editingReview ? t('books.reviews.update') : t('books.reviews.publish'))}
                  </button>
                </div>
              </div>
            )}

            {/* Rating Distribution */}
            {stats.totalReviews > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {t('books.reviews.ratingDistribution')}
                </h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(rating => 
                    renderRatingBar(rating, stats.ratingDistribution[rating], stats.totalReviews)
                  )}
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('books.reviews.comments')} ({stats.reviews.length})
              </h3>
              {stats.reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{t('books.reviews.noComments')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.reviews.map((review) => {
                    const isCurrentUserReview = review.reviewer.id === user?.id;
                    return (
                      <div
                        key={review.id}
                        className={`bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 ${
                          isCurrentUserReview ? 'ring-2 ring-brand/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {review.reviewer.name}
                                {isCurrentUserReview && (
                                  <span className="ml-2 text-xs text-brand font-medium">{t('books.reviews.you')}</span>
                                )}
                              </span>
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              {review.isChildReview && (
                                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium">
                                  {t('books.reviews.child')}
                                </span>
                              )}
                            </div>
                            {review.comment && (
                              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {review.comment}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              {isCurrentUserReview && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingReview(review);
                                      setReviewRating(review.rating);
                                      setReviewComment(review.comment || '');
                                      setIsWritingReview(true);
                                    }}
                                    className="text-xs text-brand hover:text-brand/80 font-medium"
                                  >
                                    {t('books.reviews.modify')}
                                  </button>
                                  <button
                                    onClick={handleDeleteReview}
                                    disabled={deleteReviewMutation.isPending}
                                    className="text-xs text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
                                  >
                                    {t('books.reviews.delete')}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Erreur lors du chargement des avis
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
          >
            {t('books.reviews.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
