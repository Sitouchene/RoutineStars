import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Composant pour afficher les screenshots avec défilement lent et détection d'écran
 * Supporte mobile et tablette avec images conditionnelles
 */
export default function Screenshots({ screenshots }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  if (!screenshots || (!screenshots.mobile && !screenshots.tablet)) return null;

  // Détection de la taille d'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Breakpoint md de Tailwind
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Sélection des images selon la taille d'écran
  const currentImages = isMobile ? screenshots.mobile : screenshots.tablet;
  const deviceType = isMobile ? 'mobile' : 'tablet';

  // Défilement automatique des images
  useEffect(() => {
    if (currentImages && currentImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
      }, 3000); // Change d'image toutes les 3 secondes

      return () => clearInterval(interval);
    }
  }, [currentImages]);

  if (!currentImages || currentImages.length === 0) return null;

  return (
    <div className="w-full h-full">
      <div className="w-full h-full relative overflow-hidden rounded-xl">
        {currentImages.map((screenshot, index) => (
          <motion.div
            key={`${deviceType}-${index}`}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentImageIndex ? 1 : 0
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {screenshot.image ? (
              // Afficher la vraie image
              <img
                src={screenshot.image}
                alt={screenshot.placeholder}
                className="w-full h-full object-cover"
              />
            ) : (
              // Afficher le placeholder
              <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4">
                <div className="text-gray-500 text-xs text-center">
                  <div className="mb-2">
                    {deviceType === 'mobile' ? '📱' : '📱'}
                  </div>
                  <div className="font-medium mb-1">
                    {deviceType === 'mobile' ? 'Mobile' : 'Tablette'}
                  </div>
                </div>
              </div>
            )}
            
          </motion.div>
        ))}
      </div>
    </div>
  );
}
