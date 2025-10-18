import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { Award, Star, BookOpen, Bell, Trophy, Target, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import ChildHeader from '../../components/child/ChildHeader';
import AnimatedCounter from '../../components/animations/AnimatedCounter';
import MotivoMascot from '../../components/branding/MotivoMascot';
import { messagesApi, readingApi, childrenApi } from '../../lib/api-client';

export default function HomePage() {
  const { t } = useTranslation();
  const { user, getAuthHeader } = useAuthStore();
  const [notifications] = useState([
    { id: 1, message: "Bravo ! Tu as terminé tes devoirs", time: "2h", type: "success" },
    { id: 2, message: "Nouveau livre recommandé par papa", time: "1j", type: "info" },
    { id: 3, message: "Rappel: Lecture dans 30min", time: "30min", type: "reminder" }
  ]);

  // Message du jour
  const todayKey = new Date().toISOString().split('T')[0];
  const { data: dailyMessage } = useQuery({
    queryKey: ['dailyMessage', user?.groupId, user?.id, todayKey],
    queryFn: () => messagesApi.getByDate(getAuthHeader(), { childId: user.id, date: todayKey }),
    enabled: !!user?.id && !!user?.groupId,
  });

  // Stats dashboard connectées à l'API
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['childDashboard', user?.id],
    queryFn: () => childrenApi.getDashboardStats(user.id, getAuthHeader()),
    enabled: !!user?.id
  });

  // Message dynamique de mOtivO selon performance
  const getMotivoMessage = () => {
    if (!dashboardStats) return '';
    if (dashboardStats.totalPoints > 200) return "Incroyable ! Tu es un champion ! 🏆";
    if (dashboardStats.weeklyProgress > 80) return "Continue comme ça, tu es sur la bonne voie ! 🌟";
    if (dashboardStats.streak > 5) return "Bravo pour ta régularité ! 📚";
    if (dashboardStats.booksRead > 0) return "Quelle belle lecture ! Continue ! 📖";
    return "N'oublie pas, chaque effort compte ! 💪";
  };

  // Mock data pour les badges/awards
  const awards = [
    { id: 1, name: "Premier pas", icon: "👶", description: "Première tâche terminée", earned: dashboardStats?.totalPoints > 0 },
    { id: 2, name: "Lecteur assidu", icon: "📚", description: "5 livres lus", earned: dashboardStats?.booksRead >= 5 },
    { id: 3, name: "Champion", icon: "🏆", description: "100 points gagnés", earned: dashboardStats?.totalPoints >= 100 },
    { id: 4, name: "Super-héros", icon: "🦸", description: "Semaine parfaite", earned: dashboardStats?.weeklyProgress >= 100 },
    { id: 5, name: "Génie", icon: "🧠", description: "Série de 7 jours", earned: dashboardStats?.streak >= 7 }
  ];

  // Stats de lecture réelles
  const { data: readingStats } = useQuery({
    queryKey: ['readingStats', user?.id],
    queryFn: () => readingApi.getStats(user.id, getAuthHeader()),
    enabled: !!user?.id,
  });

  // Calculer les stats depuis l'API
  const totalPoints = dashboardStats?.totalPoints || 0;
  const booksRead = dashboardStats?.booksRead || 0;
  const pagesRead = dashboardStats?.pagesRead || 0;
  const currentBook = readingStats?.currentBook || null;
  const weeklyProgress = dashboardStats?.weeklyProgress || 0;

  return (
    <div className="min-h-screen bg-gradient-mootify p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header avec mOtivO */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex-1">
            <ChildHeader 
              title={t('child.home.title')} 
              subtitle={dailyMessage?.message || t('child.home.subtitle', { name: user?.name })}
            />
          </div>
          <div className="hidden md:block">
            <MotivoMascot 
              message={getMotivoMessage()} 
              size="lg"
            />
          </div>
        </motion.div>

        {/* Message du jour */}
        {dailyMessage?.message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-light/20 border border-brand rounded-2xl p-4 mb-6 shadow-md ring-1 ring-black/5 dark:ring-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-brand mb-1">Message du jour</h3>
                <p className="text-sm text-anthracite dark:text-cream">{dailyMessage.message}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Points totaux et progression */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-anthracite-light rounded-2xl p-4 text-center shadow-md ring-1 ring-black/5 dark:ring-white/5 hover:shadow-lg transition-shadow"
          >
            <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-brand">
              {statsLoading ? '...' : <AnimatedCounter value={totalPoints} />}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('child.home.totalPoints')}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-anthracite-light rounded-2xl p-4 text-center shadow-md ring-1 ring-black/5 dark:ring-white/5 hover:shadow-lg transition-shadow"
          >
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-secondary">
              {statsLoading ? '...' : <AnimatedCounter value={booksRead} />}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('child.home.booksRead')}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-anthracite-light rounded-2xl p-4 text-center shadow-md ring-1 ring-black/5 dark:ring-white/5 hover:shadow-lg transition-shadow"
          >
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold text-accent">
              {statsLoading ? '...' : <AnimatedCounter value={weeklyProgress} />}%
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('child.home.weeklyProgress')}</p>
          </motion.div>
        </div>

        {/* Livre en cours */}
        {currentBook && currentBook.book && (
          <div className="bg-white dark:bg-anthracite-light rounded-2xl p-6 mb-6 shadow-md ring-1 ring-black/5 dark:ring-white/5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                {currentBook.book.coverImageUrl ? (
                  <img src={currentBook.book.coverImageUrl} alt={currentBook.book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand to-secondary flex items-center justify-center text-2xl">
                    📖
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-display font-semibold text-anthracite dark:text-cream mb-1">
                  {t('child.home.currentBook')}
                </h3>
                <p className="text-sm font-medium text-brand mb-2">{currentBook.book.title}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>Page {currentBook.progress?.currentPage || 0} sur {currentBook.book.totalPages}</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-brand h-2 rounded-full transition-all duration-300"
                      style={{ width: `${currentBook.percentage || 0}%` }}
                    />
                  </div>
                  <span className="font-medium">{currentBook.percentage || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Badges/Awards */}
        <div className="bg-white dark:bg-anthracite-light rounded-2xl p-6 mb-6 shadow-md ring-1 ring-black/5 dark:ring-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-brand" />
            <h3 className="text-lg font-display font-semibold text-anthracite dark:text-cream">
              {t('child.home.myBadges')}
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {awards.map((award) => (
              <div 
                key={award.id}
                className={`p-3 rounded-xl text-center transition-all ${
                  award.earned 
                    ? 'bg-brand-light/20 border-2 border-brand' 
                    : 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent opacity-60'
                }`}
              >
                <div className="text-2xl mb-1">{award.icon}</div>
                <p className={`text-xs font-medium ${
                  award.earned ? 'text-brand' : 'text-gray-500'
                }`}>
                  {award.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-anthracite-light rounded-2xl p-6 shadow-md ring-1 ring-black/5 dark:ring-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-secondary" />
            <h3 className="text-lg font-display font-semibold text-anthracite dark:text-cream">
              {t('child.home.notifications')}
            </h3>
          </div>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-3 rounded-lg border-l-4 ${
                  notification.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                  notification.type === 'info' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                  'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-anthracite dark:text-cream">
                    {notification.message}
                  </p>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <button className="bg-white dark:bg-anthracite-light rounded-xl p-4 text-center shadow-md ring-1 ring-black/5 dark:ring-white/5 hover:shadow-lg transition-all">
            <Target className="w-6 h-6 text-brand mx-auto mb-2" />
            <p className="text-sm font-medium text-anthracite dark:text-cream">{t('child.home.myTasks')}</p>
          </button>
          <button className="bg-white dark:bg-anthracite-light rounded-xl p-4 text-center shadow-md ring-1 ring-black/5 dark:ring-white/5 hover:shadow-lg transition-all">
            <Calendar className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-sm font-medium text-anthracite dark:text-cream">{t('child.home.myAgenda')}</p>
          </button>
          <button className="bg-white dark:bg-anthracite-light rounded-xl p-4 text-center shadow-md ring-1 ring-black/5 dark:ring-white/5 hover:shadow-lg transition-all">
            <BookOpen className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-sm font-medium text-anthracite dark:text-cream">{t('child.home.myReads')}</p>
          </button>
          <button className="bg-white dark:bg-anthracite-light rounded-xl p-4 text-center shadow-md ring-1 ring-black/5 dark:ring-white/5 hover:shadow-lg transition-all">
            <Trophy className="w-6 h-6 text-brand mx-auto mb-2" />
            <p className="text-sm font-medium text-anthracite dark:text-cream">{t('child.home.myStats')}</p>
          </button>
        </div>
      </div>
    </div>
  );
}
