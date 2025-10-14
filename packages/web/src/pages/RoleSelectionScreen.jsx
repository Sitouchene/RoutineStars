import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Users, Mail, Lock, Hash, QrCode } from 'lucide-react';
import { useNavigationStore } from '../stores/navigationStore';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇩🇿' }
];

const ROLES = {
  family: [
    { 
      type: 'parent', 
      name: 'Parent', 
      icon: '👨‍👩‍👧‍👦', 
      description: 'Gérer les tâches familiales',
      authType: 'full'
    },
    { 
      type: 'child', 
      name: 'Enfant', 
      icon: '👦', 
      description: 'Accéder à mes tâches',
      authType: 'simple'
    }
  ],
  classroom: [
    { 
      type: 'teacher', 
      name: 'Enseignant', 
      icon: '👩‍🏫', 
      description: 'Gérer les tâches de classe',
      authType: 'full'
    },
    { 
      type: 'student', 
      name: 'Élève', 
      icon: '👩‍🎓', 
      description: 'Accéder à mes tâches',
      authType: 'simple'
    }
  ]
};

export default function RoleSelectionScreen() {
  const navigate = useNavigate();
  const { selectedLanguage, selectedMode, setRole, resetNavigation } = useNavigationStore();
  const { login } = useAuthStore();
  
  const [selectedRole, setSelectedRole] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' ou 'register'
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    pin: '',
    groupCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Rediriger si pas de données
  useEffect(() => {
    if (!selectedLanguage || !selectedMode) {
      navigate('/');
    }
  }, [selectedLanguage, selectedMode, navigate]);

  const availableRoles = ROLES[selectedMode?.type] || [];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setRole(role);
    setError('');
    setAuthMode('login'); // Reset to login mode
  };

  const handleAuthDataChange = (field, value) => {
    setAuthData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleFullAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login with:', { email: authData.email });
      const result = await authService.loginWithCredentials(
        authData.email, 
        authData.password
      );
      
      console.log('📥 Login result:', result);
      
      if (result.success) {
        // Connexion réussie
        console.log('✅ Login successful, navigating to dashboard');
        login(result.data.token, result.data.user, result.data.group);
        
        // Navigation vers le dashboard approprié
        const mode = selectedMode.type;
        navigate(`/${mode}/dashboard`);
      } else {
        console.log('❌ Login failed:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('💥 Login error:', err);
      setError('Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation de la confirmation de mot de passe
    if (authData.password !== authData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    // Validation de la force du mot de passe
    if (authData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      setIsLoading(false);
      return;
    }

    try {
      let groupId = null;
      
      // Si un code de groupe est fourni, vérifier qu'il existe
      if (authData.groupCode) {
        const groupResult = await authService.getGroupByCode(authData.groupCode);
        if (groupResult.success) {
          groupId = groupResult.data.id;
        } else {
          setError('Code de groupe invalide.');
          setIsLoading(false);
          return;
        }
      }

      // Créer le compte utilisateur selon le rôle
      const result = selectedRole.type === 'teacher' 
        ? await authService.registerTeacher(
            authData.email,
            authData.password,
            authData.name,
            groupId
          )
        : await authService.registerParent(
            authData.email,
            authData.password,
            authData.name,
            groupId
          );
      
      if (result.success) {
        // Inscription réussie, se connecter automatiquement
        login(result.data.token, result.data.user, result.data.group);
        
        // Navigation vers le dashboard approprié
        const mode = selectedMode.type;
        navigate(`/${mode}/dashboard`);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur lors de l\'inscription. Vérifiez vos informations.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimpleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.loginWithPin(
        authData.pin, 
        authData.groupCode
      );
      
      if (result.success) {
        // Connexion réussie
        login(result.data.token, result.data.user, result.data.group);
        
        // Navigation vers le dashboard enfant/élève
        const mode = selectedMode.type;
        navigate(`/${mode}/child-dashboard`);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Code PIN ou code de groupe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    resetNavigation();
    navigate('/');
  };

  if (!selectedLanguage || !selectedMode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={goBack}
            className="mb-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="text-4xl mb-4">
            {selectedMode.type === 'family' ? '🏠' : '🎓'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedMode.name}
          </h1>
          <p className="text-lg text-gray-600">
            Choisis ton rôle :
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            {availableRoles.map((role) => (
              <button
                key={role.type}
                onClick={() => handleRoleSelect(role)}
                className={`
                  p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105
                  ${selectedRole?.type === role.type
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25'
                  }
                `}
              >
                <div className="text-4xl mb-3">{role.icon}</div>
                <div className="text-xl font-semibold text-gray-800 mb-1">
                  {role.name}
                </div>
                <div className="text-sm text-gray-600">
                  {role.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Authentication Form */}
        {selectedRole && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Authentification {selectedRole.name}
            </h2>

            {/* Toggle Login/Register */}
            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                  authMode === 'login'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Se connecter
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                  authMode === 'register'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                S'inscrire
              </button>
            </div>

            {selectedRole.authType === 'full' ? (
              /* Authentification complète (Parent/Enseignant) */
              <form onSubmit={authMode === 'login' ? handleFullAuth : handleFullRegister} className="space-y-6">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={authData.name}
                      onChange={(e) => handleAuthDataChange('name', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre nom complet"
                      required={authMode === 'register'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={authData.email}
                    onChange={(e) => handleAuthDataChange('email', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={authData.password}
                    onChange={(e) => handleAuthDataChange('password', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <div className="mt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            authData.password.length === 0 ? 'w-0' :
                            authData.password.length < 4 ? 'w-1/3 bg-red-400' :
                            authData.password.length < 6 ? 'w-2/3 bg-yellow-400' :
                            'w-full bg-green-400'
                          }`}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {authData.password.length === 0 ? '0/6' : `${authData.password.length}/6`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {authData.password.length < 6 ? 'Minimum 6 caractères' : 'Mot de passe sécurisé ✓'}
                    </p>
                  </div>
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      value={authData.confirmPassword}
                      onChange={(e) => handleAuthDataChange('confirmPassword', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                      required={authMode === 'register'}
                    />
                    {authData.password && authData.confirmPassword && authData.password !== authData.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        Les mots de passe ne correspondent pas
                      </p>
                    )}
                  </div>
                )}

                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <QrCode className="w-4 h-4 inline mr-2" />
                      Code de {selectedMode.type === 'family' ? 'famille' : 'classe'} (optionnel)
                    </label>
                    <input
                      type="text"
                      value={authData.groupCode}
                      onChange={(e) => handleAuthDataChange('groupCode', e.target.value.toUpperCase())}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                      placeholder="PANDA_ROUX_305"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Laissez vide pour créer un nouveau {selectedMode.type === 'family' ? 'groupe familial' : 'groupe de classe'}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || (authMode === 'register' && (authData.password !== authData.confirmPassword || authData.password.length < 6))}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading 
                    ? (authMode === 'login' ? 'Connexion...' : 'Inscription...') 
                    : (authMode === 'login' ? 'Se connecter' : 'S\'inscrire')
                  }
                </button>

                {authMode === 'register' && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">📋 Informations de sécurité</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Votre mot de passe est chiffré et sécurisé</li>
                      <li>• Un groupe sera créé automatiquement si aucun code n'est fourni</li>
                      <li>• Vous pourrez inviter d'autres membres avec le code de groupe</li>
                    </ul>
                  </div>
                )}
              </form>
            ) : (
              /* Authentification simplifiée (Enfant/Élève) */
              <form onSubmit={handleSimpleAuth} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4 inline mr-2" />
                    Code PIN
                  </label>
                  <input
                    type="password"
                    value={authData.pin}
                    onChange={(e) => handleAuthDataChange('pin', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                    placeholder="••••"
                    maxLength="4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <QrCode className="w-4 h-4 inline mr-2" />
                    Code de {selectedMode.type === 'family' ? 'famille' : 'classe'}
                  </label>
                  <input
                    type="text"
                    value={authData.groupCode}
                    onChange={(e) => handleAuthDataChange('groupCode', e.target.value.toUpperCase())}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                    placeholder="PANDA_ROUX_305"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Connexion...' : 'Accéder à mes tâches'}
                </button>
              </form>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            Langue sélectionnée : {LANGUAGES.find(l => l.code === selectedLanguage)?.flag} {LANGUAGES.find(l => l.code === selectedLanguage)?.name}
          </p>
        </div>
      </div>
    </div>
  );
}
