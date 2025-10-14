import prisma from '../../config/database.js';

export async function getWindow(groupId, childId) {
  // Priorité à la règle spécifique enfant, sinon règle groupe
  const childWin = childId ? await prisma.evaluationWindow.findFirst({ where: { groupId, childId } }) : null;
  if (childWin) return childWin;
  return prisma.evaluationWindow.findFirst({ where: { groupId, childId: null } });
}

export async function upsertWindow(groupId, payload) {
  const { childId = null, startTime, endTime, daysMask, timezone } = payload;
  const existing = await prisma.evaluationWindow.findFirst({ where: { groupId, childId } });
  if (existing) {
    return prisma.evaluationWindow.update({ where: { id: existing.id }, data: { startTime, endTime, daysMask, timezone } });
  }
  return prisma.evaluationWindow.create({ data: { groupId, childId, startTime, endTime, daysMask, timezone } });
}

export function isWithinWindow(window, now = new Date()) {
  if (!window) return true; // si pas de règle, autoriser
  try {
    const tz = window.timezone || 'UTC';
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short' });
    const parts = formatter.formatToParts(now);
    const hh = parts.find(p => p.type === 'hour').value;
    const mm = parts.find(p => p.type === 'minute').value;
    const dayShort = parts.find(p => p.type === 'weekday').value.toLowerCase();
    const map = { sun:0, mon:1, tue:2, wed:3, thu:4, fri:5, sat:6 };
    const dayIdx = map[dayShort.slice(0,3)] ?? 0;

    const [sh, sm] = (window.startTime || '00:00').split(':').map(Number);
    const [eh, em] = (window.endTime || '23:59').split(':').map(Number);
    const nowMin = Number(hh) * 60 + Number(mm);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;

    const days = (window.daysMask || '1,1,1,1,1,1,1').split(',').map(x => x.trim() === '1');
    if (!days[dayIdx]) return false;
    return nowMin >= startMin && nowMin <= endMin;
  } catch {
    return true;
  }
}


