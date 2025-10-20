import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle, Circle, Star, Send, BarChart3, Edit3, Palette } from 'lucide-react';
import { TASK_ICONS, TASK_CATEGORIES } from 'shared/constants';
import { tasksApi, submissionsApi, messagesApi, evalWindowApi, childrenApi } from '../../lib/api-client';
import TaskCard from '../../components/child/TaskCard';
import AvatarSelector from '../../components/child/AvatarSelector';
import RealtimeStatus from '../../components/RealtimeStatus';
import ThemeSelector from '../../components/ThemeSelector';
import ChildHeader from '../../components/child/ChildHeader';
import { seedToAvatarUrl } from '../../utils/avatarUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../components/ui/Toast';
import { useTasksRealtime, useSubmissionsRealtime } from '../../hooks/useRealtime';

export default function ChildDashboard() {
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);
  const { success, error: showError, ToastContainer } = useToast();
  const logout = useAuthStore(state => state.logout);
  const getAuthHeader = useAuthStore(state => state.getAuthHeader);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // État local pour forcer la désactivation après soumission
  const [isLocallySubmitted, setIsLocallySubmitted] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const todayKey = new Date().toISOString().split('T')[0];

  // Hooks realtime pour la synchronisation en temps réel
  const { isConnected: tasksRealtimeConnected } = useTasksRealtime(user?.id, todayKey);
  const { isConnected: submissionsRealtimeConnected } = useSubmissionsRealtime(user?.id);

  // Récupérer les soumissions de l'enfant
  const { data: submissions = [] } = useQuery({
    queryKey: ['childSubmissions', user?.id],
    queryFn: () => submissionsApi.getChildSubmissions(getAuthHeader()),
    enabled: !!user?.id,
  });

  // Vérifier si la journée d'aujourd'hui a été soumise
  const todaySubmission = submissions.find(submission => 
    new Date(submission.date).toDateString() === new Date().toDateString()
  );
  const isDaySubmitted = !!todaySubmission || isLocallySubmitted;

  // Récupérer les tâches du jour depuis l'API
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['childTasks', user?.id, todayKey],
    queryFn: () => tasksApi.getChildTasks(user.id, todayKey, getAuthHeader()),
    enabled: !!user?.id,
  });

  // Message du jour
  const { data: dailyMessage } = useQuery({
    queryKey: ['dailyMessage', user?.groupId, user?.id, todayKey],
    queryFn: () => messagesApi.getByDate(getAuthHeader(), { childId: user.id, date: todayKey }),
    enabled: !!user?.id && !!user?.groupId,
  });

  // Fenêtre horaire
  const { data: evalWindow } = useQuery({
    queryKey: ['evalWindow', user?.groupId, user?.id],
    queryFn: () => evalWindowApi.get(getAuthHeader(), { childId: user.id }),
    enabled: !!user?.id && !!user?.groupId,
  });

  // Mutation pour l'autoévaluation
  const selfEvaluateMutation = useMutation({
    mutationFn: ({ taskId, score }) => tasksApi.selfEvaluate(taskId, score, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childTasks'] });
    },
  });

  // Mutation pour soumettre la journée
  const submitDayMutation = useMutation({
    mutationFn: (date) => submissionsApi.submitDay(date, getAuthHeader()),
    onSuccess: () => {
      // Marquer comme soumis localement immédiatement
      setIsLocallySubmitted(true);
      
      // Invalider toutes les requêtes liées
      queryClient.invalidateQueries({ queryKey: ['childTasks'] });
      queryClient.invalidateQueries({ queryKey: ['childSubmissions'] });
      
      // Mise à jour optimiste des soumissions
      queryClient.setQueryData(['childSubmissions', user?.id], (oldData) => {
        const newSubmission = {
          id: `temp-${Date.now()}`,
          childId: user.id,
          date: new Date().toISOString().split('T')[0],
          submittedAt: new Date().toISOString(),
          validatedAt: null,
          parentComment: null,
          child: {
            id: user.id,
            name: user.name,
            age: user.age
          }
        };
        return [newSubmission, ...(oldData || [])];
      });
      
      // Mise à jour optimiste des tâches (changer le statut à 'submitted' et ajouter lockedAt)
      queryClient.setQueryData(['childTasks', user?.id, new Date().toISOString().split('T')[0]], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(task => ({
          ...task,
          status: 'submitted',
          lockedAt: new Date().toISOString()
        }));
      });
      
      success(t('child.daySubmitted'));
    },
    onError: (error) => {
      showError(`${t('common.error')}: ${error.message}`);
    },
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSelfEvaluate = async (taskId, score) => {
    try {
      await selfEvaluateMutation.mutateAsync({ taskId, score });
    } catch (error) {
      console.error('Erreur lors de l\'autoévaluation:', error);
    }
  };

  const handleSubmitDay = async () => {
    try {
      await submitDayMutation.mutateAsync(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const getCategoryIcon = category => {
    // Gérer les objets Category ou les chaînes
    const categoryKey = typeof category === 'object' ? category?.title : category;
    return TASK_ICONS[categoryKey] || category?.icon || '📋';
  };

  const getScoreColor = score => {
    if (score >= 76) return 'text-green-600 bg-green-100';
    if (score >= 51) return 'text-yellow-600 bg-yellow-100';
    if (score >= 26) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const completedTasks = tasks.filter(task => task.status === 'validated').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Vérifier si toutes les tâches sont autoévaluées
  const allTasksEvaluated = tasks.length > 0 && tasks.every(task => task.selfScore !== null && task.selfScore !== undefined);
  // Vérifier si des tâches sont soumises (statut 'submitted')
  const hasSubmittedTasks = tasks.some(task => task.status === 'submitted');
  // Calcul de la fenêtre horaire côté front (désactivation UI only)
  const isWithinWindow = (() => {
    if (!evalWindow) return true;
    try {
      const tz = evalWindow.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short' });
      const parts = fmt.formatToParts(new Date());
      const hh = parts.find(p => p.type === 'hour').value;
      const mm = parts.find(p => p.type === 'minute').value;
      const dayShort = parts.find(p => p.type === 'weekday').value.toLowerCase();
      const map = { sun:0, mon:1, tue:2, wed:3, thu:4, fri:5, sat:6 };
      const dayIdx = map[dayShort.slice(0,3)] ?? 0;
      const [sh, sm] = (evalWindow.startTime || '00:00').split(':').map(Number);
      const [eh, em] = (evalWindow.endTime || '23:59').split(':').map(Number);
      const nowMin = Number(hh) * 60 + Number(mm);
      const startMin = sh * 60 + sm;
      const endMin = eh * 60 + em;
      const days = (evalWindow.daysMask || '1,1,1,1,1,1,1').split(',').map(x => x.trim() === '1');
      if (!days[dayIdx]) return false;
      return nowMin >= startMin && nowMin <= endMin;
    } catch { return true; }
  })();

  const canSubmit = allTasksEvaluated && !submitDayMutation.isPending && !isDaySubmitted && !hasSubmittedTasks && isWithinWindow;

  // Mutation pour mettre à jour l'avatar
  const updateAvatarMutation = useMutation({
    mutationFn: (avatar) => childrenApi.updateAvatar(user.id, avatar, getAuthHeader()),
    onSuccess: (updatedUser) => {
      // Mettre à jour uniquement l'utilisateur sans altérer le token ni le group
      const current = useAuthStore.getState();
      useAuthStore.setState({
        user: updatedUser,
        token: current.token,
        isAuthenticated: true,
        group: current.group,
      });
      queryClient.invalidateQueries({ queryKey: ['childSubmissions', user?.id] });
    },
  });

  const handleAvatarChange = (newAvatar) => {
    updateAvatarMutation.mutate(newAvatar);
  };

  return (
    <div className="min-h-screen bg-gradient-mootify p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ChildHeader 
          title="Ma journée" 
          subtitle={dailyMessage?.message || "Mes tâches du jour"}
          onOpenTheme={() => setShowThemeSelector(true)}
        />

        {/* Score du jour */}
        <div className="bg-white dark:bg-anthracite-light rounded-2xl p-8 text-center mb-6 shadow-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">{t('child.todayScore')}</p>
          <p className="text-6xl font-display font-bold text-brand">{completionRate}%</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            {completionRate >= 80 ? '🌟 ' + t('child.excellent') : 
             completionRate >= 60 ? '👍 ' + t('child.wellDone') : 
             '💪 ' + t('child.keepGoing')}
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {t('child.tasksCompleted', { completed: completedTasks, total: totalTasks })}
          </div>
        </div>

        {/* Statut de soumission */}
        {tasks.length > 0 && (
          <div className="bg-white dark:bg-anthracite-light rounded-2xl p-6 mb-6 shadow-lg">
            {isDaySubmitted ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('child.daySubmitted')}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('child.submittedOn', { date: new Date(todaySubmission.submittedAt).toLocaleString('fr-FR') })}
                </p>
                {todaySubmission.validatedAt ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-800 mb-2">{t('child.validatedByParent')}</p>
                    {todaySubmission.parentComment && (
                      <p className="text-sm text-green-700 italic">"{todaySubmission.parentComment}"</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-yellow-800">{t('child.waitingValidation')}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('child.submitDay')}</h3>
                  <p className="text-sm text-gray-600">
                    {allTasksEvaluated 
                      ? t('child.submitDayDesc')
                      : t('child.tasksRemaining', { count: tasks.filter(task => task.selfScore === null || task.selfScore === undefined).length })
                    }
                  </p>
                </div>
                <button
                  onClick={handleSubmitDay}
                  disabled={!canSubmit}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                    canSubmit
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  {isDaySubmitted 
                    ? t('child.dayAlreadySubmitted')
                    : submitDayMutation.isPending 
                      ? t('child.submitting')
                      : t('child.submitDay')
                  }
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tâches du jour */}
        <div className="bg-white dark:bg-anthracite-light rounded-2xl p-6 shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-xl font-display font-bold text-anthracite dark:text-cream">{t('child.myTasks')}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Circle className="w-4 h-4" />
              {t('child.tasksCount', { count: tasks.length })}
            </div>
          </motion.div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">{t('child.loadingTasks')}</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{t('child.errorLoadingTasks')}</div>
              <button
                onClick={() => queryClient.invalidateQueries({ queryKey: ['childTasks'] })}
                className="btn btn-primary"
              >
                {t('child.retry')}
              </button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">{t('child.noTasksToday')}</div>
              <p className="text-sm text-gray-400">
                {t('child.noTasksDesc')}
              </p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-3 md:grid-cols-4 gap-4"
              layout
            >
              <AnimatePresence>
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TaskCard
                      task={{
                        ...task,
                        title: task.taskTemplate?.title || task.title,
                        category: task.taskTemplate?.category || task.category,
                        points: task.taskTemplate?.points || task.points,
                        description: task.taskTemplate?.description || task.description,
                        recurrence: task.taskTemplate?.recurrence || task.recurrence,
                      }}
                      onSelfEvaluate={handleSelfEvaluate}
                      getCategoryIcon={getCategoryIcon}
                      getScoreColor={getScoreColor}
                      isDaySubmitted={isDaySubmitted}
                      isWithinEvaluationWindow={isWithinWindow}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sélecteur d'avatar */}
      {showAvatarSelector && (
        <AvatarSelector
          currentAvatar={user?.avatar}
          onAvatarChange={handleAvatarChange}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}

      {/* Modal de personnalisation - Sélecteur de thème */}
      <AnimatePresence>
        {showThemeSelector && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowThemeSelector(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-mint-100 rounded-full flex items-center justify-center">
                      <Palette className="w-6 h-6 text-mint-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-anthracite">
                        {t('settings.appearance', 'Apparence')}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {t('settings.chooseTheme', 'Choisis ton thème préféré !')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowThemeSelector(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <ThemeSelector />

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowThemeSelector(false)}
                    className="btn btn-primary px-6"
                  >
                    {t('common.close', 'Fermer')}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}


