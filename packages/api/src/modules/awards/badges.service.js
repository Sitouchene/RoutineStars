import prisma from '../../config/database.js';

/**
 * Service pour gérer les badges
 */

/**
 * Récupérer tous les badges globaux disponibles
 */
export async function getAllGlobalBadges() {
  return await prisma.globalBadge.findMany({
    where: { isActive: true },
    orderBy: [
      { category: 'asc' },
      { pointsRequired: 'asc' }
    ]
  });
}

/**
 * Récupérer les badges d'un groupe
 */
export async function getGroupBadges(groupId) {
  return await prisma.groupBadge.findMany({
    where: { 
      groupId,
      isActive: true,
      isEnabled: true
    },
    include: {
      globalBadge: true
    },
    orderBy: [
      { category: 'asc' },
      { pointsRequired: 'asc' }
    ]
  });
}

/**
 * Récupérer les badges d'un utilisateur
 */
export async function getUserBadges(userId) {
  return await prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: {
        include: {
          globalBadge: true
        }
      }
    },
    orderBy: { earnedAt: 'desc' }
  });
}

/**
 * Vérifier et débloquer automatiquement les badges basés sur les critères
 */
export async function checkAndUnlockBadges(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      totalPointsEarned: true,
      groupId: true
    }
  });

  if (!user || !user.groupId) return [];

  // Trouver les badges du groupe de l'utilisateur
  const groupBadges = await prisma.groupBadge.findMany({
    where: {
      groupId: user.groupId,
      isActive: true,
      isEnabled: true,
      unlockType: { in: ['automatic', 'hybrid'] }
    }
  });

  const unlockedBadges = [];

  for (const badge of groupBadges) {
    // Vérifier si l'utilisateur a déjà ce badge
    const existingUserBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id
        }
      }
    });

    if (existingUserBadge) continue;

    // Vérifier les critères automatiques
    let shouldUnlock = false;
    
    if (badge.unlockType === 'automatic' || badge.unlockType === 'hybrid') {
      if (badge.autoCriteria) {
        shouldUnlock = await checkAutoCriteria(userId, badge.autoCriteria);
      } else {
        // Critères par défaut basés sur les points
        shouldUnlock = user.totalPointsEarned >= badge.pointsRequired;
      }
    }

    if (shouldUnlock) {
      // Débloquer le badge
      const userBadge = await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id
        },
        include: {
          badge: {
            include: {
              globalBadge: true
            }
          }
        }
      });

      unlockedBadges.push(userBadge);

      // Créer une transaction de points pour le badge
      await prisma.pointTransaction.create({
        data: {
          userId,
          amount: 0, // Les badges ne donnent pas de points supplémentaires
          type: 'badge_unlock',
          description: `Badge débloqué: ${badge.name}`,
          source: 'badge',
          sourceId: badge.id
        }
      });
    }
  }

  return unlockedBadges;
}

/**
 * Vérifier les critères automatiques d'un badge
 */
async function checkAutoCriteria(userId, criteria) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalPointsEarned: true }
  });

  if (!user) return false;

  // Vérifier les points
  if (criteria.points && user.totalPointsEarned < criteria.points) {
    return false;
  }

  // Vérifier les tâches terminées
  if (criteria.tasks) {
    const completedTasks = await prisma.task.count({
      where: {
        userId,
        status: 'completed'
      }
    });
    if (completedTasks < criteria.tasks) return false;
  }

  // Vérifier les livres lus
  if (criteria.books) {
    const booksRead = await prisma.readingProgress.count({
      where: {
        readingAssignment: {
          childId: userId
        },
        isFinished: true
      }
    });
    if (booksRead < criteria.books) return false;
  }

  // Vérifier les pages lues
  if (criteria.pages) {
    const totalPages = await prisma.readingProgress.aggregate({
      where: {
        readingAssignment: {
          childId: userId
        }
      },
      _sum: {
        currentPage: true
      }
    });
    if ((totalPages._sum.currentPage || 0) < criteria.pages) return false;
  }

  // Vérifier la série de jours
  if (criteria.streak) {
    const streak = await calculateStreak(userId);
    if (streak < criteria.streak) return false;
  }

  return true;
}

/**
 * Calculer la série de jours consécutifs
 */
async function calculateStreak(userId) {
  const submissions = await prisma.daySubmission.findMany({
    where: {
      childId: userId,
      validatedAt: { not: null }
    },
    orderBy: { date: 'desc' },
    select: { date: true }
  });

  if (submissions.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const submission of submissions) {
    const submissionDate = new Date(submission.date);
    submissionDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate - submissionDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Créer un badge de groupe à partir d'un badge global
 */
export async function createGroupBadgeFromGlobal(groupId, globalBadgeId) {
  const globalBadge = await prisma.globalBadge.findUnique({
    where: { id: globalBadgeId }
  });

  if (!globalBadge) {
    throw new Error('Badge global non trouvé');
  }

  return await prisma.groupBadge.create({
    data: {
      groupId,
      globalBadgeId,
      name: globalBadge.name,
      description: globalBadge.description,
      icon: globalBadge.icon,
      category: globalBadge.category,
      rarity: globalBadge.rarity,
      pointsRequired: globalBadge.pointsRequired,
      unlockType: 'automatic',
      autoCriteria: { points: globalBadge.pointsRequired }
    }
  });
}

/**
 * Créer un badge personnalisé pour un groupe
 */
export async function createCustomGroupBadge(groupId, badgeData) {
  return await prisma.groupBadge.create({
    data: {
      groupId,
      name: badgeData.name,
      description: badgeData.description,
      icon: badgeData.icon,
      category: badgeData.category,
      rarity: badgeData.rarity,
      pointsRequired: badgeData.pointsRequired,
      unlockType: badgeData.unlockType || 'automatic',
      autoCriteria: badgeData.autoCriteria,
      isSpecial: badgeData.isSpecial || false,
      specialReason: badgeData.specialReason
    }
  });
}

/**
 * Mettre à jour un badge de groupe
 */
export async function updateGroupBadge(badgeId, updates) {
  return await prisma.groupBadge.update({
    where: { id: badgeId },
    data: updates
  });
}

/**
 * Activer/désactiver un badge de groupe
 */
export async function toggleGroupBadge(badgeId, isEnabled) {
  return await prisma.groupBadge.update({
    where: { id: badgeId },
    data: { isEnabled }
  });
}

/**
 * Débloquer manuellement un badge pour un utilisateur
 */
export async function unlockBadgeManually(userId, badgeId, parentId) {
  // Vérifier si le badge existe et est dans le bon groupe
  const badge = await prisma.groupBadge.findFirst({
    where: { 
      id: badgeId,
      group: {
        users: {
          some: { id: userId }
        }
      }
    }
  });

  if (!badge) {
    throw new Error('Badge non trouvé ou non accessible');
  }

  // Vérifier si l'utilisateur a déjà ce badge
  const existingUserBadge = await prisma.userBadge.findUnique({
    where: {
      userId_badgeId: {
        userId,
        badgeId
      }
    }
  });

  if (existingUserBadge) {
    throw new Error('Badge déjà débloqué');
  }

  // Débloquer le badge
  const userBadge = await prisma.userBadge.create({
    data: {
      userId,
      badgeId
    },
    include: {
      badge: {
        include: {
          globalBadge: true
        }
      }
    }
  });

  // Créer une transaction de points pour le badge
  await prisma.pointTransaction.create({
    data: {
      userId,
      amount: 0,
      type: 'badge_unlock',
      description: `Badge débloqué manuellement: ${badge.name}`,
      source: 'badge',
      sourceId: badge.id
    }
  });

  return userBadge;
}

/**
 * Obtenir les statistiques de badges d'un utilisateur
 */
export async function getBadgeStats(userId) {
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: true
    }
  });

  const stats = {
    total: userBadges.length,
    byCategory: {},
    byRarity: {},
    recent: userBadges.slice(0, 5) // 5 badges les plus récents
  };

  // Compter par catégorie
  userBadges.forEach(userBadge => {
    const category = userBadge.badge.category;
    const rarity = userBadge.badge.rarity;
    
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    stats.byRarity[rarity] = (stats.byRarity[rarity] || 0) + 1;
  });

  return stats;
}
