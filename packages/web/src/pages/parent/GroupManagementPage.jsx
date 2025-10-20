import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Tag, Settings } from 'lucide-react';
import ChildrenPage from './ChildrenPage';
import CategoriesPage from './CategoriesPage';
import MessagesRulesPage from './MessagesRules';

/**
 * Page unifiée pour la gestion du groupe avec 3 onglets
 */
export default function GroupManagementPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('members');

  const tabs = [
    {
      id: 'members',
      label: t('dashboard.members', 'Membres'),
      icon: Users,
      component: ChildrenPage
    },
    {
      id: 'categories',
      label: t('dashboard.categories', 'Catégories'),
      icon: Tag,
      component: CategoriesPage
    },
    {
      id: 'rules',
      label: t('dashboard.rules', 'Règles'),
      icon: Settings,
      component: MessagesRulesPage
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.groupManagement', 'Gestion du Groupe')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('dashboard.groupDescription', 'Gérez les membres, catégories et règles de votre groupe')}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-brand text-brand-dark dark:text-brand-light'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <tab.icon className="inline-block w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}
