import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Settings, 
  Users, 
  Trophy, 
  Star, 
  StarOff, 
  Eye, 
  EyeOff,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { badgesApi, childrenApi } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../components/ui/Toast';
import { useConfirm } from '../../components/ui/ConfirmModal';
import CreateBadgeModal from '../../components/parent/CreateBadgeModal';

/**
 * Page de gestion des badges pour les parents
 */
export default function BadgesManagementPage() {
  const { t } = useTranslation();
  const { user, getAuthHeader } = useAuthStore();
  const queryClient = useQueryClient();
  const { success, error, ToastContainer } = useToast();

  const [activeTab, setActiveTab] = useState('global');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [selectedChildren, setSelectedChildren] = useState([]);

  // Charger les badges globaux
  const { data: globalBadges = [], isLoading: loadingGlobal } = useQuery({
    queryKey: ['globalBadges'],
    queryFn: () => badgesApi.getAllGlobal(),
  });

  // Charger les badges du groupe
  const { data: groupBadges = [], isLoading: loadingGroup } = useQuery({
    queryKey: ['groupBadges', user?.groupId],
    queryFn: () => badgesApi.getGroup(user.groupId, getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Charger les enfants du groupe
  const { data: children = [] } = useQuery({
    queryKey: ['groupChildren', user?.groupId],
    queryFn: () => childrenApi.getByGroup(user.groupId, getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Mutation pour importer un badge global
  const importBadgeMutation = useMutation({
    mutationFn: (globalBadgeId) => 
      badgesApi.importGlobal(user.groupId, globalBadgeId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupBadges'] });
      success(t('parent.badges.imported', 'Badge importé avec succès !'));
    },
    onError: (err) => error(err.message),
  });

  // Mutation pour créer un badge personnalisé
  const createBadgeMutation = useMutation({
    mutationFn: (badgeData) => 
      badgesApi.createCustom(user.groupId, badgeData, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupBadges'] });
      success(t('parent.badges.created', 'Badge créé avec succès !'));
      setShowCreateModal(false);
    },
    onError: (err) => error(err.message),
  });

  // Mutation pour activer/désactiver un badge
  const toggleBadgeMutation = useMutation({
    mutationFn: ({ badgeId, isEnabled }) => 
      badgesApi.toggle(badgeId, isEnabled, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupBadges'] });
      success(t('parent.badges.toggled', 'Badge mis à jour !'));
    },
    onError: (err) => error(err.message),
  });

  // Mutation pour débloquer manuellement un badge
  const unlockBadgeMutation = useMutation({
    mutationFn: ({ userId, badgeId }) => 
      badgesApi.unlockManually(userId, badgeId, getAuthHeader()),
    onSuccess: () => {
      success(t('parent.badges.unlocked', 'Badge débloqué !'));
    },
    onError: (err) => error(err.message),
  });

  const handleImportBadge = (globalBadgeId) => {
    importBadgeMutation.mutate(globalBadgeId);
  };

  const handleToggleBadge = (badgeId, isEnabled) => {
    toggleBadgeMutation.mutate({ badgeId, isEnabled });
  };

  const handleUnlockBadge = (userId, badgeId) => {
    unlockBadgeMutation.mutate({ userId, badgeId });
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUnlockTypeIcon = (type) => {
    switch (type) {
      case 'automatic': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'manual': return <Users className="w-4 h-4 text-blue-600" />;
      case 'hybrid': return <Settings className="w-4 h-4 text-purple-600" />;
      default: return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('parent.badges.management', 'Gestion des Badges')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('parent.badges.description', 'Gérez les badges disponibles pour votre groupe')}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('global')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'global'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('parent.badges.global', 'Badges Globaux')}
              </button>
              <button
                onClick={() => setActiveTab('group')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'group'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('parent.badges.group', 'Badges du Groupe')}
              </button>
              <button
                onClick={() => setActiveTab('children')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'children'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('parent.badges.children', 'Enfants')}
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'global' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('parent.badges.availableGlobal', 'Badges disponibles')}
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('parent.badges.create', 'Créer un Badge')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {globalBadges.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{badge.icon}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                      {t(`parent.badges.rarity.${badge.rarity}`, badge.rarity)}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{badge.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{badge.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {t('parent.badges.pointsRequired', '{{points}} points', { points: badge.pointsRequired })}
                    </span>
                    <button
                      onClick={() => handleImportBadge(badge.id)}
                      disabled={importBadgeMutation.isPending}
                      className="btn btn-sm btn-outline"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {t('parent.badges.import', 'Importer')}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'group' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('parent.badges.groupBadges', 'Badges de votre groupe')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupBadges.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{badge.icon}</div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                        {t(`parent.badges.rarity.${badge.rarity}`, badge.rarity)}
                      </span>
                      <button
                        onClick={() => handleToggleBadge(badge.id, !badge.isEnabled)}
                        className={`p-1 rounded ${
                          badge.isEnabled 
                            ? 'text-green-600 hover:bg-green-100' 
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {badge.isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{badge.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{badge.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      {getUnlockTypeIcon(badge.unlockType)}
                      <span>{t(`parent.badges.unlockType.${badge.unlockType}`, badge.unlockType)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {t('parent.badges.pointsRequired', '{{points}} points', { points: badge.pointsRequired })}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingBadge(badge)}
                          className="btn btn-sm btn-outline"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleBadge(badge.id, !badge.isEnabled)}
                          className={`btn btn-sm ${
                            badge.isEnabled ? 'btn-outline' : 'btn-primary'
                          }`}
                        >
                          {badge.isEnabled ? 'Désactiver' : 'Activer'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'children' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('parent.badges.childrenManagement', 'Gestion des enfants')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-xl">{child.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{child.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('parent.badges.points', '{{points}} points', { points: child.totalPointsEarned || 0 })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                      {t('parent.badges.unlockManually', 'Débloquer manuellement')}
                    </h4>
                    <div className="space-y-1">
                      {groupBadges.filter(b => b.isEnabled).slice(0, 3).map((badge) => (
                        <button
                          key={badge.id}
                          onClick={() => handleUnlockBadge(child.id, badge.id)}
                          className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-sm flex items-center gap-2"
                        >
                          <span>{badge.icon}</span>
                          <span className="flex-1">{badge.name}</span>
                          <Trophy className="w-4 h-4 text-yellow-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
      
      {/* Modal de création/édition de badge */}
      <CreateBadgeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={(badgeData) => {
          createBadgeMutation.mutate(badgeData);
          setShowCreateModal(false);
        }}
        editingBadge={null}
      />
    </div>
  );
}
