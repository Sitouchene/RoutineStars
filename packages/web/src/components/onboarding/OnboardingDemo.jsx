import { useState } from 'react';
import OnboardingCarousel from './OnboardingCarousel';

/**
 * Composant de démonstration pour tester le carousel d'onboarding
 */
export default function OnboardingDemo() {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Logo mOOtify */}
        <div className="space-y-4">
          <div className="text-8xl">🦉</div>
          <h1 className="text-4xl font-bold text-gray-800">mOOtify</h1>
          <p className="text-xl text-gray-600">Chaque effort compte ✨</p>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            Découvrez comment mOOtify peut transformer l'organisation de votre famille
            et développer l'autonomie de vos enfants.
          </p>
          <p className="text-gray-600">
            Notre carousel d'onboarding vous guide à travers toutes les fonctionnalités
            en 6 étapes simples.
          </p>
        </div>

        {/* Bouton de lancement */}
        <button
          onClick={() => setIsCarouselOpen(true)}
          className="px-8 py-4 bg-gradient-to-r from-mint-400 to-purple-400 text-white rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          Découvrir mOOtify
        </button>

        {/* Informations supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="text-center p-4 bg-white/50 rounded-xl">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-2">Rapide</h3>
            <p className="text-sm text-gray-600">Onboarding en 2 minutes</p>
          </div>
          <div className="text-center p-4 bg-white/50 rounded-xl">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-800 mb-2">Ciblé</h3>
            <p className="text-sm text-gray-600">6 étapes essentielles</p>
          </div>
          <div className="text-center p-4 bg-white/50 rounded-xl">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-semibold text-gray-800 mb-2">Interactif</h3>
            <p className="text-sm text-gray-600">Animations et transitions</p>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <OnboardingCarousel 
        isOpen={isCarouselOpen} 
        onClose={() => setIsCarouselOpen(false)} 
      />
    </div>
  );
}
