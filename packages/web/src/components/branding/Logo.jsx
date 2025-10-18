import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * Logo mOOtify avec les deux "O" stylisés comme des yeux de chouette
 * 
 * @param {object} props
 * @param {string} props.size - Taille du logo : 'sm', 'md', 'lg', 'xl'
 * @param {string} props.variant - Variante : 'full' (avec slogan) ou 'compact'
 * @param {boolean} props.animated - Activer les animations
 * @param {string} props.className - Classes CSS additionnelles
 */
export default function Logo({ 
  size = 'md', 
  variant = 'compact', 
  animated = false,
  className = ''
}) {
  const { t } = useTranslation();
  
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
    xl: 'text-6xl',
  };
  
  const eyeSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };
  
  const sloganSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };
  
  const LogoContent = animated ? motion.div : 'div';
  
  const animationProps = animated ? {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { 
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  } : {};
  
  return (
    <LogoContent className={`flex flex-col items-center ${className}`} {...animationProps}>
      {/* Logo principal */}
      <div className={`font-display font-bold ${sizes[size]} flex items-center gap-0.5`}>
        {/* m */}
        <span className="text-mint-400">m</span>
        
        {/* Premier O (œil gauche) */}
        <span className="relative inline-flex items-center justify-center">
          <span className="text-mint-400">O</span>
          <motion.div
            className={`absolute ${eyeSizes[size]} bg-anthracite rounded-full`}
            animate={animated ? { scaleY: [1, 0.1, 1] } : {}}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1/3 h-1/3 bg-white rounded-full"></div>
            </div>
          </motion.div>
        </span>
        
        {/* Second O (œil droit) */}
        <span className="relative inline-flex items-center justify-center">
          <span className="text-mint-400">O</span>
          <motion.div
            className={`absolute ${eyeSizes[size]} bg-anthracite rounded-full`}
            animate={animated ? { scaleY: [1, 0.1, 1] } : {}}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatDelay: 3,
              delay: 0.05,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1/3 h-1/3 bg-white rounded-full"></div>
            </div>
          </motion.div>
        </span>
        
        {/* tify */}
        <span className="text-purple-400">tify</span>
      </div>
      
      {/* Slogan (uniquement en mode full) */}
      {variant === 'full' && (
        <motion.p
          className={`${sloganSizes[size]} text-anthracite-light font-medium mt-2 tracking-wide`}
          initial={animated ? { opacity: 0, y: -10 } : {}}
          animate={animated ? { opacity: 1, y: 0 } : {}}
          transition={animated ? { delay: 0.3 } : {}}
        >
          {t('app.slogan', 'Chaque effort compte')}
        </motion.p>
      )}
    </LogoContent>
  );
}

