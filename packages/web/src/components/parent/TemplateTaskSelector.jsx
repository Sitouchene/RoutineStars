import { useState, useMemo } from 'react';
import { X, Search, Filter, Star, Calendar, BookOpen } from 'lucide-react';
import { TEMPLATE_TASKS, getTemplateTaskCategories, searchTemplateTasks } from '../../data/templateTasks';
import { TASK_CATEGORIES, TASK_RECURRENCE } from 'shared/constants';

export default function TemplateTaskSelector({ onSelect, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Utiliser les données locales avec useMemo pour optimiser les performances
  const filteredTasks = useMemo(() => {
    return searchTemplateTasks(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    return getTemplateTaskCategories();
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      'routine': '🌞',
      'household': '🏠',
      'study': '📚',
      'personal': '👤',
      'other': '📋'
    };
    return icons[category] || '📋';
  };

  const getRecurrenceIcon = (recurrence) => {
    switch (recurrence) {
      case 'daily': return '📅';
      case 'weekday': return '📆';
      case 'weekly': return '🗓️';
      case 'monthly': return '📊';
      default: return '📋';
    }
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

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bibliothèque de tâches</h2>
            <p className="text-gray-600 mt-1">Choisissez une tâche prédéfinie à personnaliser</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filtres */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une tâche..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtre par catégorie */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Liste des tâches */}
        <div className="p-6 overflow-y-auto max-h-96">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Aucune tâche trouvée</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map(template => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{template.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{template.task}</h3>
                      {template.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{template.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {template.points} pts
                        </div>
                        <div className="flex items-center gap-1">
                          {getRecurrenceIcon(template.recurrence)}
                          {getRecurrenceText(template.recurrence)}
                        </div>
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(template.category)}
                          {template.category}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedTemplate}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Utiliser cette tâche
          </button>
        </div>
      </div>
    </div>
  );
}