import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { tasksApi, childrenApi, assignmentsApi, categoriesApi } from '../../lib/api-client';
import { Plus, Calendar, Settings, Play, Pause, Trash2, Edit, ChevronDown, ChevronRight, UserPlus, ListTodo } from 'lucide-react';
import AssignmentCell from '../../components/parent/AssignmentCell';
import CreateAssignmentModal from '../../components/parent/CreateAssignmentModal';
import EditAssignmentModal from '../../components/parent/EditAssignmentModal';
import AddChildModal from '../../components/parent/AddChildModal';
import AddTaskModal from '../../components/parent/AddTaskModal';

export default function AssignmentMatrix() {
  const { getAuthHeader, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Récupérer les catégories disponibles
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', user?.familyId],
    queryFn: () => categoriesApi.getAll(getAuthHeader()),
    enabled: !!user?.familyId,
  });

  // Récupérer les tâches de la famille
  const { data: taskTemplates = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['taskTemplates', user?.familyId],
    queryFn: () => tasksApi.getTemplates(getAuthHeader()),
    enabled: !!user?.familyId,
  });

  // Récupérer les enfants de la famille
  const { data: children = [], isLoading: childrenLoading } = useQuery({
    queryKey: ['children', user?.familyId],
    queryFn: () => childrenApi.getAll(getAuthHeader()),
    enabled: !!user?.familyId,
  });

  // Récupérer toutes les assignations de la famille
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments', user?.familyId],
    queryFn: () => assignmentsApi.getFamilyAssignments(getAuthHeader()),
    enabled: !!user?.familyId,
  });

  // Mutation pour supprimer une assignation
  const deleteAssignmentMutation = useMutation({
    mutationFn: (assignmentId) => assignmentsApi.delete(assignmentId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(['assignments', user?.familyId]);
    },
  });

  // Mutation pour toggle le statut d'une assignation
  const toggleAssignmentMutation = useMutation({
    mutationFn: ({ assignmentId, isActive }) => 
      assignmentsApi.update(assignmentId, { isActive }, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(['assignments', user?.familyId]);
    },
  });

  const handleCreateAssignment = (task, child) => {
    setSelectedTask(task);
    setSelectedChild(child);
    setShowCreateModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setShowEditModal(true);
  };

  const handleDeleteAssignment = (assignmentId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette assignation ?')) {
      deleteAssignmentMutation.mutate(assignmentId);
    }
  };

  const handleToggleAssignment = (assignmentId, isActive) => {
    toggleAssignmentMutation.mutate({ assignmentId, isActive: !isActive });
  };

  const getAssignmentForTaskChild = (taskId, childId) => {
    return assignments.find(
      assignment => assignment.taskTemplateId === taskId && assignment.childId === childId
    );
  };

  // Regrouper les tâches par catégorie et les trier
  const tasksByCategory = taskTemplates.reduce((acc, task) => {
    // Trouver la catégorie de la tâche
    const category = categories.find(cat => cat.id === task.categoryId);
    if (!category) return acc;
    
    const categoryKey = category.id;
    if (!acc[categoryKey]) {
      acc[categoryKey] = {
        category: category,
        tasks: []
      };
    }
    acc[categoryKey].tasks.push(task);
    return acc;
  }, {});

  // Trier les catégories : système d'abord, puis personnalisées, par ordre alphabétique
  const sortedCategories = Object.values(tasksByCategory).sort((a, b) => {
    // Catégories système en premier
    if (a.category.isSystem && !b.category.isSystem) return -1;
    if (!a.category.isSystem && b.category.isSystem) return 1;
    
    // Puis tri alphabétique par display
    return a.category.display.localeCompare(b.category.display);
  });

  // Trier les tâches dans chaque catégorie : par points (décroissant) puis par titre (alphabétique)
  sortedCategories.forEach(categoryGroup => {
    categoryGroup.tasks.sort((a, b) => {
      if (a.points !== b.points) {
        return b.points - a.points; // Points décroissants
      }
      return a.title.localeCompare(b.title); // Titre alphabétique
    });
  });

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const getRecurrenceText = (recurrence) => {
    switch (recurrence) {
      case 'daily': return 'Quotidien';
      case 'weekday': return 'Jours de semaine';
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuel';
      default: return 'Personnalisé';
    }
  };

  if (tasksLoading || childrenLoading || assignmentsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Chargement du tableau d'assignations...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau d'Assignations</h1>
              <p className="text-gray-600 mt-2">
                Gérez les assignations de tâches pour tous vos enfants en un coup d'œil
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                {taskTemplates.length} tâches • {children.length} enfants
              </div>
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setShowAddChildModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Ajouter un enfant</span>
            </button>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ListTodo className="w-4 h-4" />
              <span>Ajouter une tâche</span>
            </button>
          </div>
        </div>

        {/* Tableau croisé avec en-têtes figés */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-auto max-h-[70vh]">
            <table className="w-full">
              {/* En-têtes des colonnes (enfants) - FIGÉS */}
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="w-80 px-6 py-4 text-left text-sm font-semibold text-gray-900 border-r bg-gray-50 sticky left-0 z-20">
                    Tâches
                  </th>
                  {children.map(child => (
                    <th key={child.id} className="w-48 px-4 py-4 text-center border-r last:border-r-0 bg-gray-50">
                      <div className="flex flex-col items-center">
                        <div className="font-semibold text-gray-900">{child.name}</div>
                        <div className="text-sm text-gray-500">{child.age} ans</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Corps du tableau avec accordéons par catégorie */}
              <tbody>
                {sortedCategories.map(categoryGroup => {
                  const { category, tasks } = categoryGroup;
                  const isExpanded = expandedCategories[category.id] !== false; // Par défaut ouvert
                  
                  return (
                    <React.Fragment key={category.id}>
                    {/* En-tête de catégorie */}
                    <tr className="bg-gray-100">
                      <td 
                        className="px-6 py-3 border-r sticky left-0 z-10 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className="font-semibold text-gray-900">
                              {category.display}
                            </span>
                            <span className="text-sm text-gray-500">({tasks.length} tâches)</span>
                          </div>
                        </div>
                      </td>
                      {children.map(child => (
                        <td key={`header-${child.id}`} className="px-4 py-3 border-r last:border-r-0 bg-gray-100"></td>
                      ))}
                    </tr>

                    {/* Tâches de la catégorie */}
                    {isExpanded && tasks.map((task, index) => (
                      <tr key={task.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {/* Colonne des tâches */}
                        <td className="px-6 py-4 border-r sticky left-0 z-10 bg-inherit">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{task.icon || category.icon}</div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{task.title}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <span>{category.display}</span>
                                <span>•</span>
                                <span>{getRecurrenceText(task.recurrence)}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <span>{task.points}</span>
                                  <span className="text-yellow-500">⭐</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Cellules d'assignation pour chaque enfant */}
                        {children.map(child => (
                          <td key={`${task.id}-${child.id}`} className="px-4 py-4 text-center border-r last:border-r-0">
                            <AssignmentCell
                              task={task}
                              child={child}
                              assignment={getAssignmentForTaskChild(task.id, child.id)}
                              onCreateAssignment={() => handleCreateAssignment(task, child)}
                              onEditAssignment={handleEditAssignment}
                              onDeleteAssignment={handleDeleteAssignment}
                              onToggleAssignment={handleToggleAssignment}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateAssignmentModal
          task={selectedTask}
          child={selectedChild}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedTask(null);
            setSelectedChild(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries(['assignments', user?.familyId]);
            setShowCreateModal(false);
            setSelectedTask(null);
            setSelectedChild(null);
          }}
        />
      )}

      {showEditModal && editingAssignment && (
        <EditAssignmentModal
          assignment={editingAssignment}
          onClose={() => {
            setShowEditModal(false);
            setEditingAssignment(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries(['assignments', user?.familyId]);
            setShowEditModal(false);
            setEditingAssignment(null);
          }}
        />
      )}

      {showAddChildModal && (
        <AddChildModal
          onClose={() => setShowAddChildModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries(['children', user?.familyId]);
            setShowAddChildModal(false);
          }}
        />
      )}

      {showAddTaskModal && (
        <AddTaskModal
          onClose={() => setShowAddTaskModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries(['taskTemplates', user?.familyId]);
            setShowAddTaskModal(false);
          }}
        />
      )}
    </div>
  );
}
