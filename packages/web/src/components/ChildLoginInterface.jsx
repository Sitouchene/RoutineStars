import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { childrenApi, authApi } from '../lib/api-client';

export default function ChildLoginInterface() {
  const [selectedChild, setSelectedChild] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [familyId, setFamilyId] = useState('');
  const [showFamilyInput, setShowFamilyInput] = useState(true);

  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  // Récupérer la liste des enfants depuis l'API
  const { data: children = [], isLoading } = useQuery({
    queryKey: ['children-for-login', familyId],
    queryFn: async () => {
      if (!familyId) return [];
      
      try {
        const response = await fetch(`http://localhost:3001/api/families/${familyId}/children`);
        if (!response.ok) throw new Error('Famille non trouvée');
        return await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement des enfants:', error);
        return [];
      }
    },
    enabled: !!familyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleChildSelect = child => {
    setSelectedChild(child);
    setPin('');
    setError('');
  };

  const handleFamilySubmit = e => {
    e.preventDefault();
    if (familyId.trim()) {
      setShowFamilyInput(false);
    }
  };

  const handlePinSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Utiliser l'API réelle pour la connexion enfant
      const { user, token } = await authApi.loginChild({
        childId: selectedChild.id,
        pin: pin,
      });
      
      login(user, token);
      navigate('/child');
    } catch (err) {
      setError('Code PIN incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (digit) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  // Interface de saisie de l'ID famille
  if (showFamilyInput) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Entrer l'ID de la famille
        </h3>
        <form onSubmit={handleFamilySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Famille
            </label>
            <input
              type="text"
              value={familyId}
              onChange={e => setFamilyId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: abc123-def456-ghi789"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Demandez à papa/maman l'ID de votre famille
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Continuer
          </button>
        </form>
      </div>
    );
  }

  // Interface de sélection d'enfant
  if (!selectedChild) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Qui es-tu ?
          </h3>
          <button
            onClick={() => setShowFamilyInput(true)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Changer famille
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Chargement des enfants...</div>
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">Aucun enfant trouvé dans cette famille</div>
            <button
              onClick={() => setShowFamilyInput(true)}
              className="text-primary-600 hover:underline"
            >
              Vérifier l'ID famille
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => handleChildSelect(child)}
                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="text-3xl">{child.avatar || '👦'}</div>
                <div className="text-left">
                  <div className="font-semibold text-lg">{child.name}</div>
                  <div className="text-gray-500">{child.age} ans</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{selectedChild.avatar}</div>
        <h3 className="text-lg font-semibold text-gray-900">
          Salut {selectedChild.name} !
        </h3>
        <p className="text-gray-500">Entre ton code secret</p>
      </div>

      <form onSubmit={handlePinSubmit} className="space-y-6">
        {/* Affichage du PIN */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3].map(index => (
            <div
              key={index}
              className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center text-xl font-bold"
            >
              {pin[index] || ''}
            </div>
          ))}
        </div>

        {/* Clavier numérique */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit.toString())}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-xl text-xl font-bold transition-colors"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleBackspace}
            className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-xl text-xl font-bold transition-colors"
          >
            ⌫
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-xl text-xl font-bold transition-colors"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => setSelectedChild(null)}
            className="w-16 h-16 bg-red-100 hover:bg-red-200 rounded-xl text-xl font-bold transition-colors"
          >
            ←
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {pin.length === 4 && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Entrer dans mon espace'}
          </button>
        )}
      </form>
    </div>
  );
}
