import { useTranslation } from 'react-i18next';
import { Trophy, Star } from 'lucide-react';

/**
 * Barre de progression avec paliers de points (25%, 50%, 75%, 100%)
 */
export default function ReadingProgressBar({ 
  currentPage, 
  totalPages, 
  currentPoints,
  totalPoints,
  lastMilestone = 0
}) {
  const { t } = useTranslation();
  
  const percentage = totalPages > 0 ? Math.min(100, (currentPage / totalPages) * 100) : 0;
  const milestones = [25, 50, 75, 100];
  
  // Calculer le prochain palier
  const nextMilestone = milestones.find(m => m > lastMilestone) || 100;
  const nextMilestonePages = Math.ceil((nextMilestone / 100) * totalPages);
  const pagesRemaining = nextMilestonePages - currentPage;
  const pointsPerMilestone = totalPoints / 4;
  
  return (
    <div className="space-y-3">
      {/* Stats principales */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-anthracite dark:text-cream font-medium">
          <Star className="w-4 h-4 text-brand" />
          <span>{currentPoints} / {totalPoints} {t('child.reads.points')}</span>
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          {currentPage} / {totalPages} {t('child.reads.pages')}
        </div>
      </div>
      
      {/* Barre de progression avec paliers */}
      <div className="relative">
        {/* Barre de fond */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
          {/* Progression */}
          <div 
            className="h-full bg-gradient-to-r from-brand to-secondary transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
          
          {/* Marqueurs de paliers */}
          {milestones.map((milestone) => (
            <div
              key={milestone}
              className="absolute top-0 bottom-0 flex items-center"
              style={{ left: `${milestone}%` }}
            >
              {/* Ligne du palier */}
              <div className="w-0.5 h-full bg-white dark:bg-anthracite" />
              
              {/* Badge du palier */}
              <div 
                className={`absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  lastMilestone >= milestone
                    ? 'bg-brand text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                {milestone}%
              </div>
            </div>
          ))}
        </div>
        
        {/* Pourcentage actuel */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
          style={{ left: `${Math.min(percentage, 95)}%` }}
        >
          <div className="bg-anthracite dark:bg-cream text-white dark:text-anthracite px-2 py-1 rounded text-xs font-bold shadow-lg">
            {Math.round(percentage)}%
          </div>
        </div>
      </div>
      
      {/* Message motivant pour le prochain palier */}
      {lastMilestone < 100 && pagesRemaining > 0 && (
        <div className="bg-brand-light/20 border border-brand rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2 text-brand font-medium mb-1">
            <Trophy className="w-4 h-4" />
            <span>{t('child.reads.nextMilestone')}: {nextMilestone}%</span>
          </div>
          <p className="text-anthracite dark:text-cream text-xs">
            {t('child.reads.pagesLeft', { pages: pagesRemaining })} {t('child.reads.earnPoints', { points: Math.floor(pointsPerMilestone) })}
          </p>
        </div>
      )}
      
      {/* Message de félicitation si terminé */}
      {lastMilestone === 100 && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
            <Trophy className="w-4 h-4" />
            <span>🎉 {t('child.reads.bookFinished')}</span>
          </div>
        </div>
      )}
    </div>
  );
}

