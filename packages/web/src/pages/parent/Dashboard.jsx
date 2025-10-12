import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
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

function DashboardHome() {
  const user = useAuthStore(state => state.user);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Bienvenue, {user?.name} 👋
      </h2>
      
      {/* Widget des soumissions en attente */}
      <PendingSubmissionsWidget />
      
      {/* ID Famille pour connexion enfant */}
      <div className="card mb-6">
        <h3 className="font-semibold text-lg mb-2">🔑 ID de votre famille</h3>
        <p className="text-sm text-gray-600 mb-3">
          Partagez cet ID avec vos enfants pour qu'ils puissent se connecter :
        </p>
        <div className="flex items-center gap-3">
          <code className="bg-gray-100 px-3 py-2 rounded-lg font-mono text-sm">
            {user?.familyId}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(user?.familyId)}
            className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
          >
            Copier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-lg mb-2">Enfants</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-lg mb-2">Tâches actives</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-lg mb-2">Taux de complétion</h3>
          <p className="text-3xl font-bold text-primary-600">0%</p>
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile et ajuster le sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const navItems = [
    { path: '/parent', icon: Home, label: 'Accueil' },
    { path: '/parent/children', icon: Users, label: 'Enfants' },
    { path: '/parent/categories', icon: Tag, label: 'Catégories' },
    { path: '/parent/tasks', icon: ListTodo, label: 'Tâches' },
    { path: '/parent/assignments', icon: Calendar, label: 'Assignations' },
    { path: '/parent/assignment-matrix', icon: Grid3X3, label: 'Tableau croisé' },
    { path: '/parent/submissions', icon: CheckCircle, label: 'Validations' },
    { path: '/parent/stats', icon: BarChart3, label: 'Statistiques' },
    { path: '/parent/messages-rules', icon: Settings, label: 'Messages & règles' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } ${isMobile && sidebarCollapsed ? '-translate-x-full' : ''}`}>
        <div className="p-6 h-full flex flex-col">
          {/* Header du sidebar */}
          <div className="mb-8 flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-primary-600">⭐ RoutineStars</h1>
                <p className="text-sm text-gray-500">Espace Parent</p>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  sidebarCollapsed ? 'justify-center px-2' : ''
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Bouton de déconnexion */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
              sidebarCollapsed ? 'justify-center px-2' : ''
            }`}
            title={sidebarCollapsed ? 'Déconnexion' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="truncate">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Overlay pour mobile */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main Content */}
        <main className={`p-8 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        } ${isMobile ? 'ml-0' : ''}`}>
          <Routes>
            <Route index element={<DashboardHome />} />
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


