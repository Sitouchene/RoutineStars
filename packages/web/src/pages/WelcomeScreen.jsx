import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, GraduationCap, Baby } from 'lucide-react';
import { motion } from 'framer-motion';
import LanguageSelector from '../components/LanguageSelector';
import Logo from '../components/branding/Logo';
import OwlMascot from '../components/branding/OwlMascot';

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
    <div className="min-h-screen bg-gradient-mootify flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl w-full">
        {/* Sélecteur de langue en haut */}
        <div className="flex justify-center mb-6 md:mb-8">
          <LanguageSelector variant="buttons" />
        </div>

        {/* En-tête avec Logo et Mascotte */}
        <motion.div 
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mascotte */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
            className="flex justify-center mb-6"
          >
            <OwlMascot size="lg" animated={true} />
          </motion.div>
          
          {/* Logo mOOtify */}
          <Logo size="xl" variant="full" animated={true} />
        </motion.div>

        {/* Choix du rôle */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
        >
          {/* Parent */}
          <motion.button
            onClick={() => handleRoleSelect('parent')}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-mint-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col items-center space-y-3 md:space-y-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-mint-100 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 md:w-12 md:h-12 text-mint-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-anthracite">{t('welcome.parent')}</h3>
              <p className="text-sm md:text-base text-gray-600 text-center">
                {t('welcome.parent.desc')}
              </p>
            </div>
          </motion.button>

          {/* Enseignant */}
          <motion.button
            onClick={() => handleRoleSelect('teacher')}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col items-center space-y-3 md:space-y-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-purple-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-10 h-10 md:w-12 md:h-12 text-purple-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-anthracite">{t('welcome.teacher')}</h3>
              <p className="text-sm md:text-base text-gray-600 text-center">
                {t('welcome.teacher.desc')}
              </p>
            </div>
          </motion.button>

          {/* Enfant/Élève */}
          <motion.button
            onClick={() => handleRoleSelect('child')}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-mint-400 sm:col-span-2 md:col-span-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex flex-col items-center space-y-3 md:space-y-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-mint-100 rounded-full flex items-center justify-center">
                <Baby className="w-10 h-10 md:w-12 md:h-12 text-mint-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-anthracite">{t('welcome.child')}</h3>
              <p className="text-sm md:text-base text-gray-600 text-center">
                {t('welcome.child.desc')}
              </p>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
