import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { childrenApi } from '../../lib/api-client';

export default function EditChildModal({ child, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    pin: '',
    confirmPin: '',
  });
  const [error, setError] = useState('');
  const { getAuthHeader } = useAuthStore();

  // Initialiser le formulaire avec les données de l'enfant
  useEffect(() => {
    setFormData({
      name: child.name || '',
      age: child.age?.toString() || '',
      pin: '',
      confirmPin: '',
    });
  }, [child]);

  const updateChildMutation = useMutation({
    mutationFn: data => childrenApi.update(child.id, data, getAuthHeader()),
    onSuccess: () => {
      onSuccess();
    },
    onError: error => {
      setError(error.message);
    },
  });

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.pin && formData.pin !== formData.confirmPin) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (formData.pin && (formData.pin.length !== 4 || !/^\d{4}$/.test(formData.pin))) {
      setError(t('child.pin') + ' (4)');
      return;
    }

    if (formData.age < 3 || formData.age > 18) {
      setError(t('common.error'));
      return;
    }

    // Préparer les données à envoyer (seulement les champs modifiés)
    const updateData = {
      name: formData.name,
      age: parseInt(formData.age),
    };

    // Ajouter le PIN seulement s'il a été modifié
    if (formData.pin) {
      updateData.pin = formData.pin;
    }

    updateChildMutation.mutate(updateData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {t('common.edit')} {child.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.name')} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('children.ageLabel') || 'Âge (ans)'} *
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="3"
              max="18"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('child.pinNewLabel')}
            </label>
            <input
              type="password"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              maxLength="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={t('child.pinEditPlaceholder')}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('child.pinNewHelp')}
            </p>
          </div>

          {formData.pin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                name="confirmPin"
                value={formData.confirmPin}
                onChange={handleChange}
                maxLength="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t('auth.confirmPassword')}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary"
              disabled={updateChildMutation.isPending}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
              disabled={updateChildMutation.isPending}
            >
              {updateChildMutation.isPending ? t('common.loading') : t('common.edit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
