import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { statsApi, childrenApi } from '../../lib/api-client';
import { Calendar, BarChart3, TrendingUp, Award, Clock, Target } from 'lucide-react';

export default function StatsPage() {
  const [selectedChild, setSelectedChild] = useState(null);
  const [viewMode, setViewMode] = useState('daily'); // daily, weekly, monthly
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()));
  const { getAuthHeader, user } = useAuthStore();

  // Récupérer la liste des enfants
  const { data: children = [] } = useQuery({
    queryKey: ['children', user?.familyId],
    queryFn: () => childrenApi.getAll(getAuthHeader()),
    enabled: !!user?.familyId,
  });

  // Sélectionner le premier enfant par défaut
  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0]);
    }
  }, [children, selectedChild]);

  const viewModes = [
    { key: 'daily', label: 'Jour', icon: Calendar },
    { key: 'weekly', label: 'Semaine', icon: BarChart3 },
    { key: 'monthly', label: 'Mois', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-600">Suivez les progrès de vos enfants</p>
        </div>
      </div>

      {/* Sélection d'enfant */}
      {children.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Sélectionner un enfant</h3>
          <div className="flex gap-2 flex-wrap">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedChild?.id === child.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {child.name} ({child.age} ans)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sélection de vue */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Type de vue</h3>
        <div className="flex gap-2">
          {viewModes.map(mode => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === mode.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <mode.icon className="w-4 h-4" />
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des statistiques */}
      {selectedChild && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {selectedChild.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedChild.name}</h2>
              <p className="text-gray-600">{selectedChild.age} ans</p>
            </div>
          </div>

          {viewMode === 'daily' && (
            <DailyStatsView 
              childId={selectedChild.id} 
              date={selectedDate} 
              onDateChange={setSelectedDate}
              getAuthHeader={getAuthHeader}
            />
          )}

          {viewMode === 'weekly' && (
            <WeeklyStatsView 
              childId={selectedChild.id} 
              startDate={getWeekStart(selectedDate)}
              getAuthHeader={getAuthHeader}
            />
          )}

          {viewMode === 'monthly' && (
            <MonthlyStatsView 
              childId={selectedChild.id} 
              year={new Date(selectedDate).getFullYear()}
              month={new Date(selectedDate).getMonth() + 1}
              getAuthHeader={getAuthHeader}
            />
          )}
        </div>
      )}

      {children.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">Aucun enfant trouvé</div>
          <p className="text-sm text-gray-400">
            Ajoutez des enfants pour voir leurs statistiques
          </p>
        </div>
      )}
    </div>
  );
}

// Fonction utilitaire pour obtenir le début de la semaine
function getWeekStart(date) {
  const dateObj = new Date(date + 'T00:00:00');
  const day = dateObj.getDay();
  const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1); // Ajuster pour commencer le lundi (local)
  const monday = new Date(dateObj);
  monday.setDate(diff);
  return formatLocalDate(monday);
}

function formatLocalDate(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Composant pour la vue quotidienne
function DailyStatsView({ childId, date, onDateChange, getAuthHeader }) {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dailyStats', childId, date],
    queryFn: () => statsApi.getChildDailyStats(childId, date, getAuthHeader()),
    enabled: !!childId,
  });

  if (isLoading) {
    return <div className="text-center py-8">Chargement des statistiques...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Erreur lors du chargement</div>;
  }

  if (!stats) {
    return <div className="text-center py-8 text-gray-500">Aucune donnée pour cette date</div>;
  }

  return (
    <div className="space-y-6">
      {/* Sélecteur de date */}
      <div className="flex items-center gap-4">
        <label className="font-medium text-gray-700">Date :</label>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-blue-600">{stats.completionRate}%</h3>
          <p className="text-sm text-blue-700">Taux de réalisation</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-600">{stats.earnedPoints}</h3>
          <p className="text-sm text-green-700">Points gagnés</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-purple-600">{stats.totalTasks}</h3>
          <p className="text-sm text-purple-700">Tâches validées</p>
        </div>
      </div>

      {/* Détail des tâches */}
      {stats.tasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Détail des tâches</h3>
          <div className="space-y-3">
            {stats.tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getCategoryIcon(task.category)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.points} points</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{task.score}%</div>
                  <div className="text-sm text-gray-600">{task.earnedPoints} pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Composant pour la vue hebdomadaire
function WeeklyStatsView({ childId, startDate, getAuthHeader }) {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['weeklyStats', childId, startDate],
    queryFn: () => statsApi.getChildWeeklyStats(childId, startDate, getAuthHeader()),
    enabled: !!childId,
  });

  if (isLoading) {
    return <div className="text-center py-8">Chargement des statistiques...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Erreur lors du chargement</div>;
  }

  if (!stats) {
    return <div className="text-center py-8 text-gray-500">Aucune donnée pour cette semaine</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-blue-600">{stats.weeklyCompletionRate}%</h3>
          <p className="text-sm text-blue-700">Taux moyen de la semaine</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-600">{stats.totalWeekEarnedPoints}</h3>
          <p className="text-sm text-green-700">Points gagnés cette semaine</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-purple-600">{stats.totalWeekPoints}</h3>
          <p className="text-sm text-purple-700">Points totaux possibles</p>
        </div>
      </div>

      {/* Graphique des jours */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progression de la semaine</h3>
        <div className="grid grid-cols-7 gap-2">
          {stats.dailyStats.map((dayStats) => {
            const [yy, mm, dd] = dayStats.date.split('-').map(Number);
            const date = new Date(yy, mm - 1, dd);
            const dayNumber = date.getDate();
            const dow = date.getDay(); // 0=Dim,1=Lun,...
            const dayNamesByDow = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
            const dayName = dayNamesByDow[dow];
            
            return (
              <div key={dayStats.date} className="text-center">
                <div className="text-xs text-gray-600 mb-1">{dayName}</div>
                <div className="text-sm font-medium text-gray-900 mb-2">{dayNumber}</div>
                <div className={`w-full h-16 rounded-lg flex items-end justify-center p-2 ${
                  dayStats.completionRate >= 80 ? 'bg-green-100' :
                  dayStats.completionRate >= 60 ? 'bg-yellow-100' :
                  dayStats.completionRate >= 40 ? 'bg-orange-100' : 'bg-red-100'
                }`}>
                  <div className="text-xs font-semibold text-gray-700">
                    {dayStats.completionRate}%
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {dayStats.earnedPoints}pts
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Composant pour la vue mensuelle
function MonthlyStatsView({ childId, year, month, getAuthHeader }) {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['monthlyStats', childId, year, month],
    queryFn: () => statsApi.getChildMonthlyStats(childId, year, month, getAuthHeader()),
    enabled: !!childId,
  });

  if (isLoading) {
    return <div className="text-center py-8">Chargement des statistiques...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Erreur lors du chargement</div>;
  }

  if (!stats) {
    return <div className="text-center py-8 text-gray-500">Aucune donnée pour ce mois</div>;
  }

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-blue-600">{stats.monthlyCompletionRate}%</h3>
          <p className="text-sm text-blue-700">Taux moyen du mois</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-600">{stats.totalMonthEarnedPoints}</h3>
          <p className="text-sm text-green-700">Points gagnés ce mois</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-purple-600">{stats.totalMonthPoints}</h3>
          <p className="text-sm text-purple-700">Points totaux possibles</p>
        </div>
      </div>

      {/* Calendrier mensuel */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Calendrier - {monthNames[month - 1]} {year}
        </h3>
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* En-têtes des jours */}
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="p-2 text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
          
          {/* Jours du mois alignés sur le bon jour de la semaine */}
          {(() => {
            const firstDayOfMonth = new Date(year, month - 1, 1);
            const lastDayOfMonth = new Date(year, month, 0);
            const firstDayWeekday = firstDayOfMonth.getDay(); // 0=Dimanche, 1=Lundi, ...
            const daysInMonth = lastDayOfMonth.getDate();

            const cells = [];
            // Préfixe vide pour aligner sur Lundi
            for (let i = 0; i < (firstDayWeekday === 0 ? 6 : firstDayWeekday - 1); i++) {
              cells.push(<div key={`empty-${i}`} className="p-2 rounded-lg min-h-[60px] bg-gray-50" />);
            }

            for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
              const dateKey = `${year}-${month.toString().padStart(2, '0')}-${dayNumber.toString().padStart(2, '0')}`;
              const dayStats = stats.dailyStats[dateKey];
              cells.push(
                <div
                  key={dayNumber}
                  className={`p-2 rounded-lg min-h-[60px] flex flex-col justify-center ${
                    dayStats
                      ? dayStats.completionRate >= 80 ? 'bg-green-100' :
                        dayStats.completionRate >= 60 ? 'bg-yellow-100' :
                        dayStats.completionRate >= 40 ? 'bg-orange-100' : 'bg-red-100'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">{dayNumber}</div>
                  {dayStats && (
                    <>
                      <div className="text-xs font-semibold text-gray-700">{dayStats.completionRate}%</div>
                      <div className="text-xs text-gray-600">{dayStats.earnedPoints}pts</div>
                    </>
                  )}
                </div>
              );
            }

            return cells;
          })()}
        </div>
      </div>
    </div>
  );
}

// Fonction utilitaire pour les icônes de catégories
function getCategoryIcon(category) {
  const icons = {
    'routine': '🌅',
    'maison': '🏠',
    'etudes': '📚',
  };
  return icons[category] || '📋';
}
