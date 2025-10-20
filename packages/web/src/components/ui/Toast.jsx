import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Composant Toast moderne pour remplacer les alerts
 * 
 * @param {string} type - Type de toast (success, error, warning, info)
 * @param {string} message - Message à afficher
 * @param {number} duration - Durée d'affichage en ms (défaut: 5000)
 * @param {boolean} show - Contrôle l'affichage du toast
 * @param {function} onClose - Callback appelé à la fermeture
 */
export default function Toast({ 
  type = 'info', 
  message, 
  duration = 5000, 
  show = false, 
  onClose 
}) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Attendre l'animation de sortie
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getStyles()} border rounded-lg shadow-lg p-4`}
        >
          <div className="flex items-start gap-3">
            {getIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {message}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook pour gérer les toasts
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message, duration, show: true }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration) => addToast('success', message, duration);
  const error = (message, duration) => addToast('error', message, duration);
  const warning = (message, duration) => addToast('warning', message, duration);
  const info = (message, duration) => addToast('info', message, duration);

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          show={toast.show}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );

  return {
    success,
    error,
    warning,
    info,
    ToastContainer
  };
}

