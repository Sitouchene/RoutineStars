import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, User, Bell } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { childrenApi } from '../../lib/api-client';
import AddChildModal from '../../components/parent/AddChildModal';
import { seedToAvatarUrl } from '../../utils/avatarUtils';
import EditChildModal from '../../components/parent/EditChildModal';

export default function ChildrenPage() {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const { getAuthHeader, user } = useAuthStore();
  const queryClient = useQueryClient();

  // Récupérer la liste des enfants
  const {
    data: children = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['children', user?.groupId],
    queryFn: () => childrenApi.getAll(getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Mutation pour supprimer un enfant
  const deleteChildMutation = useMutation({
    mutationFn: childId => childrenApi.delete(childId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children', user?.groupId] });
    },
  });

  const handleDelete = async childId => {
    if (window.confirm(t('children.deleteConfirm'))) {
      try {
        await deleteChildMutation.mutateAsync(childId);
      } catch (error) {
        alert(t('common.error') + ' : ' + error.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          {t('common.error')}
        </div>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['children', user?.familyId] })}
          className="btn btn-primary"
        >
          {t('common.retry') || 'Réessayer'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{t('children.title')}</h2>
          <p className="text-sm md:text-base text-gray-600">
            {t('children.description')}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">{t('children.add')}</span>
          <span className="sm:hidden">{t('common.add')}</span>
        </button>
      </div>

      {/* Liste des enfants */}
      {children.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('children.none')}
          </h3>
          <p className="text-gray-500 mb-6">
            {t('children.noneDesc')}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            {t('children.addFirst')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {children.map(child => (
            <div key={child.id} className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border-l-4 border-purple-500">
              {/* Ligne principale : Avatar + Nom + Notifications */}
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg md:text-xl flex-shrink-0">
                    {child.avatar ? (
                      <img
                        src={seedToAvatarUrl(child.avatar) || child.avatar}
                        alt={child.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                      />
                    ) : (
                      '👦'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                      {child.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500">
                      {t('children.age', { count: child.age })}
                    </p>
                  </div>
                </div>
                
                {/* Notifications */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-xs text-gray-500 hidden sm:inline">0</span>
                  <Bell className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Ligne de séparation */}
              <div className="border-t border-gray-200 mb-2 md:mb-3"></div>

              {/* Ligne inférieure : Date + Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="text-xs md:text-sm text-gray-600">
                  {t('children.addedOn', { date: new Date(child.createdAt).toLocaleDateString() })}
                </div>
                
                {/* Boutons d'action */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingChild(child)}
                    className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(child.id)}
                    className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                    disabled={deleteChildMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modales */}
      {showAddModal && (
        <AddChildModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            queryClient.invalidateQueries({ queryKey: ['children', user?.familyId] });
          }}
        />
      )}

      {editingChild && (
        <EditChildModal
          child={editingChild}
          onClose={() => setEditingChild(null)}
          onSuccess={() => {
            setEditingChild(null);
            queryClient.invalidateQueries({ queryKey: ['children', user?.familyId] });
          }}
        />
      )}
    </div>
  );
}
