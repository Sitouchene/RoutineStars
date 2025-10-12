import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, User, Bell } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { childrenApi } from '../../lib/api-client';
import AddChildModal from '../../components/parent/AddChildModal';
import { seedToAvatarUrl } from '../../utils/avatarUtils';
import EditChildModal from '../../components/parent/EditChildModal';

export default function ChildrenPage() {
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
    queryKey: ['children', user?.familyId],
    queryFn: () => childrenApi.getAll(getAuthHeader()),
    enabled: !!user?.familyId,
  });

  // Mutation pour supprimer un enfant
  const deleteChildMutation = useMutation({
    mutationFn: childId => childrenApi.delete(childId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children', user?.familyId] });
    },
  });

  const handleDelete = async childId => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enfant ?')) {
      try {
        await deleteChildMutation.mutateAsync(childId);
      } catch (error) {
        alert('Erreur lors de la suppression : ' + error.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des enfants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          Erreur lors du chargement des enfants
        </div>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['children', user?.familyId] })}
          className="btn btn-primary"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes enfants</h2>
          <p className="text-gray-600">
            Gérez les profils de vos enfants
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter un enfant
        </button>
      </div>

      {/* Liste des enfants */}
      {children.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun enfant ajouté
          </h3>
          <p className="text-gray-500 mb-6">
            Commencez par ajouter le profil de votre premier enfant
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            Ajouter mon premier enfant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map(child => (
            <div key={child.id} className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-purple-500">
              {/* Ligne principale : Avatar + Nom + Notifications */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                    {child.avatar ? (
                      <img
                        src={seedToAvatarUrl(child.avatar) || child.avatar}
                        alt={child.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      '👦'
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {child.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {child.age} ans
                    </p>
                  </div>
                </div>
                
                {/* Notifications */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-xs text-gray-500">0 notifications</span>
                  <Bell className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Ligne de séparation */}
              <div className="border-t border-gray-200 mb-3"></div>

              {/* Ligne inférieure : Date + Actions */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Ajouté le {new Date(child.createdAt).toLocaleDateString('fr-FR')}
                </div>
                
                {/* Boutons d'action */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingChild(child)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(child.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
