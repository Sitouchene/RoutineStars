import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useZxing } from 'react-zxing';

/**
 * Composant de scan QR code pour les enfants
 * Permet de scanner un QR code pour rejoindre un groupe
 * 
 * @param {boolean} isOpen - État d'ouverture du scanner
 * @param {function} onClose - Fonction de fermeture
 * @param {function} onScanSuccess - Callback appelé lors d'un scan réussi
 */
export default function QRScanner({ isOpen, onClose, onScanSuccess }) {
  const { t } = useTranslation();
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { ref } = useZxing({
    onDecodeResult(result) {
      console.log('QR Code scanné:', result);
      setScanResult(result);
      onScanSuccess?.(result);
    },
    onError(err) {
      console.error('Erreur de scan:', err);
      if (err.name === 'NotAllowedError') {
        setError('Permission caméra refusée. Veuillez autoriser l\'accès à la caméra.');
      } else if (err.name === 'NotFoundError') {
        setError('Aucune caméra trouvée. Vérifiez que votre appareil a une caméra.');
      } else {
        setError(t('child.qr.scanError'));
      }
    },
    constraints: {
      video: {
        facingMode: 'user' // Caméra frontale par défaut
      }
    },
    timeBetweenDecodingAttempts: 300,
    onDecodeError: (error) => {
      // Ignorer les erreurs de décodage fréquentes
      if (error.name !== 'NotFoundException') {
        console.warn('Erreur de décodage:', error);
      }
    }
  });

  const handleClose = () => {
    setScanResult(null);
    setError(null);
    onClose();
  };

  const handleRetry = () => {
    setScanResult(null);
    setError(null);
    setIsLoading(true);
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      stream.getTracks().forEach(track => track.stop());
      setError(null);
      setIsLoading(true);
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Permission caméra refusée. Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.');
      } else {
        setError('Erreur lors de la demande de permission caméra.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-anthracite-light rounded-2xl p-6 max-w-md w-full shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-anthracite dark:text-cream">
                {t('child.qr.scanTitle')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('child.qr.scanSubtitle')}
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="relative mb-6">
          {!scanResult && !error && (
            <div className="relative bg-black rounded-xl overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-sm">Initialisation de la caméra...</p>
                  </div>
                </div>
              )}
              <video
                ref={ref}
                className="w-full h-64 object-cover"
                playsInline
                muted
                onLoadedData={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setError('Erreur lors du chargement de la caméra');
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-brand rounded-xl bg-transparent">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-brand rounded-tl-xl"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-brand rounded-tr-xl"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-brand rounded-bl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-brand rounded-br-xl"></div>
                </div>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
                  {isLoading ? 'Chargement...' : t('child.qr.scanning')}
                </div>
              </div>
            </div>
          )}

          {scanResult && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                {t('child.qr.scanSuccess')}
              </h4>
              <p className="text-sm text-green-600 dark:text-green-400">
                Code: {scanResult}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                {t('child.qr.scanError')}
              </h4>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                {error}
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  {t('child.qr.retry')}
                </button>
                {error.includes('Permission') && (
                  <button
                    onClick={requestCameraPermission}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Autoriser la caméra
                  </button>
                )}
                {/* Bouton de test temporaire pour développement */}
                <button
                  onClick={() => {
                    const testCode = 'POISSON_CORAL_101';
                    setScanResult(testCode);
                    onScanSuccess?.(testCode);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Test QR (Dev)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {scanResult && (
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-brand text-white rounded-xl hover:bg-brand/90 transition-colors"
            >
              Continuer
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}