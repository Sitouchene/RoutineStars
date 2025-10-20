import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SlideContent from './SlideContent';
import Screenshots from './Screenshots';
import { useThemeColors, useOnboardingData } from '../../hooks';

/**
 * Carousel d'onboarding mOOtify - 6 slides
 * Style navigation avec mini rectangles ▭▭▬▭▭▭
 */
export default function OnboardingCarousel({ isOpen, onClose }) {
  const { t } = useTranslation();
  const themeColors = useThemeColors();
  const { data: onboardingData, loading, error } = useOnboardingData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showSlideContent, setShowSlideContent] = useState(false);
  
  const slides = onboardingData?.slides || [];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Logique d'affichage progressif
  useEffect(() => {
    // Reset des états à chaque changement de slide
    setShowContent(false);
    setShowSlideContent(false);

    // Délai pour laisser voir les images d'abord
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 2000); // 2 secondes pour voir les images

    // Délai pour afficher le contenu des slides
    const slideContentTimer = setTimeout(() => {
      setShowSlideContent(true);
    }, 4000); // 4 secondes au total

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(slideContentTimer);
    };
  }, [currentSlide]);

  const currentSlideData = slides[currentSlide];

  if (!isOpen) return null;

  // Gestion du loading et des erreurs
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'onboarding...</p>
        </div>
      </div>
    );
  }

  if (error || !onboardingData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">Erreur lors du chargement de l'onboarding</p>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full h-[90vh] overflow-hidden"
      >
        {/* Contenu principal */}
        <div className="flex flex-col h-[90vh]">
          {/* Zone de contenu */}
          <div className="flex-1 p-6 relative flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                {/* Header compact avec icône, titre et sous-titre */}
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{currentSlideData.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">
                      {currentSlideData.title}
                    </h2>
                    <p className="text-xs text-gray-600">
                      {currentSlideData.subtitle}
                    </p>
                  </div>
                  {/* Bouton fermer uniquement sur le dernier slide */}
                  {currentSlide === slides.length - 1 && (
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Zone des screenshots - Prend toute la place disponible */}
                <div className="flex-1 relative min-h-0">
                  {/* Screenshots en arrière-plan */}
                  <div className="absolute inset-0">
                    <Screenshots screenshots={currentSlideData.screenshots} />
                  </div>
                  
                  {/* Overlay de contenu avec positionnement */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col">
                    {/* Content en haut - Mis en valeur */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ 
                        opacity: showContent ? 1 : 0,
                        x: showContent ? 0 : 50
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute top-0 left-0 right-0"
                    >
                      <div 
                        className="backdrop-blur-sm p-4"
                        style={{
                          background: `linear-gradient(78deg, rgba(255, 255, 255, 0), ${themeColors.primary}80, ${themeColors.secondary}80, rgba(255, 255, 255, 0))`
                        }}
                      >
                        <p className="text-sm font-semibold text-black text-center drop-shadow-lg">
                          {currentSlideData.content}
                        </p>
                      </div>
                    </motion.div>

                    {/* SlideContent au milieu et en bas */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: showSlideContent ? 1 : 0,
                        y: showSlideContent ? 0 : 20
                      }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                      className="absolute bottom-4 left-4 right-4"
                    >
                      <SlideContent slideData={currentSlideData} currentSlide={currentSlide} />
                    </motion.div>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Flèches superposées sur la bande de content */}
            {/* Flèche gauche */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`absolute left-4 top-4 transform p-2 rounded-full transition-all duration-200 ${
                currentSlide === 0
                  ? 'bg-gray-200/50 text-gray-400 cursor-not-allowed'
                  : 'bg-white/20 text-white hover:bg-white/30 shadow-lg hover:shadow-xl backdrop-blur-sm'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Flèche droite */}
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className={`absolute right-4 top-4 transform p-2 rounded-full transition-all duration-200 ${
                currentSlide === slides.length - 1
                  ? 'bg-gray-200/50 text-gray-400 cursor-not-allowed'
                  : 'bg-white/20 text-white hover:bg-white/30 shadow-lg hover:shadow-xl backdrop-blur-sm'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Indicateurs de progression en bas */}
          <div className="flex justify-center items-center space-x-3 p-6 bg-gray-50 border-t border-gray-200">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-12 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? 'bg-gradient-to-r from-mint-400 to-purple-400'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
