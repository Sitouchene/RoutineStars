import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * mOOtify Theme Store
 * Gère les thèmes de l'application : default, kids-boy, kids-girl
 */
const useThemeStore = create(
  persist(
    (set, get) => ({
      // Thème actuel
      theme: 'default',
      
      // Thèmes disponibles
      themes: {
        default: {
          id: 'default',
          name: 'mOOtify',
          primary: '#58D6A8',
          secondary: '#B69CF4',
          description: 'Thème par défaut équilibré et bienveillant',
        },
        'kids-boy': {
          id: 'kids-boy',
          name: 'Aventurier',
          primary: '#38bdf8',
          secondary: '#14b8a6',
          description: 'Thème bleu-vert dynamique',
        },
        'kids-girl': {
          id: 'kids-girl',
          name: 'Créatif',
          primary: '#fb7185',
          secondary: '#f9a8d4',
          description: 'Thème rose-corail doux',
        },
      },
      
      // Définir le thème
      setTheme: (themeId) => {
        const validThemes = ['default', 'kids-boy', 'kids-girl'];
        if (!validThemes.includes(themeId)) {
          console.error(`Theme "${themeId}" is not valid. Using default.`);
          themeId = 'default';
        }
        
        // Appliquer le thème au DOM
        if (themeId === 'default') {
          document.documentElement.removeAttribute('data-theme');
        } else {
          document.documentElement.setAttribute('data-theme', themeId);
        }
        
        set({ theme: themeId });
      },
      
      // Obtenir les infos du thème actuel
      getCurrentTheme: () => {
        const { theme, themes } = get();
        return themes[theme];
      },
      
      // Basculer vers le thème suivant
      cycleTheme: () => {
        const { theme, setTheme } = get();
        const themeOrder = ['default', 'kids-boy', 'kids-girl'];
        const currentIndex = themeOrder.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themeOrder.length;
        setTheme(themeOrder[nextIndex]);
      },
    }),
    {
      name: 'mootify-theme-storage',
      onRehydrateStorage: () => (state) => {
        // Appliquer le thème après la réhydratation
        if (state?.theme && state.theme !== 'default') {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);

export { useThemeStore };

