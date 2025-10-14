import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { assignmentsApi, childrenApi, tasksApi } from '../../lib/api-client';

export default function AssignTaskModal({ onClose, onSuccess }) {
  const { t } = useTranslation();
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
    queryKey: ['children', user?.groupId],
    queryFn: () => childrenApi.getAll(getAuthHeader()),
    enabled: !!user?.groupId,
  });

  const { data: taskTemplates = [] } = useQuery({
    queryKey: ['taskTemplates', user?.groupId],
    queryFn: () => tasksApi.getTemplates(getAuthHeader()),
    enabled: !!user?.groupId,
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
      setError(t('assignModal.selectTaskRequired'));
      return;
    }

    if (!formData.childId) {
      setError(t('assignModal.selectChildRequired'));
      return;
    }

    if (!formData.startDate) {
      setError(t('assignModal.startDateRequired'));
      return;
    }

    if (formData.endDate && formData.endDate < formData.startDate) {
      setError(t('assignModal.endAfterStart'));
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
            {t('assignModal.title')}
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
              {t('assignModal.taskLabel')} *
            </label>
            <select
              name="taskTemplateId"
              value={formData.taskTemplateId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">{t('assignModal.taskPlaceholder')}</option>
              {taskTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.icon || '📋'} {template.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('assignModal.childLabel')} *
            </label>
            <select
              name="childId"
              value={formData.childId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">{t('assignments.addChild')}</option>
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} ({t('children.age', { count: child.age })})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('assignModal.startDate')} *
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
              {t('assignModal.endDate')} ({t('common.optional')})
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('assignModal.endDateHelp')}
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
              {t('assignModal.activateNow')}
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
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
              disabled={assignTaskMutation.isPending}
            >
              {assignTaskMutation.isPending ? t('assignModal.assigning') : t('assignModal.assign')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
