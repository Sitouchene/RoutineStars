import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createAvatar } from '@dicebear/core';
import { adventurer, bottts, pixelArt, avataaars } from '@dicebear/collection';
import { X, RefreshCw } from 'lucide-react';
import { generateAvatarSeed } from '../../utils/avatarUtils';

const getAvatarStyles = (t) => ({
  adventure: {
    name: t('avatar.styles.adventure'),
    style: adventurer,
    description: t('avatar.styles.adventureDesc'),
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57']
  },
  robot: {
    name: t('avatar.styles.robot'),
    style: bottts,
    description: t('avatar.styles.robotDesc'),
    colors: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7']
  },
  pixel: {
    name: t('avatar.styles.pixel'),
    style: pixelArt,
    description: t('avatar.styles.pixelDesc'),
    colors: ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#3498db']
  },
  surprise: {
    name: t('avatar.styles.surprise'),
    style: avataaars,
    description: t('avatar.styles.surpriseDesc'),
    colors: ['#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43']
  }
});

export default function AvatarSelector({ currentAvatar, onAvatarChange, onClose }) {
  const { t } = useTranslation();
  const [selectedStyle, setSelectedStyle] = useState('adventure');
  const [selectedColor, setSelectedColor] = useState('#ff6b6b');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const AVATAR_STYLES = getAvatarStyles(t);

  const generateAvatar = (style, color) => {
    try {
      const avatar = createAvatar(style, {
        seed: Math.random().toString(36).substring(7),
        backgroundColor: [color],
        size: 128,
      });
      return avatar.toDataUri();
    } catch (error) {
      console.error(t('common.error') + ':', error);
      return currentAvatar;
    }
  };

  const handleStyleChange = (styleKey) => {
    setSelectedStyle(styleKey);
    const style = AVATAR_STYLES[styleKey];
    setSelectedColor(style.colors[0]);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleGenerateNew = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newSeed = generateAvatarSeed(selectedStyle, selectedColor);
      onAvatarChange(newSeed);
      setIsGenerating(false);
    }, 500);
  };

  const handleConfirm = () => {
    const newSeed = generateAvatarSeed(selectedStyle, selectedColor);
    onAvatarChange(newSeed);
    onClose();
  };

  const currentStyle = AVATAR_STYLES[selectedStyle];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('avatar.title')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Style Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('avatar.chooseStyle')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(AVATAR_STYLES).map(([key, style]) => (
              <button
                key={key}
                onClick={() => handleStyleChange(key)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedStyle === key
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">
                    {generateAvatar(style.style, style.colors[0]) ? (
                      <img
                        src={generateAvatar(style.style, style.colors[0])}
                        alt={style.name}
                        className="w-12 h-12 mx-auto rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
                    )}
                  </div>
                  <div className="font-medium text-sm text-gray-900">
                    {style.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {style.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('avatar.chooseColor')}
          </h3>
          <div className="flex gap-3 flex-wrap">
            {currentStyle.colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-12 h-12 rounded-full border-4 transition-all ${
                  selectedColor === color
                    ? 'border-gray-800 scale-110'
                    : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('avatar.preview')}
          </h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              {isGenerating ? (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
              ) : (
                <img
                  src={generateAvatar(currentStyle.style, selectedColor)}
                  alt={t('avatar.previewAlt')}
                  className="w-24 h-24 rounded-full border-4 border-gray-200"
                />
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleGenerateNew}
            disabled={isGenerating}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {t('avatar.generateNew')}
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            {t('avatar.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
