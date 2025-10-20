import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

/**
 * Composant Modal de confirmation moderne pour remplacer les confirm()
 * 
 * @param {boolean} isOpen - Contrôle l'affichage du modal
 * @param {string} title - Titre du modal
 * @param {string} message - Message de confirmation
 * @param {string} type - Type de modal (warning, info, success, error)
 * @param {string} confirmText - Texte du bouton de confirmation
 * @param {string} cancelText - Texte du bouton d'annulation
 * @param {function} onConfirm - Callback appelé lors de la confirmation
 * @param {function} onCancel - Callback appelé lors de l'annulation
 * @param {function} onClose - Callback appelé lors de la fermeture
 */
export default function ConfirmModal({
  isOpen = false,
  title = 'Confirmation',
  message,
  type = 'warning',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  onClose
}) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onConfirm?.();
      onClose?.();
    }, 300);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(() => {
      onCancel?.();
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-600" />;
      case 'warning':
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'error':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'warning':
      default:
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleCancel}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-anthracite-light rounded-2xl shadow-xl max-w-md w-full p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                {getIcon()}
                <h3 className="text-lg font-semibold text-anthracite dark:text-cream">
                  {title}
                </h3>
                <button
                  onClick={handleCancel}
                  className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Message */}
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  {message}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${getConfirmButtonStyle()}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook pour gérer les modals de confirmation
 */
export function useConfirm() {
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    onConfirm: null,
    onCancel: null
  });

  const confirm = (options) => {
    return new Promise((resolve) => {
      setModal({
        isOpen: true,
        title: options.title || 'Confirmation',
        message: options.message || 'Êtes-vous sûr ?',
        type: options.type || 'warning',
        confirmText: options.confirmText || 'Confirmer',
        cancelText: options.cancelText || 'Annuler',
        onConfirm: () => {
          setModal(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModal(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  };

  const ConfirmModalComponent = () => (
    <ConfirmModal
      isOpen={modal.isOpen}
      title={modal.title}
      message={modal.message}
      type={modal.type}
      confirmText={modal.confirmText}
      cancelText={modal.cancelText}
      onConfirm={modal.onConfirm}
      onCancel={modal.onCancel}
    />
  );

  return {
    confirm,
    ConfirmModalComponent
  };
}

