import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarRange, Calendar, Clock, Target, BookOpen, MessageCircle, Eye, CheckCircle } from 'lucide-react';
import ChildHeader from '../../components/child/ChildHeader';
import { useToast } from '../../components/ui/Toast';
import { useConfirm } from '../../components/ui/ConfirmModal';

export default function AgendaPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('week'); // 'week' | 'month'
  const { info, ToastContainer } = useToast();
  const { confirm, ConfirmModalComponent } = useConfirm();

  return (
    <div className="min-h-screen bg-gradient-mootify p-4">
      <div className="max-w-4xl mx-auto">
        <ChildHeader title={t('child.agenda.title')} subtitle={t('child.agenda.subtitle')} />

        {/* Tabs */}
        <div className="flex mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl p-1 w-fit">
          <button
            onClick={() => setTab('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${tab==='week' ? 'bg-white dark:bg-anthracite text-brand shadow-sm' : 'text-gray-600 dark:text-gray-300 hover-text-brand'}`}
          >{t('child.agenda.week')}</button>
          <button
            onClick={() => setTab('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${tab==='month' ? 'bg-white dark:bg-anthracite text-brand shadow-sm' : 'text-gray-600 dark:text-gray-300 hover-text-brand'}`}
          >{t('child.agenda.month')}</button>
        </div>

        {tab === 'week' ? <WeekView onShowDetails={handleShowDetails} onShowMessage={handleShowMessage} /> : <MonthView onShowDetails={handleShowDetails} onShowMessage={handleShowMessage} />}
      </div>
      
      {/* Toast Container */}
      <ToastContainer />
      
      {/* Confirm Modal */}
      <ConfirmModalComponent />
    </div>
  );

  function handleShowDetails(dayData) {
    info(t('child.agenda.showingDetails', `Détails pour le ${dayData.date}`));
  }

  function handleShowMessage(message) {
    info(t('child.agenda.showingMessage', `Message: ${message}`));
  }
}

function WeekView({ onShowDetails, onShowMessage }) {
  const { t } = useTranslation();
  
  // Données mock plus réalistes pour la semaine
  const mockWeekData = [
    { 
      day: 'Lun', 
      date: '13', 
      isPast: false,
      tasks: 3, 
      points: 45, 
      books: 1,
      hasMessage: true,
      message: 'N\'oublie pas de lire ton livre aujourd\'hui !',
      completed: 1
    },
    { 
      day: 'Mar', 
      date: '14', 
      isPast: false,
      tasks: 2, 
      points: 30, 
      books: 0,
      hasMessage: false,
      message: '',
      completed: 0
    },
    { 
      day: 'Mer', 
      date: '15', 
      isPast: false,
      tasks: 4, 
      points: 60, 
      books: 1,
      hasMessage: true,
      message: 'Journée spéciale maths !',
      completed: 0
    },
    { 
      day: 'Jeu', 
      date: '16', 
      isPast: false,
      tasks: 2, 
      points: 25, 
      books: 0,
      hasMessage: false,
      message: '',
      completed: 0
    },
    { 
      day: 'Ven', 
      date: '17', 
      isPast: false,
      tasks: 3, 
      points: 40, 
      books: 1,
      hasMessage: true,
      message: 'Fin de semaine, continue tes efforts !',
      completed: 0
    },
    { 
      day: 'Sam', 
      date: '18', 
      isPast: false,
      tasks: 1, 
      points: 15, 
      books: 0,
      hasMessage: false,
      message: '',
      completed: 0
    },
    { 
      day: 'Dim', 
      date: '19', 
      isPast: false,
      tasks: 0, 
      points: 0, 
      books: 0,
      hasMessage: false,
      message: '',
      completed: 0
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
      {mockWeekData.map((day) => (
        <div 
          key={day.day} 
          className={`bg-white dark:bg-anthracite-light rounded-2xl p-4 shadow-md ring-1 ring-black/5 dark:ring-white/5 transition-all hover:shadow-lg ${
            day.isPast ? 'opacity-60 grayscale' : ''
          }`}
        >
          {/* Header avec jour et date */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-sm font-medium text-anthracite dark:text-cream">{day.day}</span>
              <div className="text-xs text-gray-500 dark:text-gray-400">{day.date}</div>
            </div>
            <Calendar className="w-4 h-4 text-brand" />
          </div>

          {/* Stats du jour */}
          <div className="space-y-2 mb-3">
            {day.tasks > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-3 h-3 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-300">{day.tasks} tâches</span>
                {day.completed > 0 && (
                  <span className="text-green-600 text-xs">({day.completed} terminées)</span>
                )}
              </div>
            )}
            
            {day.points > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-gray-600 dark:text-gray-300">{day.points} points</span>
              </div>
            )}
            
            {day.books > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-3 h-3 text-purple-500" />
                <span className="text-gray-600 dark:text-gray-300">{day.books} livre</span>
              </div>
            )}
          </div>

          {/* Message du jour */}
          {day.hasMessage && (
            <button
              onClick={() => onShowMessage(day.message)}
              className="w-full mb-2 p-2 bg-brand/10 hover:bg-brand/20 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3 h-3 text-brand" />
                <span className="text-xs text-brand font-medium">Message</span>
              </div>
            </button>
          )}

          {/* Bouton détails */}
          {(day.tasks > 0 || day.books > 0) && (
            <button
              onClick={() => onShowDetails(day)}
              className="w-full flex items-center justify-center gap-2 p-2 text-xs text-gray-600 dark:text-gray-300 hover:text-brand transition-colors"
            >
              <Eye className="w-3 h-3" />
              {t('child.agenda.showDetails')}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function MonthView({ onShowDetails, onShowMessage }) {
  const { t } = useTranslation();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Lundi=0
  const days = lastDay.getDate();
  
  // Générer des données mock pour le mois
  const generateMockDayData = (day) => {
    const isPast = day < now.getDate();
    const hasTasks = Math.random() > 0.3; // 70% de chance d'avoir des tâches
    const hasBooks = Math.random() > 0.7; // 30% de chance d'avoir des livres
    const hasMessage = Math.random() > 0.8; // 20% de chance d'avoir un message
    
    return {
      day,
      isPast,
      tasks: hasTasks ? Math.floor(Math.random() * 4) + 1 : 0,
      points: hasTasks ? Math.floor(Math.random() * 50) + 10 : 0,
      books: hasBooks ? 1 : 0,
      hasMessage,
      message: hasMessage ? `Message spécial pour le ${day} !` : '',
      completed: isPast ? Math.floor(Math.random() * 3) : 0
    };
  };

  const cells = [];
  // Jours vides au début
  for (let i = 0; i < startOffset; i++) cells.push(null);
  // Jours du mois
  for (let d = 1; d <= days; d++) cells.push(generateMockDayData(d));

  return (
    <div>
      {/* En-têtes des jours */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-gray-600 dark:text-gray-300">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(h => (
          <div key={h} className="text-center py-2 font-medium">{h}</div>
        ))}
      </div>
      
      {/* Grille du mois */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((dayData, idx) => (
          <div 
            key={idx} 
            className={`min-h-[80px] rounded-lg p-2 border transition-all hover:shadow-md ${
              dayData ? 
                `bg-white dark:bg-anthracite-light border-gray-200 dark:border-gray-700 ${
                  dayData.isPast ? 'opacity-60 grayscale' : ''
                }` : 
                'bg-transparent border-transparent'
            }`}
          >
            {dayData && (
              <div className="h-full flex flex-col">
                {/* Date */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-anthracite dark:text-cream">
                    {dayData.day}
                  </span>
                  {dayData.hasMessage && (
                    <button
                      onClick={() => onShowMessage(dayData.message)}
                      className="text-brand hover:text-brand-dark"
                    >
                      <MessageCircle className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Stats compactes */}
                <div className="flex-1 space-y-1">
                  {dayData.tasks > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <Target className="w-2 h-2 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-300">{dayData.tasks}</span>
                    </div>
                  )}
                  
                  {dayData.points > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <CheckCircle className="w-2 h-2 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">{dayData.points}</span>
                    </div>
                  )}
                  
                  {dayData.books > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <BookOpen className="w-2 h-2 text-purple-500" />
                      <span className="text-gray-600 dark:text-gray-300">{dayData.books}</span>
                    </div>
                  )}
                </div>

                {/* Bouton détails */}
                {(dayData.tasks > 0 || dayData.books > 0) && (
                  <button
                    onClick={() => onShowDetails(dayData)}
                    className="mt-1 text-xs text-brand hover:text-brand-dark transition-colors"
                  >
                    <Eye className="w-3 h-3 mx-auto" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


