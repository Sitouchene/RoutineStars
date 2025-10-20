import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { Home, Users, ListTodo, BarChart3, LogOut, Calendar, CheckCircle, Settings, Grid3X3, PanelRightOpen, PanelRightClose, Tag, BookOpen, QrCode, Bell, Trophy, Gift } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import GroupManagementPage from './GroupManagementPage';
import TasksUnifiedPage from './TasksUnifiedPage';
import SubmissionsPage from './SubmissionsPage';
import StatsPage from './StatsPage';
import SettingsPage from './SettingsPage';
import BooksUnifiedPage from './BooksUnifiedPage';
import BadgesManagementPage from './BadgesManagementPage';
import RewardsManagementPage from './RewardsManagementPage';
import PendingSubmissionsWidget from '../../components/parent/PendingSubmissionsWidget';
import LanguageSelector from '../../components/LanguageSelector';
import Logo from '../../components/branding/Logo';
import AnimatedCounter from '../../components/animations/AnimatedCounter';
import GroupQRCode from '../../components/parent/GroupQRCode';
import { groupsApi } from '../../lib/api-client';

function DashboardHome() {
  const { user, group, getAuthHeader } = useAuthStore();
  const { t } = useTranslation();
  const [showQRModal, setShowQRModal] = useState(false);
  
  // Stats dashboard connectées
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['groupDashboard', group?.id],
    queryFn: () => groupsApi.getDashboardStats(group.id, getAuthHeader()),
    enabled: !!group?.id
  });
  
  // Notifications temps réel
  const { data: notifications } = useQuery({
    queryKey: ['groupNotifications', group?.id],
    queryFn: () => groupsApi.getNotifications(group.id, getAuthHeader(), 10),
    enabled: !!group?.id,
    refetchInterval: 30000 // Actualiser toutes les 30s
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-anthracite dark:text-cream">
        {t('parent.dashboard.welcome', { name: user?.name })}
      </h2>
      
      {/* Notifications */}
      <div className="bg-white dark:bg-anthracite-light rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-secondary" />
          <h3 className="text-lg font-display font-semibold">{t('parent.dashboard.notifications')}</h3>
          {notifications?.pendingCount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
              {notifications.pendingCount}
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          {notifications?.notifications && notifications.notifications.length > 0 ? (
            notifications.notifications.map((notif, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-lg border-l-4 ${
                  notif.type === 'submission' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                  'border-green-500 bg-green-50 dark:bg-green-900/20'
                }`}
              >
                <p className="text-sm font-medium">{notif.message}</p>
                <p className="text-xs text-gray-500">{new Date(notif.time).toLocaleString()}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">{t('parent.dashboard.noNotifications')}</p>
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-anthracite-light rounded-2xl p-6 shadow-md"
        >
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {t('parent.dashboard.activeChildren')}
          </h3>
          <p className="text-3xl font-display font-bold text-brand">
            {statsLoading ? '...' : <AnimatedCounter value={dashboardStats?.activeChildren || 0} />}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-anthracite-light rounded-2xl p-6 shadow-md"
        >
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {t('parent.dashboard.tasksCompleted')}
          </h3>
          <p className="text-3xl font-display font-bold text-secondary">
            {statsLoading ? '...' : (
              <>
                <AnimatedCounter value={dashboardStats?.tasksStats.completed || 0} />
                <span className="text-lg text-gray-400">
                  /{dashboardStats?.tasksStats.total || 0}
                </span>
              </>
            )}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-anthracite-light rounded-2xl p-6 shadow-md"
        >
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {t('parent.dashboard.readingInProgress')}
          </h3>
          <p className="text-3xl font-display font-bold text-accent">
            {statsLoading ? '...' : <AnimatedCounter value={dashboardStats?.readingStats.inProgress || 0} />}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-anthracite-light rounded-2xl p-6 shadow-md"
        >
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {t('parent.dashboard.pointsDistributed')}
          </h3>
          <p className="text-3xl font-display font-bold text-purple-600">
            {statsLoading ? '...' : <AnimatedCounter value={dashboardStats?.pointsDistributed || 0} />}
          </p>
        </motion.div>
      </div>
      
      {/* Widget des soumissions en attente */}
      <PendingSubmissionsWidget />
      
      {/* QR Code Card */}
      <div className="bg-gradient-to-br from-mint-400 to-purple-400 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between text-white">
          <div>
            <h3 className="text-xl font-display font-bold mb-2">
              {t('parent.dashboard.qrCode')}
            </h3>
            <p className="text-sm opacity-90 mb-4">
              {t('parent.dashboard.qrCodeDescription')}
            </p>
            <button
              onClick={() => setShowQRModal(true)}
              className="px-6 py-3 bg-white text-brand rounded-xl font-medium hover:bg-cream transition-colors flex items-center gap-2"
            >
              <QrCode className="w-5 h-5" />
{t('parent.dashboard.showQR')}
            </button>
          </div>
          <QrCode className="w-24 h-24 opacity-30" />
        </div>
      </div>
      
      <GroupQRCode
        groupCode={group?.code}
        groupName={group?.name}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
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
        { path: '/parent/group-management', icon: Users, label: t('dashboard.groupManagement', 'Gestion du Groupe') },
        { path: '/parent/tasks-management', icon: ListTodo, label: t('dashboard.tasksManagement', 'Gestion Tâches') },
        { path: '/parent/submissions', icon: CheckCircle, label: t('dashboard.submissions') },
        { path: '/parent/books-management', icon: BookOpen, label: t('books.management', 'Gestion Livres') },
        { path: '/parent/badges-management', icon: Trophy, label: t('parent.badges.management', 'Badges') },
        { path: '/parent/rewards-management', icon: Gift, label: t('parent.rewards.management', 'Récompenses') },
        { path: '/parent/stats', icon: BarChart3, label: t('dashboard.stats') },
        { path: '/parent/settings', icon: Settings, label: t('settings.title', 'Paramètres') },
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
            <Logo size="sm" variant="compact" />
            <p className="text-xs md:text-sm text-gray-500 mt-2">
              {t('dashboard.parentSpace', 'Espace Parent')}
            </p>
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
          <Logo size="sm" variant="compact" />
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
                <Route path="group-management" element={<GroupManagementPage />} />
                <Route path="tasks-management" element={<TasksUnifiedPage />} />
                <Route path="submissions" element={<SubmissionsPage />} />
                <Route path="books-management" element={<BooksUnifiedPage />} />
                <Route path="badges-management" element={<BadgesManagementPage />} />
                <Route path="rewards-management" element={<RewardsManagementPage />} />
                <Route path="stats" element={<StatsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Routes>
        </main>
    </div>
  );
}


