import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ShoppingBag, Coins, History } from 'lucide-react';
import ChildHeader from '../../components/child/ChildHeader';
import BadgeGallery from '../../components/awards/BadgeGallery';
import RewardShop from '../../components/awards/RewardShop';
import PointsHistory from '../../components/awards/PointsHistory';

/**
 * Page des récompenses et badges pour les enfants
 */
export default function AwardsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('badges');

  const tabs = [
    { id: 'badges', name: 'Mes Badges', icon: Trophy },
    { id: 'shop', name: 'Boutique', icon: ShoppingBag },
    { id: 'history', name: 'Historique', icon: History },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'badges':
        return <BadgeGallery />;
      case 'shop':
        return <RewardShop />;
      case 'history':
        return <PointsHistory />;
      default:
        return <BadgeGallery />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mootify p-4">
      <div className="max-w-6xl mx-auto">
        <ChildHeader 
          title={t('child.awards.title', 'Mes Récompenses')} 
          subtitle={t('child.awards.subtitle', 'Découvre tes badges et échange tes points !')} 
        />

        {/* Onglets */}
        <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-xl p-1 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white dark:bg-anthracite text-brand shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-brand'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Contenu des onglets */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

