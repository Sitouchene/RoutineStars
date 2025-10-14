import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { categoriesApi } from '../../lib/api-client';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Lock } from 'lucide-react';

export default function CategoriesPage() {
  const { getAuthHeader, user } = useAuthStore();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
      
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories', user?.groupId],
    queryFn: () => categoriesApi.getAll(getAuthHeader()),
    enabled: !!user?.groupId,
  });

  const createMutation = useMutation({
    mutationFn: (data) => categoriesApi.create(data, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories', user?.groupId]);
      setShowCreateModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoriesApi.update(id, data, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories', user?.groupId]);
      setEditingCategory(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoriesApi.delete(id, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories', user?.groupId]);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => {
      console.log('Toggle mutation called with:', { id, isActive });
      return categoriesApi.toggle(id, isActive, getAuthHeader());
    },
    onSuccess: (data) => {
      console.log('Toggle mutation success:', data);
      queryClient.invalidateQueries(['categories', user?.groupId]);
    },
    onError: (error) => {
      console.error('Toggle mutation error:', error);
    },
  });

  // Séparer les catégories communes et personnalisées
  const commonCategories = categories.filter(cat => cat.groupId === null);
  const familyCategories = categories.filter(cat => cat.groupId === user?.groupId);
  
  // Séparer les catégories personnalisées par statut
  const activeFamilyCategories = familyCategories.filter(cat => cat.isActive);
  const inactiveFamilyCategories = familyCategories.filter(cat => !cat.isActive);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <div className="text-gray-500">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{t('categories.title')}</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              {t('categories.description')}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('categories.add')}</span>
            <span className="sm:hidden">{t('common.add')}</span>
          </button>
        </div>
      </div>

      {/* Catégories communes */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
          <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">{t('categories.common')}</h2>
          <span className="text-xs md:text-sm text-gray-500 hidden sm:inline">{t('categories.commonDesc')}</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {commonCategories.map(category => (
            <div key={category.id} className="bg-white rounded-2xl p-3 md:p-4 lg:p-6 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-start justify-between mb-2 md:mb-4 gap-2">
                <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                  <span className="text-xl md:text-2xl flex-shrink-0">{category.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                      {category.display}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 font-mono truncate">
                      {category.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full ${
                    category.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-xs text-gray-500 hidden sm:inline">
                    {category.isActive ? t('common.active') : t('common.inactive')}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-xs md:text-sm line-clamp-2">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Catégories personnalisées actives */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">{t('categories.active')}</h2>
          <span className="text-xs md:text-sm text-gray-500">{t('categories.count', { count: activeFamilyCategories.length })}</span>
        </div>
        
        {activeFamilyCategories.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm">
            <div className="text-gray-400 mb-4">
              <Plus className="w-10 h-10 md:w-12 md:h-12 mx-auto" />
            </div>
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">{t('categories.noneActive')}</h3>
            <p className="text-sm md:text-base text-gray-500 mb-4">
              {t('categories.noneActiveDesc')}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm md:text-base"
            >
              {t('categories.create')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {activeFamilyCategories.map(category => (
              <div key={category.id} className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border-l-4 border-green-500">
                {/* Contenu principal */}
                <div className="mb-3 md:mb-4">
                  <div className="flex items-start justify-between mb-2 md:mb-3 gap-2">
                    <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                      <span className="text-xl md:text-2xl flex-shrink-0">{category.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                          {category.display}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 font-mono truncate">
                          {category.title}
                        </p>
                      </div>
                    </div>
                    
                    {/* Statut en haut à droite */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full ${
                        category.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-xs text-gray-500 hidden sm:inline">
                        {category.isActive ? t('common.active') : t('common.inactive')}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-xs md:text-sm line-clamp-2">
                    {category.description}
                  </p>
                </div>

                {/* Ligne de séparation */}
                <div className="border-t border-gray-200 mb-3 md:mb-4"></div>

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
                    className={`p-1.5 md:p-2 rounded-lg transition-colors ${
                      category.isActive 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={category.isActive ? t('categories.deactivate') : t('categories.activate')}
                    disabled={toggleMutation.isPending}
                  >
                    {category.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title={t('common.edit')}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(t('categories.deleteConfirm'))) {
                        deleteMutation.mutate(category.id);
                      }
                    }}
                    className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={t('common.delete')}
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
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">{t('categories.inactive')}</h2>
            <span className="text-xs md:text-sm text-gray-500">{t('categories.count', { count: inactiveFamilyCategories.length })}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {inactiveFamilyCategories.map(category => (
              <div key={category.id} className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border-l-4 border-gray-400 opacity-75">
                {/* Contenu principal */}
                <div className="mb-3 md:mb-4">
                  <div className="flex items-start justify-between mb-2 md:mb-3 gap-2">
                    <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                      <span className="text-xl md:text-2xl flex-shrink-0">{category.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                          {category.display}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 font-mono truncate">
                          {category.title}
                        </p>
                      </div>
                    </div>
                    
                    {/* Statut en haut à droite */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full ${
                        category.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-xs text-gray-500 hidden sm:inline">
                        {category.isActive ? t('common.active') : t('common.inactive')}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-xs md:text-sm line-clamp-2">
                    {category.description}
                  </p>
                </div>

                {/* Ligne de séparation */}
                <div className="border-t border-gray-200 mb-3 md:mb-4"></div>

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
                    className={`p-1.5 md:p-2 rounded-lg transition-colors ${
                      category.isActive 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={category.isActive ? t('categories.deactivate') : t('categories.activate')}
                    disabled={toggleMutation.isPending}
                  >
                    {category.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title={t('common.edit')}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(t('categories.deleteConfirm'))) {
                        deleteMutation.mutate(category.id);
                      }
                    }}
                    className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={t('common.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
  const { t } = useTranslation();
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
          <h3 className="text-xl font-bold text-gray-900">{t('categories.add')}</h3>
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
              {t('categories.techTitleLabel')} *
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
              {t('categories.displayNameLabel')} *
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
              {t('categories.descriptionLabel')} *
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
              {t('categories.iconLabel')}
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
              {t('categories.activateNow')}
            </label>
          </div>

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
              disabled={isCreating}
            >
              {isCreating ? t('categories.creating') : t('categories.createButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal d'édition de catégorie
function EditCategoryModal({ category, onClose, onSuccess, isUpdating }) {
  const { t } = useTranslation();
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
          <h3 className="text-xl font-bold text-gray-900">{t('common.edit')} {t('categories.title')}</h3>
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
              {t('categories.techTitleLabel')} *
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
              {t('categories.displayNameLabel')} *
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
              {t('categories.descriptionLabel')} *
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
              {t('categories.iconLabel')}
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
              {t('categories.activate')}
            </label>
          </div>

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
              disabled={isUpdating}
            >
              {isUpdating ? t('categories.updating') : t('categories.updateButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
