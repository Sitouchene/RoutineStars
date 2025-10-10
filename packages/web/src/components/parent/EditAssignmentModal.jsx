import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { assignmentsApi } from '../../lib/api-client';

export default function EditAssignmentModal({ assignment, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    isActive: true,
  });
  const [error, setError] = useState('');
  const { getAuthHeader } = useAuthStore();

  // Initialiser le formulaire avec les données de l'assignation
  useEffect(() => {
    setFormData({
      startDate: assignment.startDate ? new Date(assignment.startDate).toISOString().split('T')[0] : '',
      endDate: assignment.endDate ? new Date(assignment.endDate).toISOString().split('T')[0] : '',
      isActive: assignment.isActive,
    });
  }, [assignment]);

  const updateAssignmentMutation = useMutation({
    mutationFn: data => assignmentsApi.update(assignment.id, data, getAuthHeader()),
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
    if (!formData.startDate) {
      setError('La date de début est requise');
      return;
    }

    if (formData.endDate && formData.endDate < formData.startDate) {
      setError('La date de fin doit être après la date de début');
      return;
    }

    // Convertir les dates au format ISO datetime
    const updateData = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
    };

    updateAssignmentMutation.mutate(updateData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Modifier l'assignation
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informations de l'assignation */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">
            {assignment.taskTemplate.icon || '📋'} {assignment.taskTemplate.title}
          </h4>
          <p className="text-sm text-gray-600">
            Assignée à <strong>{assignment.child.name}</strong> ({assignment.child.age} ans)
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              Assignation active
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
              disabled={updateAssignmentMutation.isPending}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
              disabled={updateAssignmentMutation.isPending}
            >
              {updateAssignmentMutation.isPending ? 'Modification...' : 'Modifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
