import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { X, UserPlus, Calendar, Award } from 'lucide-react';
import { readingApi, childrenApi } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';

export default function AssignBookModal({ isOpen, onClose, bookId, bookTitle }) {
  const { t } = useTranslation();
  const { getAuthHeader, user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    childIds: [],
    assignmentType: 'assigned',
    totalPoints: 40,
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
  });

  // Charger les enfants
  const { data: children = [] } = useQuery({
    queryKey: ['children', user?.groupId],
    queryFn: () => childrenApi.getAll(getAuthHeader()),
    enabled: !!user?.groupId
  });

  const assignMutation = useMutation({
    mutationFn: (data) => readingApi.assign(data, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAssignments', user?.groupId] });
      onClose();
      setFormData({
        childIds: [],
        assignmentType: 'assigned',
        totalPoints: 40,
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
      });
      alert('Lecture assignée avec succès !');
    },
    onError: (error) => {
      alert('Erreur: ' + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.childIds.length === 0) {
      alert('Veuillez sélectionner au moins un enfant');
      return;
    }
    
    assignMutation.mutate({
      bookId,
      childIds: formData.childIds,
      assignmentType: formData.assignmentType,
      totalPoints: formData.totalPoints,
      startDate: formData.startDate,
      dueDate: formData.dueDate
    });
  };

  const handleChildToggle = (childId) => {
    setFormData(prev => ({
      ...prev,
      childIds: prev.childIds.includes(childId)
        ? prev.childIds.filter(id => id !== childId)
        : [...prev.childIds, childId]
    }));
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      childIds: prev.childIds.length === children.length ? [] : children.map(child => child.id)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100">
                Assigner une lecture
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {bookTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Children Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enfants
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sm text-brand hover:text-brand/80 font-medium"
              >
                {formData.childIds.length === children.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-xl p-4">
              {children.map(child => (
                <label
                  key={child.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.childIds.includes(child.id)}
                    onChange={() => handleChildToggle(child.id)}
                    className="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-mint-400 to-purple-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {child.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {child.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            {formData.childIds.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {formData.childIds.length} enfant(s) sélectionné(s)
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type d'assignation
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="assigned"
                    checked={formData.assignmentType === 'assigned'}
                    onChange={(e) => setFormData({ ...formData, assignmentType: e.target.value })}
                    className="w-4 h-4 text-brand"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Assigné (obligatoire)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="recommended"
                    checked={formData.assignmentType === 'recommended'}
                    onChange={(e) => setFormData({ ...formData, assignmentType: e.target.value })}
                    className="w-4 h-4 text-brand"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Recommandé</span>
                </label>
              </div>
            </div>

            {/* Total Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Points totaux
              </label>
              <input
                type="number"
                value={formData.totalPoints}
                onChange={(e) => setFormData({ ...formData, totalPoints: parseInt(e.target.value) })}
                min="0"
                step="10"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Points répartis: 25% → 50% → 75% → 100%
              </p>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand focus:border-transparent"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date limite
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={assignMutation.isPending || formData.childIds.length === 0}
              className="flex-1 px-6 py-3 bg-brand text-white rounded-xl hover:bg-brand/90 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
            >
              <UserPlus className="w-4 h-4" />
              {assignMutation.isPending ? 'Assignation...' : 'Assigner la lecture'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
