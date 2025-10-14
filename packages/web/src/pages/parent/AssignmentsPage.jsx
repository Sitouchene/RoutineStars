import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Calendar, User, Play, Pause } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { assignmentsApi, childrenApi, tasksApi } from '../../lib/api-client';
import { TASK_ICONS, TASK_CATEGORIES } from 'shared/constants';
import AssignTaskModal from '../../components/parent/AssignTaskModal';
import EditAssignmentModal from '../../components/parent/EditAssignmentModal';

export default function AssignmentsPage() {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const { getAuthHeader, user } = useAuthStore();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Récupérer les assignations de la famille
  const {
    data: assignments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['assignments', user?.groupId],
    queryFn: () => assignmentsApi.getAll(getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Récupérer les enfants pour les statistiques
  const { data: children = [] } = useQuery({
    queryKey: ['children', user?.groupId],
    queryFn: () => childrenApi.getAll(getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Mutation pour supprimer une assignation
  const deleteAssignmentMutation = useMutation({
    mutationFn: assignmentId => assignmentsApi.delete(assignmentId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', user?.groupId] });
    },
  });

  // Mutation pour activer/désactiver une assignation
  const toggleAssignmentMutation = useMutation({
    mutationFn: ({ assignmentId, isActive }) => 
      assignmentsApi.update(assignmentId, { isActive }, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', user?.groupId] });
    },
  });

  // Mutation pour générer les tâches quotidiennes
  const generateTasksMutation = useMutation({
    mutationFn: ({ childId, date }) => 
      assignmentsApi.generateDaily(childId, date, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', user?.groupId] });
    },
  });

  const handleDelete = async assignmentId => {
    if (window.confirm(t('assignments.deleteConfirm'))) {
      try {
        await deleteAssignmentMutation.mutateAsync(assignmentId);
      } catch (error) {
        alert(t('common.error') + ' : ' + error.message);
      }
    }
  };

  const handleToggleActive = async (assignmentId, isActive) => {
    try {
      await toggleAssignmentMutation.mutateAsync({ assignmentId, isActive: !isActive });
    } catch (error) {
      alert('Erreur lors de la modification : ' + error.message);
    }
  };

  const handleGenerateTasks = async (childId) => {
    try {
      await generateTasksMutation.mutateAsync({ 
        childId, 
        date: new Date().toISOString().split('T')[0] 
      });
      alert('Tâches générées avec succès !');
    } catch (error) {
      alert('Erreur lors de la génération : ' + error.message);
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

  const formatDate = date => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const isAssignmentActive = assignment => {
    const today = new Date();
    const startDate = new Date(assignment.startDate);
    const endDate = assignment.endDate ? new Date(assignment.endDate) : null;
    
    return assignment.isActive && 
           startDate <= today && 
           (!endDate || endDate >= today);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('assignments.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          {t('assignments.error')}
        </div>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['assignments', user?.groupId] })}
          className="btn btn-primary"
        >
          {t('assignments.retry')}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('assignments.manage.title')}</h2>
          <p className="text-gray-600">
            {t('assignments.manage.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setShowAssignModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t('assignments.assignTaskCta')}
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="font-semibold text-lg mb-2">{t('assignments.stats.children')}</h3>
          <p className="text-3xl font-bold text-primary-600">{children.length}</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-lg mb-2">{t('assignments.stats.active')}</h3>
          <p className="text-3xl font-bold text-primary-600">
            {assignments.filter(isAssignmentActive).length}
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-lg mb-2">{t('assignments.stats.total')}</h3>
          <p className="text-3xl font-bold text-primary-600">{assignments.length}</p>
        </div>
      </div>

      {/* Liste des assignations */}
      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('assignments.none')}
          </h3>
          <p className="text-gray-500 mb-6">
            {t('assignments.noneDesc')}
          </p>
          <button
            onClick={() => setShowAssignModal(true)}
            className="btn btn-primary"
          >
            {t('assignments.createFirst')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map(assignment => (
            <div key={assignment.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {assignment.taskTemplate.icon || getCategoryIcon(assignment.taskTemplate.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {assignment.taskTemplate.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{assignment.child.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(assignment.startDate)}
                          {assignment.endDate && ` - ${formatDate(assignment.endDate)}`}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        isAssignmentActive(assignment)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isAssignmentActive(assignment) ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleGenerateTasks(assignment.child.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title={t('assignments.generateToday')}
                    disabled={generateTasksMutation.isPending}
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleToggleActive(assignment.id, assignment.isActive)}
                    className={`p-2 transition-colors ${
                      assignment.isActive
                        ? 'text-gray-400 hover:text-orange-600'
                        : 'text-gray-400 hover:text-green-600'
                    }`}
                    title={assignment.isActive ? t('assignments.deactivate') : t('assignments.activate')}
                    disabled={toggleAssignmentMutation.isPending}
                  >
                    {assignment.isActive ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setEditingAssignment(assignment)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title={t('common.edit')}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(assignment.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title={t('common.delete')}
                    disabled={deleteAssignmentMutation.isPending}
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
      {showAssignModal && (
        <AssignTaskModal
          onClose={() => setShowAssignModal(false)}
          onSuccess={() => {
            setShowAssignModal(false);
            queryClient.invalidateQueries({ queryKey: ['assignments', user?.groupId] });
          }}
        />
      )}

      {editingAssignment && (
        <EditAssignmentModal
          assignment={editingAssignment}
          onClose={() => setEditingAssignment(null)}
          onSuccess={() => {
            setEditingAssignment(null);
            queryClient.invalidateQueries({ queryKey: ['assignments', user?.groupId] });
          }}
        />
      )}
    </div>
  );
}
