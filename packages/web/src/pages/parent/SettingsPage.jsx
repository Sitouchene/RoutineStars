import { useTranslation } from 'react-i18next';
import { Palette, Globe, Bell } from 'lucide-react';
import ThemeSelector from '../../components/ThemeSelector';
import LanguageSelector from '../../components/LanguageSelector';
import Card from '../../components/ui/Card';

/**
 * Page de paramètres pour les parents/enseignants
 * Permet de configurer le thème, la langue et d'autres préférences
 */
export default function SettingsPage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-anthracite dark:text-cream mb-2">
          {t('settings.title', 'Paramètres')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('settings.description', 'Personnalisez votre expérience mOOtify')}
        </p>
      </div>
      
      {/* Apparence - Thème */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-mint-100 rounded-full flex items-center justify-center">
            <Palette className="w-5 h-5 text-mint-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-anthracite dark:text-cream">
              {t('settings.appearance', 'Apparence')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('settings.appearanceDesc', 'Personnalisez les couleurs de l\'interface')}
            </p>
          </div>
        </div>
        
        <ThemeSelector />
      </Card>
      
      {/* Langue */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Globe className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-anthracite dark:text-cream">
              {t('settings.language', 'Langue')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('settings.languageDesc', 'Choisissez la langue de l\'application')}
            </p>
          </div>
        </div>
        
        <LanguageSelector variant="buttons" />
      </Card>
      
      {/* Notifications (placeholder pour future implémentation) */}
      <Card variant="default">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-gray-400">
              {t('settings.notifications', 'Notifications')}
            </h3>
            <p className="text-sm text-gray-400">
              {t('settings.comingSoon', 'Bientôt disponible')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

