import { createAvatar } from '@dicebear/core';
import { adventurer, bottts, pixelArt, avataaars } from '@dicebear/collection';

const STYLE_MAP = {
  'adventure': adventurer,
  'robot': bottts,
  'pixel': pixelArt,
  'surprise': avataaars,
};

/**
 * Convertit un seed d'avatar en URL d'image
 * Format du seed: "style-color-timestamp"
 * Exemple: "adventure-ff6b6b-1703123456789"
 */
export function seedToAvatarUrl(seed) {
  if (!seed) return null;
  
  try {
    const parts = seed.split('-');
    if (parts.length < 3) return null;
    
    const styleKey = parts[0];
    const color = '#' + parts[1];
    const timestamp = parts[2];
    
    const style = STYLE_MAP[styleKey];
    if (!style) return null;
    
    const avatar = createAvatar(style, {
      seed: timestamp,
      backgroundColor: [color],
      size: 128,
    });
    
    return avatar.toDataUri();
  } catch (error) {
    console.error('Erreur lors de la conversion du seed en avatar:', error);
    return null;
  }
}

/**
 * Génère un seed d'avatar à partir des paramètres
 */
export function generateAvatarSeed(styleKey, color) {
  const timestamp = Date.now().toString();
  const colorHex = color.replace('#', '');
  return `${styleKey}-${colorHex}-${timestamp}`;
}
