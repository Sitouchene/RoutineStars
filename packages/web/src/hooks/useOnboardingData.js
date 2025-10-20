import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Import des données selon la langue
import onboardingDataFr from '../components/onboarding/data/onboardingData.fr.json';
import onboardingDataEn from '../components/onboarding/data/onboardingData.en.json';
import onboardingDataAr from '../components/onboarding/data/onboardingData.ar.json';

/**
 * Hook pour charger les données d'onboarding selon la langue
 */
export const useOnboardingData = () => {
  const { i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      // Déterminer la langue actuelle
      const currentLanguage = i18n.language || 'fr';
      let languageCode = 'fr'; // Par défaut
      
      if (currentLanguage.startsWith('en')) {
        languageCode = 'en';
      } else if (currentLanguage.startsWith('ar')) {
        languageCode = 'ar';
      }

      // Charger les données selon la langue
      let onboardingData;
      switch (languageCode) {
        case 'en':
          onboardingData = onboardingDataEn;
          break;
        case 'ar':
          onboardingData = onboardingDataAr;
          break;
        default:
          onboardingData = onboardingDataFr;
      }
      
      setData(onboardingData);
    } catch (err) {
      console.error('Error loading onboarding data:', err);
      setError(err);
      
      // Fallback vers le français en cas d'erreur
      setData(onboardingDataFr);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  return { data, loading, error };
};
