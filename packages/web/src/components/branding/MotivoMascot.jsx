import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OwlMascot from './OwlMascot';

/**
 * Composant MotivoMascot - La chouette mOOtify avec messages contextuels
 * Affiche la mascotte avec des messages motivants dans une bulle de dialogue
 * 
 * @param {string} message - Message à afficher dans la bulle
 * @param {string} emotion - Émotion de la mascotte (happy, excited, thinking)
 * @param {string} size - Taille de la mascotte (sm, md, lg, xl)
 * @param {boolean} autoHide - Masquer automatiquement le message après 5 secondes
 */
export default function MotivoMascot({ 
  message, 
  emotion = 'happy', 
  size = 'md',
  autoHide = true
}) {
  const [showMessage, setShowMessage] = useState(false);
  
  useEffect(() => {
    if (message) {
      setShowMessage(true);
      
      if (autoHide) {
        const timer = setTimeout(() => setShowMessage(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [message, autoHide]);
  
  return (
    <div className="relative">
      <OwlMascot size={size} animated />
      
      {/* Bulle de dialogue */}
      <AnimatePresence>
        {showMessage && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-anthracite-light rounded-2xl px-4 py-2 shadow-lg border-2 border-brand min-w-max max-w-xs z-10"
          >
            <div className="text-sm font-medium text-anthracite dark:text-cream text-center">
              {message}
            </div>
            {/* Pointe de la bulle */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-brand"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


