import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

/**
 * Composant pour afficher le statut de connexion realtime
 */
export default function RealtimeStatus({ isConnected, showDetails = false }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!showDetails && isConnected) {
    return null; // Masquer si connecté et pas de détails demandés
  }

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
          isConnected 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {isConnected ? (
          <Wifi className="w-3 h-3" />
        ) : (
          <WifiOff className="w-3 h-3" />
        )}
        <span className="font-medium">
          {isConnected ? 'Temps réel' : 'Hors ligne'}
        </span>
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50">
          {isConnected 
            ? 'Synchronisation en temps réel activée' 
            : 'Connexion temps réel indisponible'
          }
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}
