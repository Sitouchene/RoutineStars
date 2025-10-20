import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SlideContentV2 from './SlideContentV2';
import ScreenshotsV2 from './ScreenshotsV2';
import { useThemeColors, useOnboardingData } from '../../hooks';

/**
 * Carousel d'onboarding mOOtify V2 - Layout tablette/PC avec contenu scrollable
 * Layout adaptatif : tablette/PC (côte à côte) et mobile (empilé)
 */
export default function OnboardingCarouselV2({ isOpen, onClose }) {
  const { t } = useTranslation();
  const themeColors = useThemeColors();
  const { data: onboardingData, loading, error } = useOnboardingData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showSlideContent, setShowSlideContent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const slides = onboardingData?.slides || [];

  // Détection de la taille d'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Animation progressive du contenu
  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 1000);
    const timer2 = setTimeout(() => setShowSlideContent(true), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setShowContent(false);
    setShowSlideContent(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setShowContent(false);
    setShowSlideContent(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setShowContent(false);
    setShowSlideContent(false);
  };

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

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full h-[90vh] overflow-hidden"
      >
        {/* Header avec navigation */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {/* Header avec icône, titre et sous-titre */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{currentSlideData.icon}</div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{currentSlideData.title}</h2>
              <p className="text-xs text-gray-600">{currentSlideData.subtitle}</p>
            </div>
          </div>

          {/* Bouton fermer seulement sur le dernier slide */}
          {currentSlide === slides.length - 1 && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Contenu principal */}
        <div className="flex-1 p-6 relative flex flex-col">
          {/* Content text avec gradient - Bande pleine largeur */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ 
              opacity: showContent ? 1 : 0,
              x: showContent ? 0 : 50
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6"
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

          {/* Layout adaptatif */}
          {isMobile ? (
            /* Layout Mobile - Empilé */
            <div className="flex-1 flex flex-col space-y-4">
              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto">
                <SlideContentV2 
                  slideData={currentSlideData} 
                  currentSlide={currentSlide}
                  showSlideContent={showSlideContent}
                />
              </div>
              
              {/* Screenshots */}
              <div className="h-64">
                <ScreenshotsV2 
                  screenshots={currentSlideData.screenshots}
                  isMobile={isMobile}
                />
              </div>
            </div>
          ) : (
            /* Layout Tablette/PC - Côte à côte */
            <div className="flex-1 flex space-x-6">
              {/* Contenu scrollable */}
              <div className="w-1/2 overflow-y-auto">
                <SlideContentV2 
                  slideData={currentSlideData} 
                  currentSlide={currentSlide}
                  showSlideContent={showSlideContent}
                />
              </div>
              
              {/* Screenshots */}
              <div className="w-1/2">
                <ScreenshotsV2 
                  screenshots={currentSlideData.screenshots}
                  isMobile={isMobile}
                />
              </div>
            </div>
          )}

          {/* Flèches superposées sur la bande de content */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`absolute left-4 top-20 transform p-2 rounded-full transition-all duration-200 ${
              currentSlide === 0
                ? 'bg-gray-200/50 text-gray-400 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/30 shadow-lg hover:shadow-xl backdrop-blur-sm'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`absolute right-4 top-20 transform p-2 rounded-full transition-all duration-200 ${
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
      </motion.div>
    </div>
  );
}
