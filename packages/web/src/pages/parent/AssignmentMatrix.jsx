import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null); // Pour afficher les détails en mobile

  // Récupérer les catégories disponibles
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', user?.groupId],
    queryFn: () => categoriesApi.getAll(getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Récupérer les tâches de la famille
  const { data: taskTemplates = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['taskTemplates', user?.groupId],
    queryFn: () => tasksApi.getTemplates(getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Récupérer les enfants de la famille
  const { data: children = [], isLoading: childrenLoading } = useQuery({
    queryKey: ['children', user?.groupId],
    queryFn: () => childrenApi.getAll(getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Récupérer toutes les assignations de la famille
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments', user?.groupId],
    queryFn: () => assignmentsApi.getGroupAssignments(getAuthHeader()),
    enabled: !!user?.groupId,
  });

  // Mutation pour supprimer une assignation
  const deleteAssignmentMutation = useMutation({
    mutationFn: (assignmentId) => assignmentsApi.delete(assignmentId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(['assignments', user?.groupId]);
    },
  });

  // Mutation pour toggle le statut d'une assignation
  const toggleAssignmentMutation = useMutation({
    mutationFn: ({ assignmentId, isActive }) => 
      assignmentsApi.update(assignmentId, { isActive }, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(['assignments', user?.groupId]);
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

  // Détecter si on est sur mobile
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getRecurrenceText = (recurrence) => {
    switch (recurrence) {
      case 'daily': return t('tasks.recurrence.daily');
      case 'weekday': return t('tasks.recurrence.weekday');
      case 'weekly': return t('tasks.recurrence.weekly');
      case 'monthly': return t('tasks.recurrence.monthly');
      default: return t('tasks.recurrence.custom');
    }
  };

  const handleTaskClick = (task, category) => {
    if (isMobile) {
      setSelectedTaskDetails({ task, category });
    }
  };

  if (tasksLoading || childrenLoading || assignmentsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-500 mb-4">{t('matrix.loading')}</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-4 md:p-6 mb-4 md:mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{t('matrix.header.title')}</h1>
              <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
                {isMobile ? t('assignments.descriptionMobile') : t('matrix.header.subtitle')}
              </p>
            </div>
            <div className="text-xs md:text-sm text-gray-500">
              {t('assignments.tasksCount', { count: taskTemplates.length })} • {children.length} {isMobile ? t('dashboard.members.children') : (children.length > 1 ? t('dashboard.members.children') : 'enfant')}
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 mt-3 md:mt-4">
            <button
              onClick={() => setShowAddChildModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-sm md:text-base"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('assignments.addChild')}</span>
            </button>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors text-sm md:text-base"
            >
              <ListTodo className="w-4 h-4" />
              <span>{t('assignments.addTask')}</span>
            </button>
          </div>
        </div>

        {/* Barre d'état des détails (Mobile) */}
        {isMobile && selectedTaskDetails && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border-2 border-primary-500">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-3xl">{selectedTaskDetails.task.icon || selectedTaskDetails.category.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{selectedTaskDetails.task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedTaskDetails.task.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>{selectedTaskDetails.category.display}</span>
                    <span>•</span>
              <span>{getRecurrenceText(selectedTaskDetails.task.recurrence)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="font-semibold text-yellow-600">{selectedTaskDetails.task.points}</span>
                      <span>⭐</span>
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTaskDetails(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Tableau croisé avec en-têtes figés */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-auto max-h-[70vh]">
            <table className="w-full">
              {/* En-têtes des colonnes (enfants) - FIGÉS */}
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className={`${isMobile ? 'w-24 px-2' : 'w-80 px-6'} py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 border-r bg-gray-50 sticky left-0 z-20`}>
                    {isMobile ? t('assignments.task') : t('assignments.tasks')}
                  </th>
                  {children.map(child => (
                    <th key={child.id} className={`${isMobile ? 'w-16 px-1' : 'w-48 px-4'} py-2 md:py-4 text-center border-r last:border-r-0 bg-gray-50`}>
                      <div className="flex flex-col items-center">
                        <div className={`font-semibold text-gray-900 ${isMobile ? 'text-xs truncate max-w-[60px]' : 'text-sm'}`}>{child.name}</div>
                        {!isMobile && <div className="text-sm text-gray-500">{t('children.age', { count: child.age })}</div>}
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
                        className={`${isMobile ? 'px-2 py-2' : 'px-6 py-3'} border-r sticky left-0 z-10 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors`}
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-3'}`}>
                          {isExpanded ? (
                            <ChevronDown className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-gray-600`} />
                          ) : (
                            <ChevronRight className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-gray-600`} />
                          )}
                          <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
                            <span className={`${isMobile ? 'text-base' : 'text-lg'}`}>{category.icon}</span>
                            {!isMobile && (
                              <>
                                <span className="font-semibold text-gray-900">{category.display}</span>
                                <span className="text-sm text-gray-500">({tasks.length})</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      {children.map(child => (
                        <td key={`header-${child.id}`} className={`${isMobile ? 'px-1 py-2' : 'px-4 py-3'} border-r last:border-r-0 bg-gray-100`}></td>
                      ))}
                    </tr>

                    {/* Tâches de la catégorie */}
                    {isExpanded && tasks.map((task, index) => (
                      <tr key={task.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {/* Colonne des tâches */}
                        <td 
                          className={`${isMobile ? 'px-2 py-2' : 'px-6 py-4'} border-r sticky left-0 z-10 bg-inherit ${isMobile ? 'cursor-pointer' : ''}`}
                          onClick={() => handleTaskClick(task, category)}
                        >
                          {isMobile ? (
                            // Version mobile : Icône + Points seulement
                            <div className="flex flex-col items-center gap-1">
                              <div className="text-xl">{task.icon || category.icon}</div>
                              <div className="flex items-center gap-0.5 text-xs">
                                <span className="font-semibold text-yellow-600">{task.points}</span>
                                <span className="text-yellow-500">⭐</span>
                              </div>
                            </div>
                          ) : (
                            // Version desktop : Tout affiché
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
                          )}
                        </td>

                        {/* Cellules d'assignation pour chaque enfant */}
                        {children.map(child => (
                          <td key={`${task.id}-${child.id}`} className={`${isMobile ? 'px-1 py-2' : 'px-4 py-4'} text-center border-r last:border-r-0`}>
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
            queryClient.invalidateQueries(['assignments', user?.groupId]);
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
            queryClient.invalidateQueries(['assignments', user?.groupId]);
            setShowEditModal(false);
            setEditingAssignment(null);
          }}
        />
      )}

      {showAddChildModal && (
        <AddChildModal
          onClose={() => setShowAddChildModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries(['children', user?.groupId]);
            setShowAddChildModal(false);
          }}
        />
      )}

      {showAddTaskModal && (
        <AddTaskModal
          onClose={() => setShowAddTaskModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries(['taskTemplates', user?.groupId]);
            setShowAddTaskModal(false);
          }}
        />
      )}
    </div>
  );
}
