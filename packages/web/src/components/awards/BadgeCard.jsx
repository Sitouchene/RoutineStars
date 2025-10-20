import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Crown } from 'lucide-react';

/**
 * Composant pour afficher un badge
 */
export default function BadgeCard({ badge, isEarned = false, isLocked = false, onClick }) {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700';
      case 'rare': return 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900';
      case 'epic': return 'text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-900';
      case 'legendary': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700';
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'common': return <Star className="w-3 h-3" />;
      case 'rare': return <Zap className="w-3 h-3" />;
      case 'epic': return <Trophy className="w-3 h-3" />;
      case 'legendary': return <Crown className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'reading': return 'border-l-blue-500';
      case 'tasks': return 'border-l-green-500';
      case 'streak': return 'border-l-orange-500';
      case 'special': return 'border-l-purple-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative bg-white dark:bg-anthracite-light rounded-2xl p-4 shadow-md ring-1 ring-black/5 dark:ring-white/5 
        border-l-4 ${getCategoryColor(badge.category)}
        transition-all duration-200 cursor-pointer
        ${isLocked ? 'opacity-50 grayscale' : ''}
        ${isEarned ? 'ring-2 ring-brand' : ''}
      `}
      onClick={onClick}
    >
      {/* Header avec icône et rareté */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-3xl">{badge.icon}</div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
          {getRarityIcon(badge.rarity)}
          <span className="capitalize">{badge.rarity}</span>
        </div>
      </div>

      {/* Nom et description */}
      <div className="mb-3">
        <h3 className="font-semibold text-anthracite dark:text-cream mb-1">
          {badge.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {badge.description}
        </p>
      </div>

      {/* Points requis */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <span>🪙</span>
          <span>{badge.pointsRequired} points</span>
        </div>
        
        {/* Statut */}
        {isEarned && (
          <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <span>✅</span>
            <span>Débloqué</span>
          </div>
        )}
        
        {isLocked && !isEarned && (
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <span>🔒</span>
            <span>Verrouillé</span>
          </div>
        )}
      </div>

      {/* Effet de brillance pour les badges légendaires */}
      {badge.rarity === 'legendary' && isEarned && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent animate-pulse" />
      )}
    </motion.div>
  );
}

