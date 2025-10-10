import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { assignmentsApi, childrenApi, tasksApi } from '../../lib/api-client';

export default function AssignTaskModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    taskTemplateId: '',
    childId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
  });
  const [error, setError] = useState('');
  const { getAuthHeader, user } = useAuthStore();

  // Récupérer les enfants et tâches disponibles
  const { data: children = [] } = useQuery({
    queryKey: ['children', user?.familyId],
    queryFn: () => childrenApi.getAll(getAuthHeader()),
    enabled: !!user?.familyId,
  });

  const { data: taskTemplates = [] } = useQuery({
    queryKey: ['taskTemplates', user?.familyId],
    queryFn: () => tasksApi.getTemplates(getAuthHeader()),
    enabled: !!user?.familyId,
  });

  const assignTaskMutation = useMutation({
    mutationFn: data => assignmentsApi.create(data, getAuthHeader()),
    onSuccess: () => {
      onSuccess();
    },
    onError: error => {
      setError(error.message);
    },
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.taskTemplateId) {
      setError('Veuillez sélectionner une tâche');
      return;
    }

    if (!formData.childId) {
      setError('Veuillez sélectionner un enfant');
      return;
    }

    if (!formData.startDate) {
      setError('La date de début est requise');
      return;
    }

    if (formData.endDate && formData.endDate < formData.startDate) {
      setError('La date de fin doit être après la date de début');
      return;
    }

    // Convertir les dates au format ISO datetime
    const assignmentData = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
    };

    assignTaskMutation.mutate(assignmentData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Assigner une tâche
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tâche *
            </label>
            <select
              name="taskTemplateId"
              value={formData.taskTemplateId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner une tâche</option>
              {taskTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.icon || '📋'} {template.title} ({template.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enfant *
            </label>
            <select
              name="childId"
              value={formData.childId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner un enfant</option>
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} ({child.age} ans)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin (optionnel)
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Laissez vide pour une assignation permanente
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Activer immédiatement cette assignation
            </label>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary"
              disabled={assignTaskMutation.isPending}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
              disabled={assignTaskMutation.isPending}
            >
              {assignTaskMutation.isPending ? 'Assignation...' : 'Assigner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
