import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarRange, Calendar, Clock } from 'lucide-react';
import ChildHeader from '../../components/child/ChildHeader';

export default function AgendaPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('week'); // 'week' | 'month'

  return (
    <div>
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

      {tab === 'week' ? <WeekView /> : <MonthView />}
    </div>
  );
}

function WeekView() {
  const { t } = useTranslation();
  const days = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  const mock = days.map((d, i) => ({
    day: d,
    tasks: Math.max(0, (4 - Math.abs(3 - i))), // un petit triangle 0-4-0
    points: (i+1)*10,
  }));

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {mock.map((it) => (
        <div key={it.day} className="bg-white dark:bg-anthracite-light rounded-2xl p-4 shadow-md ring-1 ring-black/5 dark:ring-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-anthracite dark:text-cream">{it.day}</span>
            <Calendar className="w-4 h-4 text-brand" />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('child.agenda.tasksComing')}: <b>{it.tasks}</b></div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('child.agenda.pointsPossible')}: <b>{it.points}</b></div>
        </div>
      ))}
    </div>
  );
}

function MonthView() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month+1, 0);
  const startOffset = (firstDay.getDay()+6)%7; // Lundi=0
  const days = lastDay.getDate();
  const cells = [];
  for (let i=0;i<startOffset;i++) cells.push(null);
  for (let d=1; d<=days; d++) cells.push(d);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-gray-600 dark:text-gray-300">
        {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(h => <div key={h} className="text-center py-1">{h}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, idx) => (
          <div key={idx} className={`min-h-[64px] rounded-lg p-2 border ${d? 'bg-white dark:bg-anthracite-light border-gray-200 dark:border-gray-700' : 'bg-transparent border-transparent'}`}>
            {d && (
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-anthracite dark:text-cream">{d}</span>
                <Clock className="w-4 h-4 text-secondary" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


