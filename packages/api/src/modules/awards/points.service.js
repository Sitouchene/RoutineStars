import prisma from '../../config/database.js';

/**
 * Service pour gérer les transactions de points
 */

/**
 * Récupérer l'historique des transactions d'un utilisateur
 */
export async function getUserPointTransactions(userId, limit = 50) {
  return await prisma.pointTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
}

/**
 * Ajouter des points à un utilisateur
 */
export async function addPoints(userId, amount, description, source = null, sourceId = null) {
  if (amount <= 0) {
    throw new Error('Le montant doit être positif');
  }

  // Mettre à jour les points totaux de l'utilisateur
  await prisma.user.update({
    where: { id: userId },
    data: {
      totalPointsEarned: {
        increment: amount
      }
    }
  });

  // Créer la transaction
  return await prisma.pointTransaction.create({
    data: {
      userId,
      amount,
      type: 'earned',
      description,
      source,
      sourceId
    }
  });
}

/**
 * Dépenser des points d'un utilisateur
 */
export async function spendPoints(userId, amount, description, source = null, sourceId = null) {
  if (amount <= 0) {
    throw new Error('Le montant doit être positif');
  }

  // Vérifier si l'utilisateur a assez de points
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalPointsEarned: true }
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  if (user.totalPointsEarned < amount) {
    throw new Error('Points insuffisants');
  }

  // Mettre à jour les points totaux de l'utilisateur
  await prisma.user.update({
    where: { id: userId },
    data: {
      totalPointsEarned: {
        decrement: amount
      }
    }
  });

  // Créer la transaction
  return await prisma.pointTransaction.create({
    data: {
      userId,
      amount: -amount,
      type: 'spent',
      description,
      source,
      sourceId
    }
  });
}

/**
 * Obtenir le solde de points d'un utilisateur
 */
export async function getUserBalance(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalPointsEarned: true }
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  return user.totalPointsEarned;
}

/**
 * Obtenir les statistiques de points d'un utilisateur
 */
export async function getPointStats(userId) {
  const transactions = await prisma.pointTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  const stats = {
    currentBalance: 0,
    totalEarned: 0,
    totalSpent: 0,
    byType: {},
    bySource: {},
    recent: transactions.slice(0, 10) // 10 transactions les plus récentes
  };

  // Calculer les statistiques
  transactions.forEach(transaction => {
    const type = transaction.type;
    const source = transaction.source || 'unknown';
    
    stats.byType[type] = (stats.byType[type] || 0) + 1;
    stats.bySource[source] = (stats.bySource[source] || 0) + 1;

    if (transaction.amount > 0) {
      stats.totalEarned += transaction.amount;
    } else {
      stats.totalSpent += Math.abs(transaction.amount);
    }
  });

  stats.currentBalance = stats.totalEarned - stats.totalSpent;

  return stats;
}

/**
 * Créer une transaction de bonus
 */
export async function addBonusPoints(userId, amount, description) {
  if (amount <= 0) {
    throw new Error('Le montant doit être positif');
  }

  // Mettre à jour les points totaux de l'utilisateur
  await prisma.user.update({
    where: { id: userId },
    data: {
      totalPointsEarned: {
        increment: amount
      }
    }
  });

  // Créer la transaction
  return await prisma.pointTransaction.create({
    data: {
      userId,
      amount,
      type: 'bonus',
      description,
      source: 'bonus'
    }
  });
}

