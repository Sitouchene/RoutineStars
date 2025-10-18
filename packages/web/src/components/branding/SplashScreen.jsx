import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import OwlMascot from './OwlMascot';

/**
 * Écran de chargement mOOtify
 * Affiche le logo, la mascotte animée et le slogan
 * 
 * @param {object} props
 * @param {boolean} props.visible - Contrôle la visibilité du splash screen
 * @param {Function} props.onComplete - Callback appelé quand l'animation est terminée
 */
export default function SplashScreen({ visible = true, onComplete }) {
  const { t } = useTranslation();
  
  if (!visible) return null;
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-mootify"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center space-y-8 p-8">
        {/* Mascotte animée */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
        >
          <OwlMascot size="xl" animated={true} />
        </motion.div>
        
        {/* Logo avec animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.4,
          }}
        >
          <Logo size="xl" variant="full" animated={true} />
        </motion.div>
        
        {/* Indicateur de chargement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-2"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-mint-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

