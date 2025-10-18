import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { seedToAvatarUrl } from '../../utils/avatarUtils';

export default function ChildHeader({ title, subtitle, onOpenTheme, right = null }) {
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePreferences = () => {
    navigate('/child/profile');
    setShowDropdown(false);
  };

  return (
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-anthracite dark:text-cream">{title}</h1>
        {subtitle && <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {right}
        <button onClick={onOpenTheme} className="p-2 rounded-lg hover-bg-brand-light hover-text-brand">
          <Palette className="w-5 h-5" />
        </button>
        
        {/* Avatar avec dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1 rounded-lg hover-bg-secondary-light hover-text-secondary transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover-border-brand transition-all">
              {user?.avatar ? (
                <img
                  src={seedToAvatarUrl(user.avatar) || user.avatar}
                  alt={`Avatar de ${user.name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-lg">
                  👦
                </div>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-anthracite-light rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              <button
                onClick={handlePreferences}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <Settings className="w-4 h-4" />
                {t('child.header.preferences')}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                {t('child.header.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
