import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

export default function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { t } = useTranslation();
  const role = location.state?.role || 'parent';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData.email);
      
      const response = await authService.loginWithCredentials(
        formData.email,
        formData.password
      );

      console.log('Login response:', response);

      if (response.success && response.data) {
        const { token, user, group } = response.data;
        
        // Vérifier que le rôle correspond
        if (user.role !== role) {
          setError(t('auth.error.wrongRole', { role: t(`welcome.${role}`) }));
          setLoading(false);
          return;
        }

        // Stocker les données d'authentification
        login(token, user, group);
        
        // Rediriger vers le dashboard approprié
        navigate('/parent/home');
      } else {
        setError(t('auth.error.invalidCredentials'));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || t('auth.error.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 md:p-6">
      <div className="max-w-md w-full">
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 md:mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm md:text-base">{t('common.back')}</span>
        </button>

        {/* Carte de connexion */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-600 mb-2">
              {role === 'parent' ? '👨‍👩‍👧' : '👩‍🏫'} {t(`welcome.${role}`)}
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {t('auth.loginDesc')}
            </p>
          </div>

          {error && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 md:mr-3 flex-shrink-0" />
              <p className="text-red-700 text-xs md:text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Email */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2.5 md:py-3 rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {loading ? t('auth.connecting') : t('auth.login')}
            </button>
          </form>

          {/* Lien d'inscription */}
          <div className="mt-4 md:mt-6 text-center">
            <p className="text-xs md:text-sm text-gray-600">
              {t('auth.noAccount')}{' '}
              <Link
                to="/auth/register"
                state={{ role }}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                {t('auth.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

