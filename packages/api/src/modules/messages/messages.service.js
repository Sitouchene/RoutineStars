import prisma from '../../config/database.js';

export async function listMessages(groupId, { childId, date } = {}) {
  const where = { groupId };
  if (childId) where.childId = childId;
  if (date) where.date = new Date(date);
  return prisma.dailyMessage.findMany({ where, orderBy: { date: 'asc' } });
}

export async function getMessageForDate(groupId, childId, date) {
  const targetDate = new Date(date);
  // Priorité au message ciblé enfant, sinon message global groupe
  const childMsg = await prisma.dailyMessage.findFirst({
    where: { groupId, childId, date: targetDate },
  });
  if (childMsg) return childMsg;
  return prisma.dailyMessage.findFirst({
    where: { groupId, childId: null, date: targetDate },
  });
}

export async function createMessage({ groupId, childId = null, date, message }) {
  return prisma.dailyMessage.create({
    data: { groupId, childId, date: new Date(date), message },
  });
}

export async function updateMessage(id, groupId, updates) {
  // sécuriser par groupId
  const existing = await prisma.dailyMessage.findFirst({ where: { id, groupId } });
  if (!existing) throw new Error('Message introuvable');
  const data = { ...updates };
  if (updates.date) data.date = new Date(updates.date);
  return prisma.dailyMessage.update({ where: { id }, data });
}

export async function deleteMessage(id, groupId) {
  const existing = await prisma.dailyMessage.findFirst({ where: { id, groupId } });
  if (!existing) throw new Error('Message introuvable');
  await prisma.dailyMessage.delete({ where: { id } });
  return { success: true };
}


