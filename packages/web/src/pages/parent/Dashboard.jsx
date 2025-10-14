import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { Home, Users, ListTodo, BarChart3, LogOut, Calendar, CheckCircle, Settings, Grid3X3, PanelRightOpen, PanelRightClose, Tag } from 'lucide-react';
import ChildrenPage from './ChildrenPage';
import TasksPage from './TasksPage';
import AssignmentsPage from './AssignmentsPage';
import AssignmentMatrix from './AssignmentMatrix';
import SubmissionsPage from './SubmissionsPage';
import StatsPage from './StatsPage';
import MessagesRulesPage from './MessagesRules';
import CategoriesPage from './CategoriesPage';
import PendingSubmissionsWidget from '../../components/parent/PendingSubmissionsWidget';
import LanguageSelector from '../../components/LanguageSelector';

function DashboardHome() {
  const { user, group } = useAuthStore();
  const { t } = useTranslation();

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold">
        {t('dashboard.welcome', { name: user?.name })}
      </h2>
      
      {/* Widget des soumissions en attente */}
      <PendingSubmissionsWidget />
      
      {/* Code de groupe pour connexion enfant */}
      <div className="card">
        <h3 className="font-semibold text-base md:text-lg mb-2">
          🔑 {t('dashboard.groupCode', { type: t(`dashboard.${group?.type || 'family'}`) })}
        </h3>
        <p className="text-xs md:text-sm text-gray-600 mb-3">
          {t('dashboard.shareCode', { members: t(`dashboard.members.${group?.type === 'family' ? 'children' : 'students'}`) })}
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <code className="bg-gray-100 px-3 py-2 rounded-lg font-mono text-sm text-center sm:text-left flex-1">
            {group?.code || user?.groupId}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(group?.code || user?.groupId)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors whitespace-nowrap"
          >
            {t('dashboard.copy')}
          </button>
        </div>
        {group && (
          <p className="text-xs text-gray-500 mt-2">
            {group.name} • {group.type === 'family' ? t('dashboard.family') : t('dashboard.classroom')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <div className="card">
          <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2 text-gray-700">
            {t(`dashboard.${group?.type === 'family' ? 'children' : 'students'}`)}
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2 text-gray-700">{t('tasks.title')}</h3>
          <p className="text-2xl md:text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="card sm:col-span-2 md:col-span-1">
          <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2 text-gray-700">{t('stats.completionRate')}</h3>
          <p className="text-2xl md:text-3xl font-bold text-primary-600">0%</p>
        </div>
      </div>
    </div>
  );
}

// ChildrenPage est maintenant importé depuis le fichier séparé

// TasksPage est maintenant importé depuis le fichier séparé

// StatsPage est maintenant importé depuis le fichier séparé

export default function ParentDashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Fermer automatiquement le sidebar sur mobile
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fermer le sidebar quand on clique sur un lien en mobile
  const handleNavClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const navItems = [
    { path: '/parent/home', icon: Home, label: t('dashboard.home') },
    { path: '/parent/children', icon: Users, label: t('dashboard.children') },
    { path: '/parent/categories', icon: Tag, label: t('dashboard.categories') },
    { path: '/parent/tasks', icon: ListTodo, label: t('dashboard.tasks') },
    { path: '/parent/assignments', icon: Calendar, label: t('dashboard.assignments') },
    { path: '/parent/assignment-matrix', icon: Grid3X3, label: t('dashboard.matrix') },
    { path: '/parent/submissions', icon: CheckCircle, label: t('dashboard.submissions') },
    { path: '/parent/stats', icon: BarChart3, label: t('dashboard.stats') },
    { path: '/parent/messages-rules', icon: Settings, label: t('dashboard.messages') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop & Mobile */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-transform duration-300 z-40 ${
        isMobile 
          ? `w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}` 
          : 'w-64'
      }`}>
        <div className="p-4 md:p-6 h-full flex flex-col">
          {/* Header du sidebar */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-lg md:text-xl font-bold text-primary-600">⭐ RoutineStars</h1>
            <p className="text-xs md:text-sm text-gray-500">Espace Parent</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1 overflow-y-auto">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-primary-600"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate text-sm md:text-base">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Bouton de déconnexion */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="truncate text-sm md:text-base">{t('auth.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Overlay pour mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header Mobile avec bouton menu */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-20 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <PanelRightClose className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-primary-600">⭐ RoutineStars</h1>
          <LanguageSelector variant="dropdown" />
        </header>
      )}

      {/* Header Desktop - Sélecteur de langue */}
      {!isMobile && (
        <div className="fixed top-4 right-4 z-30">
          <LanguageSelector variant="dropdown" />
        </div>
      )}

      {/* Main Content */}
      <main className={`transition-all duration-300 p-4 md:p-6 lg:p-8 ${
        isMobile ? 'pt-16' : 'ml-64'
      }`}>
          <Routes>
            <Route index element={<Navigate to="/parent/home" replace />} />
            <Route path="home" element={<DashboardHome />} />
            <Route path="children" element={<ChildrenPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="assignment-matrix" element={<AssignmentMatrix />} />
            <Route path="submissions" element={<SubmissionsPage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="messages-rules" element={<MessagesRulesPage />} />
          </Routes>
        </main>
    </div>
  );
}


