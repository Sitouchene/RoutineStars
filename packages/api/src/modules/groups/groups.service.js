import prisma from '../../config/database.js';
import { generateUniqueGroupCode } from '../../../scripts/generate-group-code.js';

/**
 * Créer un nouveau groupe (famille ou classe)
 */
export async function createGroup({ type, name, language = 'fr' }) {
  const code = await generateUniqueGroupCode(prisma);
  
  const group = await prisma.group.create({
    data: {
      type,
      name,
      code,
      language,
    },
  });

  return group;
}

/**
 * Récupérer un groupe par son ID
 */
export async function getGroupById(groupId) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      users: {
        where: { role: { in: ['parent', 'teacher'] } },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return group;
}

/**
 * Récupérer un groupe par son code (pour la connexion enfant/élève)
 */
export async function getGroupByCode(code) {
  const group = await prisma.group.findUnique({
    where: { code },
    select: {
      id: true,
      type: true,
      name: true,
      language: true,
    },
  });

  return group;
}

/**
 * Récupérer les enfants/élèves d'un groupe (endpoint public pour la connexion)
 */
export async function getGroupChildren(groupId, groupType = 'family') {
  const childRole = groupType === 'classroom' ? 'student' : 'child';
  
  const children = await prisma.user.findMany({
    where: {
      groupId,
      role: childRole,
    },
    select: {
      id: true,
      name: true,
      age: true,
      avatar: true,
      theme: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return children;
}

/**
 * Mettre à jour un groupe
 */
export async function updateGroup(groupId, updates) {
  const group = await prisma.group.update({
    where: { id: groupId },
    data: updates,
  });

  return group;
}

/**
 * Supprimer un groupe
 */
export async function deleteGroup(groupId) {
  await prisma.group.delete({
    where: { id: groupId },
  });

  return { message: 'Groupe supprimé avec succès' };
}

/**
 * Générer un nouveau code pour un groupe
 */
export async function regenerateGroupCode(groupId) {
  const newCode = await generateUniqueGroupCode(prisma);
  
  const group = await prisma.group.update({
    where: { id: groupId },
    data: { code: newCode },
  });

  return group;
}

/**
 * Vérifier si un code de groupe est disponible
 */
export async function isGroupCodeAvailable(code) {
  const existingGroup = await prisma.group.findUnique({
    where: { code },
  });
  
  return !existingGroup;
}

/**
 * Récupérer les statistiques dashboard pour un groupe (parent/enseignant)
 */
export async function getGroupDashboardStats(groupId) {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  
  const [activeChildren, tasksTotal, tasksCompleted, readingTotal, readingInProgress, pointsDistributed] = await Promise.all([
    // Enfants du groupe (tous, pas seulement ceux connectés récemment)
    prisma.user.count({
      where: { 
        groupId, 
        role: { in: ['child', 'student'] }
      }
    }),
    // Total de tâches assignées
    prisma.taskAssignment.count({
      where: { child: { groupId } }
    }),
    // Tâches complétées (soumissions validées)
    prisma.daySubmission.count({
      where: { 
        child: { groupId },
        validatedAt: { not: null }
      }
    }),
    // Total de lectures assignées
    prisma.readingAssignment.count({
      where: { child: { groupId } }
    }),
    // Lectures en cours (avec progression mais pas terminées)
    prisma.readingAssignment.count({
      where: { 
        child: { groupId },
        progress: { 
          isFinished: false,
          currentPage: { gt: 0 }
        }
      }
    }),
    // Points distribués (optimisé avec le champ totalPointsEarned)
    prisma.user.aggregate({
      where: { 
        groupId,
        role: { in: ['child', 'student'] }
      },
      _sum: { totalPointsEarned: true }
    })
  ]);

  return {
    activeChildren,
    tasksStats: {
      total: tasksTotal,
      completed: tasksCompleted,
      completionRate: tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0
    },
    readingStats: {
      total: readingTotal,
      inProgress: readingInProgress,
      completed: readingTotal - readingInProgress
    },
    pointsDistributed: pointsDistributed._sum.totalPointsEarned || 0
  };
}

/**
 * Récupérer les notifications pour un groupe
 */
export async function getGroupNotifications(groupId, limit = 10) {
  const oneDayAgo = new Date(Date.now() - 86400000); // 24 heures
  
  const [newSubmissions, finishedBooks, pendingEvaluations] = await Promise.all([
    // Nouvelles soumissions en attente
    prisma.daySubmission.findMany({
      where: { 
        child: { groupId },
        validatedAt: null
      },
      include: { 
        child: { select: { id: true, name: true } }
      },
      orderBy: { submittedAt: 'desc' },
      take: limit
    }),
    // Livres terminés récemment
    prisma.readingAssignment.findMany({
      where: { 
        child: { groupId },
        progress: { 
          isFinished: true,
          finishedAt: { gte: oneDayAgo }
        }
      },
      include: { 
        child: { select: { id: true, name: true } },
        book: { select: { title: true } }
      },
      orderBy: { progress: { finishedAt: 'desc' } },
      take: limit
    }),
    // Tâches en retard sans soumission
    prisma.taskAssignment.count({
      where: { 
        child: { groupId },
        endDate: { lt: new Date() },
        isActive: true
      }
    })
  ]);

  return {
    newSubmissions: newSubmissions.map(s => ({
      type: 'submission',
      message: `${s.child.name} a soumis une tâche`,
      time: s.submittedAt,
      childId: s.childId,
      submissionId: s.id
    })),
    finishedBooks: finishedBooks.map(b => ({
      type: 'book',
      message: `${b.child.name} a terminé "${b.book.title}"`,
      time: b.progress.finishedAt,
      childId: b.childId,
      bookId: b.bookId
    })),
    pendingCount: pendingEvaluations
  };
}