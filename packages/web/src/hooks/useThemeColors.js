import { useState, useEffect } from 'react';

/**
 * Hook pour obtenir les couleurs du thème actuel
 */
export const useThemeColors = () => {
  const [colors, setColors] = useState({
    primary: '#58D6A8',
    secondary: '#B69CF4'
  });

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const primary = getComputedStyle(root).getPropertyValue('--theme-primary').trim();
      const secondary = getComputedStyle(root).getPropertyValue('--theme-secondary').trim();
      
      if (primary && secondary) {
        setColors({ primary, secondary });
      }
    };

    updateColors();
    
    // Écouter les changements de thème
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  return colors;
};
