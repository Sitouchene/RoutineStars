import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { categoriesApi } from '../../lib/api-client';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Lock } from 'lucide-react';

export default function CategoriesPage() {
  const { getAuthHeader, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
      
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories', user?.familyId],
    queryFn: () => categoriesApi.getAll(getAuthHeader()),
    enabled: !!user?.familyId,
  });

  const createMutation = useMutation({
    mutationFn: (data) => categoriesApi.create(data, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories', user?.familyId]);
      setShowCreateModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoriesApi.update(id, data, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories', user?.familyId]);
      setEditingCategory(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoriesApi.delete(id, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories', user?.familyId]);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => {
      console.log('Toggle mutation called with:', { id, isActive });
      return categoriesApi.toggle(id, isActive, getAuthHeader());
    },
    onSuccess: (data) => {
      console.log('Toggle mutation success:', data);
      queryClient.invalidateQueries(['categories', user?.familyId]);
    },
    onError: (error) => {
      console.error('Toggle mutation error:', error);
    },
  });

  // Séparer les catégories communes et personnalisées
  const commonCategories = categories.filter(cat => cat.familyId === null);
  const familyCategories = categories.filter(cat => cat.familyId === user?.familyId);
  
  // Séparer les catégories personnalisées par statut
  const activeFamilyCategories = familyCategories.filter(cat => cat.isActive);
  const inactiveFamilyCategories = familyCategories.filter(cat => !cat.isActive);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <div className="text-gray-500">Chargement des catégories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Catégories</h1>
              <p className="text-gray-600 mt-2">
                Gérez les catégories de vos tâches
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle catégorie</span>
            </button>
          </div>
        </div>

        {/* Catégories communes */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-900">Catégories communes</h2>
            <span className="text-sm text-gray-500">(Modifiables par l'administrateur uniquement)</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonCategories.map(category => (
              <div key={category.id} className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {category.display}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">
                        {category.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      category.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-xs text-gray-500">
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Catégories personnalisées actives */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Mes catégories actives</h2>
            <span className="text-sm text-gray-500">({activeFamilyCategories.length} catégorie{activeFamilyCategories.length > 1 ? 's' : ''})</span>
          </div>
          
          {activeFamilyCategories.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="text-gray-400 mb-4">
                <Plus className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune catégorie active</h3>
              <p className="text-gray-500 mb-4">
                Créez votre première catégorie personnalisée pour organiser vos tâches.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Créer une catégorie
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeFamilyCategories.map(category => (
                <div key={category.id} className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-green-500">
                  {/* Contenu principal */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {category.display}
                          </h3>
                          <p className="text-sm text-gray-500 font-mono">
                            {category.title}
                          </p>
                        </div>
                      </div>
                      
                      {/* Statut en haut à droite */}
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          category.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-xs text-gray-500">
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>

                  {/* Ligne de séparation */}
                  <div className="border-t border-gray-200 mb-4"></div>

                  {/* Boutons d'action */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        console.log('Toggle button clicked for category:', category.id, 'current status:', category.isActive);
                        toggleMutation.mutate({ 
                          id: category.id, 
                          isActive: !category.isActive 
                        });
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        category.isActive 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={category.isActive ? 'Désactiver' : 'Activer'}
                      disabled={toggleMutation.isPending}
                    >
                      {category.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
                          deleteMutation.mutate(category.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Catégories personnalisées inactives */}
        {inactiveFamilyCategories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Catégories inactives</h2>
              <span className="text-sm text-gray-500">({inactiveFamilyCategories.length} catégorie{inactiveFamilyCategories.length > 1 ? 's' : ''})</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inactiveFamilyCategories.map(category => (
                <div key={category.id} className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-gray-400 opacity-75">
                  {/* Contenu principal */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {category.display}
                          </h3>
                          <p className="text-sm text-gray-500 font-mono">
                            {category.title}
                          </p>
                        </div>
                      </div>
                      
                      {/* Statut en haut à droite */}
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          category.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-xs text-gray-500">
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>

                  {/* Ligne de séparation */}
                  <div className="border-t border-gray-200 mb-4"></div>

                  {/* Boutons d'action */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        console.log('Toggle button clicked for category:', category.id, 'current status:', category.isActive);
                        toggleMutation.mutate({ 
                          id: category.id, 
                          isActive: !category.isActive 
                        });
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        category.isActive 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={category.isActive ? 'Désactiver' : 'Activer'}
                      disabled={toggleMutation.isPending}
                    >
                      {category.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
                          deleteMutation.mutate(category.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={createMutation.mutate}
          isCreating={createMutation.isPending}
        />
      )}

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSuccess={updateMutation.mutate}
          isUpdating={updateMutation.isPending}
        />
      )}
    </div>
  );
}

// Modal de création de catégorie
function CreateCategoryModal({ onClose, onSuccess, isCreating }) {
  const [formData, setFormData] = useState({
    title: '',
    display: '',
    description: '',
    icon: '',
    isActive: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Nouvelle catégorie</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre technique *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="ex: sports, hobbies"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Lettres minuscules, chiffres, tirets et underscores uniquement
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'affichage *
            </label>
            <input
              type="text"
              value={formData.display}
              onChange={(e) => handleChange('display', e.target.value)}
              placeholder="ex: Sports, Loisirs"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description de cette catégorie..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icône
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => handleChange('icon', e.target.value)}
              placeholder="ex: 🏃‍♂️, 🎨"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              maxLength={10}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Activer immédiatement
            </label>
          </div>

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
              disabled={isCreating}
            >
              {isCreating ? 'Création...' : 'Créer la catégorie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal d'édition de catégorie
function EditCategoryModal({ category, onClose, onSuccess, isUpdating }) {
  const [formData, setFormData] = useState({
    title: category.title,
    display: category.display,
    description: category.description,
    icon: category.icon || '',
    isActive: category.isActive
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess({ id: category.id, data: formData });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Modifier la catégorie</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre technique *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'affichage *
            </label>
            <input
              type="text"
              value={formData.display}
              onChange={(e) => handleChange('display', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icône
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => handleChange('icon', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              maxLength={10}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Activer la catégorie
            </label>
          </div>

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
              disabled={isUpdating}
            >
              {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
