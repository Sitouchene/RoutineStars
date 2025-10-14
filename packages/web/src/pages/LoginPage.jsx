import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../lib/api-client';
import ChildLoginInterface from '../components/ChildLoginInterface';

export default function LoginPage() {
  const [mode, setMode] = useState('parent'); // 'parent' ou 'child'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleParentLogin = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.loginParent({ email, password });
      login(data.token, data.user);
      navigate('/parent');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">⭐ RoutineStars</h1>
          <p className="text-gray-600 mt-2">Connexion à votre compte</p>
        </div>

        {/* Toggle Mode */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('parent')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              mode === 'parent'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            👨‍👩‍👧 Parent
          </button>
          <button
            onClick={() => setMode('child')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              mode === 'child'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            👶 Enfant
          </button>
        </div>

        {/* Bouton d'inscription pour les parents */}
        {mode === 'parent' && (
          <div className="mb-4">
            <Link
              to="/register"
              className="block w-full text-center py-2 px-4 border-2 border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              ✨ Créer un nouveau compte parent
            </Link>
          </div>
        )}

        {/* Formulaire Parent */}
        {mode === 'parent' && (
          <form onSubmit={handleParentLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary-600 hover:underline">
                S'inscrire
              </Link>
            </p>
          </form>
        )}

        {/* Interface Enfant */}
        {mode === 'child' && (
          <ChildLoginInterface />
        )}
      </div>
    </div>
  );
}


