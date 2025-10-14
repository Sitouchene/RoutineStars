import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Calendar, Play, Pause } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { assignmentsApi } from '../../lib/api-client';

export default function EditAssignmentModal({ assignment, onClose, onSuccess }) {
  const { getAuthHeader, user } = useAuthStore();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    isActive: true,
    recurrence: '',
    recurrenceDays: [],
    recurrenceStartDate: '',
    recurrenceInterval: 2,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (assignment) {
      setFormData({
        startDate: assignment.startDate.split('T')[0],
        endDate: assignment.endDate.split('T')[0],
        isActive: assignment.isActive,
        recurrence: assignment.recurrence || '',
        recurrenceDays: assignment.recurrenceDays ? assignment.recurrenceDays.split(',').map(s=>parseInt(s,10)) : [],
        recurrenceStartDate: assignment.recurrenceStartDate ? assignment.recurrenceStartDate.split('T')[0] : '',
        recurrenceInterval: assignment.recurrenceInterval || 2,
      });
    }
  }, [assignment]);

  const updateAssignmentMutation = useMutation({
    mutationFn: (data) => assignmentsApi.update(assignment.id, data, getAuthHeader()),
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

    const updateData = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
      recurrence: formData.recurrence || undefined,
      recurrenceDays: formData.recurrence === 'weekly_days' ? formData.recurrenceDays : undefined,
      recurrenceStartDate: formData.recurrence === 'every_n_days' ? formData.recurrenceStartDate : undefined,
      recurrenceInterval: formData.recurrence === 'every_n_days' ? Number(formData.recurrenceInterval) : undefined,
    };

    updateAssignmentMutation.mutate(updateData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));
  };

  if (!assignment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{t('common.edit')} {t('assignments.task')}</h3>
            <p className="text-gray-600 mt-1">
              {t('assignments.manage.subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Récurrence spécifique à l'assignation (optionnelle) */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">{t('tasks.recurrence')} ({t('common.optional')})</label>
          <select
            name="recurrence"
            value={formData.recurrence}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">{t('tasks.recurrence.custom')}</option>
            <option value="weekly_days">{t('tasks.recurrence.weekly_days_label')}</option>
            <option value="every_n_days">{t('tasks.recurrence.every_n_days_label')}</option>
          </select>

          {formData.recurrence === 'weekly_days' && (
            <div className="flex flex-wrap gap-2">
              {[0,1,2,3,4,5,6].map(d => (
                <label key={d} className={`px-3 py-1 rounded-full border cursor-pointer text-sm ${formData.recurrenceDays.includes(d) ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-300 text-gray-700'}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.recurrenceDays.includes(d)}
                    onChange={() => {
                      setFormData(prev => ({
                        ...prev,
                        recurrenceDays: prev.recurrenceDays.includes(d)
                          ? prev.recurrenceDays.filter(x => x !== d)
                          : [...prev.recurrenceDays, d]
                      }));
                    }}
                  />
                  {['D','L','M','M','J','V','S'][d]}
                </label>
              ))}
            </div>
          )}

          {formData.recurrence === 'every_n_days' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('assignModal.startDate')}</label>
                <input
                  type="date"
                  name="recurrenceStartDate"
                  value={formData.recurrenceStartDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('tasks.recurrence.every_n_days_label')}</label>
                <input
                  type="number"
                  name="recurrenceInterval"
                  min={1}
                  value={formData.recurrenceInterval}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
        {/* Informations de l'assignation */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{assignment.taskTemplate?.icon}</div>
            <div>
              <h4 className="font-semibold text-gray-900">{assignment.taskTemplate?.title}</h4>
              <p className="text-sm text-gray-600">
                {assignment.child?.name} • {assignment.taskTemplate?.points} {t('tasks.pointsSuffix')}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('assignModal.startDate')}
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
                {t('assignModal.endDate')}
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
                  {t('assignModal.activateNow')}
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
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
              disabled={updateAssignmentMutation.isPending}
            >
              {updateAssignmentMutation.isPending ? t('common.loading') : t('common.edit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}