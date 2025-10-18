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

  const { ref } = useZxing({
    onDecodeResult(result) {
      console.log('QR Code scanné:', result);
      setScanResult(result);
      onScanSuccess?.(result);
    },
    onError(err) {
      console.error('Erreur de scan:', err);
      setError(t('child.qr.scanError'));
    },
    constraints: {
      facingMode: 'environment' // Caméra arrière
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
              <video
                ref={ref}
                className="w-full h-64 object-cover"
                playsInline
                muted
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
                  {t('child.qr.scanning')}
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
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                {t('child.qr.retry')}
              </button>
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