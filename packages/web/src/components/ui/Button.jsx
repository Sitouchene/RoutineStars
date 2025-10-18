import { motion } from 'framer-motion';
import { clsx } from 'clsx';

/**
 * Composant Button mOOtify avec animations et variantes
 * 
 * @param {object} props
 * @param {string} props.variant - Variante : 'primary', 'secondary', 'ghost', 'outline'
 * @param {string} props.size - Taille : 'sm', 'md', 'lg'
 * @param {boolean} props.animated - Activer les animations de rebond
 * @param {boolean} props.disabled - Bouton désactivé
 * @param {string} props.className - Classes CSS additionnelles
 * @param {React.ReactNode} props.children - Contenu du bouton
 * @param {Function} props.onClick - Fonction de clic
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  animated = true,
  disabled = false,
  className = '',
  children,
  onClick,
  ...props
}) {
  const baseStyles = 'font-medium transition-all duration-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-mint-400 text-white hover:bg-mint-500 focus:ring-mint-400 shadow-md hover:shadow-lg disabled:bg-mint-200',
    secondary: 'bg-purple-400 text-white hover:bg-purple-500 focus:ring-purple-400 shadow-md hover:shadow-lg disabled:bg-purple-200',
    ghost: 'bg-transparent text-anthracite hover:bg-mint-50 border-2 border-mint-400 focus:ring-mint-400 disabled:border-gray-300 disabled:text-gray-400',
    outline: 'bg-transparent text-mint-400 hover:bg-mint-50 border-2 border-mint-400 focus:ring-mint-400 disabled:border-gray-300 disabled:text-gray-400',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const Component = animated ? motion.button : 'button';
  
  const animationProps = animated && !disabled ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  } : {};
  
  return (
    <Component
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled}
      onClick={onClick}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
}

