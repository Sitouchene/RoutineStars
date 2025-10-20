import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Filter, Search, Star, Zap, Crown } from 'lucide-react';
import { badgesApi } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';
import BadgeCard from './BadgeCard';
import { useToast } from '../ui/Toast';

/**
 * Galerie de badges pour afficher tous les badges disponibles et ceux de l'utilisateur
 */
export default function BadgeGallery() {
  const { t } = useTranslation();
  const { user, getAuthHeader } = useAuthStore();
  const { success, ToastContainer } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Récupérer tous les badges disponibles
  const { data: allBadges = [], isLoading: badgesLoading } = useQuery({
    queryKey: ['badges'],
    queryFn: () => badgesApi.getAll(),
  });

  // Récupérer les badges de l'utilisateur
  const { data: userBadges = [], isLoading: userBadgesLoading } = useQuery({
    queryKey: ['userBadges', user?.id],
    queryFn: () => badgesApi.getUserBadges(user.id, getAuthHeader()),
    enabled: !!user?.id,
  });

  // Récupérer les statistiques de badges
  const { data: badgeStats } = useQuery({
    queryKey: ['badgeStats', user?.id],
    queryFn: () => badgesApi.getStats(user.id, getAuthHeader()),
    enabled: !!user?.id,
  });

  // Filtrer les badges
  const filteredBadges = allBadges.filter(badge => {
    const matchesCategory = selectedCategory === 'all' || badge.category === selectedCategory;
    const matchesRarity = selectedRarity === 'all' || badge.rarity === selectedRarity;
    const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         badge.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesRarity && matchesSearch;
  });

  // Créer un Set des IDs de badges débloqués pour une recherche rapide
  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));

  const categories = [
    { id: 'all', name: 'Tous', icon: '🏆' },
    { id: 'reading', name: 'Lecture', icon: '📚' },
    { id: 'tasks', name: 'Tâches', icon: '✅' },
    { id: 'streak', name: 'Régularité', icon: '🔥' },
    { id: 'special', name: 'Spéciaux', icon: '⭐' },
  ];

  const rarities = [
    { id: 'all', name: 'Toutes', icon: <Star className="w-4 h-4" /> },
    { id: 'common', name: 'Commun', icon: <Star className="w-4 h-4" /> },
    { id: 'rare', name: 'Rare', icon: <Zap className="w-4 h-4" /> },
    { id: 'epic', name: 'Épique', icon: <Trophy className="w-4 h-4" /> },
    { id: 'legendary', name: 'Légendaire', icon: <Crown className="w-4 h-4" /> },
  ];

  const handleBadgeClick = (badge) => {
    const isEarned = earnedBadgeIds.has(badge.id);
    if (isEarned) {
      success(`Badge "${badge.name}" déjà débloqué ! 🎉`);
    } else {
      success(`Badge "${badge.name}" verrouillé - Continue tes efforts ! 💪`);
    }
  };

  if (badgesLoading || userBadgesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="bg-gradient-to-r from-brand to-brand-dark rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Ma Collection de Badges</h2>
        </div>
        
        {badgeStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{badgeStats.total}</div>
              <div className="text-sm opacity-90">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{badgeStats.byCategory.reading || 0}</div>
              <div className="text-sm opacity-90">Lecture</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{badgeStats.byCategory.tasks || 0}</div>
              <div className="text-sm opacity-90">Tâches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{badgeStats.byRarity.legendary || 0}</div>
              <div className="text-sm opacity-90">Légendaires</div>
            </div>
          </div>
        )}
      </div>

      {/* Filtres */}
      <div className="space-y-4">
        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un badge..."
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

        {/* Filtres par rareté */}
        <div className="flex flex-wrap gap-2">
          {rarities.map(rarity => (
            <button
              key={rarity.id}
              onClick={() => setSelectedRarity(rarity.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRarity === rarity.id
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {rarity.icon}
              <span>{rarity.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grille de badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredBadges.map((badge, index) => {
            const isEarned = earnedBadgeIds.has(badge.id);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <BadgeCard
                  badge={badge}
                  isEarned={isEarned}
                  isLocked={!isEarned}
                  onClick={() => handleBadgeClick(badge)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Message si aucun badge trouvé */}
      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            Aucun badge trouvé
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Essayez de modifier vos filtres ou votre recherche
          </p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

