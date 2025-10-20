import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Composant ScreenshotsV2 pour afficher les screenshots qui défilent
 * Layout adaptatif pour tablette/PC et mobile
 */
export default function ScreenshotsV2({ screenshots, isMobile }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Défilement automatique des images
  useEffect(() => {
    if (!screenshots) return;
    
    const images = isMobile ? screenshots.mobile : screenshots.tablet;
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [screenshots, isMobile]);

  if (!screenshots) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500 text-sm">Aucune image disponible</div>
      </div>
    );
  }

  const images = isMobile ? screenshots.mobile : screenshots.tablet;
  
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500 text-sm">Aucune image disponible</div>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg bg-gray-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full flex items-center justify-center"
        >
          {currentImage.image ? (
            <img
              src={currentImage.image}
              alt={currentImage.placeholder}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-500 text-sm mb-2">{currentImage.placeholder}</div>
                <div className="text-gray-400 text-xs">{currentImage.resolution}</div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Indicateurs de progression pour les images */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentImageIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
