import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Calendar, Grid3X3 } from 'lucide-react';
import BooksPage from './BooksPage';
import ReadingAssignmentsPage from './ReadingAssignmentsPage';
import BooksAssignmentMatrix from './BooksAssignmentMatrix';

/**
 * Page unifiée pour la gestion des livres avec onglets
 * Utilise les composants existants sans modification
 */
export default function BooksUnifiedPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('catalog');

  const tabs = [
    { id: 'catalog', label: t('books.title', 'Catalogue de livres'), icon: BookOpen, component: BooksPage },
    { id: 'assignments', label: t('books.assignments', 'Lectures assignées'), icon: Calendar, component: ReadingAssignmentsPage },
    { id: 'matrix', label: t('books.matrixNav', 'Matrice lectures'), icon: Grid3X3, component: BooksAssignmentMatrix },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || BooksPage;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header avec onglets */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('books.management', 'Gestion des Livres')}
            </h1>
          </div>
          
          {/* Onglets */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="flex-1">
        <ActiveComponent />
      </div>
    </div>
  );
}

