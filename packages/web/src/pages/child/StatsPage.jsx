import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { statsApi } from '../../lib/api-client';
import { Calendar, BarChart3, TrendingUp, Award, Clock, Target, Star, Trophy, ArrowLeft } from 'lucide-react';

export default function ChildStatsPage() {
  const { getAuthHeader, user } = useAuthStore();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('daily'); // daily, weekly, monthly
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()));

  const viewModes = [
    { key: 'daily', label: 'Aujourd\'hui', icon: Calendar },
    { key: 'weekly', label: 'Cette semaine', icon: BarChart3 },
    { key: 'monthly', label: 'Ce mois', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl">
                📊
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mes statistiques</h1>
                <p className="text-gray-600">Regarde tes progrès !</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/child')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Ma journée</span>
            </button>
          </div>
        </div>

        {/* Sélection de vue */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Choisir la période</h3>
          <div className="flex gap-2 flex-wrap">
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
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {viewMode === 'daily' && (
            <DailyStatsView 
              childId={user?.id} 
              date={selectedDate} 
              onDateChange={setSelectedDate}
              getAuthHeader={getAuthHeader}
            />
          )}

          {viewMode === 'weekly' && (
            <WeeklyStatsView 
              childId={user?.id} 
              startDate={getWeekStart(selectedDate)}
              getAuthHeader={getAuthHeader}
            />
          )}

          {viewMode === 'monthly' && (
            <MonthlyStatsView 
              childId={user?.id} 
              year={new Date(selectedDate).getFullYear()}
              month={new Date(selectedDate).getMonth() + 1}
              getAuthHeader={getAuthHeader}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Fonction utilitaire pour obtenir le début de la semaine
function formatLocalDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getWeekStart(date) {
  const parts = date.split('-').map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  const dow = d.getDay();
  const diff = d.getDate() - dow + (dow === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  return formatLocalDate(monday);
}

// Composant pour la vue quotidienne
function DailyStatsView({ childId, date, onDateChange, getAuthHeader }) {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dailyStats', childId, date],
    queryFn: () => statsApi.getChildDailyStats(childId, date, getAuthHeader()),
    enabled: !!childId,
  });

  if (isLoading) {
    return <div className="text-center py-8">Chargement de tes statistiques...</div>;
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

      {/* Statistiques principales avec design enfant */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-blue-600">{stats.completionRate}%</h3>
          <p className="text-sm text-blue-700 font-medium">Super score !</p>
          <div className="mt-2 text-xs text-blue-600">
            {stats.completionRate >= 80 ? '🌟 Excellent !' :
             stats.completionRate >= 60 ? '👍 Bien joué !' :
             stats.completionRate >= 40 ? '💪 Continue !' : '🎯 Tu peux faire mieux !'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-green-600">{stats.earnedPoints}</h3>
          <p className="text-sm text-green-700 font-medium">Points gagnés</p>
          <div className="mt-2 text-xs text-green-600">
            Sur {stats.totalPoints} points possibles
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-purple-600">{stats.totalTasks}</h3>
          <p className="text-sm text-purple-700 font-medium">Tâches terminées</p>
          <div className="mt-2 text-xs text-purple-600">
            Bravo pour tes efforts !
          </div>
        </div>
      </div>

      {/* Détail des tâches avec design enfant */}
      {stats.tasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Mes tâches de la journée
          </h3>
          <div className="space-y-3">
            {stats.tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.points} points</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold px-3 py-1 rounded-full ${
                    task.score >= 80 ? 'text-green-600 bg-green-100' :
                    task.score >= 60 ? 'text-yellow-600 bg-yellow-100' :
                    task.score >= 40 ? 'text-orange-600 bg-orange-100' : 'text-red-600 bg-red-100'
                  }`}>
                    {task.score}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{task.earnedPoints} pts</div>
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
    return <div className="text-center py-8">Chargement de tes statistiques...</div>;
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
          <h3 className="text-3xl font-bold text-blue-600">{stats.weeklyCompletionRate}%</h3>
          <p className="text-sm text-blue-700 font-medium">Score de la semaine</p>
          <div className="mt-2 text-xs text-blue-600">
            {stats.weeklyCompletionRate >= 80 ? '🌟 Semaine parfaite !' :
             stats.weeklyCompletionRate >= 60 ? '👍 Bonne semaine !' :
             stats.weeklyCompletionRate >= 40 ? '💪 Semaine correcte !' : '🎯 Semaine à améliorer !'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-green-600">{stats.totalWeekEarnedPoints}</h3>
          <p className="text-sm text-green-700 font-medium">Points cette semaine</p>
          <div className="mt-2 text-xs text-green-600">
            Sur {stats.totalWeekPoints} points possibles
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-purple-600">{stats.totalWeekPoints}</h3>
          <p className="text-sm text-purple-700 font-medium">Points possibles</p>
          <div className="mt-2 text-xs text-purple-600">
            Continue comme ça !
          </div>
        </div>
      </div>

      {/* Graphique des jours avec design enfant */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Progression de la semaine
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {stats.dailyStats.map((dayStats) => {
            const [yy, mm, dd] = dayStats.date.split('-').map(Number);
            const date = new Date(yy, mm - 1, dd);
            const dayNumber = date.getDate();
            const dayName = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][date.getDay()];
            
            return (
              <div key={dayStats.date} className="text-center">
                <div className="text-xs text-gray-600 mb-1 font-medium">{dayName}</div>
                <div className="text-sm font-bold text-gray-900 mb-2">{dayNumber}</div>
                <div className={`w-full h-20 rounded-lg flex items-end justify-center p-2 border-2 ${
                  dayStats.completionRate >= 80 ? 'bg-green-100 border-green-300' :
                  dayStats.completionRate >= 60 ? 'bg-yellow-100 border-yellow-300' :
                  dayStats.completionRate >= 40 ? 'bg-orange-100 border-orange-300' : 'bg-red-100 border-red-300'
                }`}>
                  <div className="text-xs font-bold text-gray-700">
                    {dayStats.completionRate}%
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1 font-medium">
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
    return <div className="text-center py-8">Chargement de tes statistiques...</div>;
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
          <h3 className="text-3xl font-bold text-blue-600">{stats.monthlyCompletionRate}%</h3>
          <p className="text-sm text-blue-700 font-medium">Score du mois</p>
          <div className="mt-2 text-xs text-blue-600">
            {stats.monthlyCompletionRate >= 80 ? '🌟 Mois exceptionnel !' :
             stats.monthlyCompletionRate >= 60 ? '👍 Excellent mois !' :
             stats.monthlyCompletionRate >= 40 ? '💪 Bon mois !' : '🎯 Mois à améliorer !'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-green-600">{stats.totalMonthEarnedPoints}</h3>
          <p className="text-sm text-green-700 font-medium">Points ce mois</p>
          <div className="mt-2 text-xs text-green-600">
            Sur {stats.totalMonthPoints} points possibles
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-purple-600">{stats.totalMonthPoints}</h3>
          <p className="text-sm text-purple-700 font-medium">Points possibles</p>
          <div className="mt-2 text-xs text-purple-600">
            Tu es formidable !
          </div>
        </div>
      </div>

      {/* Calendrier mensuel avec design enfant */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          Calendrier - {monthNames[month - 1]} {year}
        </h3>
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* En-têtes des jours */}
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
            <div key={day} className="p-2 text-sm font-bold text-gray-600 bg-gray-100 rounded">
              {day}
            </div>
          ))}
          
          {/* Jours du mois */}
          {(() => {
            const firstDayOfMonth = new Date(year, month - 1, 1);
            const lastDayOfMonth = new Date(year, month, 0);
            const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = dimanche, 1 = lundi, etc.
            const daysInMonth = lastDayOfMonth.getDate();
            
            // Créer un tableau avec les cellules vides pour le début du mois
            const calendarCells = [];
            
            // Ajouter les cellules vides pour aligner le premier jour
            for (let i = 0; i < (firstDayWeekday === 0 ? 6 : firstDayWeekday - 1); i++) {
              calendarCells.push(
                <div key={`empty-${i}`} className="p-2 rounded-lg min-h-[60px] bg-gray-50 border-gray-200"></div>
              );
            }
            
            // Ajouter les jours du mois
            for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
              const dateKey = `${year}-${month.toString().padStart(2, '0')}-${dayNumber.toString().padStart(2, '0')}`;
              const dayStats = stats.dailyStats[dateKey];
              const currentDate = new Date(year, month - 1, dayNumber);
              const dayName = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][currentDate.getDay()];
              
              calendarCells.push(
                <div
                  key={dayNumber}
                  className={`p-2 rounded-lg min-h-[60px] flex flex-col justify-center border-2 ${
                    dayStats
                      ? dayStats.completionRate >= 80 ? 'bg-green-100 border-green-300' :
                        dayStats.completionRate >= 60 ? 'bg-yellow-100 border-yellow-300' :
                        dayStats.completionRate >= 40 ? 'bg-orange-100 border-orange-300' : 'bg-red-100 border-red-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-sm font-bold text-gray-900">{dayNumber}</div>
                  <div className="text-xs text-gray-500">{dayName}</div>
                  {dayStats && (
                    <>
                      <div className="text-xs font-bold text-gray-700">
                        {dayStats.completionRate}%
                      </div>
                      <div className="text-xs text-gray-600">
                        {dayStats.earnedPoints}pts
                      </div>
                    </>
                  )}
                </div>
              );
            }
            
            return calendarCells;
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
