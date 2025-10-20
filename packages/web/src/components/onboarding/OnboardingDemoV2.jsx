import { useState } from 'react';
import OnboardingCarouselV2 from './OnboardingCarouselV2';

/**
 * Composant de démonstration pour OnboardingCarouselV2
 */
export default function OnboardingDemoV2() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-400 to-purple-400 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          mOOtify Onboarding V2
        </h1>
        <p className="text-white/90 mb-8">
          Layout adaptatif : tablette/PC (côte à côte) et mobile (empilé)
        </p>
        
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
        >
          Lancer l'onboarding V2
        </button>
      </div>

      <OnboardingCarouselV2 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </div>
  );
}
