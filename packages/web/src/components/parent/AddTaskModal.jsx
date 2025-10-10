import { useState } from 'react';
import { X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { tasksApi } from '../../lib/api-client';
import { TASK_CATEGORIES, TASK_RECURRENCE } from 'shared/constants';

export default function AddTaskModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    category: TASK_CATEGORIES.ROUTINE,
    icon: '',
    points: 5,
    recurrence: TASK_RECURRENCE.DAILY,
    description: '',
  });
  const [error, setError] = useState('');
  const { getAuthHeader, user } = useAuthStore();

  const addTaskMutation = useMutation({
    mutationFn: data => tasksApi.createTemplate(data, getAuthHeader()),
    onSuccess: () => {
      onSuccess();
    },
    onError: error => {
      setError(error.message);
    },
  });

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.title.length < 1) {
      setError('Le titre est requis');
      return;
    }

    if (formData.points < 1 || formData.points > 100) {
      setError('Les points doivent être entre 1 et 100');
      return;
    }

    addTaskMutation.mutate(formData);
  };

  const getCategoryIcon = category => {
    const icons = {
      [TASK_CATEGORIES.ROUTINE]: '🌅',
      [TASK_CATEGORIES.MAISON]: '🏠',
      [TASK_CATEGORIES.ETUDES]: '📚',
    };
    return icons[category] || '📋';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Créer une tâche
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
              Titre de la tâche *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: Ranger ma chambre"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={TASK_CATEGORIES.ROUTINE}>
                🌅 Routine quotidienne
              </option>
              <option value={TASK_CATEGORIES.MAISON}>
                🏠 Participation à la maison
              </option>
              <option value={TASK_CATEGORIES.ETUDES}>
                📚 Études et apprentissage
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icône (optionnel)
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: 🧹 (ou laisser vide pour l'icône par défaut)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Icône par défaut : {getCategoryIcon(formData.category)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Points (1-100) *
            </label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={handleChange}
              min="1"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Récurrence *
            </label>
            <select
              name="recurrence"
              value={formData.recurrence}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={TASK_RECURRENCE.DAILY}>Tous les jours</option>
              <option value={TASK_RECURRENCE.WEEKDAY}>Jours de semaine</option>
              <option value={TASK_RECURRENCE.WEEKEND}>Weekend</option>
              <option value={TASK_RECURRENCE.MONDAY}>Lundi</option>
              <option value={TASK_RECURRENCE.TUESDAY}>Mardi</option>
              <option value={TASK_RECURRENCE.WEDNESDAY}>Mercredi</option>
              <option value={TASK_RECURRENCE.THURSDAY}>Jeudi</option>
              <option value={TASK_RECURRENCE.FRIDAY}>Vendredi</option>
              <option value={TASK_RECURRENCE.SATURDAY}>Samedi</option>
              <option value={TASK_RECURRENCE.SUNDAY}>Dimanche</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optionnel)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Description détaillée de la tâche..."
            />
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
              disabled={addTaskMutation.isPending}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
              disabled={addTaskMutation.isPending}
            >
              {addTaskMutation.isPending ? 'Création...' : 'Créer la tâche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
