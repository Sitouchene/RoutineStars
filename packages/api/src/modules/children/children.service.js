import bcrypt from 'bcryptjs';
import prisma from '../../config/database.js';
import { USER_ROLES } from 'shared/constants';

/**
 * Créer un profil enfant (par un parent)
 */
export async function createChild({ groupId, name, age, pin, avatar }) {
  const hashedPin = await bcrypt.hash(pin, 10);

  const child = await prisma.user.create({
    data: {
      groupId,
      role: USER_ROLES.CHILD,
      name,
      age,
      pin: hashedPin,
      avatar,
    },
    select: {
      id: true,
      name: true,
      age: true,
      avatar: true,
      role: true,
      createdAt: true,
    },
  });

  return child;
}

/**
 * Récupérer tous les enfants d'un groupe
 */
export async function getChildren(groupId) {
  const children = await prisma.user.findMany({
    where: {
      groupId,
      role: USER_ROLES.CHILD,
    },
    select: {
      id: true,
      name: true,
      age: true,
      avatar: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return children;
}

/**
 * Mettre à jour un enfant
 */
export async function updateChild(childId, groupId, updates) {
  // Vérifier que l'enfant appartient au groupe
  const child = await prisma.user.findFirst({
    where: {
      id: childId,
      groupId,
      role: USER_ROLES.CHILD,
    },
  });

  if (!child) {
    throw new Error('Enfant non trouvé');
  }

  const data = { ...updates };

  // Si le PIN est modifié, le hasher
  if (updates.pin) {
    data.pin = await bcrypt.hash(updates.pin, 10);
  }

  const updatedChild = await prisma.user.update({
    where: { id: childId },
    data,
    select: {
      id: true,
      name: true,
      age: true,
      avatar: true,
    },
  });

  return updatedChild;
}

/**
 * Supprimer un enfant
 */
export async function deleteChild(childId, groupId) {
  const child = await prisma.user.findFirst({
    where: {
      id: childId,
      groupId,
      role: USER_ROLES.CHILD,
    },
  });

  if (!child) {
    throw new Error('Enfant non trouvé');
  }

  await prisma.user.delete({
    where: { id: childId },
  });

  return { message: 'Enfant supprimé avec succès' };
}

/**
 * Mettre à jour l'avatar d'un enfant
 */
export async function updateChildAvatar(childId, familyId, avatar) {
  const child = await prisma.user.findFirst({
    where: {
      id: childId,
      groupId: familyId,
      role: USER_ROLES.CHILD,
    },
  });

  if (!child) {
    throw new Error('Enfant non trouvé');
  }

  const updatedChild = await prisma.user.update({
    where: { id: childId },
    data: { avatar },
    select: {
      id: true,
      name: true,
      age: true,
      avatar: true,
      role: true,
      updatedAt: true,
    },
  });

  return updatedChild;
}

/**
 * Calculer la progression hebdomadaire de l'enfant
 */
async function calculateWeeklyProgress(childId) {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);

  const [thisWeek, total] = await Promise.all([
    prisma.daySubmission.count({
      where: { 
        childId, 
        validatedAt: { not: null },
        submittedAt: { gte: weekStart }
      }
    }),
    prisma.daySubmission.count({
      where: { childId, validatedAt: { not: null } }
    })
  ]);

  return {
    percentage: total > 0 ? Math.round((thisWeek / total) * 100) : 0,
    thisWeek,
    total
  };
}

/**
 * Calculer la série de lecture (jours consécutifs)
 */
async function calculateReadingStreak(childId) {
  const progressUpdates = await prisma.readingProgress.findMany({
    where: { readingAssignment: { childId } },
    orderBy: { updatedAt: 'desc' },
    select: { updatedAt: true }
  });

  if (progressUpdates.length === 0) {
    return { days: 0 };
  }

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const update of progressUpdates) {
    const updateDate = new Date(update.updatedAt);
    updateDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate - updateDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (daysDiff > streak) {
      break;
    }
  }

  return { days: streak };
}

/**
 * Calculer le prochain objectif de points
 */
function calculateNextGoal(currentPoints) {
  const milestones = [50, 100, 200, 500, 1000, 2000, 5000];
  const nextMilestone = milestones.find(m => m > currentPoints) || currentPoints + 500;
  
  return {
    points: nextMilestone,
    remaining: nextMilestone - currentPoints,
    progress: currentPoints > 0 ? Math.round((currentPoints / nextMilestone) * 100) : 0
  };
}

/**
 * Récupérer les stats dashboard pour un enfant
 */
export async function getChildDashboardStats(childId) {
  const [totalPoints, pagesRead, booksRead, weeklyProgress, streak] = await Promise.all([
    // Points totaux depuis submissions validées (optimisé avec le champ totalPointsEarned)
    prisma.user.findUnique({
      where: { id: childId },
      select: { totalPointsEarned: true }
    }),
    // Pages lues depuis ReadingProgress
    prisma.readingProgress.aggregate({
      where: { readingAssignment: { childId } },
      _sum: { currentPage: true }
    }),
    // Livres terminés
    prisma.readingAssignment.count({
      where: { 
        childId, 
        progress: { isFinished: true }
      }
    }),
    // Progression hebdomadaire
    calculateWeeklyProgress(childId),
    // Série de lecture
    calculateReadingStreak(childId)
  ]);

  const points = totalPoints?.totalPointsEarned || 0;
  
  return {
    totalPoints: points,
    pagesRead: pagesRead._sum.currentPage || 0,
    booksRead,
    weeklyProgress: weeklyProgress.percentage,
    weeklyTasks: weeklyProgress.thisWeek,
    streak: streak.days,
    nextGoal: calculateNextGoal(points)
  };
}

/**
 * Mettre à jour les points totaux d'un enfant (appelé lors de la validation d'une soumission)
 */
export async function updateChildPoints(childId, pointsToAdd) {
  return await prisma.user.update({
    where: { id: childId },
    data: {
      totalPointsEarned: {
        increment: pointsToAdd
      }
    },
    select: {
      id: true,
      name: true,
      totalPointsEarned: true
    }
  });
}

/**
 * Mettre à jour la dernière connexion d'un enfant
 */
export async function updateChildLastLogin(childId) {
  return await prisma.user.update({
    where: { id: childId },
    data: {
      lastLoginAt: new Date()
    },
    select: {
      id: true,
      name: true,
      lastLoginAt: true
    }
  });
}
