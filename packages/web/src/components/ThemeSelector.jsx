import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useThemeStore } from '../stores/themeStore';
import { Check } from 'lucide-react';

/**
 * Sélecteur de thème mOOtify
 * Permet de choisir entre les 3 thèmes : default, kids-boy, kids-girl
 */
export default function ThemeSelector({ className = '' }) {
  const { t } = useTranslation();
  const { theme, themes, setTheme } = useThemeStore();
  
  const themeList = [
    {
      id: 'default',
      name: t('themes.default'),
      description: t('themes.defaultDesc'),
      colors: ['#58D6A8', '#B69CF4'],
      gradient: 'from-mint-400 to-purple-400',
    },
    {
      id: 'kids-boy',
      name: t('themes.kidsboy'),
      description: t('themes.kidsboyDesc'),
      colors: ['#38bdf8', '#14b8a6'],
      gradient: 'from-kids-boy-400 to-kids-boy-600',
    },
    {
      id: 'kids-girl',
      name: t('themes.kidsgirl'),
      description: t('themes.kidsgirlDesc'),
      colors: ['#fb7185', '#f9a8d4'],
      gradient: 'from-kids-girl-400 to-kids-girl-500',
    },
  ];
  
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-display font-semibold text-anthracite dark:text-cream">
        {t('themes.title')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themeList.map((themeItem) => {
          const isSelected = theme === themeItem.id;
          
          return (
            <motion.button
              key={themeItem.id}
              onClick={() => setTheme(themeItem.id)}
              className={`
                relative p-4 rounded-2xl border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-mint-400 bg-mint-50 dark:bg-anthracite-light' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-anthracite hover:border-gray-300'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Indicateur de sélection */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-mint-400 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
              
              {/* Preview des couleurs */}
              <div className="flex gap-2 mb-3">
                {themeItem.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-xl shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              {/* Nom du thème */}
              <h4 className="text-base font-display font-semibold text-anthracite dark:text-cream mb-1 text-left">
                {themeItem.name}
              </h4>
              
              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                {themeItem.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

