import QRCode from 'react-qr-code';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Modale d'affichage du QR Code du groupe
 * Permet aux parents/enseignants de partager le code de groupe
 * Le QR code peut être scanné pour rejoindre le groupe rapidement
 * 
 * @param {string} groupCode - Code du groupe à afficher
 * @param {string} groupName - Nom du groupe
 * @param {boolean} isOpen - État d'ouverture de la modale
 * @param {function} onClose - Fonction de fermeture de la modale
 */
export default function GroupQRCode({ groupCode, groupName, isOpen, onClose }) {
  const { t } = useTranslation();
  
  if (!isOpen) return null;
  
  const qrValue = `${window.location.origin}/child-login?code=${groupCode}`;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-anthracite-light rounded-2xl p-6 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold text-anthracite dark:text-cream">
            {t('parent.dashboard.qrCode')}
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* QR Code */}
        <div className="bg-gradient-to-br from-mint-400 to-purple-400 p-8 rounded-2xl mb-6">
          <div className="bg-white p-4 rounded-xl">
            <QRCode 
              value={qrValue} 
              size={256} 
              className="w-full h-auto"
              level="H"
              includeMargin
            />
          </div>
        </div>
        
        {/* Informations */}
        <div className="text-center">
          <p className="text-lg font-display font-semibold text-brand mb-2">
            {groupName}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t('parent.dashboard.qrCodeDescription')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg inline-block">
            <code className="font-mono text-lg font-semibold text-anthracite dark:text-cream">
              {groupCode}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

