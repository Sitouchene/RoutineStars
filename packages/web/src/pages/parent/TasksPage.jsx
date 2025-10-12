import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { tasksApi } from '../../lib/api-client';
import { TASK_CATEGORIES, TASK_ICONS } from 'shared/constants';
import AddTaskModal from '../../components/parent/AddTaskModal';
import EditTaskModal from '../../components/parent/EditTaskModal';

export default function TasksPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { getAuthHeader, user } = useAuthStore();
  const queryClient = useQueryClient();

  // Récupérer la liste des templates de tâches
  const {
    data: taskTemplates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['taskTemplates', user?.familyId],
    queryFn: () => tasksApi.getTemplates(getAuthHeader()),
    enabled: !!user?.familyId,
  });

  // Mutation pour supprimer un template
  const deleteTaskMutation = useMutation({
    mutationFn: templateId => tasksApi.deleteTemplate(templateId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskTemplates', user?.familyId] });
    },
  });

  const handleDelete = async templateId => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template de tâche ?')) {
      try {
        await deleteTaskMutation.mutateAsync(templateId);
      } catch (error) {
        alert('Erreur lors de la suppression : ' + error.message);
      }
    }
  };

  const getCategoryIcon = category => {
    return TASK_ICONS[category] || '📋';
  };

  const getCategoryName = category => {
    const names = {
      [TASK_CATEGORIES.ROUTINE]: 'Routine',
      [TASK_CATEGORIES.MAISON]: 'Maison',
      [TASK_CATEGORIES.ETUDES]: 'Études',
    };
    return names[category] || category;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des tâches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          Erreur lors du chargement des tâches
        </div>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['taskTemplates', user?.familyId] })}
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
          <h2 className="text-2xl font-bold text-gray-900">Gestion des tâches</h2>
          <p className="text-gray-600">
            Créez et gérez les modèles de tâches pour vos enfants
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Créer une tâche
        </button>
      </div>

      {/* Liste des templates de tâches */}
      {taskTemplates.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune tâche créée
          </h3>
          <p className="text-gray-500 mb-6">
            Commencez par créer votre premier modèle de tâche
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            Créer ma première tâche
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taskTemplates.map(template => (
            <div key={template.id} className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-blue-500">
              {/* Ligne principale : Icône + Titre + Points */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {template.icon || getCategoryIcon(template.category)}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {template.title}
                    </h3>
                    {template.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {template.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Points en haut à droite */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs text-gray-500">
                    {template.points} pts
                  </span>
                </div>
              </div>

              {/* Ligne de séparation */}
              <div className="border-t border-gray-200 mb-3"></div>

              {/* Ligne inférieure : Récurrence + Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{template.recurrence}</span>
                </div>
                
                {/* Boutons d'action */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingTask(template)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                    disabled={deleteTaskMutation.isPending}
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
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            queryClient.invalidateQueries({ queryKey: ['taskTemplates', user?.familyId] });
          }}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSuccess={() => {
            setEditingTask(null);
            queryClient.invalidateQueries({ queryKey: ['taskTemplates', user?.familyId] });
          }}
        />
      )}
    </div>
  );
}
