import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { messagesApi, evalWindowApi, childrenApi } from '../../lib/api-client';

export default function MessagesRulesPage() {
  const { getAuthHeader, user } = useAuthStore();
  const qc = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [message, setMessage] = useState('');

  const { data: children = [] } = useQuery({
    queryKey: ['children', user?.familyId],
    queryFn: () => childrenApi.getAll(getAuthHeader()),
    enabled: !!user?.familyId,
  });

  const { data: existingMessage } = useQuery({
    queryKey: ['dailyMessage', user?.familyId, selectedChildId, selectedDate],
    queryFn: () => messagesApi.getByDate(getAuthHeader(), { childId: selectedChildId || '', date: selectedDate }),
    enabled: !!user?.familyId,
  });

  const upsertMessage = useMutation({
    mutationFn: async () => {
      if (existingMessage?.id) {
        return messagesApi.update(existingMessage.id, { message }, getAuthHeader());
      }
      return messagesApi.create({ childId: selectedChildId || null, date: selectedDate, message }, getAuthHeader());
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dailyMessage'] });
      setMessage('');
    },
  });

  const { data: windowData } = useQuery({
    queryKey: ['evalWindow', user?.familyId, selectedChildId],
    queryFn: () => evalWindowApi.get(getAuthHeader(), { childId: selectedChildId || '' }),
    enabled: !!user?.familyId,
  });

  const upsertWindow = useMutation({
    mutationFn: (payload) => evalWindowApi.upsert({ childId: selectedChildId || null, ...payload }, getAuthHeader()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['evalWindow'] }),
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Messages & règles</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Destinataire</h2>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setSelectedChildId('')}
            className={`px-3 py-2 rounded-lg text-sm ${selectedChildId === '' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
          >Toute la famille</button>
          {children.map(c => (
            <button key={c.id} onClick={() => setSelectedChildId(c.id)} className={`px-3 py-2 rounded-lg text-sm ${selectedChildId === c.id ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>{c.name}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Message du jour</h2>
        <div className="flex items-center gap-3 mb-3">
          <input type="date" value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)} className="px-3 py-2 border rounded-lg" />
          <input type="text" placeholder="Ton message motivant..." value={message} onChange={(e)=>setMessage(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" />
          <button onClick={()=>upsertMessage.mutate()} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Enregistrer</button>
        </div>
        {existingMessage?.message && (
          <div className="text-sm text-gray-600">Message actuel: <span className="font-medium">{existingMessage.message}</span></div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Fenêtre d'autoévaluation</h2>
        <WindowForm
          initial={windowData || { startTime: '19:30', endTime: '20:30', daysMask: '1,1,1,1,1,1,1', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }}
          onSave={(payload)=>upsertWindow.mutate(payload)}
        />
      </div>
    </div>
  );
}

function WindowForm({ initial, onSave }) {
  const [form, setForm] = useState(initial);
  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap">
        <label className="flex items-center gap-2">Début <input type="time" value={form.startTime} onChange={(e)=>setForm({ ...form, startTime: e.target.value })} className="border px-2 py-1 rounded"/></label>
        <label className="flex items-center gap-2">Fin <input type="time" value={form.endTime} onChange={(e)=>setForm({ ...form, endTime: e.target.value })} className="border px-2 py-1 rounded"/></label>
        <label className="flex items-center gap-2">Fuseau <input type="text" value={form.timezone} onChange={(e)=>setForm({ ...form, timezone: e.target.value })} className="border px-2 py-1 rounded w-64"/></label>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Jours actifs (L..D, 1=actif,0=off)</label>
        <input type="text" value={form.daysMask} onChange={(e)=>setForm({ ...form, daysMask: e.target.value })} className="border px-3 py-2 rounded w-full"/>
      </div>
      <button onClick={()=>onSave(form)} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Sauvegarder</button>
    </div>
  );
}


