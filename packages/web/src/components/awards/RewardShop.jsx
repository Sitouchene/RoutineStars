import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Filter, Search, Gift, Star, Zap, Trophy, Crown } from 'lucide-react';
import { rewardsApi, pointsApi } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';
import RewardCard from './RewardCard';
import { useToast } from '../ui/Toast';
import { useConfirm } from '../ui/ConfirmModal';

/**
 * Boutique de récompenses pour échanger des points contre des récompenses
 */
export default function RewardShop() {
  const { t } = useTranslation();
  const { user, getAuthHeader } = useAuthStore();
  const queryClient = useQueryClient();
  const { success, error, ToastContainer } = useToast();
  const { confirm, ConfirmModalComponent } = useConfirm();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Récupérer toutes les récompenses disponibles
  const { data: allRewards = [], isLoading: rewardsLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: () => rewardsApi.getAll(),
  });

  // Récupérer le solde de points de l'utilisateur
  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['userBalance', user?.id],
    queryFn: () => pointsApi.getBalance(user.id, getAuthHeader()),
    enabled: !!user?.id,
  });

  // Récupérer les échanges de l'utilisateur
  const { data: userRedemptions = [] } = useQuery({
    queryKey: ['userRedemptions', user?.id],
    queryFn: () => rewardsApi.getUserRedemptions(user.id, getAuthHeader()),
    enabled: !!user?.id,
  });

  // Mutation pour échanger une récompense
  const redeemMutation = useMutation({
    mutationFn: ({ rewardId, childComment }) => 
      rewardsApi.redeemReward(user.id, rewardId, childComment, getAuthHeader()),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['userBalance', user.id]);
      queryClient.invalidateQueries(['userRedemptions', user.id]);
      success(`Récompense "${data.reward.name}" échangée avec succès ! 🎉`);
    },
    onError: (err) => {
      error(`Erreur lors de l'échange: ${err.message}`);
    },
  });

  // Filtrer les récompenses
  const filteredRewards = allRewards.filter(reward => {
    const matchesCategory = selectedCategory === 'all' || reward.category === selectedCategory;
    const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const userBalance = balanceData?.balance || 0;

  const categories = [
    { id: 'all', name: 'Toutes', icon: '🛍️' },
    { id: 'toy', name: 'Jouets', icon: '🧸' },
    { id: 'activity', name: 'Activités', icon: '🎯' },
    { id: 'privilege', name: 'Privilèges', icon: '👑' },
    { id: 'special', name: 'Spéciales', icon: '✨' },
  ];

  const handleRedeem = async (reward) => {
    const confirmed = await confirm({
      title: 'Confirmer l\'échange',
      message: `Es-tu sûr de vouloir échanger ${reward.cost} points contre "${reward.name}" ?`,
      type: 'warning',
      confirmText: 'Oui, échanger',
      cancelText: 'Annuler',
    });

    if (confirmed) {
      redeemMutation.mutate({
        rewardId: reward.id,
        childComment: `Échange effectué le ${new Date().toLocaleDateString()}`
      });
    }
  };

  if (rewardsLoading || balanceLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec solde */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <ShoppingBag className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Boutique de Récompenses</h2>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">🪙 {userBalance}</div>
            <div className="text-sm opacity-90">Points disponibles</div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-semibold">{userRedemptions.length}</div>
            <div className="text-sm opacity-90">Échanges effectués</div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="space-y-4">
        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher une récompense..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-anthracite-light text-anthracite dark:text-cream focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grille de récompenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredRewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <RewardCard
                reward={reward}
                userBalance={userBalance}
                onRedeem={handleRedeem}
                isRedeeming={redeemMutation.isPending}
                showRedeemButton={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Message si aucune récompense trouvée */}
      {filteredRewards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            Aucune récompense trouvée
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Essayez de modifier vos filtres ou votre recherche
          </p>
        </div>
      )}

      {/* Message si solde insuffisant */}
      {userBalance === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Pas assez de points !
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Continue à faire tes tâches et lire des livres pour gagner des points !
              </p>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
      <ConfirmModalComponent />
    </div>
  );
}

