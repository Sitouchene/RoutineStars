import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Calendar, Play, Pause } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { assignmentsApi } from '../../lib/api-client';

export default function CreateAssignmentModal({ task, child, onClose, onSuccess }) {
  const { getAuthHeader, user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0], // Aujourd'hui
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Dans 30 jours
    isActive: true,
  });
  const [error, setError] = useState('');

  const createAssignmentMutation = useMutation({
    mutationFn: (data) => assignmentsApi.create(data, getAuthHeader()),
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('La date de fin doit être après la date de début');
      return;
    }

    const assignmentData = {
      taskTemplateId: task.id,
      childId: child.id,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
    };

    createAssignmentMutation.mutate(assignmentData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Assigner une tâche</h3>
            <p className="text-gray-600 mt-1">
              Créer une assignation pour {child.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informations de la tâche */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{task.icon}</div>
            <div>
              <h4 className="font-semibold text-gray-900">{task.title}</h4>
              <p className="text-sm text-gray-600">
                {task.category} • {task.points} points
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <div className="flex items-center gap-2">
                {formData.isActive ? (
                  <Play className="w-4 h-4 text-green-600" />
                ) : (
                  <Pause className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  Assignation active (génération automatique des tâches quotidiennes)
                </span>
              </div>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
              disabled={createAssignmentMutation.isPending}
            >
              {createAssignmentMutation.isPending ? 'Création...' : 'Créer l\'assignation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
