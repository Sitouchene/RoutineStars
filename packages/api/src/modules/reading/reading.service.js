import prisma from '../../config/database.js';
import { calculatePointsByMilestone, calculatePagesUntilNextMilestone } from './reading.utils.js';
import { updateChildPoints } from '../children/children.service.js';
import { checkAndUnlockBadges } from '../awards/badges.service.js';

/**
 * Assigner une lecture à un ou plusieurs enfants
 */
export async function assignReading(data) {
  const { bookId, childIds, assignedById, assignmentType, totalPoints, startDate, dueDate } = data;
  
  // Vérifier que le livre existe
  const book = await prisma.book.findUnique({
    where: { id: bookId }
  });
  
  if (!book) {
    throw new Error('Livre non trouvé');
  }
  
  // Si childIds est un array, créer une assignation pour chaque enfant
  const upsertOne = async (childIdParam) => {
    // Chercher les assignations existantes pour ce couple (book, child)
    const existing = await prisma.readingAssignment.findMany({
      where: { bookId, childId: childIdParam },
      orderBy: { createdAt: 'desc' },
    });

    let assignment;
    if (existing.length > 0) {
      // Garder la plus récente et mettre à jour ses champs
      const latest = existing[0];
      // Supprimer d'éventuels doublons plus anciens
      if (existing.length > 1) {
        const toDelete = existing.slice(1).map((a) => a.id);
        await prisma.readingAssignment.deleteMany({ where: { id: { in: toDelete } } });
      }

      assignment = await prisma.readingAssignment.update({
        where: { id: latest.id },
        data: {
          assignedById: assignedById || null,
          assignmentType,
          totalPoints: totalPoints || 0,
          startDate: startDate ? new Date(startDate) : null,
          dueDate: dueDate ? new Date(dueDate) : null,
        },
        include: {
          book: true,
          child: { select: { id: true, name: true, avatar: true } },
          assignedBy: { select: { id: true, name: true } },
          progress: true,
        },
      });

      // Réinitialiser la progression
      const progress = await prisma.readingProgress.findFirst({ where: { readingAssignmentId: assignment.id } });
      if (progress) {
        await prisma.readingProgress.update({
          where: { id: progress.id },
          data: {
            currentPage: 0,
            currentPoints: 0,
            lastMilestone: 0,
            isFinished: false,
            finishedAt: null,
            lastPageUpdate: new Date(),
          },
        });
      } else {
        await prisma.readingProgress.create({
          data: {
            readingAssignmentId: assignment.id,
            currentPage: 0,
            currentPoints: 0,
            lastMilestone: 0,
            isFinished: false,
            lastPageUpdate: new Date(),
          },
        });
      }
    } else {
      // Créer nouvelle assignation
      assignment = await prisma.readingAssignment.create({
        data: {
          bookId,
          childId: childIdParam,
          assignedById: assignedById || null,
          assignmentType,
          totalPoints: totalPoints || 0,
          startDate: startDate ? new Date(startDate) : null,
          dueDate: dueDate ? new Date(dueDate) : null,
        },
        include: {
          book: true,
          child: { select: { id: true, name: true, avatar: true } },
          assignedBy: { select: { id: true, name: true } },
        },
      });

      await prisma.readingProgress.create({
        data: {
          readingAssignmentId: assignment.id,
          currentPage: 0,
          currentPoints: 0,
          lastMilestone: 0,
          isFinished: false,
          lastPageUpdate: new Date(),
        },
      });
    }

    return assignment;
  };

  if (Array.isArray(childIds)) {
    const results = [];
    for (const childId of childIds) {
      // Upsert par enfant
      const res = await upsertOne(childId);
      results.push(res);
    }
    return results;
  }
  
  // Sinon, créer une assignation simple (rétrocompatibilité)
  // Cas rétrocompatibilité: single id
  return await upsertOne(childIds);
}

/**
 * Obtenir les lectures d'un enfant
 */
export async function getChildReadings(childId, filters = {}) {
  const where = { childId };
  
  // Filtres
  if (filters.assignmentType) {
    where.assignmentType = filters.assignmentType;
  }
  
  if (filters.isFinished !== undefined) {
    where.progress = {
      isFinished: filters.isFinished === 'true' || filters.isFinished === true
    };
  }
  
  return await prisma.readingAssignment.findMany({
    where,
    include: {
      book: true,
      child: {
        select: {
          id: true,
          name: true
        }
      },
      assignedBy: {
        select: {
          id: true,
          name: true
        }
      },
      progress: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

/**
 * Mettre à jour la progression de lecture
 * Calcule automatiquement les points selon les paliers
 */
export async function updateProgress(assignmentId, currentPage) {
  const assignment = await prisma.readingAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      book: true,
      progress: true
    }
  });
  
  if (!assignment) {
    throw new Error('Assignation de lecture non trouvée');
  }
  
  // Calculer les points selon les paliers
  const { milestone, currentPoints } = calculatePointsByMilestone(
    currentPage,
    assignment.book.totalPages,
    assignment.totalPoints
  );
  
  // Vérifier si le livre est terminé
  const isFinished = currentPage >= assignment.book.totalPages;
  
  // Mettre à jour ou créer la progression
  const progress = await prisma.readingProgress.upsert({
    where: {
      readingAssignmentId: assignmentId
    },
    update: {
      currentPage,
      currentPoints,
      lastMilestone: milestone,
      isFinished,
      finishedAt: isFinished ? new Date() : null,
      lastPageUpdate: new Date()
    },
    create: {
      readingAssignmentId: assignmentId,
      currentPage,
      currentPoints,
      lastMilestone: milestone,
      isFinished,
      finishedAt: isFinished ? new Date() : null
    }
  });

  // Calculer la différence de points pour mettre à jour le total de l'enfant
  const previousPoints = assignment.progress?.currentPoints || 0;
  const pointsDifference = currentPoints - previousPoints;
  
  if (pointsDifference > 0) {
    await updateChildPoints(assignment.childId, pointsDifference);
    
    // Vérifier et débloquer automatiquement les badges
    try {
      await checkAndUnlockBadges(assignment.childId);
    } catch (error) {
      console.error('Erreur lors de la vérification des badges:', error);
      // Ne pas faire échouer la mise à jour si la vérification des badges échoue
    }
  }

  return {
    ...progress,
    assignment,
    pagesRemaining: assignment.book.totalPages - currentPage,
    pagesUntilNextMilestone: calculatePagesUntilNextMilestone(
      currentPage,
      assignment.book.totalPages,
      milestone
    )
  };
}

/**
 * Marquer une lecture comme terminée
 */
export async function finishReading(assignmentId) {
  const assignment = await prisma.readingAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      book: true,
      progress: true
    }
  });
  
  if (!assignment) {
    throw new Error('Assignation de lecture non trouvée');
  }
  
  // Mettre la page courante au total et marquer comme terminé
  return await updateProgress(assignmentId, assignment.book.totalPages);
}

/**
 * Obtenir les statistiques de lecture d'un enfant
 */
export async function getReadingStats(childId) {
  const assignments = await prisma.readingAssignment.findMany({
    where: { childId },
    include: {
      book: true,
      progress: true
    }
  });
  
  const finishedCount = assignments.filter(a => a.progress?.isFinished).length;
  const inProgressCount = assignments.filter(a => !a.progress?.isFinished && a.progress?.currentPage > 0).length;
  const notStartedCount = assignments.filter(a => !a.progress || a.progress?.currentPage === 0).length;
  
  const totalPointsEarned = assignments.reduce((sum, a) => sum + (a.progress?.currentPoints || 0), 0);
  const totalPossiblePoints = assignments.reduce((sum, a) => sum + a.totalPoints, 0);
  
  // Livre en cours avec le plus de progression
  const currentBook = assignments
    .filter(a => !a.progress?.isFinished && a.progress?.currentPage > 0)
    .sort((a, b) => (b.progress?.currentPage || 0) - (a.progress?.currentPage || 0))[0];
  
  return {
    totalAssignments: assignments.length,
    finishedCount,
    inProgressCount,
    notStartedCount,
    totalPointsEarned,
    totalPossiblePoints,
    currentBook: currentBook ? {
      ...currentBook,
      percentage: Math.round((currentBook.progress.currentPage / currentBook.book.totalPages) * 100)
    } : null
  };
}

/**
 * Obtenir une assignation de lecture spécifique
 */
export async function getReadingAssignment(assignmentId) {
  return await prisma.readingAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      book: true,
      child: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      assignedBy: {
        select: {
          id: true,
          name: true
        }
      },
      progress: true
    }
  });
}

