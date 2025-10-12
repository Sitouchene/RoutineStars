import { useState } from 'react';
import { X, BookOpen, Plus, Lock } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { tasksApi, categoriesApi } from '../../lib/api-client';
import { TASK_RECURRENCE } from 'shared/constants';
import TemplateTaskSelector from './TemplateTaskSelector';

export default function AddTaskModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '', // Utiliser categoryId au lieu de category
    icon: '',
    points: 5,
    recurrence: TASK_RECURRENCE.DAILY,
    description: '',
  });
  const [error, setError] = useState('');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const { getAuthHeader, user } = useAuthStore();

  // Récupérer les catégories disponibles
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', user?.familyId],
    queryFn: () => categoriesApi.getAll(getAuthHeader()),
    enabled: !!user?.familyId,
  });

  // Séparer les catégories système et personnalisées (actives uniquement)
  const systemCategories = categories.filter(cat => cat.isSystem && cat.isActive);
  const familyCategories = categories.filter(cat => !cat.isSystem && cat.isActive);

  const addTaskMutation = useMutation({
    mutationFn: data => tasksApi.createTemplate(data, getAuthHeader()),
    onSuccess: () => {
      onSuccess();
    },
    onError: error => {
      setError(error.message);
    },
  });

  const handleUseTemplate = (template) => {
    // Trouver la catégorie correspondante
    const category = categories.find(cat => cat.title === template.category);
    
    setFormData({
      title: template.task,
      categoryId: category?.id || '', // Utiliser l'ID de la catégorie
      icon: template.icon,
      points: template.points,
      recurrence: template.recurrence,
      description: template.description || '',
    });
    setShowTemplateSelector(false);
  };

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

    if (!formData.categoryId) {
      setError('La catégorie est requise');
      return;
    }

    if (formData.points < 1 || formData.points > 100) {
      setError('Les points doivent être entre 1 et 100');
      return;
    }

    addTaskMutation.mutate(formData);
  };

  const getCategoryIcon = categoryId => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || '📋';
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
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categoriesLoading ? (
                <option disabled>Chargement des catégories...</option>
              ) : (
                <>
                  {/* Catégories système */}
                  {systemCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.display}
                    </option>
                  ))}
                  {/* Catégories personnalisées */}
                  {familyCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.display}
                    </option>
                  ))}
                </>
              )}
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
              Icône par défaut : {getCategoryIcon(formData.categoryId)}
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

        {/* Bouton bibliothèque */}
        <div className="mb-6">
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-700">Choisir depuis la bibliothèque</span>
          </button>
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

      {/* Sélecteur de tâches prédéfinies */}
      {showTemplateSelector && (
        <TemplateTaskSelector
          onSelect={handleUseTemplate}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}
    </div>
  );
}
