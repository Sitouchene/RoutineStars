import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, BookOpen, CheckCircle2, CalendarRange, BarChart3, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Logo from '../branding/Logo';

export default function SidebarChild() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  
  const items = [
    { to: '/child', icon: Home, label: t('child.navigation.home') },
    { to: '/child/day', icon: CheckCircle2, label: t('child.navigation.day') },
    { to: '/child/agenda', icon: CalendarRange, label: t('child.navigation.agenda') },
    { to: '/child/reads', icon: BookOpen, label: t('child.navigation.reads') },
    { to: '/child/stats', icon: BarChart3, label: t('child.navigation.stats') },
    { to: '/child/profile', icon: User, label: t('child.navigation.profile') },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-56 fixed top-0 bottom-0 left-0 bg-white dark:bg-anthracite-light border-r border-gray-200 dark:border-gray-700 p-4 z-30">
      {/* Logo et slogan */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Logo className="w-8 h-8" />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 italic">{t('app.slogan')}</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-brand-light text-brand' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Déconnexion */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="truncate">{t('common.logout')}</span>
        </button>
      </div>
    </aside>
  );
}


