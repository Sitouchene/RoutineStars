import prisma from '../../config/database.js';

/**
 * Service pour gérer les récompenses
 */

/**
 * Récupérer toutes les récompenses globales disponibles
 */
export async function getAllGlobalRewards() {
  return await prisma.globalReward.findMany({
    where: { isActive: true },
    orderBy: [
      { category: 'asc' },
      { cost: 'asc' }
    ]
  });
}

/**
 * Récupérer les récompenses globales par catégorie
 */
export async function getGlobalRewardsByCategory(category) {
  return await prisma.globalReward.findMany({
    where: { 
      isActive: true,
      category 
    },
    orderBy: { cost: 'asc' }
  });
}

/**
 * Récupérer les récompenses d'un groupe
 */
export async function getGroupRewards(groupId) {
  return await prisma.groupReward.findMany({
    where: { 
      groupId,
      isActive: true,
      isEnabled: true
    },
    include: {
      globalReward: true
    },
    orderBy: [
      { category: 'asc' },
      { cost: 'asc' }
    ]
  });
}

/**
 * Créer une récompense de groupe à partir d'une récompense globale
 */
export async function createGroupRewardFromGlobal(groupId, globalRewardId) {
  const globalReward = await prisma.globalReward.findUnique({
    where: { id: globalRewardId }
  });

  if (!globalReward) {
    throw new Error('Récompense globale non trouvée');
  }

  // Vérifier si cette récompense globale n'est pas déjà importée dans ce groupe
  const existingReward = await prisma.groupReward.findFirst({
    where: {
      groupId,
      globalRewardId
    }
  });

  if (existingReward) {
    throw new Error('Cette récompense est déjà importée dans ce groupe');
  }

  return await prisma.groupReward.create({
    data: {
      groupId,
      globalRewardId,
      name: globalReward.name,
      description: globalReward.description,
      icon: globalReward.icon,
      category: globalReward.category,
      cost: globalReward.cost,
      isActive: true,
      isEnabled: true
    },
    include: {
      globalReward: true
    }
  });
}

/**
 * Créer une récompense personnalisée pour un groupe
 */
export async function createCustomGroupReward(groupId, rewardData) {
  const { name, description, icon, category, cost } = rewardData;

  // Vérifier si une récompense avec ce nom existe déjà dans le groupe
  const existingReward = await prisma.groupReward.findFirst({
    where: {
      groupId,
      name
    }
  });

  if (existingReward) {
    throw new Error('Une récompense avec ce nom existe déjà dans ce groupe');
  }

  return await prisma.groupReward.create({
    data: {
      groupId,
      name,
      description,
      icon,
      category,
      cost,
      isActive: true,
      isEnabled: true
    }
  });
}

/**
 * Mettre à jour une récompense de groupe
 */
export async function updateGroupReward(rewardId, updates) {
  return await prisma.groupReward.update({
    where: { id: rewardId },
    data: updates,
    include: {
      globalReward: true
    }
  });
}

/**
 * Activer/désactiver une récompense de groupe
 */
export async function toggleGroupReward(rewardId, isEnabled) {
  return await prisma.groupReward.update({
    where: { id: rewardId },
    data: { isEnabled },
    include: {
      globalReward: true
    }
  });
}

/**
 * Récupérer les échanges d'un utilisateur
 */
export async function getUserRedemptions(userId) {
  return await prisma.rewardRedemption.findMany({
    where: { userId },
    include: {
      reward: {
        include: {
          globalReward: true
        }
      }
    },
    orderBy: { redeemedAt: 'desc' }
  });
}

/**
 * Échanger des points contre une récompense
 */
export async function redeemReward(userId, rewardId, childComment) {
  // Vérifier si la récompense existe et est activée
  const reward = await prisma.groupReward.findFirst({
    where: {
      id: rewardId,
      isActive: true,
      isEnabled: true
    }
  });

  if (!reward) {
    throw new Error('Récompense non trouvée ou désactivée');
  }

  // Vérifier si l'utilisateur a assez de points
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || (user.totalPointsEarned || 0) < reward.cost) {
    throw new Error('Points insuffisants');
  }

  // Créer l'échange
  const redemption = await prisma.rewardRedemption.create({
    data: {
      userId,
      rewardId,
      childComment,
      status: 'pending'
    },
    include: {
      reward: {
        include: {
          globalReward: true
        }
      }
    }
  });

  return redemption;
}

/**
 * Obtenir les statistiques de récompenses d'un utilisateur
 */
export async function getRewardStats(userId) {
  const redemptions = await prisma.rewardRedemption.findMany({
    where: { userId },
    include: {
      reward: true
    }
  });

  const stats = {
    totalRedemptions: redemptions.length,
    pendingRedemptions: redemptions.filter(r => r.status === 'pending').length,
    approvedRedemptions: redemptions.filter(r => r.status === 'approved').length,
    deniedRedemptions: redemptions.filter(r => r.status === 'denied').length,
    totalPointsSpent: redemptions
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + r.reward.cost, 0)
  };

  return stats;
}

/**
 * Récupérer les échanges en attente pour un groupe
 */
export async function getPendingRedemptions(groupId) {
  return await prisma.rewardRedemption.findMany({
    where: {
      status: 'pending',
      reward: {
        groupId
      }
    },
    include: {
      user: true,
      reward: {
        include: {
          globalReward: true
        }
      }
    },
    orderBy: { redeemedAt: 'desc' }
  });
}

/**
 * Mettre à jour le statut d'un échange
 */
export async function updateRedemptionStatus(redemptionId, status, parentComment) {
  return await prisma.rewardRedemption.update({
    where: { id: redemptionId },
    data: {
      status,
      parentComment
    },
    include: {
      user: true,
      reward: {
        include: {
          globalReward: true
        }
      }
    }
  });
}