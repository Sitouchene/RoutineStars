import { motion } from 'framer-motion';
import { clsx } from 'clsx';

/**
 * Composant Card mOOtify avec style arrondi et variantes
 * 
 * @param {object} props
 * @param {string} props.variant - Variante : 'default', 'elevated', 'interactive'
 * @param {boolean} props.animated - Activer les animations
 * @param {string} props.className - Classes CSS additionnelles
 * @param {React.ReactNode} props.children - Contenu de la carte
 * @param {Function} props.onClick - Fonction de clic (pour interactive)
 */
export default function Card({
  variant = 'default',
  animated = false,
  className = '',
  children,
  onClick,
  ...props
}) {
  const baseStyles = 'bg-white rounded-2xl p-6 transition-all duration-200';
  
  const variants = {
    default: 'shadow-sm border border-gray-100 hover:shadow-md',
    elevated: 'shadow-lg border border-gray-100',
    interactive: 'shadow-md border border-gray-100 hover:shadow-xl cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
  };
  
  // Mode sombre
  const darkMode = 'dark:bg-anthracite-light dark:border-gray-700';
  
  const Component = animated ? motion.div : 'div';
  
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  } : {};
  
  const interactiveProps = variant === 'interactive' && onClick ? {
    onClick,
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick(e);
      }
    },
  } : {};
  
  return (
    <Component
      className={clsx(
        baseStyles,
        variants[variant],
        darkMode,
        className
      )}
      {...animationProps}
      {...interactiveProps}
      {...props}
    >
      {children}
    </Component>
  );
}

