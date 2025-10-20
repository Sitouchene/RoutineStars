import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Modal pour créer ou éditer une récompense personnalisée
 */
export default function CreateRewardModal({ isOpen, onClose, onSave, editingReward = null }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: editingReward?.name || '',
    description: editingReward?.description || '',
    icon: editingReward?.icon || '🎁',
    category: editingReward?.category || 'toy',
    cost: editingReward?.cost || 50
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'toy', label: 'Jouet' },
    { value: 'activity', label: 'Activité' },
    { value: 'privilege', label: 'Privilège' },
    { value: 'special', label: 'Spécial' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (formData.cost < 1) {
      newErrors.cost = 'Le coût doit être positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {editingReward ? t('parent.rewards.editReward', 'Modifier la Récompense') : t('parent.rewards.createReward', 'Créer une Récompense')}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom et Icône */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('parent.rewards.name', 'Nom')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nom de la récompense"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('parent.rewards.icon', 'Icône')}
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="🎁"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('parent.rewards.description', 'Description')} *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Description de la récompense"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Catégorie et Coût */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('parent.rewards.category', 'Catégorie')}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('parent.rewards.cost', 'Coût (points)')} *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.cost}
                  onChange={(e) => handleChange('cost', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.cost ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.cost && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.cost}
                  </p>
                )}
              </div>
            </div>

            {/* Aperçu */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {t('parent.rewards.preview', 'Aperçu')}
              </h3>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                <span className="text-2xl">{formData.icon}</span>
                <div className="flex-grow">
                  <h4 className="font-medium text-gray-900 dark:text-white">{formData.name || 'Nom de la récompense'}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formData.description || 'Description...'}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{formData.cost || 0} pts</div>
                  <div className="text-xs text-gray-500">{categories.find(c => c.value === formData.category)?.label}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingReward ? t('common.save', 'Sauvegarder') : t('common.create', 'Créer')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

