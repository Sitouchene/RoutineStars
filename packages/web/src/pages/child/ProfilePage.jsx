import { useTranslation } from 'react-i18next';
import ChildHeader from '../../components/child/ChildHeader';
import ThemeSelector from '../../components/ThemeSelector';
import LanguageSelector from '../../components/LanguageSelector';
import AvatarSelector from '../../components/child/AvatarSelector';
import { useAuthStore } from '../../stores/authStore';
import { useState } from 'react';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [showAvatar, setShowAvatar] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-mootify p-4">
      <div className="max-w-4xl mx-auto">
        <ChildHeader title={t('child.profile.title')} subtitle={t('child.profile.subtitle')} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-anthracite-light rounded-2xl p-6 shadow-md ring-1 ring-black/5 dark:ring-white/5">
            <h3 className="text-lg font-display font-semibold text-anthracite dark:text-cream mb-4">{t('child.profile.theme')}</h3>
            <ThemeSelector />
          </div>

          <div className="bg-white dark:bg-anthracite-light rounded-2xl p-6 shadow-md ring-1 ring-black/5 dark:ring-white/5">
            <h3 className="text-lg font-display font-semibold text-anthracite dark:text-cream mb-4">{t('child.profile.language')}</h3>
            <LanguageSelector variant="buttons" />
          </div>

          <div className="bg-white dark:bg-anthracite-light rounded-2xl p-6 shadow-md ring-1 ring-black/5 dark:ring-white/5">
            <h3 className="text-lg font-display font-semibold text-anthracite dark:text-cream mb-4">{t('child.profile.information')}</h3>
            <div className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
              <div><span className="font-medium">{t('child.profile.name')}:</span> {user?.name}</div>
              <div><span className="font-medium">{t('child.profile.group')}:</span> {user?.groupId}</div>
              <button onClick={() => setShowAvatar(true)} className="btn btn-secondary mt-3">{t('child.profile.changeAvatar')}</button>
            </div>
          </div>
        </div>

        {showAvatar && (
          <AvatarSelector
            currentAvatar={user?.avatar}
            onAvatarChange={() => setShowAvatar(false)}
            onClose={() => setShowAvatar(false)}
          />
        )}
      </div>
    </div>
  );
}


