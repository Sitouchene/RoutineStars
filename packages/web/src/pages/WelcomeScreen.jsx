import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, GraduationCap, Baby } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRoleSelect = (role) => {
    if (role === 'parent' || role === 'teacher') {
      navigate('/auth/login', { state: { role } });
    } else {
      navigate('/auth/child');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl w-full">
        {/* Sélecteur de langue en haut */}
        <div className="flex justify-center mb-6 md:mb-8">
          <LanguageSelector variant="buttons" />
        </div>

        {/* En-tête */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-600 mb-3 md:mb-4">
            ⭐ {t('app.name')} ⭐
          </h1>
          <p className="text-lg sm:text-xl text-gray-700">
            {t('welcome.title')}
          </p>
        </div>

        {/* Choix du rôle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {/* Parent */}
          <button
            onClick={() => handleRoleSelect('parent')}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all active:scale-95 md:hover:scale-105 border-2 border-transparent hover:border-primary-500"
          >
            <div className="flex flex-col items-center space-y-3 md:space-y-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 md:w-12 md:h-12 text-primary-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">{t('welcome.parent')}</h3>
              <p className="text-sm md:text-base text-gray-600 text-center">
                {t('welcome.parent.desc')}
              </p>
            </div>
          </button>

          {/* Enseignant */}
          <button
            onClick={() => handleRoleSelect('teacher')}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all active:scale-95 md:hover:scale-105 border-2 border-transparent hover:border-primary-500"
          >
            <div className="flex flex-col items-center space-y-3 md:space-y-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-10 h-10 md:w-12 md:h-12 text-primary-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">{t('welcome.teacher')}</h3>
              <p className="text-sm md:text-base text-gray-600 text-center">
                {t('welcome.teacher.desc')}
              </p>
            </div>
          </button>

          {/* Enfant/Élève */}
          <button
            onClick={() => handleRoleSelect('child')}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all active:scale-95 md:hover:scale-105 border-2 border-transparent hover:border-primary-500 sm:col-span-2 md:col-span-1"
          >
            <div className="flex flex-col items-center space-y-3 md:space-y-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary-100 rounded-full flex items-center justify-center">
                <Baby className="w-10 h-10 md:w-12 md:h-12 text-primary-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">{t('welcome.child')}</h3>
              <p className="text-sm md:text-base text-gray-600 text-center">
                {t('welcome.child.desc')}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
