import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { X, BookOpen, Download, Star, Globe, BookMarked } from 'lucide-react';
import { bookTemplatesApi } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';

export default function BookLibraryModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { getAuthHeader } = useAuthStore();
  const queryClient = useQueryClient();
  const [languageFilter, setLanguageFilter] = useState('');
  
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['bookTemplates', languageFilter],
    queryFn: () => bookTemplatesApi.getAll(getAuthHeader(), { language: languageFilter }),
    enabled: isOpen
  });
  
  const importMutation = useMutation({
    mutationFn: (templateId) => bookTemplatesApi.import(templateId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      alert(t('books.library.importSuccess'));
    },
    onError: (error) => {
      alert(t('books.library.importError') + ': ' + error.message);
    }
  });
  
  const handleImport = (templateId) => {
    importMutation.mutate(templateId);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-mint-400 to-purple-400 rounded-xl flex items-center justify-center">
              <BookMarked className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100">
                {t('books.library.title')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('books.library.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Filtres langue */}
        <div className="flex gap-3 mb-6">
          {[
            { value: '', label: t('books.library.allLanguages'), icon: Globe },
            { value: 'fr', label: 'Français', icon: BookOpen },
            { value: 'en', label: 'English', icon: BookOpen },
            { value: 'ar', label: 'العربية', icon: BookOpen }
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value || 'all'}
              onClick={() => setLanguageFilter(value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                languageFilter === value 
                  ? 'bg-brand text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
        
        {/* Grille de livres */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-spin w-8 h-8 border-2 border-brand border-t-transparent rounded-full mx-auto mb-4"></div>
            {t('common.loading')}
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">{t('books.library.noTemplates')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {templates.map(template => (
              <div key={template.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition-shadow">
                {/* Cover + Info */}
                <div className="mb-3">
                  <div className="w-full h-40 bg-gradient-to-br from-mint-400 to-purple-400 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                    {template.coverImageUrl ? (
                      <img 
                        src={template.coverImageUrl} 
                        alt={template.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <BookOpen className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-gray-900 dark:text-gray-100">
                    {template.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {template.author}
                  </p>
                  
                  {/* Genres */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.genres.slice(0, 2).map(genre => (
                      <span 
                        key={genre} 
                        className="px-2 py-0.5 rounded-full bg-brand-light text-brand text-xs font-medium"
                      >
                        {t(`books.genres.${genre}`, genre)}
                      </span>
                    ))}
                    {template.genres.length > 2 && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-xs">
                        +{template.genres.length - 2}
                      </span>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="text-xs text-gray-500 mb-3">
                    {template.totalPages} {t('books.pages')} • {template.language.toUpperCase()}
                  </div>
                  
                  {/* Synopsis */}
                  {template.synopsis && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {template.synopsis}
                    </p>
                  )}
                  
                  {/* Age range */}
                  {template.ageRange && (
                    <div className="text-xs text-gray-500">
                      {template.ageRange.min}-{template.ageRange.max} {t('books.library.years')}
                    </div>
                  )}
                </div>
                
                {/* Bouton Import */}
                <button
                  onClick={() => handleImport(template.id)}
                  disabled={importMutation.isPending}
                  className="w-full px-3 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {importMutation.isPending ? t('books.library.importing') : t('books.library.import')}
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
          >
            {t('books.library.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
