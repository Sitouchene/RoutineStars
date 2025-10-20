import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Gift, BookOpen, CheckCircle, Star } from 'lucide-react';
import { pointsApi } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';

/**
 * Composant pour afficher l'historique des transactions de points
 */
export default function PointsHistory() {
  const { t } = useTranslation();
  const { user, getAuthHeader } = useAuthStore();

  // Récupérer l'historique des transactions
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['pointTransactions', user?.id],
    queryFn: () => pointsApi.getTransactions(user.id, getAuthHeader(), 100),
    enabled: !!user?.id,
  });

  // Récupérer les statistiques de points
  const { data: stats } = useQuery({
    queryKey: ['pointStats', user?.id],
    queryFn: () => pointsApi.getStats(user.id, getAuthHeader()),
    enabled: !!user?.id,
  });

  const getTransactionIcon = (type, source) => {
    if (type === 'earned') {
      switch (source) {
        case 'task': return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'reading': return <BookOpen className="w-4 h-4 text-blue-500" />;
        case 'bonus': return <Star className="w-4 h-4 text-yellow-500" />;
        default: return <TrendingUp className="w-4 h-4 text-green-500" />;
      }
    } else {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
  };

  const getTransactionColor = (type) => {
    return type === 'earned' ? 'text-green-600' : 'text-red-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6" />
              <h3 className="font-semibold">Points Gagnés</h3>
            </div>
            <div className="text-2xl font-bold">🪙 {stats.totalEarned}</div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-6 h-6" />
              <h3 className="font-semibold">Points Dépensés</h3>
            </div>
            <div className="text-2xl font-bold">🪙 {stats.totalSpent}</div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="w-6 h-6" />
              <h3 className="font-semibold">Solde Actuel</h3>
            </div>
            <div className="text-2xl font-bold">🪙 {stats.currentBalance}</div>
          </div>
        </div>
      )}

      {/* Historique des transactions */}
      <div className="bg-white dark:bg-anthracite-light rounded-2xl p-6 shadow-md ring-1 ring-black/5 dark:ring-white/5">
        <h3 className="text-lg font-semibold text-anthracite dark:text-cream mb-4">
          Historique des Transactions
        </h3>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Aucune transaction pour le moment
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type, transaction.source)}
                  <div>
                    <p className="font-medium text-anthracite dark:text-cream">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} 🪙
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

