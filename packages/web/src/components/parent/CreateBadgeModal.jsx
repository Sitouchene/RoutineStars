import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Modal pour créer ou éditer un badge personnalisé
 */
export default function CreateBadgeModal({ isOpen, onClose, onSave, editingBadge = null }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: editingBadge?.name || '',
    description: editingBadge?.description || '',
    icon: editingBadge?.icon || '🏆',
    category: editingBadge?.category || 'special',
    rarity: editingBadge?.rarity || 'common',
    pointsRequired: editingBadge?.pointsRequired || 10,
    unlockType: editingBadge?.unlockType || 'manual',
    autoCriteria: editingBadge?.autoCriteria || null,
    isSpecial: editingBadge?.isSpecial || false,
    specialReason: editingBadge?.specialReason || ''
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'reading', label: 'Lecture' },
    { value: 'tasks', label: 'Tâches' },
    { value: 'streak', label: 'Régularité' },
    { value: 'special', label: 'Spécial' }
  ];

  const rarities = [
    { value: 'common', label: 'Commun', color: 'text-gray-600 bg-gray-100' },
    { value: 'rare', label: 'Rare', color: 'text-blue-600 bg-blue-100' },
    { value: 'epic', label: 'Épique', color: 'text-purple-600 bg-purple-100' },
    { value: 'legendary', label: 'Légendaire', color: 'text-yellow-600 bg-yellow-100' }
  ];

  const unlockTypes = [
    { value: 'automatic', label: 'Automatique', description: 'Se débloque automatiquement selon des critères' },
    { value: 'manual', label: 'Manuel', description: 'Se débloque uniquement par les parents' },
    { value: 'hybrid', label: 'Hybride', description: 'Automatique + possibilité de déblocage manuel' }
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

    if (formData.pointsRequired < 1) {
      newErrors.pointsRequired = 'Les points doivent être positifs';
    }

    if (formData.unlockType === 'automatic' && !formData.autoCriteria) {
      newErrors.autoCriteria = 'Les critères automatiques sont requis';
    }

    if (formData.isSpecial && !formData.specialReason.trim()) {
      newErrors.specialReason = 'La raison spéciale est requise';
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

  const handleAutoCriteriaChange = (field, value) => {
    const newCriteria = { ...formData.autoCriteria };
    newCriteria[field] = value;
    handleChange('autoCriteria', newCriteria);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {editingBadge ? t('parent.badges.editBadge', 'Modifier le Badge') : t('parent.badges.createBadge', 'Créer un Badge')}
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
            {/* Nom et Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('parent.badges.name', 'Nom')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nom du badge"
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
                  {t('parent.badges.icon', 'Icône')}
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="🏆"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('parent.badges.description', 'Description')} *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Description du badge"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Catégorie et Rareté */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('parent.badges.category', 'Catégorie')}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('parent.badges.rarity', 'Rareté')}
                </label>
                <select
                  value={formData.rarity}
                  onChange={(e) => handleChange('rarity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {rarities.map(rarity => (
                    <option key={rarity.value} value={rarity.value}>{rarity.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Points requis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('parent.badges.pointsRequired', 'Points requis')}
              </label>
              <input
                type="number"
                min="1"
                value={formData.pointsRequired}
                onChange={(e) => handleChange('pointsRequired', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pointsRequired ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.pointsRequired && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.pointsRequired}
                </p>
              )}
            </div>

            {/* Type de déblocage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('parent.badges.unlockType', 'Type de déblocage')}
              </label>
              <div className="space-y-2">
                {unlockTypes.map(type => (
                  <label key={type.value} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="unlockType"
                      value={type.value}
                      checked={formData.unlockType === type.value}
                      onChange={(e) => handleChange('unlockType', e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Critères automatiques */}
            {formData.unlockType === 'automatic' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
                  {t('parent.badges.autoCriteria', 'Critères automatiques')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                      {t('parent.badges.points', 'Points')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.autoCriteria?.points || 0}
                      onChange={(e) => handleAutoCriteriaChange('points', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                      {t('parent.badges.tasks', 'Tâches')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.autoCriteria?.tasks || 0}
                      onChange={(e) => handleAutoCriteriaChange('tasks', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                      {t('parent.badges.books', 'Livres')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.autoCriteria?.books || 0}
                      onChange={(e) => handleAutoCriteriaChange('books', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                      {t('parent.badges.streak', 'Série')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.autoCriteria?.streak || 0}
                      onChange={(e) => handleAutoCriteriaChange('streak', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Badge spécial */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isSpecial}
                  onChange={(e) => handleChange('isSpecial', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('parent.badges.isSpecial', 'Badge spécial')}
                </span>
              </label>
              
              {formData.isSpecial && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('parent.badges.specialReason', 'Raison spéciale')}
                  </label>
                  <input
                    type="text"
                    value={formData.specialReason}
                    onChange={(e) => handleChange('specialReason', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.specialReason ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Ex: Gentillesse, Courage, etc."
                  />
                  {errors.specialReason && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.specialReason}
                    </p>
                  )}
                </div>
              )}
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
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingBadge ? t('common.save', 'Sauvegarder') : t('common.create', 'Créer')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

