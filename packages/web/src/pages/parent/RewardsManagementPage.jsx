import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Settings, 
  Users, 
  Gift, 
  Star, 
  StarOff, 
  Eye, 
  EyeOff,
  Download,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { rewardsApi } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../components/ui/Toast';
import { useConfirm } from '../../components/ui/ConfirmModal';
import CreateRewardModal from '../../components/parent/CreateRewardModal';

/**
 * Page de gestion des récompenses pour les parents
 */
export default function RewardsManagementPage() {
  const { t } = useTranslation();
  const { user, getAuthHeader } = useAuthStore();
  const queryClient = useQueryClient();
  const { success, error, ToastContainer } = useToast();

  const [activeTab, setActiveTab] = useState('global');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);

  // Charger les récompenses globales
  const { data: globalRewards = [], isLoading: loadingGlobal } = useQuery({
    queryKey: ['globalRewards'],
    queryFn: () => rewardsApi.getAllGlobal(),
  });

  // Charger les récompenses du groupe
  const { data: groupRewards = [], isLoading: loadingGroup } = useQuery({
    queryKey: ['groupRewards', user?.groupId],
    queryFn: () => rewardsApi.getGroup(user.groupId, getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Charger les échanges en attente
  const { data: pendingRedemptions = [] } = useQuery({
    queryKey: ['pendingRedemptions', user?.groupId],
    queryFn: () => rewardsApi.getPendingRedemptions(user.groupId, getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Mutation pour importer une récompense globale
  const importRewardMutation = useMutation({
    mutationFn: (globalRewardId) => 
      rewardsApi.importGlobal(user.groupId, globalRewardId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupRewards'] });
      success(t('parent.rewards.imported', 'Récompense importée avec succès !'));
    },
    onError: (err) => error(err.message),
  });

  // Mutation pour créer une récompense personnalisée
  const createRewardMutation = useMutation({
    mutationFn: (rewardData) => 
      rewardsApi.createCustom(user.groupId, rewardData, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupRewards'] });
      success(t('parent.rewards.created', 'Récompense créée avec succès !'));
      setShowCreateModal(false);
    },
    onError: (err) => error(err.message),
  });

  // Mutation pour activer/désactiver une récompense
  const toggleRewardMutation = useMutation({
    mutationFn: ({ rewardId, isEnabled }) => 
      rewardsApi.toggle(rewardId, isEnabled, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupRewards'] });
      success(t('parent.rewards.toggled', 'Récompense mise à jour !'));
    },
    onError: (err) => error(err.message),
  });

  // Mutation pour mettre à jour le statut d'un échange
  const updateRedemptionMutation = useMutation({
    mutationFn: ({ redemptionId, status, parentComment }) => 
      rewardsApi.updateRedemptionStatus(redemptionId, status, parentComment, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRedemptions'] });
      success(t('parent.rewards.statusUpdated', 'Statut mis à jour !'));
    },
    onError: (err) => error(err.message),
  });

  const handleImportReward = (globalRewardId) => {
    importRewardMutation.mutate(globalRewardId);
  };

  const handleToggleReward = (rewardId, isEnabled) => {
    toggleRewardMutation.mutate({ rewardId, isEnabled });
  };

  const handleUpdateRedemption = (redemptionId, status, parentComment = '') => {
    updateRedemptionMutation.mutate({ redemptionId, status, parentComment });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'toy': return 'text-pink-600 bg-pink-100';
      case 'activity': return 'text-blue-600 bg-blue-100';
      case 'privilege': return 'text-purple-600 bg-purple-100';
      case 'special': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'denied': return 'text-red-600 bg-red-100';
      case 'fulfilled': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('parent.rewards.management', 'Gestion des Récompenses')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('parent.rewards.description', 'Gérez les récompenses disponibles pour votre groupe')}
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
                {t('parent.rewards.global', 'Récompenses Globales')}
              </button>
              <button
                onClick={() => setActiveTab('group')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'group'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('parent.rewards.group', 'Récompenses du Groupe')}
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('parent.rewards.pending', 'Échanges en Attente')}
                {pendingRedemptions.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {pendingRedemptions.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'global' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('parent.rewards.availableGlobal', 'Récompenses disponibles')}
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('parent.rewards.create', 'Créer une Récompense')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {globalRewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{reward.icon}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(reward.category)}`}>
                      {t(`parent.rewards.category.${reward.category}`, reward.category)}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{reward.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{reward.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {t('parent.rewards.cost', '{{cost}} points', { cost: reward.cost })}
                    </span>
                    <button
                      onClick={() => handleImportReward(reward.id)}
                      disabled={importRewardMutation.isPending}
                      className="btn btn-sm btn-outline"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {t('parent.rewards.import', 'Importer')}
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
              {t('parent.rewards.groupRewards', 'Récompenses de votre groupe')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupRewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{reward.icon}</div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(reward.category)}`}>
                        {t(`parent.rewards.category.${reward.category}`, reward.category)}
                      </span>
                      <button
                        onClick={() => handleToggleReward(reward.id, !reward.isEnabled)}
                        className={`p-1 rounded ${
                          reward.isEnabled 
                            ? 'text-green-600 hover:bg-green-100' 
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {reward.isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{reward.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{reward.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {t('parent.rewards.cost', '{{cost}} points', { cost: reward.cost })}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingReward(reward)}
                        className="btn btn-sm btn-outline"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleReward(reward.id, !reward.isEnabled)}
                        className={`btn btn-sm ${
                          reward.isEnabled ? 'btn-outline' : 'btn-primary'
                        }`}
                      >
                        {reward.isEnabled ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('parent.rewards.pendingRedemptions', 'Échanges en attente')}
            </h2>

            <div className="space-y-4">
              {pendingRedemptions.map((redemption) => (
                <motion.div
                  key={redemption.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-xl">{redemption.user.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{redemption.user.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t('parent.rewards.requested', 'A demandé')} {redemption.reward.name}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(redemption.status)}`}>
                      {t(`parent.rewards.status.${redemption.status}`, redemption.status)}
                    </span>
                  </div>

                  {redemption.childComment && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>{t('parent.rewards.childComment', 'Commentaire de l\'enfant')}:</strong> {redemption.childComment}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(redemption.redeemedAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateRedemption(redemption.id, 'denied')}
                        className="btn btn-sm btn-outline text-red-600 hover:bg-red-50"
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        {t('parent.rewards.deny', 'Refuser')}
                      </button>
                      <button
                        onClick={() => handleUpdateRedemption(redemption.id, 'approved')}
                        className="btn btn-sm btn-primary"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {t('parent.rewards.approve', 'Approuver')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {pendingRedemptions.length === 0 && (
                <div className="text-center py-12">
                  <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('parent.rewards.noPending', 'Aucun échange en attente')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
      
      {/* Modal de création/édition de récompense */}
      <CreateRewardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={(rewardData) => {
          createRewardMutation.mutate(rewardData);
          setShowCreateModal(false);
        }}
        editingReward={null}
      />
    </div>
  );
}
