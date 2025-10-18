import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, QrCode } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';
import { apiClient } from '../lib/api-client';
import { seedToAvatarUrl } from '../utils/avatarUtils';
import QRScanner from '../components/child/QRScanner';

export default function ChildLoginScreen() {
  const { t } = useTranslation();
  const [selectedChild, setSelectedChild] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [groupCode, setGroupCode] = useState('');
  const [showGroupInput, setShowGroupInput] = useState(true);
  const [savedGroups, setSavedGroups] = useState([]);
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [searchParams] = useSearchParams();

  // Sauvegarder un groupe et ses enfants
  const saveGroup = useCallback((groupData, childrenList) => {
    const groupInfo = {
      groupId: groupData.id,
      groupCode: groupData.code,
      groupName: groupData.name,
      groupType: groupData.type,
      children: childrenList.map(child => ({
        id: child.id,
        name: child.name,
        age: child.age,
        avatar: child.avatar
      })),
      lastUsed: new Date().toISOString()
    };

    setSavedGroups(prevGroups => {
      const existingGroups = prevGroups.filter(g => g.groupId !== groupData.id);
      const updatedGroups = [...existingGroups, groupInfo];
      localStorage.setItem('routineStars-groups', JSON.stringify(updatedGroups));
      return updatedGroups;
    });
  }, []);

  // Gérer le scan QR
  const handleQRScanSuccess = (qrData) => {
    try {
      console.log('QR Code scanné:', qrData);
      
      // Essayer de parser comme URL d'abord
      try {
        const url = new URL(qrData);
        const code = url.searchParams.get('code');
        
        if (code) {
          console.log('Code extrait de l\'URL:', code);
          setGroupCode(code);
          setShowQRScanner(false);
          fetchGroupChildren(code);
          return;
        }
      } catch (urlError) {
        console.log('Pas une URL valide, essai direct du code');
      }
      
      // Si ce n'est pas une URL, essayer directement comme code de groupe
      if (qrData && qrData.length > 0) {
        console.log('Utilisation directe du code:', qrData);
        setGroupCode(qrData);
        setShowQRScanner(false);
        fetchGroupChildren(qrData);
      } else {
        setError('Code de groupe invalide dans le QR code');
      }
    } catch (err) {
      console.error('Erreur lors du traitement du QR code:', err);
      setError('Format de QR code invalide');
    }
  };

  // Charger les groupes sauvegardés au montage
  useEffect(() => {
    const saved = localStorage.getItem('routineStars-groups');
    if (saved) {
      try {
        const groups = JSON.parse(saved);
        setSavedGroups(groups);
        
        // Si un seul groupe, le sélectionner automatiquement
        if (groups.length === 1) {
          setGroupCode(groups[0].groupCode);
          setChildren(groups[0].children);
          setShowGroupInput(false);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des groupes:', error);
      }
    }
  }, []);

  // Gérer le paramètre code depuis l'URL
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setGroupCode(codeFromUrl);
      fetchGroupChildren(codeFromUrl);
    }
  }, [searchParams]);

  // Récupérer les enfants d'un groupe
  const fetchGroupChildren = async (code) => {
    setLoadingChildren(true);
    setError('');
    
    try {
      // Récupérer les informations du groupe par son code
      const group = await authService.getGroupByCode(code);
      
      if (!group) {
        setError(t('child.invalidCode'));
        return;
      }

      // Récupérer les enfants du groupe
      const response = await apiClient.get(`/groups/${group.id}/children`);
      
      if (response && response.length > 0) {
        setChildren(response);
        saveGroup(group, response);
        setShowGroupInput(false);
      } else {
        setError(t('children.none') || '');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des enfants:', err);
      setError(t('child.invalidCode'));
    } finally {
      setLoadingChildren(false);
    }
  };

  const handleChildSelect = child => {
    setSelectedChild(child);
    setPin('');
    setError('');
  };

  const handleGroupSubmit = e => {
    e.preventDefault();
    if (groupCode.trim()) {
      fetchGroupChildren(groupCode.trim());
    }
  };

  const handlePinSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.loginWithPin(selectedChild.id, pin);
      
      if (response.success && response.data) {
        const { token, user, group } = response.data;
        login(token, user, group);
        navigate('/child'); // Redirige vers /child qui affiche "Ma journée" (ChildDashboard)
      } else {
        setError(t('child.invalidPin'));
        // Réinitialisation rapide du PIN en cas d'erreur
        setTimeout(() => {
          setPin('');
        }, 1000);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t('child.invalidPin'));
      // Réinitialisation rapide du PIN en cas d'erreur
      setTimeout(() => {
        setPin('');
      }, 1000);
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

  // Gestion du clavier physique
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorer si on est dans un input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Chiffres 0-9
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleKeyPress(e.key);
      }
      // Backspace
      else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      }
      // Enter pour soumettre si PIN complet
      else if (e.key === 'Enter' && pin.length === 4) {
        e.preventDefault();
        handlePinSubmit(e);
      }
    };

    // Ajouter l'écouteur seulement sur l'écran PIN
    if (selectedChild) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pin, selectedChild]);

  // Interface de sélection de groupe
  if (showGroupInput) {
    return (
      <>
        <div className="min-h-screen bg-gradient-mootify flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            {/* Bouton retour */}
            <button
              onClick={() => navigate('/')}
              className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('common.back')}
            </button>

            <div className="bg-white dark:bg-anthracite-light rounded-2xl p-8 shadow-lg ring-1 ring-black/5 dark:ring-white/5">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-display font-bold text-anthracite dark:text-cream mb-2">
                  👦 {t('welcome.child')}
                </h1>
                <p className="text-gray-600">
                  {savedGroups.length > 0 ? t('child.selectChild') : t('child.groupCodePlaceholder')}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm text-center">{error}</p>
                </div>
              )}

              {savedGroups.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 mb-4 text-center">
                    {t('child.recentGroups')} ({savedGroups.length})
                  </div>
                  {savedGroups.map(group => (
                    <button
                      key={group.groupId}
                      onClick={() => {
                        setGroupCode(group.groupCode);
                        setChildren(group.children);
                        setShowGroupInput(false);
                      }}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl hover-border-brand hover-bg-brand-light transition-colors text-left"
                    >
                      <div className="font-semibold text-lg">
                        {group.groupName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {group.groupType === 'family' ? '🏠 ' + t('dashboard.family') : '🎓 ' + t('dashboard.classroom')} • {group.children.length} {group.groupType === 'family' ? t('dashboard.members.children') : t('dashboard.members.students')}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Code: {group.groupCode}
                      </div>
                    </button>
                  ))}
                  
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        setGroupCode('');
                        setChildren([]);
                        setSavedGroups([]);
                        localStorage.removeItem('routineStars-groups');
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      {t('child.newGroup')}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleGroupSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-anthracite dark:text-cream mb-2">
                      {t('child.groupCode')}
                    </label>
                    <input
                      type="text"
                      value={groupCode}
                      onChange={e => setGroupCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 ring-brand focus:border-transparent text-center font-mono text-lg bg-white dark:bg-anthracite-dark dark:text-cream"
                      placeholder="PANDA ROUX 305"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {savedGroups.length > 0 ? t('assignments.addChild') : t('child.groupCodePlaceholder')}
                    </p>
                  </div>

                  {/* Option QR Code (pour une future implémentation) */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">{t('common.or')}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQRScanner(true)}
                    className="w-full border-2 border-dashed border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover-border-brand hover-text-brand transition-colors flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-5 h-5" />
                    Scanner un QR Code
                  </button>

                  <button
                    type="submit"
                    disabled={loadingChildren}
                    className="w-full btn btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingChildren ? t('common.loading') : t('common.next')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* QR Scanner Modal */}
        <QRScanner
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          onScanSuccess={handleQRScanSuccess}
        />
      </>
    );
  }

  // Interface de sélection d'enfant
  if (!selectedChild) {
    return (
      <div className="min-h-screen bg-gradient-mootify flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button
            onClick={() => {
              setShowGroupInput(true);
              setChildren([]);
              setGroupCode('');
            }}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('common.back')}
          </button>

          <div className="bg-white dark:bg-anthracite-light rounded-2xl p-8 shadow-lg ring-1 ring-black/5 dark:ring-white/5">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-display font-bold text-anthracite dark:text-cream mb-2">
                {t('welcome.child')}
              </h2>
              <p className="text-gray-600">
                {t('child.selectChild')}
              </p>
            </div>

            {children.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">{t('children.none') || ''}</div>
                <button
                  onClick={() => setShowGroupInput(true)}
                  className="text-primary-600 hover:underline"
                >
                  {t('child.groupCode')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {children.map(child => (
                  <button
                    key={child.id}
                    onClick={() => handleChildSelect(child)}
                    className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover-border-brand hover-bg-brand-light transition-all transform hover:scale-105"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                      {child.avatar ? (
                        <img
                          src={seedToAvatarUrl(child.avatar) || child.avatar}
                          alt={`Avatar de ${child.name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl">
                          👦
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">{child.name}</div>
                      <div className="text-gray-500">{child.age} </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Interface de saisie du PIN
  return (
    <div className="min-h-screen bg-gradient-mootify flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <button
          onClick={() => setSelectedChild(null)}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('common.back')}
        </button>

        <div className="bg-white dark:bg-anthracite-light rounded-2xl p-6 shadow-lg ring-1 ring-black/5 dark:ring-white/5">
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-brand mx-auto mb-3">
              {selectedChild.avatar ? (
                <img
                  src={seedToAvatarUrl(selectedChild.avatar) || selectedChild.avatar}
                  alt={`Avatar de ${selectedChild.name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl">
                  👦
                </div>
              )}
            </div>
            <h2 className="text-xl font-display font-bold text-anthracite dark:text-cream mb-1">
              {t('common.welcome')}, {selectedChild.name} ! 👋
            </h2>
            <p className="text-sm text-gray-600">{t('child.pin')}</p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            {/* Affichage du PIN */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3].map(index => (
                <div
                  key={index}
                  className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold transition-colors ${
                    pin[index] 
                      ? 'border-brand bg-brand text-white' 
                      : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800'
                  }`}
                >
                  {pin[index] ? '●' : ''}
                </div>
              ))}
            </div>

            {/* Clavier numérique - Disposition universelle (1 en haut à gauche) */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto" dir="ltr">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeyPress(digit.toString())}
                  className="w-full aspect-square bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500 rounded-lg text-lg font-bold transition-colors"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleBackspace}
                className="w-full aspect-square bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500 rounded-lg text-lg font-bold transition-colors"
              >
                ⌫
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="w-full aspect-square bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500 rounded-lg text-lg font-bold transition-colors"
              >
                0
              </button>
              <div className="w-full aspect-square"></div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center font-medium">
                {error}
              </div>
            )}

            {pin.length === 4 && (
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('auth.connecting') : t('child.loginButton')}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}