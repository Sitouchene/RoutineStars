import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChevronBorder from './ChevronBorder';
import { useThemeColors } from '../../hooks/useThemeColors';

/**
 * Composant SlideContentV2 pour le layout tablette/PC avec contenu scrollable
 * Gère tous les types : features, steps, options, process, rewards
 */
export default function SlideContentV2({ slideData, currentSlide, showSlideContent }) {
  const themeColors = useThemeColors();
  const [currentItem, setCurrentItem] = useState(0);

  // Animation automatique pour les features
  useEffect(() => {
    if (slideData.type === 'features' && slideData.items) {
      const interval = setInterval(() => {
        setCurrentItem((prev) => (prev + 1) % slideData.items.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [slideData.type, slideData.items]);

  // Reset currentItem quand on change de slide
  useEffect(() => {
    setCurrentItem(0);
  }, [currentSlide]);

  const renderFeatures = () => (
    <div className="space-y-3">
      {/* Features avec animation */}
      {slideData.items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.2 }}
          className="text-center"
        >
          {/* Bloc unifié avec icône et texte */}
          <ChevronBorder>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.1, duration: 0.3 }}
              className="backdrop-blur-sm p-4"
              style={{
                background: `linear-gradient(78deg, rgba(255, 255, 255, 0), ${themeColors.primary}80, ${themeColors.secondary}80, rgba(255, 255, 255, 0))`
              }}
            >
              {/* Icône */}
              <div className="text-2xl mb-2">{item.icon}</div>
              {/* Texte */}
              <div className="text-black text-sm font-medium">{item.text}</div>
            </motion.div>
          </ChevronBorder>
        </motion.div>
      ))}
      
      {/* Features supplémentaires si elles existent */}
      {slideData.features && (
        <div className="space-y-2 mt-4">
          {slideData.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (slideData.items.length * 0.2) + index * 0.1 }}
              className="text-center"
            >
              <ChevronBorder>
                <div 
                  className="backdrop-blur-sm p-3"
                  style={{
                    background: `linear-gradient(78deg, rgba(255, 255, 255, 0), ${themeColors.primary}80, ${themeColors.secondary}80, rgba(255, 255, 255, 0))`
                  }}
                >
                  <div className="text-gray-800 text-xs">{feature}</div>
                </div>
              </ChevronBorder>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSteps = () => (
    <div className="space-y-3">
      {slideData.items.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.2 }}
          className="text-center"
        >
          {/* Bloc unifié avec numéro et texte */}
          <ChevronBorder>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.1, duration: 0.3 }}
              className="backdrop-blur-sm p-4"
              style={{
                background: `linear-gradient(78deg, rgba(255, 255, 255, 0), ${themeColors.primary}80, ${themeColors.secondary}80, rgba(255, 255, 255, 0))`
              }}
            >
              {/* Numéro */}
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-2">
                {step.step}
              </div>
              {/* Texte */}
              <div className="text-black text-sm font-medium">{step.text}</div>
            </motion.div>
          </ChevronBorder>
        </motion.div>
      ))}
    </div>
  );

  const renderOptions = () => (
    <div className="space-y-3">
      {slideData.items.map((option, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.2 }}
          className="text-center"
        >
          {/* Bloc unifié avec icône, titre et description */}
          <ChevronBorder>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.1, duration: 0.3 }}
              className="backdrop-blur-sm p-4"
              style={{
                background: `linear-gradient(78deg, rgba(255, 255, 255, 0), ${themeColors.primary}80, ${themeColors.secondary}80, rgba(255, 255, 255, 0))`
              }}
            >
              {/* Icône */}
              <div className="text-2xl mb-2">{option.icon}</div>
              {/* Titre */}
              <div className="text-black text-sm font-semibold mb-1">{option.title}</div>
              {/* Description */}
              <div className="text-gray-600 text-xs">{option.description}</div>
            </motion.div>
          </ChevronBorder>
        </motion.div>
      ))}
    </div>
  );

  const renderProcess = () => (
    <div className="space-y-4">
      {slideData.items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.2 }}
          className="text-center"
        >
          {/* Bloc unifié avec titre et étapes */}
          <ChevronBorder>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.1, duration: 0.3 }}
              className="backdrop-blur-sm p-4"
              style={{
                background: `linear-gradient(78deg, rgba(255, 255, 255, 0), ${themeColors.primary}80, ${themeColors.secondary}80, rgba(255, 255, 255, 0))`
              }}
            >
              {/* Titre */}
              <div className="text-black text-sm font-semibold mb-3">{item.title}</div>
              
              {/* Étapes */}
              <div className="space-y-1">
                {item.steps.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    className="text-gray-600 text-xs text-left"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </motion.div>
          </ChevronBorder>
        </motion.div>
      ))}

      {/* Bénéfices */}
      {slideData.benefits && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {slideData.benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (slideData.items.length * 0.2) + index * 0.1 }}
              className="text-center"
            >
              {/* Bloc unifié avec icône et texte */}
              <ChevronBorder>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: (slideData.items.length * 0.2) + index * 0.1 + 0.1, duration: 0.3 }}
                  className="backdrop-blur-sm p-3"
                  style={{
                    background: `linear-gradient(78deg, rgba(255, 255, 255, 0), ${themeColors.primary}80, ${themeColors.secondary}80, rgba(255, 255, 255, 0))`
                  }}
                >
                  {/* Icône */}
                  <div className="text-lg mb-1">{benefit.split(' ')[0]}</div>
                  {/* Texte */}
                  <div className="text-gray-600 text-xs">{benefit.substring(2)}</div>
                </motion.div>
              </ChevronBorder>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-3">
      {slideData.items.map((reward, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.2 }}
          className="text-center"
        >
          {/* Bloc unifié avec icône, titre et description */}
          <ChevronBorder>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.1, duration: 0.3 }}
              className="backdrop-blur-sm p-4"
              style={{
                background: `linear-gradient(78deg, rgba(255, 255, 255, 0), ${themeColors.primary}80, ${themeColors.secondary}80, rgba(255, 255, 255, 0))`
              }}
            >
              {/* Icône */}
              <div className="text-2xl mb-2">{reward.icon}</div>
              {/* Titre */}
              <div className="text-black text-sm font-semibold mb-1">{reward.title}</div>
              {/* Description */}
              <div className="text-gray-600 text-xs">{reward.description}</div>
            </motion.div>
          </ChevronBorder>
        </motion.div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (slideData.type) {
      case 'features':
        return renderFeatures();
      case 'steps':
        return renderSteps();
      case 'options':
        return renderOptions();
      case 'process':
        return renderProcess();
      case 'rewards':
        return renderRewards();
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: showSlideContent ? 1 : 0,
        y: showSlideContent ? 0 : 20
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-full"
    >
      {renderContent()}
    </motion.div>
  );
}
