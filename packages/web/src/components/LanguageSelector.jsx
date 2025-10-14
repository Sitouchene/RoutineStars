import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

// Mapping des langues vers les drapeaux (émojis)
const LANGUAGE_FLAGS = {
  fr: '🇨🇦', // Québec/Canada pour français
  en: '🇬🇧', // Angleterre pour anglais
  ar: '🇩🇿', // Algérie pour arabe
};

const LANGUAGE_NAMES = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
};

export default function LanguageSelector({ variant = 'dropdown' }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = i18n.language || 'fr';

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Changer la langue
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
    
    // Mettre à jour la direction du document pour l'arabe (RTL)
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  // Initialiser la direction au chargement
  useEffect(() => {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const availableLanguages = Object.keys(LANGUAGE_FLAGS).filter(lng => lng !== currentLang);

  if (variant === 'buttons') {
    // Version boutons pour WelcomeScreen
    return (
      <div className="flex items-center gap-2 md:gap-3">
        {Object.keys(LANGUAGE_FLAGS).map(lng => (
          <button
            key={lng}
            onClick={() => changeLanguage(lng)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-colors ${
              currentLang === lng
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <span className="text-lg md:text-xl">{LANGUAGE_FLAGS[lng]}</span>
            <span className="text-xs md:text-sm font-medium">{LANGUAGE_NAMES[lng]}</span>
          </button>
        ))}
      </div>
    );
  }

  // Version dropdown pour Dashboard (avec flag)
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton avec flag actuel */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <span className="text-xl">{LANGUAGE_FLAGS[currentLang]}</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {availableLanguages.map(lng => (
            <button
              key={lng}
              onClick={() => changeLanguage(lng)}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-left"
            >
              <span className="text-xl">{LANGUAGE_FLAGS[lng]}</span>
              <span className="text-sm font-medium text-gray-700">{LANGUAGE_NAMES[lng]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

