import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, AlertCircle, CheckCircle, Globe, Flag, GraduationCap } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const role = location.state?.role || 'parent';
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'fr',
    country: 'CA',
    grade: '' // Pour les enseignants
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError(t('auth.error.nameRequired') || '');
      return false;
    }
    if (!formData.email.trim()) {
      setError(t('auth.error.emailRequired') || '');
      return false;
    }
    if (formData.password.length < 6) {
      setError(t('auth.error.passwordTooShort') || '');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting registration:', { 
        name: formData.name, 
        email: formData.email,
        role,
        language: formData.language,
        country: formData.country,
        grade: formData.grade
      });
      
      // Appeler l'API d'inscription appropriée selon le rôle
      const registerFn = role === 'parent' 
        ? authService.registerParent 
        : authService.registerTeacher;

      const response = await registerFn(
        formData.email,
        formData.password,
        formData.name,
        null, // groupId null pour créer un nouveau groupe
        formData.language,
        formData.country,
        formData.grade || undefined
      );

      console.log('Registration response:', response);

      if (response.success && response.data) {
        const { token, user, group } = response.data;
        
        // Stocker les données d'authentification
        login(token, user, group);
        
        // Rediriger vers le dashboard approprié
        navigate('/parent/home');
      } else {
        setError(t('common.error'));
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  // Vérifier la force du mot de passe
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { level: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: 1, text: t('auth.passwordStrength.weak'), color: 'bg-red-500' };
    if (strength <= 3) return { level: 2, text: t('auth.passwordStrength.medium'), color: 'bg-yellow-500' };
    return { level: 3, text: t('auth.passwordStrength.strong'), color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/auth/login', { state: { role } })}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('common.back')}
        </button>

        {/* Carte d'inscription */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">
              {role === 'parent' ? '👨‍👩‍👧' : '👩‍🏫'} {t(`welcome.${role}`)}
            </h1>
            <p className="text-gray-600">
              {t('auth.registerDesc')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.name')} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('auth.name')}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Langue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.language')} *
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="ar">🇩🇿 العربية</option>
                </select>
              </div>
            </div>

            {/* Pays */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.country')} *
              </label>
              <div className="relative">
                <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="CA">🇨🇦 Canada</option>
                  <option value="DZ">🇩🇿 Algérie</option>
                  <option value="FR">🇫🇷 France</option>
                  <option value="BE">🇧🇪 Belgique</option>
                  <option value="CH">🇨🇭 Suisse</option>
                </select>
              </div>
            </div>

            {/* Niveau/Grade (pour enseignants uniquement) */}
            {role === 'teacher' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.gradeOptional')}
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('auth.grade')}
                  />
                </div>
              </div>
            )}

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>
              {/* Indicateur de force du mot de passe */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{t('auth.passwordStrength')}:</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.level === 1 ? 'text-red-600' :
                      passwordStrength.level === 2 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.level / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.confirmPassword')} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  autoComplete="new-password"
                />
                {formData.confirmPassword && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {passwordsMatch ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Information sur le groupe */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>ℹ️ Info:</strong> {role === 'parent' ? t('dashboard.family') : t('dashboard.classroom')}
              </p>
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={loading || !passwordsMatch}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('auth.registering') : t('auth.registerButton')}
            </button>
          </form>

          {/* Lien de connexion */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('auth.hasAccount')}{' '}
              <Link
                to="/auth/login"
                state={{ role }}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

