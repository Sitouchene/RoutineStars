import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Star, StarOff, Bookmark, User, UserPlus, CheckCircle, BookOpen as BookOpenIcon } from 'lucide-react';
import ChildHeader from '../../components/child/ChildHeader';
import ReadingProgressBar from '../../components/child/ReadingProgressBar';
import { readingApi, reviewsApi } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';

function Rating({ value, onChange }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <button key={s} onClick={() => onChange(s)} className="text-yellow-500 hover:scale-110 transition-transform">
          {value >= s ? <Star className="w-4 h-4 fill-yellow-400" /> : <StarOff className="w-4 h-4" />}
        </button>
      ))}
    </div>
  );
}

function AssignmentTypeIcon({ type }) {
  if (type === 'assigned') return <UserPlus className="w-3 h-3" />;
  if (type === 'recommended') return <User className="w-3 h-3" />;
  return <Bookmark className="w-3 h-3" />;
}

export default function ReadsPage() {
  const { t } = useTranslation();
  const { user, getAuthHeader } = useAuthStore();
  const queryClient = useQueryClient();

  // Charger les lectures de l'enfant
  const { data: readings = [], isLoading } = useQuery({
    queryKey: ['childReadings', user?.id],
    queryFn: () => readingApi.getChildReadings(user.id, getAuthHeader()),
    enabled: !!user?.id,
  });

  // Mutation pour mettre à jour la progression
  const updateProgressMutation = useMutation({
    mutationFn: ({ assignmentId, currentPage }) => 
      readingApi.updateProgress(assignmentId, currentPage, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childReadings'] });
      queryClient.invalidateQueries({ queryKey: ['readingStats'] });
    },
  });

  // Mutation pour terminer un livre
  const finishBookMutation = useMutation({
    mutationFn: (assignmentId) => readingApi.finish(assignmentId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childReadings'] });
      queryClient.invalidateQueries({ queryKey: ['readingStats'] });
    },
  });

  // Mutation pour créer/mettre à jour un avis
  const reviewMutation = useMutation({
    mutationFn: ({ bookId, rating, comment, reviewId }) => {
      if (reviewId) {
        return reviewsApi.update(reviewId, { rating, comment }, getAuthHeader());
      }
      return reviewsApi.create({ bookId, rating, comment }, getAuthHeader());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childReadings'] });
    },
  });

  const handleProgressChange = (assignmentId, currentPage) => {
    updateProgressMutation.mutate({ assignmentId, currentPage });
  };

  const handleFinishBook = (assignmentId) => {
    if (confirm(t('child.reads.confirmFinish', 'Es-tu sûr d\'avoir terminé ce livre ?'))) {
      finishBookMutation.mutate(assignmentId);
    }
  };

  const handleRatingChange = (bookId, rating, reviewId) => {
    reviewMutation.mutate({ bookId, rating, reviewId });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-mootify p-4">
        <div className="max-w-4xl mx-auto">
          <ChildHeader title={t('child.reads.title')} subtitle={t('child.reads.subtitle')} />
          <div className="text-center py-12">
            <div className="text-gray-500">{t('child.reads.loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (readings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-mootify p-4">
        <div className="max-w-4xl mx-auto">
          <ChildHeader title={t('child.reads.title')} subtitle={t('child.reads.subtitle')} />
          <div className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('child.reads.noBooks')}</p>
            <p className="text-sm text-gray-400 mt-2">{t('child.reads.noBooksDesc')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-mootify p-4">
      <div className="max-w-4xl mx-auto">
        <ChildHeader title={t('child.reads.title')} subtitle={t('child.reads.subtitle')} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {readings.map((reading) => {
          const book = reading.book;
          const progress = reading.progress || { currentPage: 0, currentPoints: 0, lastMilestone: 0, isFinished: false };
          const assignedBy = reading.assignedBy;
          
          return (
            <div key={reading.id} className="bg-white dark:bg-anthracite-light rounded-2xl p-4 shadow-md ring-1 ring-black/5 dark:ring-white/5">
              {/* En-tête livre */}
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-28 bg-gradient-mootify rounded-lg shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0">
                  {book.coverImageUrl ? (
                    <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">📖</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-anthracite dark:text-cream line-clamp-2 mb-1 text-sm">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{book.author}</p>
                  
                  {/* Type d'assignation */}
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <AssignmentTypeIcon type={reading.assignmentType} />
                    {reading.assignmentType === 'assigned' && assignedBy && (
                      <span>{t('child.reads.assignedBy', { name: assignedBy.name })}</span>
                    )}
                    {reading.assignmentType === 'recommended' && assignedBy && (
                      <span>{t('child.reads.recommended', { name: assignedBy.name })}</span>
                    )}
                    {reading.assignmentType === 'chosen' && (
                      <span>{t('child.reads.chosen')}</span>
                    )}
                  </div>
                  
                  {/* Badge terminé */}
                  {progress.isFinished && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Terminé !
                    </div>
                  )}
                </div>
              </div>

              {/* Barre de progression avec paliers */}
              <ReadingProgressBar
                currentPage={progress.currentPage}
                totalPages={book.totalPages}
                currentPoints={progress.currentPoints}
                totalPoints={reading.totalPoints}
                lastMilestone={progress.lastMilestone}
              />

              {/* Slider de page */}
              {!progress.isFinished && (
                <div className="mt-4">
                  <input
                    type="range"
                    min="0"
                    max={book.totalPages}
                    value={progress.currentPage}
                    onChange={(e) => handleProgressChange(reading.id, Number(e.target.value))}
                    className="w-full h-2 accent-brand cursor-pointer"
                    disabled={updateProgressMutation.isPending}
                  />
                </div>
              )}

              {/* Bouton terminer */}
              {!progress.isFinished && progress.currentPage >= book.totalPages * 0.9 && (
                  <button
                    onClick={() => handleFinishBook(reading.id)}
                    disabled={finishBookMutation.isPending}
                    className="mt-3 w-full btn btn-primary text-sm"
                  >
                    {t('child.reads.markFinished')}
                  </button>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
