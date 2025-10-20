import { motion } from 'framer-motion';
import { ShoppingCart, Clock, CheckCircle, XCircle } from 'lucide-react';

/**
 * Composant pour afficher une récompense
 */
export default function RewardCard({ 
  reward, 
  userBalance = 0, 
  onRedeem, 
  isRedeeming = false,
  showRedeemButton = true 
}) {
  const canAfford = userBalance >= reward.cost;
  const isExpensive = reward.cost > userBalance * 2; // Plus de 2x le solde actuel

  const getCategoryColor = (category) => {
    switch (category) {
      case 'toy': return 'border-l-blue-500';
      case 'activity': return 'border-l-green-500';
      case 'privilege': return 'border-l-purple-500';
      case 'special': return 'border-l-yellow-500';
      default: return 'border-l-gray-500';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'toy': return '🧸';
      case 'activity': return '🎯';
      case 'privilege': return '👑';
      case 'special': return '✨';
      default: return '🎁';
    }
  };

  const handleRedeem = () => {
    if (canAfford && onRedeem) {
      onRedeem(reward);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative bg-white dark:bg-anthracite-light rounded-2xl p-4 shadow-md ring-1 ring-black/5 dark:ring-white/5 
        border-l-4 ${getCategoryColor(reward.category)}
        transition-all duration-200
        ${!canAfford ? 'opacity-60' : ''}
      `}
    >
      {/* Header avec icône et catégorie */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-3xl">{reward.icon}</div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          <span>{getCategoryIcon(reward.category)}</span>
          <span className="capitalize">{reward.category}</span>
        </div>
      </div>

      {/* Nom et description */}
      <div className="mb-4">
        <h3 className="font-semibold text-anthracite dark:text-cream mb-1">
          {reward.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {reward.description}
        </p>
      </div>

      {/* Coût et bouton d'échange */}
      <div className="space-y-3">
        {/* Coût */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Coût:</span>
            <span className={`font-semibold ${canAfford ? 'text-green-600' : 'text-red-500'}`}>
              🪙 {reward.cost} points
            </span>
          </div>
          
          {/* Statut d'accessibilité */}
          {!canAfford && (
            <div className="flex items-center gap-1 text-red-500 text-xs">
              <XCircle className="w-3 h-3" />
              <span>Insuffisant</span>
            </div>
          )}
          
          {canAfford && isExpensive && (
            <div className="flex items-center gap-1 text-yellow-500 text-xs">
              <Clock className="w-3 h-3" />
              <span>Cher</span>
            </div>
          )}
          
          {canAfford && !isExpensive && (
            <div className="flex items-center gap-1 text-green-500 text-xs">
              <CheckCircle className="w-3 h-3" />
              <span>Abordable</span>
            </div>
          )}
        </div>

        {/* Bouton d'échange */}
        {showRedeemButton && (
          <button
            onClick={handleRedeem}
            disabled={!canAfford || isRedeeming}
            className={`
              w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors
              ${canAfford && !isRedeeming
                ? 'bg-brand hover:bg-brand-dark text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isRedeeming ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Échange...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Échanger</span>
              </>
            )}
          </button>
        )}

        {/* Barre de progression du solde */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Ton solde: {userBalance} points</span>
            <span>{Math.round((userBalance / reward.cost) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                canAfford ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min((userBalance / reward.cost) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

