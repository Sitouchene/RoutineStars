import prisma from '../../config/database.js';

export async function listMessages(familyId, { childId, date } = {}) {
  const where = { familyId };
  if (childId) where.childId = childId;
  if (date) where.date = new Date(date);
  return prisma.dailyMessage.findMany({ where, orderBy: { date: 'asc' } });
}

export async function getMessageForDate(familyId, childId, date) {
  const targetDate = new Date(date);
  // Priorité au message ciblé enfant, sinon message global famille
  const childMsg = await prisma.dailyMessage.findFirst({
    where: { familyId, childId, date: targetDate },
  });
  if (childMsg) return childMsg;
  return prisma.dailyMessage.findFirst({
    where: { familyId, childId: null, date: targetDate },
  });
}

export async function createMessage({ familyId, childId = null, date, message }) {
  return prisma.dailyMessage.create({
    data: { familyId, childId, date: new Date(date), message },
  });
}

export async function updateMessage(id, familyId, updates) {
  // sécuriser par familyId
  const existing = await prisma.dailyMessage.findFirst({ where: { id, familyId } });
  if (!existing) throw new Error('Message introuvable');
  const data = { ...updates };
  if (updates.date) data.date = new Date(updates.date);
  return prisma.dailyMessage.update({ where: { id }, data });
}

export async function deleteMessage(id, familyId) {
  const existing = await prisma.dailyMessage.findFirst({ where: { id, familyId } });
  if (!existing) throw new Error('Message introuvable');
  await prisma.dailyMessage.delete({ where: { id } });
  return { success: true };
}


