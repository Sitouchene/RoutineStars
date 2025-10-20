import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, BookOpen, CheckCircle2, CalendarRange, Trophy } from 'lucide-react';

export default function BottomNav() {
  const { t } = useTranslation();
  
  const items = [
    { to: '/child/day', icon: CheckCircle2, label: t('child.navigation.day') },
    { to: '/child/agenda', icon: CalendarRange, label: t('child.navigation.agenda') },
    { to: '/child', icon: Home, label: t('child.navigation.home'), isMain: true },
    { to: '/child/reads', icon: BookOpen, label: t('child.navigation.reads') },
    { to: '/child/awards', icon: Trophy, label: t('child.navigation.awards') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 block md:hidden bg-white dark:bg-anthracite-light border-t border-gray-200 dark:border-gray-700 z-50 pb-[calc(env(safe-area-inset-bottom)+0.25rem)]">
      <ul className="grid grid-cols-5">
        {items.map(({ to, icon: Icon, label, isMain }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => `flex flex-col items-center justify-center py-2 text-xs relative ${
                isMain 
                  ? isActive 
                    ? 'text-white' 
                    : 'text-gray-600 dark:text-gray-300'
                  : isActive 
                    ? 'text-brand' 
                    : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {({ isActive }) => (
                <>
                  {isMain && (
                    <div className={`absolute inset-0 bg-brand rounded-t-2xl transition-all ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`} />
                  )}
                  <Icon className={`w-5 h-5 mb-1 relative z-10 ${isMain ? 'text-white' : ''}`} />
                  <span className="relative z-10">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}


